/**
 * ════════════════════════════════════════════════════════════════════════════
 *  GEELY ÜRÜN VERİSİ — KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Kurallar `urunler-alfa-romeo.ts` ile aynıdır: fiyatlar KDV DAHİL vitrin
 *  fiyatıdır, OEM ve teknik ölçü yoktur, parça kodu görünmeyen ürün İÇE
 *  AKTARILMAZ. Yalnızca STOKTAKİ ürünler alındı (?stoktakiler=1).
 *
 *  Kaynağın HTML'i okundu. Kart başlığı bazen eksik geliyor; ayrıştırıcı önce
 *  bağlantının `title` özniteliğini, olmazsa görselin `alt` metnini deniyor.
 *  Kategori adının yedi yazımı için `urunler-bmw.ts` başındaki nota bakınız.
 *
 *  ⚠ SUNUCU KISITLAMASI: eşzamanlı istek sayısı yükseltilince kaynak BOŞ sayfa
 *  döndürüyor ve bu, "bu motorda ürün yok" gibi görünüyor. Bu yüzden çekimde
 *  her sayfanın "Toplam N ürün" işareti okunup kart sayısıyla karşılaştırıldı;
 *  tutmayan sayfa KAYDEDİLMEDİ, yeniden çekildi. Sonuçta 665 motorun hiçbiri
 *  ürünsüz değil.
 */
import type { SourceProduct } from './urunler-alfa-romeo'

export const GEELY_PRODUCTS: Record<string, SourceProduct> = {
  'FILTRON:AP180/4': {
    brand: 'FILTRON',
    code: 'AP180/4',
    category: 'HAVA_FILTRESI',
    priceGross: 866.36,
  },
  'FILTRON:OE662/4': {
    brand: 'FILTRON',
    code: 'OE662/4',
    category: 'YAG_FILTRESI',
    priceGross: 411.47,
  },
  'MANN:C29021': {
    brand: 'MANN-FILTER',
    code: 'C29021',
    category: 'HAVA_FILTRESI',
    priceGross: 1072.06,
  },
  'MANN:HU8014z': {
    brand: 'MANN-FILTER',
    code: 'HU8014z',
    category: 'YAG_FILTRESI',
    priceGross: 459.25,
  },
}

const M1 = 'Tugella'

export const GEELY_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: '2.0T 175kw 238hp',
    products: ['FILTRON:AP180/4', 'FILTRON:OE662/4', 'MANN:C29021', 'MANN:HU8014z'],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const GEELY_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
