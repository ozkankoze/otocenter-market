/**
 * ════════════════════════════════════════════════════════════════════════════
 *  TESLA ÜRÜN VERİSİ — KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const TESLA_PRODUCTS: Record<string, SourceProduct> = {
  'FILTRON:K1325A': {
    brand: 'FILTRON',
    code: 'K1325A',
    category: 'POLEN_FILTRESI',
    priceGross: 418.89,
  },
  'FILTRON:K1365A': {
    brand: 'FILTRON',
    code: 'K1365A',
    category: 'POLEN_FILTRESI',
    priceGross: 1911.93,
  },
  'FILTRON:K1376A': {
    brand: 'FILTRON',
    code: 'K1376A',
    category: 'POLEN_FILTRESI',
    priceGross: 987.65,
  },
  'MANN:CUK46025': {
    brand: 'MANN-FILTER',
    code: 'CUK46025',
    category: 'POLEN_FILTRESI',
    priceGross: 1499.52,
  },
  'MANN:FP25015': {
    brand: 'MANN-FILTER',
    code: 'FP25015',
    category: 'POLEN_FILTRESI',
    priceGross: 863.13,
  },
}

const M1 = 'Model 3'
const M2 = 'Model S'
const M3 = 'Model X'
const M4 = 'Model Y'

export const TESLA_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: 'Model 3 EV 153kw 208hp',
    products: ['MANN:FP25015'],
  },
  {
    model: M1,
    engine: 'Model 3 EV 175kw 238hp',
    products: ['MANN:FP25015'],
  },
  {
    model: M1,
    engine: 'Model 3 EV 202kw 275hp',
    products: ['MANN:FP25015'],
  },
  {
    model: M1,
    engine: 'Model 3 EV 220kw 299hp',
    products: ['MANN:FP25015'],
  },
  {
    model: M1,
    engine: 'Model 3 EV 225kw 306hp',
    products: ['MANN:FP25015'],
  },
  {
    model: M1,
    engine: 'Model 3 EV 239kw 325hp',
    products: ['MANN:FP25015'],
  },
  {
    model: M1,
    engine: 'Model 3 EV 324kw 441hp',
    products: ['MANN:FP25015'],
  },
  {
    model: M1,
    engine: 'Model 3 EV 355kw 482hp',
    products: ['MANN:FP25015'],
  },
  {
    model: M1,
    engine: 'Model 3 EV 361kw 491hp',
    products: ['MANN:FP25015'],
  },
  {
    model: M1,
    engine: 'Model 3 EV 377kw 513hp',
    products: ['MANN:FP25015'],
  },
  {
    model: M1,
    engine: 'Model 3 EV Perfomance 339kw 461hp',
    products: ['MANN:FP25015'],
  },
  {
    model: M1,
    engine: 'Model 3 EV Perfomance 393kw 534hp',
    products: ['MANN:FP25015'],
  },
  {
    model: M2,
    engine: 'MODEL S EV 386kw 525hp',
    products: ['FILTRON:K1325A', 'FILTRON:K1376A'],
  },
  {
    model: M2,
    engine: 'MODEL S EV 413kw 562hp',
    products: ['FILTRON:K1325A', 'FILTRON:K1376A'],
  },
  {
    model: M2,
    engine: 'MODEL S EV 421kw 573hp',
    products: ['FILTRON:K1325A', 'FILTRON:K1376A'],
  },
  {
    model: M2,
    engine: 'MODEL S EV 493kw 670hp',
    products: ['FILTRON:K1325A', 'FILTRON:K1376A'],
  },
  {
    model: M2,
    engine: 'MODEL S EV 568kw 772hp',
    products: ['FILTRON:K1325A', 'FILTRON:K1376A'],
  },
  {
    model: M2,
    engine: 'MODEL S EV 585kw 796hp',
    products: ['FILTRON:K1325A', 'FILTRON:K1376A'],
  },
  {
    model: M2,
    engine: 'MODEL S EV 599kw 815hp',
    products: ['FILTRON:K1325A', 'FILTRON:K1376A'],
  },
  {
    model: M2,
    engine: 'MODEL S EV 760kw 1033hp',
    products: ['FILTRON:K1325A', 'FILTRON:K1376A'],
  },
  {
    model: M2,
    engine: 'Model S Plaid 750kw 1020hp',
    products: ['FILTRON:K1325A', 'FILTRON:K1376A'],
  },
  {
    model: M3,
    engine: 'MODEL X EV 386kw 525hp',
    products: ['FILTRON:K1365A'],
  },
  {
    model: M3,
    engine: 'MODEL X EV 413kw 562hp',
    products: ['FILTRON:K1365A'],
  },
  {
    model: M3,
    engine: 'MODEL X EV 421kw 573hp',
    products: ['FILTRON:K1365A'],
  },
  {
    model: M3,
    engine: 'MODEL X EV 568kw 772hp',
    products: ['FILTRON:K1365A'],
  },
  {
    model: M3,
    engine: 'MODEL X EV 585kw 796hp',
    products: ['FILTRON:K1365A'],
  },
  {
    model: M3,
    engine: 'MODEL X EV 599kw 815hp',
    products: ['FILTRON:K1365A'],
  },
  {
    model: M3,
    engine: 'MODEL X EV 760kw 1033hp',
    products: ['FILTRON:K1365A'],
  },
  {
    model: M3,
    engine: 'MODEL X EV Plaid 750kw 1020hp',
    products: ['FILTRON:K1365A'],
  },
  {
    model: M4,
    engine: 'EV 192kw 261hp',
    products: ['MANN:CUK46025', 'MANN:FP25015'],
  },
  {
    model: M4,
    engine: 'EV 194kw 264hp',
    products: ['MANN:CUK46025', 'MANN:FP25015'],
  },
  {
    model: M4,
    engine: 'EV 220kw 299hp',
    products: ['MANN:CUK46025', 'MANN:FP25015'],
  },
  {
    model: M4,
    engine: 'EV 255kw 347hp',
    products: ['MANN:CUK46025', 'MANN:FP25015'],
  },
  {
    model: M4,
    engine: 'EV All-wheel Drive 258kw 351hp',
    products: ['MANN:CUK46025', 'MANN:FP25015'],
  },
  {
    model: M4,
    engine: 'EV All-wheel Drive 331kw 450hp',
    products: ['MANN:CUK46025', 'MANN:FP25015'],
  },
  {
    model: M4,
    engine: 'EV All-wheel Drive 378kw 514hp',
    products: ['MANN:CUK46025', 'MANN:FP25015'],
  },
  {
    model: M4,
    engine: 'EV Performance All-wheel Drive 340kw 462hp',
    products: ['MANN:CUK46025', 'MANN:FP25015'],
  },
  {
    model: M4,
    engine: 'EV Performance All-wheel Drive 393kw 534hp',
    products: ['MANN:CUK46025', 'MANN:FP25015'],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const TESLA_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
