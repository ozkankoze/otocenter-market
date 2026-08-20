/**
 * SPRINT 4 — IMPORT PIPELINE SENARYO TESTLERİ
 *
 * Kullanıcı şartı: test verisi gerçek katalog verisinden AYRIDIR.
 * Bütün testler ayrı `otocenter_test` veritabanında çalışır ve her testten
 * önce tablolar boşaltılır. Üretilen SKU/OEM/uyumluluk verisi sentetiktir.
 */
import { beforeAll, beforeEach, afterAll, describe, expect, it } from 'vitest'
import type { Kysely } from 'kysely'
import type { Database } from '../src/types'
import {
  createImportJob,
  commitImport,
  rollbackImport,
  parseWorkbook,
  validateParsed,
} from '../src/import'
import { createTestDb, seedFixtures, setupTestDatabase, truncateAll, type Fixtures } from './helpers'
import { compatRows, makeWorkbook, oemRows, priceRows, productRows, vehicleRows } from './import-fixtures'

let db: Kysely<Database>
let fx: Fixtures

beforeAll(async () => {
  await setupTestDatabase()
  db = createTestDb()
}, 120_000)

afterAll(async () => {
  await db.destroy()
})

beforeEach(async () => {
  await truncateAll(db)
  fx = await seedFixtures(db)
})

async function runImport(buffer: Buffer, sourceCode = 'CSV', fileName = 'test.xlsx') {
  const preview = await createImportJob(db, {
    fileName,
    buffer,
    sourceId: fx.sources[sourceCode]!,
  })
  return preview
}

// ════════════════ 1. 10 ÜRÜNLÜK BAŞARILI XLSX IMPORT ════════════════════════

describe('1. Başarılı XLSX import', () => {
  it('10 ürün + fiyat/stok eksiksiz uygulanır', async () => {
    const buffer = makeWorkbook({
      URUNLER: productRows(10),
      FIYAT_STOK: priceRows(10),
    })

    const preview = await runImport(buffer)
    expect(preview.totals.total).toBe(20)
    expect(preview.totals.error).toBe(0)
    expect(preview.totals.created).toBe(20)

    const result = await commitImport(db, preview.jobId)
    expect(result.applied).toBe(20)

    const products = await db
      .selectFrom('product')
      .select(['sku', 'name'])
      .where('sku', 'like', 'TEST-SKU-%')
      .execute()
    expect(products).toHaveLength(10)

    const prices = await db
      .selectFrom('price')
      .innerJoin('product_variant as v', 'v.id', 'price.variant_id')
      .innerJoin('product as p', 'p.id', 'v.product_id')
      .select(['price.price_net'])
      .where('p.sku', 'like', 'TEST-SKU-%')
      .execute()
    expect(prices).toHaveLength(10)

    const job = await db.selectFrom('import_job').selectAll().where('id', '=', preview.jobId).executeTakeFirstOrThrow()
    expect(job.status).toBe('COMPLETED')
  })
})

// ════════════════ 2. HATALI SATIR İÇEREN IMPORT ═════════════════════════════

describe('2. Hatalı satır import\'u bozmaz', () => {
  it('geçerli satırlar uygulanır, hatalı satırlar rapor edilir', async () => {
    const good = productRows(10)
    const bad = [
      // zorunlu alan boş
      { sku: 'TEST-BAD-1', urun_adi: '', marka: 'TESTMARKA', kategori_kodu: 'HAVA_FILTRESI' },
      // tanımsız kategori
      { sku: 'TEST-BAD-2', urun_adi: 'Kötü Ürün', marka: 'TESTMARKA', kategori_kodu: 'YOK_BOYLE_BIR_KATEGORI' },
      // SKU boş
      { sku: '', urun_adi: 'SKU yok', marka: 'TESTMARKA', kategori_kodu: 'HAVA_FILTRESI' },
    ]

    const preview = await runImport(makeWorkbook({ URUNLER: [...good, ...bad] }))

    expect(preview.totals.total).toBe(13)
    expect(preview.totals.error).toBe(3)
    expect(preview.totals.valid + preview.totals.warning).toBe(10)
    expect(preview.errorSamples.length).toBeGreaterThan(0)
    expect(preview.errorSamples.map((e) => e.code)).toContain('E_CATEGORY_NOT_FOUND')

    const result = await commitImport(db, preview.jobId)
    expect(result.applied).toBe(10)
    expect(result.skipped).toBe(3)

    const count = await db
      .selectFrom('product')
      .select(({ fn }) => fn.countAll<string>().as('n'))
      .where('sku', 'like', 'TEST-%')
      .executeTakeFirstOrThrow()
    expect(Number(count.n)).toBe(10) // hatalı 3 satır YAZILMADI

    // Hatalı satırlar staging'de kanıtla birlikte duruyor
    const errors = await db
      .selectFrom('import_staging_row')
      .select(['row_no', 'messages'])
      .where('import_job_id', '=', preview.jobId)
      .where('status', '=', 'ERROR')
      .execute()
    expect(errors).toHaveLength(3)
    expect(JSON.stringify(errors)).toContain('E_')
  })
})

