/**
 * ADIM 3–5: STAGING → VALIDATE → PREVIEW
 *
 * Her satır BAĞIMSIZ doğrulanır. Bir satırın hatası diğer satırları etkilemez;
 * 10.000 satırın 150'si hatalıysa kalan 9.850 satır uygulanabilir kalır.
 *
 * Bu aşamada production tablolarına HİÇBİR ŞEY yazılmaz — yalnızca okunur.
 */
import type { Kysely } from 'kysely'
import type { Database, ImportAction, ImportRowStatus, ImportSheet } from '../types'
import { normalizeCode } from '../normalize'
import type { ParsedRow, ParsedSheet, ParseResult } from './parse'
import { ALL_ENGINES_TOKEN, SHEET_DEFS, type FieldDef, type SheetDef } from './schema'
import {
  coerceBool,
  coerceEnum,
  coerceInteger,
  coerceNumber,
  coerceText,
  coerceYear,
  isBlank,
  normalizeName,
  splitList,
} from './coerce'

// ─────────────────────────────── TİPLER ─────────────────────────────────────

export type MessageLevel = 'ERROR' | 'WARNING' | 'INFO'

export type RowMessage = {
  code: string
  level: MessageLevel
  field?: string
  message: string
}

export type ValidatedRow = {
  sheet: ImportSheet
  rowNo: number
  raw: Record<string, string>
  normalized: Record<string, unknown> | null
  status: ImportRowStatus
  action: ImportAction
  entityType: string | null
  entityId: number | null
  messages: RowMessage[]
}

export type SheetSummary = {
  sheet: ImportSheet
  title: string
  total: number
  valid: number
  warning: number
  error: number
  skipped: number
  created: number
  updated: number
}

export type ImportTotals = {
  total: number
  valid: number
  warning: number
  error: number
  /** dosya içinde tekrar ettiği için atlanan satırlar */
  duplicate: number
  /** yeni oluşturulacak kayıtlar */
  created: number
  /** güncellenecek kayıtlar */
  updated: number
  /** başka bir kaynakla çelişerek CONFLICTED üretebilecek satırlar */
  conflictRisk: number
  /** araç ağacında karşılığı bulunamayan satırlar */
  missingVehicle: number
  /** aynı OEM numarasının başka bir ürüne de bağlı olduğu satırlar */
  oemShared: number
}

export type ValidationResult = {
  rows: ValidatedRow[]
  sheets: SheetSummary[]
  totals: ImportTotals
  unknownHeaders: Array<{ sheet: ImportSheet; headers: string[] }>
  missingRequiredHeaders: Array<{ sheet: ImportSheet; headers: string[] }>
  ignoredSheets: string[]
  /** TUM_MOTORLAR genişletmeleri — kullanıcıya önizlemede gösterilir */
  expansions: Array<{
    rowNo: number
    sku: string
    model: string
    engineCount: number
    engines: string[]
  }>
}

// ────────────────────────────── LOOKUP'LAR ──────────────────────────────────

type EngineLookup = {
  id: number
  name: string
  normName: string
  codes: string[]
  displacementCc: number | null
  powerHp: number | null
  modelId: number
}

type Lookups = {
  categoryByCode: Map<string, { id: number; parentId: number | null; path: string }>
  productBrandByName: Map<string, { id: number; name: string }>
  productBySku: Map<string, { id: number; sku: string; categoryId: number }>
  variantBySku: Map<string, { id: number; productId: number }>
  vehicleTypeBySlug: Map<string, { id: number; name: string; slug: string }>
  vehicleBrandByName: Map<string, { id: number; name: string; slug: string }>
  modelsByBrand: Map<number, Array<{ id: number; name: string; normName: string }>>
  enginesByModel: Map<number, EngineLookup[]>
  /** normalize edilmiş OEM numarası → bağlı olduğu ürün id'leri */
  referenceOwners: Map<string, Set<number>>
  /** `${productId}:${engineId}` → mevcut aktif iddiaların tipleri (kaynak bazlı) */
  assertionsByPair: Map<string, Array<{ sourceId: number; type: string }>>
}

