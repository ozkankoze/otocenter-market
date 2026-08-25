import 'server-only'
import { unstable_cache } from 'next/cache'
import { db, sql } from '@ocm/db'
import type {
  VehicleBrandOption,
  VehicleEngineOption,
  VehicleModelOption,
  VehicleSelection,
  VehicleTypeOption,
} from '@/features/vehicle/types'

/** Yıl aralığını arayüz etiketine çevirir: 2018–2024 · 2018→ */
function yearLabel(from: number | null, to: number | null): string {
  if (!from && !to) return ''
  if (from && to) return `${from}–${to}`
  if (from) return `${from}→`
  return `→${to}`
}

/**
 * Araç tipleri her sayfada iki kez çekiliyordu (yerleşim + ana sayfa) ve
 * içerik kullanıcıya göre değişmiyor. Uzak veritabanında her sorgu ~89 ms;
 * hiç değişmeyen iki satır için ödenecek bir bedel değil.
 */
export const getVehicleTypes = unstable_cache(
  async (): Promise<VehicleTypeOption[]> =>
    db
      .selectFrom('vehicle_type')
      .select(['id', 'name', 'slug'])
      .where('is_active', '=', true)
      .orderBy('sort_order')
      .execute(),
  ['ocm-arac-tipleri'],
  { revalidate: 300, tags: ['katalog'] },
)

/** Ana sayfadaki sayaçlar — katalog verisiyle birlikte tazelenir. */
export const getCatalogStatsCached = unstable_cache(getCatalogStats, ['ocm-katalog-sayaclari'], {
  revalidate: 300,
  tags: ['katalog'],
})

/** Yalnızca seçilen araç tipinde modeli olan markalar döner. */
export async function getVehicleBrands(typeId: number): Promise<VehicleBrandOption[]> {
  const rows = await db
    .selectFrom('vehicle_brand as b')
    .innerJoin('vehicle_brand_type as bt', 'bt.brand_id', 'b.id')
    .select(['b.id', 'b.name', 'b.slug', 'b.is_popular'])
    .where('bt.type_id', '=', typeId)
    .where('b.is_active', '=', true)
    .orderBy('b.is_popular', 'desc')
    .orderBy('b.name')
    .execute()

  return rows.map((r) => ({ id: r.id, name: r.name, slug: r.slug, isPopular: r.is_popular }))
}

export async function getVehicleModels(brandId: number): Promise<VehicleModelOption[]> {
  const rows = await db
    .selectFrom('vehicle_model')
    .select(['id', 'name', 'slug', 'year_from', 'year_to'])
    .where('brand_id', '=', brandId)
    .where('is_active', '=', true)
    .orderBy('name')
    .execute()

  return rows.map((r) => {
    const years = yearLabel(r.year_from, r.year_to)
    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      // Nesil arayüzde ayrı adım DEĞİL — model etiketine gömülür
      label: years ? `${r.name} · ${years}` : r.name,
    }
  })
}

export async function getVehicleEngines(modelId: number): Promise<VehicleEngineOption[]> {
  const rows = await db
    .selectFrom('vehicle_engine')
    .select(['id', 'name', 'slug', 'year_from', 'year_to', 'fuel_type', 'engine_codes'])
    .where('model_id', '=', modelId)
    .where('is_active', '=', true)
    .orderBy('sort_order')
    .orderBy('name')
    .execute()

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    years: yearLabel(r.year_from, r.year_to),
    fuelType: r.fuel_type,
    engineCodes: r.engine_codes,
  }))
}