// ════════════════ 3. DUPLICATE ÜRÜN ═════════════════════════════════════════

describe('3. Duplicate ürün', () => {
  it('aynı SKU dosyada iki kez geçerse ikincisi atlanır', async () => {
    const rows = productRows(3)
    const preview = await runImport(
      makeWorkbook({ URUNLER: [...rows, { ...rows[0]!, urun_adi: 'Tekrar eden satır' }] }),
    )

    expect(preview.totals.total).toBe(4)
    expect(preview.totals.duplicate).toBe(1)

    await commitImport(db, preview.jobId)
    const products = await db
      .selectFrom('product')
      .select(['sku', 'name'])
      .where('sku', 'like', 'TEST-SKU-%')
      .execute()
    expect(products).toHaveLength(3)
    // İlk satır geçerli; tekrar eden satırın adı YAZILMADI
    expect(products.map((p) => p.name)).not.toContain('Tekrar eden satır')
  })

  it('veritabanında zaten olan SKU güncelleme (UPDATE) olarak işaretlenir', async () => {
    await commitImport(db, (await runImport(makeWorkbook({ URUNLER: productRows(3) }))).jobId)

    const second = await runImport(
      makeWorkbook({ URUNLER: productRows(3).map((r) => ({ ...r, urun_adi: `${r.urun_adi} v2` })) }),
    )
    expect(second.totals.created).toBe(0)
    expect(second.totals.updated).toBe(3)

    await commitImport(db, second.jobId)
    const p = await db
      .selectFrom('product')
      .select('name')
      .where('sku', '=', 'TEST-SKU-0001')
      .executeTakeFirstOrThrow()
    expect(p.name).toContain('v2')
  })
})

// ════════════════ 4. DUPLICATE OEM ══════════════════════════════════════════

describe('4. Duplicate OEM tespiti', () => {
  it('aynı OEM numarası başka bir ürüne bağlıysa uyarı verilir', async () => {
    const first = await runImport(
      makeWorkbook({
        URUNLER: productRows(2),
        OEM_CAPRAZ: oemRows('TEST-SKU-0001', ['04E 129 620 A']),
      }),
    )
    await commitImport(db, first.jobId)

    // Aynı numarayı BAŞKA bir ürüne bağla
    const second = await runImport(
      makeWorkbook({ OEM_CAPRAZ: oemRows('TEST-SKU-0002', ['04e-129-620-a']) }),
    )
    const codes = second.warningSamples.map((w) => w.code)
    expect(codes).toContain('W_OEM_SHARED')
    expect(second.totals.oemShared).toBe(1)

    // Uyarı satırı yine de uygulanabilir (muadil ürünlerde normaldir)
    await commitImport(db, second.jobId)
    const refs = await db
      .selectFrom('product_reference')
      .select(['product_id'])
      .where('normalized', '=', '04E129620A')
      .execute()
    expect(refs).toHaveLength(2)
  })

  it('aynı numara aynı ürün için dosyada tekrar ederse atlanır', async () => {
    const preview = await runImport(
      makeWorkbook({
        URUNLER: productRows(1),
        OEM_CAPRAZ: oemRows('TEST-SKU-0001', ['04E 129 620 A', '04e129620a']),
      }),
    )
    expect(preview.totals.duplicate).toBe(1)
  })
})

// ════════════════ 5. BİRDEN FAZLA OEM ═══════════════════════════════════════

