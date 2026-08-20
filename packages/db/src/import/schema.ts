/**
 * ════════════════════════════════════════════════════════════════════════════
 *  IMPORT ŞABLONU — SÜTUN TANIMLARI (TEK DOĞRULUK KAYNAĞI)
 * ════════════════════════════════════════════════════════════════════════════
 *  Referans: otocenter-plan/04-CSV-IMPORT-FORMATI.md (şema kimliği CSV_V1)
 *
 *  Bu dosya üç yeri birden besler:
 *    1. Ayrıştırıcı (hangi sütun hangi alana denk geliyor)
 *    2. Doğrulayıcı (zorunluluk ve tip kuralları)
 *    3. XLSX şablon üreticisi (indirilebilir örnek dosya)
 *
 *  İLİŞKİSEL YAPI KURALI:
 *    Çoklu OEM ve çoklu motor uyumluluğu YAN YANA SÜTUNLARDA TUTULMAZ.
 *    Her OEM numarası REFERENCE sayfasında ayrı bir satır,
 *    her ürün-motor ilişkisi COMPATIBILITY sayfasında ayrı bir satırdır.
 *    Bir ürünün 7 OEM numarası ve 312 motor uyumluluğu varsa
 *    7 + 312 = 319 satır yazılır.
 */
import type { ImportSheet } from '../types'

export type FieldType = 'text' | 'number' | 'decimal' | 'year' | 'bool' | 'enum'

export type FieldDef = {
  /** Şablondaki sütun başlığı (Türkçe) */
  key: string
  /** Kabul edilen diğer yazımlar (büyük/küçük harf ve boşluk önemsiz) */
  aliases?: string[]
  label: string
  type: FieldType
  required?: boolean
  /** enum tipinde izin verilen değerler */
  values?: readonly string[]
  maxLength?: number
  example?: string
  note?: string
}

export type SheetDef = {
  sheet: ImportSheet
  /** XLSX sayfa adı ve CSV dosya adı */
  name: string
  title: string
  description: string
  /** Yükleme sırası — bağımlılıklar bundan doğar */
  order: number
  dependsOn: ImportSheet[]
  fields: FieldDef[]
  /** `spec_*` gibi serbest önekli sütunlara izin verilir mi */
  dynamicPrefixes?: string[]
}

export const VEHICLE_TYPE_VALUES = [
  'OTOMOBIL',
  'HAFIF_TICARI',
  'AGIR_VASITA',
  'OTOBUS',
  'IS_MAKINESI',
  'TRAKTOR',
  'MOTOSIKLET',
] as const

export const FUEL_VALUES = ['BENZIN', 'DIZEL', 'LPG', 'HIBRIT', 'ELEKTRIK', 'CNG'] as const
export const REFERENCE_TYPE_VALUES = [
  'OEM',
  'CROSS_EQUIVALENT',
  'CROSS_REPLACES',
  'CROSS_REPLACED_BY',
] as const
export const COMPAT_TYPE_VALUES = ['UYUMLU', 'UYUMSUZ'] as const
export const PRODUCT_STATUS_VALUES = ['TASLAK', 'AKTIF', 'ARSIV'] as const
export const ATTR_TYPE_VALUES = ['SAYI', 'METIN', 'SECENEK', 'EVET_HAYIR'] as const

/** `TUM_MOTORLAR` — bir modelin bütün motorlarına genişletme anahtarı */
export const ALL_ENGINES_TOKEN = 'TUM_MOTORLAR'

// ════════════════════════════════ SAYFALAR ══════════════════════════════════

