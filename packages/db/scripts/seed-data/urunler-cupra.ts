/**
 * ════════════════════════════════════════════════════════════════════════════
 *  CUPRA ÜRÜN VERİSİ — KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Kurallar `urunler-alfa-romeo.ts` ile aynıdır: fiyatlar KDV DAHİL vitrin
 *  fiyatıdır, OEM ve teknik ölçü yoktur, parça kodu görünmeyen ürün İÇE
 *  AKTARILMAZ. Yalnızca STOKTAKİ ürünler alındı (?stoktakiler=1).
 *
 *  Kaynağın HTML'i okundu; kod hiçbir üründe kırpılmadı, MISSING_CODE boş.
 *  Kategori adının beş yazımı ve "aynı ürün iki kez listelenir" tuhaflığı
 *  için `urunler-bmw.ts` başındaki nota bakınız.
 */
import type { SourceProduct } from './urunler-alfa-romeo'

export const CUPRA_PRODUCTS: Record<string, SourceProduct> = {
  'FILTRON:AP062/1': {
    brand: 'FILTRON',
    code: 'AP062/1',
    category: 'HAVA_FILTRESI',
    priceGross: 484.24,
  },
  'FILTRON:AP139/5': {
    brand: 'FILTRON',
    code: 'AP139/5',
    category: 'HAVA_FILTRESI',
    priceGross: 468.25,
  },
  'FILTRON:AP139/6': {
    brand: 'FILTRON',
    code: 'AP139/6',
    category: 'HAVA_FILTRESI',
    priceGross: 628.81,
  },
  'FILTRON:AP183/6': {
    brand: 'FILTRON',
    code: 'AP183/6',
    category: 'HAVA_FILTRESI',
    priceGross: 432,
  },
  'FILTRON:K1311': {
    brand: 'FILTRON',
    code: 'K1311',
    category: 'POLEN_FILTRESI',
    priceGross: 363.49,
  },
  'FILTRON:K1311A': {
    brand: 'FILTRON',
    code: 'K1311A',
    category: 'POLEN_FILTRESI',
    priceGross: 499.68,
  },
  'FILTRON:OE688/5': {
    brand: 'FILTRON',
    code: 'OE688/5',
    category: 'YAG_FILTRESI',
    priceGross: 250.16,
  },
  'FILTRON:OE688/6': {
    brand: 'FILTRON',
    code: 'OE688/6',
    category: 'YAG_FILTRESI',
    priceGross: 319.49,
  },
  'FILTRON:OP616/3': {
    brand: 'FILTRON',
    code: 'OP616/3',
    category: 'YAG_FILTRESI',
    priceGross: 282.83,
  },
  'FILTRON:PE973/9': {
    brand: 'FILTRON',
    code: 'PE973/9',
    category: 'YAKIT_FILTRESI',
    priceGross: 1043.64,
  },
  'FILTRON:PE993/2': {
    brand: 'FILTRON',
    code: 'PE993/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 1010.73,
  },
  'MANN:C27009': {
    brand: 'MANN-FILTER',
    code: 'C27009',
    category: 'HAVA_FILTRESI',
    priceGross: 752.43,
  },
  'MANN:C28043': {
    brand: 'MANN-FILTER',
    code: 'C28043',
    category: 'HAVA_FILTRESI',
    priceGross: 877.36,
  },
  'MANN:C30004': {
    brand: 'MANN-FILTER',
    code: 'C30004',
    category: 'HAVA_FILTRESI',
    priceGross: 898.76,
  },
  'MANN:C30005': {
    brand: 'MANN-FILTER',
    code: 'C30005',
    category: 'HAVA_FILTRESI',
    priceGross: 707.85,
  },
  'MANN:CU26009': {
    brand: 'MANN-FILTER',
    code: 'CU26009',
    category: 'POLEN_FILTRESI',
    priceGross: 452.51,
  },
  'MANN:CUK26009': {
    brand: 'MANN-FILTER',
    code: 'CUK26009',
    category: 'POLEN_FILTRESI',
    priceGross: 772.35,
  },
  'MANN:FP26009': {
    brand: 'MANN-FILTER',
    code: 'FP26009',
    category: 'POLEN_FILTRESI',
    priceGross: 992.07,
  },
  'MANN:H6031z': {
    brand: 'MANN-FILTER',
    code: 'H6031z',
    category: 'SANZUMAN_FILTRESI',
    priceGross: 963.27,
  },
  'MANN:HU5003z': {
    brand: 'MANN-FILTER',
    code: 'HU5003z',
    category: 'YAG_FILTRESI',
    priceGross: 432.78,
  },
  'MANN:HU6013z': {
    brand: 'MANN-FILTER',
    code: 'HU6013z',
    category: 'YAG_FILTRESI',
    priceGross: 388.98,
  },
  'MANN:PU8028': {
    brand: 'MANN-FILTER',
    code: 'PU8028',
    category: 'YAKIT_FILTRESI',
    priceGross: 1156.79,
  },
  'MANN:W712/95': {
    brand: 'MANN-FILTER',
    code: 'W712/95',
    category: 'YAG_FILTRESI',
    priceGross: 376.42,
  },
}

