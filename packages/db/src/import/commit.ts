/**
 * ADIM 6–8: USER CONFIRM → COMMIT → RESOLVE
 *
 * Yalnızca VALID ve WARNING satırlar uygulanır. ERROR ve SKIPPED satırlar
 * atlanır — bu, "10.000 satırın 150'si hatalıysa 9.850'si yine de girsin"
 * kuralının teknik karşılığıdır.
 *
 * Uygulama TEK TRANSACTION içinde yapılır: beklenmedik bir veritabanı hatası
 * olursa hiçbir şey yazılmaz ve job FAILED olur. Satır bazlı hatalar zaten
 * doğrulama aşamasında elenmiştir.
 *
 * Yazılan/güncellenen HER kayıt `import_change` defterine düşer — geri alma
 * bu defterden yapılır.
 */
import { sql, type Kysely, type Transaction } from 'kysely'
import type { Database, ImportSheet } from '../types'
import { normalizeCode, slugify } from '../normalize'
import { resolveCompatibility, rebuildEngineCategoryIndex } from '../resolve'
import { normalizeName } from './coerce'

export type CommitResult = {
  applied: number
  skipped: number
  changes: number
  created: Record<string, number>
  updated: Record<string, number>
  resolution: { resolved: number; conflicts: number; removed: number }
  seoPages: number
}

type Ledger = Array<{
  entity_type: string
  entity_id: number
  operation: 'INSERT' | 'UPDATE'
  before: unknown
  after: unknown
}>

type StagedRow = {
  id: number
  sheet: ImportSheet
  row_no: number
  normalized: Record<string, unknown>
}

const SHEET_ORDER: ImportSheet[] = [
  'CATEGORY',
  'VEHICLE',
  'PRODUCT',
  'PRICE_STOCK',
  'REFERENCE',
  'COMPATIBILITY',
]

export async function commitImport(
  db: Kysely<Database>,
  jobId: number,
): Promise<CommitResult> {
  const job = await db
    .selectFrom('import_job')
    .selectAll()
    .where('id', '=', jobId)
    .executeTakeFirst()
  if (!job) throw new Error(`Import #${jobId} bulunamadı`)
  if (job.status !== 'VALIDATED') {
    throw new Error(
      `Import #${jobId} durumu "${job.status}". Yalnızca doğrulanmış (VALIDATED) bir import uygulanabilir.`,
    )
  }

  await db.updateTable('import_job').set({ status: 'COMMITTING' }).where('id', '=', jobId).execute()

  const created: Record<string, number> = {}
  const updated: Record<string, number> = {}
  let applied = 0
  let ledgerCount = 0

  try {
    await db.transaction().execute(async (trx) => {
      const ledger: Ledger = []
      const ctx: Ctx = {
        trx,
        ledger,
        jobId,
        sourceId: job.source_id,
        engineKeyToId: new Map(),
        productSkuToId: new Map(),
        categoryCodeToId: new Map(),
        created,
        updated,
      }

      for (const sheet of SHEET_ORDER) {
        const rows = await trx
          .selectFrom('import_staging_row')
          .select(['id', 'sheet', 'row_no', 'normalized'])
          .where('import_job_id', '=', jobId)
          .where('sheet', '=', sheet)
          .where('status', 'in', ['VALID', 'WARNING'])
          .orderBy('row_no')
          .execute()

        for (const r of rows) {
          if (!r.normalized) continue
          const staged: StagedRow = {
            id: r.id,
            sheet: r.sheet,
            row_no: r.row_no,
            normalized: r.normalized as Record<string, unknown>,
          }
          await APPLIERS[sheet](ctx, staged)
          applied++
        }

        if (rows.length) {
          await trx
            .updateTable('import_staging_row')
            .set({ status: 'APPLIED' })
            .where('import_job_id', '=', jobId)
            .where('sheet', '=', sheet)
            .where('status', 'in', ['VALID', 'WARNING'])
            .execute()
        }
      }

      if (ledger.length) {
        // Defter parçalar halinde yazılır (tek sorguda binlerce satır parametre sınırını zorlar)
        for (let i = 0; i < ledger.length; i += 500) {
          await trx
            .insertInto('import_change')
            .values(
              ledger.slice(i, i + 500).map((c) => ({
                import_job_id: jobId,
                entity_type: c.entity_type,
                entity_id: c.entity_id,
                operation: c.operation,
                before: c.before === undefined || c.before === null ? null : jsonb(c.before),
                after: c.after === undefined || c.after === null ? null : jsonb(c.after),
              })),
            )
            .execute()
        }
      }
      ledgerCount = ledger.length
    })
  } catch (err) {
    await db
      .updateTable('import_job')
      .set({ status: 'FAILED', error_message: (err as Error).message })
      .where('id', '=', jobId)
      .execute()
    throw err
  }

  // ── ÇÖZÜMLEME — mimari değişmedi, mevcut motor aynen çağrılıyor ──────────
  const resolution = await resolveCompatibility(db)
  const seoPages = await rebuildEngineCategoryIndex(db)

  const skippedRow = await db
    .selectFrom('import_staging_row')
    .select(({ fn }) => fn.countAll<string>().as('n'))
    .where('import_job_id', '=', jobId)
    .where('status', 'in', ['ERROR', 'SKIPPED'])
    .executeTakeFirst()

  await db
    .updateTable('import_job')
    .set({ status: 'COMPLETED', committed_at: new Date() })
    .where('id', '=', jobId)
    .execute()

  return {
    applied,
    skipped: Number(skippedRow?.n ?? 0),
    changes: ledgerCount,
    created,
    updated,
    resolution,
    seoPages,
  }
}

