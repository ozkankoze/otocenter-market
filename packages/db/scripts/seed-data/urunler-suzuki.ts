/**
 * ════════════════════════════════════════════════════════════════════════════
 *  SUZUKI ÜRÜN VERİSİ — KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const SUZUKI_PRODUCTS: Record<string, SourceProduct> = {
  'FILTRON:AP130/9': {
    brand: 'FILTRON',
    code: 'AP130/9',
    category: 'HAVA_FILTRESI',
    priceGross: 338.43,
  },
  'FILTRON:AP154/1': {
    brand: 'FILTRON',
    code: 'AP154/1',
    category: 'HAVA_FILTRESI',
    priceGross: 240.81,
  },
  'FILTRON:AP173/1': {
    brand: 'FILTRON',
    code: 'AP173/1',
    category: 'HAVA_FILTRESI',
    priceGross: 379.65,
  },
  'FILTRON:AP173/2': {
    brand: 'FILTRON',
    code: 'AP173/2',
    category: 'HAVA_FILTRESI',
    priceGross: 377.48,
  },
  'FILTRON:AP173/3': {
    brand: 'FILTRON',
    code: 'AP173/3',
    category: 'HAVA_FILTRESI',
    priceGross: 694.21,
  },
  'FILTRON:AP176/3': {
    brand: 'FILTRON',
    code: 'AP176/3',
    category: 'HAVA_FILTRESI',
    priceGross: 538.02,
  },
  'FILTRON:AP176/5': {
    brand: 'FILTRON',
    code: 'AP176/5',
    category: 'HAVA_FILTRESI',
    priceGross: 403.51,
  },
  'FILTRON:AP176/9': {
    brand: 'FILTRON',
    code: 'AP176/9',
    category: 'HAVA_FILTRESI',
    priceGross: 431.71,
  },
  'FILTRON:AP178/4': {
    brand: 'FILTRON',
    code: 'AP178/4',
    category: 'HAVA_FILTRESI',
    priceGross: 641.19,
  },
  'FILTRON:AP190/4': {
    brand: 'FILTRON',
    code: 'AP190/4',
    category: 'HAVA_FILTRESI',
    priceGross: 314.57,
  },
  'FILTRON:AP190/8': {
    brand: 'FILTRON',
    code: 'AP190/8',
    category: 'HAVA_FILTRESI',
    priceGross: 431.71,
  },
  'FILTRON:AP190/9': {
    brand: 'FILTRON',
    code: 'AP190/9',
    category: 'HAVA_FILTRESI',
    priceGross: 414.36,
  },
  'FILTRON:K1213': {
    brand: 'FILTRON',
    code: 'K1213',
    category: 'POLEN_FILTRESI',
    priceGross: 752.79,
  },
  'FILTRON:K1228': {
    brand: 'FILTRON',
    code: 'K1228',
    category: 'POLEN_FILTRESI',
    priceGross: 416.33,
  },
  'FILTRON:K1228A': {
    brand: 'FILTRON',
    code: 'K1228A',
    category: 'POLEN_FILTRESI',
    priceGross: 499.62,
  },
  'FILTRON:K1236': {
    brand: 'FILTRON',
    code: 'K1236',
    category: 'POLEN_FILTRESI',
    priceGross: 256.99,
  },
  'FILTRON:K1299': {
    brand: 'FILTRON',
    code: 'K1299',
    category: 'POLEN_FILTRESI',
    priceGross: 659.5,
  },
  'FILTRON:K1301': {
    brand: 'FILTRON',
    code: 'K1301',
    category: 'POLEN_FILTRESI',
    priceGross: 375.31,
  },
  'FILTRON:K1310': {
    brand: 'FILTRON',
    code: 'K1310',
    category: 'POLEN_FILTRESI',
    priceGross: 483.54,
  },
  'FILTRON:K1310A': {
    brand: 'FILTRON',
    code: 'K1310A',
    category: 'POLEN_FILTRESI',
    priceGross: 562.86,
  },
  'FILTRON:K1369': {
    brand: 'FILTRON',
    code: 'K1369',
    category: 'POLEN_FILTRESI',
    priceGross: 278.57,
  },
  'FILTRON:OE648/5': {
    brand: 'FILTRON',
    code: 'OE648/5',
    category: 'YAG_FILTRESI',
    priceGross: 286.36,
  },
  'FILTRON:OE667/1': {
    brand: 'FILTRON',
    code: 'OE667/1',
    category: 'YAG_FILTRESI',
    priceGross: 232.91,
  },
  'FILTRON:OE670': {
    brand: 'FILTRON',
    code: 'OE670',
    category: 'YAG_FILTRESI',
    priceGross: 164.88,
  },
  'FILTRON:OE682': {
    brand: 'FILTRON',
    code: 'OE682',
    category: 'YAG_FILTRESI',
    priceGross: 234.3,
  },
  'FILTRON:OE682/2': {
    brand: 'FILTRON',
    code: 'OE682/2',
    category: 'YAG_FILTRESI',
    priceGross: 264.67,
  },
  'FILTRON:OE682/3': {
    brand: 'FILTRON',
    code: 'OE682/3',
    category: 'YAG_FILTRESI',
    priceGross: 414.36,
  },
  'FILTRON:OP564': {
    brand: 'FILTRON',
    code: 'OP564',
    category: 'YAG_FILTRESI',
    priceGross: 235.14,
  },
  'FILTRON:OP617/2': {
    brand: 'FILTRON',
    code: 'OP617/2',
    category: 'YAG_FILTRESI',
    priceGross: 426.55,
  },
  'FILTRON:OP618/2': {
    brand: 'FILTRON',
    code: 'OP618/2',
    category: 'YAG_FILTRESI',
    priceGross: 288.47,
  },
  'FILTRON:OP621': {
    brand: 'FILTRON',
    code: 'OP621',
    category: 'YAG_FILTRESI',
    priceGross: 212.6,
  },
  'FILTRON:OP642/3': {
    brand: 'FILTRON',
    code: 'OP642/3',
    category: 'YAG_FILTRESI',
    priceGross: 351.45,
  },
  'FILTRON:OP643/3': {
    brand: 'FILTRON',
    code: 'OP643/3',
    category: 'YAG_FILTRESI',
    priceGross: 206.1,
  },
  'FILTRON:OP643/4': {
    brand: 'FILTRON',
    code: 'OP643/4',
    category: 'YAG_FILTRESI',
    priceGross: 221.82,
  },
  'FILTRON:PE816/3': {
    brand: 'FILTRON',
    code: 'PE816/3',
    category: 'YAKIT_FILTRESI',
    priceGross: 338.43,
  },
  'FILTRON:PE816/4': {
    brand: 'FILTRON',
    code: 'PE816/4',
    category: 'YAKIT_FILTRESI',
    priceGross: 420.87,
  },
  'FILTRON:PE982': {
    brand: 'FILTRON',
    code: 'PE982',
    category: 'YAKIT_FILTRESI',
    priceGross: 475.1,
  },
  'FILTRON:PM816/1': {
    brand: 'FILTRON',
    code: 'PM816/1',
    category: 'YAKIT_FILTRESI',
    priceGross: 253.82,
  },
  'FILTRON:PP912/4': {
    brand: 'FILTRON',
    code: 'PP912/4',
    category: 'YAKIT_FILTRESI',
    priceGross: 600.93,
  },
  'FILTRON:PP980/5': {
    brand: 'FILTRON',
    code: 'PP980/5',
    category: 'YAKIT_FILTRESI',
    priceGross: 1470.87,
  },
  'FILTRON:PP988/2': {
    brand: 'FILTRON',
    code: 'PP988/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 1243.08,
  },
  'MANN:C1880': {
    brand: 'MANN-FILTER',
    code: 'C1880',
    category: 'HAVA_FILTRESI',
    priceGross: 1076.92,
  },
  'MANN:C19095': {
    brand: 'MANN-FILTER',
    code: 'C19095',
    category: 'HAVA_FILTRESI',
    priceGross: 747.07,
  },
  'MANN:C2074': {
    brand: 'MANN-FILTER',
    code: 'C2074',
    category: 'HAVA_FILTRESI',
    priceGross: 661.88,
  },
  'MANN:C23004': {
    brand: 'MANN-FILTER',
    code: 'C23004',
    category: 'HAVA_FILTRESI',
    priceGross: 657.51,
  },
  'MANN:C23012': {
    brand: 'MANN-FILTER',
    code: 'C23012',
    category: 'HAVA_FILTRESI',
    priceGross: 637.85,
  },
  'MANN:C2337': {
    brand: 'MANN-FILTER',
    code: 'C2337',
    category: 'HAVA_FILTRESI',
    priceGross: 887.04,
  },
  'MANN:C24003': {
    brand: 'MANN-FILTER',
    code: 'C24003',
    category: 'HAVA_FILTRESI',
    priceGross: 467.84,
  },
  'MANN:C24019': {
    brand: 'MANN-FILTER',
    code: 'C24019',
    category: 'HAVA_FILTRESI',
    priceGross: 577.06,
  },
  'MANN:C2448': {
    brand: 'MANN-FILTER',
    code: 'C2448',
    category: 'HAVA_FILTRESI',
    priceGross: 447.81,
  },
  'MANN:C24567': {
    brand: 'MANN-FILTER',
    code: 'C24567',
    category: 'HAVA_FILTRESI',
    priceGross: 709.94,
  },
  'MANN:C2554': {
    brand: 'MANN-FILTER',
    code: 'C2554',
    category: 'HAVA_FILTRESI',
    priceGross: 565.76,
  },
  'MANN:C26006': {
    brand: 'MANN-FILTER',
    code: 'C26006',
    category: 'HAVA_FILTRESI',
    priceGross: 757.99,
  },
  'MANN:C28200': {
    brand: 'MANN-FILTER',
    code: 'C28200',
    category: 'HAVA_FILTRESI',
    priceGross: 467.84,
  },
  'MANN:C29020': {
    brand: 'MANN-FILTER',
    code: 'C29020',
    category: 'HAVA_FILTRESI',
    priceGross: 736.15,
  },
  'MANN:C3282': {
    brand: 'MANN-FILTER',
    code: 'C3282',
    category: 'HAVA_FILTRESI',
    priceGross: 427.8,
  },
  'MANN:CU17001': {
    brand: 'MANN-FILTER',
    code: 'CU17001',
    category: 'POLEN_FILTRESI',
    priceGross: 1000.46,
  },
  'MANN:CU1827': {
    brand: 'MANN-FILTER',
    code: 'CU1827',
    category: 'POLEN_FILTRESI',
    priceGross: 507.88,
  },
  'MANN:CU2040': {
    brand: 'MANN-FILTER',
    code: 'CU2040',
    category: 'POLEN_FILTRESI',
    priceGross: 554.08,
  },
  'MANN:CU21004': {
    brand: 'MANN-FILTER',
    code: 'CU21004',
    category: 'POLEN_FILTRESI',
    priceGross: 679.35,
  },
  'MANN:CU2129': {
    brand: 'MANN-FILTER',
    code: 'CU2129',
    category: 'POLEN_FILTRESI',
    priceGross: 1175.22,
  },
  'MANN:CU2138': {
    brand: 'MANN-FILTER',
    code: 'CU2138',
    category: 'POLEN_FILTRESI',
    priceGross: 646.59,
  },
  'MANN:CU22002-2': {
    brand: 'MANN-FILTER',
    code: 'CU22002-2',
    category: 'POLEN_FILTRESI',
    priceGross: 1441.72,
  },
  'MANN:CU22023': {
    brand: 'MANN-FILTER',
    code: 'CU22023',
    category: 'POLEN_FILTRESI',
    priceGross: 426.52,
  },
  'MANN:CU2513': {
    brand: 'MANN-FILTER',
    code: 'CU2513',
    category: 'POLEN_FILTRESI',
    priceGross: 1164.3,
  },
  'MANN:CUK1827': {
    brand: 'MANN-FILTER',
    code: 'CUK1827',
    category: 'POLEN_FILTRESI',
    priceGross: 975.13,
  },
  'MANN:CUK2040': {
    brand: 'MANN-FILTER',
    code: 'CUK2040',
    category: 'POLEN_FILTRESI',
    priceGross: 919.93,
  },
  'MANN:CUK22032': {
    brand: 'MANN-FILTER',
    code: 'CUK22032',
    category: 'POLEN_FILTRESI',
    priceGross: 1664.53,
  },
  'MANN:FP22032': {
    brand: 'MANN-FILTER',
    code: 'FP22032',
    category: 'POLEN_FILTRESI',
    priceGross: 1966.96,
  },
  'MANN:HU711/4x': {
    brand: 'MANN-FILTER',
    code: 'HU711/4x',
    category: 'YAG_FILTRESI',
    priceGross: 466.02,
  },
  'MANN:HU712/11x': {
    brand: 'MANN-FILTER',
    code: 'HU712/11x',
    category: 'YAG_FILTRESI',
    priceGross: 309.47,
  },
  'MANN:HU712/7x': {
    brand: 'MANN-FILTER',
    code: 'HU712/7x',
    category: 'YAG_FILTRESI',
    priceGross: 347.69,
  },
  'MANN:HU713/1x': {
    brand: 'MANN-FILTER',
    code: 'HU713/1x',
    category: 'YAG_FILTRESI',
    priceGross: 225.74,
  },
  'MANN:HU716/2x': {
    brand: 'MANN-FILTER',
    code: 'HU716/2x',
    category: 'YAG_FILTRESI',
    priceGross: 341.79,
  },
  'MANN:HU8006z': {
    brand: 'MANN-FILTER',
    code: 'HU8006z',
    category: 'YAG_FILTRESI',
    priceGross: 631.3,
  },
  'MANN:PU723x': {
    brand: 'MANN-FILTER',
    code: 'PU723x',
    category: 'YAKIT_FILTRESI',
    priceGross: 740.52,
  },
  'MANN:PU830x': {
    brand: 'MANN-FILTER',
    code: 'PU830x',
    category: 'YAKIT_FILTRESI',
    priceGross: 589.79,
  },
  'MANN:PU922x': {
    brand: 'MANN-FILTER',
    code: 'PU922x',
    category: 'YAKIT_FILTRESI',
    priceGross: 553.4,
  },
  'MANN:W6031': {
    brand: 'MANN-FILTER',
    code: 'W6031',
    category: 'YAG_FILTRESI',
    priceGross: 358.64,
  },
  'MANN:W610/1': {
    brand: 'MANN-FILTER',
    code: 'W610/1',
    category: 'YAG_FILTRESI',
    priceGross: 291.27,
  },
  'MANN:W67/2': {
    brand: 'MANN-FILTER',
    code: 'W67/2',
    category: 'YAG_FILTRESI',
    priceGross: 302.32,
  },
  'MANN:W7058': {
    brand: 'MANN-FILTER',
    code: 'W7058',
    category: 'YAG_FILTRESI',
    priceGross: 241.66,
  },
  'MANN:W75/3': {
    brand: 'MANN-FILTER',
    code: 'W75/3',
    category: 'YAG_FILTRESI',
    priceGross: 203.89,
  },
  'MANN:W79': {
    brand: 'MANN-FILTER',
    code: 'W79',
    category: 'YAG_FILTRESI',
    priceGross: 275.85,
  },
  'MANN:W8013': {
    brand: 'MANN-FILTER',
    code: 'W8013',
    category: 'YAG_FILTRESI',
    priceGross: 566.14,
  },
  'MANN:WK614/47': {
    brand: 'MANN-FILTER',
    code: 'WK614/47',
    category: 'YAKIT_FILTRESI',
    priceGross: 1103.13,
  },
  'MANN:WK9008': {
    brand: 'MANN-FILTER',
    code: 'WK9008',
    category: 'YAKIT_FILTRESI',
    priceGross: 1625.21,
  },
  'MANN:WK9012x': {
    brand: 'MANN-FILTER',
    code: 'WK9012x',
    category: 'YAKIT_FILTRESI',
    priceGross: 1583.7,
  },
  'MANN:WK939/2': {
    brand: 'MANN-FILTER',
    code: 'WK939/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 1108.81,
  },
}

const M1 = 'Across'
const M2 = 'Alto'
const M3 = 'Carry'
const M4 = 'Grand Vitara'
const M5 = 'Jimny I'
const M6 = 'Jimny II'
const M7 = 'S-Cross'
const M8 = 'SX4'
const M9 = 'SX4 S-Cross'
const M10 = 'Swift II (EA/MA)'
const M11 = 'Swift III (MZ/EZ/SG)'
const M12 = 'Swift IV (AZG/AZH)'
const M13 = 'Swift V (AZ)'
const M14 = 'Vitara'
const M15 = 'Vitara II'

export const SUZUKI_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: '2.5 Hybrid 225kw 306hp',
    products: [
      'FILTRON:AP178/4',
      'FILTRON:K1310',
      'FILTRON:K1310A',
      'FILTRON:OP618/2',
      'MANN:CUK22032',
      'MANN:FP22032',
      'MANN:W6031',
    ],
  },
  {
    model: M2,
    engine: '1.0 43kw 58hp',
    products: ['FILTRON:K1301', 'FILTRON:OP564', 'MANN:CU17001', 'MANN:W67/2'],
  },
  {
    model: M2,
    engine: '1.0 50kw 68hp',
    products: [
      'FILTRON:AP176/9',
      'FILTRON:K1301',
      'FILTRON:OP564',
      'MANN:C24003',
      'MANN:CU17001',
      'MANN:W67/2',
    ],
  },
  {
    model: M2,
    engine: '1.1 46kw 63hp',
    products: ['FILTRON:K1301', 'FILTRON:OP564', 'MANN:C23012', 'MANN:CU17001', 'MANN:W67/2'],
  },
  {
    model: M3,
    engine: '1.3 58kw 79hp',
    products: ['FILTRON:OP564', 'MANN:W67/2'],
  },
  {
    model: M4,
    engine: '1.6 78kw 106hp',
    products: ['FILTRON:AP173/2', 'FILTRON:OP621', 'MANN:CU2138'],
  },
  {
    model: M4,
    engine: '1.9 DDiS 95kw 129hp',
    products: [
      'FILTRON:AP173/2',
      'FILTRON:AP173/3',
      'FILTRON:OP642/3',
      'FILTRON:OP643/4',
      'FILTRON:PM816/1',
      'FILTRON:PP988/2',
      'MANN:C24567',
      'MANN:CU2138',
      'MANN:W79',
      'MANN:W8013',
      'MANN:WK9012x',
    ],
  },
  {
    model: M4,
    engine: '2.0 103kw 140hp',
    products: ['FILTRON:AP173/2', 'FILTRON:OP621', 'MANN:CU2138'],
  },
  {
    model: M4,
    engine: '2.0 HDI 80kw 109hp',
    products: [
      'FILTRON:AP173/1',
      'FILTRON:K1213',
      'FILTRON:PE816/3',
      'FILTRON:PE816/4',
      'MANN:C2337',
      'MANN:CU2138',
      'MANN:CU22002-2',
      'MANN:CU2513',
      'MANN:PU830x',
      'MANN:PU922x',
      'MANN:W7058',
    ],
  },
  {
    model: M4,
    engine: '2.4 124kw 169hp',
    products: ['FILTRON:AP173/3', 'FILTRON:OP621', 'MANN:CU2138'],
  },
  {
    model: M4,
    engine: '2.5i V6 24V 116kw 158hp',
    products: [
      'FILTRON:AP173/1',
      'FILTRON:K1213',
      'FILTRON:OP621',
      'FILTRON:PP912/4',
      'MANN:C2337',
      'MANN:CU2513',
      'MANN:WK614/47',
    ],
  },
  {
    model: M6,
    engine: '1.5 75kw 102hp',
    products: ['FILTRON:OP564', 'MANN:W67/2'],
  },
  {
    model: M5,
    engine: '1.3 16V 60kw 82hp',
    products: ['FILTRON:AP176/3', 'FILTRON:K1299', 'FILTRON:OP621', 'MANN:C2074', 'MANN:CU2129'],
  },
  {
    model: M5,
    engine: '1.3 16V 63kw 86hp',
    products: ['FILTRON:AP176/3', 'FILTRON:K1299', 'FILTRON:OP621', 'MANN:C2074', 'MANN:CU2129'],
  },
  {
    model: M5,
    engine: '1.5 DDiS 48kw 65hp',
    products: [
      'FILTRON:AP176/3',
      'FILTRON:K1299',
      'FILTRON:OP643/3',
      'FILTRON:PP980/5',
      'MANN:C19095',
      'MANN:C2074',
      'MANN:CU2129',
      'MANN:W75/3',
      'MANN:WK9008',
    ],
  },
  {
    model: M5,
    engine: '1.5 DDiS 63kw 86hp',
    products: [
      'FILTRON:K1299',
      'FILTRON:OP643/3',
      'FILTRON:PP980/5',
      'MANN:C19095',
      'MANN:CU2129',
      'MANN:W75/3',
      'MANN:WK9008',
    ],
  },
  {
    model: M7,
    engine: '1.4 Smart Hybrid 95kw 129hp',
    products: ['FILTRON:K1369', 'FILTRON:OP564', 'MANN:CU22023', 'MANN:W67/2'],
  },
  {
    model: M7,
    engine: '1.5 Hybrid 85kw 116hp',
    products: ['FILTRON:K1369', 'FILTRON:OP564', 'MANN:CU22023', 'MANN:W67/2'],
  },
  {
    model: M9,
    engine: '1.0 82kw 112hp',
    products: ['FILTRON:K1369', 'FILTRON:OP564', 'MANN:CU22023', 'MANN:W67/2'],
  },
  {
    model: M9,
    engine: '1.4 Hybrid 95kw 129hp',
    products: ['FILTRON:K1369', 'FILTRON:OP564', 'MANN:CU22023', 'MANN:W67/2'],
  },
  {
    model: M9,
    engine: '1.4 T 103kw 140hp',
    products: ['FILTRON:K1369', 'FILTRON:OP564', 'MANN:CU22023', 'MANN:W67/2'],
  },
  {
    model: M8,
    engine: '1.5 73kw 99hp',
    products: [
      'FILTRON:AP176/5',
      'FILTRON:K1236',
      'FILTRON:OP621',
      'MANN:C23004',
      'MANN:CU1827',
      'MANN:CU21004',
      'MANN:CUK1827',
    ],
  },
  {
    model: M8,
    engine: '1.5 VVT 82kw 112hp',
    products: [
      'FILTRON:AP154/1',
      'FILTRON:AP176/5',
      'FILTRON:K1236',
      'FILTRON:OP621',
      'MANN:C23004',
      'MANN:C29020',
      'MANN:CU1827',
      'MANN:CU21004',
      'MANN:CUK1827',
    ],
  },
  {
    model: M8,
    engine: '1.6 16V 79kw 107hp',
    products: [
      'FILTRON:AP176/5',
      'FILTRON:K1236',
      'FILTRON:OP621',
      'MANN:C23004',
      'MANN:CU1827',
      'MANN:CU21004',
      'MANN:CUK1827',
    ],
  },
  {
    model: M8,
    engine: '1.6 16V 88kw 120hp',
    products: [
      'FILTRON:AP154/1',
      'FILTRON:K1236',
      'FILTRON:OP621',
      'MANN:C29020',
      'MANN:CU1827',
      'MANN:CU21004',
      'MANN:CUK1827',
    ],
  },
  {
    model: M8,
    engine: '1.6 DDiS 66kw 90hp',
    products: [
      'FILTRON:AP130/9',
      'FILTRON:K1236',
      'FILTRON:OE667/1',
      'MANN:C3282',
      'MANN:CU1827',
      'MANN:CU21004',
      'MANN:CUK1827',
      'MANN:HU716/2x',
      'MANN:WK939/2',
    ],
  },
  {
    model: M8,
    engine: '1.9 DDiS 88kw 120hp',
    products: [
      'FILTRON:K1236',
      'FILTRON:OE648/5',
      'FILTRON:OE682/2',
      'FILTRON:PE982',
      'MANN:C1880',
      'MANN:CU1827',
      'MANN:CU21004',
      'MANN:CUK1827',
      'MANN:HU711/4x',
      'MANN:HU712/11x',
      'MANN:PU723x',
    ],
  },
  {
    model: M10,
    engine: '1.3 63kw 86hp',
    products: ['FILTRON:OP621'],
  },
  {
    model: M11,
    engine: '1.3 68kw 92hp',
    products: [
      'FILTRON:AP190/4',
      'FILTRON:AP190/9',
      'FILTRON:K1236',
      'FILTRON:OP621',
      'MANN:C24019',
      'MANN:C2448',
      'MANN:CU1827',
      'MANN:CUK1827',
    ],
  },
  {
    model: M11,
    engine: '1.3 DDis 55kw 75hp',
    products: [
      'FILTRON:K1236',
      'FILTRON:OE670',
      'FILTRON:OE682',
      'FILTRON:PE982',
      'MANN:C2554',
      'MANN:CU1827',
      'MANN:CUK1827',
      'MANN:HU712/7x',
      'MANN:HU713/1x',
      'MANN:PU723x',
    ],
  },
  {
    model: M11,
    engine: '1.5 75kw 102hp',
    products: [
      'FILTRON:AP190/4',
      'FILTRON:AP190/9',
      'FILTRON:K1236',
      'FILTRON:OP621',
      'MANN:C24019',
      'MANN:C2448',
      'MANN:CU1827',
      'MANN:CUK1827',
    ],
  },
  {
    model: M11,
    engine: '1.6 16V 92kw 125hp',
    products: [
      'FILTRON:AP190/4',
      'FILTRON:AP190/9',
      'FILTRON:K1236',
      'FILTRON:OP621',
      'MANN:C24019',
      'MANN:C2448',
      'MANN:CU1827',
      'MANN:CUK1827',
    ],
  },
  {
    model: M12,
    engine: '1.2 69kw 94hp',
    products: [
      'FILTRON:AP190/8',
      'FILTRON:K1228',
      'FILTRON:K1236',
      'FILTRON:OP564',
      'MANN:C26006',
      'MANN:CU1827',
      'MANN:CUK1827',
      'MANN:W67/2',
    ],
  },
  {
    model: M12,
    engine: '1.3 DDis 55kw 75hp',
    products: [
      'FILTRON:K1228',
      'FILTRON:K1236',
      'FILTRON:OE682/2',
      'FILTRON:PE982',
      'MANN:CU1827',
      'MANN:CUK1827',
      'MANN:HU712/11x',
      'MANN:PU723x',
    ],
  },
  {
    model: M12,
    engine: '1.4 70kw 95hp',
    products: [
      'FILTRON:AP190/8',
      'FILTRON:K1228',
      'FILTRON:K1236',
      'FILTRON:OP564',
      'MANN:C26006',
      'MANN:CU1827',
      'MANN:CUK1827',
      'MANN:W67/2',
    ],
  },
  {
    model: M12,
    engine: '1.6 100kw 136hp',
    products: [
      'FILTRON:AP154/1',
      'FILTRON:K1228',
      'FILTRON:K1236',
      'FILTRON:OP621',
      'FILTRON:PE982',
      'MANN:C29020',
      'MANN:CU1827',
      'MANN:CUK1827',
      'MANN:PU723x',
    ],
  },
  {
    model: M13,
    engine: '1.0 82kw 111hp',
    products: ['FILTRON:K1228'],
  },
  {
    model: M13,
    engine: '1.2 66kw 90hp',
    products: ['FILTRON:K1228'],
  },
  {
    model: M13,
    engine: '1.2 Hybrid 61kw 83hp',
    products: ['FILTRON:K1228', 'FILTRON:K1228A', 'FILTRON:OP617/2', 'MANN:CU2040', 'MANN:CUK2040'],
  },
  {
    model: M13,
    engine: '1.4 103kw 140hp',
    products: ['FILTRON:K1228', 'FILTRON:OP564', 'MANN:W67/2'],
  },
  {
    model: M13,
    engine: '1.4 Sport SHVS 95kw 129hp',
    products: [
      'FILTRON:K1228',
      'FILTRON:K1228A',
      'FILTRON:OP564',
      'MANN:CU2040',
      'MANN:CUK2040',
      'MANN:W67/2',
    ],
  },
  {
    model: M15,
    engine: '1.0 82kw 111hp',
    products: ['FILTRON:K1369', 'FILTRON:OP564', 'MANN:CU22023', 'MANN:W67/2'],
  },
  {
    model: M15,
    engine: '1.4 103kw 140hp',
    products: ['FILTRON:K1369', 'FILTRON:OP564', 'MANN:CU22023', 'MANN:W67/2'],
  },
  {
    model: M15,
    engine: '1.4 Hybrid 95kw 129hp',
    products: ['FILTRON:K1369', 'FILTRON:OP564', 'MANN:CU22023', 'MANN:W67/2'],
  },
  {
    model: M15,
    engine: '1.5 Hybrid 75kw 102hp',
    products: ['FILTRON:K1369', 'FILTRON:OP564', 'MANN:CU22023', 'MANN:W67/2'],
  },
  {
    model: M15,
    engine: '1.6 88kw 120hp',
    products: ['FILTRON:K1369', 'FILTRON:OP621', 'MANN:C28200', 'MANN:CU22023', 'MANN:W610/1'],
  },
  {
    model: M15,
    engine: '1.6 DDiS 88kw 120hp',
    products: [
      'FILTRON:K1369',
      'FILTRON:OE682/3',
      'FILTRON:PE982',
      'MANN:CU22023',
      'MANN:HU8006z',
      'MANN:PU723x',
    ],
  },
  {
    model: M14,
    engine: '2.0 HDI 64kw 87hp',
    products: [
      'FILTRON:AP173/1',
      'FILTRON:PE816/3',
      'FILTRON:PE816/4',
      'MANN:C2337',
      'MANN:PU830x',
      'MANN:PU922x',
      'MANN:W7058',
    ],
  },
  {
    model: M14,
    engine: '2.0 HDI 66kw 90hp',
    products: [
      'FILTRON:AP173/1',
      'FILTRON:PE816/3',
      'FILTRON:PE816/4',
      'MANN:C2337',
      'MANN:PU830x',
      'MANN:PU922x',
      'MANN:W7058',
    ],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const SUZUKI_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
