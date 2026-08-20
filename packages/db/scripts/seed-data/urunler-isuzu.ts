/**
 * ════════════════════════════════════════════════════════════════════════════
 *  ISUZU ÜRÜN VERİSİ — KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const ISUZU_PRODUCTS: Record<string, SourceProduct> = {
  'FILTRON:AP120/2': {
    brand: 'FILTRON',
    code: 'AP120/2',
    category: 'HAVA_FILTRESI',
    priceGross: 490.29,
  },
  'FILTRON:AP120/8': {
    brand: 'FILTRON',
    code: 'AP120/8',
    category: 'HAVA_FILTRESI',
    priceGross: 920.57,
  },
  'FILTRON:K1241': {
    brand: 'FILTRON',
    code: 'K1241',
    category: 'POLEN_FILTRESI',
    priceGross: 216.75,
  },
  'FILTRON:K1241A': {
    brand: 'FILTRON',
    code: 'K1241A',
    category: 'POLEN_FILTRESI',
    priceGross: 460.55,
  },
  'FILTRON:PE992': {
    brand: 'FILTRON',
    code: 'PE992',
    category: 'YAKIT_FILTRESI',
    priceGross: 535.61,
  },
  'MANN:C24011': {
    brand: 'MANN-FILTER',
    code: 'C24011',
    category: 'HAVA_FILTRESI',
    priceGross: 753.62,
  },
  'MANN:C24049': {
    brand: 'MANN-FILTER',
    code: 'C24049',
    category: 'HAVA_FILTRESI',
    priceGross: 1668.9,
  },
  'MANN:C25018': {
    brand: 'MANN-FILTER',
    code: 'C25018',
    category: 'HAVA_FILTRESI',
    priceGross: 1227.64,
  },
  'MANN:CU2141': {
    brand: 'MANN-FILTER',
    code: 'CU2141',
    category: 'POLEN_FILTRESI',
    priceGross: 551.57,
  },
  'MANN:CU22010': {
    brand: 'MANN-FILTER',
    code: 'CU22010',
    category: 'POLEN_FILTRESI',
    priceGross: 402.3,
  },
  'MANN:FP2141': {
    brand: 'MANN-FILTER',
    code: 'FP2141',
    category: 'POLEN_FILTRESI',
    priceGross: 979.14,
  },
  'MANN:W8018': {
    brand: 'MANN-FILTER',
    code: 'W8018',
    category: 'YAG_FILTRESI',
    priceGross: 886.87,
  },
  'MANN:WK613': {
    brand: 'MANN-FILTER',
    code: 'WK613',
    category: 'YAKIT_FILTRESI',
    priceGross: 471.48,
  },
}

const M1 = 'D-MAX'

export const ISUZU_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: '1.9 Ddi 110kw 150hp',
    products: [
      'FILTRON:AP120/8',
      'FILTRON:K1241',
      'FILTRON:K1241A',
      'FILTRON:PE992',
      'MANN:C24049',
      'MANN:CU2141',
      'MANN:CU22010',
      'MANN:FP2141',
    ],
  },
  {
    model: M1,
    engine: '2.4 94kw 128hp',
    products: ['FILTRON:AP120/2', 'MANN:C24011', 'MANN:CU22010', 'MANN:WK613'],
  },
  {
    model: M1,
    engine: '2.5 D 74kw 101hp',
    products: ['MANN:C25018', 'MANN:CU22010', 'MANN:W8018'],
  },
  {
    model: M1,
    engine: '2.5 Ddi 120kw 163hp',
    products: ['FILTRON:K1241', 'MANN:C24049', 'MANN:CU2141', 'MANN:FP2141'],
  },
  {
    model: M1,
    engine: '2.5 Turbodiesel 100kw 136hp',
    products: ['MANN:C25018', 'MANN:CU22010', 'MANN:W8018'],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const ISUZU_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