// ═══════════════════════════════ UYGULAYICILAR ══════════════════════════════

type Ctx = {
  trx: Transaction<Database>
  ledger: Ledger
  jobId: number
  sourceId: number
  engineKeyToId: Map<string, number>
  productSkuToId: Map<string, number>
  categoryCodeToId: Map<string, number>
  created: Record<string, number>
  updated: Record<string, number>
}

function note(ctx: Ctx, entity: string, op: 'INSERT' | 'UPDATE'): void {
  const bucket = op === 'INSERT' ? ctx.created : ctx.updated
  bucket[entity] = (bucket[entity] ?? 0) + 1
}

function record(
  ctx: Ctx,
  entityType: string,
  entityId: number,
  operation: 'INSERT' | 'UPDATE',
  before: unknown,
  after: unknown,
): void {
  ctx.ledger.push({ entity_type: entityType, entity_id: entityId, operation, before, after })
  note(ctx, entityType, operation)
}

const str = (v: unknown): string | null => (v === null || v === undefined || v === '' ? null : String(v))
const num = (v: unknown): number | null => (v === null || v === undefined || v === '' ? null : Number(v))

/**
 * Kysely'nin bu sürümünde `ColumnType<...>` ile tanımlı kolonlar (TIMESTAMPTZ,
 * NUMERIC, JSONB) update/insert nesnesinde ham tipi bekliyor. Değerler zaten
 * doğrulama aşamasında tip kontrolünden geçtiği için burada dar bir kaçış
 * kullanılıyor; SQL üretimi değişmiyor.
 */
const col = <T,>(v: T): never => v as never
/** jsonb kolonlar için: node-pg dizileri ARRAY'e çevirdiğinden açıkça JSON metni yazılır. */
const jsonb = (v: unknown): never => JSON.stringify(v ?? null) as never
const NOW = (): never => new Date() as never

// ── KATEGORİ ────────────────────────────────────────────────────────────────

