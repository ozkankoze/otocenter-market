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
 *
 * ════════════════════════════════════════════════════════════════════════════
 *  TOPLU YAZMA (2026-08)
 * ════════════════════════════════════════════════════════════════════════════
 *  Bu dosya eskiden satır satır çalışıyordu: her kayıt için bir SELECT, sonra
 *  bir UPDATE ya da INSERT. 65.953 satırlık dosyada ölçüm sonucu:
 *
 *      önizleme (urun-import-onizle) :        158 sorgu
 *      uygulama (urun-import-onayla) :    148.136 sorgu     ← 938 kat
 *
 *  Yerelde 71 saniye süren bu iş, Neon'da (89 ms gidiş-dönüş) yaklaşık
 *  3 saat 40 dakika sürüyor ve ekrana hiçbir şey yazmadığı için "takıldı"
 *  gibi görünüyordu. Sorguların %82'si tek bir yerden geliyordu: uyumluluk
 *  sayfasında satır başına bir SELECT + bir UPDATE (60.599 × 2).
 *
 *  Artık her sayfa için: mevcut kayıtlar TEK seferde okunur, fark BELLEKTE
 *  hesaplanır, yazma parçalar hâlinde toplu yapılır. Değişmeyen satır hiç
 *  yazılmaz. Defter (import_change) içeriği ve geri alma davranışı AYNI kaldı.
 *
 *  CATEGORY ve VEHICLE sayfaları bilerek satır satır bırakıldı: hiyerarşi
 *  (üst kategori yolu, marka→model→nesil→motor) satırların birbirine
 *  bağımlı olmasını gerektiriyor ve bu iki sayfa tipik dosyalarda birkaç yüz
 *  satırı geçmiyor. Ölçülen kazanç yok, kırılma riski yüksekti.
 */
import { sql, type Kysely, type Transaction } from 'kysely'
import type { Database, ImportSheet } from '../types'
import { normalizeCode, slugify } from '../normalize'
import { resolveCompatibility, rebuildEngineCategoryIndex } from '../resolve'
import { normalizeName } from './coerce'
import { ayniMi, dilimle, topluGuncelle, type GuncelKolon } from './toplu'

export type CommitResult = {
  applied: number
  skipped: number
  changes: number
  created: Record<string, number>
  updated: Record<string, number>
  resolution: { resolved: number; conflicts: number; removed: number }
  seoPages: number
  /** Bu çalıştırmanın attığı toplam SQL sorgusu (ölçüm için). */
  sorgu: number
  /** Toplam süre (ms). */
  sureMs: number
  /** Kuru çalışma mıydı? true ise veritabanına hiçbir şey yazılmadı. */
  kuru: boolean
}