async function loadLookups(db: Kysely<Database>): Promise<Lookups> {
  const [categories, brands, products, variants, types, vbrands, models, engines, refs] =
    await Promise.all([
      db.selectFrom('category').select(['id', 'code', 'parent_id', 'path']).execute(),
      db.selectFrom('product_brand').select(['id', 'name']).execute(),
      db.selectFrom('product').select(['id', 'sku', 'category_id']).execute(),
      db.selectFrom('product_variant').select(['id', 'sku', 'product_id']).execute(),
      db.selectFrom('vehicle_type').select(['id', 'name', 'slug']).execute(),
      db.selectFrom('vehicle_brand').select(['id', 'name', 'slug']).execute(),
      db.selectFrom('vehicle_model').select(['id', 'brand_id', 'name']).execute(),
      db
        .selectFrom('vehicle_engine')
        .select(['id', 'model_id', 'name', 'engine_codes', 'displacement_cc', 'power_hp'])
        .execute(),
      db.selectFrom('product_reference').select(['normalized', 'product_id']).execute(),
    ])

  const modelsByBrand = new Map<number, Array<{ id: number; name: string; normName: string }>>()
  for (const m of models) {
    const list = modelsByBrand.get(m.brand_id) ?? []
    list.push({ id: m.id, name: m.name, normName: normalizeName(m.name) })
    modelsByBrand.set(m.brand_id, list)
  }

  const enginesByModel = new Map<number, EngineLookup[]>()
  for (const e of engines) {
    const list = enginesByModel.get(e.model_id) ?? []
    list.push({
      id: e.id,
      name: e.name,
      normName: normalizeName(e.name),
      codes: (e.engine_codes ?? []).map((c) => normalizeCode(c)),
      displacementCc: e.displacement_cc,
      powerHp: e.power_hp,
      modelId: e.model_id,
    })
    enginesByModel.set(e.model_id, list)
  }

  const referenceOwners = new Map<string, Set<number>>()
  for (const r of refs) {
    const set = referenceOwners.get(r.normalized) ?? new Set<number>()
    set.add(r.product_id)
    referenceOwners.set(r.normalized, set)
  }

  return {
    categoryByCode: new Map(
      categories.map((c) => [
        c.code.toLocaleUpperCase('tr'),
        { id: c.id, parentId: c.parent_id, path: c.path },
      ]),
    ),
    productBrandByName: new Map(
      brands.map((b) => [normalizeName(b.name), { id: b.id, name: b.name }]),
    ),
    productBySku: new Map(
      products.map((p) => [
        normalizeCode(p.sku),
        { id: p.id, sku: p.sku, categoryId: p.category_id },
      ]),
    ),
    variantBySku: new Map(
      variants.map((v) => [normalizeCode(v.sku), { id: v.id, productId: v.product_id }]),
    ),
    vehicleTypeBySlug: new Map(
      types.map((t) => [t.slug, { id: t.id, name: t.name, slug: t.slug }]),
    ),
    vehicleBrandByName: new Map(
      vbrands.map((b) => [normalizeName(b.name), { id: b.id, name: b.name, slug: b.slug }]),
    ),
    modelsByBrand,
    enginesByModel,
    referenceOwners,
    assertionsByPair: new Map(),
  }
}

/** Araç tipi enum'u (dosya) → vehicle_type.slug (veritabanı) */
const VEHICLE_TYPE_SLUGS: Record<string, string> = {
  OTOMOBIL: 'otomobil',
  HAFIF_TICARI: 'otomobil',
  AGIR_VASITA: 'agir-vasita',
  OTOBUS: 'otobus',
  IS_MAKINESI: 'is-makinesi',
  TRAKTOR: 'traktor',
  MOTOSIKLET: 'motosiklet',
}

/** Aynı motoru iki farklı yerde (dosya + veritabanı) tanımlayan kararlı anahtar. */
function engineKey(brand: string, model: string, engine: string): string {
  return `${normalizeName(brand)}|${normalizeName(model)}|${normalizeName(engine)}`
}

// ═══════════════════════════════ DOĞRULAMA ══════════════════════════════════