async function applyCategory(ctx: Ctx, row: StagedRow): Promise<void> {
  const n = row.normalized
  const code = String(n.kategori_kodu)
  const parentCode = str(n.ust_kategori_kodu)
  const name = String(n.ad)
  const slug = str(n.slug) ?? slugify(name)

  let parentId: number | null = null
  let parentPath = ''
  let depth = 0
  if (parentCode) {
    const parent =
      ctx.categoryCodeToId.get(parentCode) ??
      (await ctx.trx.selectFrom('category').select('id').where('code', '=', parentCode).executeTakeFirst())
        ?.id
    if (parent) {
      parentId = parent
      const p = await ctx.trx
        .selectFrom('category')
        .select(['path', 'depth'])
        .where('id', '=', parent)
        .executeTakeFirst()
      parentPath = p?.path ?? ''
      depth = (p?.depth ?? 0) + 1
    }
  }
  const path = parentPath ? `${parentPath}.${slug}` : slug

  const existing = await ctx.trx
    .selectFrom('category')
    .selectAll()
    .where('code', '=', code)
    .executeTakeFirst()

  const payload = {
    parent_id: parentId,
    code,
    name,
    slug,
    path,
    depth,
    sort_order: num(n.sira) ?? 0,
    description: str(n.aciklama),
    seo_title: str(n.seo_baslik),
    seo_description: str(n.seo_aciklama),
    seo_intro: str(n.seo_giris_metni),
  }

  let id: number
  if (existing) {
    id = existing.id
    await ctx.trx.updateTable('category').set(payload).where('id', '=', id).execute()
    record(ctx, 'category', id, 'UPDATE', pick(existing, Object.keys(payload)), payload)
  } else {
    const ins = await ctx.trx.insertInto('category').values(payload).returning('id').executeTakeFirstOrThrow()
    id = ins.id
    record(ctx, 'category', id, 'INSERT', null, payload)
  }
  ctx.categoryCodeToId.set(code, id)

  const attrs = (n.attributes ?? []) as Array<{ key: string; label: string; type: string; unit: string | null }>
  const TYPE_MAP: Record<string, 'NUMBER' | 'TEXT' | 'ENUM' | 'BOOL'> = {
    SAYI: 'NUMBER',
    METIN: 'TEXT',
    SECENEK: 'ENUM',
    EVET_HAYIR: 'BOOL',
  }
  for (const [i, a] of attrs.entries()) {
    const existingAttr = await ctx.trx
      .selectFrom('category_attribute')
      .selectAll()
      .where('category_id', '=', id)
      .where('key', '=', a.key)
      .executeTakeFirst()
    const attrPayload = {
      category_id: id,
      key: a.key,
      label: a.label,
      data_type: TYPE_MAP[a.type] ?? 'TEXT',
      unit: a.unit,
      is_facet: true,
      sort_order: i + 1,
    }
    if (existingAttr) {
      await ctx.trx
        .updateTable('category_attribute')
        .set(attrPayload)
        .where('id', '=', existingAttr.id)
        .execute()
      record(ctx, 'category_attribute', existingAttr.id, 'UPDATE', pick(existingAttr, Object.keys(attrPayload)), attrPayload)
    } else {
      const insAttr = await ctx.trx
        .insertInto('category_attribute')
        .values(attrPayload)
        .returning('id')
        .executeTakeFirstOrThrow()
      record(ctx, 'category_attribute', insAttr.id, 'INSERT', null, attrPayload)
    }
  }
}

// ── ARAÇ AĞACI ──────────────────────────────────────────────────────────────

