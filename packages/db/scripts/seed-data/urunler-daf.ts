/**
 * ════════════════════════════════════════════════════════════════════════════
 *  DAF ÜRÜN VERİSİ — AĞIR VASITA, KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const DAF_PRODUCTS: Record<string, SourceProduct> = {
  'MANN:C271170/6': {
    brand: 'MANN-FILTER',
    code: 'C271170/6',
    category: 'HAVA_FILTRESI',
    priceGross: 2934.42,
  },
  'MANN:CU2534': {
    brand: 'MANN-FILTER',
    code: 'CU2534',
    category: 'POLEN_FILTRESI',
    priceGross: 650.96,
  },
  'MANN:CU3132': {
    brand: 'MANN-FILTER',
    code: 'CU3132',
    category: 'POLEN_FILTRESI',
    priceGross: 640.03,
  },
  'MANN:H601/4': {
    brand: 'MANN-FILTER',
    code: 'H601/4',
    category: 'DIREKSIYON_FILTRESI',
    priceGross: 163.83,
  },
  'MANN:HU12103x': {
    brand: 'MANN-FILTER',
    code: 'HU12103x',
    category: 'YAG_FILTRESI',
    priceGross: 1011.39,
  },
  'MANN:HU1270x': {
    brand: 'MANN-FILTER',
    code: 'HU1270x',
    category: 'YAG_FILTRESI',
    priceGross: 1194.88,
  },
  'MANN:PU966/1x': {
    brand: 'MANN-FILTER',
    code: 'PU966/1x',
    category: 'YAKIT_FILTRESI',
    priceGross: 921.82,
  },
  'MANN:TB1364x': {
    brand: 'MANN-FILTER',
    code: 'TB1364x',
    category: 'KURUTUCU_FILTRE',
    priceGross: 1944.13,
  },
  'MANN:TB1394/6x': {
    brand: 'MANN-FILTER',
    code: 'TB1394/6x',
    category: 'KURUTUCU_FILTRE',
    priceGross: 1887.34,
  },
  'MANN:U620/3yKIT': {
    brand: 'MANN-FILTER',
    code: 'U620/3yKIT',
    category: 'AD_BLUE_FILTRESI',
    priceGross: 2103.6,
  },
  'MANN:WK1060/3x': {
    brand: 'MANN-FILTER',
    code: 'WK1060/3x',
    category: 'YAKIT_FILTRESI',
    priceGross: 2035.88,
  },
  'MANN:WK845/10': {
    brand: 'MANN-FILTER',
    code: 'WK845/10',
    category: 'YAKIT_FILTRESI',
    priceGross: 3023.24,
  },
  'MANN:ZR905z': {
    brand: 'MANN-FILTER',
    code: 'ZR905z',
    category: 'YAG_FILTRESI',
    priceGross: 1402.4,
  },
}

const M1 = 'CF75'
const M2 = 'CF85'
const M3 = 'New XF (XF106)'
const M4 = 'XF105'

export const DAF_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: 'CF75.250',
    products: [
      'MANN:H601/4',
      'MANN:HU1270x',
      'MANN:PU966/1x',
      'MANN:TB1364x',
      'MANN:TB1394/6x',
      'MANN:U620/3yKIT',
      'MANN:WK1060/3x',
      'MANN:WK845/10',
    ],
  },
  {
    model: M1,
    engine: 'CF75.310',
    products: [
      'MANN:CU2534',
      'MANN:H601/4',
      'MANN:HU1270x',
      'MANN:PU966/1x',
      'MANN:TB1364x',
      'MANN:TB1394/6x',
      'MANN:U620/3yKIT',
      'MANN:WK1060/3x',
      'MANN:WK845/10',
    ],
  },
  {
    model: M1,
    engine: 'CF75.360',
    products: [
      'MANN:CU2534',
      'MANN:H601/4',
      'MANN:HU1270x',
      'MANN:PU966/1x',
      'MANN:TB1364x',
      'MANN:TB1394/6x',
      'MANN:U620/3yKIT',
      'MANN:WK1060/3x',
      'MANN:WK845/10',
    ],
  },
  {
    model: M2,
    engine: 'CF85.360',
    products: [
      'MANN:C271170/6',
      'MANN:CU2534',
      'MANN:H601/4',
      'MANN:HU12103x',
      'MANN:PU966/1x',
      'MANN:TB1364x',
      'MANN:TB1394/6x',
      'MANN:U620/3yKIT',
      'MANN:WK1060/3x',
      'MANN:WK845/10',
      'MANN:ZR905z',
    ],
  },
  {
    model: M2,
    engine: 'CF85.410',
    products: [
      'MANN:C271170/6',
      'MANN:CU2534',
      'MANN:H601/4',
      'MANN:HU12103x',
      'MANN:PU966/1x',
      'MANN:TB1364x',
      'MANN:TB1394/6x',
      'MANN:U620/3yKIT',
      'MANN:WK1060/3x',
      'MANN:WK845/10',
      'MANN:ZR905z',
    ],
  },
  {
    model: M2,
    engine: 'CF85.460',
    products: [
      'MANN:C271170/6',
      'MANN:CU2534',
      'MANN:H601/4',
      'MANN:HU12103x',
      'MANN:PU966/1x',
      'MANN:TB1364x',
      'MANN:TB1394/6x',
      'MANN:U620/3yKIT',
      'MANN:WK1060/3x',
      'MANN:WK845/10',
      'MANN:ZR905z',
    ],
  },
  {
    model: M2,
    engine: 'CF85.510',
    products: [
      'MANN:C271170/6',
      'MANN:CU2534',
      'MANN:H601/4',
      'MANN:HU12103x',
      'MANN:PU966/1x',
      'MANN:TB1364x',
      'MANN:TB1394/6x',
      'MANN:U620/3yKIT',
      'MANN:WK1060/3x',
      'MANN:WK845/10',
      'MANN:ZR905z',
    ],
  },
  {
    model: M3,
    engine: '400',
    products: ['MANN:CU3132', 'MANN:H601/4', 'MANN:TB1394/6x'],
  },
  {
    model: M3,
    engine: '410',
    products: ['MANN:CU3132', 'MANN:H601/4', 'MANN:HU12103x', 'MANN:TB1394/6x', 'MANN:ZR905z'],
  },
  {
    model: M3,
    engine: '430',
    products: ['MANN:H601/4', 'MANN:TB1394/6x', 'MANN:ZR905z'],
  },
  {
    model: M3,
    engine: '440',
    products: ['MANN:CU3132', 'MANN:H601/4', 'MANN:TB1394/6x'],
  },
  {
    model: M3,
    engine: '450',
    products: ['MANN:H601/4', 'MANN:TB1394/6x'],
  },
  {
    model: M3,
    engine: '460',
    products: ['MANN:CU3132', 'MANN:H601/4', 'MANN:HU12103x', 'MANN:TB1394/6x', 'MANN:ZR905z'],
  },
  {
    model: M3,
    engine: '480',
    products: ['MANN:H601/4', 'MANN:TB1394/6x', 'MANN:ZR905z'],
  },
  {
    model: M3,
    engine: '510',
    products: ['MANN:CU3132', 'MANN:H601/4', 'MANN:HU12103x', 'MANN:TB1394/6x', 'MANN:ZR905z'],
  },
  {
    model: M3,
    engine: '530',
    products: ['MANN:H601/4', 'MANN:TB1394/6x', 'MANN:ZR905z'],
  },
  {
    model: M4,
    engine: '105.410',
    products: [
      'MANN:CU3132',
      'MANN:H601/4',
      'MANN:HU12103x',
      'MANN:PU966/1x',
      'MANN:TB1394/6x',
      'MANN:U620/3yKIT',
      'MANN:WK1060/3x',
      'MANN:ZR905z',
    ],
  },
  {
    model: M4,
    engine: '105.460',
    products: [
      'MANN:CU3132',
      'MANN:H601/4',
      'MANN:HU12103x',
      'MANN:PU966/1x',
      'MANN:TB1394/6x',
      'MANN:U620/3yKIT',
      'MANN:WK1060/3x',
      'MANN:ZR905z',
    ],
  },
  {
    model: M4,
    engine: '105.510',
    products: [
      'MANN:CU3132',
      'MANN:H601/4',
      'MANN:HU12103x',
      'MANN:PU966/1x',
      'MANN:TB1394/6x',
      'MANN:U620/3yKIT',
      'MANN:WK1060/3x',
      'MANN:ZR905z',
    ],
  },
  {
    model: M4,
    engine: '105.560',
    products: [
      'MANN:CU3132',
      'MANN:H601/4',
      'MANN:HU12103x',
      'MANN:PU966/1x',
      'MANN:TB1394/6x',
      'MANN:U620/3yKIT',
      'MANN:WK1060/3x',
      'MANN:ZR905z',
    ],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const DAF_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
