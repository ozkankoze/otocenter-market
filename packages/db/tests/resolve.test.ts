import { beforeAll, beforeEach, afterAll, describe, expect, test } from 'vitest'
import type { Kysely } from 'kysely'
import type { Database } from '../src/types'
import { resolveCompatibility, rebuildEngineCategoryIndex } from '../src/resolve'
import {
  addAssertion,
  createTestDb,
  seedFixtures,
  setupTestDatabase,
  truncateAll,
  type Fixtures,
} from './helpers'

let db: Kysely<Database>
let fx: Fixtures

beforeAll(async () => {
  await setupTestDatabase()
  db = createTestDb()
}, 60_000)

afterAll(async () => {
  await db.destroy()
})

beforeEach(async () => {
  await truncateAll(db)
  fx = await seedFixtures(db)
})

async function compat(productId: number, engineId: number) {
  return db
    .selectFrom('product_compatibility')
    .selectAll()
    .where('product_id', '=', productId)
    .where('engine_id', '=', engineId)
    .executeTakeFirst()
}

async function openConflicts() {
  return db.selectFrom('data_conflict').selectAll().where('status', '=', 'OPEN').execute()
}

// ════════════════════════════════════════════════════════════════════════════
describe('Çözümleme motoru — tek kaynak', () => {
  test('tek COMPATIBLE iddia → SOURCED, güven kaynağın seviyesi kadar', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.CSV!,
    })
    await resolveCompatibility(db)

    const row = await compat(fx.productId, fx.engineId)
    expect(row?.status).toBe('SOURCED')
    expect(row?.confidence).toBe(50)
    expect(row?.has_conflict).toBe(false)
  })

  test('tek INCOMPATIBLE iddia → INCOMPATIBLE', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
      type: 'INCOMPATIBLE',
    })
    await resolveCompatibility(db)

    expect((await compat(fx.productId, fx.engineId))?.status).toBe('INCOMPATIBLE')
  })

  test('hiç iddia yoksa satır oluşmaz — "bilinmiyor" durumu', async () => {
    await resolveCompatibility(db)
    expect(await compat(fx.productId, fx.engineId)).toBeUndefined()
  })
})

// ════════════════════════════════════════════════════════════════════════════
describe('Çözümleme motoru — kaynak önceliği', () => {
  test('MANUAL her zaman kazanır → VERIFIED, güven 100', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.CSV!,
    })
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.MANUAL!,
      yearFrom: 2019,
      yearTo: 2023,
    })
    await resolveCompatibility(db)

    const row = await compat(fx.productId, fx.engineId)
    expect(row?.status).toBe('VERIFIED')
    expect(row?.confidence).toBe(100)
    expect(row?.year_from).toBe(2019)
    expect(row?.year_to).toBe(2023)
  })

  test('MANUAL INCOMPATIBLE derse, diğer kaynaklar UYUMLU dese bile INCOMPATIBLE', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
    })
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.MANUAL!,
      type: 'INCOMPATIBLE',
    })
    await resolveCompatibility(db)

    const row = await compat(fx.productId, fx.engineId)
    expect(row?.status).toBe('INCOMPATIBLE')
    expect(row?.has_conflict).toBe(false)
    expect(await openConflicts()).toHaveLength(0)
  })

  test('hemfikir iki kaynakta en yüksek güvenli kaynak kazanır', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.CSV!,
      yearFrom: 2018,
      yearTo: 2024,
      restriction: 'CSV kısıtı',
    })
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
      yearFrom: 2018,
      yearTo: 2024,
      restriction: 'TecDoc kısıtı',
    })
    await resolveCompatibility(db)

    const row = await compat(fx.productId, fx.engineId)
    expect(row?.status).toBe('SOURCED')
    expect(row?.confidence).toBe(90)
    expect(row?.restriction).toBe('TecDoc kısıtı')
    expect(row?.source_id).toBe(fx.sources.TECDOC)
  })
})