export async function validateParsed(
  db: Kysely<Database>,
  parsed: ParseResult,
  options: { sourceId: number },
): Promise<ValidationResult> {
  const lookups = await loadLookups(db)
  await loadAssertionsForProducts(db, parsed, lookups)

  const rows: ValidatedRow[] = []
  const expansions: ValidationResult['expansions'] = []

  // Aynı import içinde önceki sayfalarda tanımlanan varlıklar
  const pendingCategories = new Set<string>()
  const pendingProducts = new Set<string>()
  const pendingEngines = new Map<string, { label: string; modelKey: string }>()
  const pendingModelEngines = new Map<string, string[]>() // modelKey → engineKey[]

  const bySheet = new Map<ImportSheet, ParsedSheet>()
  for (const s of parsed.sheets) bySheet.set(s.sheet, s)

  const totals: ImportTotals = {
    total: 0,
    valid: 0,
    warning: 0,
    error: 0,
    duplicate: 0,
    created: 0,
    updated: 0,
    conflictRisk: 0,
    missingVehicle: 0,
    oemShared: 0,
  }

  for (const def of [...SHEET_DEFS].sort((a, b) => a.order - b.order)) {
    const sheet = bySheet.get(def.sheet)
    if (!sheet) continue

    const seen = new Set<string>()

    for (const row of sheet.rows) {
      const ctx: RowCtx = {
        def,
        row,
        lookups,
        seen,
        pendingCategories,
        pendingProducts,
        pendingEngines,
        pendingModelEngines,
        sourceId: options.sourceId,
        expansions,
      }
      const validated = validateRow(ctx)
      rows.push(validated)

      totals.total++
      if (validated.status === 'ERROR') totals.error++
      else if (validated.status === 'SKIPPED') totals.duplicate++
      else if (validated.status === 'WARNING') totals.warning++
      else totals.valid++

      if (validated.status !== 'ERROR' && validated.status !== 'SKIPPED') {
        if (validated.action === 'CREATE') totals.created++
        else if (validated.action === 'UPDATE') totals.updated++
      }
      for (const m of validated.messages) {
        if (m.code === 'W_CONFLICT_RISK') totals.conflictRisk++
        if (m.code === 'E_ENGINE_NOT_FOUND' || m.code === 'E_MODEL_NOT_FOUND')
          totals.missingVehicle++
        if (m.code === 'W_OEM_SHARED') totals.oemShared++
      }
    }
  }

  const sheets: SheetSummary[] = []
  for (const def of [...SHEET_DEFS].sort((a, b) => a.order - b.order)) {
    const list = rows.filter((r) => r.sheet === def.sheet)
    if (!list.length) continue
    sheets.push({
      sheet: def.sheet,
      title: def.title,
      total: list.length,
      valid: list.filter((r) => r.status === 'VALID').length,
      warning: list.filter((r) => r.status === 'WARNING').length,
      error: list.filter((r) => r.status === 'ERROR').length,
      skipped: list.filter((r) => r.status === 'SKIPPED').length,
      created: list.filter(
        (r) => r.action === 'CREATE' && r.status !== 'ERROR' && r.status !== 'SKIPPED',
      ).length,
      updated: list.filter(
        (r) => r.action === 'UPDATE' && r.status !== 'ERROR' && r.status !== 'SKIPPED',
      ).length,
    })
  }

  return {
    rows,
    sheets,
    totals,
    unknownHeaders: parsed.sheets
      .filter((s) => s.unknownHeaders.length)
      .map((s) => ({ sheet: s.sheet, headers: s.unknownHeaders })),
    missingRequiredHeaders: parsed.sheets
      .filter((s) => s.missingRequiredHeaders.length)
      .map((s) => ({ sheet: s.sheet, headers: s.missingRequiredHeaders })),
    ignoredSheets: parsed.ignoredSheets,
    expansions,
  }
}

/** Yalnızca dosyada geçen ürünler için mevcut iddiaları yükle (çelişki riski tespiti). */
async function loadAssertionsForProducts(
  db: Kysely<Database>,
  parsed: ParseResult,
  lookups: Lookups,
): Promise<void> {
  const compat = parsed.sheets.find((s) => s.sheet === 'COMPATIBILITY')
  if (!compat) return

  const productIds = new Set<number>()
  for (const r of compat.rows) {
    const sku = r.values.sku
    if (!sku) continue
    const p = lookups.productBySku.get(normalizeCode(sku))
    if (p) productIds.add(p.id)
  }
  if (!productIds.size) return

  const rows = await db
    .selectFrom('compatibility_assertion')
    .select(['product_id', 'engine_id', 'source_id', 'assertion_type'])
    .where('product_id', 'in', [...productIds])
    .where('is_active', '=', true)
    .execute()

  for (const a of rows) {
    const key = `${a.product_id}:${a.engine_id}`
    const list = lookups.assertionsByPair.get(key) ?? []
    list.push({ sourceId: a.source_id, type: a.assertion_type })
    lookups.assertionsByPair.set(key, list)
  }
}

// ──────────────────────────── SATIR DOĞRULAMA ───────────────────────────────

type RowCtx = {
  def: SheetDef
  row: ParsedRow
  lookups: Lookups
  seen: Set<string>
  pendingCategories: Set<string>
  pendingProducts: Set<string>
  pendingEngines: Map<string, { label: string; modelKey: string }>
  pendingModelEngines: Map<string, string[]>
  sourceId: number
  expansions: ValidationResult['expansions']
}

function validateRow(ctx: RowCtx): ValidatedRow {
  const messages: RowMessage[] = []
  const values: Record<string, unknown> = {}

  // 1) Tip ve zorunluluk denetimi — her alan bağımsız
  for (const field of ctx.def.fields) {
    const raw = ctx.row.values[field.key] ?? ''
    if (isBlank(raw)) {
      if (field.required) {
        messages.push({
          code: 'E_REQUIRED',
          level: 'ERROR',
          field: field.key,
          message: `"${field.label}" zorunludur, boş bırakılamaz.`,
        })
      }
      values[field.key] = null
      continue
    }
    const res = coerceField(field, raw)
    if (!res.ok) {
      messages.push({
        code: 'E_TYPE',
        level: 'ERROR',
        field: field.key,
        message: `${field.label}: ${res.error}`,
      })
      values[field.key] = null
    } else {
      values[field.key] = res.value
    }
  }

  const base = {
    sheet: ctx.def.sheet,
    rowNo: ctx.row.rowNo,
    raw: ctx.row.values,
  }

  if (messages.some((m) => m.level === 'ERROR')) {
    return {
      ...base,
      normalized: null,
      status: 'ERROR',
      action: 'NONE',
      entityType: null,
      entityId: null,
      messages,
    }
  }

  const handler = HANDLERS[ctx.def.sheet]
  const out = handler(ctx, values, messages)

  const status: ImportRowStatus = messages.some((m) => m.level === 'ERROR')
    ? 'ERROR'
    : out.skipped
      ? 'SKIPPED'
      : messages.some((m) => m.level === 'WARNING')
        ? 'WARNING'
        : 'VALID'

  return {
    ...base,
    normalized: status === 'ERROR' ? null : out.normalized,
    status,
    action: status === 'ERROR' || status === 'SKIPPED' ? 'NONE' : out.action,
    entityType: out.entityType,
    entityId: out.entityId,
    messages,
  }
}

