/**
 * ════════════════════════════════════════════════════════════════════════════
 *  HONDA ÜRÜN VERİSİ — KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const HONDA_PRODUCTS: Record<string, SourceProduct> = {
  'FILTRON:AP102/3': {
    brand: 'FILTRON',
    code: 'AP102/3',
    category: 'HAVA_FILTRESI',
    priceGross: 438.22,
  },
  'FILTRON:AP103/2': {
    brand: 'FILTRON',
    code: 'AP103/2',
    category: 'HAVA_FILTRESI',
    priceGross: 509.81,
  },
  'FILTRON:AP103/3': {
    brand: 'FILTRON',
    code: 'AP103/3',
    category: 'HAVA_FILTRESI',
    priceGross: 633.47,
  },
  'FILTRON:AP103/4': {
    brand: 'FILTRON',
    code: 'AP103/4',
    category: 'HAVA_FILTRESI',
    priceGross: 407.85,
  },
  'FILTRON:AP104/1': {
    brand: 'FILTRON',
    code: 'AP104/1',
    category: 'HAVA_FILTRESI',
    priceGross: 227.79,
  },
  'FILTRON:AP104/2': {
    brand: 'FILTRON',
    code: 'AP104/2',
    category: 'HAVA_FILTRESI',
    priceGross: 373.14,
  },
  'FILTRON:AP104/6': {
    brand: 'FILTRON',
    code: 'AP104/6',
    category: 'HAVA_FILTRESI',
    priceGross: 472.93,
  },
  'FILTRON:AP104/7': {
    brand: 'FILTRON',
    code: 'AP104/7',
    category: 'HAVA_FILTRESI',
    priceGross: 429.55,
  },
  'FILTRON:AP104/8': {
    brand: 'FILTRON',
    code: 'AP104/8',
    category: 'HAVA_FILTRESI',
    priceGross: 498.97,
  },
  'FILTRON:AP104/9': {
    brand: 'FILTRON',
    code: 'AP104/9',
    category: 'HAVA_FILTRESI',
    priceGross: 820.04,
  },
  'FILTRON:AP105/1': {
    brand: 'FILTRON',
    code: 'AP105/1',
    category: 'HAVA_FILTRESI',
    priceGross: 522.83,
  },
  'FILTRON:AP105/7': {
    brand: 'FILTRON',
    code: 'AP105/7',
    category: 'HAVA_FILTRESI',
    priceGross: 624.79,
  },
  'FILTRON:AP106/1': {
    brand: 'FILTRON',
    code: 'AP106/1',
    category: 'HAVA_FILTRESI',
    priceGross: 414.36,
  },
  'FILTRON:AP106/3': {
    brand: 'FILTRON',
    code: 'AP106/3',
    category: 'HAVA_FILTRESI',
    priceGross: 321.07,
  },
  'FILTRON:AP106/4': {
    brand: 'FILTRON',
    code: 'AP106/4',
    category: 'HAVA_FILTRESI',
    priceGross: 390.5,
  },
  'FILTRON:AP106/6': {
    brand: 'FILTRON',
    code: 'AP106/6',
    category: 'HAVA_FILTRESI',
    priceGross: 648.66,
  },
  'FILTRON:AR246/2': {
    brand: 'FILTRON',
    code: 'AR246/2',
    category: 'HAVA_FILTRESI',
    priceGross: 414.36,
  },
  'FILTRON:K1087': {
    brand: 'FILTRON',
    code: 'K1087',
    category: 'POLEN_FILTRESI',
    priceGross: 208.26,
  },
  'FILTRON:K1164': {
    brand: 'FILTRON',
    code: 'K1164',
    category: 'POLEN_FILTRESI',
    priceGross: 342.77,
  },
  'FILTRON:K1175': {
    brand: 'FILTRON',
    code: 'K1175',
    category: 'POLEN_FILTRESI',
    priceGross: 292.87,
  },
  'FILTRON:K1198-2x': {
    brand: 'FILTRON',
    code: 'K1198-2x',
    category: 'POLEN_FILTRESI',
    priceGross: 260.33,
  },
  'FILTRON:K1298': {
    brand: 'FILTRON',
    code: 'K1298',
    category: 'POLEN_FILTRESI',
    priceGross: 346.13,
  },
  'FILTRON:K1298A': {
    brand: 'FILTRON',
    code: 'K1298A',
    category: 'POLEN_FILTRESI',
    priceGross: 737.76,
  },
  'FILTRON:OE648/4': {
    brand: 'FILTRON',
    code: 'OE648/4',
    category: 'YAG_FILTRESI',
    priceGross: 266.84,
  },
  'FILTRON:OE683/1': {
    brand: 'FILTRON',
    code: 'OE683/1',
    category: 'YAG_FILTRESI',
    priceGross: 271.18,
  },
  'FILTRON:OP575': {
    brand: 'FILTRON',
    code: 'OP575',
    category: 'YAG_FILTRESI',
    priceGross: 241.54,
  },
  'MANN:C1724': {
    brand: 'MANN-FILTER',
    code: 'C1724',
    category: 'HAVA_FILTRESI',
    priceGross: 1186.14,
  },
  'MANN:C18004': {
    brand: 'MANN-FILTER',
    code: 'C18004',
    category: 'HAVA_FILTRESI',
    priceGross: 768.92,
  },
  'MANN:C20003': {
    brand: 'MANN-FILTER',
    code: 'C20003',
    category: 'HAVA_FILTRESI',
    priceGross: 974.25,
  },
  'MANN:C20014': {
    brand: 'MANN-FILTER',
    code: 'C20014',
    category: 'HAVA_FILTRESI',
    priceGross: 1050.71,
  },
  'MANN:C2055': {
    brand: 'MANN-FILTER',
    code: 'C2055',
    category: 'HAVA_FILTRESI',
    priceGross: 528.64,
  },
  'MANN:C2240': {
    brand: 'MANN-FILTER',
    code: 'C2240',
    category: 'HAVA_FILTRESI',
    priceGross: 806.05,
  },
  'MANN:C24021': {
    brand: 'MANN-FILTER',
    code: 'C24021',
    category: 'HAVA_FILTRESI',
    priceGross: 803.87,
  },
  'MANN:C26021': {
    brand: 'MANN-FILTER',
    code: 'C26021',
    category: 'HAVA_FILTRESI',
    priceGross: 1007.02,
  },
  'MANN:C27002': {
    brand: 'MANN-FILTER',
    code: 'C27002',
    category: 'HAVA_FILTRESI',
    priceGross: 943.67,
  },
  'MANN:C28023': {
    brand: 'MANN-FILTER',
    code: 'C28023',
    category: 'HAVA_FILTRESI',
    priceGross: 972.07,
  },
  'MANN:C31005': {
    brand: 'MANN-FILTER',
    code: 'C31005',
    category: 'HAVA_FILTRESI',
    priceGross: 797.31,
  },
  'MANN:C3324': {
    brand: 'MANN-FILTER',
    code: 'C3324',
    category: 'HAVA_FILTRESI',
    priceGross: 699.01,
  },
  'MANN:C3434': {
    brand: 'MANN-FILTER',
    code: 'C3434',
    category: 'HAVA_FILTRESI',
    priceGross: 646.59,
  },
  'MANN:C35008': {
    brand: 'MANN-FILTER',
    code: 'C35008',
    category: 'HAVA_FILTRESI',
    priceGross: 934.93,
  },
  'MANN:C37005': {
    brand: 'MANN-FILTER',
    code: 'C37005',
    category: 'HAVA_FILTRESI',
    priceGross: 1020.12,
  },
  'MANN:CU1835': {
    brand: 'MANN-FILTER',
    code: 'CU1835',
    category: 'POLEN_FILTRESI',
    priceGross: 580.71,
  },
  'MANN:CU21003': {
    brand: 'MANN-FILTER',
    code: 'CU21003',
    category: 'POLEN_FILTRESI',
    priceGross: 817.85,
  },
  'MANN:CU2327-2': {
    brand: 'MANN-FILTER',
    code: 'CU2327-2',
    category: 'POLEN_FILTRESI',
    priceGross: 688.09,
  },
  'MANN:CU2351': {
    brand: 'MANN-FILTER',
    code: 'CU2351',
    category: 'POLEN_FILTRESI',
    priceGross: 500.6,
  },
  'MANN:CUK2358': {
    brand: 'MANN-FILTER',
    code: 'CUK2358',
    category: 'POLEN_FILTRESI',
    priceGross: 784.21,
  },
  'MANN:FP21003': {
    brand: 'MANN-FILTER',
    code: 'FP21003',
    category: 'POLEN_FILTRESI',
    priceGross: 925.72,
  },
  'MANN:FP2358': {
    brand: 'MANN-FILTER',
    code: 'FP2358',
    category: 'POLEN_FILTRESI',
    priceGross: 1017.94,
  },
  'MANN:HU712/9x': {
    brand: 'MANN-FILTER',
    code: 'HU712/9x',
    category: 'YAG_FILTRESI',
    priceGross: 427.8,
  },
  'MANN:HU718/6x': {
    brand: 'MANN-FILTER',
    code: 'HU718/6x',
    category: 'YAG_FILTRESI',
    priceGross: 507.88,
  },
  'MANN:HU820x': {
    brand: 'MANN-FILTER',
    code: 'HU820x',
    category: 'YAG_FILTRESI',
    priceGross: 365.89,
  },
  'MANN:W610/6': {
    brand: 'MANN-FILTER',
    code: 'W610/6',
    category: 'YAG_FILTRESI',
    priceGross: 315.8,
  },
  'MANN:WK853/16': {
    brand: 'MANN-FILTER',
    code: 'WK853/16',
    category: 'YAKIT_FILTRESI',
    priceGross: 1103.13,
  },
}

const M1 = 'Accord IX'
const M2 = 'Accord VIII'
const M3 = 'Accord X'
const M4 = 'CR-V I'
const M5 = 'CR-V II'
const M6 = 'CR-V III'
const M7 = 'CR-V IV'
const M8 = 'CR-V V (RW)'
const M9 = 'CR-Z'
const M10 = 'City'
const M11 = 'Civic IX'
const M12 = 'Civic VII'
const M13 = 'Civic VIII'
const M14 = 'Civic X'
const M15 = 'Civic XI (FL)'
const M16 = 'FR-V'
const M17 = 'HR-V'
const M18 = 'HR-V II'
const M19 = 'Jazz II'
const M20 = 'Jazz III'
const M21 = 'Jazz IV'
const M22 = 'Jazz V / Fit V (GR)'

export const HONDA_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: '2.0 115kw 156hp',
    products: ['FILTRON:OP575', 'MANN:CUK2358', 'MANN:FP2358', 'MANN:W610/6'],
  },
  {
    model: M1,
    engine: '2.0 i 110kw 150hp',
    products: [
      'FILTRON:AP102/3',
      'FILTRON:OP575',
      'MANN:C3434',
      'MANN:CUK2358',
      'MANN:FP2358',
      'MANN:W610/6',
    ],
  },
  {
    model: M1,
    engine: '2.2 i-DTEC 110kw 150hp',
    products: ['FILTRON:OE683/1', 'MANN:C35008', 'MANN:CUK2358', 'MANN:FP2358', 'MANN:HU712/9x'],
  },
  {
    model: M1,
    engine: '2.2 i-DTEC 132kw 180hp',
    products: ['FILTRON:OE683/1', 'MANN:C35008', 'MANN:CUK2358', 'MANN:FP2358', 'MANN:HU712/9x'],
  },
  {
    model: M1,
    engine: '2.4 132kw 179hp',
    products: ['FILTRON:OP575', 'MANN:CUK2358', 'MANN:FP2358', 'MANN:W610/6'],
  },
  {
    model: M1,
    engine: '2.4 148kw 201hp',
    products: ['FILTRON:OP575', 'MANN:CUK2358', 'MANN:FP2358', 'MANN:W610/6'],
  },
  {
    model: M2,
    engine: '2.0 114kw 155hp',
    products: [
      'FILTRON:AP102/3',
      'FILTRON:OP575',
      'MANN:C3434',
      'MANN:CUK2358',
      'MANN:FP2358',
      'MANN:W610/6',
    ],
  },
  {
    model: M2,
    engine: '2.2 i-CDTi 103kw 140hp',
    products: ['MANN:C37005', 'MANN:CUK2358', 'MANN:FP2358', 'MANN:HU718/6x', 'MANN:WK853/16'],
  },
  {
    model: M2,
    engine: '2.4 140kw 190hp',
    products: [
      'FILTRON:AP102/3',
      'FILTRON:OP575',
      'MANN:C3434',
      'MANN:CUK2358',
      'MANN:FP2358',
      'MANN:W610/6',
    ],
  },
  {
    model: M3,
    engine: '1.5 iVTEC 138kw 188hp',
    products: ['FILTRON:OP575', 'MANN:W610/6'],
  },
  {
    model: M3,
    engine: '2.0 iVTEC 182kw 247hp',
    products: ['FILTRON:OP575', 'MANN:W610/6'],
  },
  {
    model: M6,
    engine: '2.0 VTEC 110kw 150hp',
    products: [
      'FILTRON:AP105/1',
      'FILTRON:OP575',
      'MANN:C26021',
      'MANN:CUK2358',
      'MANN:FP2358',
      'MANN:W610/6',
    ],
  },
  {
    model: M6,
    engine: '2.2 CDTi 103kw 140hp',
    products: ['FILTRON:OE683/1', 'MANN:CUK2358', 'MANN:FP2358', 'MANN:HU712/9x'],
  },
  {
    model: M6,
    engine: '2.2 i-DTEC 110kw 150hp',
    products: ['FILTRON:OE683/1', 'MANN:CUK2358', 'MANN:FP2358', 'MANN:HU712/9x'],
  },
  {
    model: M6,
    engine: '2.4 VTEC 122kw 166hp',
    products: [
      'FILTRON:AP105/7',
      'FILTRON:OP575',
      'MANN:C27002',
      'MANN:CUK2358',
      'MANN:FP2358',
      'MANN:W610/6',
    ],
  },
  {
    model: M5,
    engine: '2.0 16V 110kw 150hp',
    products: [
      'FILTRON:AR246/2',
      'FILTRON:K1198-2x',
      'FILTRON:OP575',
      'MANN:CU2327-2',
      'MANN:W610/6',
    ],
  },
  {
    model: M5,
    engine: '2.2 CDTi 103kw 140hp',
    products: ['FILTRON:K1198-2x', 'MANN:CU2327-2', 'MANN:HU718/6x'],
  },
  {
    model: M7,
    engine: '1.6 i-DTEC 118kw 160hp',
    products: ['MANN:CUK2358', 'MANN:FP2358'],
  },
  {
    model: M7,
    engine: '1.6 i-DTEC 88kw 120hp',
    products: ['MANN:CUK2358', 'MANN:FP2358'],
  },
  {
    model: M7,
    engine: '2.0 VTEC 114kw 155hp',
    products: ['FILTRON:OP575', 'MANN:CUK2358', 'MANN:FP2358', 'MANN:W610/6'],
  },
  {
    model: M7,
    engine: '2.2 i-DTEC 110kw 150hp',
    products: ['FILTRON:OE683/1', 'MANN:CUK2358', 'MANN:FP2358', 'MANN:HU712/9x'],
  },
  {
    model: M7,
    engine: '2.4 i-VTEC 136kw 185hp',
    products: ['FILTRON:OP575', 'MANN:CUK2358', 'MANN:FP2358', 'MANN:W610/6'],
  },
  {
    model: M4,
    engine: '2.0 16V 108kw 148hp',
    products: [
      'FILTRON:AP104/1',
      'FILTRON:K1087',
      'FILTRON:OP575',
      'MANN:C2055',
      'MANN:CU2351',
      'MANN:W610/6',
    ],
  },
  {
    model: M8,
    engine: '2.0 e-CVT Hybrid 158kw 215hp',
    products: ['FILTRON:K1298', 'FILTRON:K1298A', 'FILTRON:OP575', 'MANN:CU21003', 'MANN:W610/6'],
  },
  {
    model: M9,
    engine: '1.5 Hybrid 84kw 114hp',
    products: ['FILTRON:K1298', 'FILTRON:OP575', 'MANN:CU21003', 'MANN:FP21003', 'MANN:W610/6'],
  },
  {
    model: M9,
    engine: '1.5 Hybrid 89kw 121hp',
    products: ['FILTRON:K1298', 'FILTRON:OP575', 'MANN:CU21003', 'MANN:FP21003', 'MANN:W610/6'],
  },
  {
    model: M10,
    engine: '1.4 VTEC 73kw 100hp',
    products: ['FILTRON:K1298', 'FILTRON:OP575', 'MANN:CU21003', 'MANN:FP21003', 'MANN:W610/6'],
  },
  {
    model: M10,
    engine: '1.5 VTEC 65kw 88hp',
    products: ['FILTRON:K1164', 'FILTRON:OP575', 'MANN:CU1835', 'MANN:W610/6'],
  },
  {
    model: M10,
    engine: '1.5 i-VTEC 88kw 120hp',
    products: ['FILTRON:K1298', 'MANN:CU21003', 'MANN:FP21003'],
  },
  {
    model: M11,
    engine: '1.4 i-VTEC 73kw 99hp',
    products: [
      'FILTRON:AP103/3',
      'FILTRON:OP575',
      'MANN:C20014',
      'MANN:CUK2358',
      'MANN:FP2358',
      'MANN:W610/6',
    ],
  },
  {
    model: M11,
    engine: '1.6 i-VTEC 92kw 125hp',
    products: [
      'FILTRON:AP103/4',
      'FILTRON:OP575',
      'MANN:C24021',
      'MANN:CUK2358',
      'MANN:FP2358',
      'MANN:W610/6',
    ],
  },
  {
    model: M11,
    engine: '1.6i-DTEC 88kw 120hp',
    products: ['MANN:CUK2358', 'MANN:FP2358'],
  },
  {
    model: M11,
    engine: '1.8 i-VTEC 104kw 141hp',
    products: [
      'FILTRON:AP103/4',
      'FILTRON:OP575',
      'MANN:C24021',
      'MANN:CUK2358',
      'MANN:FP2358',
      'MANN:W610/6',
    ],
  },
  {
    model: M11,
    engine: '2.2 i-DTEC 110kw 150hp',
    products: ['FILTRON:OE683/1', 'MANN:CUK2358', 'MANN:FP2358', 'MANN:HU712/9x'],
  },
  {
    model: M13,
    engine: '1.4 VTEC 73kw 100hp',
    products: [
      'FILTRON:AP103/2',
      'FILTRON:K1175',
      'FILTRON:OP575',
      'MANN:CUK2358',
      'MANN:FP2358',
      'MANN:W610/6',
    ],
  },
  {
    model: M13,
    engine: '1.4i DSi 61kw 83hp',
    products: [
      'FILTRON:AP104/6',
      'FILTRON:K1175',
      'FILTRON:OP575',
      'MANN:C20003',
      'MANN:CUK2358',
      'MANN:FP2358',
      'MANN:W610/6',
    ],
  },
  {
    model: M13,
    engine: '1.8i VTEC 103kw 140hp',
    products: [
      'FILTRON:AP104/7',
      'FILTRON:K1175',
      'FILTRON:OP575',
      'MANN:C2240',
      'MANN:CUK2358',
      'MANN:FP2358',
      'MANN:W610/6',
    ],
  },
  {
    model: M13,
    engine: '2.0i VTEC Type R 148kw 201hp',
    products: [
      'FILTRON:AP104/9',
      'FILTRON:K1175',
      'FILTRON:OP575',
      'MANN:C28023',
      'MANN:CUK2358',
      'MANN:FP2358',
      'MANN:W610/6',
    ],
  },
  {
    model: M13,
    engine: '2.2i CDTi 103kw 140hp',
    products: [
      'FILTRON:AP104/8',
      'FILTRON:K1175',
      'FILTRON:OE683/1',
      'MANN:C31005',
      'MANN:CUK2358',
      'MANN:FP2358',
      'MANN:HU712/9x',
    ],
  },
  {
    model: M12,
    engine: '1.4i 55kw 75hp',
    products: ['FILTRON:K1198-2x', 'FILTRON:OP575', 'MANN:CU2327-2', 'MANN:W610/6'],
  },
  {
    model: M12,
    engine: '1.4i S 66kw 90hp',
    products: ['FILTRON:K1198-2x', 'FILTRON:OP575', 'MANN:CU2327-2', 'MANN:W610/6'],
  },
  {
    model: M12,
    engine: '1.6i 81kw 110hp',
    products: ['FILTRON:K1198-2x', 'FILTRON:OP575', 'MANN:CU2327-2', 'MANN:W610/6'],
  },
  {
    model: M12,
    engine: '1.7 CTDi 74kw 100hp',
    products: [
      'FILTRON:K1198-2x',
      'FILTRON:OE648/4',
      'MANN:CU2327-2',
      'MANN:HU820x',
      'MANN:WK853/16',
    ],
  },
  {
    model: M12,
    engine: '1.7i 85kw 116hp',
    products: ['FILTRON:K1198-2x', 'FILTRON:OP575', 'MANN:CU2327-2', 'MANN:W610/6'],
  },
  {
    model: M12,
    engine: '1.8 103kw 140hp',
    products: ['FILTRON:K1198-2x', 'FILTRON:OP575', 'MANN:CU2327-2', 'MANN:W610/6'],
  },
  {
    model: M12,
    engine: '2.0 Type-R 147kw 200hp',
    products: [
      'FILTRON:AR246/2',
      'FILTRON:K1198-2x',
      'FILTRON:OP575',
      'MANN:CU2327-2',
      'MANN:W610/6',
    ],
  },
  {
    model: M12,
    engine: '2.0i Sport 118kw 160hp',
    products: [
      'FILTRON:AR246/2',
      'FILTRON:K1198-2x',
      'FILTRON:OP575',
      'MANN:CU2327-2',
      'MANN:W610/6',
    ],
  },
  {
    model: M15,
    engine: '2.0 e:HEV 135kw 184hp',
    products: ['FILTRON:K1298', 'FILTRON:OP575', 'MANN:CU21003', 'MANN:FP21003', 'MANN:W610/6'],
  },
  {
    model: M15,
    engine: 'Type-R 243kw 330hp',
    products: ['FILTRON:K1298', 'FILTRON:OP575', 'MANN:CU21003', 'MANN:FP21003', 'MANN:W610/6'],
  },
  {
    model: M14,
    engine: '1.0 VTEC 95kw 129hp',
    products: ['FILTRON:K1298', 'FILTRON:OP575', 'MANN:CU21003', 'MANN:FP21003', 'MANN:W610/6'],
  },
  {
    model: M14,
    engine: '1.5 VTEC 134kw 182hp',
    products: ['FILTRON:K1298', 'FILTRON:OP575', 'MANN:CU21003', 'MANN:FP21003', 'MANN:W610/6'],
  },
  {
    model: M14,
    engine: '1.6 i-DTEC 88kw 120hp',
    products: ['FILTRON:K1298', 'MANN:CU21003', 'MANN:FP21003'],
  },
  {
    model: M16,
    engine: '1.7 92kw 125hp',
    products: [
      'FILTRON:AP104/2',
      'FILTRON:K1198-2x',
      'FILTRON:OP575',
      'MANN:CU2327-2',
      'MANN:W610/6',
    ],
  },
  {
    model: M16,
    engine: '1.8 16V 103kw 140hp',
    products: [
      'FILTRON:AP104/7',
      'FILTRON:K1198-2x',
      'FILTRON:OP575',
      'MANN:C2240',
      'MANN:CU2327-2',
      'MANN:W610/6',
    ],
  },
  {
    model: M16,
    engine: '2.0 110kw 150hp',
    products: [
      'FILTRON:AR246/2',
      'FILTRON:K1198-2x',
      'FILTRON:OP575',
      'MANN:CU2327-2',
      'MANN:W610/6',
    ],
  },
  {
    model: M16,
    engine: '2.2i-CDTi 103kw 140hp',
    products: ['FILTRON:K1198-2x', 'MANN:CU2327-2', 'MANN:HU718/6x'],
  },
  {
    model: M18,
    engine: '1.5 96kw 131hp',
    products: ['FILTRON:AP106/6', 'FILTRON:K1298', 'FILTRON:OP575', 'MANN:CU21003', 'MANN:W610/6'],
  },
  {
    model: M18,
    engine: '1.5 i-VTEC 134kw 182hp',
    products: ['FILTRON:K1298', 'FILTRON:K1298A', 'FILTRON:OP575', 'MANN:CU21003', 'MANN:W610/6'],
  },
  {
    model: M18,
    engine: '1.6 D 88kw 120hp',
    products: ['FILTRON:K1298', 'MANN:CU21003'],
  },
  {
    model: M18,
    engine: '1.8 104kw 141hp',
    products: ['FILTRON:K1298', 'FILTRON:OP575', 'MANN:CU21003', 'MANN:W610/6'],
  },
  {
    model: M17,
    engine: '1.6 16V 77kw 105hp',
    products: ['FILTRON:AP104/1', 'FILTRON:OP575', 'MANN:C2055', 'MANN:W610/6'],
  },
  {
    model: M17,
    engine: '1.6 S 16V 91kw 124hp',
    products: ['FILTRON:AP104/1', 'FILTRON:OP575', 'MANN:C2055', 'MANN:W610/6'],
  },
  {
    model: M20,
    engine: '1.2 66kw 90hp',
    products: [
      'FILTRON:AP106/4',
      'FILTRON:K1298',
      'FILTRON:OP575',
      'MANN:CU21003',
      'MANN:FP21003',
      'MANN:W610/6',
    ],
  },
  {
    model: M20,
    engine: '1.4 VTEC 73kw 100hp',
    products: [
      'FILTRON:AP106/4',
      'FILTRON:K1298',
      'FILTRON:OP575',
      'MANN:CU21003',
      'MANN:FP21003',
      'MANN:W610/6',
    ],
  },
  {
    model: M20,
    engine: '1.5 i 88kw 120hp',
    products: [
      'FILTRON:AP106/4',
      'FILTRON:K1298',
      'FILTRON:OP575',
      'MANN:C18004',
      'MANN:CU21003',
      'MANN:FP21003',
      'MANN:W610/6',
    ],
  },
  {
    model: M19,
    engine: '1.2 i-DSi 57kw 78hp',
    products: [
      'FILTRON:AP106/1',
      'FILTRON:AP106/3',
      'FILTRON:K1164',
      'FILTRON:OP575',
      'MANN:C1724',
      'MANN:C3324',
      'MANN:CU1835',
      'MANN:W610/6',
    ],
  },
  {
    model: M19,
    engine: '1.4 i-DSi 61kw 83hp',
    products: [
      'FILTRON:AP106/1',
      'FILTRON:AP106/3',
      'FILTRON:K1164',
      'FILTRON:OP575',
      'MANN:C1724',
      'MANN:C3324',
      'MANN:CU1835',
      'MANN:W610/6',
    ],
  },
  {
    model: M19,
    engine: '1.5 81kw 110hp',
    products: [
      'FILTRON:AP106/3',
      'FILTRON:K1164',
      'FILTRON:OP575',
      'MANN:C1724',
      'MANN:CU1835',
      'MANN:W610/6',
    ],
  },
  {
    model: M21,
    engine: '1.3 75kw 102hp',
    products: [
      'FILTRON:AP106/6',
      'FILTRON:K1298',
      'FILTRON:OP575',
      'MANN:CU21003',
      'MANN:FP21003',
      'MANN:W610/6',
    ],
  },
  {
    model: M21,
    engine: '1.5 i-VTEC 96kw 130hp',
    products: [
      'FILTRON:AP106/6',
      'FILTRON:K1298',
      'FILTRON:OP575',
      'MANN:CU21003',
      'MANN:FP21003',
      'MANN:W610/6',
    ],
  },
  {
    model: M22,
    engine: '1.5 eHEV 80kw 109hp',
    products: ['FILTRON:K1298', 'FILTRON:OP575', 'MANN:CU21003', 'MANN:FP21003', 'MANN:W610/6'],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const HONDA_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
