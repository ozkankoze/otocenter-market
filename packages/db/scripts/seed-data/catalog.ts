/**
 * Katalog seed verisi (Faz 0 / Sprint 1).
 *
 * ⚠ Ürün kodları, OEM numaraları ve fiyatlar geliştirme ortamı için üretilmiş
 * TEMSİLİ verilerdir. Üretim verisi CSV içe aktarımıyla gelecektir.
 */

export type CategorySeed = {
  code: string
  parent?: string
  name: string
  slug: string
  icon?: string
  sortOrder: number
  seoIntro?: string
  attributes?: Array<{
    key: string
    label: string
    unit?: string
    dataType: 'NUMBER' | 'TEXT' | 'ENUM' | 'BOOL'
    enumValues?: string[]
  }>
}

export const CATEGORIES: CategorySeed[] = [
  { code: 'FILTRELER', name: 'Filtreler', slug: 'filtreler', icon: 'filter', sortOrder: 10 },
  {
    code: 'HAVA_FILTRESI',
    parent: 'FILTRELER',
    name: 'Hava Filtreleri',
    slug: 'hava-filtreleri',
    icon: 'air-filter',
    sortOrder: 11,
    seoIntro:
      'Hava filtresi, motora giren havadaki toz ve partikülleri tutarak yanma verimini korur. Şehir içi kullanımda ortalama 15.000–20.000 km’de değişimi önerilir.',
    attributes: [
      { key: 'yukseklik_mm', label: 'Yükseklik', unit: 'mm', dataType: 'NUMBER' },
      { key: 'dis_cap_mm', label: 'Dış Çap', unit: 'mm', dataType: 'NUMBER' },
      { key: 'ic_cap_mm', label: 'İç Çap', unit: 'mm', dataType: 'NUMBER' },
      {
        key: 'filtre_tipi',
        label: 'Filtre Tipi',
        dataType: 'ENUM',
        enumValues: ['Panel', 'Silindirik', 'Güvenlik'],
      },
    ],
  },
  {
    code: 'YAG_FILTRESI',
    parent: 'FILTRELER',
    name: 'Yağ Filtreleri',
    slug: 'yag-filtreleri',
    icon: 'oil-filter',
    sortOrder: 12,
    seoIntro:
      'Yağ filtresi, motor yağındaki metal parçacık ve kurumu tutar. Her yağ değişiminde birlikte değiştirilmesi gerekir.',
    attributes: [
      { key: 'yukseklik_mm', label: 'Yükseklik', unit: 'mm', dataType: 'NUMBER' },
      { key: 'dis_cap_mm', label: 'Dış Çap', unit: 'mm', dataType: 'NUMBER' },
      { key: 'dis_olcusu', label: 'Diş Ölçüsü', dataType: 'TEXT' },
      { key: 'bypass_valfi', label: 'Bypass Valfi', dataType: 'BOOL' },
    ],
  },
  {
    code: 'YAKIT_FILTRESI',
    parent: 'FILTRELER',
    name: 'Yakıt Filtreleri',
    slug: 'yakit-filtreleri',
    icon: 'fuel-filter',
    sortOrder: 13,
    seoIntro:
      'Yakıt filtresi, enjektörlere giden yakıttaki su ve tortuyu ayırır. Dizel araçlarda değişim aralığı benzinli araçlara göre daha kısadır.',
    attributes: [
      { key: 'yukseklik_mm', label: 'Yükseklik', unit: 'mm', dataType: 'NUMBER' },
      { key: 'dis_cap_mm', label: 'Dış Çap', unit: 'mm', dataType: 'NUMBER' },
      { key: 'su_ayirici', label: 'Su Ayırıcı', dataType: 'BOOL' },
    ],
  },
  {
    code: 'POLEN_FILTRESI',
    parent: 'FILTRELER',
    name: 'Polen / Kabin Filtreleri',
    slug: 'polen-kabin-filtreleri',
    icon: 'cabin-filter',
    sortOrder: 14,
    seoIntro:
      'Kabin filtresi, araç içine giren havadaki polen, toz ve egzoz partiküllerini tutar. Yılda bir veya 15.000 km’de değişimi önerilir.',
    attributes: [
      { key: 'uzunluk_mm', label: 'Uzunluk', unit: 'mm', dataType: 'NUMBER' },
      { key: 'genislik_mm', label: 'Genişlik', unit: 'mm', dataType: 'NUMBER' },
      { key: 'yukseklik_mm', label: 'Yükseklik', unit: 'mm', dataType: 'NUMBER' },
      {
        key: 'filtre_tipi',
        label: 'Filtre Tipi',
        dataType: 'ENUM',
        enumValues: ['Partikül', 'Aktif Karbon', 'Antibakteriyel'],
      },
    ],
  },
  {
    code: 'KURUTUCU_FILTRE',
    parent: 'FILTRELER',
    name: 'Kurutucu Filtreler',
    slug: 'kurutucu-filtreler',
    icon: 'dryer',
    sortOrder: 15,
    seoIntro:
      'Hava kurutucu filtreleri, ağır vasıtaların fren hava sistemindeki nemi tutarak korozyon ve donmayı önler.',
    attributes: [{ key: 'dis_olcusu', label: 'Diş Ölçüsü', dataType: 'TEXT' }],
  },
  {
    code: 'HIDROLIK_FILTRE',
    parent: 'FILTRELER',
    name: 'Hidrolik Filtreler',
    slug: 'hidrolik-filtreler',
    icon: 'hydraulic',
    sortOrder: 16,
    attributes: [{ key: 'yukseklik_mm', label: 'Yükseklik', unit: 'mm', dataType: 'NUMBER' }],
  },
  {
    code: 'SANZUMAN_FILTRESI',
    parent: 'FILTRELER',
    name: 'Şanzuman Filtreleri',
    slug: 'sanzuman-filtreleri',
    icon: 'transmission-filter',
    sortOrder: 17,
    seoIntro:
      'Otomatik şanzuman filtresi, şanzuman yağındaki balata tozunu ve metal parçacıkları tutar. Genellikle yağ ve karter contasıyla birlikte, set hâlinde değiştirilir.',
    attributes: [
      { key: 'uzunluk_mm', label: 'Uzunluk', unit: 'mm', dataType: 'NUMBER' },
      { key: 'genislik_mm', label: 'Genişlik', unit: 'mm', dataType: 'NUMBER' },
      { key: 'sanziman_tipi', label: 'Şanzıman Tipi', dataType: 'TEXT' },
      { key: 'conta_dahil', label: 'Conta Dahil', dataType: 'BOOL' },
    ],
  },
  {
    code: 'DIREKSIYON_FILTRESI',
    parent: 'FILTRELER',
    name: 'Direksiyon Filtreleri',
    slug: 'direksiyon-filtreleri',
    icon: 'steering-filter',
    sortOrder: 18,
    seoIntro:
      'Hidrolik direksiyon filtresi, direksiyon hidrolik devresindeki metal parçacıkları ve kiri tutar; pompanın ve kutunun ömrünü uzatır. Ağırlıklı olarak hafif ticari araçlarda ayrı bir filtre olarak bulunur.',
    attributes: [
      { key: 'uzunluk_mm', label: 'Uzunluk', unit: 'mm', dataType: 'NUMBER' },
      { key: 'dis_cap_mm', label: 'Dış Çap', unit: 'mm', dataType: 'NUMBER' },
    ],
  },
  {
    code: 'KARTER_HAVALANDIRMA',
    parent: 'FILTRELER',
    name: 'Karter Havalandırma Filtreleri',
    slug: 'karter-havalandirma-filtreleri',
    icon: 'crankcase-filter',
    sortOrder: 19,
    seoIntro:
      'Karter havalandırma (PCV) filtresi, karter gazındaki yağ buharını ayırır ve temiz gazı emme sistemine geri verir. Tıkanması yağ tüketimini ve karter basıncını artırır.',
    attributes: [
      { key: 'uzunluk_mm', label: 'Uzunluk', unit: 'mm', dataType: 'NUMBER' },
      { key: 'dis_cap_mm', label: 'Dış Çap', unit: 'mm', dataType: 'NUMBER' },
    ],
  },
  {
    code: 'IC_HAVA_FILTRESI',
    parent: 'FILTRELER',
    name: 'İç Hava Filtreleri',
    slug: 'ic-hava-filtreleri',
    icon: 'inner-air-filter',
    sortOrder: 20,
    seoIntro:
      'İç hava filtresi (güvenlik filtresi), ana hava filtresinin içine yerleşir ve ana filtre yırtıldığında motora toz gitmesini önler. Ağır vasıtalarda ana filtreyle birlikte, genellikle iki ana filtre değişiminde bir yenilenir.',
    attributes: [
      { key: 'uzunluk_mm', label: 'Uzunluk', unit: 'mm', dataType: 'NUMBER' },
      { key: 'dis_cap_mm', label: 'Dış Çap', unit: 'mm', dataType: 'NUMBER' },
    ],
  },
  {
    code: 'AD_BLUE_FILTRESI',
    parent: 'FILTRELER',
    name: 'AdBlue Filtreleri',
    slug: 'adblue-filtreleri',
    icon: 'adblue-filter',
    sortOrder: 21,
    seoIntro:
      'AdBlue (SCR) filtresi, üre çözeltisindeki kristal ve tortuyu tutar; dozaj pompasını ve enjektörü korur. Tıkanması SCR arıza lambası ve tork kısıtlamasıyla sonuçlanır.',
    attributes: [
      { key: 'uzunluk_mm', label: 'Uzunluk', unit: 'mm', dataType: 'NUMBER' },
      { key: 'dis_cap_mm', label: 'Dış Çap', unit: 'mm', dataType: 'NUMBER' },
    ],
  },
  { code: 'YAGLAR', name: 'Yağlar & Sıvılar', slug: 'yaglar-sivilar', icon: 'oil', sortOrder: 30 },
  {
    code: 'MOTOR_YAGI',
    parent: 'YAGLAR',
    name: 'Motor Yağları',
    slug: 'motor-yaglari',
    icon: 'engine-oil',
    sortOrder: 31,
    seoIntro:
      'Motor yağı seçiminde üreticinin belirlediği viskozite ve onay (ACEA/API/OEM) kritik önemdedir. Aracınızı seçerek uygun spesifikasyondaki ürünleri görebilirsiniz.',
    attributes: [
      {
        key: 'viskozite',
        label: 'Viskozite',
        dataType: 'ENUM',
        enumValues: ['0W-20', '0W-30', '5W-30', '5W-40', '10W-40', '15W-40'],
      },
      { key: 'acea', label: 'ACEA', dataType: 'TEXT' },
      { key: 'api', label: 'API', dataType: 'TEXT' },
      {
        key: 'yag_tipi',
        label: 'Yağ Tipi',
        dataType: 'ENUM',
        enumValues: ['Tam Sentetik', 'Yarı Sentetik', 'Mineral'],
      },
    ],
  },
  {
    code: 'ANTIFRIZ',
    parent: 'YAGLAR',
    name: 'Antifriz & Soğutma Sıvıları',
    slug: 'antifriz',
    icon: 'coolant',
    sortOrder: 32,
    attributes: [
      {
        key: 'spesifikasyon',
        label: 'Spesifikasyon',
        dataType: 'ENUM',
        enumValues: ['G11', 'G12', 'G12+', 'G12++', 'G13'],
      },
      { key: 'renk', label: 'Renk', dataType: 'TEXT' },
    ],
  },
  {
    code: 'FREN_HIDROLIGI',
    parent: 'YAGLAR',
    name: 'Fren Hidroliği',
    slug: 'fren-hidroligi',
    icon: 'brake',
    sortOrder: 33,
    attributes: [
      {
        key: 'spesifikasyon',
        label: 'Spesifikasyon',
        dataType: 'ENUM',
        enumValues: ['DOT 3', 'DOT 4', 'DOT 5.1'],
      },
    ],
  },
  {
    code: 'ADBLUE',
    parent: 'YAGLAR',
    name: 'AdBlue',
    slug: 'adblue',
    icon: 'adblue',
    sortOrder: 34,
  },
]

