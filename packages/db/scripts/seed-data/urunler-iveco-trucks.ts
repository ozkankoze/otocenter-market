/**
 * ════════════════════════════════════════════════════════════════════════════
 *  IVECOTRUCKS ÜRÜN VERİSİ — AĞIR VASITA, KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const IVECOTRUCKS_PRODUCTS: Record<string, SourceProduct> = {
  'MANN:C321420/2': {
    brand: 'MANN-FILTER',
    code: 'C321420/2',
    category: 'HAVA_FILTRESI',
    priceGross: 3717.88,
  },
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
  'MANN:W1170/7': {
    brand: 'MANN-FILTER',
    code: 'W1170/7',
    category: 'YAG_FILTRESI',
    priceGross: 1692.93,
  },
  'MANN:WK950/19': {
    brand: 'MANN-FILTER',
    code: 'WK950/19',
    category: 'YAKIT_FILTRESI',
    priceGross: 672.8,
  },
}

const M1 = 'EucoCargo IV (15-)'
const M2 = 'EuroCargo II'
const M3 = 'EuroCargo III'
const M4 = 'EuroMover (00-)'
const M5 = 'Stralis'
const M6 = 'Stralis II'

export const IVECOTRUCKS_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: '100-190',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '100-210',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '100-22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '110-190, 110L-190',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '110-210, 110L-210',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '110-220, 110L-220',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '110-250, 110L-250',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '120-190, 120L-190',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '120-210, 120L-210',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '120-220, 120L-220',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '120-250, 120L-250',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '120-280',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '140-190',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '140-210',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '140-220',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '140-250',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '140-280',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '150-210',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '150-220',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '150-250',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '150-280',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '150-320',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '160-210',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '160-220',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '160-250',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '160-280',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '160-320',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '180-250',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '180-280',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '180-320',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '190L-250',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '190L-280',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '190L-320',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '60-160',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '65-160',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '75-160',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '75-190',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '75-210',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '80-190',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '80-210',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '80-220',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M1,
    engine: '80L-160',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML100E 18',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML100E 19',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML100E 21',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML100E 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML110EL 19',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML110EL 21',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML110EL 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML120E 18',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML120E 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML120E 25',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML120E 28',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML120E/EL 19',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML120E/EL 21',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML120E/EL 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML120EL 18',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML120EL 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML140E 18',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML140E 19',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML140E 21',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML140E 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML140E 25',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML140E 28',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML150E 19',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML150E 21',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML150E 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML150E 25',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML150E 28',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML150E 32',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML160E 18',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML160E 19',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML160E 21',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML160E 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML160E 25',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML160E 28',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML160E 30',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML160E 32',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML180E 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML180E 24',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML180E 25',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML180E 28',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML180E 30',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML180E 32',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML190E/EL 25',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML190E/EL 28',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML190E/EL 30',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML60E 16',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML75E 14',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML75E 16',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML75E 18',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML75E 19',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML75E 21',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML80E 18',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML80E 19',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML80E 21',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML80E 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML90E 19',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML90E 21',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M3,
    engine: 'ML90E 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '100 E 18',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '100 E 19',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '100 E 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '110 E/EL 18',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '110 E/EL 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '110 E/EL 25',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '120 E/EL 18',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '120 E/EL 19',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '120 E/EL 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '120 E/EL 25',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '120 E/EL 30',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '130 E 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '130 E 25',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '130 E 28',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '130 E 30',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '140 E 18',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '140 E 21',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT'],
  },
  {
    model: M2,
    engine: '140 E 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '140 E 25',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '140 E 28',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '150 E 18',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '150 E 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '150 E 25',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '150 E 30',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '160 E 18',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '160 E 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '160 E 25',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '160 E 28',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '160 E 30',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '180 E/EL 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '180 E/EL 25',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '180 E/EL 28',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '180 E/EL 30',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '190 E/EL 25',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '190 E/EL 28',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '190 E/EL 30',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '260 E 28',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '60 E 14',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '60 E 16',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '65 E 14',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '65 E 16',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '75 E 14',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '75 E 16',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '75 E 19',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '80 E 19',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '80 E 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '80 E/EL 18',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '90 E 22',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '90 E 25',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M2,
    engine: '90 E/EL 18',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT', 'MANN:WK950/19'],
  },
  {
    model: M4,
    engine: '250',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:W1170/7'],
  },
  {
    model: M4,
    engine: '270',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:W1170/7'],
  },
  {
    model: M4,
    engine: '310',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:W1170/7'],
  },
  {
    model: M6,
    engine: '310',
    products: ['MANN:C321420/2', 'MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M6,
    engine: '330',
    products: ['MANN:C321420/2', 'MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M6,
    engine: '360',
    products: ['MANN:C321420/2', 'MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M6,
    engine: '400',
    products: ['MANN:C321420/2', 'MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M6,
    engine: '420',
    products: ['MANN:C321420/2', 'MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M6,
    engine: '420 (440X42)',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M6,
    engine: '460 (190S46, 260S46, 440S46)',
    products: ['MANN:C321420/2', 'MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M6,
    engine: '460 (440X46)',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M6,
    engine: '480',
    products: ['MANN:C321420/2', 'MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M6,
    engine: '480 (440X48)',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M6,
    engine: '510',
    products: ['MANN:C321420/2', 'MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M6,
    engine: '570',
    products: ['MANN:C321420/2', 'MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M5,
    engine: '270 CNG',
    products: [
      'MANN:C321420/2',
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1170/7',
    ],
  },
  {
    model: M5,
    engine: '300 CNG',
    products: [
      'MANN:C321420/2',
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1170/7',
    ],
  },
  {
    model: M5,
    engine: '310',
    products: ['MANN:C321420/2', 'MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT'],
  },
  {
    model: M5,
    engine: '330',
    products: [
      'MANN:C321420/2',
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1170/7',
      'MANN:WK950/19',
    ],
  },
  {
    model: M5,
    engine: '330 CNG',
    products: [
      'MANN:C321420/2',
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1170/7',
    ],
  },
  {
    model: M5,
    engine: '360',
    products: [
      'MANN:C321420/2',
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1170/7',
      'MANN:WK950/19',
    ],
  },
  {
    model: M5,
    engine: '400',
    products: ['MANN:C321420/2', 'MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT'],
  },
  {
    model: M5,
    engine: '410',
    products: ['MANN:C321420/2', 'MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT'],
  },
  {
    model: M5,
    engine: '420',
    products: [
      'MANN:C321420/2',
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1170/7',
      'MANN:WK950/19',
    ],
  },
  {
    model: M5,
    engine: '450',
    products: [
      'MANN:C321420/2',
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1170/7',
      'MANN:WK950/19',
    ],
  },
  {
    model: M5,
    engine: '460 (190S46, 260S46, 440S46)',
    products: [
      'MANN:C321420/2',
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:WK950/19',
    ],
  },
  {
    model: M5,
    engine: '480',
    products: ['MANN:C321420/2', 'MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:U630xKIT'],
  },
  {
    model: M5,
    engine: '500',
    products: [
      'MANN:C321420/2',
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1170/7',
      'MANN:WK950/19',
    ],
  },
  {
    model: M5,
    engine: '560',
    products: [
      'MANN:C321420/2',
      'MANN:H601/4',
      'MANN:TB1374x',
      'MANN:TB1394/1x',
      'MANN:U630xKIT',
      'MANN:W1170/7',
      'MANN:WK950/19',
    ],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const IVECOTRUCKS_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
