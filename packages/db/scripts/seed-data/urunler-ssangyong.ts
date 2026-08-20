/**
 * ════════════════════════════════════════════════════════════════════════════
 *  SSANGYONG ÜRÜN VERİSİ — KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const SSANGYONG_PRODUCTS: Record<string, SourceProduct> = {
  'FILTRON:AP194/2': {
    brand: 'FILTRON',
    code: 'AP194/2',
    category: 'HAVA_FILTRESI',
    priceGross: 531.51,
  },
  'FILTRON:K1309-2x': {
    brand: 'FILTRON',
    code: 'K1309-2x',
    category: 'POLEN_FILTRESI',
    priceGross: 702.89,
  },
  'FILTRON:OE640/3': {
    brand: 'FILTRON',
    code: 'OE640/3',
    category: 'YAG_FILTRESI',
    priceGross: 177.89,
  },
  'FILTRON:PP838/4': {
    brand: 'FILTRON',
    code: 'PP838/4',
    category: 'YAKIT_FILTRESI',
    priceGross: 637.81,
  },
  'MANN:C30171': {
    brand: 'MANN-FILTER',
    code: 'C30171',
    category: 'HAVA_FILTRESI',
    priceGross: 1017.94,
  },
  'MANN:CU22009-2': {
    brand: 'MANN-FILTER',
    code: 'CU22009-2',
    category: 'POLEN_FILTRESI',
    priceGross: 934.93,
  },
  'MANN:HU727/1x': {
    brand: 'MANN-FILTER',
    code: 'HU727/1x',
    category: 'YAG_FILTRESI',
    priceGross: 293.08,
  },
  'MANN:WK829/3': {
    brand: 'MANN-FILTER',
    code: 'WK829/3',
    category: 'YAKIT_FILTRESI',
    priceGross: 1109.68,
  },
  'MANN:WK829/6': {
    brand: 'MANN-FILTER',
    code: 'WK829/6',
    category: 'YAKIT_FILTRESI',
    priceGross: 2531.74,
  },
}

const M1 = 'Actyon'
const M2 = 'Korando'
const M3 = 'Kyron'

export const SSANGYONG_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: '2.0 110kw 150hp',
    products: ['FILTRON:AP194/2', 'FILTRON:K1309-2x', 'MANN:C30171', 'MANN:CU22009-2'],
  },
  {
    model: M1,
    engine: '2.0 Xdi 104kw 141hp',
    products: [
      'FILTRON:AP194/2',
      'FILTRON:K1309-2x',
      'FILTRON:OE640/3',
      'FILTRON:PP838/4',
      'MANN:C30171',
      'MANN:CU22009-2',
      'MANN:HU727/1x',
      'MANN:WK829/3',
      'MANN:WK829/6',
    ],
  },
  {
    model: M1,
    engine: '2.0 Xdi 110kw 150hp',
    products: ['FILTRON:AP194/2', 'FILTRON:K1309-2x', 'MANN:C30171', 'MANN:CU22009-2'],
  },
  {
    model: M1,
    engine: '2.0 Xdi 114kw 155hp',
    products: ['FILTRON:AP194/2', 'FILTRON:K1309-2x', 'MANN:C30171', 'MANN:CU22009-2'],
  },
  {
    model: M1,
    engine: '2.3 110kw 150hp',
    products: [
      'FILTRON:AP194/2',
      'FILTRON:K1309-2x',
      'FILTRON:OE640/3',
      'MANN:C30171',
      'MANN:CU22009-2',
      'MANN:HU727/1x',
    ],
  },
  {
    model: M2,
    engine: '2.3 105kw 143hp',
    products: ['FILTRON:OE640/3', 'MANN:HU727/1x'],
  },
  {
    model: M2,
    engine: '2.3 110kw 150hp',
    products: ['FILTRON:OE640/3', 'MANN:HU727/1x'],
  },
  {
    model: M3,
    engine: '2.3 110kw 150hp',
    products: ['FILTRON:K1309-2x', 'FILTRON:OE640/3', 'MANN:CU22009-2', 'MANN:HU727/1x'],
  },
  {
    model: M3,
    engine: '2.7 Xdi 121kw 165hp',
    products: [
      'FILTRON:AP194/2',
      'FILTRON:K1309-2x',
      'FILTRON:OE640/3',
      'FILTRON:PP838/4',
      'MANN:C30171',
      'MANN:CU22009-2',
      'MANN:HU727/1x',
      'MANN:WK829/3',
      'MANN:WK829/6',
    ],
  },
  {
    model: M3,
    engine: '200 Xdi 104kw 141hp',
    products: [
      'FILTRON:AP194/2',
      'FILTRON:K1309-2x',
      'FILTRON:OE640/3',
      'FILTRON:PP838/4',
      'MANN:C30171',
      'MANN:CU22009-2',
      'MANN:HU727/1x',
      'MANN:WK829/3',
      'MANN:WK829/6',
    ],
  },
  {
    model: M3,
    engine: '3.2 M320 162kw 220hp',
    products: [
      'FILTRON:AP194/2',
      'FILTRON:K1309-2x',
      'FILTRON:OE640/3',
      'MANN:C30171',
      'MANN:CU22009-2',
      'MANN:HU727/1x',
    ],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const SSANGYONG_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