export type CommitOptions = {
  /**
   * KURU ÇALIŞMA. Her şey normal çalışır, sonunda işlem GERİ ALINIR.
   * Ne yazılacağını, kaç sorgu atıldığını ve gerçek süreyi gösterir;
   * veritabanına tek satır yazmaz, iş durumuna dokunmaz.
   */
  olcum?: boolean
  /** Ekrana aşama/ilerleme yazmayı kapatır (testler için). */
  sessiz?: boolean
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

/** Toplu yazma parça boyutu. Tek sorguda bu kadar satır gider. */
const PARCA = 1000

/** Kuru çalışmayı bitirmek için kullanılan iç sinyal — hata değildir. */
class KuruCalismaBitti extends Error {
  constructor() {
    super('KURU_CALISMA')
  }
}

// ═════════════════════════════ AŞAMA GÜNLÜĞÜ ════════════════════════════════
//
// Eskiden ekranda tek bir satır vardı: "UYGULANIYOR — iş #3". Sonrasında
// saatlerce sessizlik. Artık her sayfa başlarken ve biterken, uzun sayfalarda
// ise ilerledikçe satır basılır; kimse boş ekrana bakıp beklemez.

type Gunluk = {
  asama(ad: string): void
  bit(detay?: string): void
  bilgi(mesaj: string): void
  sonAsama(): string
}

function gunlukAc(sessiz: boolean): Gunluk {
  const t0 = Date.now()
  let acik = ''
  let acikT = 0
  let son = '(başlamadı)'
  const sn = (): string => ((Date.now() - t0) / 1000).toFixed(1).padStart(6)
  return {
    asama(ad) {
      son = ad
      acik = ad
      acikT = Date.now()
      if (!sessiz) process.stdout.write(`  [${sn()} sn] → ${ad}\n`)
    },
    bit(detay) {
      if (!sessiz && acik) {
        process.stdout.write(
          `  [${sn()} sn] ✓ ${acik}${detay ? ' — ' + detay : ''} · ${Date.now() - acikT} ms\n`,
        )
      }
      acik = ''
    },
    bilgi(mesaj) {
      if (!sessiz) process.stdout.write(`  [${sn()} sn]   ${mesaj}\n`)
    },
    sonAsama: () => son,
  }
}

// ═══════════════════════════════ ANA AKIŞ ═══════════════════════════════════

export async function commitImport(
  db: Kysely<Database>,
  jobId: number,
  options: CommitOptions = {},
): Promise<CommitResult> {
  const kuru = options.olcum === true
  // Testlerde aşama günlüğü çıktıyı boğuyor; orada varsayılan sessizdir.
  const g = gunlukAc(options.sessiz ?? Boolean(process.env.VITEST))
  const basla = Date.now()
  const sorgu0 = sorguSayisi()

  const job = await db
    .selectFrom('import_job')
    .selectAll()
    .where('id', '=', jobId)
    .executeTakeFirst()
  if (!job) throw new Error(`Import #${jobId} bulunamadı`)
  if (job.status !== 'VALIDATED') {
    throw new Error(
      `Import #${jobId} durumu "${job.status}". Yalnızca doğrulanmış (VALIDATED) bir import uygulanabilir.` +
        (job.status === 'COMMITTING'
          ? `\n\n  Bu iş yarıda kesilmiş görünüyor. Uygulama tek işlemde yapıldığı için ` +
            `veritabanına hiçbir şey yazılmadı; yalnızca durum etiketi asılı kaldı.\n` +
            `  Kurtarmak için:  npm run db:urun-import-onayla -- ${jobId} --kurtar`
          : ''),
    )
  }

  if (kuru) {
    g.bilgi('KURU ÇALIŞMA — sonunda her şey geri alınacak, hiçbir şey yazılmayacak.')
  } else {
    await db
      .updateTable('import_job')
      .set({ status: 'COMMITTING' })
      .where('id', '=', jobId)
      .execute()
  }

  const created: Record<string, number> = {}
  const updated: Record<string, number> = {}
  let applied = 0
  let ledgerCount = 0
  let resolution = { resolved: 0, conflicts: 0, removed: 0 }
  let seoPages = 0

  try {
    await db.transaction().execute(async (trx) => {
      const ledger: Ledger = []
      const ctx: Ctx = {
        trx,
        g,
        ledger,
        jobId,
        sourceId: job.source_id,
        engineKeyToId: new Map(),
        productSkuToId: new Map(),
        categoryCodeToId: new Map(),
        motorDizini: null,
        created,
        updated,
      }

      for (const sheet of SHEET_ORDER) {
        g.asama(`${sheet} — staging satırları okunuyor`)
        const rows = await trx
          .selectFrom('import_staging_row')
          .select(['id', 'sheet', 'row_no', 'normalized'])
          .where('import_job_id', '=', jobId)
          .where('sheet', '=', sheet)
          .where('status', 'in', ['VALID', 'WARNING'])
          .orderBy('row_no')
          .execute()

        if (!rows.length) {
          g.bit('satır yok, atlandı')
          continue
        }
        g.bit(`${rows.length} satır`)

        const staged: StagedRow[] = []
        for (const r of rows) {
          if (!r.normalized) continue
          staged.push({
            id: r.id,
            sheet: r.sheet,
            row_no: r.row_no,
            normalized: r.normalized as Record<string, unknown>,
          })
        }

        g.asama(`${sheet} — uygulanıyor (${staged.length} satır)`)
        await ISLEYICILER[sheet](ctx, staged)
        applied += staged.length
        g.bit(`defterde ${ledger.length} kayıt`)

        g.asama(`${sheet} — staging satırları APPLIED işaretleniyor`)
        await trx
          .updateTable('import_staging_row')
          .set({ status: 'APPLIED' })
          .where('import_job_id', '=', jobId)
          .where('sheet', '=', sheet)
          .where('status', 'in', ['VALID', 'WARNING'])
          .execute()
        g.bit()
      }

      if (ledger.length) {
        // Defter parçalar halinde yazılır (tek sorguda binlerce satır parametre sınırını zorlar)
        g.asama(`defter yazılıyor (${ledger.length} kayıt)`)
        for (const dilim of dilimle(ledger, PARCA)) {
          await trx
            .insertInto('import_change')
            .values(
              dilim.map((c) => ({
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
        g.bit()
      }
      ledgerCount = ledger.length

      /*
       * ÇÖZÜMLEME — mimari değişmedi, mevcut motor aynen çağrılıyor.
       *
       * Kuru çalışmada işlemin İÇİNDE çalıştırılır ki ölçülen süre gerçeği
       * yansıtsın; normal çalıştırmada da işlem içinde olması bir şeyi
       * bozmaz, üstelik "yazıldı ama çözümlenmedi" ara durumunu ortadan
       * kaldırır: ya hepsi ya hiçbiri.
       */
      g.asama('uyumluluk çözümlemesi')
      resolution = await resolveCompatibility(trx)
      g.bit(`${resolution.resolved} uyumluluk · ${resolution.conflicts} çelişki`)

      g.asama('SEO indeksi')
      seoPages = await rebuildEngineCategoryIndex(trx)
      g.bit(`${seoPages} sayfa`)

      if (kuru) throw new KuruCalismaBitti()
    })
  } catch (err) {
    if (!(err instanceof KuruCalismaBitti)) {
      if (!kuru) {
        await db
          .updateTable('import_job')
          .set({ status: 'FAILED', error_message: (err as Error).message })
          .where('id', '=', jobId)
          .execute()
      }
      throw new Error(
        `İçe aktarma başarısız — takıldığı/hata verdiği aşama: ${g.sonAsama()}\n${(err as Error).message}`,
        { cause: err },
      )
    }
    g.bilgi('KURU ÇALIŞMA tamamlandı — işlem geri alındı, veritabanı değişmedi.')
  }

  const skippedRow = await db
    .selectFrom('import_staging_row')
    .select(({ fn }) => fn.countAll<string>().as('n'))
    .where('import_job_id', '=', jobId)
    .where('status', 'in', ['ERROR', 'SKIPPED'])
    .executeTakeFirst()

  if (!kuru) {
    await db
      .updateTable('import_job')
      .set({ status: 'COMPLETED', committed_at: new Date() })
      .where('id', '=', jobId)
      .execute()
  }

  return {
    applied,
    skipped: Number(skippedRow?.n ?? 0),
    changes: ledgerCount,
    created,
    updated,
    resolution,
    seoPages,
    sorgu: sorguSayisi() - sorgu0,
    sureMs: Date.now() - basla,
    kuru,
  }
}

/**
 * Yarıda kesilmiş bir işi kurtarır.
 *
 * `commitImport` işlemi açmadan ÖNCE durumu COMMITTING yapar. Ctrl+C bu anla
 * COMMIT arasında gelirse işlem geri alınır — veritabanına hiçbir şey yazılmaz,
 * staging satırları VALID kalır — ama durum etiketi COMMITTING'de asılı kalır
 * ve iş bir daha uygulanamaz. Bu fonksiyon o etiketi geri alır.
 *
 * Güvenlidir: yalnızca gerçekten yazılmamış (defterde kaydı olmayan) işleri
 * geri alır.
 */
export async function kurtarAsiliIs(
  db: Kysely<Database>,
  jobId: number,
): Promise<{ kurtarildi: boolean; sebep: string }> {
  const job = await db
    .selectFrom('import_job')
    .select(['id', 'status'])
    .where('id', '=', jobId)
    .executeTakeFirst()
  if (!job) throw new Error(`Import #${jobId} bulunamadı`)
  if (job.status !== 'COMMITTING') {
    return { kurtarildi: false, sebep: `Durum "${job.status}" — kurtarılacak bir şey yok.` }
  }

  const defter = await db
    .selectFrom('import_change')
    .select(({ fn }) => fn.countAll<string>().as('n'))
    .where('import_job_id', '=', jobId)
    .executeTakeFirst()
  if (Number(defter?.n ?? 0) > 0) {
    return {
      kurtarildi: false,
      sebep:
        `Bu işin defterinde ${defter?.n} kayıt var — yani bir kısmı gerçekten yazılmış. ` +
        `Otomatik kurtarma yapılmadı. Geri almak için: npm run db:urun-import-geri-al -- ${jobId}`,
    }
  }

  await db.updateTable('import_job').set({ status: 'VALIDATED' }).where('id', '=', jobId).execute()
  return {
    kurtarildi: true,
    sebep: 'Defter boş — hiçbir şey yazılmamış. Durum VALIDATED yapıldı, tekrar uygulanabilir.',
  }
}

// ═══════════════════════════════ UYGULAYICILAR ══════════════════════════════

type Ctx = {
  trx: Transaction<Database>
  g: Gunluk
  ledger: Ledger
  jobId: number
  sourceId: number
  engineKeyToId: Map<string, number>
  productSkuToId: Map<string, number>
  categoryCodeToId: Map<string, number>
  /** `lookupEngineByKey` için bir kez kurulan dizin (bkz. motorDiziniAl). */
  motorDizini: Map<string, number> | null
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

const str = (v: unknown): string | null =>
  v === null || v === undefined || v === '' ? null : String(v)
const num = (v: unknown): number | null =>
  v === null || v === undefined || v === '' ? null : Number(v)

/**
 * Kysely'nin bu sürümünde `ColumnType<...>` ile tanımlı kolonlar (TIMESTAMPTZ,
 * NUMERIC, JSONB) update/insert nesnesinde ham tipi bekliyor. Değerler zaten
 * doğrulama aşamasında tip kontrolünden geçtiği için burada dar bir kaçış
 * kullanılıyor; SQL üretimi değişmiyor.
 */
const col = <T>(v: T): never => v as never
/** jsonb kolonlar için: node-pg dizileri ARRAY'e çevirdiğinden açıkça JSON metni yazılır. */
const jsonb = (v: unknown): never => JSON.stringify(v ?? null) as never
const NOW = (): never => new Date() as never

/** `select ... where <ifade> = any(...)` için parça parça okuma. */
async function topluOku<T>(
  anahtarlar: readonly string[],
  parca: number,
  oku: (dilim: string[]) => Promise<T[]>,
): Promise<T[]> {
  const cikti: T[] = []
  for (const d of dilimle(anahtarlar, parca)) {
    cikti.push(...(await oku(d)))
  }
  return cikti
}

// ── KATEGORİ (satır satır — hiyerarşi bağımlılığı) ──────────────────────────

async function applyCategories(ctx: Ctx, rows: StagedRow[]): Promise<void> {
  for (const row of rows) await applyCategory(ctx, row)
}

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
      (
        await ctx.trx
          .selectFrom('category')
          .select('id')
          .where('code', '=', parentCode)
          .executeTakeFirst()
      )?.id
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
    const ins = await ctx.trx
      .insertInto('category')
      .values(payload)
      .returning('id')
      .executeTakeFirstOrThrow()
    id = ins.id
    record(ctx, 'category', id, 'INSERT', null, payload)
  }
  ctx.categoryCodeToId.set(code, id)

  const attrs = (n.attributes ?? []) as Array<{
    key: string
    label: string
    type: string
    unit: string | null
  }>
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
      record(
        ctx,
        'category_attribute',
        existingAttr.id,
        'UPDATE',
        pick(existingAttr, Object.keys(attrPayload)),
        attrPayload,
      )
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

// ── ARAÇ AĞACI (satır satır — marka→model→nesil→motor zinciri) ──────────────

async function applyVehicles(ctx: Ctx, rows: StagedRow[]): Promise<void> {
  for (const row of rows) await applyVehicle(ctx, row)
}

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
    await ctx.trx
      .updateTable('vehicle_model')
      .set(modelPayload)
      .where('id', '=', model.id)
      .execute()
    record(
      ctx,
      'vehicle_model',
      model.id,
      'UPDATE',
      pick(model, Object.keys(modelPayload)),
      modelPayload,
    )
  } else {
    model = await ctx.trx
      .insertInto('vehicle_model')
      .values(modelPayload)
      .returningAll()
      .executeTakeFirstOrThrow()
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
    await ctx.trx
      .updateTable('vehicle_engine')
      .set(enginePayload)
      .where('id', '=', engineId)
      .execute()
    record(
      ctx,
      'vehicle_engine',
      engineId,
      'UPDATE',
      pick(existingEngine, Object.keys(enginePayload)),
      enginePayload,
    )
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
  // Ağaç değişti: sonradan kurulacak motor dizini tazelensin.
  ctx.motorDizini = null
}

// ── ÜRÜN (toplu) ────────────────────────────────────────────────────────────

const URUN_ALANLARI = [
  'sku',
  'slug',
  'name',
  'product_code',
  'brand_id',
  'category_id',
  'short_description',
  'description',
  'specs',
  'status',
  'is_featured',
  'seo_title',
  'seo_description',
] as const

const URUN_KOLONLARI: GuncelKolon[] = [
  { ad: 'sku', tip: 'varchar' },
  { ad: 'slug', tip: 'varchar' },
  { ad: 'name', tip: 'varchar' },
  { ad: 'product_code', tip: 'varchar' },
  { ad: 'brand_id', tip: 'int4' },
  { ad: 'category_id', tip: 'int4' },
  { ad: 'short_description', tip: 'varchar' },
  { ad: 'description', tip: 'text' },
  { ad: 'specs', tip: 'jsonb' },
  { ad: 'status', tip: 'text', cast: 'product_status' },
  { ad: 'is_featured', tip: 'bool' },
  { ad: 'seo_title', tip: 'varchar' },
  { ad: 'seo_description', tip: 'varchar' },
  { ad: 'updated_at', tip: 'timestamptz' },
]

const DURUM_ESLEME: Record<string, 'DRAFT' | 'ACTIVE' | 'ARCHIVED'> = {
  TASLAK: 'DRAFT',
  AKTIF: 'ACTIVE',
  ARSIV: 'ARCHIVED',
}

async function applyProducts(ctx: Ctx, rows: StagedRow[]): Promise<void> {
  const { trx, g } = ctx

  // ── 1. Toplu okuma ────────────────────────────────────────────────────────
  g.asama('  ürün: mevcut kayıtlar okunuyor')
  const markalar = await trx.selectFrom('product_brand').select(['id', 'name']).execute()
  const markaByAd = new Map(markalar.map((m) => [m.name.toLowerCase(), m.id]))

  const kategoriler = await trx.selectFrom('category').select(['id', 'code']).execute()
  const kategoriByKod = new Map(kategoriler.map((k) => [k.code, k.id]))
  for (const [kod, id] of ctx.categoryCodeToId) kategoriByKod.set(kod, id)

  const skuNormlar = [...new Set(rows.map((r) => normalizeCode(String(r.normalized.sku))))]
  const mevcutUrunler = await topluOku(skuNormlar, 5000, (d) =>
    trx
      .selectFrom('product')
      .selectAll()
      .where(sql<boolean>`ocm_normalize_code(sku) = any(${d}::text[])`)
      .execute(),
  )
  const urunByNorm = new Map(mevcutUrunler.map((p) => [normalizeCode(p.sku), p]))
  g.bit(
    `${markalar.length} marka · ${kategoriler.length} kategori · ${mevcutUrunler.length} mevcut ürün`,
  )

  // ── 2. Eksik markaları toplu aç ───────────────────────────────────────────
  const yeniMarkaAdlari = [
    ...new Set(
      rows.map((r) => String(r.normalized.marka)).filter((ad) => !markaByAd.has(ad.toLowerCase())),
    ),
  ]
  if (yeniMarkaAdlari.length) {
    g.asama(`  ürün markası: ${yeniMarkaAdlari.length} yeni`)
    for (const dilim of dilimle(yeniMarkaAdlari, PARCA)) {
      const eklenen = await trx
        .insertInto('product_brand')
        .values(dilim.map((ad) => ({ name: ad, slug: slugify(ad) })))
        .returning(['id', 'name'])
        .execute()
      for (const m of eklenen) {
        markaByAd.set(m.name.toLowerCase(), m.id)
        record(ctx, 'product_brand', m.id, 'INSERT', null, { name: m.name, slug: slugify(m.name) })
      }
    }
    g.bit()
  }

  // ── 3. Farkı bellekte hesapla ─────────────────────────────────────────────
  type Yuk = Record<string, unknown>
  const eklenecek: Array<{ yuk: Yuk; skuNorm: string }> = []
  const guncellenecek: Array<{ id: number; yuk: Yuk; onceki: Record<string, unknown> }> = []
  let degismeyen = 0

  for (const row of rows) {
    const n = row.normalized
    const sku = String(n.sku)
    const skuNorm = normalizeCode(sku)
    const brandName = String(n.marka)
    const brandId = markaByAd.get(brandName.toLowerCase())
    if (brandId === undefined) throw new Error(`Ürün markası bulunamadı: ${brandName}`)

    const categoryCode = String(n.kategori_kodu)
    const categoryId = kategoriByKod.get(categoryCode)
    if (categoryId === undefined) throw new Error(`Kategori bulunamadı: ${categoryCode}`)

    const existing = urunByNorm.get(skuNorm)
    const specs = {
      ...((existing?.specs as unknown as Record<string, string> | null) ?? {}),
      ...((n.specs ?? {}) as Record<string, string>),
    }

    const yuk: Yuk = {
      sku,
      slug: str(n.slug) ?? slugify(`${brandName} ${str(n.urun_kodu) ?? sku}`),
      name: String(n.urun_adi),
      product_code: str(n.urun_kodu),
      brand_id: brandId,
      category_id: categoryId,
      short_description: str(n.kisa_aciklama),
      description: str(n.aciklama),
      specs,
      status: DURUM_ESLEME[String(n.durum ?? 'AKTIF')] ?? 'ACTIVE',
      is_featured: n.one_cikan === true,
      seo_title: str(n.seo_baslik),
      seo_description: str(n.seo_aciklama),
    }

    if (existing) {
      ctx.productSkuToId.set(skuNorm, existing.id)
      if (ayniMi(existing as Record<string, unknown>, yuk, URUN_ALANLARI)) {
        degismeyen++
        continue
      }
      guncellenecek.push({
        id: existing.id,
        yuk: { ...yuk, updated_at: new Date() },
        onceki: pick(existing as Record<string, unknown>, [...URUN_ALANLARI, 'updated_at']),
      })
    } else {
      eklenecek.push({ yuk, skuNorm })
    }
  }

  // ── 4. Toplu yazma ────────────────────────────────────────────────────────
  if (eklenecek.length) {
    g.asama(`  ürün: ${eklenecek.length} yeni ekleniyor`)
    for (const dilim of dilimle(eklenecek, PARCA)) {
      const eklenen = await trx
        .insertInto('product')
        .values(
          dilim.map((e) => ({ ...e.yuk, specs: jsonb(e.yuk.specs), updated_at: NOW() }) as never),
        )
        .returning(['id', 'sku'])
        .execute()
      for (const p of eklenen) {
        const norm = normalizeCode(p.sku)
        ctx.productSkuToId.set(norm, p.id)
        const kaynak = dilim.find((e) => e.skuNorm === norm)
        record(ctx, 'product', p.id, 'INSERT', null, kaynak?.yuk ?? { sku: p.sku })
      }

      /*
       * Varsayılan varyant — fiyat/stok sayfası gelmese bile ürün gösterilebilir
       * olsun. Yeni ürünle birlikte toplu açılır.
       */
      const varyantlar = eklenen.map((p) => ({
        product_id: p.id,
        sku: p.sku,
        name: null,
        is_default: true,
      }))
      const eklenenVaryant = await trx
        .insertInto('product_variant')
        .values(varyantlar)
        .returning(['id', 'product_id', 'sku'])
        .execute()
      for (const v of eklenenVaryant) {
        record(ctx, 'product_variant', v.id, 'INSERT', null, {
          product_id: v.product_id,
          sku: v.sku,
          name: null,
          is_default: true,
        })
      }
    }
    g.bit()
  }

  if (guncellenecek.length) {
    g.asama(`  ürün: ${guncellenecek.length} güncelleniyor`)
    await topluGuncelle(
      trx,
      'product',
      URUN_KOLONLARI,
      guncellenecek.map((u) => ({ id: u.id, ...u.yuk })),
      PARCA,
    )
    for (const u of guncellenecek) record(ctx, 'product', u.id, 'UPDATE', u.onceki, u.yuk)
    g.bit()
  }

  if (degismeyen) g.bilgi(`  ürün: ${degismeyen} satır değişmemiş, yazılmadı`)
}

// ── FİYAT & STOK (toplu) ────────────────────────────────────────────────────

const VARYANT_ALANLARI = [
  'product_id',
  'sku',
  'name',
  'barcode',
  'pack_size',
  'unit',
  'weight_gr',
] as const
const VARYANT_KOLONLARI: GuncelKolon[] = [
  { ad: 'product_id', tip: 'int8' },
  { ad: 'sku', tip: 'varchar' },
  { ad: 'name', tip: 'varchar' },
  { ad: 'barcode', tip: 'varchar' },
  { ad: 'pack_size', tip: 'numeric' },
  { ad: 'unit', tip: 'varchar' },
  { ad: 'weight_gr', tip: 'int4' },
]

const FIYAT_ALANLARI = [
  'variant_id',
  'price_net',
  'tax_rate',
  'list_price',
  'customer_group',
] as const
const FIYAT_KOLONLARI: GuncelKolon[] = [
  { ad: 'variant_id', tip: 'int8' },
  { ad: 'price_net', tip: 'numeric' },
  { ad: 'tax_rate', tip: 'int2' },
  { ad: 'list_price', tip: 'numeric' },
  { ad: 'customer_group', tip: 'varchar' },
]

const STOK_ALANLARI = ['variant_id', 'warehouse_code', 'quantity', 'lead_time_days'] as const
const STOK_KOLONLARI: GuncelKolon[] = [
  { ad: 'variant_id', tip: 'int8' },
  { ad: 'warehouse_code', tip: 'varchar' },
  { ad: 'quantity', tip: 'int4' },
  { ad: 'lead_time_days', tip: 'int2' },
  { ad: 'updated_at', tip: 'timestamptz' },
]

async function applyPriceStocks(ctx: Ctx, rows: StagedRow[]): Promise<void> {
  const { trx, g } = ctx

  // ── 1. Ürün kimlikleri ────────────────────────────────────────────────────
  g.asama('  fiyat/stok: ürünler eşleniyor')
  const urunNormlar = [...new Set(rows.map((r) => String(r.normalized.skuNorm)))]
  const eksik = urunNormlar.filter((s) => !ctx.productSkuToId.has(s))
  if (eksik.length) {
    const bulunan = await topluOku(eksik, 5000, (d) =>
      trx
        .selectFrom('product')
        .select(['id', 'sku'])
        .where(sql<boolean>`ocm_normalize_code(sku) = any(${d}::text[])`)
        .execute(),
    )
    for (const p of bulunan) ctx.productSkuToId.set(normalizeCode(p.sku), p.id)
  }
  for (const r of rows) {
    const norm = String(r.normalized.skuNorm)
    if (!ctx.productSkuToId.has(norm)) throw new Error(`Ürün bulunamadı: ${r.normalized.sku}`)
  }
  g.bit()

  // ── 2. Mevcut varyantlar ──────────────────────────────────────────────────
  g.asama('  fiyat/stok: mevcut varyantlar okunuyor')
  const urunIdler = [
    ...new Set(rows.map((r) => ctx.productSkuToId.get(String(r.normalized.skuNorm))!)),
  ]
  const varyantlar = await topluOku(urunIdler.map(String), 5000, (d) =>
    trx
      .selectFrom('product_variant')
      .selectAll()
      .where(sql<boolean>`product_id = any(${d}::bigint[])`)
      .execute(),
  )
  const varyantByNorm = new Map(varyantlar.map((v) => [normalizeCode(v.sku), v]))
  const varyantSayisiByUrun = new Map<number, number>()
  for (const v of varyantlar) {
    varyantSayisiByUrun.set(v.product_id, (varyantSayisiByUrun.get(v.product_id) ?? 0) + 1)
  }

  /*
   * Varyant araması ürüne değil, NORMALLEŞTİRİLMİŞ SKU'ya göre yapılır: bir
   * varyant sku'su başka bir ürüne bağlı olabilir ve eski davranış onu bulup
   * ürününü değiştiriyordu. Ürün kimliğiyle bulunamayanları ayrıca sorarak o
   * davranışı birebir koruyoruz.
   */
  const bulunmayan = [
    ...new Set(
      rows
        .map((r) => normalizeCode(String(r.normalized.variantSku)))
        .filter((s) => !varyantByNorm.has(s)),
    ),
  ]
  if (bulunmayan.length) {
    const ekstra = await topluOku(bulunmayan, 5000, (d) =>
      trx
        .selectFrom('product_variant')
        .selectAll()
        .where(sql<boolean>`ocm_normalize_code(sku) = any(${d}::text[])`)
        .execute(),
    )
    for (const v of ekstra) varyantByNorm.set(normalizeCode(v.sku), v)
  }
  g.bit(`${varyantByNorm.size} varyant`)

  // ── 3. Varyant farkı ──────────────────────────────────────────────────────
  type VYuk = Record<string, unknown>
  const varyantEkle: Array<{ yuk: VYuk; norm: string }> = []
  const varyantGuncelle: Array<{ id: number; yuk: VYuk; onceki: Record<string, unknown> }> = []
  const satirVaryantNorm: string[] = []
  let varyantDegismeyen = 0

  for (const row of rows) {
    const n = row.normalized
    const productId = ctx.productSkuToId.get(String(n.skuNorm))!
    const variantSku = String(n.variantSku)
    const norm = normalizeCode(variantSku)
    satirVaryantNorm.push(norm)

    const yuk: VYuk = {
      product_id: productId,
      sku: variantSku,
      name: str(n.varyant_adi),
      barcode: str(n.barkod),
      pack_size: num(n.ambalaj_miktari) ?? 1,
      unit: str(n.birim) ?? 'ADET',
      weight_gr: num(n.agirlik_gr),
    }

    const mevcut = varyantByNorm.get(norm)
    if (mevcut) {
      if (ayniMi(mevcut as Record<string, unknown>, yuk, VARYANT_ALANLARI)) varyantDegismeyen++
      else
        varyantGuncelle.push({
          id: mevcut.id,
          yuk,
          onceki: pick(mevcut as Record<string, unknown>, VARYANT_ALANLARI),
        })
    } else {
      const ilkMi = (varyantSayisiByUrun.get(productId) ?? 0) === 0
      varyantSayisiByUrun.set(productId, (varyantSayisiByUrun.get(productId) ?? 0) + 1)
      varyantEkle.push({ yuk: { ...yuk, is_default: ilkMi }, norm })
    }
  }

  if (varyantEkle.length) {
    g.asama(`  varyant: ${varyantEkle.length} yeni`)
    for (const dilim of dilimle(varyantEkle, PARCA)) {
      const eklenen = await trx
        .insertInto('product_variant')
        .values(dilim.map((e) => e.yuk as never))
        .returningAll()
        .execute()
      for (const v of eklenen) {
        varyantByNorm.set(normalizeCode(v.sku), v)
        const kaynak = dilim.find((e) => e.norm === normalizeCode(v.sku))
        record(
          ctx,
          'product_variant',
          v.id,
          'INSERT',
          null,
          pick(kaynak?.yuk ?? {}, VARYANT_ALANLARI),
        )
      }
    }
    g.bit()
  }
  if (varyantGuncelle.length) {
    g.asama(`  varyant: ${varyantGuncelle.length} güncelleniyor`)
    await topluGuncelle(
      trx,
      'product_variant',
      VARYANT_KOLONLARI,
      varyantGuncelle.map((u) => ({ id: u.id, ...u.yuk })),
      PARCA,
    )
    for (const u of varyantGuncelle) record(ctx, 'product_variant', u.id, 'UPDATE', u.onceki, u.yuk)
    g.bit()
  }
  if (varyantDegismeyen) g.bilgi(`  varyant: ${varyantDegismeyen} satır değişmemiş, yazılmadı`)

  // ── 4. Fiyat ve stok ──────────────────────────────────────────────────────
  const varyantIdler = [...new Set(satirVaryantNorm.map((s) => varyantByNorm.get(s)!.id))]

  g.asama('  fiyat/stok: mevcut fiyat ve stok okunuyor')
  const fiyatlar = await topluOku(varyantIdler.map(String), 5000, (d) =>
    trx
      .selectFrom('price')
      .selectAll()
      .where(sql<boolean>`variant_id = any(${d}::bigint[])`)
      .execute(),
  )
  const fiyatByAnahtar = new Map(fiyatlar.map((f) => [`${f.variant_id}|${f.customer_group}`, f]))
  const stoklar = await topluOku(varyantIdler.map(String), 5000, (d) =>
    trx
      .selectFrom('stock')
      .selectAll()
      .where(sql<boolean>`variant_id = any(${d}::bigint[])`)
      .execute(),
  )
  const stokByAnahtar = new Map(stoklar.map((s) => [`${s.variant_id}|${s.warehouse_code}`, s]))
  g.bit(`${fiyatlar.length} fiyat · ${stoklar.length} stok`)

  const fiyatEkle: Array<Record<string, unknown>> = []
  const fiyatGuncelle: Array<{
    id: number
    yuk: Record<string, unknown>
    onceki: Record<string, unknown>
  }> = []
  const stokEkle: Array<Record<string, unknown>> = []
  const stokGuncelle: Array<{
    id: number
    yuk: Record<string, unknown>
    onceki: Record<string, unknown>
  }> = []
  let fiyatDegismeyen = 0
  let stokDegismeyen = 0

  for (const [i, row] of rows.entries()) {
    const n = row.normalized
    const variant = varyantByNorm.get(satirVaryantNorm[i]!)!

    const group = str(n.musteri_grubu) ?? 'RETAIL'
    const fiyatYuk = {
      variant_id: variant.id,
      price_net: num(n.fiyat_net) ?? 0,
      tax_rate: num(n.kdv_orani) ?? 20,
      list_price: num(n.liste_fiyati),
      customer_group: group,
    }
    const mevcutFiyat = fiyatByAnahtar.get(`${variant.id}|${group}`)
    if (mevcutFiyat) {
      if (ayniMi(mevcutFiyat as Record<string, unknown>, fiyatYuk, FIYAT_ALANLARI))
        fiyatDegismeyen++
      else
        fiyatGuncelle.push({
          id: mevcutFiyat.id,
          yuk: fiyatYuk,
          onceki: pick(mevcutFiyat as Record<string, unknown>, FIYAT_ALANLARI),
        })
    } else {
      fiyatEkle.push(fiyatYuk)
    }

    const warehouse = str(n.depo_kodu) ?? 'MERKEZ'
    const stokYuk = {
      variant_id: variant.id,
      warehouse_code: warehouse,
      quantity: num(n.stok) ?? 0,
      lead_time_days: num(n.tedarik_suresi_gun),
    }
    const mevcutStok = stokByAnahtar.get(`${variant.id}|${warehouse}`)
    if (mevcutStok) {
      if (ayniMi(mevcutStok as Record<string, unknown>, stokYuk, STOK_ALANLARI)) stokDegismeyen++
      else
        stokGuncelle.push({
          id: mevcutStok.id,
          yuk: { ...stokYuk, updated_at: new Date() },
          onceki: pick(mevcutStok as Record<string, unknown>, [...STOK_ALANLARI, 'updated_at']),
        })
    } else {
      stokEkle.push(stokYuk)
    }
  }

  if (fiyatEkle.length) {
    g.asama(`  fiyat: ${fiyatEkle.length} yeni`)
    for (const dilim of dilimle(fiyatEkle, PARCA)) {
      const eklenen = await trx
        .insertInto('price')
        .values(dilim as never)
        .returning(['id', 'variant_id', 'customer_group'])
        .execute()
      for (const f of eklenen) {
        const kaynak = dilim.find(
          (d) => d.variant_id === f.variant_id && d.customer_group === f.customer_group,
        )
        record(ctx, 'price', f.id, 'INSERT', null, kaynak ?? {})
      }
    }
    g.bit()
  }
  if (fiyatGuncelle.length) {
    g.asama(`  fiyat: ${fiyatGuncelle.length} güncelleniyor`)
    await topluGuncelle(
      trx,
      'price',
      FIYAT_KOLONLARI,
      fiyatGuncelle.map((u) => ({ id: u.id, ...u.yuk })),
      PARCA,
    )
    for (const u of fiyatGuncelle) record(ctx, 'price', u.id, 'UPDATE', u.onceki, u.yuk)
    g.bit()
  }
  if (fiyatDegismeyen) g.bilgi(`  fiyat: ${fiyatDegismeyen} satır değişmemiş, yazılmadı`)

  if (stokEkle.length) {
    g.asama(`  stok: ${stokEkle.length} yeni`)
    for (const dilim of dilimle(stokEkle, PARCA)) {
      const eklenen = await trx
        .insertInto('stock')
        .values(dilim.map((s) => ({ ...s, updated_at: NOW() })) as never)
        .returning(['id', 'variant_id', 'warehouse_code'])
        .execute()
      for (const s of eklenen) {
        const kaynak = dilim.find(
          (d) => d.variant_id === s.variant_id && d.warehouse_code === s.warehouse_code,
        )
        record(ctx, 'stock', s.id, 'INSERT', null, kaynak ?? {})
      }
    }
    g.bit()
  }
  if (stokGuncelle.length) {
    g.asama(`  stok: ${stokGuncelle.length} güncelleniyor`)
    await topluGuncelle(
      trx,
      'stock',
      STOK_KOLONLARI,
      stokGuncelle.map((u) => ({ id: u.id, ...u.yuk })),
      PARCA,
    )
    for (const u of stokGuncelle) record(ctx, 'stock', u.id, 'UPDATE', u.onceki, u.yuk)
    g.bit()
  }
  if (stokDegismeyen) g.bilgi(`  stok: ${stokDegismeyen} satır değişmemiş, yazılmadı`)
}

// ── OEM & ÇAPRAZ (toplu) ────────────────────────────────────────────────────

const REFERANS_ALANLARI = [
  'product_id',
  'type',
  'brand_name',
  'vehicle_brand_id',
  'number',
  'normalized',
  'source_id',
  'import_job_id',
  'note',
] as const

const REFERANS_KOLONLARI: GuncelKolon[] = [
  { ad: 'brand_name', tip: 'varchar' },
  { ad: 'vehicle_brand_id', tip: 'int4' },
  { ad: 'number', tip: 'varchar' },
  { ad: 'source_id', tip: 'int4' },
  { ad: 'import_job_id', tip: 'int8' },
  { ad: 'note', tip: 'text' },
]

async function applyReferences(ctx: Ctx, rows: StagedRow[]): Promise<void> {
  const { trx, g } = ctx

  g.asama('  referans: ürünler ve mevcut kayıtlar okunuyor')
  await urunKimlikleriniYukle(
    ctx,
    rows.map((r) => String(r.normalized.skuNorm)),
  )

  const aracMarkalari = await trx.selectFrom('vehicle_brand').select(['id', 'name']).execute()
  const aracMarkaByAd = new Map(aracMarkalari.map((b) => [b.name.toLowerCase(), b.id]))

  const urunIdler = [
    ...new Set(rows.map((r) => ctx.productSkuToId.get(String(r.normalized.skuNorm))!)),
  ]
  const mevcutlar = await topluOku(urunIdler.map(String), 5000, (d) =>
    trx
      .selectFrom('product_reference')
      .selectAll()
      .where(sql<boolean>`product_id = any(${d}::bigint[])`)
      .execute(),
  )
  const byAnahtar = new Map(mevcutlar.map((r) => [`${r.product_id}|${r.type}|${r.normalized}`, r]))
  g.bit(`${mevcutlar.length} mevcut referans`)

  const ekle: Array<Record<string, unknown>> = []
  const guncelle: Array<{
    id: number
    yuk: Record<string, unknown>
    onceki: Record<string, unknown>
  }> = []
  let degismeyen = 0

  for (const row of rows) {
    const n = row.normalized
    const productId = ctx.productSkuToId.get(String(n.skuNorm))!
    const tip = String(n.tip)
    const yuk = {
      product_id: productId,
      type: tip,
      brand_name: String(n.marka),
      vehicle_brand_id:
        tip === 'OEM' ? (aracMarkaByAd.get(String(n.marka).toLowerCase()) ?? null) : null,
      number: String(n.numara),
      normalized: String(n.normalizedNumber),
      source_id: ctx.sourceId,
      import_job_id: ctx.jobId,
      note: str(n.not),
    }
    const mevcut = byAnahtar.get(`${productId}|${tip}|${yuk.normalized}`)
    if (mevcut) {
      if (ayniMi(mevcut as Record<string, unknown>, yuk, REFERANS_ALANLARI)) degismeyen++
      else
        guncelle.push({
          id: mevcut.id,
          yuk,
          onceki: pick(mevcut as Record<string, unknown>, REFERANS_ALANLARI),
        })
    } else {
      ekle.push(yuk)
      byAnahtar.set(`${productId}|${tip}|${yuk.normalized}`, { id: -1 } as never)
    }
  }

  if (ekle.length) {
    g.asama(`  referans: ${ekle.length} yeni`)
    for (const dilim of dilimle(ekle, PARCA)) {
      const eklenen = await trx
        .insertInto('product_reference')
        .values(dilim as never)
        .returning(['id', 'product_id', 'type', 'normalized'])
        .execute()
      for (const r of eklenen) {
        const kaynak = dilim.find(
          (d) =>
            d.product_id === r.product_id && d.type === r.type && d.normalized === r.normalized,
        )
        record(ctx, 'product_reference', r.id, 'INSERT', null, kaynak ?? {})
      }
    }
    g.bit()
  }
  if (guncelle.length) {
    g.asama(`  referans: ${guncelle.length} güncelleniyor`)
    await topluGuncelle(
      trx,
      'product_reference',
      REFERANS_KOLONLARI,
      guncelle.map((u) => ({ id: u.id, ...u.yuk })),
      PARCA,
    )
    for (const u of guncelle) record(ctx, 'product_reference', u.id, 'UPDATE', u.onceki, u.yuk)
    g.bit()
  }
  if (degismeyen) g.bilgi(`  referans: ${degismeyen} satır değişmemiş, yazılmadı`)
}

// ── UYUMLULUK İDDİASI (toplu) ───────────────────────────────────────────────
// DİKKAT: burada product_compatibility'ye YAZILMAZ. Yalnızca İDDİA üretilir;
// hangi iddianın kazandığına çözümleme motoru karar verir. Mimari korunur.
//
// SORGULARIN %82'Sİ BURADAN GELİYORDU: satır başına bir SELECT + bir UPDATE,
// 60.599 satır için 121.198 sorgu. Artık mevcut iddialar tek sorguyla okunur,
// fark bellekte hesaplanır ve yazma 1000'erlik parçalarla yapılır.

const IDDIA_ALANLARI = [
  'year_from',
  'year_to',
  'month_from',
  'month_to',
  'restriction',
  'note',
  'expanded_from',
  'is_active',
  'import_job_id',
] as const

const IDDIA_KOLONLARI: GuncelKolon[] = [
  { ad: 'import_job_id', tip: 'int8' },
  { ad: 'year_from', tip: 'int2' },
  { ad: 'year_to', tip: 'int2' },
  { ad: 'month_from', tip: 'int2' },
  { ad: 'month_to', tip: 'int2' },
  { ad: 'restriction', tip: 'text' },
  { ad: 'note', tip: 'text' },
  { ad: 'expanded_from', tip: 'text' },
  { ad: 'is_active', tip: 'bool' },
  { ad: 'asserted_at', tip: 'timestamptz' },
]

async function applyCompatibilities(ctx: Ctx, rows: StagedRow[]): Promise<void> {
  const { trx, g } = ctx

  g.asama('  uyumluluk: ürünler eşleniyor')
  await urunKimlikleriniYukle(
    ctx,
    rows.map((r) => String(r.normalized.skuNorm)),
  )
  g.bit()

  // ── Motor kimlikleri ──────────────────────────────────────────────────────
  // Doğrulama aşaması motor kimliklerini zaten çözmüş olur (`e.id`). `id` yalnızca
  // AYNI içe aktarmada VEHICLE sayfasıyla açılacak motorlarda boş gelir.
  type Hedef = {
    productId: number
    engineId: number
    assertionType: 'COMPATIBLE' | 'INCOMPATIBLE'
    yuk: Record<string, unknown>
  }
  const hedefler: Hedef[] = []
  let atlanan = 0

  g.asama(`  uyumluluk: ${rows.length} satır bellekte açılıyor`)
  for (const row of rows) {
    const n = row.normalized
    const productId = ctx.productSkuToId.get(String(n.skuNorm))!
    const engines = (n.engines ?? []) as Array<{ id: number | null; key: string; label: string }>
    const assertionType = String(n.assertionType) as 'COMPATIBLE' | 'INCOMPATIBLE'

    for (const e of engines) {
      const engineId = e.id ?? ctx.engineKeyToId.get(e.key) ?? (await motorAra(ctx, e.key))
      if (!engineId) {
        atlanan++
        continue
      }
      hedefler.push({
        productId,
        engineId,
        assertionType,
        yuk: {
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
        },
      })
    }
  }
  g.bit(`${hedefler.length} iddia${atlanan ? ` · ${atlanan} motoru bulunamayan atlandı` : ''}`)

  // ── Mevcut iddialar: TEK okuma ────────────────────────────────────────────
  g.asama('  uyumluluk: mevcut iddialar okunuyor')
  const urunIdler = [...new Set(hedefler.map((h) => h.productId))]
  const mevcutlar = await topluOku(urunIdler.map(String), 5000, (d) =>
    trx
      .selectFrom('compatibility_assertion')
      .selectAll()
      .where(sql<boolean>`product_id = any(${d}::bigint[])`)
      .where('source_id', '=', ctx.sourceId)
      .execute(),
  )
  const anahtar = (p: number, e: number, t: string): string => `${p}|${e}|${t}`
  const byAnahtar = new Map(
    mevcutlar.map((m) => [anahtar(m.product_id, m.engine_id, m.assertion_type), m]),
  )
  g.bit(`${mevcutlar.length} mevcut iddia`)

  // ── Fark ──────────────────────────────────────────────────────────────────
  const ekle: Array<Record<string, unknown>> = []
  const guncelle: Array<{
    id: number
    yuk: Record<string, unknown>
    onceki: Record<string, unknown>
  }> = []
  let degismeyen = 0
  const gorulen = new Set<string>()

  for (const h of hedefler) {
    const k = anahtar(h.productId, h.engineId, h.assertionType)
    if (gorulen.has(k)) continue // aynı dosyada tekrar eden iddia
    gorulen.add(k)

    const mevcut = byAnahtar.get(k)
    if (mevcut) {
      if (ayniMi(mevcut as Record<string, unknown>, h.yuk, IDDIA_ALANLARI)) {
        degismeyen++
        continue
      }
      guncelle.push({
        id: mevcut.id,
        yuk: { ...h.yuk, asserted_at: new Date() },
        onceki: pick(mevcut as Record<string, unknown>, [
          ...IDDIA_ALANLARI,
          'product_id',
          'engine_id',
          'source_id',
          'assertion_type',
          'asserted_at',
        ]),
      })
    } else {
      ekle.push(h.yuk)
    }
  }

  // ── Yazma ─────────────────────────────────────────────────────────────────
  if (ekle.length) {
    g.asama(`  uyumluluk: ${ekle.length} yeni iddia`)
    let yazilan = 0
    for (const dilim of dilimle(ekle, PARCA)) {
      const eklenen = await trx
        .insertInto('compatibility_assertion')
        .values(dilim.map((d) => ({ ...d, asserted_at: NOW() })) as never)
        .returning(['id', 'product_id', 'engine_id', 'assertion_type'])
        .execute()
      const kaynakByAnahtar = new Map(
        dilim.map((d) => [
          anahtar(d.product_id as number, d.engine_id as number, String(d.assertion_type)),
          d,
        ]),
      )
      for (const r of eklenen) {
        const k = anahtar(r.product_id, r.engine_id, r.assertion_type)
        record(ctx, 'compatibility_assertion', r.id, 'INSERT', null, kaynakByAnahtar.get(k) ?? {})
      }
      yazilan += dilim.length
      g.bilgi(`    ${yazilan}/${ekle.length} (%${Math.round((yazilan / ekle.length) * 100)})`)
    }
    g.bit()
  }
  if (guncelle.length) {
    g.asama(`  uyumluluk: ${guncelle.length} iddia güncelleniyor`)
    let yazilan = 0
    for (const dilim of dilimle(guncelle, PARCA)) {
      await topluGuncelle(
        trx,
        'compatibility_assertion',
        IDDIA_KOLONLARI,
        dilim.map((u) => ({ id: u.id, ...u.yuk })),
        PARCA,
      )
      yazilan += dilim.length
      g.bilgi(
        `    ${yazilan}/${guncelle.length} (%${Math.round((yazilan / guncelle.length) * 100)})`,
      )
    }
    for (const u of guncelle)
      record(ctx, 'compatibility_assertion', u.id, 'UPDATE', u.onceki, u.yuk)
    g.bit()
  }
  if (degismeyen) g.bilgi(`  uyumluluk: ${degismeyen} iddia değişmemiş, yazılmadı`)
}

// ─────────────────────────────── YARDIMCILAR ────────────────────────────────

/** Verilen normalleştirilmiş SKU'ların ürün kimliklerini toplu doldurur. */
async function urunKimlikleriniYukle(ctx: Ctx, normlar: string[]): Promise<void> {
  const eksik = [...new Set(normlar)].filter((s) => !ctx.productSkuToId.has(s))
  if (!eksik.length) return
  const bulunan = await topluOku(eksik, 5000, (d) =>
    ctx.trx
      .selectFrom('product')
      .select(['id', 'sku'])
      .where(sql<boolean>`ocm_normalize_code(sku) = any(${d}::text[])`)
      .execute(),
  )
  for (const p of bulunan) ctx.productSkuToId.set(normalizeCode(p.sku), p.id)
  const hala = eksik.filter((s) => !ctx.productSkuToId.has(s))
  if (hala.length) throw new Error(`Ürün bulunamadı: ${hala.slice(0, 5).join(', ')}`)
}

/**
 * `marka|model|motor` anahtarından motoru bulur (aynı import'ta oluşturulmadıysa).
 *
 * ESKİDEN: her çağrıda TÜM motorlar model+marka join'iyle çekiliyor, bellekte
 * aranıyor ve ISKALAR ÖNBELLEĞE ALINMIYORDU. Yani her ıska = 7.790 satırlık bir
 * sorgu. Bu dosyada hiç tetiklenmedi (motor kimlikleri doğrulamadan hazır
 * geliyor) ama tetiklendiği gün tek başına saatler ekleyecek bir mayındı.
 *
 * ARTIK: dizin BİR KEZ kurulur, ıskalar da önbelleğe alınır.
 */
async function motorAra(ctx: Ctx, key: string): Promise<number | null> {
  if (ctx.engineKeyToId.has(key)) return ctx.engineKeyToId.get(key) ?? null

  if (!ctx.motorDizini) {
    ctx.g.bilgi('  motor dizini kuruluyor (bir kez)')
    const rows = await ctx.trx
      .selectFrom('vehicle_engine as e')
      .innerJoin('vehicle_model as m', 'm.id', 'e.model_id')
      .innerJoin('vehicle_brand as b', 'b.id', 'm.brand_id')
      .select(['e.id', 'e.name', 'm.name as model_name', 'b.name as brand_name'])
      .execute()
    ctx.motorDizini = new Map(
      rows.map((r) => [
        `${normalizeName(r.brand_name)}|${normalizeName(r.model_name)}|${normalizeName(r.name)}`,
        r.id,
      ]),
    )
  }

  const hit = ctx.motorDizini.get(key) ?? null
  // Iska da önbelleğe alınır: aynı anahtar bir daha dizine bakmasın.
  if (hit !== null) ctx.engineKeyToId.set(key, hit)
  return hit
}

function pick(obj: Record<string, unknown>, keys: readonly string[]): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const k of keys) if (k in obj) out[k] = obj[k]
  return out
}

/** client.ts'teki sayaç — yoksa 0 döner (test ortamları için). */
function sorguSayisi(): number {
  const s = (globalThis as { __ocmSorgu?: { sayi: number } }).__ocmSorgu
  return s ? s.sayi : 0
}

const ISLEYICILER: Record<ImportSheet, (ctx: Ctx, rows: StagedRow[]) => Promise<void>> = {
  CATEGORY: applyCategories,
  VEHICLE: applyVehicles,
  PRODUCT: applyProducts,
  PRICE_STOCK: applyPriceStocks,
  REFERENCE: applyReferences,
  COMPATIBILITY: applyCompatibilities,
}