export const PRODUCT_BRANDS = [
  { name: 'MANN-FILTER', slug: 'mann-filter', country: 'Almanya', featured: true, prefix: 'MANN' },
  { name: 'FILTRON', slug: 'filtron', country: 'Polonya', featured: true, prefix: 'FILTRON' },
  { name: 'BOSCH', slug: 'bosch', country: 'Almanya', featured: true, prefix: 'BOSCH' },
  { name: 'MAHLE', slug: 'mahle', country: 'Almanya', featured: true, prefix: 'MAHLE' },
  { name: 'PURFLUX', slug: 'purflux', country: 'Fransa', featured: true, prefix: 'PURFLUX' },
  { name: 'HENGST', slug: 'hengst', country: 'Almanya', featured: true, prefix: 'HENGST' },
  { name: 'LIQUI MOLY', slug: 'liqui-moly', country: 'Almanya', featured: true, prefix: 'LM' },
  {
    name: 'FEBI BILSTEIN',
    slug: 'febi-bilstein',
    country: 'Almanya',
    featured: true,
    prefix: 'FEBI',
  },
  { name: 'DONALDSON', slug: 'donaldson', country: 'ABD', featured: false, prefix: 'DON' },
  { name: 'WIX FILTERS', slug: 'wix-filters', country: 'ABD', featured: false, prefix: 'WIX' },
] as const