function coerceField(field: FieldDef, raw: string) {
  switch (field.type) {
    case 'number':
      return coerceInteger(raw)
    case 'decimal':
      return coerceNumber(raw)
    case 'year':
      return coerceYear(raw)
    case 'bool':
      return coerceBool(raw)
    case 'enum':
      return coerceEnum(raw, field.values ?? [])
    default:
      return coerceText(raw, field.maxLength)
  }
}

type HandlerOut = {
  normalized: Record<string, unknown> | null
  action: ImportAction
  entityType: string | null
  entityId: number | null
  skipped?: boolean
}

type Handler = (ctx: RowCtx, v: Record<string, unknown>, messages: RowMessage[]) => HandlerOut

const HANDLERS: Record<ImportSheet, Handler> = {
  CATEGORY: handleCategory,
  VEHICLE: handleVehicle,
  PRODUCT: handleProduct,
  PRICE_STOCK: handlePriceStock,
  REFERENCE: handleReference,
  COMPATIBILITY: handleCompatibility,
}

// ── KATEGORİLER ─────────────────────────────────────────────────────────────

function handleCategory(
  ctx: RowCtx,
  v: Record<string, unknown>,
  messages: RowMessage[],
): HandlerOut {
  const code = String(v.kategori_kodu).toLocaleUpperCase('tr')
  if (ctx.seen.has(code)) {
    messages.push({
      code: 'W_DUPLICATE_IN_FILE',
      level: 'WARNING',
      field: 'kategori_kodu',
      message: `"${code}" bu dosyada daha önce geçti; bu satır atlandı.`,
    })
    return {
      normalized: null,
      action: 'NONE',
      entityType: 'category',
      entityId: null,
      skipped: true,
    }
  }
  ctx.seen.add(code)

  const parentCode = v.ust_kategori_kodu
    ? String(v.ust_kategori_kodu).toLocaleUpperCase('tr')
    : null
  if (
    parentCode &&
    !ctx.lookups.categoryByCode.has(parentCode) &&
    !ctx.pendingCategories.has(parentCode)
  ) {
    messages.push({
      code: 'E_CATEGORY_NOT_FOUND',
      level: 'ERROR',
      field: 'ust_kategori_kodu',
      message: `Üst kategori "${parentCode}" bulunamadı. Üst kategoriyi bu dosyada daha ÜST bir satırda tanımlayın.`,
    })
  }

  const existing = ctx.lookups.categoryByCode.get(code)
  ctx.pendingCategories.add(code)

  const attributes: Array<{ key: string; label: string; type: string; unit: string | null }> = []
  for (let i = 1; i <= 8; i++) {
    const key = v[`ozellik_${i}_anahtar`]
    if (!key) continue
    attributes.push({
      key: String(key),
      label: String(v[`ozellik_${i}_etiket`] ?? key),
      type: String(v[`ozellik_${i}_tip`] ?? 'METIN'),
      unit: v[`ozellik_${i}_birim`] ? String(v[`ozellik_${i}_birim`]) : null,
    })
  }

  return {
    normalized: { ...v, kategori_kodu: code, ust_kategori_kodu: parentCode, attributes },
    action: existing ? 'UPDATE' : 'CREATE',
    entityType: 'category',
    entityId: existing?.id ?? null,
  }
}

// ── ARAÇ AĞACI ──────────────────────────────────────────────────────────────

