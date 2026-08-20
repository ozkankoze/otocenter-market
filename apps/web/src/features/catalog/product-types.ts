/**
 * Ürün kartı tipi — sunucu sorguları ve client bileşenleri ortak kullanır.
 * Veritabanı erişimi içermez, bu yüzden `server-only` değildir.
 */
import type { CompatibilityState } from '@/features/vehicle/types'

export type ProductCardData = {
  id: number
  sku: string
  slug: string
  name: string
  productCode: string | null
  brandName: string
  brandSlug: string
  categoryCode: string
  categoryName: string
  /** Birincil ürün görseli. Görseli olmayan ürünlerde null — kart yer tutucu gösterir. */
  imageUrl: string | null
  price: number
  listPrice: number | null
  stock: number
  leadTimeDays: number | null
  compatibility: CompatibilityState
  restriction: string | null
  /** Kartta gösterilecek teknik özellikler (kategori şemasına göre) */
  specs: Array<{ label: string; value: string }>
}
