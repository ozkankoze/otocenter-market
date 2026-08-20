/**
 * ════════════════════════════════════════════════════════════════════════════
 *  ALFA ROMEO ÜRÜN VERİSİ — KAYNAK TRANSKRİPSİYONU
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  KAYNAK: Kullanıcının sağladığı katalog ekran görüntüleri (2026-08),
 *  "Stoktakiler" filtresi işaretli hâlde alınmış motor sayfaları.
 *
 *  BU DOSYA HAM VERİDİR — üretilmiş hiçbir bilgi içermez.
 *  Açıklama, SEO metni ve slug gibi türetilen alanlar içe aktarma dosyasını
 *  üreten betikte (scripts/urun-import-uret.ts) hesaplanır.
 *
 *  ⚠ FİYATLAR EKRANDAKİ HÂLİYLE, YANİ KDV DAHİL yazılmıştır.
 *  İçe aktarma şablonu KDV HARİÇ fiyat ister; dönüşümü üretici betik yapar.
 *  Burada ham değeri saklamak, ekran görüntüsüyle satır satır karşılaştırma
 *  yapılabilmesi içindir.
 *
 *  ⚠ OEM NUMARASI YOK. Liste sayfalarında görünmüyor; katalog tamamlandıktan
 *  sonra ayrıca toplanacak. Uydurulmaz.
 *
 *  ⚠ TEKNİK ÖLÇÜ (yükseklik, çap, diş) YOK. Uydurulmaz.
 */

export type ProductBrand = 'MANN-FILTER' | 'FILTRON'
export type CategoryCode =
  | 'YAG_FILTRESI'
  | 'HAVA_FILTRESI'
  | 'POLEN_FILTRESI'
  | 'YAKIT_FILTRESI'
  | 'SANZUMAN_FILTRESI'
  | 'DIREKSIYON_FILTRESI'
  | 'KARTER_HAVALANDIRMA'
  | 'KURUTUCU_FILTRE'
  | 'IC_HAVA_FILTRESI'
  | 'AD_BLUE_FILTRESI'

export type SourceProduct = {
  brand: ProductBrand
  /** Parça kodu — kaynaktaki yazımıyla */
  code: string
  category: CategoryCode
  /** Ekranda görünen fiyat (KDV DAHİL, TL) */
  priceGross: number
}

/**
 * Anahtar biçimi: 'MANN:W714/4' · 'FILTRON:PP968'
 * Aynı parça kodu birden çok motorda geçse de burada TEK kayıt vardır —
 * ürün ile uyumluluk ayrı katmanlardır.
 */
