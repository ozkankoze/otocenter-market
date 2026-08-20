/**
 * ════════════════════════════════════════════════════════════════════════════
 *  JAGUAR ÜRÜN VERİSİ — KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const JAGUAR_PRODUCTS: Record<string, SourceProduct> = {
  'FILTRON:AP193/5': {
    brand: 'FILTRON',
    code: 'AP193/5',
    category: 'HAVA_FILTRESI',
    priceGross: 659.5,
  },
  'FILTRON:AP193/7': {
    brand: 'FILTRON',
    code: 'AP193/7',
    category: 'HAVA_FILTRESI',
    priceGross: 343.66,
  },
  'FILTRON:AP193/8': {
    brand: 'FILTRON',
    code: 'AP193/8',
    category: 'HAVA_FILTRESI',
    priceGross: 722.33,
  },
  'FILTRON:AP193/9': {
    brand: 'FILTRON',
    code: 'AP193/9',
    category: 'HAVA_FILTRESI',
    priceGross: 557.37,
  },
  'FILTRON:K1148': {
    brand: 'FILTRON',
    code: 'K1148',
    category: 'POLEN_FILTRESI',
    priceGross: 316.73,
  },
  'FILTRON:K1210': {
    brand: 'FILTRON',
    code: 'K1210',
    category: 'POLEN_FILTRESI',
    priceGross: 287.25,
  },
  'FILTRON:K1210A': {
    brand: 'FILTRON',
    code: 'K1210A',
    category: 'POLEN_FILTRESI',
    priceGross: 438.07,
  },
  'FILTRON:K1237A': {
    brand: 'FILTRON',
    code: 'K1237A',
    category: 'POLEN_FILTRESI',
    priceGross: 708.71,
  },
  'FILTRON:OE665/1': {
    brand: 'FILTRON',
    code: 'OE665/1',
    category: 'YAG_FILTRESI',
    priceGross: 177.89,
  },
  'FILTRON:OE667/2': {
    brand: 'FILTRON',
    code: 'OE667/2',
    category: 'YAG_FILTRESI',
    priceGross: 659.5,
  },
  'FILTRON:OE667/3': {
    brand: 'FILTRON',
    code: 'OE667/3',
    category: 'YAG_FILTRESI',
    priceGross: 511.12,
  },
  'FILTRON:OE667/5': {
    brand: 'FILTRON',
    code: 'OE667/5',
    category: 'YAG_FILTRESI',
    priceGross: 326.54,
  },
  'FILTRON:OE667/7': {
    brand: 'FILTRON',
    code: 'OE667/7',
    category: 'YAG_FILTRESI',
    priceGross: 790.67,
  },
  'FILTRON:OE673': {
    brand: 'FILTRON',
    code: 'OE673',
    category: 'YAG_FILTRESI',
    priceGross: 182.23,
  },
  'FILTRON:OP629/2': {
    brand: 'FILTRON',
    code: 'OP629/2',
    category: 'YAG_FILTRESI',
    priceGross: 249.48,
  },
  'FILTRON:PP838/4': {
    brand: 'FILTRON',
    code: 'PP838/4',
    category: 'YAKIT_FILTRESI',
    priceGross: 637.81,
  },
  'FILTRON:PP865/2': {
    brand: 'FILTRON',
    code: 'PP865/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 416.53,
  },
  'FILTRON:PP905': {
    brand: 'FILTRON',
    code: 'PP905',
    category: 'YAKIT_FILTRESI',
    priceGross: 255.99,
  },
  'FILTRON:PS974/2': {
    brand: 'FILTRON',
    code: 'PS974/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 1922.11,
  },
  'MANN:C26041': {
    brand: 'MANN-FILTER',
    code: 'C26041',
    category: 'HAVA_FILTRESI',
    priceGross: 977.22,
  },
  'MANN:C26042': {
    brand: 'MANN-FILTER',
    code: 'C26042',
    category: 'HAVA_FILTRESI',
    priceGross: 984.45,
  },
  'MANN:C28022': {
    brand: 'MANN-FILTER',
    code: 'C28022',
    category: 'HAVA_FILTRESI',
    priceGross: 1012.85,
  },
  'MANN:C30115': {
    brand: 'MANN-FILTER',
    code: 'C30115',
    category: 'HAVA_FILTRESI',
    priceGross: 751.44,
  },
  'MANN:C3270': {
    brand: 'MANN-FILTER',
    code: 'C3270',
    category: 'HAVA_FILTRESI',
    priceGross: 557.03,
  },
  'MANN:C36008': {
    brand: 'MANN-FILTER',
    code: 'C36008',
    category: 'HAVA_FILTRESI',
    priceGross: 1235.74,
  },
  'MANN:C36009': {
    brand: 'MANN-FILTER',
    code: 'C36009',
    category: 'HAVA_FILTRESI',
    priceGross: 1233.81,
  },
  'MANN:C38116': {
    brand: 'MANN-FILTER',
    code: 'C38116',
    category: 'HAVA_FILTRESI',
    priceGross: 679.35,
  },
  'MANN:C4692': {
    brand: 'MANN-FILTER',
    code: 'C4692',
    category: 'HAVA_FILTRESI',
    priceGross: 484.22,
  },
  'MANN:CU1919': {
    brand: 'MANN-FILTER',
    code: 'CU1919',
    category: 'POLEN_FILTRESI',
    priceGross: 425.08,
  },
  'MANN:CU5141': {
    brand: 'MANN-FILTER',
    code: 'CU5141',
    category: 'POLEN_FILTRESI',
    priceGross: 577.06,
  },
  'MANN:CUK1919': {
    brand: 'MANN-FILTER',
    code: 'CUK1919',
    category: 'POLEN_FILTRESI',
    priceGross: 802.48,
  },
  'MANN:CUK2030': {
    brand: 'MANN-FILTER',
    code: 'CUK2030',
    category: 'POLEN_FILTRESI',
    priceGross: 788.57,
  },
  'MANN:CUK26003': {
    brand: 'MANN-FILTER',
    code: 'CUK26003',
    category: 'POLEN_FILTRESI',
    priceGross: 897.8,
  },
  'MANN:CUK26011': {
    brand: 'MANN-FILTER',
    code: 'CUK26011',
    category: 'POLEN_FILTRESI',
    priceGross: 3881.91,
  },
  'MANN:CUK2733': {
    brand: 'MANN-FILTER',
    code: 'CUK2733',
    category: 'POLEN_FILTRESI',
    priceGross: 1197.71,
  },
  'MANN:CUK28016': {
    brand: 'MANN-FILTER',
    code: 'CUK28016',
    category: 'POLEN_FILTRESI',
    priceGross: 1494.71,
  },
  'MANN:FP1919': {
    brand: 'MANN-FILTER',
    code: 'FP1919',
    category: 'POLEN_FILTRESI',
    priceGross: 1036.43,
  },
  'MANN:FP5141': {
    brand: 'MANN-FILTER',
    code: 'FP5141',
    category: 'POLEN_FILTRESI',
    priceGross: 1026.68,
  },
  'MANN:H50002': {
    brand: 'MANN-FILTER',
    code: 'H50002',
    category: 'SANZUMAN_FILTRESI',
    priceGross: 7573.39,
  },
  'MANN:H50004': {
    brand: 'MANN-FILTER',
    code: 'H50004',
    category: 'SANZUMAN_FILTRESI',
    priceGross: 6288.37,
  },
  'MANN:HU6024z': {
    brand: 'MANN-FILTER',
    code: 'HU6024z',
    category: 'YAG_FILTRESI',
    priceGross: 453.96,
  },
  'MANN:HU711/51x': {
    brand: 'MANN-FILTER',
    code: 'HU711/51x',
    category: 'YAG_FILTRESI',
    priceGross: 280.35,
  },
  'MANN:HU8008z': {
    brand: 'MANN-FILTER',
    code: 'HU8008z',
    category: 'YAG_FILTRESI',
    priceGross: 1598.21,
  },
  'MANN:HU826x': {
    brand: 'MANN-FILTER',
    code: 'HU826x',
    category: 'YAG_FILTRESI',
    priceGross: 600.3,
  },
  'MANN:W7015': {
    brand: 'MANN-FILTER',
    code: 'W7015',
    category: 'YAG_FILTRESI',
    priceGross: 353.15,
  },
  'MANN:W719/36': {
    brand: 'MANN-FILTER',
    code: 'W719/36',
    category: 'YAG_FILTRESI',
    priceGross: 507.88,
  },
  'MANN:WK12001': {
    brand: 'MANN-FILTER',
    code: 'WK12001',
    category: 'YAKIT_FILTRESI',
    priceGross: 2422.52,
  },
  'MANN:WK512': {
    brand: 'MANN-FILTER',
    code: 'WK512',
    category: 'YAKIT_FILTRESI',
    priceGross: 324.04,
  },
  'MANN:WK829/3': {
    brand: 'MANN-FILTER',
    code: 'WK829/3',
    category: 'YAKIT_FILTRESI',
    priceGross: 1109.68,
  },
  'MANN:WK829/5': {
    brand: 'MANN-FILTER',
    code: 'WK829/5',
    category: 'YAKIT_FILTRESI',
    priceGross: 2317.67,
  },
}

const M1 = 'E-Pace (X540)'
const M2 = 'F-Pace (X761)'
const M3 = 'F-Type'
const M4 = 'I-PACE (X590)'
const M5 = 'S-Type (CCX)'
const M6 = 'X-Type (CF1)'
const M7 = 'XE (X760)'
const M8 = 'XF'
const M9 = 'XF (X250)'
const M10 = 'XF, XF Sportbrake (X260)'

export const JAGUAR_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: '1.5 P160 MHEV 118kw 160hp',
    products: [
      'FILTRON:AP193/9',
      'FILTRON:K1237A',
      'FILTRON:OE667/5',
      'MANN:C28022',
      'MANN:CUK2733',
      'MANN:CUK28016',
      'MANN:HU6024z',
    ],
  },
  {
    model: M1,
    engine: '1.5 P300e Plug-in Hybrid 227kw 309hp',
    products: [
      'FILTRON:AP193/9',
      'FILTRON:K1237A',
      'FILTRON:OE667/5',
      'MANN:C28022',
      'MANN:CUK2733',
      'MANN:CUK28016',
      'MANN:HU6024z',
    ],
  },
  {
    model: M1,
    engine: '2.0 D165 120kw 163hp',
    products: [
      'FILTRON:AP193/9',
      'FILTRON:K1237A',
      'FILTRON:OE667/5',
      'MANN:C28022',
      'MANN:CUK2733',
      'MANN:CUK28016',
      'MANN:HU6024z',
    ],
  },
  {
    model: M1,
    engine: '2.0 D165 MHEV 120kw 163hp',
    products: [
      'FILTRON:AP193/9',
      'FILTRON:K1237A',
      'FILTRON:OE667/5',
      'MANN:C28022',
      'MANN:CUK2733',
      'MANN:CUK28016',
      'MANN:HU6024z',
    ],
  },
  {
    model: M1,
    engine: '2.0 D200 MHEV 150kw 204hp',
    products: [
      'FILTRON:AP193/9',
      'FILTRON:K1237A',
      'FILTRON:OE667/5',
      'MANN:C28022',
      'MANN:CUK2733',
      'MANN:CUK28016',
      'MANN:HU6024z',
    ],
  },
  {
    model: M1,
    engine: '2.0 P200 MHEV 147kw 200hp',
    products: [
      'FILTRON:AP193/9',
      'FILTRON:K1237A',
      'FILTRON:OE667/5',
      'MANN:C28022',
      'MANN:CUK2733',
      'MANN:CUK28016',
      'MANN:HU6024z',
    ],
  },
  {
    model: M1,
    engine: '2.0 P250 MHEV 184kw 250hp',
    products: [
      'FILTRON:AP193/9',
      'FILTRON:K1237A',
      'FILTRON:OE667/5',
      'MANN:C28022',
      'MANN:CUK2733',
      'MANN:CUK28016',
      'MANN:HU6024z',
    ],
  },
  {
    model: M1,
    engine: '2.0 P300 MHEV 221kw 300hp',
    products: [
      'FILTRON:AP193/9',
      'FILTRON:K1237A',
      'FILTRON:OE667/5',
      'MANN:C28022',
      'MANN:CUK2733',
      'MANN:CUK28016',
      'MANN:HU6024z',
    ],
  },
  {
    model: M2,
    engine: '2.0 D165 MHEV 120kw 163hp',
    products: [
      'FILTRON:AP193/8',
      'FILTRON:K1210A',
      'FILTRON:OE667/5',
      'MANN:C26042',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:H50004',
      'MANN:HU6024z',
    ],
  },
  {
    model: M2,
    engine: '2.0 D200 MHEV 150kw 204hp',
    products: [
      'FILTRON:AP193/8',
      'FILTRON:K1210A',
      'FILTRON:OE667/5',
      'MANN:C26042',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:H50004',
      'MANN:HU6024z',
    ],
  },
  {
    model: M2,
    engine: '2.0 P400e 297kw 404hp',
    products: [
      'FILTRON:AP193/8',
      'FILTRON:K1210A',
      'FILTRON:OE667/5',
      'MANN:C26042',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:H50004',
      'MANN:HU6024z',
    ],
  },
  {
    model: M2,
    engine: '3.0 D300 MHEV 221kw 300hp',
    products: [
      'FILTRON:AP193/7',
      'FILTRON:AP193/8',
      'FILTRON:K1210A',
      'MANN:C26041',
      'MANN:C26042',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:H50004',
    ],
  },
  {
    model: M2,
    engine: '3.0 P400 MHEV 294kw 400hp',
    products: [
      'FILTRON:AP193/7',
      'FILTRON:AP193/8',
      'FILTRON:K1210A',
      'MANN:C26041',
      'MANN:C26042',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:H50004',
    ],
  },
  {
    model: M3,
    engine: '5.0 SCV8 P450 331kw 450hp',
    products: [
      'FILTRON:OE667/7',
      'MANN:C36008',
      'MANN:C36009',
      'MANN:CUK26011',
      'MANN:H50004',
      'MANN:HU8008z',
    ],
  },
  {
    model: M4,
    engine: 'EV320 AWD 236kw 321hp',
    products: ['FILTRON:K1210A', 'MANN:CU1919', 'MANN:CUK1919', 'MANN:FP1919'],
  },
  {
    model: M5,
    engine: '2.5 V6 147kw 201hp',
    products: [
      'FILTRON:AP193/5',
      'FILTRON:PP865/2',
      'MANN:C30115',
      'MANN:CUK26003',
      'MANN:H50002',
      'MANN:W719/36',
    ],
  },
  {
    model: M5,
    engine: '2.7 V6 Diesel 152kw 207hp',
    products: [
      'FILTRON:AP193/5',
      'FILTRON:OE667/2',
      'MANN:C30115',
      'MANN:CUK26003',
      'MANN:H50002',
      'MANN:WK829/5',
    ],
  },
  {
    model: M5,
    engine: '3.0 V6 175kw 238hp',
    products: [
      'FILTRON:AP193/5',
      'FILTRON:PP865/2',
      'MANN:C30115',
      'MANN:C3270',
      'MANN:CUK26003',
      'MANN:H50002',
      'MANN:W719/36',
    ],
  },
  {
    model: M6,
    engine: '2.0 Diesel 96kw 130hp',
    products: [
      'FILTRON:K1148',
      'FILTRON:OE665/1',
      'FILTRON:PP838/4',
      'MANN:C4692',
      'MANN:CU5141',
      'MANN:FP5141',
      'MANN:WK829/3',
    ],
  },
  {
    model: M6,
    engine: '2.0 V6 114kw 155hp',
    products: [
      'FILTRON:K1148',
      'FILTRON:PP905',
      'MANN:C38116',
      'MANN:CU5141',
      'MANN:FP5141',
      'MANN:W719/36',
      'MANN:WK512',
    ],
  },
  {
    model: M6,
    engine: '2.2 Diesel 107kw 145hp',
    products: [
      'FILTRON:K1148',
      'FILTRON:OE665/1',
      'FILTRON:PP838/4',
      'MANN:C4692',
      'MANN:CU5141',
      'MANN:FP5141',
      'MANN:WK829/3',
    ],
  },
  {
    model: M6,
    engine: '2.2 Diesel 114kw 155hp',
    products: [
      'FILTRON:K1148',
      'FILTRON:OE665/1',
      'FILTRON:PP838/4',
      'MANN:C4692',
      'MANN:CU5141',
      'MANN:FP5141',
      'MANN:WK829/3',
    ],
  },
  {
    model: M6,
    engine: '2.5 V6 144kw 196hp',
    products: [
      'FILTRON:K1148',
      'FILTRON:PP905',
      'MANN:C38116',
      'MANN:CU5141',
      'MANN:FP5141',
      'MANN:W719/36',
      'MANN:WK512',
    ],
  },
  {
    model: M6,
    engine: '3.0 V6 169kw 231hp',
    products: [
      'FILTRON:K1148',
      'FILTRON:PP905',
      'MANN:C38116',
      'MANN:CU5141',
      'MANN:FP5141',
      'MANN:W719/36',
      'MANN:WK512',
    ],
  },
  {
    model: M7,
    engine: '2.0 147kw 200hp',
    products: [
      'FILTRON:K1210',
      'FILTRON:OP629/2',
      'MANN:CU1919',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:HU6024z',
      'MANN:W7015',
    ],
  },
  {
    model: M7,
    engine: '2.0 177kw 241hp',
    products: [
      'FILTRON:OP629/2',
      'MANN:CU1919',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:HU6024z',
      'MANN:W7015',
    ],
  },
  {
    model: M7,
    engine: '2.0 184kw 250hp',
    products: [
      'FILTRON:OP629/2',
      'MANN:CU1919',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:HU6024z',
      'MANN:W7015',
    ],
  },
  {
    model: M7,
    engine: '2.0 D 120kw 163hp',
    products: ['FILTRON:K1210', 'MANN:CUK1919', 'MANN:FP1919', 'MANN:HU6024z'],
  },
  {
    model: M7,
    engine: '2.0 D 132kw 180hp',
    products: ['FILTRON:K1210', 'MANN:CUK1919', 'MANN:FP1919', 'MANN:HU6024z'],
  },
  {
    model: M7,
    engine: '2.0 D 177kw 241hp',
    products: ['FILTRON:K1210', 'MANN:CUK1919', 'MANN:FP1919', 'MANN:HU6024z'],
  },
  {
    model: M7,
    engine: '2.0 D200 MHEV 150kw 204hp',
    products: [
      'FILTRON:AP193/8',
      'FILTRON:K1210A',
      'FILTRON:OE667/5',
      'MANN:C26042',
      'MANN:CU1919',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:H50004',
      'MANN:HU6024z',
    ],
  },
  {
    model: M9,
    engine: '2.0 177kw 241hp',
    products: [
      'FILTRON:AP193/5',
      'FILTRON:OP629/2',
      'MANN:C30115',
      'MANN:CUK2030',
      'MANN:H50002',
      'MANN:W7015',
    ],
  },
  {
    model: M9,
    engine: '2.2 D 120kw 163hp',
    products: [
      'FILTRON:AP193/5',
      'FILTRON:OE673',
      'FILTRON:PS974/2',
      'MANN:C30115',
      'MANN:CUK2030',
      'MANN:H50002',
      'MANN:HU711/51x',
      'MANN:WK12001',
    ],
  },
  {
    model: M9,
    engine: '2.2 D 140kw 190hp',
    products: [
      'FILTRON:AP193/5',
      'FILTRON:OE673',
      'FILTRON:PS974/2',
      'MANN:C30115',
      'MANN:CUK2030',
      'MANN:H50002',
      'MANN:HU711/51x',
      'MANN:WK12001',
    ],
  },
  {
    model: M9,
    engine: '2.2 D 147kw 200hp',
    products: [
      'FILTRON:AP193/5',
      'FILTRON:OE673',
      'FILTRON:PS974/2',
      'MANN:C30115',
      'MANN:CUK2030',
      'MANN:H50002',
      'MANN:HU711/51x',
      'MANN:WK12001',
    ],
  },
  {
    model: M9,
    engine: '2.7 Diesel V6 152kw 207hp',
    products: [
      'FILTRON:AP193/5',
      'FILTRON:OE667/2',
      'MANN:C30115',
      'MANN:CUK2030',
      'MANN:H50002',
      'MANN:WK829/5',
    ],
  },
  {
    model: M9,
    engine: '3.0 Diesel V6 155kw 211hp',
    products: [
      'FILTRON:AP193/5',
      'FILTRON:OE667/3',
      'MANN:C30115',
      'MANN:CUK2030',
      'MANN:H50002',
      'MANN:HU826x',
    ],
  },
  {
    model: M9,
    engine: '3.0 Diesel V6 177kw 240hp',
    products: [
      'FILTRON:AP193/5',
      'FILTRON:OE667/3',
      'MANN:C30115',
      'MANN:CUK2030',
      'MANN:H50002',
      'MANN:HU826x',
    ],
  },
  {
    model: M9,
    engine: '3.0 S Diesel V6 202kw 275hp',
    products: [
      'FILTRON:AP193/5',
      'FILTRON:OE667/3',
      'MANN:C30115',
      'MANN:CUK2030',
      'MANN:H50002',
      'MANN:HU826x',
    ],
  },
  {
    model: M10,
    engine: '2.0 D200 MHEV 150kw 204hp',
    products: [
      'FILTRON:AP193/8',
      'FILTRON:K1210A',
      'FILTRON:OE667/5',
      'MANN:C26042',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:H50004',
      'MANN:HU6024z',
    ],
  },
  {
    model: M8,
    engine: '2.0 147kw 200hp',
    products: ['FILTRON:OP629/2', 'MANN:CUK1919', 'MANN:FP1919', 'MANN:HU6024z', 'MANN:W7015'],
  },
  {
    model: M8,
    engine: '2.0 177kw 241hp',
    products: ['FILTRON:OP629/2', 'MANN:CUK1919', 'MANN:FP1919', 'MANN:HU6024z', 'MANN:W7015'],
  },
  {
    model: M8,
    engine: '2.0 184kw 250hp',
    products: ['FILTRON:OP629/2', 'MANN:CUK1919', 'MANN:FP1919', 'MANN:HU6024z', 'MANN:W7015'],
  },
  {
    model: M8,
    engine: '2.0 D 120kw 163hp',
    products: ['MANN:CUK1919', 'MANN:FP1919', 'MANN:HU6024z'],
  },
  {
    model: M8,
    engine: '2.0 D 132kw 179hp',
    products: ['MANN:CUK1919', 'MANN:FP1919', 'MANN:HU6024z'],
  },
  {
    model: M8,
    engine: '2.0 D 177kw 241hp',
    products: ['MANN:CUK1919', 'MANN:FP1919', 'MANN:HU6024z'],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const JAGUAR_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