async function applyVehicle(ctx: Ctx, row: StagedRow): Promise<void> {
  const n = row.normalized
  const typeSlug = String(n.typeSlug)
  const brandName = String(n.arac_markasi)
  const modelName = String(n.model)
  const engineName = String(n.motor_adi)
  const codes = (n.codes ?? []) as string[]

  const type = await ctx.trx
    .selectFrom('vehicle_type')
    .select('id')
    .where('slug', '=', typeSlug)
    .executeTakeFirstOrThrow()

  // Marka
  const brandSlug = str(n.marka_slug) ?? slugify(brandName)
  let brand = await ctx.trx
    .selectFrom('vehicle_brand')
    .selectAll()
    .where(sql<boolean>`lower(name) = lower(${brandName})`)
    .executeTakeFirst()
  if (!brand) {
    const ins = await ctx.trx
      .insertInto('vehicle_brand')
      .values({ name: brandName, slug: brandSlug })
      .returningAll()
      .executeTakeFirstOrThrow()
    brand = ins
    record(ctx, 'vehicle_brand', brand.id, 'INSERT', null, { name: brandName, slug: brandSlug })
  }
  await ctx.trx
    .insertInto('vehicle_brand_type')
    .values({ brand_id: brand.id, type_id: type.id })
    .onConflict((oc) => oc.doNothing())
    .execute()

  // Model
  const modelSlug = slugify(modelName)
  let model = await ctx.trx
    .selectFrom('vehicle_model')
    .selectAll()
    .where('brand_id', '=', brand.id)
    .where('slug', '=', modelSlug)
    .executeTakeFirst()
  const modelPayload = {
    brand_id: brand.id,
    name: modelName,
    slug: modelSlug,
    code: str(n.model_kodu),
    year_from: num(n.model_yil_baslangic),
    year_to: num(n.model_yil_bitis),
    body_type: str(n.kasa_tipi),
  }
  if (model) {
    await ctx.trx.updateTable('vehicle_model').set(modelPayload).where('id', '=', model.id).execute()
    record(ctx, 'vehicle_model', model.id, 'UPDATE', pick(model, Object.keys(modelPayload)), modelPayload)
  } else {
    model = await ctx.trx.insertInto('vehicle_model').values(modelPayload).returningAll().executeTakeFirstOrThrow()
    record(ctx, 'vehicle_model', model.id, 'INSERT', null, modelPayload)
  }

  // Nesil
  const genName = str(n.nesil) ?? modelName
  let generation = await ctx.trx
    .selectFrom('vehicle_generation')
    .selectAll()
    .where('model_id', '=', model.id)
    .where('name', '=', genName)
    .executeTakeFirst()
  if (!generation) {
    const genPayload = {
      model_id: model.id,
      name: genName,
      code: str(n.nesil_kodu),
      year_from: num(n.model_yil_baslangic),
      year_to: num(n.model_yil_bitis),
    }
    generation = await ctx.trx
      .insertInto('vehicle_generation')
      .values(genPayload)
      .returningAll()
      .executeTakeFirstOrThrow()
    record(ctx, 'vehicle_generation', generation.id, 'INSERT', null, genPayload)
  }

  // Motor
  const engineSlug = slugify(engineName)
  const enginePayload = {
    generation_id: generation.id,
    model_id: model.id,
    name: engineName,
    slug: engineSlug,
    engine_codes: codes,
    displacement_cc: num(n.hacim_cc),
    power_kw: num(n.guc_kw),
    power_hp: num(n.guc_hp),
    fuel_type: col(String(n.yakit)),
    cylinders: num(n.silindir),
    valves: num(n.supap),
    year_from: num(n.motor_yil_baslangic),
    year_to: num(n.motor_yil_bitis),
  }
  const existingEngine = await ctx.trx
    .selectFrom('vehicle_engine')
    .selectAll()
    .where('generation_id', '=', generation.id)
    .where('slug', '=', engineSlug)
    .executeTakeFirst()

  let engineId: number
  if (existingEngine) {
    engineId = existingEngine.id
    await ctx.trx.updateTable('vehicle_engine').set(enginePayload).where('id', '=', engineId).execute()
    record(ctx, 'vehicle_engine', engineId, 'UPDATE', pick(existingEngine, Object.keys(enginePayload)), enginePayload)
  } else {
    const ins = await ctx.trx
      .insertInto('vehicle_engine')
      .values(enginePayload)
      .returning('id')
      .executeTakeFirstOrThrow()
    engineId = ins.id
    record(ctx, 'vehicle_engine', engineId, 'INSERT', null, enginePayload)
  }

  ctx.engineKeyToId.set(String(n.engineKey), engineId)
}

// ── ÜRÜN ────────────────────────────────────────────────────────────────────

