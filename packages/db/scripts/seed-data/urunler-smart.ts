/**
 * ════════════════════════════════════════════════════════════════════════════
 *  SMART ÜRÜN VERİSİ — KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const SMART_PRODUCTS: Record<string, SourceProduct> = {
  'FILTRON:AP195': {
    brand: 'FILTRON',
    code: 'AP195',
    category: 'HAVA_FILTRESI',
    priceGross: 299.38,
  },
  'FILTRON:AP195/2': {
    brand: 'FILTRON',
    code: 'AP195/2',
    category: 'HAVA_FILTRESI',
    priceGross: 386.16,
  },
  'FILTRON:AR364': {
    brand: 'FILTRON',
    code: 'AR364',
    category: 'HAVA_FILTRESI',
    priceGross: 429.55,
  },
  'FILTRON:AR364/1': {
    brand: 'FILTRON',
    code: 'AR364/1',
    category: 'HAVA_FILTRESI',
    priceGross: 407.85,
  },
  'FILTRON:K1204A': {
    brand: 'FILTRON',
    code: 'K1204A',
    category: 'POLEN_FILTRESI',
    priceGross: 731.09,
  },
  'FILTRON:K1276A': {
    brand: 'FILTRON',
    code: 'K1276A',
    category: 'POLEN_FILTRESI',
    priceGross: 637.81,
  },
  'FILTRON:K1352A': {
    brand: 'FILTRON',
    code: 'K1352A',
    category: 'POLEN_FILTRESI',
    priceGross: 446.73,
  },
  'FILTRON:OE655': {
    brand: 'FILTRON',
    code: 'OE655',
    category: 'YAG_FILTRESI',
    priceGross: 210.43,
  },
  'FILTRON:OP573/1': {
    brand: 'FILTRON',
    code: 'OP573/1',
    category: 'YAG_FILTRESI',
    priceGross: 535.85,
  },
  'FILTRON:OP575/1': {
    brand: 'FILTRON',
    code: 'OP575/1',
    category: 'YAG_FILTRESI',
    priceGross: 334.09,
  },
  'FILTRON:OP643/4': {
    brand: 'FILTRON',
    code: 'OP643/4',
    category: 'YAG_FILTRESI',
    priceGross: 221.82,
  },
  'FILTRON:PP831/1': {
    brand: 'FILTRON',
    code: 'PP831/1',
    category: 'YAKIT_FILTRESI',
    priceGross: 257.55,
  },
  'FILTRON:PP989/2': {
    brand: 'FILTRON',
    code: 'PP989/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 846.07,
  },
  'MANN:C1036/1': {
    brand: 'MANN-FILTER',
    code: 'C1036/1',
    category: 'HAVA_FILTRESI',
    priceGross: 520.63,
  },
  'MANN:C1036/2': {
    brand: 'MANN-FILTER',
    code: 'C1036/2',
    category: 'HAVA_FILTRESI',
    priceGross: 594.16,
  },
  'MANN:C1041': {
    brand: 'MANN-FILTER',
    code: 'C1041',
    category: 'HAVA_FILTRESI',
    priceGross: 495.14,
  },
  'MANN:C22033': {
    brand: 'MANN-FILTER',
    code: 'C22033',
    category: 'HAVA_FILTRESI',
    priceGross: 616.01,
  },
  'MANN:C2561': {
    brand: 'MANN-FILTER',
    code: 'C2561',
    category: 'HAVA_FILTRESI',
    priceGross: 672.8,
  },
  'MANN:C2584': {
    brand: 'MANN-FILTER',
    code: 'C2584',
    category: 'HAVA_FILTRESI',
    priceGross: 575.24,
  },
  'MANN:C2716': {
    brand: 'MANN-FILTER',
    code: 'C2716',
    category: 'HAVA_FILTRESI',
    priceGross: 679.35,
  },
  'MANN:CU1830': {
    brand: 'MANN-FILTER',
    code: 'CU1830',
    category: 'POLEN_FILTRESI',
    priceGross: 613.82,
  },
  'MANN:CU2132': {
    brand: 'MANN-FILTER',
    code: 'CU2132',
    category: 'POLEN_FILTRESI',
    priceGross: 950.22,
  },
  'MANN:CUK1830': {
    brand: 'MANN-FILTER',
    code: 'CUK1830',
    category: 'POLEN_FILTRESI',
    priceGross: 779.84,
  },
  'MANN:CUK2032': {
    brand: 'MANN-FILTER',
    code: 'CUK2032',
    category: 'POLEN_FILTRESI',
    priceGross: 1387.11,
  },
  'MANN:CUK2132': {
    brand: 'MANN-FILTER',
    code: 'CUK2132',
    category: 'POLEN_FILTRESI',
    priceGross: 1234.2,
  },
  'MANN:CUK22021': {
    brand: 'MANN-FILTER',
    code: 'CUK22021',
    category: 'POLEN_FILTRESI',
    priceGross: 969.88,
  },
  'MANN:FP22021': {
    brand: 'MANN-FILTER',
    code: 'FP22021',
    category: 'POLEN_FILTRESI',
    priceGross: 1247.3,
  },
  'MANN:W6011': {
    brand: 'MANN-FILTER',
    code: 'W6011',
    category: 'YAG_FILTRESI',
    priceGross: 369.54,
  },
  'MANN:W67': {
    brand: 'MANN-FILTER',
    code: 'W67',
    category: 'YAG_FILTRESI',
    priceGross: 347.69,
  },
  'MANN:W713/35': {
    brand: 'MANN-FILTER',
    code: 'W713/35',
    category: 'YAG_FILTRESI',
    priceGross: 1127.16,
  },
  'MANN:W79': {
    brand: 'MANN-FILTER',
    code: 'W79',
    category: 'YAG_FILTRESI',
    priceGross: 275.85,
  },
  'MANN:WK6002': {
    brand: 'MANN-FILTER',
    code: 'WK6002',
    category: 'YAKIT_FILTRESI',
    priceGross: 551.57,
  },
  'MANN:WK6032': {
    brand: 'MANN-FILTER',
    code: 'WK6032',
    category: 'YAKIT_FILTRESI',
    priceGross: 538.83,
  },
  'MANN:WK612/6': {
    brand: 'MANN-FILTER',
    code: 'WK612/6',
    category: 'YAKIT_FILTRESI',
    priceGross: 738.33,
  },
  'MANN:WK820': {
    brand: 'MANN-FILTER',
    code: 'WK820',
    category: 'YAKIT_FILTRESI',
    priceGross: 985.17,
  },
}

const M1 = 'City-Coupé/Cabrio/Fortwo (450)'
const M2 = 'Forfour (454)'
const M3 = 'Fortwo Coupé'
const M4 = 'Fortwo Forfour (453)'
const M5 = 'Roadster'

export const SMART_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: '600 45kw 62hp',
    products: [
      'FILTRON:AR364',
      'FILTRON:K1204A',
      'FILTRON:OE655',
      'MANN:C1036/1',
      'MANN:CUK2032',
      'MANN:WK6032',
    ],
  },
  {
    model: M1,
    engine: '600 Crossblade 52kw 71hp',
    products: [
      'FILTRON:AR364/1',
      'FILTRON:K1204A',
      'FILTRON:OE655',
      'MANN:C1036/2',
      'MANN:CUK2032',
      'MANN:WK6032',
    ],
  },
  {
    model: M1,
    engine: '700 37kw 50hp',
    products: [
      'FILTRON:AR364',
      'FILTRON:K1204A',
      'FILTRON:OE655',
      'MANN:C1036/1',
      'MANN:CUK2032',
      'MANN:WK6032',
    ],
  },
  {
    model: M1,
    engine: '700 40kw 54hp',
    products: [
      'FILTRON:AR364',
      'FILTRON:K1204A',
      'FILTRON:OE655',
      'MANN:C1036/1',
      'MANN:CUK2032',
      'MANN:WK6032',
    ],
  },
  {
    model: M1,
    engine: '700 45kw 61hp',
    products: [
      'FILTRON:AR364',
      'FILTRON:K1204A',
      'FILTRON:OE655',
      'MANN:C1036/1',
      'MANN:CUK2032',
      'MANN:WK6032',
    ],
  },
  {
    model: M1,
    engine: '700 55kw 75hp',
    products: [
      'FILTRON:AR364',
      'FILTRON:K1204A',
      'FILTRON:OE655',
      'MANN:C1036/1',
      'MANN:CUK2032',
      'MANN:WK6032',
    ],
  },
  {
    model: M1,
    engine: '800 CDI 30kw 41hp',
    products: ['FILTRON:K1204A', 'FILTRON:OE655', 'MANN:C1041', 'MANN:CUK2032', 'MANN:WK612/6'],
  },
  {
    model: M2,
    engine: '1.1 47kw 64hp',
    products: ['FILTRON:AP195', 'MANN:C2584', 'MANN:CU1830', 'MANN:CUK1830', 'MANN:W67'],
  },
  {
    model: M2,
    engine: '1.1 55kw 75hp',
    products: ['FILTRON:AP195', 'MANN:C2584', 'MANN:CU1830', 'MANN:CUK1830', 'MANN:W67'],
  },
  {
    model: M2,
    engine: '1.3 70kw 95hp',
    products: ['FILTRON:AP195', 'MANN:C2584', 'MANN:CU1830', 'MANN:CUK1830', 'MANN:W67'],
  },
  {
    model: M2,
    engine: '1.5 80kw 109hp',
    products: ['FILTRON:AP195', 'MANN:C2584', 'MANN:CU1830', 'MANN:CUK1830', 'MANN:W67'],
  },
  {
    model: M2,
    engine: '1.5 CDI 50kw 68hp',
    products: [
      'FILTRON:OP573/1',
      'FILTRON:PP989/2',
      'MANN:C2561',
      'MANN:CU1830',
      'MANN:CUK1830',
      'MANN:W713/35',
      'MANN:WK820',
    ],
  },
  {
    model: M2,
    engine: '1.5 CDI 70kw 95hp',
    products: [
      'FILTRON:OP573/1',
      'FILTRON:PP989/2',
      'MANN:C2561',
      'MANN:CU1830',
      'MANN:CUK1830',
      'MANN:W713/35',
      'MANN:WK820',
    ],
  },
  {
    model: M3,
    engine: '1.0 45kw 61hp',
    products: [
      'FILTRON:AP195/2',
      'FILTRON:K1276A',
      'FILTRON:OP575/1',
      'MANN:C2716',
      'MANN:CU2132',
      'MANN:CUK2132',
      'MANN:W6011',
    ],
  },
  {
    model: M3,
    engine: '1.0 52kw 71hp',
    products: [
      'FILTRON:AP195/2',
      'FILTRON:K1276A',
      'FILTRON:OP575/1',
      'MANN:C2716',
      'MANN:CU2132',
      'MANN:CUK2132',
      'MANN:W6011',
    ],
  },
  {
    model: M3,
    engine: '1.0 Turbo 62kw 84hp',
    products: [
      'FILTRON:AP195/2',
      'FILTRON:K1276A',
      'FILTRON:OP575/1',
      'MANN:C2716',
      'MANN:CU2132',
      'MANN:CUK2132',
      'MANN:W6011',
    ],
  },
  {
    model: M4,
    engine: '1.0 44kw 60hp',
    products: [
      'FILTRON:K1352A',
      'FILTRON:OP643/4',
      'FILTRON:PP831/1',
      'MANN:C22033',
      'MANN:CUK22021',
      'MANN:FP22021',
      'MANN:W79',
      'MANN:WK6002',
    ],
  },
  {
    model: M4,
    engine: '1.0 52kw 71hp',
    products: [
      'FILTRON:K1352A',
      'FILTRON:OP643/4',
      'FILTRON:PP831/1',
      'MANN:C22033',
      'MANN:CUK22021',
      'MANN:FP22021',
      'MANN:W79',
      'MANN:WK6002',
    ],
  },
  {
    model: M5,
    engine: '700 45kw 61hp',
    products: [
      'FILTRON:AR364/1',
      'FILTRON:OE655',
      'MANN:C1036/2',
      'MANN:CU1830',
      'MANN:CUK1830',
      'MANN:WK6032',
    ],
  },
  {
    model: M5,
    engine: '700 60kw 82hp',
    products: [
      'FILTRON:AR364/1',
      'FILTRON:OE655',
      'MANN:C1036/2',
      'MANN:CU1830',
      'MANN:CUK1830',
      'MANN:WK6032',
    ],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const SMART_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
