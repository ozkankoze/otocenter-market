/**
 * ════════════════════════════════════════════════════════════════════════════
 *  AUDI ÜRÜN VERİSİ — KAYNAK TRANSKRİPSİYONU
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Kurallar `urunler-alfa-romeo.ts` ile aynıdır:
 *  fiyatlar KDV DAHİL vitrin fiyatıdır, OEM ve teknik ölçü yoktur,
 *  parça kodu görünmeyen ürün İÇE AKTARILMAZ.
 *
 *  Kaynakta aynı ürün bir motor sayfasında iki kez listelenebiliyor
 *  (ör. CU2450 iki kart). Burada TEK kez yazılır; ürün-motor ilişkisi
 *  zaten tekildir.
 */
import type { SourceProduct } from './urunler-alfa-romeo'

export const AUDI_PRODUCTS: Record<string, SourceProduct> = {
  'MANN:HU7029z': {
    brand: 'MANN-FILTER',
    code: 'HU7029z',
    category: 'YAG_FILTRESI',
    priceGross: 635.67,
  },
  'MANN:HU7035y': {
    brand: 'MANN-FILTER',
    code: 'HU7035y',
    category: 'YAG_FILTRESI',
    priceGross: 902.17,
  },
  'MANN:HU8005z': {
    brand: 'MANN-FILTER',
    code: 'HU8005z',
    category: 'YAG_FILTRESI',
    priceGross: 482.41,
  },
  'MANN:W719/45': {
    brand: 'MANN-FILTER',
    code: 'W719/45',
    category: 'YAG_FILTRESI',
    priceGross: 659.7,
  },
  'MANN:C16114x': {
    brand: 'MANN-FILTER',
    code: 'C16114x',
    category: 'HAVA_FILTRESI',
    priceGross: 974.25,
  },
  'FILTRON:OE650/7': {
    brand: 'FILTRON',
    code: 'OE650/7',
    category: 'YAG_FILTRESI',
    priceGross: 464.26,
  },
  'FILTRON:OE671/4': {
    brand: 'FILTRON',
    code: 'OE671/4',
    category: 'YAG_FILTRESI',
    priceGross: 338.43,
  },
  'FILTRON:OP526/7': {
    brand: 'FILTRON',
    code: 'OP526/7',
    category: 'YAG_FILTRESI',
    priceGross: 568.39,
  },
  'FILTRON:AK371/4': {
    brand: 'FILTRON',
    code: 'AK371/4',
    category: 'HAVA_FILTRESI',
    priceGross: 837.4,
  },
  // ── MANN-FILTER · yağ ─────────────────────────────────────────────────────
  'MANN:HU719/7x': {
    brand: 'MANN-FILTER',
    code: 'HU719/7x',
    category: 'YAG_FILTRESI',
    priceGross: 236.66,
  },
  'MANN:HU7008z': {
    brand: 'MANN-FILTER',
    code: 'HU7008z',
    category: 'YAG_FILTRESI',
    priceGross: 263.96,
  },
  'MANN:HU7020z': {
    brand: 'MANN-FILTER',
    code: 'HU7020z',
    category: 'YAG_FILTRESI',
    priceGross: 367.8,
  },
  'MANN:HU8001x': {
    brand: 'MANN-FILTER',
    code: 'HU8001x',
    category: 'YAG_FILTRESI',
    priceGross: 504.25,
  },
  'MANN:HU831x': {
    brand: 'MANN-FILTER',
    code: 'HU831x',
    category: 'YAG_FILTRESI',
    priceGross: 527.91,
  },
  'MANN:HU6013z': {
    brand: 'MANN-FILTER',
    code: 'HU6013z',
    category: 'YAG_FILTRESI',
    priceGross: 388.98,
  },

  // ── MANN-FILTER · hava ────────────────────────────────────────────────────
  'MANN:C32130': {
    brand: 'MANN-FILTER',
    code: 'C32130',
    category: 'HAVA_FILTRESI',
    priceGross: 685.91,
  },
  'MANN:C17009': {
    brand: 'MANN-FILTER',
    code: 'C17009',
    category: 'HAVA_FILTRESI',
    priceGross: 847.56,
  },

  // ── MANN-FILTER · polen / kabin ───────────────────────────────────────────
  'MANN:CU2450': {
    brand: 'MANN-FILTER',
    code: 'CU2450',
    category: 'POLEN_FILTRESI',
    priceGross: 604.36,
  },
  'MANN:CUK2450': {
    brand: 'MANN-FILTER',
    code: 'CUK2450',
    category: 'POLEN_FILTRESI',
    priceGross: 1022.31,
  },
  'MANN:FP2450': {
    brand: 'MANN-FILTER',
    code: 'FP2450',
    category: 'POLEN_FILTRESI',
    priceGross: 1400.21,
  },

  // ── MANN-FILTER · yakıt ───────────────────────────────────────────────────
  'MANN:WK6003': {
    brand: 'MANN-FILTER',
    code: 'WK6003',
    category: 'YAKIT_FILTRESI',
    priceGross: 1100.47,
  },

  // ── FILTRON · yağ ─────────────────────────────────────────────────────────
  'FILTRON:OE650/1': {
    brand: 'FILTRON',
    code: 'OE650/1',
    category: 'YAG_FILTRESI',
    priceGross: 177.89,
  },
  'FILTRON:OE650/3': {
    brand: 'FILTRON',
    code: 'OE650/3',
    category: 'YAG_FILTRESI',
    priceGross: 446.9,
  },
  'FILTRON:OE650/6': {
    brand: 'FILTRON',
    code: 'OE650/6',
    category: 'YAG_FILTRESI',
    priceGross: 488.12,
  },
  'FILTRON:OE688': {
    brand: 'FILTRON',
    code: 'OE688',
    category: 'YAG_FILTRESI',
    priceGross: 195.25,
  },
  'FILTRON:OE688/3': {
    brand: 'FILTRON',
    code: 'OE688/3',
    category: 'YAG_FILTRESI',
    priceGross: 276.04,
  },

  // ── FILTRON · hava ────────────────────────────────────────────────────────
  'FILTRON:AP139/4': {
    brand: 'FILTRON',
    code: 'AP139/4',
    category: 'HAVA_FILTRESI',
    priceGross: 542.35,
  },
  'FILTRON:AK371/8': {
    brand: 'FILTRON',
    code: 'AK371/8',
    category: 'HAVA_FILTRESI',
    priceGross: 739.77,
  },

  // ── FILTRON · polen / kabin ───────────────────────────────────────────────
  'FILTRON:K1278': {
    brand: 'FILTRON',
    code: 'K1278',
    category: 'POLEN_FILTRESI',
    priceGross: 366.63,
  },
  'FILTRON:K1278A': {
    brand: 'FILTRON',
    code: 'K1278A',
    category: 'POLEN_FILTRESI',
    priceGross: 572.73,
  },

  // ── FILTRON · yakıt ───────────────────────────────────────────────────────
  'FILTRON:PP991': {
    brand: 'FILTRON',
    code: 'PP991',
    category: 'YAKIT_FILTRESI',
    priceGross: 882.26,
  },
  // ── A4 (8E/8H, B6+B7) ────────────────────────────────────────────────────
  'MANN:W940/66': {
    brand: 'MANN-FILTER',
    code: 'W940/66',
    category: 'YAG_FILTRESI',
    priceGross: 637.13,
  },
  'MANN:W719/30': {
    brand: 'MANN-FILTER',
    code: 'W719/30',
    category: 'YAG_FILTRESI',
    priceGross: 347.69,
  },
  'MANN:W930/21': {
    brand: 'MANN-FILTER',
    code: 'W930/21',
    category: 'YAG_FILTRESI',
    priceGross: 709.94,
  },
  'MANN:HU719/6x': {
    brand: 'MANN-FILTER',
    code: 'HU719/6x',
    category: 'YAG_FILTRESI',
    priceGross: 539.15,
  },
  'MANN:C27192/1': {
    brand: 'MANN-FILTER',
    code: 'C27192/1',
    category: 'HAVA_FILTRESI',
    priceGross: 742.7,
  },
  'MANN:CU3037': {
    brand: 'MANN-FILTER',
    code: 'CU3037',
    category: 'POLEN_FILTRESI',
    priceGross: 658.97,
  },
  'MANN:CUK3037': {
    brand: 'MANN-FILTER',
    code: 'CUK3037',
    category: 'POLEN_FILTRESI',
    priceGross: 1201.43,
  },
  'MANN:WK720/3': {
    brand: 'MANN-FILTER',
    code: 'WK720/3',
    category: 'YAKIT_FILTRESI',
    priceGross: 1203.62,
  },
  'MANN:WK720/4': {
    brand: 'MANN-FILTER',
    code: 'WK720/4',
    category: 'YAKIT_FILTRESI',
    priceGross: 1140.27,
  },
  'MANN:WK720/5': {
    brand: 'MANN-FILTER',
    code: 'WK720/5',
    category: 'YAKIT_FILTRESI',
    priceGross: 2070.83,
  },
  'MANN:WK720/6': {
    brand: 'MANN-FILTER',
    code: 'WK720/6',
    category: 'YAKIT_FILTRESI',
    priceGross: 2136.36,
  },
  'MANN:WK730/1': {
    brand: 'MANN-FILTER',
    code: 'WK730/1',
    category: 'YAKIT_FILTRESI',
    priceGross: 469.65,
  },
  'MANN:H2019KIT1': {
    brand: 'MANN-FILTER',
    code: 'H2019KIT1',
    category: 'SANZUMAN_FILTRESI',
    priceGross: 2245.58,
  },
  'FILTRON:OP526/1': {
    brand: 'FILTRON',
    code: 'OP526/1',
    category: 'YAG_FILTRESI',
    priceGross: 236.47,
  },
  'FILTRON:OP526/5': {
    brand: 'FILTRON',
    code: 'OP526/5',
    category: 'YAG_FILTRESI',
    priceGross: 557.54,
  },
  'FILTRON:OP526/6': {
    brand: 'FILTRON',
    code: 'OP526/6',
    category: 'YAG_FILTRESI',
    priceGross: 459.92,
  },
  'FILTRON:OE671/3': {
    brand: 'FILTRON',
    code: 'OE671/3',
    category: 'YAG_FILTRESI',
    priceGross: 323.35,
  },
  'FILTRON:AP179/2': {
    brand: 'FILTRON',
    code: 'AP179/2',
    category: 'HAVA_FILTRESI',
    priceGross: 514.15,
  },
  'FILTRON:K1078': {
    brand: 'FILTRON',
    code: 'K1078',
    category: 'POLEN_FILTRESI',
    priceGross: 357.95,
  },
  'FILTRON:K1078A': {
    brand: 'FILTRON',
    code: 'K1078A',
    category: 'POLEN_FILTRESI',
    priceGross: 570.56,
  },
  'FILTRON:PP836/1': {
    brand: 'FILTRON',
    code: 'PP836/1',
    category: 'YAKIT_FILTRESI',
    priceGross: 505.47,
  },
  'FILTRON:PP836/5': {
    brand: 'FILTRON',
    code: 'PP836/5',
    category: 'YAKIT_FILTRESI',
    priceGross: 1371.07,
  },
  'FILTRON:PP836/6': {
    brand: 'FILTRON',
    code: 'PP836/6',
    category: 'YAKIT_FILTRESI',
    priceGross: 1583.68,
  },
  'FILTRON:PP836/8': {
    brand: 'FILTRON',
    code: 'PP836/8',
    category: 'YAKIT_FILTRESI',
    priceGross: 2310.43,
  },
  // ── A4 (8E/8H, B6+B7) · dizel ────────────────────────────────────────────
  'MANN:HU726/2x': {
    brand: 'MANN-FILTER',
    code: 'HU726/2x',
    category: 'YAG_FILTRESI',
    priceGross: 316.74,
  },
  'MANN:WK853/3x': {
    brand: 'MANN-FILTER',
    code: 'WK853/3x',
    category: 'YAKIT_FILTRESI',
    priceGross: 819.16,
  },
  'FILTRON:OE640/1': {
    brand: 'FILTRON',
    code: 'OE640/1',
    category: 'YAG_FILTRESI',
    priceGross: 199.59,
  },
  'FILTRON:PP839/1': {
    brand: 'FILTRON',
    code: 'PP839/1',
    category: 'YAKIT_FILTRESI',
    priceGross: 763.64,
  },
  'FILTRON:PP839/10': {
    brand: 'FILTRON',
    code: 'PP839/10',
    category: 'YAKIT_FILTRESI',
    priceGross: 926.34,
  },

  // ── A6 (4F/C6) ───────────────────────────────────────────────────────────
  'MANN:CU3023-2': {
    brand: 'MANN-FILTER',
    code: 'CU3023-2',
    category: 'POLEN_FILTRESI',
    priceGross: 1007.02,
  },
  'MANN:CUK3023-2': {
    brand: 'MANN-FILTER',
    code: 'CUK3023-2',
    category: 'POLEN_FILTRESI',
    priceGross: 1465.75,
  },
  'MANN:FP3023-2': {
    brand: 'MANN-FILTER',
    code: 'FP3023-2',
    category: 'POLEN_FILTRESI',
    priceGross: 1765.01,
  },
  'MANN:C17137x': {
    brand: 'MANN-FILTER',
    code: 'C17137x',
    category: 'HAVA_FILTRESI',
    priceGross: 1129.34,
  },
  'MANN:C16118': {
    brand: 'MANN-FILTER',
    code: 'C16118',
    category: 'HAVA_FILTRESI',
    priceGross: 943.67,
  },
  'MANN:WK735/1': {
    brand: 'MANN-FILTER',
    code: 'WK735/1',
    category: 'YAKIT_FILTRESI',
    priceGross: 2212.82,
  },
  'MANN:WK7002': {
    brand: 'MANN-FILTER',
    code: 'WK7002',
    category: 'YAKIT_FILTRESI',
    priceGross: 2822.27,
  },
  'MANN:WK6001': {
    brand: 'MANN-FILTER',
    code: 'WK6001',
    category: 'YAKIT_FILTRESI',
    priceGross: 1708.22,
  },
  'FILTRON:K1162-2x': {
    brand: 'FILTRON',
    code: 'K1162-2x',
    category: 'POLEN_FILTRESI',
    priceGross: 383.99,
  },
  'FILTRON:K1162A-2x': {
    brand: 'FILTRON',
    code: 'K1162A-2x',
    category: 'POLEN_FILTRESI',
    priceGross: 724.59,
  },
  'FILTRON:AR371/3': {
    brand: 'FILTRON',
    code: 'AR371/3',
    category: 'HAVA_FILTRESI',
    priceGross: 1316.84,
  },
  'FILTRON:AR371/2': {
    brand: 'FILTRON',
    code: 'AR371/2',
    category: 'HAVA_FILTRESI',
    priceGross: 544.52,
  },
  'FILTRON:PP986/2': {
    brand: 'FILTRON',
    code: 'PP986/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 1796.28,
  },
  'FILTRON:PP993': {
    brand: 'FILTRON',
    code: 'PP993',
    category: 'YAKIT_FILTRESI',
    priceGross: 1180.17,
  },
  // ── A6 (4F/C6) · ek parçalar ─────────────────────────────────────────────
  'MANN:WK842/21x': {
    brand: 'MANN-FILTER',
    code: 'WK842/21x',
    category: 'YAKIT_FILTRESI',
    priceGross: 1039.78,
  },
  'MANN:C17137/1x': {
    brand: 'MANN-FILTER',
    code: 'C17137/1x',
    category: 'HAVA_FILTRESI',
    priceGross: 1074.73,
  },
  'FILTRON:PP991/2': {
    brand: 'FILTRON',
    code: 'PP991/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 2243.18,
  },
  // ── Q5 (8R) ──────────────────────────────────────────────────────────────
  'MANN:WK6021': {
    brand: 'MANN-FILTER',
    code: 'WK6021',
    category: 'YAKIT_FILTRESI',
    priceGross: 1131.53,
  },
  'MANN:WK6011': {
    brand: 'MANN-FILTER',
    code: 'WK6011',
    category: 'YAKIT_FILTRESI',
    priceGross: 1616.47,
  },
  'FILTRON:PP991/1': {
    brand: 'FILTRON',
    code: 'PP991/1',
    category: 'YAKIT_FILTRESI',
    priceGross: 1089.05,
  },
  'FILTRON:PP991/4': {
    brand: 'FILTRON',
    code: 'PP991/4',
    category: 'YAKIT_FILTRESI',
    priceGross: 1023.97,
  },
  // ── A3 (8P) ──────────────────────────────────────────────────────────────
  'MANN:CU2939': {
    brand: 'MANN-FILTER',
    code: 'CU2939',
    category: 'POLEN_FILTRESI',
    priceGross: 395.03,
  },
  'MANN:CUK2939': {
    brand: 'MANN-FILTER',
    code: 'CUK2939',
    category: 'POLEN_FILTRESI',
    priceGross: 526.09,
  },
  'MANN:FP2939': {
    brand: 'MANN-FILTER',
    code: 'FP2939',
    category: 'POLEN_FILTRESI',
    priceGross: 747.07,
  },
  'MANN:C35154': {
    brand: 'MANN-FILTER',
    code: 'C35154',
    category: 'HAVA_FILTRESI',
    priceGross: 456.91,
  },
  'MANN:PU825x': {
    brand: 'MANN-FILTER',
    code: 'PU825x',
    category: 'YAKIT_FILTRESI',
    priceGross: 939.3,
  },
  'MANN:PU936/1x': {
    brand: 'MANN-FILTER',
    code: 'PU936/1x',
    category: 'YAKIT_FILTRESI',
    priceGross: 878.14,
  },
  'MANN:PU936/2x': {
    brand: 'MANN-FILTER',
    code: 'PU936/2x',
    category: 'YAKIT_FILTRESI',
    priceGross: 1083.47,
  },
  'FILTRON:K1111': {
    brand: 'FILTRON',
    code: 'K1111',
    category: 'POLEN_FILTRESI',
    priceGross: 288.53,
  },
  'FILTRON:K1111A': {
    brand: 'FILTRON',
    code: 'K1111A',
    category: 'POLEN_FILTRESI',
    priceGross: 442.56,
  },
  'FILTRON:AP139/2': {
    brand: 'FILTRON',
    code: 'AP139/2',
    category: 'HAVA_FILTRESI',
    priceGross: 355.79,
  },
  'FILTRON:PE973/2': {
    brand: 'FILTRON',
    code: 'PE973/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 639.98,
  },
  'FILTRON:PE973/3': {
    brand: 'FILTRON',
    code: 'PE973/3',
    category: 'YAKIT_FILTRESI',
    priceGross: 538.02,
  },
  // ── A3 (8P) · ek parçalar ────────────────────────────────────────────────
  'MANN:HU712/6x': {
    brand: 'MANN-FILTER',
    code: 'HU712/6x',
    category: 'YAG_FILTRESI',
    priceGross: 480.57,
  },
  'MANN:W712/93': {
    brand: 'MANN-FILTER',
    code: 'W712/93',
    category: 'YAG_FILTRESI',
    priceGross: 518.8,
  },
  'MANN:W712/94': {
    brand: 'MANN-FILTER',
    code: 'W712/94',
    category: 'YAG_FILTRESI',
    priceGross: 469.65,
  },
  'MANN:C14130': {
    brand: 'MANN-FILTER',
    code: 'C14130',
    category: 'HAVA_FILTRESI',
    priceGross: 605.52,
  },
  'MANN:C41110': {
    brand: 'MANN-FILTER',
    code: 'C41110',
    category: 'HAVA_FILTRESI',
    priceGross: 747.07,
  },
  'MANN:C3083/1': {
    brand: 'MANN-FILTER',
    code: 'C3083/1',
    category: 'HAVA_FILTRESI',
    priceGross: 598.53,
  },
  'MANN:WK69': {
    brand: 'MANN-FILTER',
    code: 'WK69',
    category: 'YAKIT_FILTRESI',
    priceGross: 880.32,
  },
  'MANN:WK69/2': {
    brand: 'MANN-FILTER',
    code: 'WK69/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 880.32,
  },
  'MANN:WK59x': {
    brand: 'MANN-FILTER',
    code: 'WK59x',
    category: 'YAKIT_FILTRESI',
    priceGross: 718.67,
  },
  'MANN:WK512': {
    brand: 'MANN-FILTER',
    code: 'WK512',
    category: 'YAKIT_FILTRESI',
    priceGross: 324.04,
  },
  'FILTRON:OE650/2': {
    brand: 'FILTRON',
    code: 'OE650/2',
    category: 'YAG_FILTRESI',
    priceGross: 321.07,
  },
  'FILTRON:OP641/1': {
    brand: 'FILTRON',
    code: 'OP641/1',
    category: 'YAG_FILTRESI',
    priceGross: 444.73,
  },
  'FILTRON:OP641/2': {
    brand: 'FILTRON',
    code: 'OP641/2',
    category: 'YAG_FILTRESI',
    priceGross: 470.76,
  },
  'FILTRON:AK370/4': {
    brand: 'FILTRON',
    code: 'AK370/4',
    category: 'HAVA_FILTRESI',
    priceGross: 455.58,
  },
  'FILTRON:AP149/7': {
    brand: 'FILTRON',
    code: 'AP149/7',
    category: 'HAVA_FILTRESI',
    priceGross: 535.85,
  },
  'FILTRON:AP149/8': {
    brand: 'FILTRON',
    code: 'AP149/8',
    category: 'HAVA_FILTRESI',
    priceGross: 466.42,
  },
  'FILTRON:PP836/2': {
    brand: 'FILTRON',
    code: 'PP836/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 995.76,
  },
  'FILTRON:PP836/4': {
    brand: 'FILTRON',
    code: 'PP836/4',
    category: 'YAKIT_FILTRESI',
    priceGross: 1045.66,
  },
  'FILTRON:PP905': {
    brand: 'FILTRON',
    code: 'PP905',
    category: 'YAKIT_FILTRESI',
    priceGross: 255.99,
  },
  // ── A3 (8P) · son motorlar ───────────────────────────────────────────────
  'MANN:W712/95': {
    brand: 'MANN-FILTER',
    code: 'W712/95',
    category: 'YAG_FILTRESI',
    priceGross: 376.42,
  },
  'MANN:C41002': {
    brand: 'MANN-FILTER',
    code: 'C41002',
    category: 'HAVA_FILTRESI',
    priceGross: 869.4,
  },
  'MANN:C27009': {
    brand: 'MANN-FILTER',
    code: 'C27009',
    category: 'HAVA_FILTRESI',
    priceGross: 752.43,
  },
  'FILTRON:OP616/3': {
    brand: 'FILTRON',
    code: 'OP616/3',
    category: 'YAG_FILTRESI',
    priceGross: 282.83,
  },
  'FILTRON:AP062/1': {
    brand: 'FILTRON',
    code: 'AP062/1',
    category: 'HAVA_FILTRESI',
    priceGross: 484.24,
  },

  // ── A6 (4G2/4G5/4GC/4GD) ─────────────────────────────────────────────────
  'FILTRON:AR371/6': {
    brand: 'FILTRON',
    code: 'AR371/6',
    category: 'HAVA_FILTRESI',
    priceGross: 566.22,
  },
  'FILTRON:PP991/3': {
    brand: 'FILTRON',
    code: 'PP991/3',
    category: 'YAKIT_FILTRESI',
    priceGross: 1122.91,
  },
  'FILTRON:K1318A': {
    brand: 'FILTRON',
    code: 'K1318A',
    category: 'POLEN_FILTRESI',
    priceGross: 882.95,
  },
  'FILTRON:AR371/7': {
    brand: 'FILTRON',
    code: 'AR371/7',
    category: 'HAVA_FILTRESI',
    priceGross: 930.68,
  },
  // ── A4 (8W) ──────────────────────────────────────────────────────────────
  // Fiyat çakışması: aynı kod Mild Hybrid ve düz 2.0 TDI sayfalarında farklı
  // fiyatta listeleniyor. Kullanıcı kararı: EN YÜKSEK fiyat esas alınır.
  'MANN:HU7046z': {
    brand: 'MANN-FILTER',
    code: 'HU7046z',
    category: 'YAG_FILTRESI',
    priceGross: 714.4,
  },
  'MANN:HU7034z': {
    brand: 'MANN-FILTER',
    code: 'HU7034z',
    category: 'YAG_FILTRESI',
    priceGross: 569.01,
  },
  'MANN:HU7012z': {
    brand: 'MANN-FILTER',
    code: 'HU7012z',
    category: 'YAG_FILTRESI',
    priceGross: 658.07,
  },
  'MANN:CU31003': {
    brand: 'MANN-FILTER',
    code: 'CU31003',
    category: 'POLEN_FILTRESI',
    priceGross: 878.14,
  },
  'MANN:CUK31003': {
    brand: 'MANN-FILTER',
    code: 'CUK31003',
    category: 'POLEN_FILTRESI',
    priceGross: 1315.64,
  },
  'MANN:FP31003': {
    brand: 'MANN-FILTER',
    code: 'FP31003',
    category: 'POLEN_FILTRESI',
    priceGross: 1736.61,
  },
  'MANN:C17011': {
    brand: 'MANN-FILTER',
    code: 'C17011',
    category: 'HAVA_FILTRESI',
    priceGross: 1170.74,
  },
  'MANN:C17010': {
    brand: 'MANN-FILTER',
    code: 'C17010',
    category: 'HAVA_FILTRESI',
    priceGross: 1168.67,
  },
  'MANN:WK6008': {
    brand: 'MANN-FILTER',
    code: 'WK6008',
    category: 'YAKIT_FILTRESI',
    priceGross: 1364.74,
  },
  'MANN:PU7008zKIT': {
    brand: 'MANN-FILTER',
    code: 'PU7008zKIT',
    category: 'YAKIT_FILTRESI',
    priceGross: 3045.75,
  },
  'FILTRON:K1378': {
    brand: 'FILTRON',
    code: 'K1378',
    category: 'POLEN_FILTRESI',
    priceGross: 517.86,
  },
  'FILTRON:K1378A': {
    brand: 'FILTRON',
    code: 'K1378A',
    category: 'POLEN_FILTRESI',
    priceGross: 620.97,
  },
  'FILTRON:OE688/8': {
    brand: 'FILTRON',
    code: 'OE688/8',
    category: 'YAG_FILTRESI',
    priceGross: 536.67,
  },
  'FILTRON:OE650/8': {
    brand: 'FILTRON',
    code: 'OE650/8',
    category: 'YAG_FILTRESI',
    priceGross: 472.46,
  },
  'FILTRON:AK376': {
    brand: 'FILTRON',
    code: 'AK376',
    category: 'HAVA_FILTRESI',
    priceGross: 1172.7,
  },
  'FILTRON:PE993/5': {
    brand: 'FILTRON',
    code: 'PE993/5',
    category: 'YAKIT_FILTRESI',
    priceGross: 1881.37,
  },
  'MANN:C17013': {
    brand: 'MANN-FILTER',
    code: 'C17013',
    category: 'HAVA_FILTRESI',
    priceGross: 1371.01,
  },
  'MANN:C17012/1': {
    brand: 'MANN-FILTER',
    code: 'C17012/1',
    category: 'HAVA_FILTRESI',
    priceGross: 1481.04,
  },
  'FILTRON:OE688/5': {
    brand: 'FILTRON',
    code: 'OE688/5',
    category: 'YAG_FILTRESI',
    priceGross: 250.16,
  },
  'FILTRON:AK376/1': {
    brand: 'FILTRON',
    code: 'AK376/1',
    category: 'HAVA_FILTRESI',
    priceGross: 1235.83,
  },
  // ── A3 (8YA, 8YS) ────────────────────────────────────────────────────────
  'MANN:HU5003z': {
    brand: 'MANN-FILTER',
    code: 'HU5003z',
    category: 'YAG_FILTRESI',
    priceGross: 432.78,
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
  'MANN:C30005': {
    brand: 'MANN-FILTER',
    code: 'C30005',
    category: 'HAVA_FILTRESI',
    priceGross: 707.85,
  },
  'MANN:C30004': {
    brand: 'MANN-FILTER',
    code: 'C30004',
    category: 'HAVA_FILTRESI',
    priceGross: 898.76,
  },
  'MANN:C38002': {
    brand: 'MANN-FILTER',
    code: 'C38002',
    category: 'HAVA_FILTRESI',
    priceGross: 822.7,
  },
  'MANN:C38003': {
    brand: 'MANN-FILTER',
    code: 'C38003',
    category: 'HAVA_FILTRESI',
    priceGross: 809.71,
  },
  'MANN:C28043': {
    brand: 'MANN-FILTER',
    code: 'C28043',
    category: 'HAVA_FILTRESI',
    priceGross: 877.36,
  },
  'MANN:PU8028': {
    brand: 'MANN-FILTER',
    code: 'PU8028',
    category: 'YAKIT_FILTRESI',
    priceGross: 1156.79,
  },
  'MANN:H6031z': {
    brand: 'MANN-FILTER',
    code: 'H6031z',
    category: 'SANZUMAN_FILTRESI',
    priceGross: 963.27,
  },
  'FILTRON:OE688/6': {
    brand: 'FILTRON',
    code: 'OE688/6',
    category: 'YAG_FILTRESI',
    priceGross: 319.49,
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
  'FILTRON:AP139/8': {
    brand: 'FILTRON',
    code: 'AP139/8',
    category: 'HAVA_FILTRESI',
    priceGross: 602.95,
  },
  'FILTRON:AP139/9': {
    brand: 'FILTRON',
    code: 'AP139/9',
    category: 'HAVA_FILTRESI',
    priceGross: 674.36,
  },
  'FILTRON:AP183/6': {
    brand: 'FILTRON',
    code: 'AP183/6',
    category: 'HAVA_FILTRESI',
    priceGross: 432.0,
  },
  'FILTRON:PE993/2': {
    brand: 'FILTRON',
    code: 'PE993/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 1010.73,
  },
  'FILTRON:PE973/9': {
    brand: 'FILTRON',
    code: 'PE973/9',
    category: 'YAKIT_FILTRESI',
    priceGross: 1043.64,
  },
  'MANN:PU8008/1': {
    brand: 'MANN-FILTER',
    code: 'PU8008/1',
    category: 'YAKIT_FILTRESI',
    priceGross: 1166.48,
  },
  'MANN:PU8015': {
    brand: 'MANN-FILTER',
    code: 'PU8015',
    category: 'YAKIT_FILTRESI',
    priceGross: 1559.68,
  },
  'FILTRON:PE973/7': {
    brand: 'FILTRON',
    code: 'PE973/7',
    category: 'YAKIT_FILTRESI',
    priceGross: 837.4,
  },
  'FILTRON:PE973/10': {
    brand: 'FILTRON',
    code: 'PE973/10',
    category: 'YAKIT_FILTRESI',
    priceGross: 1234.4,
  },
  'MANN:WK7012': {
    brand: 'MANN-FILTER',
    code: 'WK7012',
    category: 'YAKIT_FILTRESI',
    priceGross: 1354.16,
  },
  'FILTRON:PP991/6': {
    brand: 'FILTRON',
    code: 'PP991/6',
    category: 'YAKIT_FILTRESI',
    priceGross: 1242.93,
  },
  // ── A1 (8X) ──────────────────────────────────────────────────────────────
  'MANN:CU26010': {
    brand: 'MANN-FILTER',
    code: 'CU26010',
    category: 'POLEN_FILTRESI',
    priceGross: 578.87,
  },
  'MANN:CUK26010': {
    brand: 'MANN-FILTER',
    code: 'CUK26010',
    category: 'POLEN_FILTRESI',
    priceGross: 819.16,
  },
  'MANN:FP26010': {
    brand: 'MANN-FILTER',
    code: 'FP26010',
    category: 'POLEN_FILTRESI',
    priceGross: 1044.15,
  },
  'MANN:C15008': {
    brand: 'MANN-FILTER',
    code: 'C15008',
    category: 'HAVA_FILTRESI',
    priceGross: 688.09,
  },
  'MANN:C29029': {
    brand: 'MANN-FILTER',
    code: 'C29029',
    category: 'HAVA_FILTRESI',
    priceGross: 720.86,
  },
  'MANN:C29034': {
    brand: 'MANN-FILTER',
    code: 'C29034',
    category: 'HAVA_FILTRESI',
    priceGross: 655.33,
  },
  'MANN:C35011': {
    brand: 'MANN-FILTER',
    code: 'C35011',
    category: 'HAVA_FILTRESI',
    priceGross: 598.53,
  },
  'MANN:W7062': {
    brand: 'MANN-FILTER',
    code: 'W7062',
    category: 'YAG_FILTRESI',
    priceGross: 336.75,
  },
  'MANN:WK8032': {
    brand: 'MANN-FILTER',
    code: 'WK8032',
    category: 'YAKIT_FILTRESI',
    priceGross: 1050.71,
  },
  'MANN:WK823/2': {
    brand: 'MANN-FILTER',
    code: 'WK823/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 1055.07,
  },
  'MANN:WK8029/1': {
    brand: 'MANN-FILTER',
    code: 'WK8029/1',
    category: 'YAKIT_FILTRESI',
    priceGross: 1227.64,
  },
  'FILTRON:K1313': {
    brand: 'FILTRON',
    code: 'K1313',
    category: 'POLEN_FILTRESI',
    priceGross: 301.55,
  },
  'FILTRON:K1313A': {
    brand: 'FILTRON',
    code: 'K1313A',
    category: 'POLEN_FILTRESI',
    priceGross: 485.95,
  },
  'FILTRON:AK370/2': {
    brand: 'FILTRON',
    code: 'AK370/2',
    category: 'HAVA_FILTRESI',
    priceGross: 462.09,
  },
  'FILTRON:AP183/5': {
    brand: 'FILTRON',
    code: 'AP183/5',
    category: 'HAVA_FILTRESI',
    priceGross: 596.59,
  },
  'FILTRON:AP183/9': {
    brand: 'FILTRON',
    code: 'AP183/9',
    category: 'HAVA_FILTRESI',
    priceGross: 531.51,
  },
  'FILTRON:AP062/2': {
    brand: 'FILTRON',
    code: 'AP062/2',
    category: 'HAVA_FILTRESI',
    priceGross: 616.11,
  },
  'FILTRON:PP986': {
    brand: 'FILTRON',
    code: 'PP986',
    category: 'YAKIT_FILTRESI',
    priceGross: 822.21,
  },
  'FILTRON:PP986/4': {
    brand: 'FILTRON',
    code: 'PP986/4',
    category: 'YAKIT_FILTRESI',
    priceGross: 906.82,
  },
  // ── Q7 (4L) ──────────────────────────────────────────────────────────────
  'MANN:CU2842': {
    brand: 'MANN-FILTER',
    code: 'CU2842',
    category: 'POLEN_FILTRESI',
    priceGross: 402.3,
  },
  'MANN:CUK2842': {
    brand: 'MANN-FILTER',
    code: 'CUK2842',
    category: 'POLEN_FILTRESI',
    priceGross: 753.62,
  },
  'MANN:FP2842': {
    brand: 'MANN-FILTER',
    code: 'FP2842',
    category: 'POLEN_FILTRESI',
    priceGross: 1183.96,
  },
  'MANN:C39219': {
    brand: 'MANN-FILTER',
    code: 'C39219',
    category: 'HAVA_FILTRESI',
    priceGross: 716.49,
  },
  'MANN:C39002': {
    brand: 'MANN-FILTER',
    code: 'C39002',
    category: 'HAVA_FILTRESI',
    priceGross: 782.02,
  },
  'MANN:PU1033x': {
    brand: 'MANN-FILTER',
    code: 'PU1033x',
    category: 'YAKIT_FILTRESI',
    priceGross: 2400.68,
  },
  'FILTRON:K1155': {
    brand: 'FILTRON',
    code: 'K1155',
    category: 'POLEN_FILTRESI',
    priceGross: 321.07,
  },
  'FILTRON:K1155A': {
    brand: 'FILTRON',
    code: 'K1155A',
    category: 'POLEN_FILTRESI',
    priceGross: 570.56,
  },
  'FILTRON:AP004/3': {
    brand: 'FILTRON',
    code: 'AP004/3',
    category: 'HAVA_FILTRESI',
    priceGross: 423.04,
  },
  'FILTRON:PE973/6': {
    brand: 'FILTRON',
    code: 'PE973/6',
    category: 'YAKIT_FILTRESI',
    priceGross: 1972.0,
  },
  'MANN:HU932/6n': {
    brand: 'MANN-FILTER',
    code: 'HU932/6n',
    category: 'YAG_FILTRESI',
    priceGross: 650.96,
  },
  'FILTRON:OE640': {
    brand: 'FILTRON',
    code: 'OE640',
    category: 'YAG_FILTRESI',
    priceGross: 383.99,
  },
  // ── A7 (4GA/GF) ──────────────────────────────────────────────────────────
  'MANN:C16005': {
    brand: 'MANN-FILTER',
    code: 'C16005',
    category: 'HAVA_FILTRESI',
    priceGross: 1092.21,
  },
  'MANN:C15010': {
    brand: 'MANN-FILTER',
    code: 'C15010',
    category: 'HAVA_FILTRESI',
    priceGross: 969.88,
  },
  'MANN:WK6037': {
    brand: 'MANN-FILTER',
    code: 'WK6037',
    category: 'YAKIT_FILTRESI',
    priceGross: 1162.11,
  },
  'MANN:CUK2641': {
    brand: 'MANN-FILTER',
    code: 'CUK2641',
    category: 'POLEN_FILTRESI',
    priceGross: 1515.99,
  },
  'MANN:FP2641': {
    brand: 'MANN-FILTER',
    code: 'FP2641',
    category: 'POLEN_FILTRESI',
    priceGross: 1931.03,
  },
  'MANN:C36188': {
    brand: 'MANN-FILTER',
    code: 'C36188',
    category: 'HAVA_FILTRESI',
    priceGross: 884.69,
  },
  'FILTRON:AP004/4': {
    brand: 'FILTRON',
    code: 'AP004/4',
    category: 'HAVA_FILTRESI',
    priceGross: 566.22,
  },
  // ── A8 (4H) ──────────────────────────────────────────────────────────────
  'MANN:C17023': {
    brand: 'MANN-FILTER',
    code: 'C17023',
    category: 'HAVA_FILTRESI',
    priceGross: 1542.2,
  },
  // ── Q2 (GA) ──────────────────────────────────────────────────────────────
  'MANN:H6003z': {
    brand: 'MANN-FILTER',
    code: 'H6003z',
    category: 'SANZUMAN_FILTRESI',
    priceGross: 604.15,
  },
  // ── A6 (4B/C5) ───────────────────────────────────────────────────────────
  'MANN:CU3192': {
    brand: 'MANN-FILTER',
    code: 'CU3192',
    category: 'POLEN_FILTRESI',
    priceGross: 585.42,
  },
  'MANN:CUK3192': {
    brand: 'MANN-FILTER',
    code: 'CUK3192',
    category: 'POLEN_FILTRESI',
    priceGross: 1020.12,
  },
  'MANN:HU842x': {
    brand: 'MANN-FILTER',
    code: 'HU842x',
    category: 'YAG_FILTRESI',
    priceGross: 659.7,
  },
  'MANN:C26206/1': {
    brand: 'MANN-FILTER',
    code: 'C26206/1',
    category: 'HAVA_FILTRESI',
    priceGross: 777.65,
  },
  'MANN:WK823/1': {
    brand: 'MANN-FILTER',
    code: 'WK823/1',
    category: 'YAKIT_FILTRESI',
    priceGross: 1786.86,
  },
  'FILTRON:K1032': {
    brand: 'FILTRON',
    code: 'K1032',
    category: 'POLEN_FILTRESI',
    priceGross: 299.38,
  },
  'FILTRON:K1032A': {
    brand: 'FILTRON',
    code: 'K1032A',
    category: 'POLEN_FILTRESI',
    priceGross: 633.47,
  },
  'FILTRON:AP179/1': {
    brand: 'FILTRON',
    code: 'AP179/1',
    category: 'HAVA_FILTRESI',
    priceGross: 475.1,
  },
  'FILTRON:OE650': {
    brand: 'FILTRON',
    code: 'OE650',
    category: 'YAG_FILTRESI',
    priceGross: 375.31,
  },
  // ── Q7 (4M) · Q8 (4M) ────────────────────────────────────────────────────
  'MANN:C38011': {
    brand: 'MANN-FILTER',
    code: 'C38011',
    category: 'HAVA_FILTRESI',
    priceGross: 2651.89,
  },
  'MANN:PU10010z': {
    brand: 'MANN-FILTER',
    code: 'PU10010z',
    category: 'YAKIT_FILTRESI',
    priceGross: 2848.48,
  },
  'MANN:PU10011z': {
    brand: 'MANN-FILTER',
    code: 'PU10011z',
    category: 'YAKIT_FILTRESI',
    priceGross: 2846.3,
  },
  'MANN:HU7049z': {
    brand: 'MANN-FILTER',
    code: 'HU7049z',
    category: 'YAG_FILTRESI',
    priceGross: 695.14,
  },
  'FILTRON:OE688/4': {
    brand: 'FILTRON',
    code: 'OE688/4',
    category: 'YAG_FILTRESI',
    priceGross: 848.78,
  },
  // ── TT I (8N) · A3 (8L) ──────────────────────────────────────────────────
  'MANN:C37153': {
    brand: 'MANN-FILTER',
    code: 'C37153',
    category: 'HAVA_FILTRESI',
    priceGross: 415.04,
  },
  'MANN:CUK2862': {
    brand: 'MANN-FILTER',
    code: 'CUK2862',
    category: 'POLEN_FILTRESI',
    priceGross: 604.36,
  },
  'MANN:FP2862': {
    brand: 'MANN-FILTER',
    code: 'FP2862',
    category: 'POLEN_FILTRESI',
    priceGross: 827.89,
  },
  // H2019KIT ile H2019KIT1 AYRI ürünlerdir: kaynakta A3 (8L) sayfasında
  // "H2019KIT" 1.310,65, A6 (4B/C5) sayfasında "H2019KIT1" 2.245,58 yazıyor.
  'MANN:H2019KIT': {
    brand: 'MANN-FILTER',
    code: 'H2019KIT',
    category: 'SANZUMAN_FILTRESI',
    priceGross: 1310.65,
  },
  'FILTRON:AP149/1': {
    brand: 'FILTRON',
    code: 'AP149/1',
    category: 'HAVA_FILTRESI',
    priceGross: 269.01,
  },
  'FILTRON:K1047A': {
    brand: 'FILTRON',
    code: 'K1047A',
    category: 'POLEN_FILTRESI',
    priceGross: 459.92,
  },
  // ── A8 (4N) ──────────────────────────────────────────────────────────────
  'MANN:HU9011z': {
    brand: 'MANN-FILTER',
    code: 'HU9011z',
    category: 'YAG_FILTRESI',
    priceGross: 755.31,
  },
  // ── A8 (4E) ──────────────────────────────────────────────────────────────
  'MANN:C1652': {
    brand: 'MANN-FILTER',
    code: 'C1652',
    category: 'HAVA_FILTRESI',
    priceGross: 1400.21,
  },
  'MANN:C1652/1': {
    brand: 'MANN-FILTER',
    code: 'C1652/1',
    category: 'HAVA_FILTRESI',
    priceGross: 1638.31,
  },
  'MANN:CUK4136': {
    brand: 'MANN-FILTER',
    code: 'CUK4136',
    category: 'POLEN_FILTRESI',
    priceGross: 1917.92,
  },
  'MANN:WK1136': {
    brand: 'MANN-FILTER',
    code: 'WK1136',
    category: 'YAKIT_FILTRESI',
    priceGross: 3759.39,
  },
  'FILTRON:AR371': {
    brand: 'FILTRON',
    code: 'AR371',
    category: 'HAVA_FILTRESI',
    priceGross: 1030.48,
  },
  'FILTRON:AR371/1': {
    brand: 'FILTRON',
    code: 'AR371/1',
    category: 'HAVA_FILTRESI',
    priceGross: 1427.48,
  },
  'FILTRON:K1118A': {
    brand: 'FILTRON',
    code: 'K1118A',
    category: 'POLEN_FILTRESI',
    priceGross: 1748.55,
  },
  'FILTRON:PP986/3': {
    brand: 'FILTRON',
    code: 'PP986/3',
    category: 'YAKIT_FILTRESI',
    priceGross: 3121.8,
  },
  // ── A4 (8D, B5) ──────────────────────────────────────────────────────────
  'MANN:C26168': {
    brand: 'MANN-FILTER',
    code: 'C26168',
    category: 'HAVA_FILTRESI',
    priceGross: 453.27,
  },
  'MANN:CU3955': {
    brand: 'MANN-FILTER',
    code: 'CU3955',
    category: 'POLEN_FILTRESI',
    priceGross: 424.15,
  },
  'MANN:CUK3955': {
    brand: 'MANN-FILTER',
    code: 'CUK3955',
    category: 'POLEN_FILTRESI',
    priceGross: 729.6,
  },
  'MANN:WK842/11': {
    brand: 'MANN-FILTER',
    code: 'WK842/11',
    category: 'YAKIT_FILTRESI',
    priceGross: 782.02,
  },
  'MANN:WK830/7': {
    brand: 'MANN-FILTER',
    code: 'WK830/7',
    category: 'YAKIT_FILTRESI',
    priceGross: 573.41,
  },
  'FILTRON:K1004': {
    brand: 'FILTRON',
    code: 'K1004',
    category: 'POLEN_FILTRESI',
    priceGross: 314.57,
  },
  'FILTRON:K1004A': {
    brand: 'FILTRON',
    code: 'K1004A',
    category: 'POLEN_FILTRESI',
    priceGross: 459.92,
  },
  'FILTRON:AP063/1': {
    brand: 'FILTRON',
    code: 'AP063/1',
    category: 'HAVA_FILTRESI',
    priceGross: 288.53,
  },
  'FILTRON:PP850/2': {
    brand: 'FILTRON',
    code: 'PP850/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 490.29,
  },
  // ── A1 (GB) ──────────────────────────────────────────────────────────────
  'MANN:CU26021': {
    brand: 'MANN-FILTER',
    code: 'CU26021',
    category: 'POLEN_FILTRESI',
    priceGross: 466.48,
  },
  'MANN:CUK26021': {
    brand: 'MANN-FILTER',
    code: 'CUK26021',
    category: 'POLEN_FILTRESI',
    priceGross: 951.95,
  },
  'FILTRON:K1388': {
    brand: 'FILTRON',
    code: 'K1388',
    category: 'POLEN_FILTRESI',
    priceGross: 362.38,
  },
  'FILTRON:K1388A': {
    brand: 'FILTRON',
    code: 'K1388A',
    category: 'POLEN_FILTRESI',
    priceGross: 573.23,
  },
  // ── A8 (4D) ──────────────────────────────────────────────────────────────
  'MANN:C28214/1': {
    brand: 'MANN-FILTER',
    code: 'C28214/1',
    category: 'HAVA_FILTRESI',
    priceGross: 998.28,
  },
  'MANN:CU2949-2': {
    brand: 'MANN-FILTER',
    code: 'CU2949-2',
    category: 'POLEN_FILTRESI',
    priceGross: 1682.0,
  },
  'MANN:CUK2949-2': {
    brand: 'MANN-FILTER',
    code: 'CUK2949-2',
    category: 'POLEN_FILTRESI',
    priceGross: 1935.4,
  },
  'MANN:H2120xKIT': {
    brand: 'MANN-FILTER',
    code: 'H2120xKIT',
    category: 'SANZUMAN_FILTRESI',
    priceGross: 1773.75,
  },
  'FILTRON:AP004/2': {
    brand: 'FILTRON',
    code: 'AP004/2',
    category: 'HAVA_FILTRESI',
    priceGross: 611.78,
  },
  'FILTRON:K1069-2x': {
    brand: 'FILTRON',
    code: 'K1069-2x',
    category: 'POLEN_FILTRESI',
    priceGross: 1512.09,
  },
  'FILTRON:K1069A-2x': {
    brand: 'FILTRON',
    code: 'K1069A-2x',
    category: 'POLEN_FILTRESI',
    priceGross: 1857.02,
  },
}

const A5 = 'A5 (8T, 8F)'
const A4 = 'A4 (8K, B8)'
const B7 = 'A4 (8E/8H, B6+B7)'
const A6 = 'A6 (4F/C6)'
const Q5 = 'Q5 (8R)'
const A3 = 'A3 (8P)'
const A6G = 'A6 (4G2/4G5/4GC/4GD)'
const A48W = 'A4 (8W)'
const Q5FY = 'Q5 II (FY)'
const A38Y = 'A3 (8YA, 8YS)'
const Q38U = 'Q3 (8U)'
const A6C8 = 'A6 (4A_/C8)'
const A18X = 'A1 (8X)'
const Q74L = 'Q7 (4L)'
const A38V = 'A3 (8VA/8VS/8V7)'
const A74G = 'A7 (4GA/GF)'
const Q3F3 = 'Q3 (F3)'
const A5F5 = 'A5 + A5 Cabriolet + Sportback (F5)'
const TT8J = 'TT/TTS/TTRS II (8J)'
const A5F5D = 'A5 (F5)'
const A84H = 'A8 (4H)'
const TTFV = 'TT/TTS/TTRS III (FV)'
const Q2GA = 'Q2 (GA)'
const A6C5 = 'A6 (4B/C5)'
const Q74M = 'Q7 (4M)'
const Q84M = 'Q8 (4M)'
const A84N = 'A8 (4N)'
const TT8N = 'TT I (8N)'
const A38L = 'A3 (8L)'
const A84E = 'A8 (4E)'
const A64A = 'A6 (4A)'
const A48D = 'A4 (8D, B5)'
const A1GB = 'A1 (GB)'
const Q8ET = 'Q8 E-Tron (GET, GEG)'
const A84D = 'A8 (4D)'
const ETGE = 'E-Tron (GE)'
const ETGT = 'E-Tron GT'

/** A5 (F5+) 50 TDI ve S5 TDI Mild Hybrid — iki motorda da aynı liste. */
const A5F5_50TDI = [
  'MANN:HU7034z',
  'MANN:CU31003',
  'MANN:C17010',
  'MANN:WK6003',
  'MANN:CUK31003',
  'MANN:FP31003',
  'FILTRON:K1378',
  'FILTRON:K1378A',
]

/** TT (8J) tüm motorlarında ortak polen üçlüsü. */
const TT8J_POLEN = ['MANN:CU2939', 'MANN:CUK2939', 'MANN:FP2939', 'FILTRON:K1111', 'FILTRON:K1111A']

/** TT (8J) 1.8 TFSI 118kw ve 2.0 TFSI 155kw — iki motorda da aynı liste. */
const TT8J_TFSI_W719 = [
  ...TT8J_POLEN,
  'MANN:C35154',
  'MANN:W719/45',
  'MANN:WK69',
  'FILTRON:AP139/2',
  'FILTRON:OP526/7',
  'FILTRON:PP836/2',
]

/** TT (8J) 2.0 TFSI 195/200 kw — iki motorda da aynı liste. */
const TT8J_TFSI_GUC = [
  ...TT8J_POLEN,
  'MANN:HU719/6x',
  'MANN:C36188',
  'MANN:WK69',
  'FILTRON:OE671/3',
  'FILTRON:AP004/4',
  'FILTRON:PP836/2',
]

/** A5 (F5) tüm motorlarında ortak polen dörtlüsü. */
const A5F5D_POLEN = [
  'MANN:CU31003',
  'MANN:CUK31003',
  'MANN:FP31003',
  'FILTRON:K1378',
  'FILTRON:K1378A',
]

/** A5 (F5) 3.0 TDI 160/210 kw — iki motorda da aynı liste. */
const A5F5D_30TDI = [
  'MANN:HU7012z',
  'MANN:CU31003',
  'MANN:WK6003',
  'MANN:C17010',
  'MANN:CUK31003',
  'MANN:FP31003',
  'FILTRON:PP991',
  'FILTRON:K1378',
]

/** A5 (F5) 2.0 TFSI 183/185 kw — iki motorda da aynı liste. */
const A5F5D_20TFSI = ['MANN:C17013', 'MANN:HU6013z', ...A5F5D_POLEN]

/** A3 (8YA) ve Q3 (F3)'ün ortak polen ailesi (şanzuman filtresi hariç). */
const A38Y_ORTAK_POLEN = [
  'MANN:CU26009',
  'MANN:CUK26009',
  'MANN:FP26009',
  'FILTRON:K1311',
  'FILTRON:K1311A',
]

/** Q3 (F3) 35/40 TDI — iki motorda da liste birebir aynı. */
const Q3F3_TDI = [
  'MANN:HU7020z',
  'MANN:C30005',
  'MANN:PU8028',
  ...A38Y_ORTAK_POLEN,
  'FILTRON:OE688/3',
  'FILTRON:AP139/5',
  'FILTRON:PE973/9',
  'FILTRON:PE993/2',
]

/** Q3 (F3) 40 TFSI 140kw ve 45 TFSI 169kw — iki motorda da aynı. */
const Q3F3_TFSI = ['MANN:C30005', 'MANN:HU6013z', ...A38Y_ORTAK_POLEN, 'FILTRON:AP139/5']

/** A7 (4GA/GF) tüm motorlarında ortak polen ikilisi. */
const A74G_POLEN = ['MANN:CUK2641', 'MANN:FP2641', 'FILTRON:K1318A']

/** A7 3.0 TDI 150/176/180 kw — üçünde de liste birebir aynı. */
const A74G_30TDI_TAM = [
  'MANN:HU8005z',
  'MANN:WK6003',
  'MANN:C16005',
  'MANN:WK6008',
  'MANN:WK6037',
  ...A74G_POLEN,
  'FILTRON:OE650/7',
  'FILTRON:PP991',
  'FILTRON:AR371/7',
  'FILTRON:PP991/3',
]

/** A7 3.0 TDI 140/200 kw — iki motorda da aynı. */
const A74G_30TDI_KISA = [
  'MANN:HU7012z',
  'MANN:C16005',
  'MANN:WK6037',
  ...A74G_POLEN,
  'FILTRON:AR371/7',
]

/** A7 2.8 FSI ×2 ve 3.0 TFSI — üçünde de aynı liste. */
const A74G_BENZIN_V6 = [
  'MANN:HU7029z',
  'MANN:C16005',
  ...A74G_POLEN,
  'FILTRON:OE671/4',
  'FILTRON:AR371/7',
]

/** A7 1.8 TFSI ve 2.0 TFSI ×2 — üçünde de aynı liste. */
const A74G_TFSI_4SIL = ['MANN:C15010', 'MANN:HU6013z', ...A74G_POLEN, 'FILTRON:AR371/6']

/** A3 (8VA) tüm motorlarında ortak polen dörtlüsü. */
const A38V_POLEN = [
  'MANN:CU26009',
  'MANN:CUK26009',
  'MANN:FP26009',
  'FILTRON:K1311',
  'FILTRON:K1311A',
]

/** A3 (8VA) 1.6 TDI'ları (77/81/85 kw) — üçünde de liste birebir aynı. */
const A38V_16TDI = [
  'MANN:HU7020z',
  'MANN:C30005',
  'MANN:PU8028',
  ...A38V_POLEN,
  'FILTRON:OE688/3',
  'FILTRON:AP139/5',
  'FILTRON:PE973/9',
  'FILTRON:PE993/2',
]

/** A3 (8VA) benzinlileri (1.2 TFSI ×2, 1.4 TFSI ×3) — beşinde de aynı. */
const A38V_TFSI = [
  'MANN:W712/95',
  'MANN:C27009',
  ...A38V_POLEN,
  'FILTRON:OP616/3',
  'FILTRON:AP062/1',
]

/**
 * Q7 (4L) tüm motorlarında ortak polen + hava ailesi.
 * 150/180 kw ve 3.0 TFSI sayfalarında CUK2842'nin kodu kart başlığına
 * sığmadığı için kırpık; fiyat (753,62) aynı modelin kodu açık yazan diğer
 * motor sayfalarıyla birebir tuttuğu için eşleştirildi.
 */
const Q74L_ORTAK = [
  'MANN:CU2842',
  'MANN:CUK2842',
  'MANN:FP2842',
  'MANN:C39219',
  'MANN:C39002',
  'FILTRON:K1155',
  'FILTRON:K1155A',
  'FILTRON:AP004/3',
]

/** Q7 (4L) 150 ve 180 kw — iki motorda da liste birebir aynı. */
const Q74L_TDI_WK = [
  ...Q74L_ORTAK,
  'MANN:HU8005z',
  'MANN:WK6003',
  'FILTRON:OE650/7',
  'FILTRON:PP991',
]

/** A1 (8X) tüm motorlarında ortak polen ailesi. */
const A18X_POLEN = ['MANN:CU26010', 'MANN:CUK26010', 'MANN:FP26010', 'FILTRON:K1313A']

/** A1 (8X) 1.2 TFSI 63kw ve 1.4 TFSI 90kw — iki motorda da aynı liste. */
const A18X_TFSI_KUCUK = [
  'MANN:W712/94',
  'MANN:C15008',
  'MANN:WK69',
  ...A18X_POLEN,
  'FILTRON:AK370/2',
  'FILTRON:OP641/2',
  'FILTRON:PP836/2',
]

/** A1 (8X) 1.4 TFSI 103/110 kw — iki motorda da aynı liste. */
const A18X_TFSI_BUYUK = [
  'MANN:W712/95',
  'MANN:C27009',
  'MANN:WK69',
  ...A18X_POLEN,
  'FILTRON:OP616/3',
  'FILTRON:AP062/1',
  'FILTRON:PP836/2',
]

/** A6 (4A_/C8) tüm motorlarında ortak polen dörtlüsü. */
const A6C8_POLEN = [
  'MANN:CU31003',
  'MANN:CUK31003',
  'MANN:FP31003',
  'FILTRON:K1378',
  'FILTRON:K1378A',
]

/**
 * A6 (4A_/C8) 3.0 quattro dizelleri (45/55 TDI MH ve S6 TDI MH).
 * Kart başlıklarında kod kırpık; kodlar aynı modelin S6 TDI 253kw sayfasından
 * okundu (orada WK7012, PP991/6, PU7008zKIT vb. açık yazıyor) ve fiyatlar
 * birebir tutuyor.
 */
const A6C8_30TDI = [
  ...A6C8_POLEN,
  'MANN:WK7012',
  'MANN:PU7008zKIT',
  'FILTRON:OE650/8',
  'FILTRON:PP991/6',
  'FILTRON:PE993/5',
]

/** A6 (4A_/C8) 30 ve 35 TDI Mild Hybrid — iki motorda da aynı liste. */
const A6C8_20TDI_MH = [
  'MANN:HU7046z',
  'MANN:WK6003',
  'MANN:PU7008zKIT',
  ...A6C8_POLEN,
  'FILTRON:OE688/8',
  'FILTRON:PP991',
  'FILTRON:PE993/5',
]

/** A6 (4A_/C8) benzinlileri (40/45 TFSI ve 50 TFSI e) — üçünde de aynı. */
const A6C8_TFSI = ['MANN:HU6013z', ...A6C8_POLEN, 'FILTRON:OE688/5']

/** Q3 (8U) 2.0 TDI'larının ortak çekirdeği. */
const Q38U_ORTAK = [
  'MANN:CU2939',
  'MANN:C35154',
  'MANN:CUK2939',
  'MANN:FP2939',
  'MANN:PU8008/1',
  'FILTRON:K1111',
  'FILTRON:AP139/2',
  'FILTRON:K1111A',
  'FILTRON:PE973/7',
]

/** Q3 (8U) 2.0 TDI 88/110 kw — HU7020z + OE688/3 ikilisi. */
const Q38U_TDI_A = [...Q38U_ORTAK, 'MANN:HU7020z', 'FILTRON:OE688/3']

/** Q3 (8U) 2.0 TDI 120/130 kw — HU7008z + OE688 ikilisi. */
const Q38U_TDI_B = [...Q38U_ORTAK, 'MANN:HU7008z', 'FILTRON:OE688']

/** Q3 (8U) 1.4 TFSI (92/110 kw) — iki motorda da aynı liste. */
const Q38U_14TFSI = [
  'MANN:CU2939',
  'MANN:W712/95',
  'MANN:CUK2939',
  'MANN:C27009',
  'MANN:FP2939',
  'FILTRON:K1111',
  'FILTRON:OP616/3',
  'FILTRON:K1111A',
  'FILTRON:AP062/1',
]

/** Q3 (8U) 2.0 TFSI 125/147/155 kw — W719/45 + OP526/7 ikilisi. */
const Q38U_20TFSI_A = [
  'MANN:CU2939',
  'MANN:C35154',
  'MANN:CUK2939',
  'MANN:W719/45',
  'MANN:FP2939',
  'FILTRON:K1111',
  'FILTRON:AP139/2',
  'FILTRON:K1111A',
  'FILTRON:OP526/7',
]

/** Q3 (8U) 2.0 TFSI 132/162 kw — yağ filtresi HU6013z, FILTRON muadili yok. */
const Q38U_20TFSI_B = [
  'MANN:CU2939',
  'MANN:C35154',
  'MANN:CUK2939',
  'MANN:FP2939',
  'MANN:HU6013z',
  'FILTRON:K1111',
  'FILTRON:AP139/2',
  'FILTRON:K1111A',
]

/** A3 (8YA, 8YS) tüm motorlarında ortak polen dörtlüsü + şanzuman filtresi. */
const A38Y_ORTAK = [
  'MANN:CU26009',
  'MANN:CUK26009',
  'MANN:FP26009',
  'MANN:H6031z',
  'FILTRON:K1311',
  'FILTRON:K1311A',
]

/** 30/35 TDI — iki motorda da liste birebir aynı. */
const A38Y_TDI = [
  'MANN:HU5003z',
  'MANN:C30005',
  'MANN:C30004',
  'MANN:PU8028',
  ...A38Y_ORTAK,
  'FILTRON:OE688/6',
  'FILTRON:AP139/5',
  'FILTRON:AP139/6',
  'FILTRON:PE993/2',
  'FILTRON:PE973/9',
]

/** RS3'ün iki güç seviyesinde de liste birebir aynı. */
const A38Y_RS3 = [
  'MANN:HU719/6x',
  'MANN:C38003',
  'MANN:C38002',
  ...A38Y_ORTAK,
  'FILTRON:OE671/3',
  'FILTRON:AP139/8',
  'FILTRON:AP139/9',
]

/** 30 g-tron ve 30 TFSI (Mild Hybrid dahil) — üçünde de aynı liste. */
const A38Y_30 = ['MANN:W712/95', 'MANN:C28043', ...A38Y_ORTAK, 'FILTRON:OP616/3', 'FILTRON:AP183/6']

/** A3 (8YA) 40/45 TFSIe — 30'lularla aynı, yalnız hava filtreleri farklı. */
const A38Y_TFSIE = [
  'MANN:W712/95',
  'MANN:C27009',
  ...A38Y_ORTAK,
  'FILTRON:OP616/3',
  'FILTRON:AP062/1',
]

/**
 * Q5 II (FY) TFSI Mild Hybrid ve TFSI e quattro motorları — beşinde de aynı.
 * 50/55 TFSI e sayfalarında üç polen kartının kodu kırpık; fiyatları
 * (877,10 · 1.315,64 · 1.710,37) aynı modelin kodu açık yazan başka motor
 * sayfalarıyla birebir tuttuğu için CU31003 / CUK31003 / FP31003 olarak alındı.
 */
const Q5FY_TFSI = [
  'MANN:HU6013z',
  'MANN:CU31003',
  'MANN:CUK31003',
  'MANN:C17013',
  'MANN:FP31003',
  'FILTRON:OE688/5',
  'FILTRON:K1378',
  'FILTRON:K1378A',
  'FILTRON:AK376/1',
]

/** A4 (8W) 40 ve 45 TFSI Mild Hybrid — iki motorda da aynı liste. */
const A48W_TFSI_MH = [
  'MANN:HU6013z',
  'MANN:CU31003',
  'MANN:CUK31003',
  'MANN:C17013',
  'MANN:FP31003',
  'FILTRON:OE688/5',
  'FILTRON:K1378',
  'FILTRON:K1378A',
]

/** A4 (8W) 3.0 TDI — 160 ve 200 kw sayfalarında aynı liste. */
const A48W_30TDI = [
  'MANN:HU7012z',
  'MANN:CU31003',
  'MANN:WK6003',
  'MANN:C17010',
  'MANN:CUK31003',
  'MANN:FP31003',
  'FILTRON:PP991',
  'FILTRON:K1378',
]

/** A4 (8W) 2.0 TFSI 183/185 kw — aynı liste (140 kw'da hava filtresi farklı). */
const A48W_20TFSI = [
  'MANN:CU31003',
  'MANN:C17013',
  'MANN:CUK31003',
  'MANN:FP31003',
  'MANN:HU6013z',
  'FILTRON:K1378',
  'FILTRON:K1378A',
]

/** A4 (8W) düz 2.0 TDI'ları (90/100/110/120/140 kw) — beşinde de aynı liste. */
const A48W_20TDI = [
  'MANN:HU7020z',
  'MANN:CU31003',
  'MANN:WK6003',
  'MANN:C17011',
  'MANN:CUK31003',
  'MANN:FP31003',
  'FILTRON:OE688/3',
  'FILTRON:PP991',
  'FILTRON:K1378',
  'FILTRON:K1378A',
]

const A48W_40TDI_MH = [
  'MANN:HU7046z',
  'MANN:CU31003',
  'MANN:C17011',
  'MANN:CUK31003',
  'MANN:WK6008',
  'MANN:FP31003',
  'MANN:PU7008zKIT',
  'FILTRON:K1378',
  'FILTRON:OE688/8',
  'FILTRON:K1378A',
  'FILTRON:PP991/3',
  'FILTRON:AK376',
  'FILTRON:PE993/5',
]

/** A4 (8W) 30 ve 35 TDI Mild Hybrid — iki motorda da aynı liste. */
const A48W_TDI_MH = [
  'MANN:HU7046z',
  'MANN:CU31003',
  'MANN:C17010',
  'MANN:WK6003',
  'MANN:CUK31003',
  'MANN:FP31003',
  'FILTRON:K1378',
  'FILTRON:OE688/8',
  'FILTRON:K1378A',
  'FILTRON:PP991',
]

/** A3'ün 1.6 TDI'ları (66/77 kw) — iki motorda da liste birebir aynı. */
const A3_16TDI = [
  'MANN:HU7008z',
  'MANN:C35154',
  'MANN:PU825x',
  'FILTRON:OE688',
  'FILTRON:AP139/2',
  'FILTRON:PE973/3',
]

/** A3'ün en güçlü 2.0 TFSI'ları (188/195 kw) — liste birebir aynı. */
const A3_20TFSI_GUC = [
  'MANN:HU719/6x',
  'MANN:C41002',
  'MANN:WK69',
  'FILTRON:OE671/3',
  'FILTRON:PP836/2',
]

/**
 * A6 (4G) — YALNIZCA PARÇA KODU OKUNABİLEN ÜRÜNLER.
 * Bu modelin adı üç satırı doldurduğu için kart metinlerinde kod görünmüyor;
 * aşağıdakiler ya kutu fotoğrafından (HU 7008 z, HU 7020 z) ya da ürün
 * görselinin başlığından (OE 688, AR 371/6, PP 991…) okunabiliyor.
 * Kodu okunamayan kartlar MISSING_CODE_ITEMS'a yazıldı, İÇE AKTARILMADI.
 */
const A6G_ORTAK = ['FILTRON:AR371/6', 'FILTRON:PP991', 'FILTRON:PP991/3', 'FILTRON:K1318A']

/** A6 (4G) 3.0 TDI — 150/176/180 kw sayfalarında okunabilen beş ürün. */
const A6G_TDI30_TAM = [
  'FILTRON:OE650/7',
  'FILTRON:PP991',
  'FILTRON:AR371/7',
  'FILTRON:PP991/3',
  'FILTRON:K1318A',
]

/** A6 (4G) 2.0 TFSI — 132/155/162 kw sayfalarında okunabilen dört ürün. */
const A6G_TFSI = ['MANN:W719/45', 'FILTRON:OP526/7', 'FILTRON:AR371/6', 'FILTRON:K1318A']

/** A3'ün bütün motorlarında ortak olan polen/kabin dörtlüsü. */
const A3_POLEN = ['MANN:CU2939', 'MANN:CUK2939', 'MANN:FP2939', 'FILTRON:K1111', 'FILTRON:K1111A']

/** Q5'in HU8005z'li 3.0 TDI'ları (176/180/184/190 kw) birebir aynı liste. */
const Q5_30TDI_A = [
  'MANN:HU8005z',
  'MANN:CU2450',
  'MANN:CUK2450',
  'MANN:WK6021',
  'MANN:FP2450',
  'FILTRON:K1278',
  'FILTRON:K1278A',
  'FILTRON:OE650/7',
]

/** Q5'in HU8001x'li 3.0 TDI'ları (155kw 211hp ve 176kw 240hp) aynı liste. */
const Q5_30TDI_B = [
  'MANN:HU8001x',
  'MANN:CU2450',
  'MANN:CUK2450',
  'MANN:FP2450',
  'MANN:WK6011',
  'FILTRON:K1278',
  'FILTRON:OE650/6',
  'FILTRON:K1278A',
  'FILTRON:PP991/1',
]

/** Q5'in altı silindirli benzinlileri (3.0 TFSI 272hp ve 3.2 FSI 270hp). */
const Q5_V6_BENZIN = [
  'MANN:CU2450',
  'MANN:HU7029z',
  'MANN:CUK2450',
  'MANN:C16114x',
  'MANN:FP2450',
  'FILTRON:K1278',
  'FILTRON:OE671/4',
  'FILTRON:K1278A',
  'FILTRON:AK371/4',
]

/** Q5'in HU6013z'li 2.0 TFSI'ları (165kw 225hp ve 169kw 230hp). */
const Q5_20TFSI_HU6013 = [
  'MANN:CU2450',
  'MANN:C32130',
  'MANN:CUK2450',
  'MANN:FP2450',
  'MANN:HU6013z',
  'FILTRON:K1278',
  'FILTRON:K1278A',
  'FILTRON:AP139/4',
]

/** A3 (8P) 2.0 TDI (100/125 kw) — iki motorda da liste birebir aynı. */
const A3_20TDI = [
  'MANN:HU719/7x',
  'MANN:HU7008z',
  'MANN:CU2939',
  'MANN:C35154',
  'MANN:CUK2939',
  'MANN:FP2939',
  'MANN:PU825x',
  'MANN:PU936/1x',
  'MANN:PU936/2x',
  'FILTRON:OE650/1',
  'FILTRON:OE688',
  'FILTRON:K1111',
  'FILTRON:AP139/2',
  'FILTRON:K1111A',
  'FILTRON:PE973/3',
  'FILTRON:PE973/2',
]

/** A6'nın 3.0 TFSI V6'larında (213/220 kw) liste birebir aynı. */
const A6_30TFSI = [
  'MANN:HU7029z',
  'MANN:CU3023-2',
  'MANN:C17137/1x',
  'MANN:CUK3023-2',
  'MANN:FP3023-2',
  'FILTRON:OE671/4',
  'FILTRON:K1162-2x',
  'FILTRON:K1162A-2x',
]

/**
 * Q5'in orta güçlü 2.0 TDI'larında (100/105/125 kw) liste birebir aynı.
 * 120kw ayrı yazıldı: onda HU7020z + OE688/3 var, WK6003 + PP991 yok.
 */
const Q5_20TDI = [
  'MANN:HU719/7x',
  'MANN:HU7008z',
  'MANN:CU2450',
  'MANN:C32130',
  'MANN:CUK2450',
  'MANN:WK6003',
  'MANN:WK6021',
  'MANN:FP2450',
  'MANN:WK6011',
  'FILTRON:OE650/1',
  'FILTRON:OE688',
  'FILTRON:K1278',
  'FILTRON:K1278A',
  'FILTRON:AP139/4',
  'FILTRON:PP991',
  'FILTRON:PP991/1',
]

/** A6'nın 2.0 TDI'larında (120/125 kw) liste birebir aynı. */
const A6_20TDI = [
  'MANN:HU719/7x',
  'MANN:C16118',
  'MANN:CU3023-2',
  'MANN:CUK3023-2',
  'MANN:WK6001',
  'MANN:FP3023-2',
  'FILTRON:OE650/1',
  'FILTRON:AR371/2',
  'FILTRON:K1162-2x',
  'FILTRON:K1162A-2x',
  'FILTRON:PP993',
]

/** A6'nın büyük V6 dizellerinde (2.7 140kw ve 3.0 176kw) liste birebir aynı. */
const A6_V6_BUYUK = [
  'MANN:HU8001x',
  'MANN:CU3023-2',
  'MANN:C17137x',
  'MANN:CUK3023-2',
  'MANN:FP3023-2',
  'MANN:WK7002',
  'FILTRON:OE650/6',
  'FILTRON:K1162-2x',
  'FILTRON:K1162A-2x',
  'FILTRON:AR371/3',
  'FILTRON:PP991/2',
]

/** 2.8 FSI V6'nın üç güç seviyesinde de liste birebir aynı. */
const A6_28FSI = [
  'MANN:HU7029z',
  'MANN:CU3023-2',
  'MANN:C17137/1x',
  'MANN:WK720/4',
  'MANN:CUK3023-2',
  'MANN:FP3023-2',
  'FILTRON:OE671/4',
  'FILTRON:K1162-2x',
  'FILTRON:K1162A-2x',
  'FILTRON:PP836/6',
]

/** B6/B7'nin 1.9 TDI'larında (100/115/130 hp) liste birebir aynı. */
const B7_19TDI = [
  'MANN:HU726/2x',
  'MANN:CU3037',
  'MANN:C27192/1',
  'MANN:WK853/3x',
  'MANN:CUK3037',
  'MANN:H2019KIT1',
  'FILTRON:OE640/1',
  'FILTRON:K1078',
  'FILTRON:K1078A',
  'FILTRON:AP179/2',
  'FILTRON:PP839/1',
]

/** B6/B7'nin 2.0 TDI'larında (125/170 hp) liste birebir aynı. */
const B7_20TDI = [
  'MANN:HU719/7x',
  'MANN:CU3037',
  'MANN:C27192/1',
  'MANN:CUK3037',
  'MANN:H2019KIT1',
  'FILTRON:OE650/1',
  'FILTRON:K1078',
  'FILTRON:K1078A',
  'FILTRON:AP179/2',
  'FILTRON:PP839/10',
]

/** A6 (4F/C6) V6 dizellerinin ortak listesi. */
const A6_V6 = [
  'MANN:HU8001x',
  'MANN:HU831x',
  'MANN:CU3023-2',
  'MANN:C17137x',
  'MANN:CUK3023-2',
  'MANN:FP3023-2',
  'MANN:WK735/1',
  'FILTRON:OE650/3',
  'FILTRON:OE650/6',
  'FILTRON:K1162-2x',
  'FILTRON:K1162A-2x',
  'FILTRON:AR371/3',
  'FILTRON:PP986/2',
]

/**
 * B6/B7'nin 1.8 T motorlarında (110/140/163 hp) liste birebir aynı.
 * 125 hp yalnızca yağ filtresinde ayrışıyor (W719/30 + OP526/1).
 */
const B7_18T = [
  'MANN:CU3037',
  'MANN:C27192/1',
  'MANN:CUK3037',
  'MANN:WK720/3',
  'MANN:WK720/5',
  'MANN:WK720/6',
  'MANN:H2019KIT1',
  'FILTRON:K1078',
  'FILTRON:K1078A',
  'FILTRON:AP179/2',
  'FILTRON:PP836/5',
  'FILTRON:PP836/8',
]

/** B6/B7'nin doğrudan enjeksiyonlu benzinlileri (2.0 TFSI / 3.2 FSI). */
const B7_FSI = [
  'MANN:CU3037',
  'MANN:C27192/1',
  'MANN:CUK3037',
  'MANN:WK720/4',
  'MANN:H2019KIT1',
  'FILTRON:K1078',
  'FILTRON:K1078A',
  'FILTRON:AP179/2',
  'FILTRON:PP836/6',
]

/** B6/B7'nin emme manifoldlu eski benzinlileri (1.6 ve 2.0). */
const B7_ATMOSFERIK = [
  'MANN:W719/30',
  'MANN:WK730/1',
  'MANN:CU3037',
  'MANN:C27192/1',
  'MANN:CUK3037',
  'MANN:H2019KIT1',
  'FILTRON:OP526/1',
  'FILTRON:K1078',
  'FILTRON:K1078A',
  'FILTRON:AP179/2',
  'FILTRON:PP836/1',
]

/** Dizel A5'lerin ortak MANN listesi — 2.0 TDI varyantlarında birebir aynı. */
const TDI_20_TAM = [
  'MANN:HU719/7x',
  'MANN:HU7008z',
  'MANN:HU7020z',
  'MANN:CU2450',
  'MANN:C32130',
  'MANN:CUK2450',
  'MANN:WK6003',
  'MANN:FP2450',
  'MANN:C17009',
  'FILTRON:OE650/1',
  'FILTRON:OE688',
  'FILTRON:OE688/3',
  'FILTRON:K1278',
  'FILTRON:K1278A',
  'FILTRON:AP139/4',
  'FILTRON:PP991',
  'FILTRON:AK371/8',
]

/** 2.7 ve 3.0 TDI'da aynı liste görünüyor. */
const TDI_BUYUK = [
  'MANN:HU8001x',
  'MANN:HU831x',
  'MANN:CU2450',
  'MANN:CUK2450',
  'MANN:WK6003',
  'MANN:FP2450',
  'FILTRON:K1278',
  'FILTRON:OE650/3',
  'FILTRON:OE650/6',
  'FILTRON:K1278A',
  'FILTRON:PP991',
]

/**
 * A4 (8K, B8) benzinli TFSI listesi — 1.8/2.0 TFSI varyantlarında birebir aynı.
 * Not: 2.0 TFSI 165kw 224hp bu listede DEĞİL; kaynakta yağ filtresi HU6013z ve
 * hava filtresi AP139/4 ile farklı bir liste gösteriliyor.
 */
const A4_TFSI = [
  'MANN:CU2450',
  'MANN:W719/45',
  'MANN:C32130',
  'MANN:CUK2450',
  'MANN:FP2450',
  'FILTRON:K1278',
  'FILTRON:K1278A',
  'FILTRON:OP526/7',
]

/** A4 (8K, B8) 3.0 TDI — 180kw ve 150kw sayfalarında liste birebir aynı. */
const A4_TDI_30 = [
  'MANN:HU8005z',
  'MANN:CU2450',
  'MANN:CUK2450',
  'MANN:WK6003',
  'MANN:FP2450',
  'FILTRON:K1278',
  'FILTRON:K1278A',
  'FILTRON:OE650/7',
]

/**
 * A8 (4H) 3.0 TDI — 150/155/176/184/190/193 kw'ın ALTISINDA da liste birebir
 * aynı. Polen üçlüsü A7 (4GA/GF) ile ortak, o yüzden A74G_POLEN kullanılıyor.
 */
const A84H_30TDI = [
  'MANN:HU8005z',
  'MANN:WK6003',
  'MANN:C17023',
  ...A74G_POLEN,
  'FILTRON:OE650/7',
  'FILTRON:PP991',
]

/** TT III (FV) TFSI motorları — liste Q3 (F3) TFSI ile birebir aynı. */
const TTFV_TFSI = Q3F3_TFSI

/** TT III (FV) 2.0 TDI ile Q2 (GA) 1.6 TDI — iki sayfada da liste aynı. */
const TTFV_TDI = [
  'MANN:HU7020z',
  'MANN:C30005',
  'MANN:PU8028',
  ...A38Y_ORTAK_POLEN,
  'FILTRON:OE688/3',
  'FILTRON:AP139/5',
  'FILTRON:PE973/9',
]

/** A6 (4B/C5) 2.5 TDI V6 — 114/120/132 kw üçünde de liste birebir aynı. */
const A6C5_25TDI = [
  'MANN:CU3037',
  'MANN:CU3192',
  'MANN:CUK3037',
  'MANN:CUK3192',
  'MANN:HU842x',
  'MANN:C26206/1',
  'MANN:WK823/1',
  'MANN:H2019KIT1',
  'FILTRON:K1032',
  'FILTRON:K1032A',
  'FILTRON:K1078',
  'FILTRON:K1078A',
  'FILTRON:AP179/1',
  'FILTRON:OE650',
]

/** Q7 (4M) ve Q8 (4M) tüm motorlarında ortak polen üçlüsü. */
const Q74M_POLEN = ['MANN:CUK31003', 'MANN:FP31003', 'FILTRON:K1378A']

/** Q7 (4M) 55 TFSI e · 55 TFSI MH · 60 TFSI e — üçünde de liste aynı. */
const Q74M_TFSI_E = ['MANN:HU7049z', ...Q74M_POLEN, 'FILTRON:OE688/4']

/**
 * Q8 (4M) 3.0 TDI — 183/170/210 kw üçünde de liste birebir aynı. Q7'nin aynı
 * motorundan farkı: sayfada İKİ yakıt filtresi birden listeleniyor.
 */
const Q84M_30TDI = ['MANN:HU7012z', 'MANN:C38011', 'MANN:PU10010z', 'MANN:PU10011z', ...Q74M_POLEN]

/** TT I (8N) — dört motorda da liste birebir aynı. */
const TT8N_TAM = [
  'MANN:W719/30',
  'MANN:C37153',
  'MANN:WK730/1',
  'MANN:CUK2862',
  'MANN:FP2862',
  'FILTRON:OP526/1',
  'FILTRON:AP149/1',
  'FILTRON:K1047A',
]

/** A3 (8L) 1.9 TDI — 74kw ve 96kw sayfalarında liste birebir aynı. */
const A38L_19TDI = [
  'MANN:HU726/2x',
  'MANN:C37153',
  'MANN:CUK2862',
  'MANN:FP2862',
  'MANN:WK853/3x',
  'MANN:H2019KIT',
  'FILTRON:OE640/1',
  'FILTRON:AP149/1',
  'FILTRON:K1047A',
  'FILTRON:PP839/1',
]

/**
 * A8 (4N) tüm motorlarında ortak polen beşlisi.
 *
 * 60 TDI MH ve 60 TFSI e sayfalarında bu kartların adı "Polen Kabin Filtresi"
 * diye kırpılıyor, kod görünmüyor. Fiyatları AYNI MODELİN 45 TDI sayfasındaki
 * kodu açık kartlarla birebir tutuyor (877,10 · 1.315,64 · 1.710,37 · 517,86 ·
 * 620,97), o yüzden eşleştirildi — tahmin değil, fiyat kimliği.
 */
const A84N_POLEN = [
  'MANN:CU31003',
  'MANN:CUK31003',
  'MANN:FP31003',
  'FILTRON:K1378',
  'FILTRON:K1378A',
]

export const AUDI_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  { model: A5, engine: '2.0 TDI 120kw 163hp', products: TDI_20_TAM },
  {
    model: A5,
    engine: '2.0 TDI 100kw 136hp',
    products: TDI_20_TAM.filter((p) => p !== 'FILTRON:AK371/8'),
  },
  {
    model: A5,
    engine: '2.0 TDI 110kw 150hp',
    products: TDI_20_TAM.filter((p) => p !== 'MANN:HU719/7x' && p !== 'FILTRON:OE650/1'),
  },
  {
    model: A5,
    engine: '2.0 TDI 105kw 143hp',
    products: [
      'MANN:HU719/7x',
      'MANN:HU7008z',
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:WK6003',
      'MANN:FP2450',
      'FILTRON:OE650/1',
      'FILTRON:OE688',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
      'FILTRON:PP991',
    ],
  },
  { model: A5, engine: '2.7 TDI 120kw 163hp', products: TDI_BUYUK },
  { model: A5, engine: '2.7 TDI 140kw 190hp', products: TDI_BUYUK },
  { model: A5, engine: '3.0 TDI 176kw 240hp', products: TDI_BUYUK },
  {
    model: A5,
    engine: '2.0 TFSI 169kw 230hp',
    products: [
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:FP2450',
      'MANN:HU6013z',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
    ],
  },
  {
    model: A5,
    engine: '2.0 TDI 140kw 190hp',
    products: [
      'MANN:HU7020z',
      'MANN:CU2450',
      'MANN:CUK2450',
      'MANN:WK6003',
      'MANN:FP2450',
      'FILTRON:OE688/3',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:PP991',
      'MANN:C17009',
      'FILTRON:AK371/8',
    ],
  },
  {
    model: A5,
    engine: '2.0 TDI 125kw 170hp',
    products: [
      'MANN:HU719/7x',
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:WK6003',
      'MANN:FP2450',
      'FILTRON:OE650/1',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
      'FILTRON:PP991',
    ],
  },
  {
    model: A5,
    engine: '2.0 TDI 130kw 177hp',
    products: [
      'MANN:HU7008z',
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:WK6003',
      'MANN:FP2450',
      'FILTRON:OE688',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
      'FILTRON:PP991',
    ],
  },
  {
    model: A5,
    engine: '3.0 TFSI 200kw 272hp',
    products: [
      'MANN:CU2450',
      'MANN:HU7029z',
      'MANN:CUK2450',
      'MANN:HU7035y',
      'MANN:C16114x',
      'MANN:FP2450',
      'FILTRON:K1278',
      'FILTRON:OE671/4',
      'FILTRON:K1278A',
      'FILTRON:AK371/4',
    ],
  },
  {
    model: A5,
    engine: '1.8 TFSI 125kw 170hp',
    products: [
      'MANN:CU2450',
      'MANN:W719/45',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:FP2450',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:OP526/7',
      'FILTRON:AP139/4',
      'MANN:HU6013z',
    ],
  },
  {
    model: A5,
    engine: '3.0 TDI 180kw 245hp',
    products: [
      'MANN:HU8005z',
      'MANN:CU2450',
      'MANN:CUK2450',
      'MANN:WK6003',
      'MANN:FP2450',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:OE650/7',
    ],
  },
  {
    model: A5,
    engine: '3.0 TDI 160kw 218hp',
    products: [
      'MANN:HU8005z',
      'MANN:CU2450',
      'MANN:CUK2450',
      'MANN:WK6003',
      'MANN:FP2450',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:OE650/7',
    ],
  },
  {
    model: A5,
    engine: '3.0 TDI 155kw 211hp',
    products: [
      'MANN:HU8001x',
      'MANN:CU2450',
      'MANN:CUK2450',
      'MANN:WK6003',
      'MANN:FP2450',
      'FILTRON:K1278',
      'FILTRON:OE650/6',
      'FILTRON:K1278A',
    ],
  },
  {
    model: A5,
    engine: '3.0 TDI 150kw 204hp',
    products: [
      'MANN:HU8005z',
      'MANN:CU2450',
      'MANN:CUK2450',
      'MANN:WK6003',
      'MANN:FP2450',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:OE650/7',
    ],
  },
  {
    model: A5,
    engine: '3.2 FSI 195kw 265hp',
    products: [
      'MANN:CU2450',
      'MANN:HU7029z',
      'MANN:CUK2450',
      'MANN:C16114x',
      'MANN:FP2450',
      'FILTRON:K1278',
      'FILTRON:OE671/4',
      'FILTRON:K1278A',
    ],
  },
  {
    model: A5,
    engine: '2.0 TFSI 155kw 211hp',
    products: [
      'MANN:CU2450',
      'MANN:W719/45',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:FP2450',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:OP526/7',
    ],
  },
  {
    model: A5,
    engine: '2.0 TFSI 162kw 220hp',
    products: [
      'MANN:CU2450',
      'MANN:W719/45',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:FP2450',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:OP526/7',
    ],
  },
  {
    model: A5,
    engine: '1.8 TFSI 118kw 160hp',
    products: [
      'MANN:CU2450',
      'MANN:W719/45',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:FP2450',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:OP526/7',
    ],
  },
  {
    model: A5,
    engine: '2.0 TFSI 132kw 180hp',
    products: [
      'MANN:CU2450',
      'MANN:W719/45',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:FP2450',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:OP526/7',
    ],
  },
  {
    model: A5,
    engine: '2.0 TFSI 165kw 225hp',
    products: [
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:FP2450',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
      'MANN:HU6013z',
    ],
  },
  {
    model: A5,
    engine: '1.8 TFSI 130kw 177hp',
    products: [
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:FP2450',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
      'MANN:HU6013z',
    ],
  },
  {
    model: A5,
    engine: '1.8 TFSI 106kw 144hp',
    products: [
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:FP2450',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
      'MANN:HU6013z',
    ],
  },
  {
    model: A4,
    engine: '2.0 TDI 120kw 163hp',
    products: [
      'MANN:HU719/7x',
      'MANN:HU7008z',
      'MANN:HU7020z',
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:WK6003',
      'MANN:FP2450',
      'MANN:C17009',
      'FILTRON:OE650/1',
      'FILTRON:OE688',
      'FILTRON:OE688/3',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
      'FILTRON:PP991',
    ],
  },
  {
    model: A4,
    engine: '2.0 TDI 100kw 136hp',
    products: [
      'MANN:HU719/7x',
      'MANN:HU7008z',
      'MANN:HU7020z',
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:WK6003',
      'MANN:FP2450',
      'MANN:C17009',
      'FILTRON:OE650/1',
      'FILTRON:OE688',
      'FILTRON:OE688/3',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
      'FILTRON:PP991',
    ],
  },
  {
    model: A4,
    engine: '2.0 TDI 110kw 150hp',
    products: [
      'MANN:HU7008z',
      'MANN:HU7020z',
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:WK6003',
      'MANN:FP2450',
      'FILTRON:OE688',
      'FILTRON:OE688/3',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
      'FILTRON:PP991',
      'MANN:C17009',
      'FILTRON:AK371/8',
    ],
  },
  {
    model: A4,
    engine: '2.7 TDI 140kw 190hp',
    products: TDI_BUYUK,
  },
  {
    model: A4,
    engine: '3.0 TDI 176kw 240hp',
    products: TDI_BUYUK,
  },
  {
    model: A4,
    engine: '2.7 TDI 120kw 163hp',
    products: TDI_BUYUK,
  },
  {
    model: A4,
    engine: '2.0 TDI 105kw 143hp',
    products: [
      'MANN:HU719/7x',
      'MANN:HU7008z',
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:WK6003',
      'MANN:FP2450',
      'FILTRON:OE650/1',
      'FILTRON:OE688',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
      'FILTRON:PP991',
    ],
  },
  {
    model: A4,
    engine: '2.0 TDI 88kw 120hp',
    products: [
      'MANN:HU719/7x',
      'MANN:HU7008z',
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:WK6003',
      'MANN:FP2450',
      'FILTRON:OE650/1',
      'FILTRON:OE688',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
      'FILTRON:PP991',
    ],
  },
  {
    model: A4,
    engine: '2.0 TDI 125kw 170hp',
    products: [
      'MANN:HU719/7x',
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:WK6003',
      'MANN:FP2450',
      'FILTRON:OE650/1',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
      'FILTRON:PP991',
    ],
  },
  {
    model: A4,
    engine: '2.0 TDI 130kw 177hp',
    products: [
      'MANN:HU7008z',
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:WK6003',
      'MANN:FP2450',
      'FILTRON:OE688',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
      'FILTRON:PP991',
    ],
  },
  {
    model: A4,
    engine: '2.0 TDI 140kw 190hp',
    products: [
      'MANN:HU7020z',
      'MANN:CU2450',
      'MANN:CUK2450',
      'MANN:WK6003',
      'MANN:FP2450',
      'MANN:C17009',
      'FILTRON:OE688/3',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:PP991',
      'FILTRON:AK371/8',
    ],
  },
  {
    model: A4,
    engine: '3.0 TFSI 200kw 272hp',
    products: [
      'MANN:HU7029z',
      'MANN:HU7035y',
      'MANN:CU2450',
      'MANN:CUK2450',
      'MANN:C16114x',
      'MANN:FP2450',
      'FILTRON:OE671/4',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AK371/4',
    ],
  },
  { model: A4, engine: '3.0 TDI 180kw 245hp', products: A4_TDI_30 },
  { model: A4, engine: '3.0 TDI 150kw 204hp', products: A4_TDI_30 },
  {
    model: A4,
    engine: '3.0 TDI 155kw 211hp',
    products: [
      'MANN:HU8001x',
      'MANN:CU2450',
      'MANN:CUK2450',
      'MANN:WK6003',
      'MANN:FP2450',
      'FILTRON:K1278',
      'FILTRON:OE650/6',
      'FILTRON:K1278A',
    ],
  },
  { model: A4, engine: '1.8 TFSI 118kw 160hp', products: A4_TFSI },
  { model: A4, engine: '1.8 TFSI 88kw 120hp', products: A4_TFSI },
  { model: A4, engine: '2.0 TFSI 132kw 180hp', products: A4_TFSI },
  { model: A4, engine: '2.0 TFSI 155kw 211hp', products: A4_TFSI },
  { model: A4, engine: '2.0 TFSI 162kw 220hp', products: A4_TFSI },
  {
    model: A4,
    engine: '3.2 FSI 195kw 265hp',
    products: [
      'MANN:HU7029z',
      'MANN:CU2450',
      'MANN:CUK2450',
      'MANN:C16114x',
      'MANN:FP2450',
      'FILTRON:OE671/4',
      'FILTRON:K1278',
      'FILTRON:K1278A',
    ],
  },
  {
    model: A4,
    engine: '2.0 TFSI 165kw 224hp',
    products: [
      'MANN:HU6013z',
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:FP2450',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
    ],
  },
  // ── A4 (8E/8H, B6+B7) ────────────────────────────────────────────────────
  {
    model: B7,
    engine: '1.8 T 110kw 150hp',
    products: [...B7_18T, 'MANN:W940/66', 'FILTRON:OP526/6'],
  },
  {
    model: B7,
    engine: '1.8 T 120kw 163hp',
    products: [...B7_18T, 'MANN:W940/66', 'FILTRON:OP526/6'],
  },
  {
    model: B7,
    engine: '1.8 T 140kw 190hp',
    products: [...B7_18T, 'MANN:W940/66', 'FILTRON:OP526/6'],
  },
  {
    model: B7,
    engine: '1.8 T 125kw 170hp',
    products: [...B7_18T, 'MANN:W719/30', 'FILTRON:OP526/1'],
  },
  { model: B7, engine: '1.6 75kw 102hp', products: B7_ATMOSFERIK },
  { model: B7, engine: '2.0 96kw 130hp', products: B7_ATMOSFERIK },
  {
    model: B7,
    engine: '3.0 V6 162kw 220hp',
    products: [
      'MANN:W930/21',
      'MANN:WK730/1',
      'MANN:CU3037',
      'MANN:C27192/1',
      'MANN:CUK3037',
      'MANN:H2019KIT1',
      'FILTRON:OP526/5',
      'FILTRON:K1078',
      'FILTRON:K1078A',
      'FILTRON:AP179/2',
      'FILTRON:PP836/1',
    ],
  },
  {
    model: B7,
    engine: '2.0 TFSI 125kw 170hp',
    products: [...B7_FSI, 'MANN:HU719/6x', 'FILTRON:OE671/3'],
  },
  {
    model: B7,
    engine: '2.0 TFSI 147kw 200hp',
    products: [...B7_FSI, 'MANN:HU719/6x', 'FILTRON:OE671/3'],
  },
  {
    model: B7,
    engine: '3.2 FSI 188kw 256hp',
    products: [...B7_FSI, 'MANN:HU7029z', 'FILTRON:OE671/4'],
  },
  { model: B7, engine: '1.9 TDI 96kw 130hp', products: B7_19TDI },
  { model: B7, engine: '1.9 TDI 85kw 115hp', products: B7_19TDI },
  { model: B7, engine: '1.9 TDI 74kw 100hp', products: B7_19TDI },
  { model: B7, engine: '2.0 TDI 125kw 170hp', products: B7_20TDI },
  { model: B7, engine: '2.0 TDI 92kw 125hp', products: B7_20TDI },

  // ── A6 (4F/C6) ───────────────────────────────────────────────────────────
  // 120kw/163hp ve 155kw/211hp sayfalarında WK7002 de listeleniyor; 132kw ve
  // 171kw sayfalarında yok. Kaynağa birebir uyuluyor.
  { model: A6, engine: '2.7 TDI V6 120kw 163hp', products: [...A6_V6, 'MANN:WK7002'] },
  { model: A6, engine: '3.0 TDI V6 155kw 211hp', products: [...A6_V6, 'MANN:WK7002'] },
  { model: A6, engine: '2.7 TDI V6 132kw 180hp', products: A6_V6 },
  { model: A6, engine: '3.0 TDI V6 171kw 233hp', products: A6_V6 },
  {
    model: A6,
    engine: '2.0 TDI 100kw 136hp',
    products: [
      'MANN:HU719/7x',
      'MANN:C16118',
      'MANN:CU3023-2',
      'MANN:CUK3023-2',
      'MANN:WK6001',
      'MANN:FP3023-2',
      'FILTRON:OE650/1',
      'FILTRON:AR371/2',
      'FILTRON:K1162-2x',
      'FILTRON:K1162A-2x',
      'FILTRON:PP839/10',
      'FILTRON:PP993',
    ],
  },
  { model: A6, engine: '2.0 TDI 120kw 163hp', products: A6_20TDI },
  { model: A6, engine: '2.0 TDI 125kw 170hp', products: A6_20TDI },
  { model: A6, engine: '3.0 TDI V6 176kw 239hp', products: A6_V6_BUYUK },
  { model: A6, engine: '2.7 TDI V6 140kw 190hp', products: A6_V6_BUYUK },
  { model: A6, engine: '2.8 FSI V6 140kw 190hp', products: A6_28FSI },
  { model: A6, engine: '2.8 FSI V6 154kw 210hp', products: A6_28FSI },
  { model: A6, engine: '2.8 FSI V6 162kw 220hp', products: A6_28FSI },
  {
    model: A6,
    engine: '2.0 TFSI 125kw 170hp',
    products: [
      'MANN:HU719/6x',
      'MANN:C16118',
      'MANN:CU3023-2',
      'MANN:WK720/4',
      'MANN:CUK3023-2',
      'MANN:FP3023-2',
      'FILTRON:OE671/3',
      'FILTRON:AR371/2',
      'FILTRON:K1162-2x',
      'FILTRON:K1162A-2x',
      'FILTRON:PP836/6',
    ],
  },
  {
    model: A6,
    engine: '2.0 TDI 103kw 140hp',
    products: [
      'MANN:HU719/7x',
      'MANN:C16118',
      'MANN:CU3023-2',
      'MANN:WK842/21x',
      'MANN:CUK3023-2',
      'MANN:FP3023-2',
      'FILTRON:OE650/1',
      'FILTRON:AR371/2',
      'FILTRON:K1162-2x',
      'FILTRON:PP839/10',
      'FILTRON:K1162A-2x',
    ],
  },
  {
    model: A6,
    engine: '3.0 TDI V6 166kw 226hp',
    products: [
      'MANN:HU831x',
      'MANN:CU3023-2',
      'MANN:C17137x',
      'MANN:CUK3023-2',
      'MANN:FP3023-2',
      'MANN:WK735/1',
      'FILTRON:OE650/3',
      'FILTRON:K1162-2x',
      'FILTRON:K1162A-2x',
      'FILTRON:AR371/3',
      'FILTRON:PP986/2',
    ],
  },
  {
    model: A6,
    engine: '2.4 V6 130kw 177hp',
    products: [
      'MANN:HU7029z',
      'MANN:CU3023-2',
      'MANN:C17137/1x',
      'MANN:WK720/3',
      'MANN:CUK3023-2',
      'MANN:FP3023-2',
      'FILTRON:OE671/4',
      'FILTRON:K1162-2x',
      'FILTRON:K1162A-2x',
      'FILTRON:PP836/5',
    ],
  },
  { model: A6, engine: '3.0 TFSI V6 213kw 290hp', products: A6_30TFSI },
  { model: A6, engine: '3.0 TFSI V6 220kw 299hp', products: A6_30TFSI },

  // ── Q5 (8R) ──────────────────────────────────────────────────────────────
  { model: Q5, engine: '2.0 TDI quattro 100kw 136hp', products: Q5_20TDI },
  { model: Q5, engine: '2.0 TDI quattro 105kw 143hp', products: Q5_20TDI },
  { model: Q5, engine: '2.0 TDI quattro 125kw 170hp', products: Q5_20TDI },
  {
    model: Q5,
    engine: '2.0 TDI quattro 120kw 163hp',
    products: [
      'MANN:HU719/7x',
      'MANN:HU7008z',
      'MANN:HU7020z',
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:WK6021',
      'MANN:FP2450',
      'MANN:WK6011',
      'FILTRON:OE650/1',
      'FILTRON:OE688',
      'FILTRON:OE688/3',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
      'FILTRON:PP991/1',
    ],
  },
  {
    model: Q5,
    engine: '2.0 TDI quattro 110kw 150hp',
    products: [
      'MANN:HU7008z',
      'MANN:HU7020z',
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:WK6021',
      'MANN:FP2450',
      'FILTRON:OE688',
      'FILTRON:OE688/3',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
      'FILTRON:PP991/4',
    ],
  },
  {
    model: Q5,
    engine: '2.0 TDI quattro 130kw 177hp',
    products: [
      'MANN:HU7008z',
      'MANN:CU2450',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:WK6021',
      'MANN:FP2450',
      'FILTRON:OE688',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AP139/4',
      'FILTRON:PP991/4',
    ],
  },
  {
    model: Q5,
    engine: '2.0 TDI quattro 140kw 190hp',
    products: [
      'MANN:HU7020z',
      'MANN:CU2450',
      'MANN:CUK2450',
      'MANN:WK6021',
      'MANN:FP2450',
      'MANN:C17009',
      'FILTRON:OE688/3',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:AK371/8',
      'FILTRON:PP991/4',
    ],
  },
  {
    model: Q5,
    engine: '2.0 TFSI quattro 132kw 180hp',
    products: [
      'MANN:CU2450',
      'MANN:W719/45',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:FP2450',
      'MANN:HU6013z',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:OP526/7',
      'FILTRON:AP139/4',
    ],
  },
  { model: Q5, engine: '3.0 TDI quattro 180kw 245hp', products: Q5_30TDI_A },
  { model: Q5, engine: '3.0 TDI quattro 184kw 250hp', products: Q5_30TDI_A },
  { model: Q5, engine: '3.0 TDI quattro 190kw 258hp', products: Q5_30TDI_A },
  { model: Q5, engine: '3.0 TDI quattro 176kw 239hp', products: Q5_30TDI_A },
  { model: Q5, engine: '3.0 TDI quattro 176kw 240hp', products: Q5_30TDI_B },
  { model: Q5, engine: '3.0 TDI quattro 155kw 211hp', products: Q5_30TDI_B },
  { model: Q5, engine: '3.0 TFSI quattro 200kw 272hp', products: Q5_V6_BENZIN },
  { model: Q5, engine: '3.2 FSI quattro 199kw 270hp', products: Q5_V6_BENZIN },
  { model: Q5, engine: '2.0 TFSI quattro 169kw 230hp', products: Q5_20TFSI_HU6013 },
  { model: Q5, engine: '2.0 TFSI quattro 165kw 225hp', products: Q5_20TFSI_HU6013 },
  {
    model: Q5,
    engine: '2.0 TFSI quattro 162kw 220hp',
    products: [
      'MANN:CU2450',
      'MANN:W719/45',
      'MANN:C32130',
      'MANN:CUK2450',
      'MANN:FP2450',
      'FILTRON:K1278',
      'FILTRON:K1278A',
      'FILTRON:OP526/7',
      'FILTRON:AP139/4',
    ],
  },

  // ── A3 (8P) ──────────────────────────────────────────────────────────────
  { model: A3, engine: '2.0 TDI 125kw 170hp', products: A3_20TDI },
  { model: A3, engine: '2.0 TDI 100kw 136hp', products: A3_20TDI },
  {
    model: A3,
    engine: '2.0 TDI 103kw 140hp',
    products: [
      'MANN:HU719/7x',
      'MANN:HU7008z',
      'MANN:C35154',
      'MANN:PU825x',
      'MANN:PU936/1x',
      'MANN:PU936/2x',
      ...A3_POLEN,
      'FILTRON:OE650/1',
      'FILTRON:OE688',
      'FILTRON:AP139/2',
      'FILTRON:PE973/3',
      'FILTRON:PE973/2',
    ],
  },
  {
    model: A3,
    engine: '1.9 TDI 77kw 105hp',
    products: [
      'MANN:HU719/7x',
      'MANN:C35154',
      'MANN:PU825x',
      'MANN:PU936/1x',
      'MANN:PU936/2x',
      ...A3_POLEN,
      'FILTRON:OE650/1',
      'FILTRON:AP139/2',
      'FILTRON:PE973/3',
      'FILTRON:PE973/2',
    ],
  },
  {
    model: A3,
    engine: '2.0 TDI 120kw 163hp',
    products: [
      'MANN:HU719/7x',
      'MANN:C35154',
      'MANN:PU825x',
      ...A3_POLEN,
      'FILTRON:OE650/1',
      'FILTRON:AP139/2',
      'FILTRON:PE973/3',
    ],
  },
  {
    model: A3,
    engine: '1.4 TFSI 92kw 125hp',
    products: [
      'MANN:HU712/6x',
      'MANN:W712/94',
      'MANN:W712/93',
      'MANN:C14130',
      'MANN:WK69',
      ...A3_POLEN,
      'FILTRON:OE650/2',
      'FILTRON:OP641/1',
      'FILTRON:OP641/2',
      'FILTRON:AK370/4',
      'FILTRON:PP836/2',
    ],
  },
  {
    model: A3,
    engine: '1.2 TFSI 77kw 105hp',
    products: [
      'MANN:W712/94',
      'MANN:C14130',
      'MANN:WK69',
      ...A3_POLEN,
      'FILTRON:AK370/4',
      'FILTRON:OP641/2',
      'FILTRON:PP836/2',
    ],
  },
  {
    model: A3,
    engine: '2.0 TFSI 147kw 200hp',
    products: [
      'MANN:C35154',
      'MANN:HU719/6x',
      'MANN:W719/45',
      'MANN:C41110',
      'MANN:WK69',
      ...A3_POLEN,
      'FILTRON:AP139/2',
      'FILTRON:OE671/3',
      'FILTRON:AP149/8',
      'FILTRON:OP526/7',
      'FILTRON:PP836/2',
    ],
  },
  {
    model: A3,
    engine: '1.8 TFSI 118kw 160hp',
    products: [
      'MANN:C35154',
      'MANN:W719/45',
      'MANN:WK69',
      ...A3_POLEN,
      'FILTRON:AP139/2',
      'FILTRON:OP526/7',
      'FILTRON:PP836/2',
    ],
  },
  {
    model: A3,
    engine: '1.6 FSI 85kw 115hp',
    products: [
      'MANN:WK512',
      'MANN:HU712/6x',
      'MANN:C3083/1',
      'MANN:WK69',
      ...A3_POLEN,
      'FILTRON:PP905',
      'FILTRON:OE650/2',
      'FILTRON:AP149/7',
      'FILTRON:PP836/2',
    ],
  },
  {
    model: A3,
    engine: '2.0 FSI 110kw 150hp',
    products: [
      'MANN:WK512',
      'MANN:HU719/6x',
      'MANN:C14130',
      'MANN:WK69',
      ...A3_POLEN,
      'FILTRON:PP905',
      'FILTRON:OE671/3',
      'FILTRON:AK370/4',
      'FILTRON:PP836/2',
    ],
  },
  {
    model: A3,
    engine: '1.6 75kw 102hp',
    products: [
      'MANN:W719/30',
      'MANN:C14130',
      'MANN:WK59x',
      'MANN:WK69/2',
      ...A3_POLEN,
      'FILTRON:OP526/1',
      'FILTRON:AK370/4',
      'FILTRON:PP836/4',
    ],
  },
  { model: A3, engine: '1.6 TDI 77kw 105hp', products: [...A3_16TDI, ...A3_POLEN] },
  { model: A3, engine: '1.6 TDI 66kw 90hp', products: [...A3_16TDI, ...A3_POLEN] },
  { model: A3, engine: '2.0 TFSI 188kw 256hp', products: [...A3_20TFSI_GUC, ...A3_POLEN] },
  { model: A3, engine: '2.0 TFSI 195kw 265hp', products: [...A3_20TFSI_GUC, ...A3_POLEN] },
  {
    model: A3,
    engine: '1.4 TFSI 85kw 116hp',
    products: ['MANN:W712/95', 'MANN:C27009', ...A3_POLEN, 'FILTRON:OP616/3', 'FILTRON:AP062/1'],
  },

  // ── A6 (4G2/4G5/4GC/4GD) ─────────────────────────────────────────────────
  {
    model: A6G,
    engine: '2.0 TDI 100kw 136hp',
    products: ['MANN:HU7008z', 'MANN:HU7020z', 'FILTRON:OE688', 'FILTRON:OE688/3', ...A6G_ORTAK],
  },
  {
    model: A6G,
    engine: '2.0 TDI 140kw 190hp',
    products: ['MANN:HU7020z', 'FILTRON:OE688/3', ...A6G_ORTAK],
  },
  {
    model: A6G,
    engine: '2.0 TDI 120kw 163hp',
    products: ['MANN:HU7008z', 'FILTRON:OE688', ...A6G_ORTAK],
  },
  {
    model: A6G,
    engine: '2.0 TDI 130kw 177hp',
    products: ['MANN:HU7008z', 'FILTRON:OE688', ...A6G_ORTAK],
  },
  // Aşağıdaki motorlarda da yalnızca kodu OKUNABİLEN ürünler var; kodu
  // kırpılan MANN kartları AUDI_MISSING_CODE'da.
  { model: A6G, engine: '3.0 TDI 180kw 245hp', products: A6G_TDI30_TAM },
  { model: A6G, engine: '3.0 TDI 176kw 239hp', products: A6G_TDI30_TAM },
  { model: A6G, engine: '3.0 TDI 150kw 204hp', products: A6G_TDI30_TAM },
  { model: A6G, engine: '3.0 TDI 160kw 218hp', products: ['FILTRON:OE650/7', 'FILTRON:AR371/7'] },
  { model: A6G, engine: '3.0 TDI 155kw 211hp', products: ['FILTRON:OE650/7', 'FILTRON:AR371/7'] },
  { model: A6G, engine: '3.0 TDI 140kw 190hp', products: ['FILTRON:AR371/7', 'FILTRON:K1318A'] },
  { model: A6G, engine: '3.0 TDI 200kw 272hp', products: ['FILTRON:AR371/7', 'FILTRON:K1318A'] },
  {
    model: A6G,
    engine: '2.0 TDI 110kw 150hp',
    products: ['MANN:HU7020z', 'FILTRON:OE688/3', 'FILTRON:AR371/6', 'FILTRON:K1318A'],
  },
  {
    model: A6G,
    engine: '2.8 FSI 162kw 220hp',
    products: ['FILTRON:OE671/4', 'FILTRON:AR371/7', 'FILTRON:K1318A'],
  },
  {
    model: A6G,
    engine: '2.8 FSI 150kw 204hp',
    products: ['FILTRON:OE671/4', 'FILTRON:AR371/7', 'FILTRON:K1318A'],
  },
  { model: A6G, engine: '2.0 TFSI 162kw 220hp', products: A6G_TFSI },
  { model: A6G, engine: '2.0 TFSI 155kw 211hp', products: A6G_TFSI },
  { model: A6G, engine: '2.0 TFSI 132kw 180hp', products: A6G_TFSI },
  { model: A6G, engine: '2.0 TFSI 183kw 249hp', products: ['FILTRON:AR371/6', 'FILTRON:K1318A'] },
  { model: A6G, engine: '2.0 TFSI 185kw 252hp', products: ['FILTRON:AR371/6', 'FILTRON:K1318A'] },
  // ── A4 (8W) ──────────────────────────────────────────────────────────────
  { model: A48W, engine: '2.0 TDI 90kw 122hp', products: A48W_20TDI },
  { model: A48W, engine: '2.0 TDI 100kw 136hp', products: A48W_20TDI },
  { model: A48W, engine: '2.0 TDI 110kw 150hp', products: A48W_20TDI },
  { model: A48W, engine: '2.0 TDI 120kw 163hp', products: A48W_20TDI },
  { model: A48W, engine: '2.0 TDI 140kw 190hp', products: A48W_20TDI },
  { model: A48W, engine: '30 TDI Mild Hybrid 100kw 136hp', products: A48W_TDI_MH },
  { model: A48W, engine: '35 TDI Mild Hybrid 120kw 163hp', products: A48W_TDI_MH },
  { model: A48W, engine: '40 TDI Mild Hybrid 150kw 204hp', products: A48W_40TDI_MH },
  {
    model: A48W,
    engine: 'S4 TDI Mild Hybrid 255kw 347hp',
    products: [
      'MANN:HU7034z',
      'MANN:CU31003',
      'MANN:C17010',
      'MANN:CUK31003',
      'MANN:WK6008',
      'MANN:FP31003',
      'MANN:PU7008zKIT',
      'FILTRON:K1378',
      'FILTRON:K1378A',
      'FILTRON:PP991/3',
      'FILTRON:PE993/5',
    ],
  },
  {
    model: A48W,
    engine: '50 TDI Mild Hybrid 210kw 286hp',
    products: [
      'MANN:HU7012z',
      'MANN:CU31003',
      'MANN:C17010',
      'MANN:CUK31003',
      'MANN:WK6008',
      'MANN:FP31003',
      'FILTRON:OE650/8',
      'FILTRON:K1378',
      'FILTRON:K1378A',
      'FILTRON:PP991/3',
    ],
  },
  {
    model: A48W,
    engine: 'S4 TDI Mild Hybrid 251kw 341hp',
    products: [
      'MANN:HU7034z',
      'MANN:CU31003',
      'MANN:C17010',
      'MANN:WK6003',
      'MANN:CUK31003',
      'MANN:FP31003',
      'FILTRON:K1378',
      'FILTRON:K1378A',
    ],
  },
  { model: A48W, engine: '40 TFSI Mild Hybrid 150kw 204hp', products: A48W_TFSI_MH },
  { model: A48W, engine: '45 TFSI Mild Hybrid 195kw 265hp', products: A48W_TFSI_MH },
  { model: A48W, engine: '3.0 TDI 160kw 218hp', products: A48W_30TDI },
  { model: A48W, engine: '3.0 TDI 200kw 272hp', products: A48W_30TDI },
  { model: A48W, engine: '2.0 TFSI 183kw 249hp', products: A48W_20TFSI },
  { model: A48W, engine: '2.0 TFSI 185kw 252hp', products: A48W_20TFSI },
  {
    model: A48W,
    engine: '2.0 TFSI 140kw 190hp',
    products: [
      'MANN:CU31003',
      'MANN:C17012/1',
      'MANN:CUK31003',
      'MANN:FP31003',
      'MANN:HU6013z',
      'FILTRON:K1378',
      'FILTRON:K1378A',
    ],
  },
  {
    model: A48W,
    engine: '1.4 TFSI 110kw 150hp',
    products: [
      'MANN:W712/95',
      'MANN:CU31003',
      'MANN:C17013',
      'MANN:CUK31003',
      'MANN:FP31003',
      'FILTRON:OP616/3',
      'FILTRON:K1378',
      'FILTRON:K1378A',
    ],
  },

  // ── Q5 II (FY) ───────────────────────────────────────────────────────────
  {
    model: Q5FY,
    engine: '40 TDI Mild Hybrid 150kw 204hp',
    products: [
      'MANN:HU7046z',
      'MANN:CU31003',
      'MANN:WK6003',
      'MANN:C17011',
      'MANN:CUK31003',
      'MANN:FP31003',
      'MANN:PU7008zKIT',
      'FILTRON:K1378',
      'FILTRON:OE688/8',
      'FILTRON:K1378A',
      'FILTRON:PP991',
      'FILTRON:AK376',
      'FILTRON:PE993/5',
    ],
  },
  {
    model: Q5FY,
    engine: '3.0 TDI SQ5 Mild Hybrid 255kw 347hp',
    products: [
      'MANN:HU7034z',
      'MANN:CU31003',
      'MANN:C17010',
      'MANN:WK6003',
      'MANN:CUK31003',
      'MANN:FP31003',
      'MANN:PU7008zKIT',
      'FILTRON:K1378',
      'FILTRON:K1378A',
      'FILTRON:PP991',
      'FILTRON:PE993/5',
    ],
  },
  { model: Q5FY, engine: '2.0 TDI 100kw 136hp', products: A48W_20TDI },
  { model: Q5FY, engine: '2.0 TDI 110kw 150hp', products: A48W_20TDI },
  { model: Q5FY, engine: '30 TDI Mild Hybrid 100kw 136hp', products: A48W_TDI_MH },
  { model: Q5FY, engine: '35 TDI Mild Hybrid 120kw 163hp', products: A48W_TDI_MH },
  { model: Q5FY, engine: '2.0 TDI, 40 TDI 140kw 190hp', products: A48W_20TDI },
  { model: Q5FY, engine: '2.0 TDI, 35 TDI 120kw 163hp', products: A48W_20TDI },
  {
    model: Q5FY,
    engine: '3.0 TDI 210kw 286hp',
    products: [
      'MANN:HU7012z',
      'MANN:CU31003',
      'MANN:WK6003',
      'MANN:C17010',
      'MANN:CUK31003',
      'MANN:FP31003',
      'FILTRON:PP991',
      'FILTRON:K1378',
      'FILTRON:K1378A',
    ],
  },
  {
    model: Q5FY,
    engine: '50 TDI Mild Hybrid 210kw 286hp',
    products: [
      'MANN:HU7034z',
      'MANN:CU31003',
      'MANN:C17010',
      'MANN:WK6003',
      'MANN:CUK31003',
      'MANN:FP31003',
      'FILTRON:K1378',
      'FILTRON:K1378A',
      'FILTRON:PP991',
    ],
  },
  { model: Q5FY, engine: '40 TFSI Mild Hybrid 150kw 204hp', products: Q5FY_TFSI },
  { model: Q5FY, engine: '45 TFSI Mild Hybrid 195kw 265hp', products: Q5FY_TFSI },
  { model: Q5FY, engine: '50 TFSI e quattro 220kw 299hp', products: Q5FY_TFSI },
  { model: Q5FY, engine: '50 TFSI e quattro 270kw 367hp', products: Q5FY_TFSI },
  { model: Q5FY, engine: '55 TFSI e quattro 270kw 367hp', products: Q5FY_TFSI },
  {
    model: Q5FY,
    engine: 'SQ5 TDI 251kw 341hp',
    products: [
      'MANN:HU7034z',
      'MANN:CU31003',
      'MANN:C17010',
      'MANN:WK6003',
      'MANN:CUK31003',
      'MANN:FP31003',
      'FILTRON:K1378',
      'FILTRON:K1378A',
      'FILTRON:PP991',
    ],
  },
  { model: Q5FY, engine: '2.0 TFSI 185kw 252hp', products: A48W_20TFSI },
  { model: Q5FY, engine: '2.0 TFSI 183kw 249hp', products: A48W_20TFSI },

  // ── A3 (8YA, 8YS) ────────────────────────────────────────────────────────
  { model: A38Y, engine: '30 TDI 85kw 116hp', products: A38Y_TDI },
  { model: A38Y, engine: '35 TDI 110kw 150hp', products: A38Y_TDI },
  {
    model: A38Y,
    engine: '40 TDI 147kw 200hp',
    products: A38Y_TDI.filter((p) => p !== 'FILTRON:PE993/2'),
  },
  { model: A38Y, engine: 'RS3 294kw 400hp', products: A38Y_RS3 },
  { model: A38Y, engine: 'RS3 299kw 407hp', products: A38Y_RS3 },
  { model: A38Y, engine: '30 g-tron 96kw 131hp', products: A38Y_30 },
  { model: A38Y, engine: '30 TFSI 81kw 110hp', products: A38Y_30 },
  { model: A38Y, engine: '30 TFSI Mild Hybrid 81kw 110hp', products: A38Y_30 },
  { model: A38Y, engine: '35 TFSI 110kw 150hp', products: A38Y_30 },
  { model: A38Y, engine: '35 TFSI Mild Hybrid 110kw 150hp', products: A38Y_30 },
  { model: A38Y, engine: '40 TFSIe 110kw 150hp', products: A38Y_TFSIE },
  { model: A38Y, engine: '45 TFSIe 110kw 150hp', products: A38Y_TFSIE },
  {
    model: A38Y,
    engine: '40 TFSI 140kw 190hp',
    products: ['MANN:HU6013z', 'MANN:C27009', ...A38Y_ORTAK, 'FILTRON:OE688/5', 'FILTRON:AP062/1'],
  },
  {
    model: A38Y,
    engine: 'S3 228kw 310hp',
    products: ['MANN:HU6013z', 'MANN:C30005', ...A38Y_ORTAK, 'FILTRON:OE688/5', 'FILTRON:AP139/5'],
  },

  // ── Q3 (8U) ──────────────────────────────────────────────────────────────
  {
    model: Q38U,
    engine: '2.0 TDI 103kw 140hp',
    products: ['MANN:HU7008z', 'MANN:PU8015', ...Q38U_ORTAK, 'FILTRON:OE688', 'FILTRON:PE973/10'],
  },
  {
    model: Q38U,
    engine: '2.0 TDI 100kw 136hp',
    products: [
      'MANN:HU7008z',
      'MANN:HU7020z',
      'MANN:PU8015',
      ...Q38U_ORTAK,
      'FILTRON:OE688',
      'FILTRON:OE688/3',
      'FILTRON:PE973/10',
    ],
  },
  {
    model: Q38U,
    engine: '2.0 TDI 135kw 184hp',
    products: ['MANN:HU7020z', ...Q38U_ORTAK, 'FILTRON:OE688/3', 'FILTRON:PE993/2'],
  },
  { model: Q38U, engine: '2.0 TDI 88kw 120hp', products: Q38U_TDI_A },
  { model: Q38U, engine: '2.0 TDI 110kw 150hp', products: Q38U_TDI_A },
  { model: Q38U, engine: '2.0 TDI 120kw 163hp', products: Q38U_TDI_B },
  { model: Q38U, engine: '2.0 TDI 130kw 177hp', products: Q38U_TDI_B },
  { model: Q38U, engine: '1.4 TFSI 92kw 125hp', products: Q38U_14TFSI },
  { model: Q38U, engine: '1.4 TFSI 110kw 150hp', products: Q38U_14TFSI },
  { model: Q38U, engine: '2.0 TFSI 125kw 170hp', products: Q38U_20TFSI_A },
  { model: Q38U, engine: '2.0 TFSI 147kw 200hp', products: Q38U_20TFSI_A },
  { model: Q38U, engine: '2.0 TFSI 155kw 211hp', products: Q38U_20TFSI_A },
  { model: Q38U, engine: '2.0 TFSI 132kw 179hp', products: Q38U_20TFSI_B },
  { model: Q38U, engine: '2.0 TFSI 162kw 220hp', products: Q38U_20TFSI_B },
  // ── A6 (4A_/C8) ──────────────────────────────────────────────────────────
  { model: A6C8, engine: '30 TDI Mild Hybrid 100kw 136hp', products: A6C8_20TDI_MH },
  { model: A6C8, engine: '35 TDI Mild Hybrid 120kw 163hp', products: A6C8_20TDI_MH },
  {
    model: A6C8,
    engine: '55 TDI Mild Hybrid 3.0 quattro 257kw 349hp',
    products: ['MANN:HU7012z', ...A6C8_30TDI],
  },
  {
    model: A6C8,
    engine: 'S6 TDI Mild Hybrid 3.0 quattro 257kw 349hp',
    products: ['MANN:HU7012z', ...A6C8_30TDI],
  },
  {
    model: A6C8,
    engine: '45 TDI Mild Hybrid 3.0 quattro 180kw 245hp',
    products: ['MANN:HU7034z', ...A6C8_30TDI.filter((p) => p !== 'FILTRON:OE650/8')],
  },
  {
    model: A6C8,
    engine: 'S6 TDI 253kw 345hp',
    products: [
      'MANN:HU7034z',
      'MANN:WK7012',
      'MANN:PU7008zKIT',
      ...A6C8_POLEN,
      'FILTRON:PP991/6',
      'FILTRON:PE993/5',
    ],
  },
  {
    model: A6C8,
    engine: '40 TDI e Mild Hybrid 2.0 140kw 190hp',
    products: [
      'MANN:HU7020z',
      'MANN:PU7008zKIT',
      ...A6C8_POLEN,
      'FILTRON:OE688/3',
      'FILTRON:PE993/5',
    ],
  },
  {
    model: A6C8,
    engine: '45 TDI e Mild Hybrid 3.0 183kw 249hp',
    products: [
      'MANN:HU7012z',
      'MANN:PU7008zKIT',
      ...A6C8_POLEN,
      'FILTRON:OE650/8',
      'FILTRON:PE993/5',
    ],
  },
  { model: A6C8, engine: '40 TFSI 2.0 150kw 204hp', products: A6C8_TFSI },
  { model: A6C8, engine: '40 TFSI Mild Hybrid 2.0 150kw 204hp', products: A6C8_TFSI },
  { model: A6C8, engine: '45 TFSI Mild Hybrid 2.0 quattro 195kw 265hp', products: A6C8_TFSI },
  { model: A6C8, engine: '50 TFSI e 2.0 220kw 299hp', products: A6C8_TFSI },
  { model: A6C8, engine: '50 TFSI Mild Hybrid 2.0 195kw 265hp', products: A6C8_TFSI },
  { model: A6C8, engine: '55 TFSI e 2.0 185kw 252hp', products: A6C8_TFSI },
  { model: A6C8, engine: '55 TFSI e 2.0 270kw 367hp', products: A6C8_TFSI },

  // ── A1 (8X) ──────────────────────────────────────────────────────────────
  {
    model: A18X,
    engine: '1.6 TDI 77kw 105hp',
    products: [
      'MANN:HU7008z',
      'MANN:C15008',
      'MANN:WK8032',
      'MANN:WK823/2',
      'MANN:WK8029/1',
      ...A18X_POLEN,
      'FILTRON:OE688',
      'FILTRON:K1313',
      'FILTRON:AK370/2',
      'FILTRON:PP986',
      'FILTRON:PP986/4',
    ],
  },
  {
    model: A18X,
    engine: '1.6 TDI 66kw 90hp',
    products: [
      'MANN:HU7008z',
      'MANN:C15008',
      'MANN:WK8032',
      'MANN:WK8029/1',
      ...A18X_POLEN,
      'FILTRON:OE688',
      'FILTRON:K1313',
      'FILTRON:AK370/2',
      'FILTRON:PP986/4',
    ],
  },
  {
    model: A18X,
    engine: '1.6 TDI 85kw 116hp',
    products: [
      'MANN:HU7020z',
      'MANN:C29029',
      'MANN:C29034',
      'MANN:WK8029/1',
      ...A18X_POLEN,
      'FILTRON:OE688/3',
      'FILTRON:K1313',
      'FILTRON:AP183/9',
      'FILTRON:PP986/4',
    ],
  },
  {
    model: A18X,
    engine: '1.4 TDI 66kw 90hp',
    products: [
      'MANN:W7062',
      'MANN:C35011',
      'MANN:WK8029/1',
      ...A18X_POLEN,
      'FILTRON:K1313',
      'FILTRON:AP183/5',
      'FILTRON:PP986/4',
    ],
  },
  { model: A18X, engine: '1.2 TFSI 63kw 85hp', products: A18X_TFSI_KUCUK },
  { model: A18X, engine: '1.4 TFSI 90kw 122hp', products: A18X_TFSI_KUCUK },
  { model: A18X, engine: '1.4 TFSI 103kw 140hp', products: A18X_TFSI_BUYUK },
  { model: A18X, engine: '1.4 TFSI 110kw 150hp', products: A18X_TFSI_BUYUK },
  {
    model: A18X,
    engine: '1.0 TFSI 60kw 82hp',
    products: ['MANN:W712/95', ...A18X_POLEN, 'FILTRON:OP616/3', 'FILTRON:AP062/2'],
  },
  {
    model: A18X,
    engine: '1.0 TFSI 70kw 95hp',
    products: [
      'MANN:W712/95',
      'MANN:WK69',
      ...A18X_POLEN,
      'FILTRON:OP616/3',
      'FILTRON:AP062/2',
      'FILTRON:PP836/2',
    ],
  },
  { model: A18X, engine: '1.4 TFSI 92kw 125hp', products: A18X_TFSI_BUYUK },

  // ── Q7 (4L) ──────────────────────────────────────────────────────────────
  {
    model: Q74L,
    engine: '3.0 TDI V6 quattro 176kw 240hp',
    products: [
      ...Q74L_ORTAK,
      'MANN:HU8005z',
      'MANN:HU8001x',
      'MANN:HU831x',
      'MANN:WK6003',
      'MANN:PU1033x',
      'FILTRON:OE650/3',
      'FILTRON:OE650/6',
      'FILTRON:OE650/7',
      'FILTRON:PP991',
      'FILTRON:PE973/6',
    ],
  },
  {
    model: Q74L,
    engine: '3.0 TDI V6 quattro 155kw 211hp',
    products: [
      ...Q74L_ORTAK,
      'MANN:HU8001x',
      'MANN:HU831x',
      'MANN:PU1033x',
      'FILTRON:OE650/3',
      'FILTRON:OE650/6',
      'FILTRON:PE973/6',
    ],
  },
  {
    model: Q74L,
    engine: '3.0 TDI V6 quattro 165kw 224hp',
    products: [
      ...Q74L_ORTAK,
      'MANN:HU8001x',
      'MANN:WK6003',
      'MANN:PU1033x',
      'FILTRON:OE650/6',
      'FILTRON:PP991',
      'FILTRON:PE973/6',
    ],
  },
  {
    model: Q74L,
    engine: '3.0 TDI V6 quattro 171kw 232hp',
    products: [...Q74L_ORTAK, 'MANN:HU831x', 'MANN:PU1033x', 'FILTRON:OE650/3', 'FILTRON:PE973/6'],
  },
  { model: Q74L, engine: '3.0 TDI V6 quattro 150kw 204hp', products: Q74L_TDI_WK },
  { model: Q74L, engine: '3.0 TDI V6 quattro 180kw 245hp', products: Q74L_TDI_WK },
  {
    model: Q74L,
    engine: '3.0 TFSI quattro 200kw 272hp',
    products: [...Q74L_ORTAK, 'MANN:HU7029z', 'FILTRON:OE671/4'],
  },
  {
    model: Q74L,
    engine: '3.0 TFSI quattro 206kw 280hp',
    products: [...Q74L_ORTAK, 'MANN:HU7029z', 'FILTRON:OE671/4'],
  },
  {
    model: Q74L,
    engine: '3.6 FSI quattro 206kw 280hp',
    products: [...Q74L_ORTAK, 'MANN:HU932/6n', 'FILTRON:OE640'],
  },

  // ── A3 (8VA/8VS/8V7) ─────────────────────────────────────────────────────
  { model: A38V, engine: '1.6 TDI 77kw 105hp', products: A38V_16TDI },
  { model: A38V, engine: '1.6 TDI 81kw 110hp', products: A38V_16TDI },
  { model: A38V, engine: '1.6 TDI, 30 TDI 85kw 116hp', products: A38V_16TDI },
  { model: A38V, engine: '1.2 TFSI 77kw 105hp', products: A38V_TFSI },
  { model: A38V, engine: '1.2 TFSI 81kw 110hp', products: A38V_TFSI },
  { model: A38V, engine: '1.4 TFSI 90kw 122hp', products: A38V_TFSI },
  { model: A38V, engine: '1.4 TFSI 103kw 140hp', products: A38V_TFSI },
  { model: A38V, engine: '1.4 TFSI 110kw 150hp', products: A38V_TFSI },
  { model: A38V, engine: '1.4 TFSI 92kw 125hp', products: A38V_TFSI },
  {
    model: A38V,
    engine: '1.0 TFSI, 30 TFSI 85kw 115hp',
    products: ['MANN:W712/95', ...A38V_POLEN, 'FILTRON:OP616/3', 'FILTRON:AP062/2'],
  },
  {
    model: A38V,
    engine: '1.5 TFSI, 35 TFSI 110kw 150hp',
    products: ['MANN:W712/95', 'MANN:C28043', ...A38V_POLEN, 'FILTRON:OP616/3'],
  },

  // ── A7 (4GA/GF) ──────────────────────────────────────────────────────────
  { model: A74G, engine: '3.0 TDI 150kw 204hp', products: A74G_30TDI_TAM },
  { model: A74G, engine: '3.0 TDI 176kw 239hp', products: A74G_30TDI_TAM },
  { model: A74G, engine: '3.0 TDI 180kw 245hp', products: A74G_30TDI_TAM },
  { model: A74G, engine: '3.0 TDI 140kw 190hp', products: A74G_30TDI_KISA },
  { model: A74G, engine: '3.0 TDI 200kw 272hp', products: A74G_30TDI_KISA },
  {
    model: A74G,
    engine: '3.0 TDI 155kw 211hp',
    products: [
      'MANN:HU8005z',
      'MANN:HU7012z',
      'MANN:C16005',
      'MANN:WK6037',
      'MANN:CUK2641',
      'MANN:FP2641',
      'FILTRON:OE650/7',
      'FILTRON:AR371/7',
    ],
  },
  { model: A74G, engine: '2.8 FSI 150kw 204hp', products: A74G_BENZIN_V6 },
  { model: A74G, engine: '2.8 FSI 162kw 220hp', products: A74G_BENZIN_V6 },
  { model: A74G, engine: '3.0 TFSI 220kw 299hp', products: A74G_BENZIN_V6 },
  { model: A74G, engine: '1.8 TFSI 140kw 190hp', products: A74G_TFSI_4SIL },
  { model: A74G, engine: '2.0 TFSI 183kw 249hp', products: A74G_TFSI_4SIL },
  { model: A74G, engine: '2.0 TFSI 185kw 252hp', products: A74G_TFSI_4SIL },
  // ── Q3 (F3) ──────────────────────────────────────────────────────────────
  { model: Q3F3, engine: '35 TDI 2.0 110kw 150hp', products: Q3F3_TDI },
  { model: Q3F3, engine: '40 TDI 2.0 140kw 190hp', products: Q3F3_TDI },
  { model: Q3F3, engine: '40 TFSI 2.0 140kw 190hp', products: Q3F3_TFSI },
  { model: Q3F3, engine: '45 TFSI 2.0 169kw 230hp', products: Q3F3_TFSI },
  {
    model: Q3F3,
    engine: '45 TFSI 2.0 180kw 245hp',
    products: [
      'MANN:HU6013z',
      'MANN:C30005',
      'MANN:C30004',
      ...A38Y_ORTAK_POLEN,
      'FILTRON:OE688/5',
      'FILTRON:AP139/5',
      'FILTRON:AP139/6',
    ],
  },
  {
    model: Q3F3,
    engine: 'RSQ3 294kw 400hp',
    products: [
      'MANN:HU719/6x',
      'MANN:C38003',
      'MANN:C38002',
      ...A38Y_ORTAK_POLEN,
      'FILTRON:OE671/3',
      'FILTRON:AP139/8',
      'FILTRON:AP139/9',
    ],
  },
  {
    model: Q3F3,
    engine: '45 TFSIe 110kw 150hp',
    products: [
      'MANN:W712/95',
      'MANN:CU26009',
      'MANN:CUK26009',
      'MANN:C27009',
      'MANN:FP26009',
      'FILTRON:OP616/3',
      'FILTRON:K1311',
      'FILTRON:AP062/1',
    ],
  },
  // ── A5 + A5 Cabriolet + Sportback (F5) ───────────────────────────────────
  // ⚠ BU MODELDE PARÇA KODU HİÇBİR KARTTA GÖRÜNMÜYOR. Model adı kart
  // başlığındaki üç satırı tek başına doldurduğu için kod kırpılıyor ve
  // MANN/FILTRON görsellerinde de kod yazmıyor. Ürünler, kartların fiyat +
  // kategori + marka üçlüsünün A4 (8W) ve Q5 II (FY) ile BİREBİR tutmasıyla
  // eşleştirildi — üçü de aynı MLB evo platformunda ve aynı filtre ailesini
  // kullanıyor. Kullanıcı kararı: fiyat eşleşmesiyle yüklensin.
  // Eşleşmeyen tek kart (hava filtresi, 1.390,26) İÇE AKTARILMADI.
  { model: A5F5, engine: '40 TDI Mild Hybrid 150kw 204hp', products: A48W_40TDI_MH },
  { model: A5F5, engine: '30 TDI Mild Hybrid 100kw 136hp', products: A48W_TDI_MH },
  { model: A5F5, engine: '35 TDI Mild Hybrid 120kw 163hp', products: A48W_TDI_MH },
  { model: A5F5, engine: '35 TFSI Mild Hybrid 110kw 150hp', products: A48W_TFSI_MH },
  { model: A5F5, engine: '40 TFSI Mild Hybrid 150kw 204hp', products: A48W_TFSI_MH },
  {
    model: A5F5,
    engine: '35 TFSI 110kw 150hp',
    products: A48W_TFSI_MH.filter((p) => p !== 'MANN:C17013'),
  },
  {
    model: A5F5,
    engine: '45 TFSI Mild Hybrid 195kw 265hp',
    products: A48W_TFSI_MH.filter((p) => p !== 'MANN:C17013'),
  },
  { model: A5F5, engine: '50 TDI Mild Hybrid 210kw 286hp', products: A5F5_50TDI },
  { model: A5F5, engine: 'S5 TDI Mild Hybrid 251kw 341hp', products: A5F5_50TDI },

  // ── TT / TTS / TTRS II (8J) ──────────────────────────────────────────────
  { model: TT8J, engine: '1.8 TFSI 118kw 160hp', products: TT8J_TFSI_W719 },
  { model: TT8J, engine: '2.0 TFSI 155kw 211hp', products: TT8J_TFSI_W719 },
  { model: TT8J, engine: '2.0 TFSI 195kw 265hp', products: TT8J_TFSI_GUC },
  { model: TT8J, engine: '2.0 TFSI 200kw 272hp', products: TT8J_TFSI_GUC },
  {
    model: TT8J,
    engine: '2.0 TFSI 147kw 200hp',
    products: [
      ...TT8J_POLEN,
      'MANN:C35154',
      'MANN:HU719/6x',
      'MANN:W719/45',
      'MANN:C41110',
      'MANN:WK69',
      'FILTRON:AP139/2',
      'FILTRON:OE671/3',
      'FILTRON:AP149/8',
      'FILTRON:OP526/7',
      'FILTRON:PP836/2',
    ],
  },
  {
    model: TT8J,
    engine: '2.0 TDI 125kw 170hp',
    products: [
      ...TT8J_POLEN,
      'MANN:HU719/7x',
      'MANN:HU7008z',
      'MANN:C35154',
      'MANN:PU825x',
      'FILTRON:OE650/1',
      'FILTRON:OE688',
      'FILTRON:AP139/2',
      'FILTRON:PE973/3',
    ],
  },
  {
    model: TT8J,
    engine: '3.2 V6 184kw 250hp',
    products: [
      ...TT8J_POLEN,
      'MANN:HU719/7x',
      'MANN:C36188',
      'MANN:WK69/2',
      'FILTRON:OE650/1',
      'FILTRON:AP004/4',
      'FILTRON:PP836/4',
    ],
  },

  // ── A5 (F5) ──────────────────────────────────────────────────────────────
  {
    model: A5F5D,
    engine: '2.0 TDI 100kw 136hp',
    products: [
      'MANN:HU7020z',
      'MANN:C17011',
      'MANN:WK6008',
      ...A5F5D_POLEN,
      'FILTRON:OE688/3',
      'FILTRON:PP991/3',
    ],
  },
  {
    model: A5F5D,
    engine: '2.0 TDI 110kw 150hp',
    products: ['MANN:HU7020z', 'MANN:C17011', ...A5F5D_POLEN, 'FILTRON:OE688/3'],
  },
  {
    model: A5F5D,
    engine: '2.0 TDI 140kw 190hp',
    products: [
      'MANN:HU7020z',
      'MANN:WK6003',
      'MANN:C17011',
      ...A5F5D_POLEN,
      'FILTRON:OE688/3',
      'FILTRON:PP991',
    ],
  },
  { model: A5F5D, engine: '3.0 TDI 160kw 218hp', products: A5F5D_30TDI },
  { model: A5F5D, engine: '3.0 TDI 210kw 286hp', products: A5F5D_30TDI },
  {
    model: A5F5D,
    engine: '1.4 TFSI 110kw 150hp',
    products: ['MANN:W712/95', 'MANN:C17013', ...A5F5D_POLEN, 'FILTRON:OP616/3'],
  },
  { model: A5F5D, engine: '2.0 TFSI 183kw 249hp', products: A5F5D_20TFSI },
  { model: A5F5D, engine: '2.0 TFSI 185kw 252hp', products: A5F5D_20TFSI },
  {
    model: A5F5D,
    engine: '2.0 TFSI 140kw 190hp',
    products: ['MANN:C17012/1', 'MANN:HU6013z', ...A5F5D_POLEN],
  },

  // ── A8 (4H) ──────────────────────────────────────────────────────────────
  { model: A84H, engine: '3.0 TDI 150kw 204hp', products: A84H_30TDI },
  { model: A84H, engine: '3.0 TDI 155kw 211hp', products: A84H_30TDI },
  { model: A84H, engine: '3.0 TDI 176kw 239hp', products: A84H_30TDI },
  { model: A84H, engine: '3.0 TDI 184kw 250hp', products: A84H_30TDI },
  { model: A84H, engine: '3.0 TDI 190kw 258hp', products: A84H_30TDI },
  { model: A84H, engine: '3.0 TDI 193kw 262hp', products: A84H_30TDI },
  {
    model: A84H,
    engine: '3.0 TFSI 213kw 290hp',
    products: ['MANN:HU7029z', 'MANN:HU7035y', 'MANN:C17023', ...A74G_POLEN, 'FILTRON:OE671/4'],
  },
  {
    model: A84H,
    engine: '2.5 TFSI 150kw 204hp',
    products: ['MANN:HU7029z', 'MANN:C17023', ...A74G_POLEN, 'FILTRON:OE671/4'],
  },
  {
    model: A84H,
    engine: '2.0 TFSI 185kw 252hp',
    products: ['MANN:HU6013z', 'MANN:C15010', ...A74G_POLEN, 'FILTRON:AR371/6'],
  },

  // ── TT/TTS/TTRS III (FV) ─────────────────────────────────────────────────
  { model: TTFV, engine: '2.0 TDI 135kw 184hp', products: TTFV_TDI },
  {
    model: TTFV,
    engine: '2.0 TFSI (TTS) 235kw 320hp',
    products: [
      'MANN:HU6013z',
      'MANN:C30005',
      'MANN:CU26009',
      'MANN:CUK26009',
      'MANN:FP26009',
      'FILTRON:OE688/5',
      'FILTRON:K1311',
      'FILTRON:AP139/5',
    ],
  },
  { model: TTFV, engine: '1.8 TFSI 132kw 179hp', products: TTFV_TFSI },
  { model: TTFV, engine: '2.0 TFSI (TTS) 210kw 286hp', products: TTFV_TFSI },
  { model: TTFV, engine: '2.0 TFSI 162kw 220hp', products: TTFV_TFSI },
  { model: TTFV, engine: '2.0 TFSI 169kw 230hp', products: TTFV_TFSI },
  { model: TTFV, engine: '2.0 TFSI 215kw 292hp', products: TTFV_TFSI },

  // ── Q2 (GA) ──────────────────────────────────────────────────────────────
  {
    model: Q2GA,
    engine: '30 TDI 85kw 115hp',
    products: [
      'MANN:HU5003z',
      'MANN:H6003z',
      'MANN:C30005',
      'MANN:C30004',
      'MANN:H6031z',
      'MANN:PU8028',
      ...A38Y_ORTAK_POLEN,
      'FILTRON:OE688/6',
      'FILTRON:AP139/5',
      'FILTRON:AP139/6',
      'FILTRON:PE993/2',
      'FILTRON:PE973/9',
    ],
  },
  {
    model: Q2GA,
    engine: '1.0, 30 TFSI 85kw 115hp',
    products: [
      'MANN:W712/95',
      'MANN:CU26009',
      'MANN:CUK26009',
      'MANN:FP26009',
      'FILTRON:OP616/3',
      'FILTRON:K1311',
      'FILTRON:K1311A',
      'FILTRON:AP062/2',
    ],
  },
  { model: Q2GA, engine: '1.6 TDI, 30 TDI 85kw 116hp', products: TTFV_TDI },
  {
    model: Q2GA,
    engine: '30 TFSI 81kw 110hp',
    products: [
      'MANN:W712/95',
      'MANN:H6003z',
      'MANN:H6031z',
      'MANN:C28043',
      ...A38Y_ORTAK_POLEN,
      'FILTRON:OP616/3',
      'FILTRON:AP183/6',
    ],
  },
  {
    model: Q2GA,
    engine: '1.4 TFSI 110kw 150hp',
    products: [
      'MANN:W712/95',
      'MANN:C27009',
      ...A38Y_ORTAK_POLEN,
      'FILTRON:OP616/3',
      'FILTRON:AP062/1',
    ],
  },

  // ── A6 (4B/C5) ───────────────────────────────────────────────────────────
  { model: A6C5, engine: '2.5 TDI V6 114kw 155hp', products: A6C5_25TDI },
  { model: A6C5, engine: '2.5 TDI V6 120kw 163hp', products: A6C5_25TDI },
  { model: A6C5, engine: '2.5 TDI V6 132kw 180hp', products: A6C5_25TDI },

  // ── Q7 (4M) ──────────────────────────────────────────────────────────────
  // 160kw ve 200kw sayfalarında yakıt filtresi PU10010z, 183kw'da PU10011z.
  // İki ayrı üründür; sayfalarda böyle listeleniyor, birleştirilmedi.
  {
    model: Q74M,
    engine: '3.0 TDI quattro 160kw 218hp',
    products: ['MANN:HU7012z', 'MANN:C38011', 'MANN:PU10010z', ...Q74M_POLEN],
  },
  {
    model: Q74M,
    engine: '3.0 TDI quattro 183kw 249hp',
    products: ['MANN:HU7012z', 'MANN:C38011', 'MANN:PU10011z', ...Q74M_POLEN],
  },
  {
    model: Q74M,
    engine: '3.0 TDI quattro 200kw 272hp',
    products: ['MANN:HU7012z', 'MANN:C38011', 'MANN:PU10010z', ...Q74M_POLEN],
  },
  {
    model: Q74M,
    engine: '2.0 TFSI quattro 185kw 252hp',
    products: ['MANN:HU6013z', 'MANN:C38011', ...Q74M_POLEN],
  },
  { model: Q74M, engine: '55 TFSI e Quattro 280kw 381hp', products: Q74M_TFSI_E },
  { model: Q74M, engine: '55 TFSI Mild Hybrid 250kw 340hp', products: Q74M_TFSI_E },
  { model: Q74M, engine: '60 TFSI e Quattro 335kw 455hp', products: Q74M_TFSI_E },

  // ── Q8 (4M) ──────────────────────────────────────────────────────────────
  // Q7'nin aynı motorundan farkı: sayfada İKİ yakıt filtresi birden listeli.
  { model: Q84M, engine: '3.0 TDI quattro 183kw 249hp', products: Q84M_30TDI },
  { model: Q84M, engine: '45 TDI 3.0 quattro 170kw 231hp', products: Q84M_30TDI },
  { model: Q84M, engine: '50 TDI 3.0 quattro 210kw 286hp', products: Q84M_30TDI },
  {
    model: Q84M,
    engine: '45 TFSI 180kw 245hp',
    products: ['MANN:HU6013z', 'MANN:C38011', ...Q74M_POLEN, 'FILTRON:OE688/5'],
  },
  { model: Q84M, engine: '55 TFSI e 280kw 381hp', products: Q74M_TFSI_E },
  { model: Q84M, engine: '60 TFSI e 340kw 462hp', products: Q74M_TFSI_E },

  // ── TT I (8N) ────────────────────────────────────────────────────────────
  { model: TT8N, engine: '1.8 20V Sport Turbo 177kw 240hp', products: TT8N_TAM },
  { model: TT8N, engine: '1.8 20V Turbo 140kw 190hp', products: TT8N_TAM },
  { model: TT8N, engine: '1.8 Turbo 110kw 150hp', products: TT8N_TAM },
  { model: TT8N, engine: '1.8 Turbo 120kw 163hp', products: TT8N_TAM },

  // ── A3 (8L) ──────────────────────────────────────────────────────────────
  // 1.6 benzinli: TT I (8N) listesinin aynısı + şanzuman filtresi + PP836/1.
  {
    model: A38L,
    engine: '1.6 75kw 102hp',
    products: [...TT8N_TAM, 'MANN:H2019KIT', 'FILTRON:PP836/1'],
  },
  { model: A38L, engine: '1.9 TDI 74kw 100hp', products: A38L_19TDI },
  { model: A38L, engine: '1.9 TDI 96kw 130hp', products: A38L_19TDI },

  // ── A8 (4N) ──────────────────────────────────────────────────────────────
  {
    model: A84N,
    engine: '45 TDI 3.0 quattro 183kw 249hp',
    products: [
      'MANN:HU7012z',
      'MANN:PU7008zKIT',
      ...A84N_POLEN,
      'FILTRON:OE650/8',
      'FILTRON:PE993/5',
    ],
  },
  {
    model: A84N,
    engine: '50 TDI 3.0 quattro 210kw 286hp',
    products: ['MANN:HU7012z', ...A84N_POLEN],
  },
  {
    model: A84N,
    engine: '60 TFSI 3.0 e quattro 330kw 449hp',
    products: ['MANN:HU7049z', ...A84N_POLEN, 'FILTRON:OE688/4'],
  },
  // 60 TDI MH sayfasındaki İKİ yakıt filtresi kartında kod GÖRÜNMÜYOR ve
  // fiyatları (1.354,16 · 1.242,93) kataloğun hiçbir ürünüyle tutmuyor;
  // AUDI_MISSING_CODE'a alındı, tahmin edilmedi.
  {
    model: A84N,
    engine: '60 TDI 4.0 Mild Hybrid quattro 320kw 435hp',
    products: ['MANN:HU9011z', ...A84N_POLEN],
  },

  // ── A8 (4E) ──────────────────────────────────────────────────────────────
  {
    model: A84E,
    engine: '3.0 V6 TDI 171kw 233hp',
    products: [
      'MANN:HU8001x',
      'MANN:HU831x',
      'MANN:C1652/1',
      'MANN:CUK4136',
      'MANN:WK1136',
      'FILTRON:OE650/3',
      'FILTRON:OE650/6',
      'FILTRON:AR371/1',
      'FILTRON:K1118A',
      'FILTRON:PP986/3',
    ],
  },
  {
    model: A84E,
    engine: '3.0 V6 162kw 220hp',
    products: [
      'MANN:W930/21',
      'MANN:C1652',
      'MANN:CUK4136',
      'MANN:WK730/1',
      'FILTRON:OP526/5',
      'FILTRON:AR371',
      'FILTRON:K1118A',
      'FILTRON:PP836/1',
    ],
  },
  {
    model: A84E,
    engine: '3.2 FSI 191kw 260hp',
    products: [
      'MANN:HU7029z',
      'MANN:C1652',
      'MANN:CUK4136',
      'MANN:WK720/4',
      'FILTRON:OE671/4',
      'FILTRON:AR371',
      'FILTRON:K1118A',
      'FILTRON:PP836/6',
    ],
  },

  // ── A6 (4A) ──────────────────────────────────────────────────────────────
  // Polen beşlisi A8 (4N) ile ortak. 45 TFSI sayfasında bu beşin kartları
  // kırpıktı; AYNI MODELİN 45 TDI sayfası kodları açık gösteriyor ve fiyatlar
  // birebir tutuyor (878,14 · 1.315,02 · 1.736,61 · 498,97 · 598,76).
  {
    model: A64A,
    engine: '45 TFSI 2.0 quattro 180kw 245hp',
    products: ['MANN:HU6013z', ...A84N_POLEN],
  },
  {
    model: A64A,
    engine: '45 TDI 3.0 quattro 170kw 231hp',
    products: ['MANN:HU7012z', ...A84N_POLEN],
  },
  {
    model: A64A,
    engine: '50 TDI 3.0 quattro 210kw 286hp',
    products: ['MANN:HU7012z', ...A84N_POLEN],
  },
  // 40 TDI sayfasında yağ filtresi listelenmiyor — beş polen kartı var, o kadar.
  { model: A64A, engine: '40 TDI 2.0 150kw 204hp', products: [...A84N_POLEN] },

  // ── A4 (8D, B5) ──────────────────────────────────────────────────────────
  {
    model: A48D,
    engine: '1.9 TDI 85kw 115hp',
    products: [
      'MANN:HU726/2x',
      'MANN:C26168',
      'MANN:CU3955',
      'MANN:CUK3955',
      'MANN:WK842/11',
      'MANN:H2019KIT1',
      'FILTRON:OE640/1',
      'FILTRON:K1004',
      'FILTRON:K1004A',
      'FILTRON:AP063/1',
      'FILTRON:PP850/2',
    ],
  },
  {
    model: A48D,
    engine: '1.6 75kw 102hp',
    products: [
      'MANN:W719/30',
      'MANN:C26168',
      'MANN:CU3955',
      'MANN:CUK3955',
      'MANN:WK830/7',
      'MANN:H2019KIT1',
      'FILTRON:OP526/1',
      'FILTRON:K1004',
      'FILTRON:K1004A',
      'FILTRON:AP063/1',
    ],
  },

  // ── A1 (GB) ──────────────────────────────────────────────────────────────
  {
    model: A1GB,
    engine: '30 TFSI 1.0 81 kW 110 HP',
    products: [
      'MANN:W712/95',
      'MANN:H6003z',
      'MANN:C28043',
      'MANN:CU26021',
      'MANN:CUK26021',
      'FILTRON:OP616/3',
      'FILTRON:K1388',
      'FILTRON:K1388A',
    ],
  },
  {
    model: A1GB,
    engine: '40 TFSI 2.0 152 kW 207 HP',
    products: [
      'MANN:HU6013z',
      'MANN:H6003z',
      'MANN:C30005',
      'MANN:CU26021',
      'MANN:CUK26021',
      'FILTRON:OE688/5',
      'FILTRON:K1388',
      'FILTRON:AP139/5',
    ],
  },

  // ── Q8 E-Tron (GET, GEG) ─────────────────────────────────────────────────
  // Üç sayfada da BEŞ polen kartının kodu kırpık ve bu modelin kodu açık
  // sayfası YOK. Beş fiyatın tamamı (877,10 · 1.315,64 · 1.710,37 · 517,86 ·
  // 620,97) A8 (4N) 45 TDI'nin kodu açık polen beşlisiyle birebir tutuyor —
  // marka sırası ve kategoriler de aynı. Usta onayıyla eşleştirildi.
  // NOT: E-Tron (GE) E-TRON 230kw sayfası bu beşliyi KODLARI AÇIK gösteriyor
  // ve fiyatlar birebir aynı — Q8 e-tron eşleştirmesi bağımsız olarak doğrulandı.
  { model: Q8ET, engine: '50 quattro 250kw 340hp', products: [...A84N_POLEN] },
  { model: Q8ET, engine: '55 quattro 300kw 408hp', products: [...A84N_POLEN] },
  { model: Q8ET, engine: 'SQ8 quattro 370kw 503hp', products: [...A84N_POLEN] },

  // ── A8 (4D) ──────────────────────────────────────────────────────────────
  {
    model: A84D,
    engine: '2.5 TDI 131kw 180hp',
    products: [
      'MANN:HU842x',
      'MANN:C28214/1',
      'MANN:CU2949-2',
      'MANN:CUK2949-2',
      'MANN:WK823/1',
      'MANN:H2120xKIT',
      'FILTRON:OE650',
      'FILTRON:AP004/2',
      'FILTRON:K1069-2x',
      'FILTRON:K1069A-2x',
    ],
  },

  // ── E-Tron (GE) ──────────────────────────────────────────────────────────
  // E-TRON 230kw sayfasında beş polen kartının da KODU AÇIK yazıyor; fiyatlar
  // A8 (4N) ve Q8 e-tron'la birebir. S quattro sayfasında ilk üç kart kırpık,
  // fiyatlar aynı.
  { model: ETGE, engine: 'E-TRON 230kw 313hp', products: [...A84N_POLEN] },
  { model: ETGE, engine: 'S quattro 370kw 503hp', products: [...A84N_POLEN] },
  // E-Tron GT: GT quattro sayfasında yalnızca İKİ kart var, ikisi de kodsuz
  // MANN "Polen Kabin Filtresi" ve ikisi de 2.060,80 — kataloğun hiçbir
  // ürünüyle tutmuyor. AUDI_MISSING_CODE'a alındı. RS sayfası hiç gelmedi.
]

/**
 * A6 (4G) ekranlarında parça kodu GÖRÜNMEYEN kartlar — içe aktarılmadı.
 * Modelin adı ("A6 (4G2/4G5/4GC/4GD)") kart başlığındaki üç satırı tek başına
 * doldurduğu için kod kırpılıyor; MANN kartlarının ürün fotoğrafında da kod
 * yazmıyor. Fiyat eşleşmesine bakıp "herhalde şu üründür" demek yanlış parça
 * satmak demek — kaynağın kod görünen bir ekranı gerekiyor.
 */
export const AUDI_MISSING_CODE = [
  { brand: 'MANN-FILTER', label: 'Hava Filtresi', priceGross: 969.88, models: [A6G] },
  { brand: 'MANN-FILTER', label: 'Yakıt Filtresi', priceGross: 1081.29, models: [A6G] },
  { brand: 'MANN-FILTER', label: 'Yakıt Filtresi', priceGross: 1162.11, models: [A6G] },
  { brand: 'MANN-FILTER', label: 'Yakıt Filtresi', priceGross: 1363.08, models: [A6G] },
  { brand: 'MANN-FILTER', label: 'Yakıt Filtresi', priceGross: 2846.3, models: [A6G] },
  { brand: 'MANN-FILTER', label: 'Polen Kabin Filtresi', priceGross: 1515.99, models: [A6G] },
  { brand: 'MANN-FILTER', label: 'Polen Kabin Filtresi', priceGross: 1931.03, models: [A6G] },
  { brand: 'MANN-FILTER', label: 'Hava Filtresi', priceGross: 1092.21, models: [A6G] },
  { brand: 'MANN-FILTER', label: 'Yağ Filtresi', priceGross: 382.27, models: [A6G] },
  { brand: 'MANN-FILTER', label: 'Yağ Filtresi', priceGross: 482.41, models: [A6G] },
  { brand: 'MANN-FILTER', label: 'Yağ Filtresi', priceGross: 635.67, models: [A6G] },
  { brand: 'MANN-FILTER', label: 'Yağ Filtresi', priceGross: 648.77, models: [A6G] },
  // A5 (F5) 35 TFSI sayfasındaki hava filtresi: fiyatı kataloğumdaki hiçbir
  // ürünle tutmuyor (C17013 1.371,01 · bu kart 1.390,26). Eşleştirilmedi.
  { brand: 'MANN-FILTER', label: 'Hava Filtresi', priceGross: 1390.26, models: [A5F5] },
  // A8 (4N) 60 TDI MH sayfasındaki iki yakıt filtresi: kart adı kırpık, kod yok
  // ve fiyatları modelin kodu açık 45 TDI sayfasıyla da tutmuyor (orada
  // PU7008zKIT 3.045,75 · PE993/5 1.881,37). Eşleştirilmedi.
  { brand: 'MANN-FILTER', label: 'Yakıt Filtresi', priceGross: 1354.16, models: [A84N] },
  { brand: 'FILTRON', label: 'Yakıt Filtresi', priceGross: 1242.93, models: [A84N] },
  // E-Tron GT · GT quattro: sayfadaki İKİ kart da kodsuz MANN polen filtresi ve
  // ikisinin de fiyatı 2.060,80 — birbirinden bile ayırt edilemiyor.
  { brand: 'MANN-FILTER', label: 'Polen Kabin Filtresi', priceGross: 2060.8, models: [ETGT] },
  { brand: 'MANN-FILTER', label: 'Polen Kabin Filtresi', priceGross: 2060.8, models: [ETGT] },
]
