/**
 * ════════════════════════════════════════════════════════════════════════════
 *  ÖNE ÇIKAN ÜRÜNLER
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Ana sayfadaki "öne çıkanlar" şeridi bu listeden beslenir (`product.is_featured`).
 *
 *  SEÇİM KURALI — hepsi ölçülebilir, hiçbiri keyfî değil:
 *
 *    1. GERÇEK FOTOĞRAFI OLAN ürünler. Ürün görsellerinin 2.085'i kaynaktan
 *       gelen gerçek fotoğraf (`.webp`), 592'si bizim ürettiğimiz kategori
 *       çizimi (`.png`). Vitrine yalnızca gerçek fotoğraflılar çıkar; çizimle
 *       dolu bir şerit siteyi yarım gösterir.
 *    2. EN AZ 3 ARACA UYUMLU olanlar. Tıklayan kullanıcı boş bir uyumluluk
 *       listesi görmesin.
 *    3. KATEGORİYE DAĞITILMIŞ: yağ/hava/yakıt/polen ana kategorileri ağırlıkta,
 *       ağır vasıtadan da birer örnek. Yirmi tane yağ filtresi vitrin değildir.
 *    4. MARKAYA DENGELİ: 9 FILTRON · 11 MANN-FILTER.
 *    5. Kategori içindeki sıra `md5(sku)` ile belirlendi — rastgele ama
 *       TEKRARLANABİLİR. Aynı liste her kurulumda aynı çıkar.
 *
 *  DEĞİŞTİRMEK İÇİN: aşağıdaki listeyi düzenleyin, sonra
 *      npm run db:urun-import-uret
 *  ile içe aktarma dosyasını tazeleyin. Canlıdaki veritabanına yansıması için
 *  içe aktarmayı yeniden uygulamanız ya da 0004 migration'ını çalıştırmanız
 *  gerekir.
 *
 *  DİKKAT: buradaki SKU'lar katalogda YOKSA `urun-import-uret` hata verir.
 *  Sessizce yok sayılmaz — vitrinin boş kalmasındansa kurulumun durması iyidir.
 */
export const ONE_CIKAN_SKULAR: readonly string[] = [
  // ── Hava filtreleri ───────────────────────────────────────────────────────
  'FILTRON-AP1497',
  'FILTRON-AP1792',
  'FILTRON-AP1909',
  'MANN-C25002',
  'MANN-C28155',
  // ── Yağ filtreleri ────────────────────────────────────────────────────────
  'FILTRON-OE6409',
  'FILTRON-OE6724',
  'MANN-HU7001X',
  'MANN-HU7186X',
  // ── Yakıt filtreleri ──────────────────────────────────────────────────────
  'FILTRON-PE995',
  'FILTRON-PP8483',
  'MANN-WK8243',
  'MANN-WK8544',
  // ── Polen / kabin filtreleri ──────────────────────────────────────────────
  'FILTRON-K1302',
  'FILTRON-K1308',
  'MANN-CU17212',
  'MANN-CUK2559',
  'MANN-CUK3172',
  // ── Ağır vasıta ───────────────────────────────────────────────────────────
  'MANN-TB13943X', // kurutucu
  'MANN-H50001', // şanzuman
] as const