export const PRODUCTS: Record<string, SourceProduct> = {
  'MANN:W7030': {
    brand: 'MANN-FILTER',
    code: 'W7030',
    category: 'YAG_FILTRESI',
    priceGross: 470.81,
  },
  'MANN:HU713/1x': {
    brand: 'MANN-FILTER',
    code: 'HU713/1x',
    category: 'YAG_FILTRESI',
    priceGross: 224.99,
  },
  'MANN:C36031': {
    brand: 'MANN-FILTER',
    code: 'C36031',
    category: 'HAVA_FILTRESI',
    priceGross: 1011.4,
  },
  'MANN:C21106': {
    brand: 'MANN-FILTER',
    code: 'C21106',
    category: 'HAVA_FILTRESI',
    priceGross: 629.11,
  },
  'MANN:CUK32008': {
    brand: 'MANN-FILTER',
    code: 'CUK32008',
    category: 'POLEN_FILTRESI',
    priceGross: 872.29,
  },
  'MANN:CU2243': {
    brand: 'MANN-FILTER',
    code: 'CU2243',
    category: 'POLEN_FILTRESI',
    priceGross: 506.78,
  },
  'MANN:FP2243': {
    brand: 'MANN-FILTER',
    code: 'FP2243',
    category: 'POLEN_FILTRESI',
    priceGross: 1644.87,
  },
  'MANN:WK5027': {
    brand: 'MANN-FILTER',
    code: 'WK5027',
    category: 'YAKIT_FILTRESI',
    priceGross: 737.5,
  },
  'FILTRON:OP644/2': {
    brand: 'FILTRON',
    code: 'OP644/2',
    category: 'YAG_FILTRESI',
    priceGross: 461.85,
  },
  'FILTRON:AP098/4': {
    brand: 'FILTRON',
    code: 'AP098/4',
    category: 'HAVA_FILTRESI',
    priceGross: 1320.81,
  },
  'FILTRON:K1417': {
    brand: 'FILTRON',
    code: 'K1417',
    category: 'POLEN_FILTRESI',
    priceGross: 553.85,
  },
  'FILTRON:PP829/2': {
    brand: 'FILTRON',
    code: 'PP829/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 721.12,
  },
  // ── MANN-FILTER ───────────────────────────────────────────────────────────
  'MANN:W714/4': {
    brand: 'MANN-FILTER',
    code: 'W714/4',
    category: 'YAG_FILTRESI',
    priceGross: 364.08,
  },
  'MANN:W7003': {
    brand: 'MANN-FILTER',
    code: 'W7003',
    category: 'YAG_FILTRESI',
    priceGross: 478.76,
  },
  'MANN:HU712/11x': {
    brand: 'MANN-FILTER',
    code: 'HU712/11x',
    category: 'YAG_FILTRESI',
    priceGross: 309.47,
  },
  'MANN:HU711/4x': {
    brand: 'MANN-FILTER',
    code: 'HU711/4x',
    category: 'YAG_FILTRESI',
    priceGross: 466.02,
  },
  'MANN:HU8006z': {
    brand: 'MANN-FILTER',
    code: 'HU8006z',
    category: 'YAG_FILTRESI',
    priceGross: 642.18,
  },
  'MANN:W79': { brand: 'MANN-FILTER', code: 'W79', category: 'YAG_FILTRESI', priceGross: 275.85 },

  'MANN:C1589/3': {
    brand: 'MANN-FILTER',
    code: 'C1589/3',
    category: 'HAVA_FILTRESI',
    priceGross: 1055.07,
  },
  'MANN:C18003': {
    brand: 'MANN-FILTER',
    code: 'C18003',
    category: 'HAVA_FILTRESI',
    priceGross: 976.44,
  },
  'MANN:C21002': {
    brand: 'MANN-FILTER',
    code: 'C21002',
    category: 'HAVA_FILTRESI',
    priceGross: 789.47,
  },
  'MANN:C31028': {
    brand: 'MANN-FILTER',
    code: 'C31028',
    category: 'HAVA_FILTRESI',
    priceGross: 708.12,
  },

  'MANN:CUK1820-2': {
    brand: 'MANN-FILTER',
    code: 'CUK1820-2',
    category: 'POLEN_FILTRESI',
    priceGross: 742.7,
  },
  'MANN:CU2951': {
    brand: 'MANN-FILTER',
    code: 'CU2951',
    category: 'POLEN_FILTRESI',
    priceGross: 928.38,
  },
  'MANN:CUK2951': {
    brand: 'MANN-FILTER',
    code: 'CUK2951',
    category: 'POLEN_FILTRESI',
    priceGross: 1240.75,
  },
  'MANN:CU2232/1': {
    brand: 'MANN-FILTER',
    code: 'CU2232/1',
    category: 'POLEN_FILTRESI',
    priceGross: 1048.52,
  },
  'MANN:CUK2232/1': {
    brand: 'MANN-FILTER',
    code: 'CUK2232/1',
    category: 'POLEN_FILTRESI',
    priceGross: 1319.39,
  },

  'MANN:WK854/5': {
    brand: 'MANN-FILTER',
    code: 'WK854/5',
    category: 'YAKIT_FILTRESI',
    priceGross: 1553.12,
  },
  'MANN:WK854/3': {
    brand: 'MANN-FILTER',
    code: 'WK854/3',
    category: 'YAKIT_FILTRESI',
    priceGross: 1625.21,
  },
  'MANN:PU7005': {
    brand: 'MANN-FILTER',
    code: 'PU7005',
    category: 'YAKIT_FILTRESI',
    priceGross: 1717.12,
  },

  // ── FILTRON ───────────────────────────────────────────────────────────────
  'FILTRON:OP537/1': {
    brand: 'FILTRON',
    code: 'OP537/1',
    category: 'YAG_FILTRESI',
    priceGross: 260.33,
  },
  'FILTRON:OP537/2': {
    brand: 'FILTRON',
    code: 'OP537/2',
    category: 'YAG_FILTRESI',
    priceGross: 227.79,
  },
  'FILTRON:OE648/5': {
    brand: 'FILTRON',
    code: 'OE648/5',
    category: 'YAG_FILTRESI',
    priceGross: 286.36,
  },
  'FILTRON:OE682/2': {
    brand: 'FILTRON',
    code: 'OE682/2',
    category: 'YAG_FILTRESI',
    priceGross: 264.67,
  },
  'FILTRON:OE682/3': {
    brand: 'FILTRON',
    code: 'OE682/3',
    category: 'YAG_FILTRESI',
    priceGross: 430.07,
  },
  'FILTRON:OP643/4': {
    brand: 'FILTRON',
    code: 'OP643/4',
    category: 'YAG_FILTRESI',
    priceGross: 221.82,
  },

  'FILTRON:AR348/1': {
    brand: 'FILTRON',
    code: 'AR348/1',
    category: 'HAVA_FILTRESI',
    priceGross: 470.76,
  },
  'FILTRON:AP022/9': {
    brand: 'FILTRON',
    code: 'AP022/9',
    category: 'HAVA_FILTRESI',
    priceGross: 470.14,
  },

  'FILTRON:K1035': {
    brand: 'FILTRON',
    code: 'K1035',
    category: 'POLEN_FILTRESI',
    priceGross: 201.76,
  },
  'FILTRON:K1335': {
    brand: 'FILTRON',
    code: 'K1335',
    category: 'POLEN_FILTRESI',
    priceGross: 323.46,
  },
  'FILTRON:K1335A': {
    brand: 'FILTRON',
    code: 'K1335A',
    category: 'POLEN_FILTRESI',
    priceGross: 524.04,
  },

  'FILTRON:PP968': {
    brand: 'FILTRON',
    code: 'PP968',
    category: 'YAKIT_FILTRESI',
    priceGross: 494.63,
  },
  'FILTRON:PP968/1': {
    brand: 'FILTRON',
    code: 'PP968/1',
    category: 'YAKIT_FILTRESI',
    priceGross: 815.7,
  },
  'FILTRON:PP966/3': {
    brand: 'FILTRON',
    code: 'PP966/3',
    category: 'YAKIT_FILTRESI',
    priceGross: 1227.89,
  },
  'FILTRON:PE982/2': {
    brand: 'FILTRON',
    code: 'PE982/2',
    category: 'YAKIT_FILTRESI',
    priceGross: 1368.8,
  },
}