describe('5. Tek üründe çoklu OEM', () => {
  it('7 OEM numarası 7 ayrı satır olarak işlenir', async () => {
    const numbers = [
      '04E 129 620 A',
      '04E 129 620 B',
      '04E 129 620 C',
      '04E 129 620 D',
      '04E 129 620 E',
      '5Q0 129 620 B',
      '5Q0 129 620 C',
    ]
    const preview = await runImport(
      makeWorkbook({ URUNLER: productRows(1), OEM_CAPRAZ: oemRows('TEST-SKU-0001', numbers) }),
    )
    expect(preview.totals.error).toBe(0)
    await commitImport(db, preview.jobId)

    const refs = await db
      .selectFrom('product_reference as r')
      .innerJoin('product as p', 'p.id', 'r.product_id')
      .select(['r.number', 'r.normalized'])
      .where('p.sku', '=', 'TEST-SKU-0001')
      .execute()

    expect(refs).toHaveLength(7)
    // Görünen numara ORİJİNAL yazımıyla saklanır
    expect(refs.map((r) => r.number)).toContain('04E 129 620 A')
    // Arama için normalize edilmiş hali ayrıca tutulur
    expect(refs.map((r) => r.normalized)).toContain('04E129620A')
  })
})

// ════════════════ 6. BİRDEN FAZLA MOTOR UYUMLULUĞU ══════════════════════════

describe('6. Tek üründe çoklu motor uyumluluğu', () => {
  it('her ürün-motor ilişkisi ayrı iddia olur', async () => {
    const extraEngines = Array.from({ length: 8 }, (_, i) => ({
      code: `TSTC${i}`,
      name: `Test Motor ${i}`,
      hp: 90 + i * 5,
    }))

    const preview = await runImport(
      makeWorkbook({
        ARAC_AGACI: vehicleRows(extraEngines),
        URUNLER: productRows(1),
        UYUMLULUK: compatRows(
          'TEST-SKU-0001',
          [{ code: 'CHZB', name: '30 TFSI 1.0' }, ...extraEngines],
        ),
      }),
    )
    expect(preview.totals.error).toBe(0)
    await commitImport(db, preview.jobId)

    const assertions = await db
      .selectFrom('compatibility_assertion as a')
      .innerJoin('product as p', 'p.id', 'a.product_id')
      .select(['a.engine_id', 'a.assertion_type'])
      .where('p.sku', '=', 'TEST-SKU-0001')
      .execute()
    expect(assertions).toHaveLength(9)

    const compat = await db
      .selectFrom('product_compatibility as pc')
      .innerJoin('product as p', 'p.id', 'pc.product_id')
      .select(['pc.status'])
      .where('p.sku', '=', 'TEST-SKU-0001')
      .execute()
    expect(compat).toHaveLength(9)
    expect(compat.every((c) => c.status === 'SOURCED')).toBe(true)
  })

  it('TUM_MOTORLAR tek satırı modelin bütün motorlarına genişletir', async () => {
    const preview = await runImport(
      makeWorkbook({
        URUNLER: productRows(1),
        UYUMLULUK: [
          {
            sku: 'TEST-SKU-0001',
            uyumluluk_tipi: 'UYUMLU',
            arac_tipi: 'OTOMOBIL',
            arac_markasi: 'AUDI',
            model: 'A1 (GB)',
            motor_kodu: 'TUM_MOTORLAR',
          },
        ],
      }),
    )

    expect(preview.expansions).toHaveLength(1)
    expect(preview.expansions[0]!.engineCount).toBe(2) // fixture'daki 2 motor

    await commitImport(db, preview.jobId)
    const assertions = await db
      .selectFrom('compatibility_assertion as a')
      .innerJoin('product as p', 'p.id', 'a.product_id')
      .select(['a.expanded_from'])
      .where('p.sku', '=', 'TEST-SKU-0001')
      .execute()
    expect(assertions).toHaveLength(2)
    // Genişletmenin hangi satırdan geldiği izlenebilir kalır
    expect(assertions[0]!.expanded_from).toContain('TUM_MOTORLAR')
  })

  it('araç ağacında olmayan motor satırı HATA verir, diğer satırlar geçer', async () => {
    const preview = await runImport(
      makeWorkbook({
        URUNLER: productRows(1),
        UYUMLULUK: [
          ...compatRows('TEST-SKU-0001', [{ code: 'CHZB', name: '30 TFSI 1.0' }]),
          ...compatRows('TEST-SKU-0001', [{ code: 'YOKBOYLE', name: 'Olmayan Motor' }]),
        ],
      }),
    )
    expect(preview.totals.error).toBe(1)
    expect(preview.totals.missingVehicle).toBe(1)
    expect(preview.errorSamples.map((e) => e.code)).toContain('E_ENGINE_NOT_FOUND')

    await commitImport(db, preview.jobId)
    const assertions = await db
      .selectFrom('compatibility_assertion as a')
      .innerJoin('product as p', 'p.id', 'a.product_id')
      .select('a.id')
      .where('p.sku', '=', 'TEST-SKU-0001')
      .execute()
    expect(assertions).toHaveLength(1)
  })
})

