/**
 * ════════════════════════════════════════════════════════════════════════════
 *  GENESIS ÜRÜN VERİSİ — KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const GENESIS_PRODUCTS: Record<string, SourceProduct> = {
  'FILTRON:OE674/6': {
    brand: 'FILTRON',
    code: 'OE674/6',
    category: 'YAG_FILTRESI',
    priceGross: 245.01,
  },
  'FILTRON:OE680/1': {
    brand: 'FILTRON',
    code: 'OE680/1',
    category: 'YAG_FILTRESI',
    priceGross: 552.29,
  },
  'FILTRON:OP617': {
    brand: 'FILTRON',
    code: 'OP617',
    category: 'YAG_FILTRESI',
    priceGross: 301.72,
  },
  'MANN:CU23024': {
    brand: 'MANN-FILTER',
    code: 'CU23024',
    category: 'POLEN_FILTRESI',
    priceGross: 894.91,
  },
  'MANN:CUK23024': {
    brand: 'MANN-FILTER',
    code: 'CUK23024',
    category: 'POLEN_FILTRESI',
    priceGross: 1073.98,
  },
  'MANN:FP23024': {
    brand: 'MANN-FILTER',
    code: 'FP23024',
    category: 'POLEN_FILTRESI',
    priceGross: 3686.95,
  },
  'MANN:HU7027z': {
    brand: 'MANN-FILTER',
    code: 'HU7027z',
    category: 'YAG_FILTRESI',
    priceGross: 570.14,
  },
  'MANN:W811/80': {
    brand: 'MANN-FILTER',
    code: 'W811/80',
    category: 'YAG_FILTRESI',
    priceGross: 226.26,
  },
}

const M1 = 'G70'
const M2 = 'G80 II (RG)'
const M3 = 'GV60 (JW)'
const M4 = 'GV70'

export const GENESIS_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: '2.0 T-GDi 145kw 197hp',
    products: ['FILTRON:OP617', 'MANN:W811/80'],
  },
  {
    model: M1,
    engine: '2.0 T-GDi 180kw 245hp',
    products: ['FILTRON:OP617', 'MANN:W811/80'],
  },
  {
    model: M1,
    engine: '2.2 CRDi 147kw 200hp',
    products: ['FILTRON:OE674/6', 'MANN:HU7027z'],
  },
  {
    model: M2,
    engine: '2.2 154kw 210hp',
    products: ['FILTRON:OE680/1'],
  },
  {
    model: M3,
    engine: 'Standard 168kw 228hp',
    products: ['MANN:CU23024', 'MANN:CUK23024', 'MANN:FP23024'],
  },
  {
    model: M3,
    engine: 'Standard AWD 234kw 318hp',
    products: ['MANN:CU23024', 'MANN:CUK23024', 'MANN:FP23024'],
  },
  {
    model: M4,
    engine: '2.2 148kw 201hp',
    products: ['FILTRON:OE680/1'],
  },
  {
    model: M4,
    engine: '2.2 154kw 210hp',
    products: ['FILTRON:OE680/1'],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const GENESIS_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
