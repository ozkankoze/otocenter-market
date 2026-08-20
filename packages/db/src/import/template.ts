/**
 * İNDİRİLEBİLİR XLSX ŞABLONU
 *
 * Şablon `schema.ts` içindeki sütun tanımlarından ÜRETİLİR — şablon ile
 * doğrulayıcının ayrışması mümkün değildir.
 *
 * İLİŞKİSEL YAPI: çoklu OEM ve çoklu motor YAN YANA SÜTUNLARDA TUTULMAZ.
 * Örnek veri bunu açıkça gösterir: tek bir ürünün (MANN-C35154)
 * 7 OEM numarası OEM_CAPRAZ sayfasında 7 satır,
 * 6 motor uyumluluğu UYUMLULUK sayfasında 6 satırdır.
 */
import * as XLSX from 'xlsx'
import { SHEET_DEFS } from './schema'

type Row = Record<string, string | number>

const SAMPLE: Record<string, Row[]> = {
  KATEGORILER: [
    {
      kategori_kodu: 'FILTRELER',
      ust_kategori_kodu: '',
      ad: 'Filtreler',
      slug: 'filtreler',
      sira: 10,
    },
    {
      kategori_kodu: 'HAVA_FILTRESI',
      ust_kategori_kodu: 'FILTRELER',
      ad: 'Hava Filtreleri',
      slug: 'hava-filtreleri',
      sira: 11,
      ozellik_1_anahtar: 'yukseklik_mm',
      ozellik_1_etiket: 'Yükseklik',
      ozellik_1_tip: 'SAYI',
      ozellik_1_birim: 'mm',
      ozellik_2_anahtar: 'filtre_tipi',
      ozellik_2_etiket: 'Filtre tipi',
      ozellik_2_tip: 'SECENEK',
    },
  ],

  ARAC_AGACI: [
    {
      arac_tipi: 'OTOMOBIL',
      arac_markasi: 'AUDI',
      model: 'A1 (GB)',
      model_kodu: 'GB',
      model_yil_baslangic: 2018,
      kasa_tipi: 'Hatchback',
      nesil: 'A1 II (GB)',
      motor_adi: '30 TFSI 1.0 81 kW 110 HP',
      motor_kodu: 'CHZB|CHZJ',
      hacim_cc: 999,
      guc_kw: 81,
      guc_hp: 110,
      yakit: 'BENZIN',
      silindir: 3,
      motor_yil_baslangic: 2018,
      motor_yil_bitis: 2024,
    },
    {
      arac_tipi: 'OTOMOBIL',
      arac_markasi: 'AUDI',
      model: 'A1 (GB)',
      model_kodu: 'GB',
      model_yil_baslangic: 2018,
      nesil: 'A1 II (GB)',
      motor_adi: '25 TFSI 1.0 70 kW 95 HP',
      motor_kodu: 'DKRF',
      hacim_cc: 999,
      guc_kw: 70,
      guc_hp: 95,
      yakit: 'BENZIN',
      motor_yil_baslangic: 2018,
      motor_yil_bitis: 2024,
    },
  ],

  URUNLER: [
    {
      sku: 'MANN-C35154',
      urun_adi: 'Hava Filtresi',
      marka: 'MANN-FILTER',
      kategori_kodu: 'HAVA_FILTRESI',
      urun_kodu: 'C 35 154',
      kisa_aciklama: 'VAG 1.0/1.5 TSI (EA211) motorlar için hava filtresi.',
      durum: 'AKTIF',
      one_cikan: 'HAYIR',
      spec_yukseklik_mm: 58,
      spec_filtre_tipi: 'Panel',
    },
  ],

  FIYAT_STOK: [
    {
      sku: 'MANN-C35154',
      varyant_sku: 'MANN-C35154',
      varyant_adi: 'Tekli',
      ambalaj_miktari: 1,
      birim: 'ADET',
      fiyat_net: '908,25',
      kdv_orani: 20,
      liste_fiyati: '1249,90',
      stok: 24,
      depo_kodu: 'MERKEZ',
    },
  ],

  // ↓ TEK ÜRÜN, 7 OEM NUMARASI → 7 SATIR
  OEM_CAPRAZ: [
    { sku: 'MANN-C35154', tip: 'OEM', marka: 'VW', numara: '04E 129 620 A', not: '' },
    { sku: 'MANN-C35154', tip: 'OEM', marka: 'VW', numara: '04E 129 620 B', not: '' },
    { sku: 'MANN-C35154', tip: 'OEM', marka: 'AUDI', numara: '04E 129 620 C', not: '' },
    { sku: 'MANN-C35154', tip: 'OEM', marka: 'SEAT', numara: '04E 129 620 D', not: '' },
    { sku: 'MANN-C35154', tip: 'OEM', marka: 'SKODA', numara: '04E 129 620 E', not: '' },
    { sku: 'MANN-C35154', tip: 'CROSS_EQUIVALENT', marka: 'FILTRON', numara: 'AP 182/2', not: 'muadil' },
    { sku: 'MANN-C35154', tip: 'CROSS_EQUIVALENT', marka: 'BOSCH', numara: 'F 026 400 220', not: 'muadil' },
  ],

  // ↓ TEK ÜRÜN, ÇOK MOTOR → HER İLİŞKİ AYRI SATIR
  UYUMLULUK: [
    {
      sku: 'MANN-C35154',
      uyumluluk_tipi: 'UYUMLU',
      arac_tipi: 'OTOMOBIL',
      arac_markasi: 'AUDI',
      model: 'A1 (GB)',
      motor_kodu: 'CHZB',
      motor_adi: '30 TFSI 1.0 81 kW 110 HP',
      hacim_cc: 999,
      guc_hp: 110,
      yil_baslangic: 2018,
      yil_bitis: 2024,
    },
    {
      sku: 'MANN-C35154',
      uyumluluk_tipi: 'UYUMLU',
      arac_tipi: 'OTOMOBIL',
      arac_markasi: 'AUDI',
      model: 'A1 (GB)',
      motor_kodu: 'DKRF',
      motor_adi: '25 TFSI 1.0 70 kW 95 HP',
      hacim_cc: 999,
      guc_hp: 95,
      yil_baslangic: 2018,
      yil_bitis: 2024,
    },
    {
      sku: 'MANN-C35154',
      uyumluluk_tipi: 'UYUMSUZ',
      arac_tipi: 'OTOMOBIL',
      arac_markasi: 'AUDI',
      model: 'A1 (GB)',
      motor_kodu: 'DADA',
      motor_adi: '40 TFSI 2.0 152 kW 207 HP',
      hacim_cc: 1984,
      guc_hp: 207,
      kisit_notu: '',
      not: 'farklı gövde ölçüsü',
    },
  ],
}

