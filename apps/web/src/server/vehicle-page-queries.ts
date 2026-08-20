import 'server-only'
import { db } from '@ocm/db'

export type VehicleTypePage = { id: number; name: string; slug: string }
export type VehicleBrandPage = { id: number; name: string; slug: string }
export type VehicleModelPage = {
  id: number
  name: string
  slug: string
  yearFrom: number | null
  yearTo: number | null
}
export type VehicleEnginePage = {
  id: number
  name: string
  slug: string
  engineCodes: string[]
  displacementCc: number | null
  powerKw: number | null
  powerHp: number | null
  fuelType: string
  yearFrom: number | null
  yearTo: number | null
}

export async function getVehicleTypeBySlug(slug: string): Promise<VehicleTypePage | null> {
  const row = await db
    .selectFrom('vehicle_type')
    .select(['id', 'name', 'slug'])
    .where('slug', '=', slug)
    .where('is_active', '=', true)
    .executeTakeFirst()
  return row ?? null
}

export async function getVehicleBrandBySlug(
  typeId: number,
  slug: string,
): Promise<VehicleBrandPage | null> {
  const row = await db
    .selectFrom('vehicle_brand as b')
    .innerJoin('vehicle_brand_type as bt', 'bt.brand_id', 'b.id')
    .select(['b.id', 'b.name', 'b.slug'])
    .where('b.slug', '=', slug)
    .where('bt.type_id', '=', typeId)
    .where('b.is_active', '=', true)
    .executeTakeFirst()
  return row ?? null
}

export async function getVehicleModelBySlug(
  brandId: number,
  slug: string,
): Promise<VehicleModelPage | null> {
  const row = await db
    .selectFrom('vehicle_model')
    .select(['id', 'name', 'slug', 'year_from', 'year_to'])
    .where('brand_id', '=', brandId)
    .where('slug', '=', slug)
    .where('is_active', '=', true)
    .executeTakeFirst()
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    yearFrom: row.year_from,
    yearTo: row.year_to,
  }
}

export async function getVehicleEngineBySlug(
  modelId: number,
  slug: string,
): Promise<VehicleEnginePage | null> {
  const row = await db
    .selectFrom('vehicle_engine')
    .select([
      'id',
      'name',
      'slug',
      'engine_codes',
      'displacement_cc',
      'power_kw',
      'power_hp',
      'fuel_type',
      'year_from',
      'year_to',
    ])
    .where('model_id', '=', modelId)
    .where('slug', '=', slug)
    .where('is_active', '=', true)
    .executeTakeFirst()
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    engineCodes: row.engine_codes,
    displacementCc: row.displacement_cc,
    powerKw: row.power_kw,
    powerHp: row.power_hp,
    fuelType: row.fuel_type,
    yearFrom: row.year_from,
    yearTo: row.year_to,
  }
}

/** Bir markanın modelleri — marka sayfası için. */
export async function getModelsOfBrand(brandId: number): Promise<VehicleModelPage[]> {
  const rows = await db
    .selectFrom('vehicle_model')
    .select(['id', 'name', 'slug', 'year_from', 'year_to'])
    .where('brand_id', '=', brandId)
    .where('is_active', '=', true)
    .orderBy('name')
    .execute()
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    yearFrom: r.year_from,
    yearTo: r.year_to,
  }))
}

/** Bir modelin motorları + her motorun uyumlu ürün sayısı (model sayfası). */
export async function getEnginesOfModel(
  modelId: number,
): Promise<Array<VehicleEnginePage & { productCount: number }>> {
  const rows = await db
    .selectFrom('vehicle_engine as e')
    .leftJoin('engine_category_index as i', 'i.engine_id', 'e.id')
    .select(({ fn }) => [
      'e.id',
      'e.name',
      'e.slug',
      'e.engine_codes',
      'e.displacement_cc',
      'e.power_kw',
      'e.power_hp',
      'e.fuel_type',
      'e.year_from',
      'e.year_to',
      fn.sum<string>('i.product_count').as('product_count'),
    ])
    .where('e.model_id', '=', modelId)
    .where('e.is_active', '=', true)
    .groupBy(['e.id', 'e.name', 'e.slug', 'e.sort_order'])
    .orderBy('e.sort_order')
    .execute()

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    engineCodes: r.engine_codes,
    displacementCc: r.displacement_cc,
    powerKw: r.power_kw,
    powerHp: r.power_hp,
    fuelType: r.fuel_type,
    yearFrom: r.year_from,
    yearTo: r.year_to,
    productCount: Number(r.product_count ?? 0),
  }))
}

/** Bir markanın araç tipleri — breadcrumb ve navigasyon için. */
export async function getBrandsOfType(
  typeId: number,
): Promise<Array<{ id: number; name: string; slug: string; isPopular: boolean }>> {
  const rows = await db
    .selectFrom('vehicle_brand as b')
    .innerJoin('vehicle_brand_type as bt', 'bt.brand_id', 'b.id')
    .select(['b.id', 'b.name', 'b.slug', 'b.is_popular'])
    .where('bt.type_id', '=', typeId)
    .where('b.is_active', '=', true)
    .orderBy('b.is_popular', 'desc')
    .orderBy('b.name')
    .execute()
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    isPopular: r.is_popular,
  }))
}

/**
 * Motorun kategori bazlı uyumlu ürün sayıları.
 * engine_category_index'ten okunur — product_count = 0 olan satır zaten yoktur,
 * yani "ürünsüz sayfa üretme" kuralı burada da doğal olarak uygulanır.
 */
export async function getEngineCategoryCounts(
  engineId: number,
): Promise<Array<{ categoryId: number; name: string; slug: string; productCount: number }>> {
  const rows = await db
    .selectFrom('engine_category_index as i')
    .innerJoin('category as c', 'c.id', 'i.category_id')
    .select(['c.id', 'c.name', 'c.slug', 'i.product_count'])
    .where('i.engine_id', '=', engineId)
    .where('i.product_count', '>', 0)
    .orderBy('i.product_count', 'desc')
    .execute()

  return rows.map((r) => ({
    categoryId: r.id,
    name: r.name,
    slug: r.slug,
    productCount: r.product_count,
  }))
}
