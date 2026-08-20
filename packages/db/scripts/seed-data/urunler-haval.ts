/**
 * ════════════════════════════════════════════════════════════════════════════
 *  HAVAL ÜRÜN VERİSİ — KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Kurallar `urunler-alfa-romeo.ts` ile aynıdır: fiyatlar KDV DAHİL vitrin
 *  fiyatıdır, OEM ve teknik ölçü yoktur, parça kodu görünmeyen ürün İÇE
 *  AKTARILMAZ. Yalnızca STOKTAKİ ürünler alındı (?stoktakiler=1).
 *
 *  Kaynağın HTML'i okundu. Kart başlığı bazen eksik geliyor; ayrıştırıcı önce
 *  bağlantının `title` özniteliğini, olmazsa görselin `alt` metnini deniyor.
 *  Kategori adının yedi yazımı için `urunler-bmw.ts` başındaki nota bakınız.
 *
 *  ⚠ SUNUCU KISITLAMASI: eşzamanlı istek sayısı yükseltilince kaynak BOŞ sayfa
 *  döndürüyor ve bu, "bu motorda ürün yok" gibi görünüyor. Bu yüzden çekimde
 *  her sayfanın "Toplam N ürün" işareti okunup kart sayısıyla karşılaştırıldı;
 *  tutmayan sayfa KAYDEDİLMEDİ, yeniden çekildi. Sonuçta 665 motorun hiçbiri
 *  ürünsüz değil.
 */
import type { SourceProduct } from './urunler-alfa-romeo'

export const HAVAL_PRODUCTS: Record<string, SourceProduct> = {
  'FILTRON:OP540/3': {
    brand: 'FILTRON',
    code: 'OP540/3',
    category: 'YAG_FILTRESI',
    priceGross: 416.92,
  },
  'MANN:W610/3': {
    brand: 'MANN-FILTER',
    code: 'W610/3',
    category: 'YAG_FILTRESI',
    priceGross: 237.82,
  },
  'MANN:W7063': {
    brand: 'MANN-FILTER',
    code: 'W7063',
    category: 'YAG_FILTRESI',
    priceGross: 549.27,
  },
}

const M1 = 'H7 / H7x'
const M2 = 'Jolion'

export const HAVAL_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: '1.5 GDIT 110kw 150hp',
    products: ['FILTRON:OP540/3', 'MANN:W7063'],
  },
  {
    model: M2,
    engine: '1.5T 105kw 143hp',
    products: ['MANN:W610/3'],
  },
  {
    model: M2,
    engine: '1.5T 110kw 150hp',
    products: ['FILTRON:OP540/3', 'MANN:W7063'],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const HAVAL_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