const CATEGORY: SheetDef = {
  sheet: 'CATEGORY',
  name: 'KATEGORILER',
  title: 'Kategoriler',
  description:
    'Kategori ağacı ve her kategorinin teknik özellik (facet) tanımları. Üst kategori önce gelmelidir.',
  order: 1,
  dependsOn: [],
  fields: [
    { key: 'kategori_kodu', label: 'Kategori kodu', type: 'text', required: true, maxLength: 48, example: 'HAVA_FILTRESI' },
    { key: 'ust_kategori_kodu', label: 'Üst kategori kodu', type: 'text', maxLength: 48, example: 'FILTRELER', note: 'Boşsa kök kategori' },
    { key: 'ad', label: 'Ad', type: 'text', required: true, maxLength: 120, example: 'Hava Filtreleri' },
    { key: 'slug', label: 'Slug', type: 'text', maxLength: 80, note: 'Boşsa addan üretilir' },
    { key: 'sira', label: 'Sıra', type: 'number', example: '10' },
    { key: 'aciklama', label: 'Açıklama', type: 'text' },
    { key: 'seo_baslik', label: 'SEO başlık', type: 'text', maxLength: 160 },
    { key: 'seo_aciklama', label: 'SEO açıklama', type: 'text', maxLength: 320 },
    { key: 'seo_giris_metni', label: 'SEO giriş metni', type: 'text' },
    { key: 'ozellik_1_anahtar', label: 'Özellik 1 anahtar', type: 'text', example: 'yukseklik_mm' },
    { key: 'ozellik_1_etiket', label: 'Özellik 1 etiket', type: 'text', example: 'Yükseklik' },
    { key: 'ozellik_1_tip', label: 'Özellik 1 tip', type: 'enum', values: ATTR_TYPE_VALUES, example: 'SAYI' },
    { key: 'ozellik_1_birim', label: 'Özellik 1 birim', type: 'text', example: 'mm' },
    { key: 'ozellik_2_anahtar', label: 'Özellik 2 anahtar', type: 'text' },
    { key: 'ozellik_2_etiket', label: 'Özellik 2 etiket', type: 'text' },
    { key: 'ozellik_2_tip', label: 'Özellik 2 tip', type: 'enum', values: ATTR_TYPE_VALUES },
    { key: 'ozellik_2_birim', label: 'Özellik 2 birim', type: 'text' },
  ],
}

const VEHICLE: SheetDef = {
  sheet: 'VEHICLE',
  name: 'ARAC_AGACI',
  title: 'Araç Ağacı',
  description:
    'Araç tipi → marka → model → nesil → motor. Denormalize tek sayfa; sistem ağacı kurar. ' +
    'Motor kodu uyumluluk eşleştirmesinin en güvenilir anahtarıdır.',
  order: 2,
  dependsOn: [],
  fields: [
    { key: 'arac_tipi', label: 'Araç tipi', type: 'enum', required: true, values: VEHICLE_TYPE_VALUES, example: 'OTOMOBIL' },
    { key: 'arac_markasi', label: 'Araç markası', type: 'text', required: true, maxLength: 80, example: 'AUDI' },
    { key: 'marka_slug', label: 'Marka slug', type: 'text', maxLength: 60 },
    { key: 'model', label: 'Model', type: 'text', required: true, maxLength: 120, example: 'A1 (GB)' },
    { key: 'model_kodu', label: 'Model kodu', type: 'text', maxLength: 40, example: 'GB' },
    { key: 'model_yil_baslangic', label: 'Model yıl başlangıç', type: 'year', example: '2018' },
    { key: 'model_yil_bitis', label: 'Model yıl bitiş', type: 'year' },
    { key: 'kasa_tipi', label: 'Kasa tipi', type: 'text', maxLength: 60, example: 'Hatchback' },
    { key: 'nesil', label: 'Nesil', type: 'text', maxLength: 120, note: 'Boşsa modelle aynı ad kullanılır' },
    { key: 'nesil_kodu', label: 'Nesil kodu', type: 'text', maxLength: 40 },
    { key: 'motor_adi', label: 'Motor adı', type: 'text', required: true, maxLength: 120, example: '30 TFSI 1.0' },
    { key: 'motor_kodu', label: 'Motor kodu', type: 'text', example: 'CHZB|CHZJ', note: '| ile çoklu yazılır' },
    { key: 'hacim_cc', label: 'Hacim (cc)', type: 'number', example: '999' },
    { key: 'guc_kw', label: 'Güç (kW)', type: 'number', example: '81' },
    { key: 'guc_hp', label: 'Güç (HP)', type: 'number', example: '110' },
    { key: 'yakit', label: 'Yakıt', type: 'enum', required: true, values: FUEL_VALUES, example: 'BENZIN' },
    { key: 'silindir', label: 'Silindir', type: 'number' },
    { key: 'supap', label: 'Supap', type: 'number' },
    { key: 'motor_yil_baslangic', label: 'Motor yıl başlangıç', type: 'year', example: '2018' },
    { key: 'motor_yil_bitis', label: 'Motor yıl bitiş', type: 'year', example: '2024' },
  ],
}