/**
 * Motor platformları — uyumluluk üretiminin temeli.
 * Bir ürün ailesi, bir platformdaki TÜM motorlara uyar.
 */
export type Platform = {
  key: string
  label: string
  /** Motor kodu ön ekleri (tam veya kısmi eşleşme) */
  codes: string[]
  /** Bu platform için filtre kategorileri */
  categories: string[]
  heavy?: boolean
}

export const PLATFORMS: Platform[] = [
  {
    key: 'VAG-EA211',
    label: 'VAG 1.0/1.5 TSI (EA211)',
    codes: ['CHZB', 'CHZJ', 'DKRF', 'DKLA', 'CHYB', 'DLAA', 'DPCA'],
    categories: ['HAVA_FILTRESI', 'YAG_FILTRESI', 'YAKIT_FILTRESI', 'POLEN_FILTRESI'],
  },
  {
    key: 'VAG-EA288',
    label: 'VAG 2.0 TDI (EA288)',
    codes: ['DTTB', 'DFHA', 'DTTA', 'DFSD', 'CXHA', 'CXGA', 'DEUA', 'DKNA'],
    categories: ['HAVA_FILTRESI', 'YAG_FILTRESI', 'YAKIT_FILTRESI', 'POLEN_FILTRESI'],
  },
  {
    key: 'FORD-ECO',
    label: 'Ford EcoBoost / EcoBlue',
    codes: ['M8DA', 'M8DB', 'XWDA', 'M0DA', 'XUJC', 'ZTDA', 'YMF6', 'YLF6', 'XVCB'],
    categories: ['HAVA_FILTRESI', 'YAG_FILTRESI', 'YAKIT_FILTRESI', 'POLEN_FILTRESI'],
  },
  {
    key: 'RENAULT',
    label: 'Renault-Nissan K9K / H4D / H5H',
    codes: ['K9K', 'H4D', 'H5H', 'M9T'],
    categories: ['HAVA_FILTRESI', 'YAG_FILTRESI', 'YAKIT_FILTRESI', 'POLEN_FILTRESI'],
  },
  {
    key: 'PSA',
    label: 'PSA PureTech / BlueHDi',
    codes: ['HN05', 'DV5RC', 'DV5RD', 'HMZ', 'EP6FADTXD'],
    categories: ['HAVA_FILTRESI', 'YAG_FILTRESI', 'YAKIT_FILTRESI', 'POLEN_FILTRESI'],
  },
  {
    key: 'MB-OM',
    label: 'Mercedes-Benz OM / M serisi',
    codes: ['OM651', 'OM651.958', 'OM622', 'OM654', 'M264.915', 'M282.914'],
    categories: ['HAVA_FILTRESI', 'YAG_FILTRESI', 'YAKIT_FILTRESI', 'POLEN_FILTRESI'],
  },
  {
    key: 'BMW-B',
    label: 'BMW B serisi',
    codes: ['B48B20', 'B47D20', 'B38A15'],
    categories: ['HAVA_FILTRESI', 'YAG_FILTRESI', 'YAKIT_FILTRESI', 'POLEN_FILTRESI'],
  },
  {
    key: 'ASIA',
    label: 'Uzakdoğu motorları',
    codes: ['1ZR-FAE', '2ZR-FXE', 'G4LC', 'D4FE', 'G4FS', 'N16A1', 'D4204T23'],
    categories: ['HAVA_FILTRESI', 'YAG_FILTRESI', 'POLEN_FILTRESI'],
  },
  {
    key: 'FIAT',
    label: 'FCA Fire / Multijet',
    codes: ['843A1000', '55260384', '330A1000', '263A5000', 'F1AGL411', 'F1AGL411D'],
    categories: ['HAVA_FILTRESI', 'YAG_FILTRESI', 'YAKIT_FILTRESI', 'POLEN_FILTRESI'],
  },
  {
    key: 'OPEL',
    label: 'Opel B serisi',
    codes: ['B14XFT', 'B16DTH'],
    categories: ['HAVA_FILTRESI', 'YAG_FILTRESI', 'POLEN_FILTRESI'],
  },
  {
    key: 'HEAVY',
    label: 'Ağır vasıta motorları',
    codes: [
      'OM471',
      'OM471.900',
      'OM934',
      'OM470',
      'D2676',
      'D2066',
      'DC13',
      'DC11',
      'MX-13',
      'CURSOR 11',
      'ECOTORQ',
      'D13K460',
      'CUMMINS ISF',
    ],
    categories: ['HAVA_FILTRESI', 'YAG_FILTRESI', 'YAKIT_FILTRESI', 'KURUTUCU_FILTRE'],
    heavy: true,
  },
  {
    key: 'OFFROAD',
    label: 'İş makinesi & traktör motorları',
    codes: ['C4.4', 'JCB448', 'PERKINS 1104D', 'F5C', 'AGCO POWER 44'],
    categories: ['HAVA_FILTRESI', 'YAG_FILTRESI', 'YAKIT_FILTRESI', 'HIDROLIK_FILTRE'],
    heavy: true,
  },
]

