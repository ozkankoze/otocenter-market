/**
 * ════════════════════════════════════════════════════════════════════════════
 *  SETRA ÜRÜN VERİSİ — AĞIR VASITA, KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const SETRA_PRODUCTS: Record<string, SourceProduct> = {
  'MANN:C19416': {
    brand: 'MANN-FILTER',
    code: 'C19416',
    category: 'HAVA_FILTRESI',
    priceGross: 1387.11,
  },
  'MANN:C271170': {
    brand: 'MANN-FILTER',
    code: 'C271170',
    category: 'HAVA_FILTRESI',
    priceGross: 3260.25,
  },
  'MANN:C30850/3': {
    brand: 'MANN-FILTER',
    code: 'C30850/3',
    category: 'HAVA_FILTRESI',
    priceGross: 3143.38,
  },
  'MANN:H601/4': {
    brand: 'MANN-FILTER',
    code: 'H601/4',
    category: 'DIREKSIYON_FILTRESI',
    priceGross: 163.83,
  },
  'MANN:H710/1x': {
    brand: 'MANN-FILTER',
    code: 'H710/1x',
    category: 'SANZUMAN_FILTRESI',
    priceGross: 1127.16,
  },
  'MANN:HU12110x': {
    brand: 'MANN-FILTER',
    code: 'HU12110x',
    category: 'YAG_FILTRESI',
    priceGross: 578.87,
  },
  'MANN:HU12140x': {
    brand: 'MANN-FILTER',
    code: 'HU12140x',
    category: 'YAG_FILTRESI',
    priceGross: 620.37,
  },
  'MANN:HU931/5x': {
    brand: 'MANN-FILTER',
    code: 'HU931/5x',
    category: 'YAG_FILTRESI',
    priceGross: 301.45,
  },
  'MANN:HU945/2x': {
    brand: 'MANN-FILTER',
    code: 'HU945/2x',
    category: 'YAG_FILTRESI',
    priceGross: 299.26,
  },
  'MANN:PU1046/1x': {
    brand: 'MANN-FILTER',
    code: 'PU1046/1x',
    category: 'YAKIT_FILTRESI',
    priceGross: 474.02,
  },
  'MANN:PU999/1x': {
    brand: 'MANN-FILTER',
    code: 'PU999/1x',
    category: 'YAKIT_FILTRESI',
    priceGross: 602.9,
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
  'MANN:U58/1KIT': {
    brand: 'MANN-FILTER',
    code: 'U58/1KIT',
    category: 'AD_BLUE_FILTRESI',
    priceGross: 1644.87,
  },
  'MANN:WDK725': {
    brand: 'MANN-FILTER',
    code: 'WDK725',
    category: 'YAKIT_FILTRESI',
    priceGross: 391.01,
  },
  'MANN:WK1060/3x': {
    brand: 'MANN-FILTER',
    code: 'WK1060/3x',
    category: 'YAKIT_FILTRESI',
    priceGross: 2035.88,
  },
  'MANN:WK1080/7x': {
    brand: 'MANN-FILTER',
    code: 'WK1080/7x',
    category: 'YAKIT_FILTRESI',
    priceGross: 1044.15,
  },
}

const M1 = 'CapaCity (O 530 GL / 628)'
const M2 = 'Citaro (O 530 / 628)'
const M3 = 'Citaro 2012 (628)'
const M4 = 'Citaro K (O 530 / 628)'
const M5 = 'Citaro LE (O 530 / 628)'
const M6 = 'Conecto II (628)'
const M7 = 'Integro II (633)'
const M8 = 'Intercity (634)'
const M9 = 'Intouro II (633)'
const M10 = 'Medio (O 815 / 670)'
const M11 = 'O 400'
const M12 = 'O 810 - 818 (Vario)'
const M13 = 'Setra S 400'
const M14 = 'Setra S 400 11.2007-'
const M15 = 'Setra S 500'
const M16 = 'Tourino (O 510 / 444)'
const M17 = 'Tourismo II (632)'
const M18 = 'Travego (O 580 / 629 + 632)'

export const SETRA_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: 'CapaCity',
    products: [
      'MANN:H601/4',
      'MANN:H710/1x',
      'MANN:HU945/2x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
    ],
  },
  {
    model: M1,
    engine: 'CapaCity L',
    products: ['MANN:H601/4', 'MANN:H710/1x', 'MANN:TB1394/1x', 'MANN:U58/1KIT'],
  },
  {
    model: M2,
    engine: 'O 530 Citaro',
    products: [
      'MANN:C30850/3',
      'MANN:H601/4',
      'MANN:H710/1x',
      'MANN:HU945/2x',
      'MANN:PU1046/1x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WK1060/3x',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M3,
    engine: '12M, 18M',
    products: [
      'MANN:C30850/3',
      'MANN:H601/4',
      'MANN:HU945/2x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
    ],
  },
  {
    model: M4,
    engine: 'K',
    products: [
      'MANN:C30850/3',
      'MANN:H601/4',
      'MANN:H710/1x',
      'MANN:HU945/2x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
    ],
  },
  {
    model: M5,
    engine: 'UE / MUE',
    products: [
      'MANN:C271170',
      'MANN:H601/4',
      'MANN:H710/1x',
      'MANN:HU945/2x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M6,
    engine: 'Conecto 12',
    products: [
      'MANN:C30850/3',
      'MANN:H601/4',
      'MANN:H710/1x',
      'MANN:HU945/2x',
      'MANN:PU1046/1x',
      'MANN:TB1394/1x',
    ],
  },
  {
    model: M6,
    engine: 'Conecto 18, G',
    products: ['MANN:C30850/3', 'MANN:H601/4', 'MANN:H710/1x', 'MANN:PU999/1x', 'MANN:TB1394/1x'],
  },
  {
    model: M7,
    engine: 'Integro L',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:U58/1KIT'],
  },
  {
    model: M7,
    engine: 'Integro, Integro M',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:U58/1KIT'],
  },
  {
    model: M7,
    engine: 'Integro, Integro M, Integro L',
    products: [
      'MANN:C271170',
      'MANN:H601/4',
      'MANN:HU945/2x',
      'MANN:PU1046/1x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M7,
    engine: 'Integro, Intregro M',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:U58/1KIT'],
  },
  {
    model: M8,
    engine: 'Intercity',
    products: ['MANN:H601/4', 'MANN:HU12110x', 'MANN:PU999/1x', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M9,
    engine: '12, 12,6 M, 13.3 L',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:U58/1KIT'],
  },
  {
    model: M9,
    engine: 'Intouro, Intouro E, M, ME',
    products: [
      'MANN:C271170',
      'MANN:H601/4',
      'MANN:HU945/2x',
      'MANN:PU1046/1x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M10,
    engine: 'Medio',
    products: [
      'MANN:H601/4',
      'MANN:HU931/5x',
      'MANN:PU1046/1x',
      'MANN:TB1394/1x',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M11,
    engine: 'MP 120 O - 400 RSD',
    products: ['MANN:H601/4'],
  },
  {
    model: M11,
    engine: 'MP 180 DD O-400 RSD',
    products: ['MANN:H601/4'],
  },
  {
    model: M11,
    engine: 'O 400 RSD/RSE/MP',
    products: ['MANN:H601/4', 'MANN:HU12110x', 'MANN:PU999/1x'],
  },
  {
    model: M12,
    engine: 'O 813 D BlueTec (Vario)',
    products: [
      'MANN:H601/4',
      'MANN:HU931/5x',
      'MANN:PU1046/1x',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
    ],
  },
  {
    model: M12,
    engine: 'O 816 D BlueTec (Vario)',
    products: [
      'MANN:H601/4',
      'MANN:HU931/5x',
      'MANN:PU1046/1x',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
    ],
  },
  {
    model: M12,
    engine: 'O 818 D BlueTec',
    products: [
      'MANN:H601/4',
      'MANN:HU931/5x',
      'MANN:PU1046/1x',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
    ],
  },
  {
    model: M14,
    engine: 'S 415 HD/HDH',
    products: ['MANN:C19416'],
  },
  {
    model: M13,
    engine: 'S 407 TC',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:U58/1KIT'],
  },
  {
    model: M13,
    engine: 'S 411 HD',
    products: [
      'MANN:C19416',
      'MANN:H601/4',
      'MANN:HU12140x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 412 HD',
    products: [
      'MANN:C271170',
      'MANN:H601/4',
      'MANN:HU945/2x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 412 UL',
    products: [
      'MANN:C271170',
      'MANN:H601/4',
      'MANN:HU945/2x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 415 GT-HD',
    products: [
      'MANN:H601/4',
      'MANN:HU12110x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 415 H',
    products: [
      'MANN:C271170',
      'MANN:H601/4',
      'MANN:HU945/2x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 415 HD/HDH',
    products: [
      'MANN:C19416',
      'MANN:H601/4',
      'MANN:HU12110x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 415 HDH',
    products: [
      'MANN:C19416',
      'MANN:H601/4',
      'MANN:HU12140x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 415 LE business',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:U58/1KIT', 'MANN:WDK725', 'MANN:WK1080/7x'],
  },
  {
    model: M13,
    engine: 'S 415 NF',
    products: [
      'MANN:C30850/3',
      'MANN:H601/4',
      'MANN:HU945/2x',
      'MANN:PU1046/1x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
    ],
  },
  {
    model: M13,
    engine: 'S 415 UL',
    products: [
      'MANN:C271170',
      'MANN:H601/4',
      'MANN:HU945/2x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 415 UL, UL business',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:U58/1KIT', 'MANN:WDK725', 'MANN:WK1080/7x'],
  },
  {
    model: M13,
    engine: 'S 416 GT-HD',
    products: [
      'MANN:H601/4',
      'MANN:HU12110x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 416 GT-HD2',
    products: [
      'MANN:H601/4',
      'MANN:HU12110x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 416 H',
    products: [
      'MANN:C271170',
      'MANN:H601/4',
      'MANN:HU945/2x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 416 HDH',
    products: [
      'MANN:C19416',
      'MANN:H601/4',
      'MANN:HU12110x',
      'MANN:HU12140x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 416 LE business',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:U58/1KIT', 'MANN:WDK725', 'MANN:WK1080/7x'],
  },
  {
    model: M13,
    engine: 'S 416 NF',
    products: [
      'MANN:C30850/3',
      'MANN:H601/4',
      'MANN:HU945/2x',
      'MANN:PU1046/1x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
    ],
  },
  {
    model: M13,
    engine: 'S 416 UL',
    products: [
      'MANN:C271170',
      'MANN:H601/4',
      'MANN:HU945/2x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 416 UL, UL business',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:U58/1KIT', 'MANN:WDK725', 'MANN:WK1080/7x'],
  },
  {
    model: M13,
    engine: 'S 417 GT-HD',
    products: [
      'MANN:H601/4',
      'MANN:HU12110x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 417 HDH',
    products: [
      'MANN:C19416',
      'MANN:H601/4',
      'MANN:HU12110x',
      'MANN:HU12140x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 417 TC',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:U58/1KIT'],
  },
  {
    model: M13,
    engine: 'S 417 UL',
    products: [
      'MANN:C271170',
      'MANN:H601/4',
      'MANN:HU945/2x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 417 UL, UL business',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:U58/1KIT', 'MANN:WDK725', 'MANN:WK1080/7x'],
  },
  {
    model: M13,
    engine: 'S 418 LE business',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:U58/1KIT', 'MANN:WDK725'],
  },
  {
    model: M13,
    engine: 'S 419 GT-HD',
    products: [
      'MANN:H601/4',
      'MANN:HU12140x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 419 UL',
    products: [
      'MANN:C271170',
      'MANN:H601/4',
      'MANN:HU945/2x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M13,
    engine: 'S 431 DT',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:U58/1KIT', 'MANN:WDK725'],
  },
  {
    model: M15,
    engine: 'S 511 HD ComfortClass',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:WDK725'],
  },
  {
    model: M15,
    engine: 'S 515 HD ComfortClass',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:WDK725'],
  },
  {
    model: M15,
    engine: 'S 515 HDH TopClass',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:WDK725'],
  },
  {
    model: M15,
    engine: 'S 515 MD ComfortClass',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:WDK725'],
  },
  {
    model: M15,
    engine: 'S 516 HD ComfortClass',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:WDK725'],
  },
  {
    model: M15,
    engine: 'S 516 HD/HD2/HD3 ComfortClass',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:WDK725'],
  },
  {
    model: M15,
    engine: 'S 516 HDH TopClass',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:WDK725'],
  },
  {
    model: M15,
    engine: 'S 516 MD ComfortClass',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:WDK725'],
  },
  {
    model: M15,
    engine: 'S 517 HD ComfortClass',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:WDK725'],
  },
  {
    model: M15,
    engine: 'S 517 HDH TopClass',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:WDK725'],
  },
  {
    model: M15,
    engine: 'S 519 HD ComfortClass',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:WDK725'],
  },
  {
    model: M15,
    engine: 'S 531 DT',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:WDK725'],
  },
  {
    model: M16,
    engine: 'Tourino',
    products: [
      'MANN:H601/4',
      'MANN:HU945/2x',
      'MANN:PU1046/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M17,
    engine: '10M Tourismo K',
    products: ['MANN:TB1394/1x', 'MANN:U58/1KIT', 'MANN:WDK725'],
  },
  {
    model: M17,
    engine: '12.1',
    products: [
      'MANN:C271170',
      'MANN:HU945/2x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M17,
    engine: 'M/2 13',
    products: [
      'MANN:C271170',
      'MANN:HU945/2x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M17,
    engine: 'M13 / L14',
    products: [
      'MANN:C19416',
      'MANN:HU12110x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M17,
    engine: 'RH, RH M, RHD, RHD M/M2, RHD L',
    products: ['MANN:TB1394/1x', 'MANN:U58/1KIT', 'MANN:WDK725'],
  },
  {
    model: M18,
    engine: '12, 13 M, 14 L',
    products: ['MANN:H601/4', 'MANN:TB1394/1x', 'MANN:U58/1KIT', 'MANN:WDK725'],
  },
  {
    model: M18,
    engine: '15 RHD, 16 RHD, 17 RHD',
    products: [
      'MANN:C19416',
      'MANN:H601/4',
      'MANN:HU12110x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M18,
    engine: '16 RHD, 17 RHD',
    products: [
      'MANN:C19416',
      'MANN:H601/4',
      'MANN:HU12140x',
      'MANN:PU999/1x',
      'MANN:TB1394/1x',
      'MANN:U58/1KIT',
      'MANN:WDK725',
      'MANN:WK1080/7x',
    ],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const SETRA_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
