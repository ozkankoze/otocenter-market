/**
 * TEST VERİSİ ÜRETİCİSİ — tamamen sentetik.
 *
 * Bu dosyadaki hiçbir SKU, OEM numarası veya uyumluluk gerçek katalog
 * verisi değildir; hepsi `TEST-` önekiyle üretilir ve yalnızca ayrı
 * `otocenter_test` veritabanında kullanılır.
 */
import * as XLSX from 'xlsx'

export type SheetRows = Record<string, Array<Record<string, string | number>>>

/** Verilen sayfa/satırlardan bellek içi bir XLSX dosyası üretir. */
export function makeWorkbook(sheets: SheetRows): Buffer {
  const wb = XLSX.utils.book_new()
  for (const [name, rows] of Object.entries(sheets)) {
    const headers = [...new Set(rows.flatMap((r) => Object.keys(r)))]
    const aoa = [headers, ...rows.map((r) => headers.map((h) => r[h] ?? ''))]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(aoa), name)
  }
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
}

export function productRows(count: number, prefix = 'TEST'): Array<Record<string, string | number>> {
  return Array.from({ length: count }, (_, i) => ({
    sku: `${prefix}-SKU-${String(i + 1).padStart(4, '0')}`,
    urun_adi: `Test Hava Filtresi ${i + 1}`,
    marka: 'TESTMARKA',
    kategori_kodu: 'HAVA_FILTRESI',
    urun_kodu: `TF ${1000 + i}`,
    kisa_aciklama: 'Sentetik test ürünü — gerçek katalog verisi değildir.',
    durum: 'AKTIF',
    spec_yukseklik_mm: 40 + (i % 20),
  }))
}

export function priceRows(count: number, prefix = 'TEST'): Array<Record<string, string | number>> {
  return Array.from({ length: count }, (_, i) => ({
    sku: `${prefix}-SKU-${String(i + 1).padStart(4, '0')}`,
    fiyat_net: `${100 + i},50`,
    kdv_orani: 20,
    stok: (i * 3) % 40,
  }))
}

/** Tek ürün için N adet OEM satırı — HER NUMARA AYRI SATIR. */
export function oemRows(sku: string, numbers: string[]): Array<Record<string, string | number>> {
  return numbers.map((n, i) => ({
    sku,
    tip: 'OEM',
    marka: ['VW', 'AUDI', 'SEAT', 'SKODA'][i % 4]!,
    numara: n,
  }))
}

/** Tek ürün için N adet motor uyumluluğu — HER İLİŞKİ AYRI SATIR. */
export function compatRows(
  sku: string,
  engines: Array<{ code: string; name: string }>,
  type: 'UYUMLU' | 'UYUMSUZ' = 'UYUMLU',
): Array<Record<string, string | number>> {
  return engines.map((e) => ({
    sku,
    uyumluluk_tipi: type,
    arac_tipi: 'OTOMOBIL',
    arac_markasi: 'AUDI',
    model: 'A1 (GB)',
    motor_kodu: e.code,
    motor_adi: e.name,
    yil_baslangic: 2018,
    yil_bitis: 2024,
  }))
}

/** Araç ağacı satırı üretir (test için ek motorlar). */
export function vehicleRows(
  engines: Array<{ code: string; name: string; hp: number }>,
): Array<Record<string, string | number>> {
  return engines.map((e) => ({
    arac_tipi: 'OTOMOBIL',
    arac_markasi: 'AUDI',
    model: 'A1 (GB)',
    model_yil_baslangic: 2018,
    nesil: 'A1 II',
    motor_adi: e.name,
    motor_kodu: e.code,
    hacim_cc: 999,
    guc_hp: e.hp,
    yakit: 'BENZIN',
    motor_yil_baslangic: 2018,
    motor_yil_bitis: 2024,
  }))
}
