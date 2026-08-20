/**
 * ════════════════════════════════════════════════════════════════════════════
 *  SCANIA ÜRÜN VERİSİ — AĞIR VASITA, KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const SCANIA_PRODUCTS: Record<string, SourceProduct> = {
  'MANN:C301240': {
    brand: 'MANN-FILTER',
    code: 'C301240',
    category: 'HAVA_FILTRESI',
    priceGross: 2092.67,
  },
  'MANN:CU1722': {
    brand: 'MANN-FILTER',
    code: 'CU1722',
    category: 'POLEN_FILTRESI',
    priceGross: 806.38,
  },
  'MANN:CU37001': {
    brand: 'MANN-FILTER',
    code: 'CU37001',
    category: 'POLEN_FILTRESI',
    priceGross: 629.11,
  },
  'MANN:H601/4': {
    brand: 'MANN-FILTER',
    code: 'H601/4',
    category: 'DIREKSIYON_FILTRESI',
    priceGross: 163.83,
  },
  'MANN:PU941/1x': {
    brand: 'MANN-FILTER',
    code: 'PU941/1x',
    category: 'YAKIT_FILTRESI',
    priceGross: 768.92,
  },
  'MANN:PU941x': {
    brand: 'MANN-FILTER',
    code: 'PU941x',
    category: 'YAKIT_FILTRESI',
    priceGross: 559.21,
  },
  'MANN:TB1374/3x': {
    brand: 'MANN-FILTER',
    code: 'TB1374/3x',
    category: 'KURUTUCU_FILTRE',
    priceGross: 1459.19,
  },
  'MANN:TB1394/3x': {
    brand: 'MANN-FILTER',
    code: 'TB1394/3x',
    category: 'KURUTUCU_FILTRE',
    priceGross: 1496.33,
  },
  'MANN:W11102/37': {
    brand: 'MANN-FILTER',
    code: 'W11102/37',
    category: 'YAG_FILTRESI',
    priceGross: 581.06,
  },
  'MANN:W9023/1': {
    brand: 'MANN-FILTER',
    code: 'W9023/1',
    category: 'SANZUMAN_FILTRESI',
    priceGross: 1159.93,
  },
}

const M1 = 'G (G230 - G490)'
const M2 = 'G New Generation (G280 - G500)'
const M3 = 'L (L220 - L360)'
const M4 = 'P (P230 - P490)'
const M5 = 'P New Generation (P220 - P500)'
const M6 = 'R (R230 - R730)'
const M7 = 'R New Generation (R410 - R730), S (S410 - S730)'
const M8 = 'T (T340 - T580)'

export const SCANIA_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: 'G 230',
    products: [
      'MANN:C301240',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M1,
    engine: 'G 250',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M1,
    engine: 'G 270',
    products: [
      'MANN:C301240',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M1,
    engine: 'G 280',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M1,
    engine: 'G 310',
    products: [
      'MANN:C301240',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M1,
    engine: 'G 320',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M1,
    engine: 'G 340',
    products: [
      'MANN:C301240',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M1,
    engine: 'G 360',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M1,
    engine: 'G 370',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M1,
    engine: 'G 380',
    products: [
      'MANN:C301240',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M1,
    engine: 'G 410',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M1,
    engine: 'G 420',
    products: [
      'MANN:C301240',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M1,
    engine: 'G 440',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M1,
    engine: 'G 450',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M1,
    engine: 'G 470',
    products: [
      'MANN:C301240',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M1,
    engine: 'G 480',
    products: [
      'MANN:C301240',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M1,
    engine: 'G 490',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M2,
    engine: 'G 280',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M2,
    engine: 'G 320',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M2,
    engine: 'G 360',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M2,
    engine: 'G 370',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M2,
    engine: 'G 410, G 410 XT',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M2,
    engine: 'G 450, G 450 XT',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M2,
    engine: 'G 500, G 500 XT',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M3,
    engine: 'L 220',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M3,
    engine: 'L 250',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M3,
    engine: 'L 280 (DC07)',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M3,
    engine: 'L 280 (DC09)',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M3,
    engine: 'L 320',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M3,
    engine: 'L 360',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M4,
    engine: 'P 230',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M4,
    engine: 'P 250',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M4,
    engine: 'P 270',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M4,
    engine: 'P 280',
    products: ['MANN:C301240', 'MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M4,
    engine: 'P 310',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M4,
    engine: 'P 320',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M4,
    engine: 'P 320, P 325',
    products: ['MANN:C301240', 'MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M4,
    engine: 'P 340',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M4,
    engine: 'P 360',
    products: ['MANN:C301240', 'MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M4,
    engine: 'P 370',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M4,
    engine: 'P 380',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M4,
    engine: 'P 400',
    products: ['MANN:C301240', 'MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M4,
    engine: 'P 410',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M4,
    engine: 'P 420',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M4,
    engine: 'P 450',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M4,
    engine: 'P 470',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M4,
    engine: 'P 480',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M4,
    engine: 'P 490',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M5,
    engine: 'P 220',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M5,
    engine: 'P 250',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M5,
    engine: 'P 280 (DC07)',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M5,
    engine: 'P 280 (DC09)',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M5,
    engine: 'P 320',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M5,
    engine: 'P 360',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M5,
    engine: 'P 370',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M5,
    engine: 'P 410',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M5,
    engine: 'P 450',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M5,
    engine: 'P 500',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M6,
    engine: 'R 230',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:PU941x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M6,
    engine: 'R 250',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M6,
    engine: 'R 270',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:PU941x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M6,
    engine: 'R 280',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M6,
    engine: 'R 310',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:PU941x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M6,
    engine: 'R 320',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M6,
    engine: 'R 340',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M6,
    engine: 'R 360',
    products: ['MANN:C301240', 'MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M6,
    engine: 'R 370',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M6,
    engine: 'R 380',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M6,
    engine: 'R 400',
    products: ['MANN:C301240', 'MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M6,
    engine: 'R 410',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M6,
    engine: 'R 420',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M6,
    engine: 'R 440',
    products: ['MANN:C301240', 'MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M6,
    engine: 'R 450',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M6,
    engine: 'R 470',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M6,
    engine: 'R 480',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M6,
    engine: 'R 490',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M6,
    engine: 'R 500',
    products: [
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W9023/1',
    ],
  },
  {
    model: M6,
    engine: 'R 520',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M6,
    engine: 'R 560',
    products: [
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941x',
      'MANN:TB1394/3x',
      'MANN:W9023/1',
    ],
  },
  {
    model: M6,
    engine: 'R 580',
    products: [
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W9023/1',
    ],
  },
  {
    model: M6,
    engine: 'R 620',
    products: [
      'MANN:CU1722',
      'MANN:CU37001',
      'MANN:H601/4',
      'MANN:PU941x',
      'MANN:TB1394/3x',
      'MANN:W9023/1',
    ],
  },
  {
    model: M6,
    engine: 'R 730',
    products: ['MANN:CU37001', 'MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M7,
    engine: 'R 370, S 370',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M7,
    engine: 'R 410, R 410 XT, S 410',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M7,
    engine: 'R 450, R 450 XT, S 450',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M7,
    engine: 'R 500, R 500 XT, S 500',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M7,
    engine: 'R 520, S 520',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M7,
    engine: 'R 580, S 580',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M7,
    engine: 'R 650, S 650',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M7,
    engine: 'R 730, S 730',
    products: ['MANN:H601/4', 'MANN:TB1394/3x', 'MANN:W9023/1'],
  },
  {
    model: M8,
    engine: 'T 340',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:H601/4',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M8,
    engine: 'T 380',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:H601/4',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M8,
    engine: 'T 420',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M8,
    engine: 'T 470',
    products: [
      'MANN:C301240',
      'MANN:CU1722',
      'MANN:H601/4',
      'MANN:PU941/1x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W11102/37',
      'MANN:W9023/1',
    ],
  },
  {
    model: M8,
    engine: 'T 500',
    products: [
      'MANN:CU1722',
      'MANN:H601/4',
      'MANN:PU941x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W9023/1',
    ],
  },
  {
    model: M8,
    engine: 'T 580',
    products: [
      'MANN:CU1722',
      'MANN:H601/4',
      'MANN:PU941x',
      'MANN:TB1374/3x',
      'MANN:TB1394/3x',
      'MANN:W9023/1',
    ],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const SCANIA_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
