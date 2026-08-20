/**
 * ════════════════════════════════════════════════════════════════════════════
 *  FORDTRUCKS ÜRÜN VERİSİ — AĞIR VASITA, KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const FORDTRUCKS_PRODUCTS: Record<string, SourceProduct> = {
  'MANN:H601/4': {
    brand: 'MANN-FILTER',
    code: 'H601/4',
    category: 'DIREKSIYON_FILTRESI',
    priceGross: 163.83,
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
  'MANN:U630xKIT': {
    brand: 'MANN-FILTER',
    code: 'U630xKIT',
    category: 'AD_BLUE_FILTRESI',
    priceGross: 1529.09,
  },
  'MANN:W1160/5': {
    brand: 'MANN-FILTER',
    code: 'W1160/5',
    category: 'YAG_FILTRESI',
    priceGross: 753.62,
  },
  'MANN:W1170/9': {
    brand: 'MANN-FILTER',
    code: 'W1170/9',
    category: 'YAG_FILTRESI',
    priceGross: 790.76,
  },
  'MANN:WDK11102/4': {
    brand: 'MANN-FILTER',
    code: 'WDK11102/4',
    category: 'YAKIT_FILTRESI',
    priceGross: 1166.48,
  },
  'MANN:WK1080/7x': {
    brand: 'MANN-FILTER',
    code: 'WK1080/7x',
    category: 'YAKIT_FILTRESI',
    priceGross: 1044.15,
  },
}

const M1 = 'Cargo'
const M2 = 'Cargo F-Max'

export const FORDTRUCKS_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M2,
    engine: '10.3',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK1080/7x'],
  },
  {
    model: M2,
    engine: '12.7',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT'],
  },
  {
    model: M2,
    engine: '12.7 - 500',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT'],
  },
  {
    model: M2,
    engine: '9.0',
    products: [
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1160/5',
      'MANN:W1170/9',
      'MANN:WDK11102/4',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M1,
    engine: 'Cargo 1826',
    products: [
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1160/5',
      'MANN:W1170/9',
      'MANN:WDK11102/4',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M1,
    engine: 'Cargo 1832',
    products: [
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1160/5',
      'MANN:W1170/9',
      'MANN:WDK11102/4',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M1,
    engine: 'Cargo 1833',
    products: [
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1160/5',
      'MANN:W1170/9',
      'MANN:WDK11102/4',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M1,
    engine: 'Cargo 1835',
    products: [
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1160/5',
      'MANN:W1170/9',
      'MANN:WDK11102/4',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M1,
    engine: 'Cargo 1838',
    products: [
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1160/5',
      'MANN:W1170/9',
      'MANN:WDK11102/4',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M1,
    engine: 'Cargo 1842T',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT'],
  },
  {
    model: M1,
    engine: 'Cargo 1846T',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK1080/7x'],
  },
  {
    model: M1,
    engine: 'Cargo 1848T',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT'],
  },
  {
    model: M1,
    engine: 'Cargo 2526',
    products: [
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1160/5',
      'MANN:W1170/9',
      'MANN:WDK11102/4',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M1,
    engine: 'Cargo 2532',
    products: [
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1160/5',
      'MANN:W1170/9',
      'MANN:WDK11102/4',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M1,
    engine: 'Cargo 2538',
    products: [
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1160/5',
      'MANN:W1170/9',
      'MANN:WDK11102/4',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M1,
    engine: 'Cargo 3232',
    products: [
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1160/5',
      'MANN:W1170/9',
      'MANN:WDK11102/4',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M1,
    engine: 'Cargo 3238',
    products: [
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1160/5',
      'MANN:W1170/9',
      'MANN:WDK11102/4',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M1,
    engine: 'Cargo 3532',
    products: [
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1160/5',
      'MANN:W1170/9',
      'MANN:WDK11102/4',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M1,
    engine: 'Cargo 3536',
    products: [
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1160/5',
      'MANN:W1170/9',
      'MANN:WDK11102/4',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M1,
    engine: 'Cargo 3936',
    products: [
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1160/5',
      'MANN:W1170/9',
      'MANN:WDK11102/4',
      'MANN:WK1080/7x',
    ],
  },
  {
    model: M1,
    engine: 'Cargo 4136',
    products: [
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1160/5',
      'MANN:W1170/9',
      'MANN:WDK11102/4',
      'MANN:WK1080/7x',
    ],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const FORDTRUCKS_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