/** Motor kimliğinden tam seçim nesnesi kurar (cookie doğrulaması için). */
export async function resolveSelectionByEngineId(
  engineId: number,
): Promise<VehicleSelection | null> {
  const row = await db
    .selectFrom('vehicle_engine as e')
    .innerJoin('vehicle_model as m', 'm.id', 'e.model_id')
    .innerJoin('vehicle_brand as b', 'b.id', 'm.brand_id')
    .innerJoin('vehicle_brand_type as bt', 'bt.brand_id', 'b.id')
    .innerJoin('vehicle_type as t', 't.id', 'bt.type_id')
    .select([
      't.id as type_id',
      't.slug as type_slug',
      't.name as type_name',
      'b.id as brand_id',
      'b.slug as brand_slug',
      'b.name as brand_name',
      'm.id as model_id',
      'm.slug as model_slug',
      'm.name as model_name',
      'e.id as engine_id',
      'e.slug as engine_slug',
      'e.name as engine_name',
      'e.year_from',
      'e.year_to',
    ])
    .where('e.id', '=', engineId)
    .orderBy('t.sort_order')
    .limit(1)
    .executeTakeFirst()

  if (!row) return null

  return {
    typeId: row.type_id,
    typeSlug: row.type_slug,
    typeName: row.type_name,
    brandId: row.brand_id,
    brandSlug: row.brand_slug,
    brandName: row.brand_name,
    modelId: row.model_id,
    modelSlug: row.model_slug,
    modelName: row.model_name,
    engineId: row.engine_id,
    engineSlug: row.engine_slug,
    engineName: row.engine_name,
    years: yearLabel(row.year_from, row.year_to),
  }
}

/**
 * Seçili motor için kategori bazlı uyumlu ürün sayıları.
 * engine_category_index tek satır okumasıyla gelir — O(1).
 */
export async function getCompatibilitySummary(
  engineId: number,
): Promise<
  Array<{ categoryId: number; categoryCode: string; categoryName: string; count: number }>
> {
  const rows = await db
    .selectFrom('engine_category_index as i')
    .innerJoin('category as c', 'c.id', 'i.category_id')
    .select(['c.id as category_id', 'c.code', 'c.name', 'i.product_count'])
    .where('i.engine_id', '=', engineId)
    .where('i.product_count', '>', 0)
    .orderBy('i.product_count', 'desc')
    .execute()

  return rows.map((r) => ({
    categoryId: r.category_id,
    categoryCode: r.code,
    categoryName: r.name,
    count: r.product_count,
  }))
}

/** Araç ağacı istatistikleri — ana sayfadaki güven şeridi için. */
export async function getCatalogStats(): Promise<{
  products: number
  vehicleBrands: number
  productBrands: number
  compatibilities: number
}> {
  const result = await sql<{
    products: string
    vehicle_brands: string
    product_brands: string
    compatibilities: string
  }>`
    SELECT
      (SELECT count(*) FROM product WHERE status = 'ACTIVE')::text AS products,

      /*
       * Araç markası sayısı: kullanıcının GERÇEKTEN ulaşabildiği markalar.
       * Aktif olması yetmez; aktif bir araç tipine bağlı olması da gerekir.
       * Aksi hâlde kurulumdan kalan, hiçbir menüde görünmeyen demo markalar
       * (CATERPILLAR, JCB, …) sayıya girip vitrinde olduğundan fazla marka
       * varmış gibi gösteriyordu.
       */
      (SELECT count(DISTINCT b.id)
         FROM vehicle_brand b
         JOIN vehicle_brand_type bt ON bt.brand_id = b.id
         JOIN vehicle_type t        ON t.id = bt.type_id AND t.is_active
        WHERE b.is_active)::text AS vehicle_brands,

      /*
       * Ürün markası sayısı: SATILAN markalar. product_brand tablosunda
       * henüz ürünü olmayan kayıtlar da var; onları saymak "10 marka" deyip
       * vitrinde 2 marka göstermek anlamına geliyordu.
       */
      (SELECT count(DISTINCT b.id)
         FROM product_brand b
         JOIN product p ON p.brand_id = b.id AND p.status = 'ACTIVE'
        WHERE b.is_active)::text AS product_brands,

      (SELECT count(*) FROM product_compatibility
        WHERE status IN ('VERIFIED','SOURCED'))::text                AS compatibilities
  `.execute(db)

  const row = result.rows[0]
  return {
    products: Number(row?.products ?? 0),
    vehicleBrands: Number(row?.vehicle_brands ?? 0),
    productBrands: Number(row?.product_brands ?? 0),
    compatibilities: Number(row?.compatibilities ?? 0),
  }
}

/** Seçili motorun üretici kodları — seçili araç şeridinde gösterilir. */
export async function getEngineCodes(engineId: number): Promise<string[]> {
  const row = await db
    .selectFrom('vehicle_engine')
    .select('engine_codes')
    .where('id', '=', engineId)
    .executeTakeFirst()
  return row?.engine_codes ?? []
}