export function buildTemplateWorkbook(): Buffer {
  const wb = XLSX.utils.book_new()

  // ── 0. sayfa: NASIL KULLANILIR ──────────────────────────────────────────
  const guide: string[][] = [
    ['OTO CENTER MARKET — İÇE AKTARMA ŞABLONU (CSV_V1)'],
    [],
    ['TEMEL KURAL — İLİŞKİSEL YAPI'],
    ['Çoklu OEM numarası ve çoklu motor uyumluluğu YAN YANA SÜTUNLARDA TUTULMAZ.'],
    ['Her OEM numarası OEM_CAPRAZ sayfasında AYRI BİR SATIRDIR.'],
    ['Her ürün–motor ilişkisi UYUMLULUK sayfasında AYRI BİR SATIRDIR.'],
    ['Bir ürünün 7 OEM numarası ve 312 motor uyumluluğu varsa 7 + 312 = 319 satır yazılır.'],
    ['Sayfalar arası bağ SKU sütunu ile kurulur.'],
    [],
    ['YÜKLEME SIRASI'],
    ['1. KATEGORILER   → bağımsız'],
    ['2. ARAC_AGACI    → bağımsız'],
    ['3. URUNLER       → kategori ve marka gerekir'],
    ['4. FIYAT_STOK    → ürün gerekir'],
    ['5. OEM_CAPRAZ    → ürün gerekir'],
    ['6. UYUMLULUK     → ürün + araç ağacı gerekir'],
    ['Tek dosyada hepsi birden gönderilebilir; sistem doğru sırada işler.'],
    [],
    ['BİÇİM KURALLARI'],
    ['Ondalık ayırıcı: , veya .  (1249,90 = 1249.90)'],
    ['Binlik ayırıcı KULLANMAYIN (1.249,90 yanlış)'],
    ['Yıl: 4 hane (2018)'],
    ['Evet/Hayır: EVET / HAYIR (1/0, TRUE/FALSE de kabul)'],
    ['Boş hücre = "bu alanı değiştirme"'],
    ['Alanı temizlemek için: [BOŞALT]'],
    ['Çoklu motor kodu: CHZB|CHZJ'],
    ['Bir modelin tüm motorları: motor_kodu sütununa TUM_MOTORLAR yazın'],
    [],
    ['UYUMSUZLUK DA VERİDİR'],
    ['uyumluluk_tipi = UYUMSUZ yazıldığında sistem o motoru kırmızı işaretler.'],
    ['Bu, yanlış parça iadesini azaltan en etkili alandır.'],
    [],
    ['VERİ KALİTESİ — ÖNEMLİ'],
    ['Sistem, iki kaynak çelişirse kaydı ÇAKIŞMA (CONFLICTED) olarak işaretler.'],
    ['Çakışmalı veya doğrulanmamış kayıtlar müşteriye ASLA "Aracınıza uygun ✓" gösterilmez.'],
    ['Emin olmadığınız uyumlulukları yüklemeyin.'],
    [],
    ['HATA YÖNETİMİ'],
    ['Hatalı bir satır bütün import\'u bozmaz.'],
    ['Önizlemede "9.850 geçerli / 150 hatalı" şeklinde görürsünüz;'],
    ['onaylarsanız yalnızca geçerli satırlar uygulanır, hatalılar rapor edilir.'],
    ['Uygulanan her import tek tıkla geri alınabilir.'],
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(guide), 'NASIL_KULLANILIR')

  // ── Veri sayfaları ──────────────────────────────────────────────────────
  for (const def of [...SHEET_DEFS].sort((a, b) => a.order - b.order)) {
    const headers = def.fields.map((f) => f.key)
    // ürün sayfasındaki örnek spec_ sütunları
    const extraHeaders =
      def.name === 'URUNLER' ? ['spec_yukseklik_mm', 'spec_filtre_tipi'] : []
    const allHeaders = [...headers, ...extraHeaders]

    const rows = (SAMPLE[def.name] ?? []).map((r) => allHeaders.map((h) => r[h] ?? ''))
    const ws = XLSX.utils.aoa_to_sheet([allHeaders, ...rows])

    ws['!cols'] = allHeaders.map((h) => ({ wch: Math.max(12, Math.min(28, h.length + 4)) }))
    ws['!freeze'] = { xSplit: 0, ySplit: 1 }
    XLSX.utils.book_append_sheet(wb, ws, def.name)
  }

  // ── Sütun sözlüğü ───────────────────────────────────────────────────────
  const dict: string[][] = [['Sayfa', 'Sütun', 'Etiket', 'Tip', 'Zorunlu', 'Örnek', 'Not']]
  for (const def of [...SHEET_DEFS].sort((a, b) => a.order - b.order)) {
    for (const f of def.fields) {
      dict.push([
        def.name,
        f.key,
        f.label,
        f.type === 'enum' ? `SEÇENEK: ${(f.values ?? []).join(' | ')}` : f.type,
        f.required ? 'EVET' : '',
        f.example ?? '',
        f.note ?? '',
      ])
    }
  }
  const dictWs = XLSX.utils.aoa_to_sheet(dict)
  dictWs['!cols'] = [{ wch: 16 }, { wch: 24 }, { wch: 24 }, { wch: 34 }, { wch: 9 }, { wch: 22 }, { wch: 50 }]
  XLSX.utils.book_append_sheet(wb, dictWs, 'SUTUN_SOZLUGU')

  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
}