/**
 * Motor → o motorda listelenen ürünler.
 *
 * `model` ve `engine` değerleri araç ağacındaki (arac-agaci.ts / arac-motorlari.ts)
 * adlarla BİREBİR aynı olmalıdır; üretici betik eşleşmeyeni yüksek sesle bildirir.
 */
export const FITMENT: Array<{ model: string; engine: string; products: string[] }> = [
  {
    model: '156',
    engine: '1.9 JTD 85kw 115hp',
    products: [
      'MANN:W714/4',
      'MANN:CUK1820-2',
      'MANN:C1589/3',
      'MANN:CU2951',
      'MANN:CUK2951',
      'MANN:WK854/5',
      'FILTRON:K1035',
      'FILTRON:AR348/1',
      'FILTRON:PP968',
      'FILTRON:PP968/1',
    ],
  },
  {
    model: '156',
    engine: '1.9 JTD 16V 103kw 140hp',
    products: [
      'MANN:W7003',
      'MANN:CUK1820-2',
      'MANN:C1589/3',
      'MANN:WK854/5',
      'MANN:WK854/3',
      'FILTRON:OP537/2',
      'FILTRON:AR348/1',
      'FILTRON:PP968/1',
    ],
  },
  {
    model: '156',
    engine: '1.9 JTD 81kw 110hp',
    products: [
      'MANN:W714/4',
      'MANN:C1589/3',
      'MANN:CU2951',
      'MANN:CUK2951',
      'FILTRON:K1035',
      'FILTRON:AR348/1',
      'FILTRON:PP968',
    ],
  },
  {
    model: '156',
    engine: '1.8 16V T.Spark 103kw 140hp',
    products: [
      'MANN:CUK1820-2',
      'MANN:C1589/3',
      'MANN:CU2951',
      'MANN:CUK2951',
      'FILTRON:OP537/1',
      'FILTRON:K1035',
      'FILTRON:AR348/1',
    ],
  },
  {
    model: '156',
    engine: '1.9 JTD 16V 110kw 150hp',
    products: [
      'MANN:W7003',
      'MANN:CUK1820-2',
      'MANN:C1589/3',
      'MANN:WK854/5',
      'FILTRON:OP537/2',
      'FILTRON:AR348/1',
      'FILTRON:PP968/1',
    ],
  },
  {
    model: '156',
    engine: '1.9 JTD 93kw 126hp',
    products: [
      'MANN:W7003',
      'MANN:CUK1820-2',
      'MANN:C1589/3',
      'MANN:WK854/5',
      'FILTRON:OP537/2',
      'FILTRON:AR348/1',
      'FILTRON:PP968/1',
    ],
  },
  {
    model: '156',
    engine: '2.0 16V T.Spark 110kw 150hp',
    products: [
      'MANN:CUK1820-2',
      'MANN:C1589/3',
      'MANN:CU2951',
      'MANN:CUK2951',
      'FILTRON:OP537/1',
      'FILTRON:K1035',
      'FILTRON:AR348/1',
    ],
  },

  // 159'un dört motorunda da aynı liste görünüyor — kaynakta böyle.
  {
    model: '159',
    engine: '1.9 JTDM 16V 100kw 136hp',
    products: [
      'MANN:HU712/11x',
      'MANN:HU711/4x',
      'MANN:C18003',
      'MANN:CU2232/1',
      'MANN:CUK2232/1',
      'FILTRON:OE648/5',
      'FILTRON:OE682/2',
      'FILTRON:PP966/3',
    ],
  },
  {
    model: '159',
    engine: '1.9 JTDM 16V 110kw 150hp',
    products: [
      'MANN:HU712/11x',
      'MANN:HU711/4x',
      'MANN:C18003',
      'MANN:CU2232/1',
      'MANN:CUK2232/1',
      'FILTRON:OE648/5',
      'FILTRON:OE682/2',
      'FILTRON:PP966/3',
    ],
  },
  {
    model: '159',
    engine: '1.9 JTDM 8V 85kw 116hp',
    products: [
      'MANN:HU712/11x',
      'MANN:HU711/4x',
      'MANN:C18003',
      'MANN:CU2232/1',
      'MANN:CUK2232/1',
      'FILTRON:OE648/5',
      'FILTRON:OE682/2',
      'FILTRON:PP966/3',
    ],
  },
  {
    model: '159',
    engine: '1.9 JTDM 8V 88kw 120hp',
    products: [
      'MANN:HU712/11x',
      'MANN:HU711/4x',
      'MANN:C18003',
      'MANN:CU2232/1',
      'MANN:CUK2232/1',
      'FILTRON:OE648/5',
      'FILTRON:OE682/2',
      'FILTRON:PP966/3',
    ],
  },

  {
    model: 'Tonale (965)',
    engine: '1.6 VGT-D 96kw 131hp',
    products: [
      'MANN:HU8006z',
      'MANN:C21002',
      'MANN:PU7005',
      'FILTRON:K1335',
      'FILTRON:OE682/3',
      'FILTRON:K1335A',
      'FILTRON:PE982/2',
    ],
  },
  {
    model: 'Tonale (965)',
    engine: '1.3 Hybrid 140kw 190hp',
    products: [
      'MANN:W79',
      'MANN:C31028',
      'FILTRON:OP643/4',
      'FILTRON:K1335',
      'FILTRON:AP022/9',
      'FILTRON:K1335A',
    ],
  },
  {
    model: 'Tonale (965)',
    engine: '1.3 Hybrid 202kw 275hp',
    products: [
      'MANN:W79',
      'MANN:C31028',
      'FILTRON:OP643/4',
      'FILTRON:K1335',
      'FILTRON:AP022/9',
      'FILTRON:K1335A',
    ],
  },
  {
    model: 'Tonale (965)',
    engine: '1.5 Mild Hybrid 118kw 160hp',
    products: [
      'MANN:W79',
      'MANN:C31028',
      'FILTRON:OP643/4',
      'FILTRON:K1335',
      'FILTRON:AP022/9',
      'FILTRON:K1335A',
    ],
  },
  {
    model: 'Tonale (965)',
    engine: '1.5 Mild Hybrid 96kw 131hp',
    products: [
      'MANN:W79',
      'MANN:C31028',
      'FILTRON:OP643/4',
      'FILTRON:K1335',
      'FILTRON:AP022/9',
      'FILTRON:K1335A',
    ],
  },
  {
    model: 'Stelvio (949)',
    engine: '2.0 Q4 184kw 250hp',
    products: [
      'MANN:W7030',
      'MANN:WK5027',
      'MANN:C36031',
      'MANN:CUK32008',
      'FILTRON:OP644/2',
      'FILTRON:K1417',
      'FILTRON:PP829/2',
      'FILTRON:AP098/4',
    ],
  },
  {
    model: 'MiTo',
    engine: '1.4 TB 16V Multiair 125 kw 170 hp',
    products: ['MANN:HU713/1x', 'MANN:CU2243', 'MANN:C21106', 'MANN:FP2243'],
  },
]

