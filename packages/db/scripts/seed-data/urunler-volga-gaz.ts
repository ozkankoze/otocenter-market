/**
 * ════════════════════════════════════════════════════════════════════════════
 *  VOLGA ÜRÜN VERİSİ — KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Kurallar `urunler-alfa-romeo.ts` ile aynıdır: fiyatlar KDV DAHİL vitrin
 *  fiyatıdır, OEM ve teknik ölçü yoktur, parça kodu görünmeyen ürün İÇE
 *  AKTARILMAZ. Yalnızca STOKTAKİ ürünler alındı (?stoktakiler=1).
 *
 *  Bu partide üç KORUMA çalıştı (ayrıntı: veri/BEKLEYEN-IS.md):
 *   • Her sayfanın kendi "Toplam N ürün" sayacı kart sayısıyla karşılaştırıldı;
 *     tutmayan sayfa kaydedilmedi, yeniden çekildi.
 *   • Sayfalanmış motor sayfaları (Iveco Daily) tüm sayfalarıyla toplandı.
 *   • Kategori yazımı çelişen ürünlerde ÇOĞUNLUK, berabere kalırsa üretici kod
 *     ailesi karar verdi.
 */
import type { SourceProduct } from './urunler-alfa-romeo'

export const VOLGA_PRODUCTS: Record<string, SourceProduct> = {
  'FILTRON:OE688': {
    brand: 'FILTRON',
    code: 'OE688',
    category: 'YAG_FILTRESI',
    priceGross: 201.5,
  },
  'MANN:HU7008z': {
    brand: 'MANN-FILTER',
    code: 'HU7008z',
    category: 'YAG_FILTRESI',
    priceGross: 277.29,
  },
}

const M1 = 'Gazelle Next'

export const VOLGA_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: '2.0 100kw 136hp',
    products: ['FILTRON:OE688', 'MANN:HU7008z'],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const VOLGA_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