function handleVehicle(
  ctx: RowCtx,
  v: Record<string, unknown>,
  messages: RowMessage[],
): HandlerOut {
  const typeToken = String(v.arac_tipi)
  const typeSlug = VEHICLE_TYPE_SLUGS[typeToken]
  if (!typeSlug || !ctx.lookups.vehicleTypeBySlug.has(typeSlug)) {
    messages.push({
      code: 'E_VEHICLE_TYPE_NOT_FOUND',
      level: 'ERROR',
      field: 'arac_tipi',
      message: `Araç tipi "${typeToken}" sistemde tanımlı değil.`,
    })
  }

  const brandName = String(v.arac_markasi)
  const modelName = String(v.model)
  const engineName = String(v.motor_adi)
  const codes = v.motor_kodu ? splitList(String(v.motor_kodu)) : []

  if (!codes.length) {
    messages.push({
      code: 'W_NO_ENGINE_CODE',
      level: 'WARNING',
      field: 'motor_kodu',
      message:
        'Motor kodu girilmemiş. Uyumluluk eşleştirmesinin en güvenilir anahtarı motor kodudur; ' +
        'kodsuz motorlar yalnızca ada göre eşleşir.',
    })
  }

  const key = engineKey(brandName, modelName, engineName)
  if (ctx.seen.has(key)) {
    messages.push({
      code: 'W_DUPLICATE_IN_FILE',
      level: 'WARNING',
      message: `${brandName} ${modelName} ${engineName} bu dosyada daha önce geçti; bu satır atlandı.`,
    })
    return {
      normalized: null,
      action: 'NONE',
      entityType: 'vehicle_engine',
      entityId: null,
      skipped: true,
    }
  }
  ctx.seen.add(key)

  const modelKey = `${normalizeName(brandName)}|${normalizeName(modelName)}`
  ctx.pendingEngines.set(key, { label: `${brandName} ${modelName} ${engineName}`, modelKey })
  const list = ctx.pendingModelEngines.get(modelKey) ?? []
  list.push(key)
  ctx.pendingModelEngines.set(modelKey, list)

  // Mevcut motoru bul (varsa güncelleme)
  const brand = ctx.lookups.vehicleBrandByName.get(normalizeName(brandName))
  let existingEngineId: number | null = null
  if (brand) {
    const model = (ctx.lookups.modelsByBrand.get(brand.id) ?? []).find(
      (m) => m.normName === normalizeName(modelName),
    )
    if (model) {
      const engine = (ctx.lookups.enginesByModel.get(model.id) ?? []).find(
        (e) => e.normName === normalizeName(engineName),
      )
      if (engine) existingEngineId = engine.id
    }
  }

  return {
    normalized: { ...v, typeSlug, engineKey: key, modelKey, codes },
    action: existingEngineId ? 'UPDATE' : 'CREATE',
    entityType: 'vehicle_engine',
    entityId: existingEngineId,
  }
}

// ── ÜRÜNLER ─────────────────────────────────────────────────────────────────

function handleProduct(
  ctx: RowCtx,
  v: Record<string, unknown>,
  messages: RowMessage[],
): HandlerOut {
  const sku = String(v.sku)
  const skuNorm = normalizeCode(sku)

  if (ctx.seen.has(skuNorm)) {
    messages.push({
      code: 'W_DUPLICATE_IN_FILE',
      level: 'WARNING',
      field: 'sku',
      message: `SKU "${sku}" bu dosyada daha önce geçti; bu satır atlandı (ilk satır geçerli).`,
    })
    return {
      normalized: null,
      action: 'NONE',
      entityType: 'product',
      entityId: null,
      skipped: true,
    }
  }
  ctx.seen.add(skuNorm)

  const categoryCode = String(v.kategori_kodu).toLocaleUpperCase('tr')
  if (!ctx.lookups.categoryByCode.has(categoryCode) && !ctx.pendingCategories.has(categoryCode)) {
    messages.push({
      code: 'E_CATEGORY_NOT_FOUND',
      level: 'ERROR',
      field: 'kategori_kodu',
      message: `Kategori kodu "${categoryCode}" tanımsız. Önce KATEGORILER sayfasını yükleyin.`,
    })
  }

  const brandName = String(v.marka)
  if (!ctx.lookups.productBrandByName.has(normalizeName(brandName))) {
    messages.push({
      code: 'I_BRAND_CREATE',
      level: 'INFO',
      field: 'marka',
      message: `"${brandName}" markası sistemde yok; import sırasında oluşturulacak.`,
    })
  }

  // spec_ önekli dinamik sütunlar
  const specs: Record<string, string> = {}
  for (const [k, val] of Object.entries(ctx.row.unknown)) {
    if (!k.startsWith('spec_') || !val) continue
    specs[k.slice(5)] = val
  }

  const existing = ctx.lookups.productBySku.get(skuNorm)
  ctx.pendingProducts.add(skuNorm)

  return {
    normalized: { ...v, sku, skuNorm, kategori_kodu: categoryCode, specs },
    action: existing ? 'UPDATE' : 'CREATE',
    entityType: 'product',
    entityId: existing?.id ?? null,
  }
}

// ── FİYAT & STOK ────────────────────────────────────────────────────────────

