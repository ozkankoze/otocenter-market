/**
 * ════════════════════════════════════════════════════════════════════════════
 *  SUBARU ÜRÜN VERİSİ — KAYNAK TRANSKRİPSİYONU (TARAYICIDAN)
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

export const SUBARU_PRODUCTS: Record<string, SourceProduct> = {
  'FILTRON:AP121/2': {
    brand: 'FILTRON',
    code: 'AP121/2',
    category: 'HAVA_FILTRESI',
    priceGross: 468.59,
  },
  'FILTRON:AP121/3': {
    brand: 'FILTRON',
    code: 'AP121/3',
    category: 'HAVA_FILTRESI',
    priceGross: 433.88,
  },
  'FILTRON:AP121/4': {
    brand: 'FILTRON',
    code: 'AP121/4',
    category: 'HAVA_FILTRESI',
    priceGross: 485.54,
  },
  'FILTRON:K1083': {
    brand: 'FILTRON',
    code: 'K1083',
    category: 'POLEN_FILTRESI',
    priceGross: 234.3,
  },
  'FILTRON:K1183': {
    brand: 'FILTRON',
    code: 'K1183',
    category: 'POLEN_FILTRESI',
    priceGross: 247.31,
  },
  'FILTRON:K1210': {
    brand: 'FILTRON',
    code: 'K1210',
    category: 'POLEN_FILTRESI',
    priceGross: 232.13,
  },
  'FILTRON:K1217': {
    brand: 'FILTRON',
    code: 'K1217',
    category: 'POLEN_FILTRESI',
    priceGross: 397,
  },
  'FILTRON:K1281': {
    brand: 'FILTRON',
    code: 'K1281',
    category: 'POLEN_FILTRESI',
    priceGross: 531.51,
  },
  'FILTRON:K1310': {
    brand: 'FILTRON',
    code: 'K1310',
    category: 'POLEN_FILTRESI',
    priceGross: 483.54,
  },
  'FILTRON:OP595': {
    brand: 'FILTRON',
    code: 'OP595',
    category: 'YAG_FILTRESI',
    priceGross: 210.74,
  },
  'FILTRON:OP595/4': {
    brand: 'FILTRON',
    code: 'OP595/4',
    category: 'YAG_FILTRESI',
    priceGross: 265.65,
  },
  'FILTRON:OP617': {
    brand: 'FILTRON',
    code: 'OP617',
    category: 'YAG_FILTRESI',
    priceGross: 290.7,
  },
  'MANN:C2201': {
    brand: 'MANN-FILTER',
    code: 'C2201',
    category: 'HAVA_FILTRESI',
    priceGross: 720.86,
  },
  'MANN:C22038': {
    brand: 'MANN-FILTER',
    code: 'C22038',
    category: 'HAVA_FILTRESI',
    priceGross: 939.67,
  },
  'MANN:C2964': {
    brand: 'MANN-FILTER',
    code: 'C2964',
    category: 'HAVA_FILTRESI',
    priceGross: 327.66,
  },
  'MANN:C3747': {
    brand: 'MANN-FILTER',
    code: 'C3747',
    category: 'HAVA_FILTRESI',
    priceGross: 1205.8,
  },
  'MANN:CU1526': {
    brand: 'MANN-FILTER',
    code: 'CU1526',
    category: 'POLEN_FILTRESI',
    priceGross: 1256.04,
  },
  'MANN:CU1828': {
    brand: 'MANN-FILTER',
    code: 'CU1828',
    category: 'POLEN_FILTRESI',
    priceGross: 455.1,
  },
  'MANN:CU1919': {
    brand: 'MANN-FILTER',
    code: 'CU1919',
    category: 'POLEN_FILTRESI',
    priceGross: 404.12,
  },
  'MANN:CU21002-2': {
    brand: 'MANN-FILTER',
    code: 'CU21002-2',
    category: 'POLEN_FILTRESI',
    priceGross: 1922.29,
  },
  'MANN:CU2131': {
    brand: 'MANN-FILTER',
    code: 'CU2131',
    category: 'POLEN_FILTRESI',
    priceGross: 518.8,
  },
  'MANN:CU2145': {
    brand: 'MANN-FILTER',
    code: 'CU2145',
    category: 'POLEN_FILTRESI',
    priceGross: 823.53,
  },
  'MANN:CU22004': {
    brand: 'MANN-FILTER',
    code: 'CU22004',
    category: 'POLEN_FILTRESI',
    priceGross: 1022.31,
  },
  'MANN:CUK1828': {
    brand: 'MANN-FILTER',
    code: 'CUK1828',
    category: 'POLEN_FILTRESI',
    priceGross: 893.43,
  },
  'MANN:CUK1919': {
    brand: 'MANN-FILTER',
    code: 'CUK1919',
    category: 'POLEN_FILTRESI',
    priceGross: 775.47,
  },
  'MANN:CUK2131': {
    brand: 'MANN-FILTER',
    code: 'CUK2131',
    category: 'POLEN_FILTRESI',
    priceGross: 939.3,
  },
  'MANN:CUK2145': {
    brand: 'MANN-FILTER',
    code: 'CUK2145',
    category: 'POLEN_FILTRESI',
    priceGross: 1234.2,
  },
  'MANN:FP1919': {
    brand: 'MANN-FILTER',
    code: 'FP1919',
    category: 'POLEN_FILTRESI',
    priceGross: 1020.12,
  },
  'MANN:W6019': {
    brand: 'MANN-FILTER',
    code: 'W6019',
    category: 'YAG_FILTRESI',
    priceGross: 380.46,
  },
  'MANN:W67/1': {
    brand: 'MANN-FILTER',
    code: 'W67/1',
    category: 'YAG_FILTRESI',
    priceGross: 269.58,
  },
  'MANN:W7037': {
    brand: 'MANN-FILTER',
    code: 'W7037',
    category: 'YAG_FILTRESI',
    priceGross: 518.8,
  },
  'MANN:W811/80': {
    brand: 'MANN-FILTER',
    code: 'W811/80',
    category: 'YAG_FILTRESI',
    priceGross: 216.63,
  },
}

const M1 = 'Forester (SF)'
const M2 = 'Forester (SG)'
const M3 = 'Forester (SH)'
const M4 = 'Forester (SJ)'
const M5 = 'Impreza II (GD/GG)'
const M6 = 'Impreza III (G3, GH, GR)'
const M7 = 'Impreza IV (GJ, GP)'
const M8 = 'Impreza V (GK, GT)'
const M9 = 'Legacy II'
const M10 = 'Legacy III / Liberty'
const M11 = 'Legacy IV'
const M12 = 'Levorg'
const M13 = 'Outback I'
const M14 = 'Outback II'
const M15 = 'Outback III'
const M16 = 'Outback IV'
const M17 = 'Outback V'
const M18 = 'XV II (GT3/GT7/GTE)'

export const SUBARU_FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: M1,
    engine: '2.0 S-Turbo 125kw 170hp',
    products: ['FILTRON:OP595', 'MANN:C2964', 'MANN:CU1526', 'MANN:W67/1'],
  },
  {
    model: M1,
    engine: '2.0 S-Turbo 130kw 177hp',
    products: ['FILTRON:OP595', 'MANN:C2964', 'MANN:W67/1'],
  },
  {
    model: M2,
    engine: '2.0 115kw 158hp',
    products: [
      'FILTRON:AP121/2',
      'FILTRON:K1217',
      'FILTRON:OP595',
      'MANN:C2964',
      'MANN:C3747',
      'MANN:W67/1',
    ],
  },
  {
    model: M2,
    engine: '2.0 92kw 125hp',
    products: [
      'FILTRON:AP121/2',
      'FILTRON:K1217',
      'FILTRON:OP595',
      'MANN:C2964',
      'MANN:C3747',
      'MANN:W67/1',
    ],
  },
  {
    model: M2,
    engine: '2.0 S/XT-Turbo 130kw 177hp',
    products: ['FILTRON:K1217', 'FILTRON:OP595', 'MANN:C2964', 'MANN:W67/1'],
  },
  {
    model: M2,
    engine: '2.5 121kw 165hp',
    products: ['FILTRON:K1217', 'FILTRON:OP595', 'MANN:C2964', 'MANN:W67/1'],
  },
  {
    model: M2,
    engine: '2.5 RX 115kw 156hp',
    products: ['FILTRON:AP121/2', 'FILTRON:K1217', 'FILTRON:OP595', 'MANN:C3747', 'MANN:W67/1'],
  },
  {
    model: M2,
    engine: '2.5 XT-Turbo 155kw 211hp',
    products: ['FILTRON:K1217', 'FILTRON:OP595', 'MANN:C2964', 'MANN:W67/1'],
  },
  {
    model: M2,
    engine: '2.5 XT-Turbo 169kw 230hp',
    products: ['FILTRON:K1217', 'FILTRON:OP595', 'MANN:C2964', 'MANN:W67/1'],
  },
  {
    model: M3,
    engine: '2.0 16V 110kw 150hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1281',
      'FILTRON:OP595',
      'FILTRON:OP595/4',
      'MANN:C2201',
      'MANN:CU22004',
      'MANN:W6019',
      'MANN:W67/1',
    ],
  },
  {
    model: M3,
    engine: '2.0 Diesel 108kw 147hp',
    products: ['FILTRON:AP121/3', 'FILTRON:K1281', 'MANN:C2201', 'MANN:CU22004', 'MANN:W7037'],
  },
  {
    model: M3,
    engine: '2.5 X 126kw 171hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1281',
      'FILTRON:OP595',
      'FILTRON:OP595/4',
      'MANN:C2201',
      'MANN:CU22004',
      'MANN:W6019',
      'MANN:W67/1',
    ],
  },
  {
    model: M3,
    engine: '2.5 XT 169kw 230hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1281',
      'FILTRON:OP595',
      'MANN:C2201',
      'MANN:CU22004',
      'MANN:W67/1',
    ],
  },
  {
    model: M4,
    engine: '2.0 110kw 150hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1281',
      'FILTRON:OP595/4',
      'MANN:C2201',
      'MANN:CU22004',
      'MANN:W6019',
    ],
  },
  {
    model: M4,
    engine: '2.0 Diesel 108kw 147hp',
    products: ['FILTRON:AP121/3', 'FILTRON:K1281', 'MANN:C2201', 'MANN:CU22004', 'MANN:W7037'],
  },
  {
    model: M5,
    engine: '1.5 R 77kw 105hp',
    products: ['FILTRON:OP595', 'MANN:C2964', 'MANN:CU2145', 'MANN:CUK2145', 'MANN:W67/1'],
  },
  {
    model: M5,
    engine: '1.6 70kw 95hp',
    products: [
      'FILTRON:AP121/2',
      'FILTRON:OP595',
      'MANN:C3747',
      'MANN:CU2145',
      'MANN:CUK2145',
      'MANN:W67/1',
    ],
  },
  {
    model: M5,
    engine: '2.0 GX 92kw 125hp',
    products: [
      'FILTRON:AP121/2',
      'FILTRON:OP595',
      'MANN:C3747',
      'MANN:CU2145',
      'MANN:CUK2145',
      'MANN:W67/1',
    ],
  },
  {
    model: M5,
    engine: '2.0 R 118kw 160hp',
    products: ['FILTRON:OP595', 'MANN:C2964', 'MANN:CU2145', 'MANN:CUK2145', 'MANN:W67/1'],
  },
  {
    model: M5,
    engine: '2.0 WRX 160kw 218hp',
    products: ['FILTRON:OP595', 'MANN:C2964', 'MANN:CU2145', 'MANN:CUK2145', 'MANN:W67/1'],
  },
  {
    model: M5,
    engine: '2.0 WRX 165kw 225hp',
    products: ['FILTRON:OP595', 'MANN:C2964', 'MANN:CU2145', 'MANN:CUK2145', 'MANN:W67/1'],
  },
  {
    model: M5,
    engine: '2.0 WRX STI 195kw 265hp',
    products: ['FILTRON:OP595', 'MANN:C2964', 'MANN:CU2145', 'MANN:CUK2145', 'MANN:W67/1'],
  },
  {
    model: M5,
    engine: '2.5 WRX 169kw 230hp',
    products: ['FILTRON:OP595', 'MANN:C2964', 'MANN:CU2145', 'MANN:CUK2145', 'MANN:W67/1'],
  },
  {
    model: M5,
    engine: '2.5 WRX STI 206kw 280hp',
    products: ['FILTRON:OP595', 'MANN:C2964', 'MANN:CU2145', 'MANN:CUK2145', 'MANN:W67/1'],
  },
  {
    model: M6,
    engine: '1.5 16V 79kw 107hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1281',
      'FILTRON:OP595',
      'MANN:C2201',
      'MANN:CU22004',
      'MANN:W67/1',
    ],
  },
  {
    model: M6,
    engine: '2.0 16V 110kw 150hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1281',
      'FILTRON:OP595',
      'MANN:C2201',
      'MANN:CU22004',
      'MANN:W67/1',
    ],
  },
  {
    model: M6,
    engine: '2.0 Diesel 110kw 150hp',
    products: ['FILTRON:AP121/3', 'FILTRON:K1281', 'MANN:C2201', 'MANN:CU22004', 'MANN:W7037'],
  },
  {
    model: M6,
    engine: '2.0 Diesel 80kw 109hp',
    products: ['FILTRON:AP121/3', 'FILTRON:K1281', 'MANN:C2201', 'MANN:CU22004', 'MANN:W7037'],
  },
  {
    model: M6,
    engine: '2.5 169kw 230hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1281',
      'FILTRON:OP595',
      'MANN:C2201',
      'MANN:CU22004',
      'MANN:W67/1',
    ],
  },
  {
    model: M7,
    engine: '1.6 84kw 114hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1281',
      'FILTRON:OP595/4',
      'MANN:C2201',
      'MANN:CU22004',
      'MANN:W6019',
    ],
  },
  {
    model: M7,
    engine: '2.0 110kw 150hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1281',
      'FILTRON:OP595/4',
      'MANN:C2201',
      'MANN:CU22004',
      'MANN:W6019',
    ],
  },
  {
    model: M8,
    engine: '1.6i 84kw 114hp',
    products: ['FILTRON:OP595/4', 'MANN:W6019'],
  },
  {
    model: M8,
    engine: '2.0 e-BOXER Hybrid 110kw 150hp',
    products: ['FILTRON:K1310', 'FILTRON:OP595/4', 'MANN:W6019'],
  },
  {
    model: M8,
    engine: '2.0i 113kw 154hp',
    products: ['FILTRON:OP595/4', 'MANN:W6019'],
  },
  {
    model: M8,
    engine: '2.0i 115kw 156hp',
    products: ['FILTRON:OP595/4', 'MANN:W6019'],
  },
  {
    model: M10,
    engine: '2.0 16V 101kw 138hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1083',
      'FILTRON:K1183',
      'FILTRON:OP595',
      'MANN:C2201',
      'MANN:CU1828',
      'MANN:CU2131',
      'MANN:CUK1828',
      'MANN:CUK2131',
      'MANN:W67/1',
    ],
  },
  {
    model: M10,
    engine: '2.0 16V 110kw 150hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1083',
      'FILTRON:K1183',
      'FILTRON:OP595',
      'MANN:C2201',
      'MANN:CU1828',
      'MANN:CU2131',
      'MANN:CUK1828',
      'MANN:CUK2131',
      'MANN:W67/1',
    ],
  },
  {
    model: M10,
    engine: '2.0 16V 120kw 165hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1083',
      'FILTRON:K1183',
      'FILTRON:OP595',
      'MANN:C2201',
      'MANN:CU1828',
      'MANN:CU2131',
      'MANN:CUK1828',
      'MANN:CUK2131',
      'MANN:W67/1',
    ],
  },
  {
    model: M10,
    engine: '2.0 Diesel 110kw 150hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1183',
      'MANN:C2201',
      'MANN:CU1828',
      'MANN:CUK1828',
      'MANN:CUK2131',
      'MANN:W7037',
    ],
  },
  {
    model: M9,
    engine: '2.0 92kw 125hp',
    products: ['FILTRON:AP121/2', 'FILTRON:OP595', 'MANN:C3747', 'MANN:CU21002-2', 'MANN:W67/1'],
  },
  {
    model: M11,
    engine: '2.0 Diesel 110kw 150hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1210',
      'MANN:C2201',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:W7037',
    ],
  },
  {
    model: M11,
    engine: '2.0i 110kw 150hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1210',
      'FILTRON:OP595',
      'FILTRON:OP595/4',
      'MANN:C2201',
      'MANN:CU1919',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:W6019',
      'MANN:W67/1',
    ],
  },
  {
    model: M11,
    engine: '2.5 GT 195kw 265hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1210',
      'FILTRON:OP595',
      'MANN:C2201',
      'MANN:CU1919',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:W67/1',
    ],
  },
  {
    model: M11,
    engine: '2.5i 123kw 167hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1210',
      'FILTRON:OP595',
      'MANN:C2201',
      'MANN:CU1919',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:W67/1',
    ],
  },
  {
    model: M11,
    engine: '2.5i 127kw 173hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1210',
      'FILTRON:OP595/4',
      'MANN:C2201',
      'MANN:CU1919',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:W6019',
    ],
  },
  {
    model: M12,
    engine: '1.6 125kw 170hp',
    products: ['FILTRON:AP121/3', 'FILTRON:K1281', 'MANN:C2201', 'MANN:CU22004'],
  },
  {
    model: M15,
    engine: '2.0D 110kw 150hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1210',
      'MANN:C2201',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:W7037',
    ],
  },
  {
    model: M15,
    engine: '2.5i 123kw 167hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1210',
      'FILTRON:OP595',
      'MANN:C2201',
      'MANN:CU1919',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:W67/1',
    ],
  },
  {
    model: M15,
    engine: '2.5i 127kw 173hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1210',
      'FILTRON:OP595/4',
      'MANN:C2201',
      'MANN:CU1919',
      'MANN:CUK1919',
      'MANN:FP1919',
      'MANN:W6019',
    ],
  },
  {
    model: M14,
    engine: '2.0 Diesel 110kw 150hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1183',
      'MANN:C2201',
      'MANN:CU1828',
      'MANN:CUK1828',
      'MANN:CUK2131',
      'MANN:W7037',
    ],
  },
  {
    model: M14,
    engine: '2.5 16V 121kw 165hp',
    products: [
      'FILTRON:AP121/3',
      'FILTRON:K1083',
      'FILTRON:K1183',
      'FILTRON:OP595',
      'MANN:C2201',
      'MANN:CU1828',
      'MANN:CU2131',
      'MANN:CUK1828',
      'MANN:CUK2131',
      'MANN:W67/1',
    ],
  },
  {
    model: M16,
    engine: '2.0 D 110kw 150hp',
    products: ['FILTRON:AP121/3', 'MANN:C2201', 'MANN:W7037'],
  },
  {
    model: M16,
    engine: '2.5 129kw 175hp',
    products: ['FILTRON:AP121/3', 'FILTRON:OP595/4', 'MANN:C2201', 'MANN:W6019'],
  },
  {
    model: M13,
    engine: '2.5 115kw 156hp',
    products: ['FILTRON:AP121/2', 'FILTRON:OP595', 'MANN:C3747', 'MANN:CU21002-2', 'MANN:W67/1'],
  },
  {
    model: M13,
    engine: '3.0 H6 154kw 209hp',
    products: ['FILTRON:OP617', 'MANN:C2964', 'MANN:CU21002-2', 'MANN:W811/80'],
  },
  {
    model: M17,
    engine: '2.5 129kw 175hp',
    products: ['FILTRON:AP121/4', 'FILTRON:K1310', 'FILTRON:OP595/4', 'MANN:C22038', 'MANN:W6019'],
  },
  {
    model: M18,
    engine: '2.0i e-Boxer 110kw 150hp',
    products: ['FILTRON:AP121/4', 'FILTRON:OP595/4', 'MANN:C22038', 'MANN:W6019'],
  },
]

/** Parça kodu görünmeyen ürün YOK. */
export const SUBARU_MISSING_CODE: Array<{
  brand: string
  label: string
  priceGross: number
  models: string[]
}> = []