const M1 = 'Formentor'

export const CUPRA_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: '2.0 TDI 110kw 150hp',
    products: [
      'FILTRON:AP139/5',
      'FILTRON:AP139/6',
      'FILTRON:K1311',
      'FILTRON:K1311A',
      'FILTRON:OE688/6',
      'FILTRON:PE973/9',
      'FILTRON:PE993/2',
      'MANN:C30004',
      'MANN:C30005',
      'MANN:CU26009',
      'MANN:CUK26009',
      'MANN:FP26009',
      'MANN:H6031z',
      'MANN:HU5003z',
      'MANN:PU8028',
    ],
  },
  {
    model: M1,
    engine: '1.4 e-Hybrid 150kw 204hp',
    products: [
      'FILTRON:AP062/1',
      'FILTRON:K1311',
      'FILTRON:K1311A',
      'FILTRON:OP616/3',
      'MANN:C27009',
      'MANN:CU26009',
      'MANN:CUK26009',
      'MANN:FP26009',
      'MANN:H6031z',
      'MANN:W712/95',
    ],
  },
  {
    model: M1,
    engine: '1.4 e-Hybrid 180kw 245hp',
    products: [
      'FILTRON:AP062/1',
      'FILTRON:K1311',
      'FILTRON:K1311A',
      'FILTRON:OP616/3',
      'MANN:C27009',
      'MANN:CU26009',
      'MANN:CUK26009',
      'MANN:FP26009',
      'MANN:H6031z',
      'MANN:W712/95',
    ],
  },
  {
    model: M1,
    engine: '1.5 TSI 110kw 150hp',
    products: [
      'FILTRON:AP183/6',
      'FILTRON:K1311',
      'FILTRON:K1311A',
      'FILTRON:OP616/3',
      'MANN:C28043',
      'MANN:CU26009',
      'MANN:CUK26009',
      'MANN:FP26009',
      'MANN:H6031z',
      'MANN:W712/95',
    ],
  },
  {
    model: M1,
    engine: '2.0 TSI 140kw 190hp',
    products: [
      'FILTRON:AP139/5',
      'FILTRON:K1311',
      'FILTRON:K1311A',
      'FILTRON:OE688/5',
      'MANN:C30005',
      'MANN:CU26009',
      'MANN:CUK26009',
      'MANN:FP26009',
      'MANN:H6031z',
      'MANN:HU6013z',
    ],
  },
  {
    model: M1,
    engine: '2.0 TSI 180kw 245hp',
    products: [
      'FILTRON:AP139/5',
      'FILTRON:K1311',
      'FILTRON:K1311A',
      'FILTRON:OE688/5',
      'MANN:C30005',
      'MANN:CU26009',
      'MANN:CUK26009',
      'MANN:FP26009',
      'MANN:H6031z',
      'MANN:HU6013z',
    ],
  },
  {
    model: M1,
    engine: '2.0 TSI 228kw 310hp',
    products: [
      'FILTRON:AP139/5',
      'FILTRON:K1311',
      'FILTRON:K1311A',
      'FILTRON:OE688/5',
      'MANN:C30005',
      'MANN:CU26009',
      'MANN:CUK26009',
      'MANN:FP26009',
      'MANN:H6031z',
      'MANN:HU6013z',
    ],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const CUPRA_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
