/**
 * ════════════════════════════════════════════════════════════════════════════
 *  VOLVOTR ÜRÜN VERİSİ — AĞIR VASITA, KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const VOLVOTR_PRODUCTS: Record<string, SourceProduct> = {
  'MANN:C311345/1': {
    brand: 'MANN-FILTER',
    code: 'C311345/1',
    category: 'HAVA_FILTRESI',
    priceGross: 3029.79,
  },
  'MANN:C311410': {
    brand: 'MANN-FILTER',
    code: 'C311410',
    category: 'HAVA_FILTRESI',
    priceGross: 2529.56,
  },
  'MANN:C321752/1': {
    brand: 'MANN-FILTER',
    code: 'C321752/1',
    category: 'HAVA_FILTRESI',
    priceGross: 3156.49,
  },
  'MANN:C331460/1': {
    brand: 'MANN-FILTER',
    code: 'C331460/1',
    category: 'HAVA_FILTRESI',
    priceGross: 3031.98,
  },
  'MANN:C341500/1': {
    brand: 'MANN-FILTER',
    code: 'C341500/1',
    category: 'HAVA_FILTRESI',
    priceGross: 3110.61,
  },
  'MANN:CF1510/1': {
    brand: 'MANN-FILTER',
    code: 'CF1510/1',
    category: 'IC_HAVA_FILTRESI',
    priceGross: 3062.56,
  },
  'MANN:CF1800': {
    brand: 'MANN-FILTER',
    code: 'CF1800',
    category: 'IC_HAVA_FILTRESI',
    priceGross: 1437.35,
  },
  'MANN:CU2534': {
    brand: 'MANN-FILTER',
    code: 'CU2534',
    category: 'POLEN_FILTRESI',
    priceGross: 650.96,
  },
  'MANN:H601/4': {
    brand: 'MANN-FILTER',
    code: 'H601/4',
    category: 'DIREKSIYON_FILTRESI',
    priceGross: 163.83,
  },
  'MANN:PU1058x': {
    brand: 'MANN-FILTER',
    code: 'PU1058x',
    category: 'YAKIT_FILTRESI',
    priceGross: 1349.97,
  },
  'MANN:TB1394/1x': {
    brand: 'MANN-FILTER',
    code: 'TB1394/1x',
    category: 'KURUTUCU_FILTRE',
    priceGross: 1389.29,
  },
  'MANN:U630xKIT': {
    brand: 'MANN-FILTER',
    code: 'U630xKIT',
    category: 'AD_BLUE_FILTRESI',
    priceGross: 1529.09,
  },
  'MANN:W11025': {
    brand: 'MANN-FILTER',
    code: 'W11025',
    category: 'YAG_FILTRESI',
    priceGross: 681.54,
  },
  'MANN:WK11001x': {
    brand: 'MANN-FILTER',
    code: 'WK11001x',
    category: 'YAKIT_FILTRESI',
    priceGross: 1197.06,
  },
  'MANN:WK940/33x': {
    brand: 'MANN-FILTER',
    code: 'WK940/33x',
    category: 'YAKIT_FILTRESI',
    priceGross: 1306.28,
  },
  'MANN:WP11102/3': {
    brand: 'MANN-FILTER',
    code: 'WP11102/3',
    category: 'YAG_FILTRESI',
    priceGross: 657.51,
  },
}

const M1 = 'CF75'
const M2 = 'FE II (06-)'
const M3 = 'FE III (13-)'
const M4 = 'FH 16, FH 16 Classic (93-)'
const M5 = 'FH II (New FH 2013)'
const M6 = 'FH, FH Classic (05-)'
const M7 = 'FL II (06-)'
const M8 = 'FM / FMX / FMX Classic (05-)'
const M9 = 'FM II / FMX II (New FM / FMX 2013-)'
const M10 = 'VN (00-)'
const M11 = 'VT (06-)'

export const VOLVOTR_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: 'CF75.250',
    products: ['MANN:CU2534'],
  },
  {
    model: M2,
    engine: 'FE 240',
    products: ['MANN:H601/4', 'MANN:PU1058x', 'MANN:U630xKIT'],
  },
  {
    model: M2,
    engine: 'FE 260',
    products: ['MANN:C321752/1', 'MANN:H601/4', 'MANN:PU1058x', 'MANN:U630xKIT'],
  },
  {
    model: M2,
    engine: 'FE 280',
    products: ['MANN:C311410', 'MANN:CF1800', 'MANN:H601/4', 'MANN:PU1058x', 'MANN:U630xKIT'],
  },
  {
    model: M2,
    engine: 'FE 300',
    products: ['MANN:C321752/1', 'MANN:H601/4', 'MANN:PU1058x', 'MANN:U630xKIT'],
  },
  {
    model: M2,
    engine: 'FE 320',
    products: ['MANN:C321752/1', 'MANN:H601/4', 'MANN:PU1058x', 'MANN:U630xKIT'],
  },
  {
    model: M2,
    engine: 'FE 340',
    products: ['MANN:C321752/1', 'MANN:H601/4', 'MANN:PU1058x', 'MANN:U630xKIT'],
  },
  {
    model: M3,
    engine: '250',
    products: ['MANN:C311410', 'MANN:H601/4'],
  },
  {
    model: M3,
    engine: '280',
    products: ['MANN:C311410', 'MANN:H601/4'],
  },
  {
    model: M3,
    engine: '320',
    products: ['MANN:C311410', 'MANN:H601/4'],
  },
  {
    model: M3,
    engine: '320 CNG',
    products: ['MANN:C311410', 'MANN:H601/4', 'MANN:W11025', 'MANN:WP11102/3'],
  },
  {
    model: M3,
    engine: '350',
    products: ['MANN:C311410', 'MANN:H601/4'],
  },
  {
    model: M4,
    engine: 'FH 16-540',
    products: [
      'MANN:H601/4',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M4,
    engine: 'FH 16-580',
    products: [
      'MANN:H601/4',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M4,
    engine: 'FH 16-600',
    products: [
      'MANN:H601/4',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M4,
    engine: 'FH 16-660',
    products: [
      'MANN:H601/4',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M4,
    engine: 'FH 16-700',
    products: [
      'MANN:H601/4',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M4,
    engine: 'FH 16-750',
    products: [
      'MANN:H601/4',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M5,
    engine: 'FH 420',
    products: ['MANN:C331460/1', 'MANN:H601/4', 'MANN:W11025', 'MANN:WK11001x', 'MANN:WP11102/3'],
  },
  {
    model: M5,
    engine: 'FH 460',
    products: ['MANN:C331460/1', 'MANN:H601/4', 'MANN:W11025', 'MANN:WK11001x', 'MANN:WP11102/3'],
  },
  {
    model: M5,
    engine: 'FH 500',
    products: ['MANN:C331460/1', 'MANN:H601/4', 'MANN:W11025', 'MANN:WK11001x', 'MANN:WP11102/3'],
  },
  {
    model: M5,
    engine: 'FH 540',
    products: [
      'MANN:C331460/1',
      'MANN:H601/4',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M5,
    engine: 'FH 550',
    products: ['MANN:H601/4', 'MANN:W11025', 'MANN:WP11102/3'],
  },
  {
    model: M5,
    engine: 'FH 600',
    products: ['MANN:H601/4', 'MANN:W11025', 'MANN:WK940/33x', 'MANN:WP11102/3'],
  },
  {
    model: M5,
    engine: 'FH 650',
    products: ['MANN:H601/4', 'MANN:W11025', 'MANN:WP11102/3'],
  },
  {
    model: M5,
    engine: 'FH 700',
    products: ['MANN:H601/4', 'MANN:W11025', 'MANN:WK940/33x', 'MANN:WP11102/3'],
  },
  {
    model: M5,
    engine: 'FH 750',
    products: ['MANN:H601/4', 'MANN:W11025', 'MANN:WK940/33x', 'MANN:WP11102/3'],
  },
  {
    model: M6,
    engine: 'FH 400',
    products: [
      'MANN:C341500/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M6,
    engine: 'FH 420',
    products: [
      'MANN:C331460/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M6,
    engine: 'FH 440',
    products: [
      'MANN:C341500/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M6,
    engine: 'FH 460',
    products: [
      'MANN:C331460/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M6,
    engine: 'FH 480',
    products: [
      'MANN:C341500/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M6,
    engine: 'FH 500',
    products: [
      'MANN:C331460/1',
      'MANN:C341500/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M6,
    engine: 'FH 520',
    products: [
      'MANN:C341500/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M6,
    engine: 'FH 540',
    products: [
      'MANN:C331460/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M7,
    engine: 'FL 240',
    products: ['MANN:C311410', 'MANN:PU1058x', 'MANN:U630xKIT'],
  },
  {
    model: M7,
    engine: 'FL 260',
    products: ['MANN:C311410', 'MANN:CF1800', 'MANN:PU1058x', 'MANN:U630xKIT'],
  },
  {
    model: M7,
    engine: 'FL 280',
    products: ['MANN:C311410', 'MANN:CF1800', 'MANN:PU1058x', 'MANN:U630xKIT'],
  },
  {
    model: M7,
    engine: 'FL 290',
    products: ['MANN:C311410', 'MANN:CF1800', 'MANN:PU1058x', 'MANN:U630xKIT'],
  },
  {
    model: M8,
    engine: 'FM 300',
    products: [
      'MANN:C311345/1',
      'MANN:CF1510/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M8,
    engine: 'FM 330, FMX 330',
    products: [
      'MANN:C311345/1',
      'MANN:CF1510/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M8,
    engine: 'FM 340',
    products: [
      'MANN:C311345/1',
      'MANN:CF1510/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M8,
    engine: 'FM 360',
    products: [
      'MANN:C341500/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M8,
    engine: 'FM 370, FMX 370',
    products: [
      'MANN:C311345/1',
      'MANN:CF1510/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M8,
    engine: 'FM 380',
    products: [
      'MANN:C311345/1',
      'MANN:CF1510/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M8,
    engine: 'FM 380, FMX 380',
    products: [
      'MANN:C341500/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M8,
    engine: 'FM 390',
    products: [
      'MANN:C311345/1',
      'MANN:CF1510/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M8,
    engine: 'FM 400',
    products: [
      'MANN:C341500/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M8,
    engine: 'FM 410, FMX 410',
    products: [
      'MANN:C311345/1',
      'MANN:CF1510/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M8,
    engine: 'FM 420, FMX 420',
    products: [
      'MANN:C341500/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M8,
    engine: 'FM 430',
    products: [
      'MANN:C311345/1',
      'MANN:CF1510/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M8,
    engine: 'FM 440',
    products: [
      'MANN:C341500/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M8,
    engine: 'FM 450, FMX 450',
    products: [
      'MANN:C311345/1',
      'MANN:CF1510/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M8,
    engine: 'FM 460, FMX 460',
    products: [
      'MANN:C341500/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M8,
    engine: 'FM 480',
    products: [
      'MANN:C341500/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M8,
    engine: 'FM 500',
    products: [
      'MANN:C341500/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK940/33x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M8,
    engine: 'FM 500, FMX 500',
    products: [
      'MANN:C341500/1',
      'MANN:H601/4',
      'MANN:U630xKIT',
      'MANN:W11025',
      'MANN:WK11001x',
      'MANN:WP11102/3',
    ],
  },
  {
    model: M9,
    engine: '330',
    products: ['MANN:H601/4', 'MANN:W11025', 'MANN:WP11102/3'],
  },
  {
    model: M9,
    engine: '370',
    products: ['MANN:H601/4', 'MANN:W11025', 'MANN:WP11102/3'],
  },
  {
    model: M9,
    engine: '410',
    products: ['MANN:H601/4', 'MANN:W11025', 'MANN:WP11102/3'],
  },
  {
    model: M9,
    engine: '420',
    products: ['MANN:H601/4', 'MANN:W11025', 'MANN:WP11102/3'],
  },
  {
    model: M9,
    engine: '450',
    products: ['MANN:H601/4', 'MANN:W11025', 'MANN:WP11102/3'],
  },
  {
    model: M9,
    engine: '460',
    products: ['MANN:H601/4', 'MANN:W11025', 'MANN:WP11102/3'],
  },
  {
    model: M9,
    engine: '500',
    products: ['MANN:H601/4', 'MANN:W11025', 'MANN:WP11102/3'],
  },
  {
    model: M9,
    engine: '540',
    products: ['MANN:H601/4', 'MANN:W11025', 'MANN:WP11102/3'],
  },
  {
    model: M10,
    engine: 'VN 730',
    products: ['MANN:W11025', 'MANN:WK940/33x', 'MANN:WP11102/3'],
  },
  {
    model: M11,
    engine: 'VT 880',
    products: ['MANN:W11025', 'MANN:WK940/33x', 'MANN:WP11102/3'],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const VOLVOTR_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
