/**
 * ════════════════════════════════════════════════════════════════════════════
 *  TEMSA ÜRÜN VERİSİ — AĞIR VASITA, KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const TEMSA_PRODUCTS: Record<string, SourceProduct> = {
  'MANN:C23440/1': {
    brand: 'MANN-FILTER',
    code: 'C23440/1',
    category: 'HAVA_FILTRESI',
    priceGross: 1947.78,
  },
  'MANN:C281275': {
    brand: 'MANN-FILTER',
    code: 'C281275',
    category: 'HAVA_FILTRESI',
    priceGross: 5893.57,
  },
  'MANN:C291366/1': {
    brand: 'MANN-FILTER',
    code: 'C291366/1',
    category: 'HAVA_FILTRESI',
    priceGross: 2651.89,
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
  'MANN:HU13125/3x': {
    brand: 'MANN-FILTER',
    code: 'HU13125/3x',
    category: 'YAG_FILTRESI',
    priceGross: 594.16,
  },
  'MANN:HU1381x': {
    brand: 'MANN-FILTER',
    code: 'HU1381x',
    category: 'YAG_FILTRESI',
    priceGross: 449.99,
  },
  'MANN:PU1059x': {
    brand: 'MANN-FILTER',
    code: 'PU1059x',
    category: 'YAKIT_FILTRESI',
    priceGross: 782.02,
  },
  'MANN:PU855x': {
    brand: 'MANN-FILTER',
    code: 'PU855x',
    category: 'YAKIT_FILTRESI',
    priceGross: 666.25,
  },
  'MANN:PU966/1x': {
    brand: 'MANN-FILTER',
    code: 'PU966/1x',
    category: 'YAKIT_FILTRESI',
    priceGross: 921.82,
  },
  'MANN:TB1374x': {
    brand: 'MANN-FILTER',
    code: 'TB1374x',
    category: 'KURUTUCU_FILTRE',
    priceGross: 838.82,
  },
  'MANN:TB1394/1x': {
    brand: 'MANN-FILTER',
    code: 'TB1394/1x',
    category: 'KURUTUCU_FILTRE',
    priceGross: 1389.29,
  },
  'MANN:W1160': {
    brand: 'MANN-FILTER',
    code: 'W1160',
    category: 'YAG_FILTRESI',
    priceGross: 517.71,
  },
  'MANN:WK1060/3x': {
    brand: 'MANN-FILTER',
    code: 'WK1060/3x',
    category: 'YAKIT_FILTRESI',
    priceGross: 2035.88,
  },
  'MANN:ZR905z': {
    brand: 'MANN-FILTER',
    code: 'ZR905z',
    category: 'YAG_FILTRESI',
    priceGross: 1402.4,
  },
}

const M1 = 'Avenue LF'
const M2 = 'Diamond'
const M3 = 'MD9'
const M4 = 'Maraton'
const M5 = 'Metropol'
const M6 = 'Opalin'
const M7 = 'Safari HD/IC/RD/STD'
const M8 = 'Safir, Safir Plus'
const M9 = 'Tourmalin, Tourmalin IC'

export const TEMSA_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: 'LF12',
    products: [
      'MANN:C291366/1',
      'MANN:H601/4',
      'MANN:PU966/1x',
      'MANN:TB1394/1x',
      'MANN:WK1060/3x',
    ],
  },
  {
    model: M2,
    engine: '13, 14',
    products: [
      'MANN:C281275',
      'MANN:H601/4',
      'MANN:HU13125/3x',
      'MANN:HU1381x',
      'MANN:PU1059x',
      'MANN:PU855x',
      'MANN:TB1394/1x',
    ],
  },
  {
    model: M3,
    engine: 'MD9',
    products: ['MANN:C23440/1', 'MANN:H601/4', 'MANN:PU1059x', 'MANN:TB1394/1x', 'MANN:W1160'],
  },
  {
    model: M3,
    engine: 'MD9 LE',
    products: ['MANN:H601/4', 'MANN:TB1394/1x'],
  },
  {
    model: M4,
    engine: '12, 13, VIP',
    products: ['MANN:H601/4', 'MANN:TB1394/1x'],
  },
  {
    model: M5,
    engine: 'Metropol Intercity',
    products: ['MANN:C23440/1', 'MANN:H601/4', 'MANN:PU1059x', 'MANN:TB1394/1x', 'MANN:W1160'],
  },
  {
    model: M6,
    engine: 'Opalin 8',
    products: ['MANN:H601/4', 'MANN:PU1059x', 'MANN:TB1394/1x', 'MANN:W1160'],
  },
  {
    model: M6,
    engine: 'Opalin 9',
    products: ['MANN:H601/4', 'MANN:PU1059x', 'MANN:TB1394/1x', 'MANN:W1160'],
  },
  {
    model: M7,
    engine: 'HD 12, 13',
    products: [
      'MANN:C291366/1',
      'MANN:H601/4',
      'MANN:HU12103x',
      'MANN:PU966/1x',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:WK1060/3x',
      'MANN:ZR905z',
    ],
  },
  {
    model: M7,
    engine: 'RD 12 ,13',
    products: [
      'MANN:C291366/1',
      'MANN:H601/4',
      'MANN:PU966/1x',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:WK1060/3x',
    ],
  },
  {
    model: M8,
    engine: 'Safir, Safir Plus',
    products: [
      'MANN:C291366/1',
      'MANN:H601/4',
      'MANN:HU12103x',
      'MANN:PU966/1x',
      'MANN:TB1394/1x',
      'MANN:WK1060/3x',
      'MANN:ZR905z',
    ],
  },
  {
    model: M9,
    engine: '12, 13',
    products: [
      'MANN:C291366/1',
      'MANN:H601/4',
      'MANN:PU966/1x',
      'MANN:TB1394/1x',
      'MANN:WK1060/3x',
    ],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const TEMSA_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