// ════════════════ 7. ÇELİŞEN İKİ KAYNAK ═════════════════════════════════════

describe('7. İki kaynak çelişirse CONFLICTED', () => {
  it('UYUMLU + UYUMSUZ → CONFLICTED, arayüzde asla uyumlu gösterilmez', async () => {
    const a = await runImport(
      makeWorkbook({
        URUNLER: productRows(1),
        UYUMLULUK: compatRows('TEST-SKU-0001', [{ code: 'CHZB', name: '30 TFSI 1.0' }], 'UYUMLU'),
      }),
      'TECDOC',
    )
    await commitImport(db, a.jobId)

    const b = await runImport(
      makeWorkbook({
        UYUMLULUK: compatRows('TEST-SKU-0001', [{ code: 'CHZB', name: '30 TFSI 1.0' }], 'UYUMSUZ'),
      }),
      'SUPPLIER',
    )
    // Önizleme kullanıcıyı ÖNCEDEN uyarır
    expect(b.totals.conflictRisk).toBe(1)
    expect(b.warningSamples.map((w) => w.code)).toContain('W_CONFLICT_RISK')

    const result = await commitImport(db, b.jobId)
    expect(result.resolution.conflicts).toBeGreaterThan(0)

    const compat = await db
      .selectFrom('product_compatibility as pc')
      .innerJoin('product as p', 'p.id', 'pc.product_id')
      .select(['pc.status', 'pc.has_conflict'])
      .where('p.sku', '=', 'TEST-SKU-0001')
      .executeTakeFirstOrThrow()

    expect(compat.status).toBe('CONFLICTED')
    expect(compat.has_conflict).toBe(true)
    // KRİTİK: CONFLICTED asla "uyumlu" sayılmaz
    expect(['VERIFIED', 'SOURCED']).not.toContain(compat.status)

    const conflict = await db
      .selectFrom('data_conflict')
      .select(['status', 'entity_type'])
      .where('status', '=', 'OPEN')
      .executeTakeFirst()
    expect(conflict?.entity_type).toBe('COMPATIBILITY')
  })
})

// ════════════════ 8. UNKNOWN COMPATIBILITY ══════════════════════════════════

describe('8. Veri yoksa uyumluluk kaydı da yok', () => {
  it('iddia edilmeyen ürün-motor çifti için satır üretilmez', async () => {
    const preview = await runImport(
      makeWorkbook({
        URUNLER: productRows(1),
        UYUMLULUK: compatRows('TEST-SKU-0001', [{ code: 'CHZB', name: '30 TFSI 1.0' }]),
      }),
    )
    await commitImport(db, preview.jobId)

    const rows = await db
      .selectFrom('product_compatibility as pc')
      .innerJoin('product as p', 'p.id', 'pc.product_id')
      .select(['pc.engine_id', 'pc.status'])
      .where('p.sku', '=', 'TEST-SKU-0001')
      .execute()

    // Yalnızca iddia edilen motor için satır var
    expect(rows).toHaveLength(1)
    expect(rows[0]!.engine_id).toBe(fx.engineId)
    // İkinci motor için HİÇ satır yok → arayüzde gri "teyit edilmedi"
    expect(rows.some((r) => r.engine_id === fx.engineId2)).toBe(false)
  })
})

// ════════════════ 9. ROLLBACK ═══════════════════════════════════════════════