/** Kategori bazlı ürün adı, spec şablonu ve fiyat bandı (KDV dahil, TL) */
export const CATEGORY_TEMPLATES: Record<
  string,
  {
    name: string
    priceMin: number
    priceMax: number
    specs: (i: number, heavy: boolean) => Record<string, unknown>
  }
> = {
  HAVA_FILTRESI: {
    name: 'Hava Filtresi',
    priceMin: 480,
    priceMax: 1450,
    specs: (i, heavy) => ({
      yukseklik_mm: heavy ? 320 + i * 7 : 48 + i * 4,
      dis_cap_mm: heavy ? 210 + i * 5 : 210 + i * 9,
      ic_cap_mm: heavy ? 128 + i * 3 : 160 + i * 6,
      filtre_tipi: heavy ? 'Silindirik' : 'Panel',
    }),
  },
  YAG_FILTRESI: {
    name: 'Yağ Filtresi',
    priceMin: 240,
    priceMax: 780,
    specs: (i, heavy) => ({
      yukseklik_mm: heavy ? 150 + i * 6 : 72 + i * 4,
      dis_cap_mm: heavy ? 118 + i * 3 : 70 + i * 3,
      dis_olcusu: heavy ? '1-12 UNF' : '3/4-16 UNF',
      bypass_valfi: i % 2 === 0,
    }),
  },
  YAKIT_FILTRESI: {
    name: 'Yakıt Filtresi',
    priceMin: 320,
    priceMax: 1180,
    specs: (i, heavy) => ({
      yukseklik_mm: heavy ? 175 + i * 6 : 120 + i * 5,
      dis_cap_mm: heavy ? 95 + i * 3 : 76 + i * 3,
      su_ayirici: heavy || i % 3 === 0,
    }),
  },
  POLEN_FILTRESI: {
    name: 'Polen / Kabin Filtresi',
    priceMin: 260,
    priceMax: 760,
    specs: (i, _heavy) => ({
      uzunluk_mm: 245 + i * 8,
      genislik_mm: 190 + i * 5,
      yukseklik_mm: 30 + (i % 3) * 2,
      filtre_tipi: i % 3 === 0 ? 'Aktif Karbon' : i % 3 === 1 ? 'Partikül' : 'Antibakteriyel',
    }),
  },
  KURUTUCU_FILTRE: {
    name: 'Hava Kurutucu Filtresi',
    priceMin: 640,
    priceMax: 1980,
    specs: (_i, _heavy) => ({ dis_olcusu: 'M39 x 1.5' }),
  },
  HIDROLIK_FILTRE: {
    name: 'Hidrolik Filtre',
    priceMin: 520,
    priceMax: 1640,
    specs: (i, _heavy) => ({ yukseklik_mm: 180 + i * 8 }),
  },
}