function handlePriceStock(
  ctx: RowCtx,
  v: Record<string, unknown>,
  messages: RowMessage[],
): HandlerOut {
  const sku = String(v.sku)
  const skuNorm = normalizeCode(sku)
  const product = ctx.lookups.productBySku.get(skuNorm)

  if (!product && !ctx.pendingProducts.has(skuNorm)) {
    messages.push({
      code: 'E_SKU_NOT_FOUND',
      level: 'ERROR',
      field: 'sku',
      message: `Ürün bulunamadı: "${sku}". Önce URUNLER sayfasını yükleyin.`,
    })
  }

  const variantSku = v.varyant_sku ? String(v.varyant_sku) : sku
  const variantNorm = normalizeCode(variantSku)
  if (ctx.seen.has(variantNorm)) {
    messages.push({
      code: 'W_DUPLICATE_IN_FILE',
      level: 'WARNING',
      field: 'varyant_sku',
      message: `Varyant "${variantSku}" bu dosyada daha önce geçti; bu satır atlandı.`,
    })
    return {
      normalized: null,
      action: 'NONE',
      entityType: 'product_variant',
      entityId: null,
      skipped: true,
    }
  }
  ctx.seen.add(variantNorm)

  const price = v.fiyat_net as number | null
  if (price !== null && price < 0) {
    messages.push({
      code: 'E_NEGATIVE_PRICE',
      level: 'ERROR',
      field: 'fiyat_net',
      message: 'Fiyat negatif olamaz.',
    })
  }
  const stock = v.stok as number | null
  if (stock !== null && stock < 0) {
    messages.push({
      code: 'E_NEGATIVE_STOCK',
      level: 'ERROR',
      field: 'stok',
      message: 'Stok negatif olamaz.',
    })
  }

  const existingVariant = ctx.lookups.variantBySku.get(variantNorm)
  return {
    normalized: { ...v, sku, skuNorm, variantSku, variantNorm },
    action: existingVariant ? 'UPDATE' : 'CREATE',
    entityType: 'product_variant',
    entityId: existingVariant?.id ?? null,
  }
}

// ── OEM & ÇAPRAZ KODLAR ─────────────────────────────────────────────────────

function handleReference(
  ctx: RowCtx,
  v: Record<string, unknown>,
  messages: RowMessage[],
): HandlerOut {
  const sku = String(v.sku)
  const skuNorm = normalizeCode(sku)
  const product = ctx.lookups.productBySku.get(skuNorm)

  if (!product && !ctx.pendingProducts.has(skuNorm)) {
    messages.push({
      code: 'E_SKU_NOT_FOUND',
      level: 'ERROR',
      field: 'sku',
      message: `Ürün bulunamadı: "${sku}". Önce URUNLER sayfasını yükleyin.`,
    })
  }

  const type = String(v.tip)
  const number = String(v.numara)
  const normalized = normalizeCode(number)
  if (!normalized) {
    messages.push({
      code: 'E_EMPTY_NUMBER',
      level: 'ERROR',
      field: 'numara',
      message: `"${number}" normalize edildiğinde boş kalıyor; geçerli bir numara değil.`,
    })
  }

  // 1) Dosya içi tekrar
  const fileKey = `${skuNorm}|${type}|${normalized}`
  if (ctx.seen.has(fileKey)) {
    messages.push({
      code: 'W_DUPLICATE_IN_FILE',
      level: 'WARNING',
      field: 'numara',
      message: `Aynı numara (${number}) bu ürün için dosyada tekrar ediyor; bu satır atlandı.`,
    })
    return {
      normalized: null,
      action: 'NONE',
      entityType: 'product_reference',
      entityId: null,
      skipped: true,
    }
  }
  ctx.seen.add(fileKey)

  // 2) OEM DUPLICATE: aynı numara BAŞKA bir ürüne de bağlıysa uyar
  const owners = ctx.lookups.referenceOwners.get(normalized)
  if (owners) {
    const others = [...owners].filter((id) => id !== product?.id)
    if (others.length) {
      messages.push({
        code: 'W_OEM_SHARED',
        level: 'WARNING',
        field: 'numara',
        message:
          `Bu numara (${number}) zaten ${others.length} başka ürüne bağlı. ` +
          'Muadil ürünlerde bu normaldir; farklı bir parçaysa numarayı kontrol edin.',
      })
    }
  }

  return {
    normalized: { ...v, sku, skuNorm, tip: type, numara: number, normalizedNumber: normalized },
    action: 'CREATE',
    entityType: 'product_reference',
    entityId: null,
  }
}

// ── UYUMLULUK ───────────────────────────────────────────────────────────────

