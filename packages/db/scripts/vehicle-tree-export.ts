/**
 * ARAÇ AĞACI DIŞA AKTARIMI — KONTROL DOSYASI
 *
 * Veritabanındaki tür/marka/model ağacını XLSX olarak dışa aktarır.
 * Amaç: içe aktarılan ağacın gözle kontrol edilebilmesi. İçe aktarma
 * şablonu DEĞİLDİR; yalnızca okuma yapar, hiçbir tabloya yazmaz.
 *
 * Çalıştırma:
 *   npm run db:vehicle-tree:export            → otocenter-plan/arac-agaci-kontrol.xlsx
 *   OUT=/yol/dosya.xlsx npm run db:vehicle-tree:export
 */
import { loadEnv } from './env'
loadEnv()

import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { ARTIFACTS_DIR } from './paths'
import * as XLSX from 'xlsx'
import { sql } from 'kysely'
import { db, closeDb } from '../src/index'
import { REAL_BRANDS } from './seed-data/arac-agaci'

const OUT = process.env.OUT
  ? resolve(process.env.OUT)
  : resolve(ARTIFACTS_DIR, 'arac-agaci-kontrol.xlsx')

/** slug → kaynaktaki ham yazım (izlenebilirlik sütunu için) */
const sourceNames = new Map(REAL_BRANDS.map((b) => [b.slug ?? '', b.sourceName]))

async function main(): Promise<void> {
  const brands = await db
    .selectFrom('vehicle_brand as b')
    .leftJoin('vehicle_brand_type as bt', 'bt.brand_id', 'b.id')
    .leftJoin('vehicle_type as t', 't.id', 'bt.type_id')
    .select([
      'b.id as id',
      'b.name as name',
      'b.slug as slug',
      'b.country as country',
      'b.is_popular as is_popular',
      'b.is_active as is_active',
      'b.sort_order as sort_order',
      // string_agg ayıracı sabit metin; Kysely `lit()` bunu kabul etmediği için
      // ham SQL parçası kullanılıyor.
      sql<string>`string_agg(t.name, ' + ' ORDER BY t.sort_order)`.as('types'),
    ])
    .groupBy([
      'b.id',
      'b.name',
      'b.slug',
      'b.country',
      'b.is_popular',
      'b.is_active',
      'b.sort_order',
    ])
    .orderBy('b.sort_order')
    .orderBy('b.name')
    .execute()

  const models = await db
    .selectFrom('vehicle_model as m')
    .innerJoin('vehicle_brand as b', 'b.id', 'm.brand_id')
    .leftJoin('vehicle_engine as e', 'e.model_id', 'm.id')
    .select(({ fn }) => [
      'b.name as brand',
      'b.slug as brand_slug',
      'b.sort_order as brand_sort',
      'm.name as name',
      'm.slug as slug',
      'm.code as code',
      'm.year_from as year_from',
      'm.year_to as year_to',
      'm.is_active as is_active',
      'm.sort_order as sort_order',
      fn.count<string>('e.id').as('engine_count'),
    ])
    .groupBy([
      'b.name',
      'b.slug',
      'b.sort_order',
      'm.id',
      'm.name',
      'm.slug',
      'm.code',
      'm.year_from',
      'm.year_to',
      'm.is_active',
      'm.sort_order',
    ])
    .orderBy('b.sort_order')
    .orderBy('m.sort_order')
    .execute()

  const modelCountByBrand = new Map<string, number>()
  for (const m of models) {
    modelCountByBrand.set(m.brand_slug, (modelCountByBrand.get(m.brand_slug) ?? 0) + 1)
  }

  const brandRows = brands.map((b) => ({
    'Araç Türü': b.types ?? '—',
    Marka: b.name,
    Slug: b.slug,
    'Kaynaktaki Yazım': sourceNames.get(b.slug) ?? '(demo veri)',
    Ülke: b.country ?? '',
    'Model Sayısı': modelCountByBrand.get(b.slug) ?? 0,
    Popüler: b.is_popular ? 'EVET' : '',
    Durum: b.is_active ? 'AKTİF' : 'PASİF',
    Sıra: b.sort_order,
  }))

  const modelRows = models.map((m) => ({
    Marka: m.brand,
    Model: m.name,
    Slug: m.slug,
    'Gövde/Şasi Kodu': m.code ?? '',
    'Yıl Başl.': m.year_from ?? '',
    'Yıl Bit.': m.year_to ?? '',
    'Motor Sayısı': Number(m.engine_count),
    Durum: m.is_active ? 'AKTİF' : 'PASİF',
  }))

  const engineless = modelRows.filter((r) => r['Motor Sayısı'] === 0).length
  const ozet = [
    { Alan: 'Araç türü', Değer: new Set(brands.flatMap((b) => (b.types ?? '').split(' + '))).size },
    { Alan: 'Marka', Değer: brands.length },
    { Alan: 'Model', Değer: models.length },
    { Alan: 'Motoru olan model', Değer: models.length - engineless },
    { Alan: 'Motoru OLMAYAN model', Değer: engineless },
    {
      Alan: 'NOT',
      Değer:
        'Motor verisi kaynak ekran görüntülerinde yoktu. Motoru olmayan modeller ' +
        'araç seçicide motor adımına kadar gider ama seçim tamamlanamaz.',
    },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ozet), 'OZET')

  const wsBrands = XLSX.utils.json_to_sheet(brandRows)
  wsBrands['!cols'] = [
    { wch: 26 },
    { wch: 20 },
    { wch: 18 },
    { wch: 24 },
    { wch: 12 },
    { wch: 12 },
    { wch: 9 },
    { wch: 8 },
    { wch: 6 },
  ]
  XLSX.utils.book_append_sheet(wb, wsBrands, 'MARKALAR')

  const wsModels = XLSX.utils.json_to_sheet(modelRows)
  wsModels['!cols'] = [
    { wch: 18 },
    { wch: 46 },
    { wch: 46 },
    { wch: 20 },
    { wch: 10 },
    { wch: 10 },
    { wch: 12 },
    { wch: 8 },
  ]
  XLSX.utils.book_append_sheet(wb, wsModels, 'MODELLER')

  mkdirSync(dirname(OUT), { recursive: true })
  XLSX.writeFile(wb, OUT)

  console.log(`\n✓ ${OUT}`)
  console.log(`  ${brands.length} marka · ${models.length} model · ${engineless} model motorsuz\n`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(closeDb)
