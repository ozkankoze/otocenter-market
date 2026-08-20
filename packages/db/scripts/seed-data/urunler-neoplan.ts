/**
 * ════════════════════════════════════════════════════════════════════════════
 *  NEOPLAN ÜRÜN VERİSİ — AĞIR VASITA, KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const NEOPLAN_PRODUCTS: Record<string, SourceProduct> = {
  'MANN:C281275': {
    brand: 'MANN-FILTER',
    code: 'C281275',
    category: 'HAVA_FILTRESI',
    priceGross: 5893.57,
  },
  'MANN:CF1640': {
    brand: 'MANN-FILTER',
    code: 'CF1640',
    category: 'IC_HAVA_FILTRESI',
    priceGross: 1201.43,
  },
  'MANN:CU4795': {
    brand: 'MANN-FILTER',
    code: 'CU4795',
    category: 'POLEN_FILTRESI',
    priceGross: 921.82,
  },
  'MANN:H601/4': {
    brand: 'MANN-FILTER',
    code: 'H601/4',
    category: 'DIREKSIYON_FILTRESI',
    priceGross: 163.83,
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
}

const M1 = 'Centroliner / Centroliner Evolution'
const M2 = 'Cityliner II'
const M3 = 'Jetliner II'
const M4 = 'Skyliner'
const M5 = 'Starliner II / Starliner C / L'
const M6 = 'Tourliner'
const M7 = 'Tourliner C (P10)'
const M8 = 'Trendliner'

export const NEOPLAN_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: 'N 4516',
    products: ['MANN:H601/4', 'MANN:HU13125/3x', 'MANN:PU1059x', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M1,
    engine: 'N 4522',
    products: ['MANN:H601/4', 'MANN:HU13125/3x', 'MANN:PU1059x', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M2,
    engine: 'N1216 HD',
    products: [
      'MANN:C281275',
      'MANN:CU4795',
      'MANN:H601/4',
      'MANN:HU13125/3x',
      'MANN:PU1059x',
      'MANN:TB1394/1x',
    ],
  },
  {
    model: M2,
    engine: 'N1218 HDL',
    products: [
      'MANN:C281275',
      'MANN:CU4795',
      'MANN:H601/4',
      'MANN:HU13125/3x',
      'MANN:PU1059x',
      'MANN:TB1394/1x',
    ],
  },
  {
    model: M3,
    engine: 'Jetliner',
    products: ['MANN:CU4795', 'MANN:H601/4', 'MANN:HU13125/3x', 'MANN:PU1059x', 'MANN:TB1394/1x'],
  },
  {
    model: M4,
    engine: 'Skyliner L',
    products: [
      'MANN:C281275',
      'MANN:H601/4',
      'MANN:HU13125/3x',
      'MANN:PU1059x',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
    ],
  },
  {
    model: M5,
    engine: 'N 5217 SHD',
    products: [
      'MANN:C281275',
      'MANN:CU4795',
      'MANN:H601/4',
      'MANN:HU13125/3x',
      'MANN:HU1381x',
      'MANN:PU1059x',
      'MANN:TB1394/1x',
    ],
  },
  {
    model: M5,
    engine: 'N 5218 SHD',
    products: [
      'MANN:C281275',
      'MANN:CU4795',
      'MANN:H601/4',
      'MANN:HU13125/3x',
      'MANN:HU1381x',
      'MANN:PU1059x',
      'MANN:TB1394/1x',
    ],
  },
  {
    model: M7,
    engine: '420',
    products: ['MANN:C281275', 'MANN:CU4795', 'MANN:PU1059x', 'MANN:TB1394/1x'],
  },
  {
    model: M7,
    engine: '460',
    products: ['MANN:C281275', 'MANN:CU4795', 'MANN:PU1059x', 'MANN:TB1394/1x'],
  },
  {
    model: M6,
    engine: 'N 2216 SHD/SHDL',
    products: [
      'MANN:C281275',
      'MANN:H601/4',
      'MANN:HU13125/3x',
      'MANN:PU1059x',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
    ],
  },
  {
    model: M8,
    engine: 'N 3516 UE',
    products: ['MANN:CF1640', 'MANN:CU4795', 'MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M8,
    engine: 'N 3516/3 UE',
    products: ['MANN:CF1640', 'MANN:CU4795', 'MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M8,
    engine: 'N 3517 UE',
    products: [
      'MANN:CU4795',
      'MANN:H601/4',
      'MANN:HU13125/3x',
      'MANN:PU1059x',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
    ],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const NEOPLAN_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