function handleCompatibility(
  ctx: RowCtx,
  v: Record<string, unknown>,
  messages: RowMessage[],
): HandlerOut {
  const sku = String(v.sku)
  const skuNorm = normalizeCode(sku)
  const product = ctx.lookups.productBySku.get(skuNorm)

  if (!product && !ctx.pendingProducts.has(skuNorm)) {
    messages.push({
      code: 'E_SKU_NOT_FOUND',
      level: 'ERROR',
      field: 'sku',
      message: `Ürün bulunamadı: "${sku}". Önce URUNLER sayfasını yükleyin.`,
    })
  }

  const assertionType = v.uyumluluk_tipi === 'UYUMSUZ' ? 'INCOMPATIBLE' : 'COMPATIBLE'
  const brandName = String(v.arac_markasi)
  const modelName = String(v.model)
  const codeToken = v.motor_kodu ? String(v.motor_kodu).trim() : ''
  const engineNameRaw = v.motor_adi ? String(v.motor_adi) : ''

  if (!codeToken && !engineNameRaw) {
    messages.push({
      code: 'E_ENGINE_KEY_MISSING',
      level: 'ERROR',
      message: 'Motor kodu veya motor adından en az biri zorunludur.',
    })
    return {
      normalized: null,
      action: 'NONE',
      entityType: 'compatibility_assertion',
      entityId: null,
    }
  }

  const matched = matchEngines(ctx, {
    brandName,
    modelName,
    codeToken,
    engineName: engineNameRaw,
    cc: v.hacim_cc as number | null,
    hp: v.guc_hp as number | null,
    messages,
  })

  if (!matched.engines.length) {
    return {
      normalized: null,
      action: 'NONE',
      entityType: 'compatibility_assertion',
      entityId: null,
    }
  }

  // TUM_MOTORLAR genişletmesi kullanıcıya bildirilir
  if (matched.expanded) {
    ctx.expansions.push({
      rowNo: ctx.row.rowNo,
      sku,
      model: `${brandName} ${modelName}`,
      engineCount: matched.engines.length,
      engines: matched.engines.map((e) => e.label),
    })
    messages.push({
      code: 'I_EXPANDED',
      level: 'INFO',
      message: `TUM_MOTORLAR: bu satır ${matched.engines.length} motora genişletilecek.`,
    })
  }

  // Dosya içi tekrar (genişletilmiş motorlar dahil)
  const kept: typeof matched.engines = []
  for (const e of matched.engines) {
    const fileKey = `${skuNorm}|${e.key}`
    if (ctx.seen.has(fileKey)) continue
    ctx.seen.add(fileKey)
    kept.push(e)
  }
  if (!kept.length) {
    messages.push({
      code: 'W_DUPLICATE_IN_FILE',
      level: 'WARNING',
      message: 'Bu ürün-motor ilişkisi dosyada daha önce geçti; bu satır atlandı.',
    })
    return {
      normalized: null,
      action: 'NONE',
      entityType: 'compatibility_assertion',
      entityId: null,
      skipped: true,
    }
  }

  // Yıl aralığı tutarlılığı
  const yf = v.yil_baslangic as number | null
  const yt = v.yil_bitis as number | null
  if (yf !== null && yt !== null && yf > yt) {
    messages.push({
      code: 'E_YEAR_RANGE',
      level: 'ERROR',
      field: 'yil_bitis',
      message: `Yıl aralığı ters: ${yf} > ${yt}.`,
    })
  }

  // ÇELİŞKİ RİSKİ: başka bir kaynak bu ürün-motor için TERS iddiada bulunmuş mu?
  if (product) {
    for (const e of kept) {
      if (e.id === null) continue
      const existing = ctx.lookups.assertionsByPair.get(`${product.id}:${e.id}`) ?? []
      const contradicting = existing.filter(
        (a) => a.sourceId !== ctx.sourceId && a.type !== assertionType,
      )
      if (contradicting.length) {
        messages.push({
          code: 'W_CONFLICT_RISK',
          level: 'WARNING',
          message:
            `${e.label}: başka bir kaynak bunun tersini söylüyor. ` +
            'Bu kayıt ÇAKIŞMA olarak işaretlenecek ve arayüzde "uyumlu" gösterilmeyecek.',
        })
        break
      }
    }
  }

  return {
    normalized: {
      ...v,
      sku,
      skuNorm,
      assertionType,
      engines: kept.map((e) => ({ id: e.id, key: e.key, label: e.label })),
      expandedFrom: matched.expanded ? `TUM_MOTORLAR:model=${modelName}` : null,
    },
    action: 'CREATE',
    entityType: 'compatibility_assertion',
    entityId: null,
  }
}

type MatchedEngine = { id: number | null; key: string; label: string }

/**
 * MOTOR EŞLEŞTİRME SIRASI (04-CSV-IMPORT-FORMATI.md §7):
 *   1. motor_kodu tam eşleşme (engine_codes dizisinde)      ← en güvenilir
 *   2. marka + model + motor_adi (normalize)
 *   3. marka + model + hacim_cc + guc_hp
 *   4. Bulunamadı → HATA (satır uygulanmaz, import devam eder)
 */