// ════════════════════════════════════════════════════════════════════════════
describe('Çözümleme motoru — ÇAKIŞMA (en kritik davranış)', () => {
  test('UYUMLU + UYUMSUZ çelişkisi → CONFLICTED, asla uyumlu değil', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
    })
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.MANN!,
      type: 'INCOMPATIBLE',
    })
    await resolveCompatibility(db)

    const row = await compat(fx.productId, fx.engineId)
    expect(row?.status).toBe('CONFLICTED')
    expect(row?.has_conflict).toBe(true)
    // Kritik güvence: çelişkili kayıt hiçbir koşulda "uyumlu" sayılmaz
    expect(['VERIFIED', 'SOURCED']).not.toContain(row?.status)
  })

  test('çelişki admin kuyruğuna düşer ve tüm adayları taşır', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
    })
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.MANN!,
      type: 'INCOMPATIBLE',
    })
    const result = await resolveCompatibility(db)

    expect(result.conflicts).toBe(1)
    const conflicts = await openConflicts()
    expect(conflicts).toHaveLength(1)
    expect(conflicts[0]?.entity_type).toBe('COMPATIBILITY')
    expect(conflicts[0]?.severity).toBe('HIGH')

    const candidates = conflicts[0]?.candidates as Array<{ sourceCode: string; value: string }>
    expect(candidates).toHaveLength(2)
    expect(candidates.map((c) => c.sourceCode).sort()).toEqual(['MANN', 'TECDOC'])
    // En güvenilir kaynak başta listelenir
    expect(candidates[0]?.sourceCode).toBe('TECDOC')
  })

  test('aynı çakışma iki kez çözümlemede tek kayıt üretir', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
    })
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.MANN!,
      type: 'INCOMPATIBLE',
    })
    await resolveCompatibility(db)
    await resolveCompatibility(db)

    expect(await openConflicts()).toHaveLength(1)
  })

  test('yıl aralıkları kesişmiyorsa → CONFLICTED', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
      yearFrom: 2018,
      yearTo: 2019,
    })
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.MANN!,
      yearFrom: 2022,
      yearTo: 2024,
    })
    await resolveCompatibility(db)

    expect((await compat(fx.productId, fx.engineId))?.status).toBe('CONFLICTED')
  })

  test('yıl aralıkları kesişiyorsa çakışma sayılmaz', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
      yearFrom: 2018,
      yearTo: 2024,
    })
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.MANN!,
      yearFrom: 2020,
      yearTo: 2022,
    })
    await resolveCompatibility(db)

    expect((await compat(fx.productId, fx.engineId))?.status).toBe('SOURCED')
  })

  test('çelişki giderilince kayıt SOURCED olur ve çakışma kapanır', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
    })
    const badId = await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.MANN!,
      type: 'INCOMPATIBLE',
    })
    await resolveCompatibility(db)
    expect((await compat(fx.productId, fx.engineId))?.status).toBe('CONFLICTED')

    // Admin, MANN iddiasını pasifleştiriyor
    await db
      .updateTable('compatibility_assertion')
      .set({ is_active: false })
      .where('id', '=', badId)
      .execute()
    await resolveCompatibility(db)

    expect((await compat(fx.productId, fx.engineId))?.status).toBe('SOURCED')
    expect(await openConflicts()).toHaveLength(0)
    const resolved = await db
      .selectFrom('data_conflict')
      .selectAll()
      .where('status', '=', 'RESOLVED')
      .execute()
    expect(resolved).toHaveLength(1)
  })

  test('pasif kaynak iddiaları hesaba katılmaz', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
    })
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.MANN!,
      type: 'INCOMPATIBLE',
    })
    await db
      .updateTable('data_source')
      .set({ is_active: false })
      .where('id', '=', fx.sources.MANN!)
      .execute()
    await resolveCompatibility(db)

    expect((await compat(fx.productId, fx.engineId))?.status).toBe('SOURCED')
  })
})

// ════════════════════════════════════════════════════════════════════════════
describe('Çözümleme motoru — kayıt yaşam döngüsü', () => {
  test('tüm iddialar pasifleşince kayıt silinir ("bilinmiyor"a döner)', async () => {
    const id = await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.CSV!,
    })
    await resolveCompatibility(db)
    expect(await compat(fx.productId, fx.engineId)).toBeDefined()

    await db
      .updateTable('compatibility_assertion')
      .set({ is_active: false })
      .where('id', '=', id)
      .execute()
    const result = await resolveCompatibility(db)

    expect(result.removed).toBe(1)
    expect(await compat(fx.productId, fx.engineId)).toBeUndefined()
  })

  test('çözümleme tekrar çalıştırıldığında sonuç değişmez (idempotent)', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
    })
    const first = await resolveCompatibility(db)
    const second = await resolveCompatibility(db)

    expect(first.resolved).toBe(second.resolved)
    const rows = await db.selectFrom('product_compatibility').selectAll().execute()
    expect(rows).toHaveLength(1)
  })

  test('farklı motorlar birbirinden bağımsız çözümlenir', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
    })
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId2,
      sourceId: fx.sources.TECDOC!,
      type: 'INCOMPATIBLE',
    })
    await resolveCompatibility(db)

    expect((await compat(fx.productId, fx.engineId))?.status).toBe('SOURCED')
    expect((await compat(fx.productId, fx.engineId2))?.status).toBe('INCOMPATIBLE')
  })
})