async function applyProduct(ctx: Ctx, row: StagedRow): Promise<void> {
  const n = row.normalized
  const sku = String(n.sku)
  const brandName = String(n.marka)
  const categoryCode = String(n.kategori_kodu)

  let brand = await ctx.trx
    .selectFrom('product_brand')
    .selectAll()
    .where(sql<boolean>`lower(name) = lower(${brandName})`)
    .executeTakeFirst()
  if (!brand) {
    const payload = { name: brandName, slug: slugify(brandName) }
    brand = await ctx.trx.insertInto('product_brand').values(payload).returningAll().executeTakeFirstOrThrow()
    record(ctx, 'product_brand', brand.id, 'INSERT', null, payload)
  }

  const categoryId =
    ctx.categoryCodeToId.get(categoryCode) ??
    (
      await ctx.trx
        .selectFrom('category')
        .select('id')
        .where('code', '=', categoryCode)
        .executeTakeFirstOrThrow()
    ).id

  const STATUS_MAP: Record<string, 'DRAFT' | 'ACTIVE' | 'ARCHIVED'> = {
    TASLAK: 'DRAFT',
    AKTIF: 'ACTIVE',
    ARSIV: 'ARCHIVED',
  }

  const existing = await ctx.trx
    .selectFrom('product')
    .selectAll()
    .where(sql<boolean>`ocm_normalize_code(sku) = ${normalizeCode(sku)}`)
    .executeTakeFirst()

  const specs = { ...(existing?.specs ?? {}), ...((n.specs ?? {}) as Record<string, string>) }

  const payload = {
    sku,
    slug: str(n.slug) ?? slugify(`${brandName} ${str(n.urun_kodu) ?? sku}`),
    name: String(n.urun_adi),
    product_code: str(n.urun_kodu),
    brand_id: brand.id,
    category_id: categoryId,
    short_description: str(n.kisa_aciklama),
    description: str(n.aciklama),
    specs: jsonb(specs),
    status: STATUS_MAP[String(n.durum ?? 'AKTIF')] ?? 'ACTIVE',
    is_featured: n.one_cikan === true,
    seo_title: str(n.seo_baslik),
    seo_description: str(n.seo_aciklama),
    updated_at: NOW(),
  }

  let id: number
  if (existing) {
    id = existing.id
    await ctx.trx.updateTable('product').set(payload).where('id', '=', id).execute()
    record(ctx, 'product', id, 'UPDATE', pick(existing, Object.keys(payload)), payload)
  } else {
    const ins = await ctx.trx.insertInto('product').values(payload).returning('id').executeTakeFirstOrThrow()
    id = ins.id
    record(ctx, 'product', id, 'INSERT', null, payload)

    // Varsayılan varyant — fiyat/stok sayfası gelmese bile ürün gösterilebilir olsun
    const variantPayload = { product_id: id, sku, name: null, is_default: true }
    const v = await ctx.trx
      .insertInto('product_variant')
      .values(variantPayload)
      .returning('id')
      .executeTakeFirstOrThrow()
    record(ctx, 'product_variant', v.id, 'INSERT', null, variantPayload)
  }
  ctx.productSkuToId.set(normalizeCode(sku), id)
}

// ── FİYAT & STOK ────────────────────────────────────────────────────────────

