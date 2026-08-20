/**
 * ════════════════════════════════════════════════════════════════════════════
 *  MITSUBISHI ÜRÜN VERİSİ — KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const MITSUBISHI_PRODUCTS: Record<string, SourceProduct> = {
  'FILTRON:AM468/4': {
    brand: 'FILTRON',
    code: 'AM468/4',
    category: 'HAVA_FILTRESI',
    priceGross: 1041.32,
  },
  'FILTRON:AP120/2': {
    brand: 'FILTRON',
    code: 'AP120/2',
    category: 'HAVA_FILTRESI',
    priceGross: 490.29,
  },
  'FILTRON:AP120/6': {
    brand: 'FILTRON',
    code: 'AP120/6',
    category: 'HAVA_FILTRESI',
    priceGross: 849.31,
  },
  'FILTRON:AP143/9': {
    brand: 'FILTRON',
    code: 'AP143/9',
    category: 'HAVA_FILTRESI',
    priceGross: 864.27,
  },
  'FILTRON:AP175': {
    brand: 'FILTRON',
    code: 'AP175',
    category: 'HAVA_FILTRESI',
    priceGross: 397,
  },
  'FILTRON:AP180': {
    brand: 'FILTRON',
    code: 'AP180',
    category: 'HAVA_FILTRESI',
    priceGross: 262.5,
  },
  'FILTRON:AP180/1': {
    brand: 'FILTRON',
    code: 'AP180/1',
    category: 'HAVA_FILTRESI',
    priceGross: 389.56,
  },
  'FILTRON:AP181': {
    brand: 'FILTRON',
    code: 'AP181',
    category: 'HAVA_FILTRESI',
    priceGross: 451.24,
  },
  'FILTRON:AP195': {
    brand: 'FILTRON',
    code: 'AP195',
    category: 'HAVA_FILTRESI',
    priceGross: 299.38,
  },
  'FILTRON:K1180-2x': {
    brand: 'FILTRON',
    code: 'K1180-2x',
    category: 'POLEN_FILTRESI',
    priceGross: 683.37,
  },
  'FILTRON:K1215': {
    brand: 'FILTRON',
    code: 'K1215',
    category: 'POLEN_FILTRESI',
    priceGross: 915.5,
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
  'FILTRON:K1273A': {
    brand: 'FILTRON',
    code: 'K1273A',
    category: 'POLEN_FILTRESI',
    priceGross: 655.16,
  },
  'FILTRON:OP573/1': {
    brand: 'FILTRON',
    code: 'OP573/1',
    category: 'YAG_FILTRESI',
    priceGross: 535.85,
  },
  'FILTRON:OP575': {
    brand: 'FILTRON',
    code: 'OP575',
    category: 'YAG_FILTRESI',
    priceGross: 241.54,
  },
  'FILTRON:OP587': {
    brand: 'FILTRON',
    code: 'OP587',
    category: 'YAG_FILTRESI',
    priceGross: 581.4,
  },
  'FILTRON:OP587/3': {
    brand: 'FILTRON',
    code: 'OP587/3',
    category: 'YAG_FILTRESI',
    priceGross: 583.57,
  },
  'FILTRON:OP617': {
    brand: 'FILTRON',
    code: 'OP617',
    category: 'YAG_FILTRESI',
    priceGross: 290.7,
  },
  'FILTRON:OP636': {
    brand: 'FILTRON',
    code: 'OP636',
    category: 'YAG_FILTRESI',
    priceGross: 689.88,
  },
  'FILTRON:OP643/3': {
    brand: 'FILTRON',
    code: 'OP643/3',
    category: 'YAG_FILTRESI',
    priceGross: 206.1,
  },
  'FILTRON:PE992': {
    brand: 'FILTRON',
    code: 'PE992',
    category: 'YAKIT_FILTRESI',
    priceGross: 535.61,
  },
  'FILTRON:PM816/1': {
    brand: 'FILTRON',
    code: 'PM816/1',
    category: 'YAKIT_FILTRESI',
    priceGross: 253.82,
  },
  'FILTRON:PP852/2': {
    brand: 'FILTRON',
    code: 'PP852/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 783.16,
  },
  'FILTRON:PP989/2': {
    brand: 'FILTRON',
    code: 'PP989/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 846.07,
  },
  'MANN:C16148': {
    brand: 'MANN-FILTER',
    code: 'C16148',
    category: 'HAVA_FILTRESI',
    priceGross: 801.68,
  },
  'MANN:C2136/1': {
    brand: 'MANN-FILTER',
    code: 'C2136/1',
    category: 'HAVA_FILTRESI',
    priceGross: 518.8,
  },
  'MANN:C22039': {
    brand: 'MANN-FILTER',
    code: 'C22039',
    category: 'HAVA_FILTRESI',
    priceGross: 1095.64,
  },
  'MANN:C23220': {
    brand: 'MANN-FILTER',
    code: 'C23220',
    category: 'HAVA_FILTRESI',
    priceGross: 3931.96,
  },
  'MANN:C24011': {
    brand: 'MANN-FILTER',
    code: 'C24011',
    category: 'HAVA_FILTRESI',
    priceGross: 753.62,
  },
  'MANN:C2438': {
    brand: 'MANN-FILTER',
    code: 'C2438',
    category: 'HAVA_FILTRESI',
    priceGross: 618.19,
  },
  'MANN:C2561': {
    brand: 'MANN-FILTER',
    code: 'C2561',
    category: 'HAVA_FILTRESI',
    priceGross: 672.8,
  },
  'MANN:C25654': {
    brand: 'MANN-FILTER',
    code: 'C25654',
    category: 'HAVA_FILTRESI',
    priceGross: 775.46,
  },
  'MANN:C2584': {
    brand: 'MANN-FILTER',
    code: 'C2584',
    category: 'HAVA_FILTRESI',
    priceGross: 575.24,
  },
  'MANN:C26027': {
    brand: 'MANN-FILTER',
    code: 'C26027',
    category: 'HAVA_FILTRESI',
    priceGross: 745.19,
  },
  'MANN:C27003/1': {
    brand: 'MANN-FILTER',
    code: 'C27003/1',
    category: 'HAVA_FILTRESI',
    priceGross: 844.13,
  },
  'MANN:C35156': {
    brand: 'MANN-FILTER',
    code: 'C35156',
    category: 'HAVA_FILTRESI',
    priceGross: 725.23,
  },
  'MANN:C3766': {
    brand: 'MANN-FILTER',
    code: 'C3766',
    category: 'HAVA_FILTRESI',
    priceGross: 856.29,
  },
  'MANN:CU1830': {
    brand: 'MANN-FILTER',
    code: 'CU1830',
    category: 'POLEN_FILTRESI',
    priceGross: 613.82,
  },
  'MANN:CU1915': {
    brand: 'MANN-FILTER',
    code: 'CU1915',
    category: 'POLEN_FILTRESI',
    priceGross: 775.47,
  },
  'MANN:CU2106-2': {
    brand: 'MANN-FILTER',
    code: 'CU2106-2',
    category: 'POLEN_FILTRESI',
    priceGross: 904.35,
  },
  'MANN:CU2141': {
    brand: 'MANN-FILTER',
    code: 'CU2141',
    category: 'POLEN_FILTRESI',
    priceGross: 551.57,
  },
  'MANN:CU23000-2': {
    brand: 'MANN-FILTER',
    code: 'CU23000-2',
    category: 'POLEN_FILTRESI',
    priceGross: 740.52,
  },
  'MANN:CUK1830': {
    brand: 'MANN-FILTER',
    code: 'CUK1830',
    category: 'POLEN_FILTRESI',
    priceGross: 779.84,
  },
  'MANN:CUK2141': {
    brand: 'MANN-FILTER',
    code: 'CUK2141',
    category: 'POLEN_FILTRESI',
    priceGross: 690.28,
  },
  'MANN:CUK2230': {
    brand: 'MANN-FILTER',
    code: 'CUK2230',
    category: 'POLEN_FILTRESI',
    priceGross: 1055.07,
  },
  'MANN:FP2141': {
    brand: 'MANN-FILTER',
    code: 'FP2141',
    category: 'POLEN_FILTRESI',
    priceGross: 979.14,
  },
  'MANN:W610/3': {
    brand: 'MANN-FILTER',
    code: 'W610/3',
    category: 'YAG_FILTRESI',
    priceGross: 237.82,
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
  'MANN:W75/3': {
    brand: 'MANN-FILTER',
    code: 'W75/3',
    category: 'YAG_FILTRESI',
    priceGross: 203.89,
  },
  'MANN:W811/80': {
    brand: 'MANN-FILTER',
    code: 'W811/80',
    category: 'YAG_FILTRESI',
    priceGross: 216.63,
  },
  'MANN:W9066': {
    brand: 'MANN-FILTER',
    code: 'W9066',
    category: 'YAG_FILTRESI',
    priceGross: 744.89,
  },
  'MANN:WK820': {
    brand: 'MANN-FILTER',
    code: 'WK820',
    category: 'YAKIT_FILTRESI',
    priceGross: 985.17,
  },
  'MANN:WK9023z': {
    brand: 'MANN-FILTER',
    code: 'WK9023z',
    category: 'YAKIT_FILTRESI',
    priceGross: 1026.68,
  },
  'MANN:WK940/16x': {
    brand: 'MANN-FILTER',
    code: 'WK940/16x',
    category: 'YAKIT_FILTRESI',
    priceGross: 1430.79,
  },
  'MANN:WK940/37x': {
    brand: 'MANN-FILTER',
    code: 'WK940/37x',
    category: 'YAKIT_FILTRESI',
    priceGross: 1706.03,
  },
  'MANN:WP928/81': {
    brand: 'MANN-FILTER',
    code: 'WP928/81',
    category: 'YAG_FILTRESI',
    priceGross: 768.92,
  },
}

const M1 = 'Carisma'
const M2 = 'Colt V (CJ0)'
const M3 = 'Colt VI/Colt CZ3/CZC/CZT (Z30)'
const M4 = 'L 200'
const M5 = 'L200'
const M6 = 'Outlander III'
const M7 = 'Pajero III'
const M8 = 'Space Star II'

export const MITSUBISHI_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: '1300 55kw 75hp',
    products: [
      'FILTRON:AP180',
      'FILTRON:K1180-2x',
      'FILTRON:K1215',
      'MANN:CU1915',
      'MANN:CU23000-2',
      'MANN:W610/3',
    ],
  },
  {
    model: M1,
    engine: '1600 76kw 103hp',
    products: [
      'FILTRON:AP180',
      'FILTRON:K1180-2x',
      'FILTRON:K1215',
      'MANN:C25654',
      'MANN:CU1915',
      'MANN:CU23000-2',
      'MANN:W610/3',
    ],
  },
  {
    model: M1,
    engine: '1800 GDI 16V 90kw 122hp',
    products: [
      'FILTRON:AP180',
      'FILTRON:K1180-2x',
      'FILTRON:K1215',
      'MANN:CU1915',
      'MANN:CU23000-2',
      'MANN:W610/3',
    ],
  },
  {
    model: M1,
    engine: '1900 DI-D 75kw 102hp',
    products: [
      'FILTRON:AP181',
      'FILTRON:K1180-2x',
      'FILTRON:K1215',
      'FILTRON:OP643/3',
      'FILTRON:PM816/1',
      'MANN:C35156',
      'MANN:CU1915',
      'MANN:CU23000-2',
      'MANN:W75/3',
    ],
  },
  {
    model: M1,
    engine: '1900 Di-D 85kw 115hp',
    products: [
      'FILTRON:AP181',
      'FILTRON:K1180-2x',
      'FILTRON:K1215',
      'FILTRON:OP643/3',
      'FILTRON:PM816/1',
      'MANN:C35156',
      'MANN:CU1915',
      'MANN:CU23000-2',
      'MANN:W75/3',
    ],
  },
  {
    model: M2,
    engine: '1.3 60kw 82hp',
    products: [
      'FILTRON:AP175',
      'FILTRON:K1180-2x',
      'MANN:C2136/1',
      'MANN:CU23000-2',
      'MANN:W610/3',
    ],
  },
  {
    model: M2,
    engine: '1.6 76kw 103hp',
    products: [
      'FILTRON:AP175',
      'FILTRON:K1180-2x',
      'MANN:C2136/1',
      'MANN:C27003/1',
      'MANN:CU23000-2',
      'MANN:W610/3',
    ],
  },
  {
    model: M3,
    engine: '1.1 55kw 75hp',
    products: ['FILTRON:AP195', 'MANN:C2584', 'MANN:CU1830', 'MANN:CUK1830', 'MANN:W67'],
  },
  {
    model: M3,
    engine: '1.3 70kw 95hp',
    products: ['FILTRON:AP195', 'MANN:C2584', 'MANN:CU1830', 'MANN:CUK1830', 'MANN:W67'],
  },
  {
    model: M3,
    engine: '1.5 80kw 109hp',
    products: ['FILTRON:AP195', 'MANN:C2584', 'MANN:CU1830', 'MANN:CUK1830', 'MANN:W67'],
  },
  {
    model: M3,
    engine: '1.5 DiD 50kw 68hp',
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
    engine: '1.5 DiD 70kw 95hp',
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
    engine: '1.5 Turbo 110kw 150hp',
    products: ['FILTRON:OP617', 'MANN:C2561', 'MANN:CU1830', 'MANN:CUK1830', 'MANN:W811/80'],
  },
  {
    model: M4,
    engine: '2.2 DI-D 4WD 110kw 150hp',
    products: [
      'FILTRON:AP143/9',
      'FILTRON:K1241',
      'FILTRON:K1241A',
      'FILTRON:OP575',
      'FILTRON:PE992',
      'MANN:C22039',
      'MANN:CU2141',
      'MANN:FP2141',
      'MANN:W610/3',
    ],
  },
  {
    model: M5,
    engine: '2.5 DI-D 100kw 136hp',
    products: [
      'FILTRON:AP120/2',
      'FILTRON:K1241',
      'FILTRON:OP587/3',
      'FILTRON:PP852/2',
      'MANN:C24011',
      'MANN:CU2141',
      'MANN:W9066',
      'MANN:WK9023z',
    ],
  },
  {
    model: M5,
    engine: '2.5 DI-D 123kw 167hp',
    products: [
      'FILTRON:AP120/2',
      'FILTRON:K1241',
      'FILTRON:OP587/3',
      'MANN:C24011',
      'MANN:CU2141',
      'MANN:W9066',
    ],
  },
  {
    model: M5,
    engine: '2.5 DI-D 130kw 178hp',
    products: [
      'FILTRON:AP120/2',
      'FILTRON:K1241',
      'FILTRON:OP587/3',
      'FILTRON:PP852/2',
      'MANN:C24011',
      'MANN:CU2141',
      'MANN:W9066',
      'MANN:WK9023z',
    ],
  },
  {
    model: M5,
    engine: '2.5 DI-D 94kw 128hp',
    products: [
      'FILTRON:AP120/2',
      'FILTRON:K1241',
      'FILTRON:OP587/3',
      'FILTRON:PP852/2',
      'MANN:C24011',
      'MANN:CU2141',
      'MANN:W9066',
      'MANN:WK9023z',
    ],
  },
  {
    model: M5,
    engine: '2.5 TD 85kw 115hp',
    products: [
      'FILTRON:AM468/4',
      'FILTRON:OP587',
      'MANN:C16148',
      'MANN:WK940/16x',
      'MANN:WP928/81',
    ],
  },
  {
    model: M5,
    engine: '2.5 TD 98kw 133hp',
    products: [
      'FILTRON:AM468/4',
      'FILTRON:OP587',
      'MANN:C16148',
      'MANN:WK940/16x',
      'MANN:WP928/81',
    ],
  },
  {
    model: M5,
    engine: '2.5 TDiC 74kw 101hp',
    products: [
      'FILTRON:AM468/4',
      'FILTRON:OP587',
      'MANN:C16148',
      'MANN:WK940/16x',
      'MANN:WP928/81',
    ],
  },
  {
    model: M5,
    engine: '2.8 TD 92kw 125hp',
    products: ['FILTRON:AM468/4', 'FILTRON:OP636', 'MANN:C16148', 'MANN:WK940/16x'],
  },
  {
    model: M5,
    engine: '2400 DI-D 113kw 154hp',
    products: ['FILTRON:K1241', 'MANN:CU2141', 'MANN:FP2141', 'MANN:W610/3'],
  },
  {
    model: M5,
    engine: '2400 DI-D 133kw 181hp',
    products: ['FILTRON:K1241', 'MANN:CU2141', 'MANN:CUK2141', 'MANN:FP2141', 'MANN:W610/3'],
  },
  {
    model: M5,
    engine: '3.0 133kw 181hp',
    products: ['FILTRON:OP617', 'MANN:C23220', 'MANN:W811/80'],
  },
  {
    model: M6,
    engine: '2.4 Hybrid PHEV 165kw 224hp',
    products: [
      'FILTRON:AP120/6',
      'FILTRON:K1241',
      'FILTRON:K1241A',
      'FILTRON:OP575',
      'MANN:CU2141',
      'MANN:FP2141',
      'MANN:W610/3',
    ],
  },
  {
    model: M7,
    engine: '1.8 GDI Pinin 88kw 120hp',
    products: ['FILTRON:K1273A', 'MANN:C2438', 'MANN:CU2106-2', 'MANN:CUK2230', 'MANN:W610/3'],
  },
  {
    model: M7,
    engine: '1.8 Pinin 84kw 114hp',
    products: ['FILTRON:K1273A', 'MANN:C2438', 'MANN:CU2106-2', 'MANN:CUK2230', 'MANN:W610/3'],
  },
  {
    model: M7,
    engine: '2.0 GDI Pinin 95kw 129hp',
    products: ['FILTRON:K1273A', 'MANN:C2438', 'MANN:CU2106-2', 'MANN:CUK2230', 'MANN:W610/3'],
  },
  {
    model: M7,
    engine: '2.5 TD 73kw 99hp',
    products: [
      'FILTRON:K1273A',
      'FILTRON:OP587',
      'MANN:C3766',
      'MANN:CU2106-2',
      'MANN:CUK2230',
      'MANN:WK940/37x',
      'MANN:WP928/81',
    ],
  },
  {
    model: M7,
    engine: '2.5 TD 85kw 115hp',
    products: [
      'FILTRON:K1273A',
      'FILTRON:OP587',
      'MANN:C3766',
      'MANN:CU2106-2',
      'MANN:CUK2230',
      'MANN:WK940/37x',
      'MANN:WP928/81',
    ],
  },
  {
    model: M7,
    engine: '3.2 DI-D 118kw 160hp',
    products: [
      'FILTRON:K1273A',
      'FILTRON:OP636',
      'MANN:C3766',
      'MANN:CU2106-2',
      'MANN:CUK2230',
      'MANN:WK940/37x',
    ],
  },
  {
    model: M7,
    engine: '3.2 DI-D 121kw 165hp',
    products: [
      'FILTRON:K1273A',
      'FILTRON:OP636',
      'MANN:C3766',
      'MANN:CU2106-2',
      'MANN:CUK2230',
      'MANN:WK940/37x',
    ],
  },
  {
    model: M8,
    engine: '1.2 52kw 71hp',
    products: ['FILTRON:AP180/1', 'FILTRON:OP575', 'MANN:C26027', 'MANN:W610/3'],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const MITSUBISHI_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