const PRODUCT: SheetDef = {
  sheet: 'PRODUCT',
  name: 'URUNLER',
  title: 'Ürünler',
  description:
    'Ürün ana kaydı. SKU benzersiz anahtardır; diğer bütün sayfalar SKU ile bu sayfaya bağlanır. ' +
    'spec_ önekli sütunlar kategorinin teknik özellik tanımlarına yazılır.',
  order: 3,
  dependsOn: ['CATEGORY'],
  dynamicPrefixes: ['spec_'],
  fields: [
    { key: 'sku', label: 'SKU', type: 'text', required: true, maxLength: 64, example: 'MANN-C35154' },
    { key: 'urun_adi', label: 'Ürün adı', type: 'text', required: true, maxLength: 200, example: 'Hava Filtresi' },
    { key: 'marka', label: 'Marka', type: 'text', required: true, maxLength: 80, example: 'MANN-FILTER' },
    { key: 'kategori_kodu', label: 'Kategori kodu', type: 'text', required: true, maxLength: 48, example: 'HAVA_FILTRESI' },
    { key: 'urun_kodu', label: 'Ürün kodu', type: 'text', maxLength: 64, example: 'C 35 154' },
    { key: 'slug', label: 'Slug', type: 'text', maxLength: 140 },
    { key: 'kisa_aciklama', label: 'Kısa açıklama', type: 'text', maxLength: 320 },
    { key: 'aciklama', label: 'Açıklama', type: 'text' },
    { key: 'durum', label: 'Durum', type: 'enum', values: PRODUCT_STATUS_VALUES, example: 'AKTIF' },
    { key: 'one_cikan', label: 'Öne çıkan', type: 'bool', example: 'HAYIR' },
    { key: 'seo_baslik', label: 'SEO başlık', type: 'text', maxLength: 160 },
    { key: 'seo_aciklama', label: 'SEO açıklama', type: 'text', maxLength: 320 },
  ],
}

const PRICE_STOCK: SheetDef = {
  sheet: 'PRICE_STOCK',
  name: 'FIYAT_STOK',
  title: 'Fiyat & Stok',
  description:
    'Varyant, fiyat ve stok. Fiyat KDV HARİÇ girilir; KDV dahil fiyatı sistem hesaplar. ' +
    'Varyant SKU boşsa ürünün varsayılan varyantı kullanılır.',
  order: 4,
  dependsOn: ['PRODUCT'],
  fields: [
    { key: 'sku', label: 'SKU', type: 'text', required: true, maxLength: 64, example: 'MANN-C35154' },
    { key: 'varyant_sku', label: 'Varyant SKU', type: 'text', maxLength: 64 },
    { key: 'varyant_adi', label: 'Varyant adı', type: 'text', maxLength: 80, example: '5 L' },
    { key: 'ambalaj_miktari', label: 'Ambalaj miktarı', type: 'decimal', example: '1' },
    { key: 'birim', label: 'Birim', type: 'text', maxLength: 8, example: 'ADET' },
    { key: 'barkod', label: 'Barkod', type: 'text', maxLength: 32 },
    { key: 'fiyat_net', label: 'Fiyat (KDV hariç)', type: 'decimal', required: true, example: '1041,58' },
    { key: 'kdv_orani', label: 'KDV oranı', type: 'number', required: true, example: '20' },
    { key: 'liste_fiyati', label: 'Liste fiyatı', type: 'decimal', example: '1499,90' },
    { key: 'stok', label: 'Stok', type: 'number', required: true, example: '12' },
    { key: 'depo_kodu', label: 'Depo kodu', type: 'text', maxLength: 24, example: 'MERKEZ' },
    { key: 'tedarik_suresi_gun', label: 'Tedarik süresi (gün)', type: 'number', example: '3' },
    { key: 'agirlik_gr', label: 'Ağırlık (gr)', type: 'number' },
    { key: 'musteri_grubu', label: 'Müşteri grubu', type: 'text', maxLength: 24, example: 'RETAIL' },
  ],
}

const REFERENCE: SheetDef = {
  sheet: 'REFERENCE',
  name: 'OEM_CAPRAZ',
  title: 'OEM & Çapraz Kodlar',
  description:
    'HER NUMARA AYRI SATIRDIR. Bir ürünün 7 OEM numarası varsa 7 satır yazılır. ' +
    'Numara orijinal yazımıyla saklanır; arama için normalize edilmiş hali ayrıca tutulur.',
  order: 5,
  dependsOn: ['PRODUCT'],
  fields: [
    { key: 'sku', label: 'SKU', type: 'text', required: true, maxLength: 64, example: 'MANN-C35154' },
    { key: 'tip', label: 'Tip', type: 'enum', required: true, values: REFERENCE_TYPE_VALUES, example: 'OEM' },
    { key: 'marka', label: 'Marka', type: 'text', required: true, maxLength: 80, example: 'VW' },
    { key: 'numara', label: 'Numara', type: 'text', required: true, maxLength: 64, example: '04E 129 620 A' },
    { key: 'not', label: 'Not', type: 'text' },
  ],
}