async function applyPriceStock(ctx: Ctx, row: StagedRow): Promise<void> {
  const n = row.normalized
  const productId = await resolveProductId(ctx, String(n.skuNorm), String(n.sku))
  const variantSku = String(n.variantSku)

  let variant = await ctx.trx
    .selectFrom('product_variant')
    .selectAll()
    .where(sql<boolean>`ocm_normalize_code(sku) = ${normalizeCode(variantSku)}`)
    .executeTakeFirst()

  const variantPayload = {
    product_id: productId,
    sku: variantSku,
    name: str(n.varyant_adi),
    barcode: str(n.barkod),
    pack_size: col(num(n.ambalaj_miktari) ?? 1),
    unit: str(n.birim) ?? 'ADET',
    weight_gr: num(n.agirlik_gr),
  }

  if (variant) {
    await ctx.trx.updateTable('product_variant').set(variantPayload).where('id', '=', variant.id).execute()
    record(ctx, 'product_variant', variant.id, 'UPDATE', pick(variant, Object.keys(variantPayload)), variantPayload)
  } else {
    const isFirst =
      (await ctx.trx
        .selectFrom('product_variant')
        .select('id')
        .where('product_id', '=', productId)
        .executeTakeFirst()) === undefined
    variant = await ctx.trx
      .insertInto('product_variant')
      .values({ ...variantPayload, is_default: isFirst })
      .returningAll()
      .executeTakeFirstOrThrow()
    record(ctx, 'product_variant', variant.id, 'INSERT', null, variantPayload)
  }

  const group = str(n.musteri_grubu) ?? 'RETAIL'
  const pricePayload = {
    variant_id: variant.id,
    price_net: col(num(n.fiyat_net) ?? 0),
    tax_rate: num(n.kdv_orani) ?? 20,
    list_price: col(num(n.liste_fiyati)),
    customer_group: group,
  }
  const existingPrice = await ctx.trx
    .selectFrom('price')
    .selectAll()
    .where('variant_id', '=', variant.id)
    .where('customer_group', '=', group)
    .executeTakeFirst()
  if (existingPrice) {
    await ctx.trx.updateTable('price').set(pricePayload).where('id', '=', existingPrice.id).execute()
    record(ctx, 'price', existingPrice.id, 'UPDATE', pick(existingPrice, Object.keys(pricePayload)), pricePayload)
  } else {
    const ins = await ctx.trx.insertInto('price').values(pricePayload).returning('id').executeTakeFirstOrThrow()
    record(ctx, 'price', ins.id, 'INSERT', null, pricePayload)
  }

  const warehouse = str(n.depo_kodu) ?? 'MERKEZ'
  const stockPayload = {
    variant_id: variant.id,
    warehouse_code: warehouse,
    quantity: num(n.stok) ?? 0,
    lead_time_days: num(n.tedarik_suresi_gun),
    updated_at: NOW(),
  }
  const existingStock = await ctx.trx
    .selectFrom('stock')
    .selectAll()
    .where('variant_id', '=', variant.id)
    .where('warehouse_code', '=', warehouse)
    .executeTakeFirst()
  if (existingStock) {
    await ctx.trx.updateTable('stock').set(stockPayload).where('id', '=', existingStock.id).execute()
    record(ctx, 'stock', existingStock.id, 'UPDATE', pick(existingStock, Object.keys(stockPayload)), stockPayload)
  } else {
    const ins = await ctx.trx.insertInto('stock').values(stockPayload).returning('id').executeTakeFirstOrThrow()
    record(ctx, 'stock', ins.id, 'INSERT', null, stockPayload)
  }
}

// ── OEM & ÇAPRAZ ────────────────────────────────────────────────────────────

async function applyReference(ctx: Ctx, row: StagedRow): Promise<void> {
  const n = row.normalized
  const productId = await resolveProductId(ctx, String(n.skuNorm), String(n.sku))

  const vehicleBrand =
    String(n.tip) === 'OEM'
      ? await ctx.trx
          .selectFrom('vehicle_brand')
          .select('id')
          .where(sql<boolean>`lower(name) = lower(${String(n.marka)})`)
          .executeTakeFirst()
      : undefined

  const payload = {
    product_id: productId,
    type: col(String(n.tip)),
    brand_name: String(n.marka),
    vehicle_brand_id: vehicleBrand?.id ?? null,
    number: String(n.numara),
    normalized: String(n.normalizedNumber),
    source_id: ctx.sourceId,
    import_job_id: ctx.jobId,
    note: str(n.not),
  }

  const existing = await ctx.trx
    .selectFrom('product_reference')
    .selectAll()
    .where('product_id', '=', productId)
    .where('type', '=', payload.type)
    .where('normalized', '=', payload.normalized)
    .executeTakeFirst()

  if (existing) {
    await ctx.trx.updateTable('product_reference').set(payload).where('id', '=', existing.id).execute()
    record(ctx, 'product_reference', existing.id, 'UPDATE', pick(existing, Object.keys(payload)), payload)
  } else {
    const ins = await ctx.trx
      .insertInto('product_reference')
      .values(payload)
      .returning('id')
      .executeTakeFirstOrThrow()
    record(ctx, 'product_reference', ins.id, 'INSERT', null, payload)
  }
}

// ── UYUMLULUK İDDİASI ───────────────────────────────────────────────────────
// DİKKAT: burada product_compatibility'ye YAZILMAZ. Yalnızca İDDİA üretilir;
// hangi iddianın kazandığına çözümleme motoru karar verir. Mimari korunur.