function matchEngines(
  ctx: RowCtx,
  input: {
    brandName: string
    modelName: string
    codeToken: string
    engineName: string
    cc: number | null
    hp: number | null
    messages: RowMessage[]
  },
): { engines: MatchedEngine[]; expanded: boolean } {
  const { brandName, modelName, codeToken, engineName, cc, hp, messages } = input
  const modelKey = `${normalizeName(brandName)}|${normalizeName(modelName)}`

  const brand = ctx.lookups.vehicleBrandByName.get(normalizeName(brandName))
  /*
   * MODEL ADI NORMALİZASYONU ÇAKIŞABİLİR.
   *
   * `normalizeName` harf/rakam dışındaki her şeyi atıyor; bu yüzden Peugeot'nun
   * "206" ve "206+" modelleri aynı anahtara ("206") düşüyor. Tek eşleşme
   * arandığında yanlış model seçiliyor ve o modelde bulunmayan motor
   * "Motor bulunamadı" hatası veriyordu — model de motor da ağaçta olduğu hâlde.
   *
   * Çözüm: aynı anahtara düşen TÜM modeller aday; aralarında istenen motoru
   * gerçekten içeren varsa o seçilir. Yoksa ilk aday (eski davranış) kalır.
   */
  const adaylar = brand
    ? (ctx.lookups.modelsByBrand.get(brand.id) ?? []).filter(
        (m) => m.normName === normalizeName(modelName),
      )
    : []
  const istenenAd = engineName ? normalizeName(engineName) : ''
  const istenenKod = codeToken ? splitList(codeToken).map((c) => normalizeCode(c)) : []
  const model =
    adaylar.length > 1
      ? (adaylar.find((m) => {
          const es = ctx.lookups.enginesByModel.get(m.id) ?? []
          if (istenenAd && es.some((e) => e.normName === istenenAd)) return true
          if (istenenKod.length && es.some((e) => e.codes.some((c) => istenenKod.includes(c))))
            return true
          return false
        }) ?? adaylar[0])
      : adaylar[0]
  const dbEngines = model ? (ctx.lookups.enginesByModel.get(model.id) ?? []) : []
  const pendingKeys = ctx.pendingModelEngines.get(modelKey) ?? []

  if (!model && !pendingKeys.length) {
    messages.push({
      code: 'E_MODEL_NOT_FOUND',
      level: 'ERROR',
      field: 'model',
      message:
        `Araç ağacında yok: ${brandName} / ${modelName}. ` +
        'ARAC_AGACI sayfasında tanımlayın veya araç ağacı yönetiminden ekleyin.',
    })
    return { engines: [], expanded: false }
  }

  const asMatched = (e: { id: number; name: string }): MatchedEngine => ({
    id: e.id,
    key: engineKey(brandName, modelName, e.name),
    label: `${brandName} ${modelName} ${e.name}`,
  })

  // TUM_MOTORLAR — modelin bütün motorlarına genişlet
  if (codeToken.toLocaleUpperCase('tr') === ALL_ENGINES_TOKEN) {
    const all: MatchedEngine[] = dbEngines.map(asMatched)
    for (const key of pendingKeys) {
      if (all.some((a) => a.key === key)) continue
      const pending = ctx.pendingEngines.get(key)
      if (pending) all.push({ id: null, key, label: pending.label })
    }
    if (!all.length) {
      messages.push({
        code: 'E_ENGINE_NOT_FOUND',
        level: 'ERROR',
        message: `${brandName} ${modelName} için tanımlı motor yok; TUM_MOTORLAR genişletilemedi.`,
      })
      return { engines: [], expanded: false }
    }
    return { engines: all, expanded: true }
  }

  // 1) Motor kodu
  if (codeToken) {
    const wanted = splitList(codeToken).map((c) => normalizeCode(c))
    const hits = dbEngines.filter((e) => e.codes.some((c) => wanted.includes(c)))
    if (hits.length) return { engines: hits.map(asMatched), expanded: false }
  }

  // 2) Motor adı
  if (engineName) {
    const norm = normalizeName(engineName)
    const hit = dbEngines.find((e) => e.normName === norm)
    if (hit) return { engines: [asMatched(hit)], expanded: false }

    const pendingKey = engineKey(brandName, modelName, engineName)
    const pending = ctx.pendingEngines.get(pendingKey)
    if (pending)
      return { engines: [{ id: null, key: pendingKey, label: pending.label }], expanded: false }
  }

  // 3) Hacim + güç
  if (cc !== null && hp !== null) {
    const hits = dbEngines.filter((e) => e.displacementCc === cc && e.powerHp === hp)
    if (hits.length === 1) {
      messages.push({
        code: 'W_MATCHED_BY_SPEC',
        level: 'WARNING',
        message: `Motor kodu/adı eşleşmedi; hacim (${cc} cc) ve güç (${hp} HP) ile eşleştirildi.`,
      })
      return { engines: hits.map(asMatched), expanded: false }
    }
  }

  // 4) Bulunamadı
  messages.push({
    code: 'E_ENGINE_NOT_FOUND',
    level: 'ERROR',
    field: codeToken ? 'motor_kodu' : 'motor_adi',
    message:
      `Motor bulunamadı: ${brandName} / ${modelName} / ${codeToken || engineName}. ` +
      'ARAC_AGACI sayfasında tanımlayın veya araç ağacı yönetiminden ekleyin.',
  })
  return { engines: [], expanded: false }
}