// ════════════════════════════════════════════════════════════════════════════
describe('Türetilmiş SEO indeksi', () => {
  test('yalnızca VERIFIED ve SOURCED sayılır; CONFLICTED sayfa doğurmaz', async () => {
    // Ürün 1 → uyumlu, Ürün 2 → çelişkili
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
    })
    await addAssertion(db, {
      productId: fx.productId2,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
    })
    await addAssertion(db, {
      productId: fx.productId2,
      engineId: fx.engineId,
      sourceId: fx.sources.MANN!,
      type: 'INCOMPATIBLE',
    })
    await resolveCompatibility(db)
    await rebuildEngineCategoryIndex(db)

    const idx = await db
      .selectFrom('engine_category_index')
      .selectAll()
      .where('engine_id', '=', fx.engineId)
      .executeTakeFirst()

    expect(idx?.product_count).toBe(1) // çelişkili ürün sayılmadı
    expect(idx?.verified_count).toBe(0)
  })

  test('ürünü olmayan araç×kategori için indeks satırı üretilmez', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.CSV!,
    })
    await resolveCompatibility(db)
    await rebuildEngineCategoryIndex(db)

    const rows = await db.selectFrom('engine_category_index').selectAll().execute()
    expect(rows).toHaveLength(1)
    expect(rows.every((r) => r.product_count > 0)).toBe(true)
    // İkinci motor için hiç kayıt yok → sayfa üretilmeyecek
    expect(rows.some((r) => r.engine_id === fx.engineId2)).toBe(false)
  })

  test('INCOMPATIBLE tek başına indeks satırı üretmez', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
      type: 'INCOMPATIBLE',
    })
    await resolveCompatibility(db)
    await rebuildEngineCategoryIndex(db)

    expect(await db.selectFrom('engine_category_index').selectAll().execute()).toHaveLength(0)
  })

  test('VERIFIED kayıtlar ayrıca sayılır', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.MANUAL!,
    })
    await resolveCompatibility(db)
    await rebuildEngineCategoryIndex(db)

    const idx = await db
      .selectFrom('engine_category_index')
      .selectAll()
      .where('engine_id', '=', fx.engineId)
      .executeTakeFirst()

    expect(idx?.product_count).toBe(1)
    expect(idx?.verified_count).toBe(1)
    expect(Number(idx?.min_price)).toBe(1200) // 1000 net + %20 KDV
  })
})

// ════════════════════════════════════════════════════════════════════════════
describe('Yanlış "uyumlu" gösterimine karşı güvence', () => {
  test('hiçbir çelişkili kayıt VERIFIED/SOURCED durumunda olamaz', async () => {
    // Çeşitli senaryoları aynı anda kur
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
    })
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.MANN!,
      type: 'INCOMPATIBLE',
    })
    await addAssertion(db, {
      productId: fx.productId2,
      engineId: fx.engineId2,
      sourceId: fx.sources.SUPPLIER!,
      yearFrom: 2018,
      yearTo: 2019,
    })
    await addAssertion(db, {
      productId: fx.productId2,
      engineId: fx.engineId2,
      sourceId: fx.sources.CSV!,
      yearFrom: 2022,
      yearTo: 2024,
    })
    await resolveCompatibility(db)

    const violating = await db
      .selectFrom('product_compatibility')
      .selectAll()
      .where('has_conflict', '=', true)
      .where('status', 'in', ['VERIFIED', 'SOURCED'])
      .execute()

    expect(violating).toHaveLength(0)
  })

  test('açık çakışma sayısı ile CONFLICTED kayıt sayısı eşittir', async () => {
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
    })
    await addAssertion(db, {
      productId: fx.productId,
      engineId: fx.engineId,
      sourceId: fx.sources.MANN!,
      type: 'INCOMPATIBLE',
    })
    await addAssertion(db, {
      productId: fx.productId2,
      engineId: fx.engineId,
      sourceId: fx.sources.TECDOC!,
    })
    await addAssertion(db, {
      productId: fx.productId2,
      engineId: fx.engineId,
      sourceId: fx.sources.SUPPLIER!,
      type: 'INCOMPATIBLE',
    })
    await resolveCompatibility(db)

    const conflicted = await db
      .selectFrom('product_compatibility')
      .selectAll()
      .where('status', '=', 'CONFLICTED')
      .execute()

    expect(conflicted).toHaveLength(2)
    expect(await openConflicts()).toHaveLength(2)
  })
})