async function applyCompatibility(ctx: Ctx, row: StagedRow): Promise<void> {
  const n = row.normalized
  const productId = await resolveProductId(ctx, String(n.skuNorm), String(n.sku))
  const engines = (n.engines ?? []) as Array<{ id: number | null; key: string; label: string }>
  const assertionType = String(n.assertionType) as 'COMPATIBLE' | 'INCOMPATIBLE'

  for (const e of engines) {
    const engineId = e.id ?? ctx.engineKeyToId.get(e.key) ?? (await lookupEngineByKey(ctx, e.key))
    if (!engineId) continue

    const payload = {
      product_id: productId,
      engine_id: engineId,
      source_id: ctx.sourceId,
      import_job_id: ctx.jobId,
      assertion_type: assertionType,
      year_from: num(n.yil_baslangic),
      year_to: num(n.yil_bitis),
      month_from: num(n.ay_baslangic),
      month_to: num(n.ay_bitis),
      restriction: str(n.kisit_notu),
      note: str(n.not),
      expanded_from: str(n.expandedFrom),
      is_active: true,
      asserted_at: NOW(),
    }

    const existing = await ctx.trx
      .selectFrom('compatibility_assertion')
      .selectAll()
      .where('product_id', '=', productId)
      .where('engine_id', '=', engineId)
      .where('source_id', '=', ctx.sourceId)
      .where('assertion_type', '=', assertionType)
      .executeTakeFirst()

    if (existing) {
      await ctx.trx
        .updateTable('compatibility_assertion')
        .set(payload)
        .where('id', '=', existing.id)
        .execute()
      record(ctx, 'compatibility_assertion', existing.id, 'UPDATE', pick(existing, Object.keys(payload)), payload)
    } else {
      const ins = await ctx.trx
        .insertInto('compatibility_assertion')
        .values(payload)
        .returning('id')
        .executeTakeFirstOrThrow()
      record(ctx, 'compatibility_assertion', ins.id, 'INSERT', null, payload)
    }
  }
}

// ─────────────────────────────── YARDIMCILAR ────────────────────────────────

async function resolveProductId(ctx: Ctx, skuNorm: string, sku: string): Promise<number> {
  const cached = ctx.productSkuToId.get(skuNorm)
  if (cached) return cached
  const found = await ctx.trx
    .selectFrom('product')
    .select('id')
    .where(sql<boolean>`ocm_normalize_code(sku) = ${skuNorm}`)
    .executeTakeFirst()
  if (!found) throw new Error(`Ürün bulunamadı: ${sku}`)
  ctx.productSkuToId.set(skuNorm, found.id)
  return found.id
}

/** `marka|model|motor` anahtarından motoru bulur (aynı import'ta oluşturulmadıysa). */
async function lookupEngineByKey(ctx: Ctx, key: string): Promise<number | null> {
  const parts = key.split('|')
  const brandNorm = parts[0] ?? ''
  const modelNorm = parts[1] ?? ''
  const engineNorm = parts[2] ?? ''

  const rows = await ctx.trx
    .selectFrom('vehicle_engine as e')
    .innerJoin('vehicle_model as m', 'm.id', 'e.model_id')
    .innerJoin('vehicle_brand as b', 'b.id', 'm.brand_id')
    .select(['e.id', 'e.name', 'm.name as model_name', 'b.name as brand_name'])
    .execute()

  const hit = rows.find(
    (r) =>
      normalizeName(r.brand_name) === brandNorm &&
      normalizeName(r.model_name) === modelNorm &&
      normalizeName(r.name) === engineNorm,
  )
  if (hit) ctx.engineKeyToId.set(key, hit.id)
  return hit?.id ?? null
}

function pick(obj: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const k of keys) if (k in obj) out[k] = obj[k]
  return out
}

const APPLIERS: Record<ImportSheet, (ctx: Ctx, row: StagedRow) => Promise<void>> = {
  CATEGORY: applyCategory,
  VEHICLE: applyVehicle,
  PRODUCT: applyProduct,
  PRICE_STOCK: applyPriceStock,
  REFERENCE: applyReference,
  COMPATIBILITY: applyCompatibility,
}
