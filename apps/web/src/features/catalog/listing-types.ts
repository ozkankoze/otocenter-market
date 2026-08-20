/**
 * Listeleme tipleri — hem sunucu sorguları hem de client bileşenleri
 * tarafından kullanılır. Bu dosya `server-only` DEĞİLDİR; içinde
 * veritabanı erişimi bulunmaz, yalnızca tip ve sabit tanımları vardır.
 */
import type { ProductCardData } from '@/features/catalog/product-types'

export type SortKey = 'onerilen' | 'fiyat-artan' | 'fiyat-azalan' | 'yeni' | 'marka'

export const SORT_OPTIONS: Array<{ key: SortKey; label: string }> = [
  { key: 'onerilen', label: 'Önerilen' },
  { key: 'fiyat-artan', label: 'Fiyat: Artan' },
  { key: 'fiyat-azalan', label: 'Fiyat: Azalan' },
  { key: 'yeni', label: 'Yeni Eklenenler' },
  { key: 'marka', label: 'Marka (A-Z)' },
]

export type ListingFilters = {
  /** Ürün markası slug'ları */
  brands: string[]
  priceMin: number | null
  priceMax: number | null
  /** Yalnızca stokta olanlar */
  inStock: boolean
  /** Yalnızca seçili araca uyumlu olanlar (araç seçiliyse) */
  compatibleOnly: boolean
  /** Teknik özellik filtreleri: { filtre_tipi: ['Panel'], viskozite: ['5W-30'] } */
  specs: Record<string, string[]>
}

export type FacetValue = { value: string; label: string; count: number }

export type ListingFacets = {
  brands: Array<{ slug: string; name: string; count: number }>
  price: { min: number; max: number }
  stock: { inStock: number; outOfStock: number }
  compatibility: { compatible: number; unknown: number; incompatible: number } | null
  specs: Array<{
    key: string
    label: string
    unit: string | null
    values: FacetValue[]
  }>
}

export type ListingResult = {
  products: ProductCardData[]
  total: number
  page: number
  pageSize: number
  facets: ListingFacets
}

export const EMPTY_FILTERS: ListingFilters = {
  brands: [],
  priceMin: null,
  priceMax: null,
  inStock: false,
  compatibleOnly: false,
  specs: {},
}

/**
 * Uygulanmış filtre sayısı.
 *
 * Hem sunucu bileşenleri (boş durum metnini seçmek için) hem de istemci
 * bileşenleri (çip sayacı) kullanır; bu yüzden `'use client'` işaretli bir
 * dosyada DEĞİL, burada durur.
 */
export function countActive(filters: ListingFilters): number {
  return (
    filters.brands.length +
    (filters.priceMin !== null || filters.priceMax !== null ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.compatibleOnly ? 1 : 0) +
    Object.values(filters.specs).reduce((a, v) => a + v.length, 0)
  )
}