/**
 * KODSUZ ÜRÜNLER — İÇE AKTARILMADI.
 *
 * Kaynak sayfada bu iki MANN polen filtresinin adında parça kodu YOK
 * ("...Polen Kabin Filtresi", kod alanı boş). Parça kodu ürünün kimliğidir;
 * kod olmadan ne SKU açılabilir ne de ileride gelen veriyle eşleştirilebilir.
 * Kodu tahmin etmek (fiyat sırasına bakıp CU/CUK varsaymak gibi) yanlış parça
 * satışına yol açabileceği için YAPILMADI. Kod öğrenilince eklenecekler.
 */
export const MISSING_CODE_ITEMS = [
  {
    brand: 'MANN-FILTER',
    label: 'Polen Kabin Filtresi',
    priceGross: 703.31,
    models: ['Tonale (965)'],
  },
  {
    brand: 'MANN-FILTER',
    label: 'Polen Kabin Filtresi',
    priceGross: 873.73,
    models: ['Tonale (965)'],
  },
  {
    brand: 'MANN-FILTER',
    label: 'Polen Kabin Filtresi',
    priceGross: 1347.79,
    models: ['MiTo'],
  },
  // Giulietta ekranında kart metni kırpılmış; parça kodu GÖRÜNMÜYOR.
  // Yağ filtresinin fiyatı MiTo'daki HU713/1x ile birebir aynı (224,99) ve
  // motorları da aynı — büyük ihtimalle aynı ürün. Ama "büyük ihtimalle"
  // yanlış parça satmak için yeterli bir gerekçe değil; ekranın tekrarı
  // istenecek.
  {
    brand: 'MANN-FILTER',
    label: 'Polen Kabin (kod okunamadı)',
    priceGross: 1048.52,
    models: ['Giulietta (940)'],
  },
  {
    brand: 'MANN-FILTER',
    label: 'Yağ Filtresi (kod okunamadı)',
    priceGross: 224.99,
    models: ['Giulietta (940)'],
  },
] as const