describe('9. Geri alma', () => {
  it('import geri alınınca ürünler, referanslar ve iddialar kalkar', async () => {
    const preview = await runImport(
      makeWorkbook({
        URUNLER: productRows(5),
        FIYAT_STOK: priceRows(5),
        OEM_CAPRAZ: oemRows('TEST-SKU-0001', ['11 22 33 A', '11 22 33 B']),
        UYUMLULUK: compatRows('TEST-SKU-0001', [{ code: 'CHZB', name: '30 TFSI 1.0' }]),
      }),
    )
    await commitImport(db, preview.jobId)

    const before = await db
      .selectFrom('product')
      .select(({ fn }) => fn.countAll<string>().as('n'))
      .where('sku', 'like', 'TEST-SKU-%')
      .executeTakeFirstOrThrow()
    expect(Number(before.n)).toBe(5)

    const result = await rollbackImport(db, preview.jobId)
    expect(result.deleted).toBeGreaterThan(0)

    const after = await db
      .selectFrom('product')
      .select(({ fn }) => fn.countAll<string>().as('n'))
      .where('sku', 'like', 'TEST-SKU-%')
      .executeTakeFirstOrThrow()
    expect(Number(after.n)).toBe(0)

    const assertions = await db.selectFrom('compatibility_assertion').select('id').execute()
    expect(assertions).toHaveLength(0)

    // İddia kalktı → çözümlenmiş uyumluluk da kalktı
    const compat = await db.selectFrom('product_compatibility').select('product_id').execute()
    expect(compat).toHaveLength(0)

    const job = await db.selectFrom('import_job').select('status').where('id', '=', preview.jobId).executeTakeFirstOrThrow()
    expect(job.status).toBe('ROLLED_BACK')
  })

  it('SONRAKİ bir import tarafından güncellenmiş kayıt geri alınmaz', async () => {
    const first = await runImport(makeWorkbook({ URUNLER: productRows(2) }))
    await commitImport(db, first.jobId)

    // İkinci import aynı ürünleri günceller
    const second = await runImport(
      makeWorkbook({ URUNLER: productRows(2).map((r) => ({ ...r, urun_adi: 'GÜNCEL AD' })) }),
    )
    await commitImport(db, second.jobId)

    // Şimdi BİRİNCİ import'u geri al
    const result = await rollbackImport(db, first.jobId)

    expect(result.skipped).toBeGreaterThan(0)
    expect(result.skippedDetails[0]!.reason).toContain('daha sonra güncelledi')

    // Ürünler DURUYOR ve ikinci import'un verisi KORUNDU
    const p = await db
      .selectFrom('product')
      .select('name')
      .where('sku', '=', 'TEST-SKU-0001')
      .executeTakeFirst()
    expect(p?.name).toBe('GÜNCEL AD')
  })
})

// ════════════════ 10. BÜYÜK DOSYA DRY-RUN ═══════════════════════════════════

describe('10. Büyük dosya dry-run', () => {
  it('5.000 satır doğrulanır ama onay verilmediği için production\'a yazılmaz', async () => {
    const N = 2500
    const buffer = makeWorkbook({
      URUNLER: productRows(N, 'BIG'),
      FIYAT_STOK: priceRows(N, 'BIG'),
    })

    const started = Date.now()
    const preview = await runImport(buffer, 'CSV', 'buyuk-dosya.xlsx')
    const elapsed = Date.now() - started

    expect(preview.totals.total).toBe(N * 2)
    expect(preview.totals.error).toBe(0)
    expect(preview.totals.created).toBe(N * 2)

    // ONAY VERİLMEDİ → production tabloları boş
    const products = await db
      .selectFrom('product')
      .select(({ fn }) => fn.countAll<string>().as('n'))
      .where('sku', 'like', 'BIG-%')
      .executeTakeFirstOrThrow()
    expect(Number(products.n)).toBe(0)

    // Ama her satır staging'de duruyor
    const staged = await db
      .selectFrom('import_staging_row')
      .select(({ fn }) => fn.countAll<string>().as('n'))
      .where('import_job_id', '=', preview.jobId)
      .executeTakeFirstOrThrow()
    expect(Number(staged.n)).toBe(N * 2)

    // Performans notu — regresyon yakalamak için gevşek bir sınır
    expect(elapsed).toBeLessThan(60_000)
  }, 120_000)

  it('ayrıştırma ve doğrulama veritabanına yazmadan da çalışır (saf dry-run)', async () => {
    const buffer = makeWorkbook({ URUNLER: productRows(50, 'DRY') })
    const parsed = parseWorkbook(buffer, 'dry.xlsx')
    const validation = await validateParsed(db, parsed, { sourceId: fx.sources.CSV! })

    expect(validation.totals.total).toBe(50)
    expect(validation.totals.error).toBe(0)

    const jobs = await db.selectFrom('import_job').select('id').execute()
    expect(jobs).toHaveLength(0)
  })
})
