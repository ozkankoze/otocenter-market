import type { SepetSorunu, ShippingPayer } from '@ocm/db'

/** `/api/sepet` yanıtı. Yalnızca TİP içe aktarılır — `@ocm/db` tarayıcıya girmez. */
export type SepetYaniti = {
  satirlar: Array<{
    variantId: number
    sku: string
    baslik: string
    slug: string
    gorsel: string | null
    adet: number
    birimKurus: number
    satirKurus: number
    stok: number
  }>
  sorunlar: SepetSorunu[]
  araToplamKurus: number
  kargoOdeyen: ShippingPayer
}

export function sorunMetni(s: SepetSorunu): string {
  switch (s.sebep) {
    case 'BULUNAMADI':
      return 'Bu ürün artık katalogda yok.'
    case 'SATISTA_DEGIL':
      return `${s.baslik} şu an satışta değil.`
    case 'FIYAT_YOK':
      return `${s.baslik} için fiyat bilgisi yok.`
    case 'STOK_YETERSIZ':
      return s.mevcutStok > 0
        ? `${s.baslik}: stokta yalnızca ${s.mevcutStok} adet kaldı.`
        : `${s.baslik} stokta kalmadı.`
  }
}