const COMPATIBILITY: SheetDef = {
  sheet: 'COMPATIBILITY',
  name: 'UYUMLULUK',
  title: 'Uyumluluk',
  description:
    'HER ÜRÜN-MOTOR İLİŞKİSİ AYRI SATIRDIR. Bir ürün 312 motora uyuyorsa 312 satır yazılır. ' +
    'UYUMSUZ satırlar da veridir ve yanlış parça iadesini azaltır. ' +
    'Motor kodu yerine TUM_MOTORLAR yazılırsa modelin bütün motorlarına genişletilir.',
  order: 6,
  dependsOn: ['PRODUCT', 'VEHICLE'],
  fields: [
    { key: 'sku', label: 'SKU', type: 'text', required: true, maxLength: 64, example: 'MANN-C35154' },
    { key: 'uyumluluk_tipi', label: 'Uyumluluk tipi', type: 'enum', values: COMPAT_TYPE_VALUES, example: 'UYUMLU' },
    { key: 'arac_tipi', label: 'Araç tipi', type: 'enum', required: true, values: VEHICLE_TYPE_VALUES, example: 'OTOMOBIL' },
    { key: 'arac_markasi', label: 'Araç markası', type: 'text', required: true, maxLength: 80, example: 'AUDI' },
    { key: 'model', label: 'Model', type: 'text', required: true, maxLength: 120, example: 'A1 (GB)' },
    { key: 'motor_kodu', label: 'Motor kodu', type: 'text', example: 'CHZB', note: 'motor_kodu veya motor_adi zorunlu' },
    { key: 'motor_adi', label: 'Motor adı', type: 'text', maxLength: 120, example: '30 TFSI 1.0' },
    { key: 'hacim_cc', label: 'Hacim (cc)', type: 'number', example: '999' },
    { key: 'guc_hp', label: 'Güç (HP)', type: 'number', example: '110' },
    { key: 'yil_baslangic', label: 'Yıl başlangıç', type: 'year', example: '2018' },
    { key: 'yil_bitis', label: 'Yıl bitiş', type: 'year', example: '2024' },
    { key: 'ay_baslangic', label: 'Ay başlangıç', type: 'number' },
    { key: 'ay_bitis', label: 'Ay bitiş', type: 'number' },
    { key: 'kisit_notu', label: 'Kısıt notu', type: 'text', example: 'Şasi no 8XJ050001 sonrası' },
    { key: 'not', label: 'Not', type: 'text' },
  ],
}

export const SHEET_DEFS: SheetDef[] = [
  CATEGORY,
  VEHICLE,
  PRODUCT,
  PRICE_STOCK,
  REFERENCE,
  COMPATIBILITY,
]

export const SHEET_BY_KEY: Record<ImportSheet, SheetDef> = Object.fromEntries(
  SHEET_DEFS.map((d) => [d.sheet, d]),
) as Record<ImportSheet, SheetDef>

/** Sayfa adından (XLSX sekme adı / CSV dosya adı) sayfa tipini bul. */
export function detectSheet(rawName: string): ImportSheet | null {
  const n = rawName
    .toLocaleUpperCase('tr')
    .replace(/[^A-ZĞÜŞİÖÇ0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  const direct = SHEET_DEFS.find((d) => d.name === n)
  if (direct) return direct.sheet

  const table: Array<[RegExp, ImportSheet]> = [
    [/KATEGOR/, 'CATEGORY'],
    [/ARAC|ARAÇ|VEHICLE/, 'VEHICLE'],
    [/URUN|ÜRÜN|PRODUCT/, 'PRODUCT'],
    [/FIYAT|STOK|PRICE/, 'PRICE_STOCK'],
    [/OEM|CAPRAZ|ÇAPRAZ|REFERENCE/, 'REFERENCE'],
    [/UYUM|COMPAT/, 'COMPATIBILITY'],
  ]
  for (const [re, sheet] of table) if (re.test(n)) return sheet
  return null
}

/** Başlık hücresini alan anahtarına çevirir (boşluk/büyük harf/aksan toleranslı). */
export function normalizeHeader(header: string): string {
  return header
    .trim()
    .toLocaleLowerCase('tr')
    .replace(/[ıİ]/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function findField(def: SheetDef, header: string): FieldDef | null {
  const h = normalizeHeader(header)
  for (const f of def.fields) {
    if (normalizeHeader(f.key) === h) return f
    if (f.aliases?.some((a) => normalizeHeader(a) === h)) return f
  }
  return null
}