/** Araçtan bağımsız satılan sıvı ürünleri */
export const FLUID_PRODUCTS = [
  {
    sku: 'LM-3707',
    brand: 'LIQUI MOLY',
    category: 'MOTOR_YAGI',
    name: 'Top Tec 4200 5W-30 Motor Yağı',
    code: '3707',
    specs: { viskozite: '5W-30', acea: 'C3', api: 'SN', yag_tipi: 'Tam Sentetik' },
    variants: [
      { name: '1 L', pack: 1, unit: 'LT', price: 449.9 },
      { name: '4 L', pack: 4, unit: 'LT', price: 1699.9 },
      { name: '5 L', pack: 5, unit: 'LT', price: 2089.9 },
      { name: '20 L', pack: 20, unit: 'LT', price: 7899.9 },
    ],
  },
  {
    sku: 'LM-2325',
    brand: 'LIQUI MOLY',
    category: 'MOTOR_YAGI',
    name: 'Molygen New Generation 5W-40 Motor Yağı',
    code: '2325',
    specs: { viskozite: '5W-40', acea: 'A3/B4', api: 'SN', yag_tipi: 'Tam Sentetik' },
    variants: [
      { name: '4 L', pack: 4, unit: 'LT', price: 1849.9 },
      { name: '5 L', pack: 5, unit: 'LT', price: 2249.9 },
    ],
  },
  {
    sku: 'LM-1193',
    brand: 'LIQUI MOLY',
    category: 'MOTOR_YAGI',
    name: 'Special Tec LL 5W-30 Motor Yağı',
    code: '1193',
    specs: { viskozite: '5W-30', acea: 'C3', api: 'SN', yag_tipi: 'Tam Sentetik' },
    variants: [{ name: '5 L', pack: 5, unit: 'LT', price: 1989.9 }],
  },
  {
    sku: 'LM-4432',
    brand: 'LIQUI MOLY',
    category: 'MOTOR_YAGI',
    name: 'MoS2 Leichtlauf 10W-40 Motor Yağı',
    code: '4432',
    specs: { viskozite: '10W-40', acea: 'A3/B4', api: 'SL', yag_tipi: 'Yarı Sentetik' },
    variants: [{ name: '5 L', pack: 5, unit: 'LT', price: 1449.9 }],
  },
  {
    sku: 'FEBI-38200',
    brand: 'FEBI BILSTEIN',
    category: 'ANTIFRIZ',
    name: 'G12++ Antifriz Konsantre',
    code: '38200',
    specs: { spesifikasyon: 'G12++', renk: 'Mor' },
    variants: [
      { name: '1,5 L', pack: 1.5, unit: 'LT', price: 389.9 },
      { name: '5 L', pack: 5, unit: 'LT', price: 1149.9 },
    ],
  },
  {
    sku: 'FEBI-02233',
    brand: 'FEBI BILSTEIN',
    category: 'ANTIFRIZ',
    name: 'G11 Antifriz Konsantre',
    code: '02233',
    specs: { spesifikasyon: 'G11', renk: 'Mavi-Yeşil' },
    variants: [{ name: '5 L', pack: 5, unit: 'LT', price: 899.9 }],
  },
  {
    sku: 'LM-3086',
    brand: 'LIQUI MOLY',
    category: 'FREN_HIDROLIGI',
    name: 'DOT 4 Fren Hidroliği',
    code: '3086',
    specs: { spesifikasyon: 'DOT 4' },
    variants: [
      { name: '500 ml', pack: 0.5, unit: 'LT', price: 289.9 },
      { name: '1 L', pack: 1, unit: 'LT', price: 469.9 },
    ],
  },
  {
    sku: 'LM-21747',
    brand: 'LIQUI MOLY',
    category: 'ADBLUE',
    name: 'AdBlue Üre Çözeltisi',
    code: '21747',
    specs: {},
    variants: [
      { name: '10 L', pack: 10, unit: 'LT', price: 649.9 },
      { name: '20 L', pack: 20, unit: 'LT', price: 1189.9 },
    ],
  },
] as const

/** Veri kaynakları — assertion katmanının temeli */
export const DATA_SOURCES = [
  { code: 'MANUAL', name: 'Admin Doğrulaması', kind: 'MANUAL' as const, trustLevel: 100 },
  { code: 'TECDOC', name: 'TecDoc Kataloğu', kind: 'CATALOG' as const, trustLevel: 90 },
  {
    code: 'MANN_CATALOG',
    name: 'MANN-FILTER Kataloğu',
    kind: 'MANUFACTURER' as const,
    trustLevel: 80,
  },
  { code: 'BOSCH_CATALOG', name: 'BOSCH Kataloğu', kind: 'MANUFACTURER' as const, trustLevel: 80 },
  { code: 'SUPPLIER_A', name: 'Tedarikçi Listesi A', kind: 'SUPPLIER' as const, trustLevel: 60 },
  { code: 'CSV_V1', name: 'Kendi CSV İçe Aktarımımız', kind: 'CSV' as const, trustLevel: 50 },
  { code: 'DERIVED', name: 'Çapraz Referanstan Türetme', kind: 'DERIVED' as const, trustLevel: 30 },
]
