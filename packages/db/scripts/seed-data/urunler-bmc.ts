/**
 * ════════════════════════════════════════════════════════════════════════════
 *  BMC ÜRÜN VERİSİ — AĞIR VASITA, KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const BMC_PRODUCTS: Record<string, SourceProduct> = {
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
}

const M1 = 'Fatih'
const M2 = 'Probus'
const M3 = 'Procity'
const M4 = 'Professional'

export const BMC_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: '180',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M2,
    engine: '850',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M3,
    engine: '12M',
    products: ['MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M4,
    engine: 'PRO 1144',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M4,
    engine: 'PRO 518',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M4,
    engine: 'PRO 522',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M4,
    engine: 'PRO 628',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M4,
    engine: 'PRO 938',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
  {
    model: M4,
    engine: 'PRO 940',
    products: ['MANN:H601/4', 'MANN:TB1374x', 'MANN:TB1394/1x'],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const BMC_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
