/** Araç seçici adımlarının ortak tipleri. */

export type VehicleTypeOption = {
  id: number
  name: string
  slug: string
}

export type VehicleBrandOption = {
  id: number
  name: string
  slug: string
  isPopular: boolean
}

export type VehicleModelOption = {
  id: number
  name: string
  slug: string
  /** Arayüzde gösterilen etiket: 'A1 (GB) · 2018→' — nesil bilgisi buraya gömülür */
  label: string
}

export type VehicleEngineOption = {
  id: number
  name: string
  slug: string
  /** '2018–2024' */
  years: string
  fuelType: string
  engineCodes: string[]
}

/** Kullanıcının tamamlanmış araç seçimi — cookie'de saklanan yapı. */
export type VehicleSelection = {
  typeId: number
  typeSlug: string
  typeName: string
  brandId: number
  brandSlug: string
  brandName: string
  modelId: number
  modelSlug: string
  modelName: string
  engineId: number
  engineSlug: string
  engineName: string
  years: string
}

/**
 * Ürün kartında gösterilecek uyumluluk durumu.
 * KURAL: yalnızca 'compatible' yeşil rozet alır.
 * CONFLICTED veri 'unknown' olarak gelir — asla uyumlu gösterilmez.
 */
export type CompatibilityState = 'compatible' | 'unknown' | 'incompatible'

export const VEHICLE_COOKIE = 'ocm.vehicle'
