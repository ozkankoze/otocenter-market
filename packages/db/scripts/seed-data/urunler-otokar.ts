/**
 * ════════════════════════════════════════════════════════════════════════════
 *  OTOKAR ÜRÜN VERİSİ — AĞIR VASITA, KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const OTOKAR_PRODUCTS: Record<string, SourceProduct> = {
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
  'MANN:W1160': {
    brand: 'MANN-FILTER',
    code: 'W1160',
    category: 'YAG_FILTRESI',
    priceGross: 517.71,
  },
}

const M1 = 'KENT'
const M2 = 'NAVIGO'
const M3 = 'TERRITO'
const M4 = 'VECTIO'

export const OTOKAR_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: '290 H,LF',
    products: ['MANN:H601/4', 'MANN:PU1058x', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M1,
    engine: 'Kent C 280',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M1,
    engine: 'Kent C 370',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M2,
    engine: '140 S, City, Maxi City',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M2,
    engine: '160 S Maxi',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M2,
    engine: '180 C, T, U Euro 6',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M2,
    engine: '185 S, SE, SH, LX',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M3,
    engine: 'Territo U',
    products: ['MANN:H601/4', 'MANN:PU1058x', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M4,
    engine: '190 H, S',
    products: ['MANN:H601/4', 'MANN:PU1058x', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M4,
    engine: '215 LE, T',
    products: ['MANN:H601/4', 'MANN:PU1058x', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M4,
    engine: '230 DG',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M4,
    engine: '250 LE, S, T, U',
    products: ['MANN:H601/4', 'MANN:PU1059x', 'MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:W1160'],
  },
  {
    model: M4,
    engine: '250 T',
    products: ['MANN:H601/4', 'MANN:PU1059x', 'MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:W1160'],
  },
  {
    model: M4,
    engine: '290 T',
    products: ['MANN:H601/4', 'MANN:PU1059x', 'MANN:TB1374x', 'MANN:TB1394/1x', 'MANN:W1160'],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const OTOKAR_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
