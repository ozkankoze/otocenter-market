# OTO CENTER MARKET — CSV / EXCEL İÇE AKTARMA FORMATI

**Sürüm:** v1.0 · Şema kimliği `CSV_V1`
**İlgili doküman:** `03-FINAL-MIMARI.md` §9
**Örnek dosyalar:** `ornek-veri/` klasörü · Excel şablonu: `oto-center-market-import-sablonu.xlsx`

> ⚠ **Örnek dosyalardaki parça numaraları, OEM kodları ve fiyatlar formatı göstermek için üretilmiş temsili verilerdir.** Gerçek katalog verisiyle doğrulanmadan kullanılmamalıdır.

---

## 1. GENEL KURALLAR

| Konu | Kural |
|---|---|
| Dosya formatı | `.csv` veya `.xlsx` (ilk sayfa okunur) |
| Ayırıcı | `;` **(önerilen)** — `,` ve `TAB` otomatik algılanır |
| Kodlama | **UTF-8 with BOM** (Excel'de "CSV UTF-8" olarak kaydedin) |
| İlk satır | Zorunlu başlık satırı; sütun sırası önemsiz |
| Ondalık ayırıcı | `,` veya `.` — ikisi de kabul edilir (`1249,90` = `1249.90`) |
| Binlik ayırıcı | **Kullanmayın** (`1.249,90` ✗ · `1249,90` ✓) |
| Tarih / yıl | 4 haneli yıl (`2018`). Ay gerekiyorsa ayrı sütun (`2018` + `05`) |
| Boş hücre | "Bu alanı **değiştirme**" anlamına gelir |
| Alanı boşaltma | `[BOŞALT]` yazın |
| Evet/Hayır | `EVET` / `HAYIR` (`1`/`0`, `TRUE`/`FALSE` de kabul) |
| Büyük/küçük harf | Kod ve enum alanlarında önemsiz — sistem normalize eder |
| Satır limiti | Dosya başına 200.000 satır (üzeri bölünmeli) |
| Dosya boyutu | Maks. 100 MB |

### 1.1 Zorunlu yükleme sırası

```
1. kategoriler.csv     ─┐
2. arac-agaci.csv      ─┘  (bunlar bağımsız, paralel yüklenebilir)
3. urunler.csv             (kategori ve marka referansı gerekir)
4. fiyat-stok.csv          (ürün gerekir)
5. oem-capraz.csv          (ürün gerekir)
6. uyumluluk.csv           (ürün + araç ağacı gerekir)
```

Yanlış sırada yüklenirse sihirbaz uyarır ve eksik referansları listeler.

### 1.2 Her import'un yaşam döngüsü

```
Dosya yükle → Sütun eşleştirme → Doğrulama → DRY-RUN önizleme → Onay → Uygula
                                                    │
                                                    ├─ "1.240 satır: 980 yeni, 210 güncelleme, 50 hata"
                                                    └─ hata raporunu Excel olarak indir
```
**Hiçbir import onaysız yazmaz.** Uygulanan her job tek tıkla geri alınabilir.

---

## 2. `kategoriler.csv`

Kategori ağacı ve her kategorinin teknik özellik (facet) tanımları.

| Sütun | Zorunlu | Tip | Açıklama | Örnek |
|---|---|---|---|---|
| `kategori_kodu` | ✔ | metin | Benzersiz kod (SKU gibi davranır) | `HAVA_FILTRESI` |
| `ust_kategori_kodu` | | metin | Üst kategori kodu; boşsa kök | `FILTRELER` |
| `ad` | ✔ | metin | Görünen ad | `Hava Filtreleri` |
| `slug` | | metin | Boşsa addan üretilir (Türkçe karakter dönüştürülür) | `hava-filtreleri` |
| `sira` | | sayı | Menü sırası | `10` |
| `aciklama` | | metin | Kategori açıklaması | |
| `seo_baslik` | | metin | ≤ 60 karakter | |
| `seo_aciklama` | | metin | ≤ 155 karakter | |
| `seo_giris_metni` | | metin | Liste sayfası üstündeki içerik bloğu | |
| `ozellik_1_anahtar` … `ozellik_8_anahtar` | | metin | Facet alan adı | `yukseklik_mm` |
| `ozellik_1_etiket` … | | metin | Görünen etiket | `Yükseklik` |
| `ozellik_1_tip` … | | enum | `SAYI` \| `METIN` \| `SECENEK` \| `EVET_HAYIR` | `SAYI` |
| `ozellik_1_birim` … | | metin | | `mm` |
| `ozellik_1_secenekler` … | | metin | `SECENEK` tipinde `\|` ile ayrılmış | `Panel\|Silindirik` |

**Not:** Facet tanımları burada yüklenince, `urunler.csv` içindeki `spec_yukseklik_mm` sütunu otomatik tanınır ve ürün detayında "Yükseklik: 58 mm" olarak görünür. Yeni bir teknik özellik eklemek **kod değişikliği gerektirmez.**

---

## 3. `arac-agaci.csv`

Araç tipi → marka → model → nesil → motor. Denormalize tek dosya; sistem ağacı kurar.

| Sütun | Zorunlu | Tip | Açıklama | Örnek |
|---|---|---|---|---|
| `arac_tipi` | ✔ | enum | `OTOMOBIL` \| `HAFIF_TICARI` \| `AGIR_VASITA` \| `OTOBUS` \| `IS_MAKINESI` \| `TRAKTOR` \| `MOTOSIKLET` | `OTOMOBIL` |
| `arac_markasi` | ✔ | metin | | `AUDI` |
| `marka_slug` | | metin | Boşsa üretilir | `audi` |
| `model` | ✔ | metin | | `A1 (GB)` |
| `model_kodu` | | metin | Üretici gövde kodu | `GB` |
| `model_yil_baslangic` | | yıl | | `2018` |
| `model_yil_bitis` | | yıl | Devam ediyorsa boş | |
| `kasa_tipi` | | metin | | `Hatchback` |
| `nesil` | | metin | Boşsa modelle aynı ad kullanılır | `A1 II (GB)` |
| `nesil_kodu` | | metin | | `GB` |
| `motor_adi` | ✔ | metin | Kullanıcıya görünen ad | `30 TFSI 1.0` |
| `motor_kodu` | ✔* | metin | `\|` ile çoklu (`CHZB\|CHZJ`) | `CHZB` |
| `hacim_cc` | | sayı | | `999` |
| `guc_kw` | | sayı | | `81` |
| `guc_hp` | | sayı | | `110` |
| `yakit` | ✔ | enum | `BENZIN` \| `DIZEL` \| `LPG` \| `HIBRIT` \| `ELEKTRIK` \| `CNG` | `BENZIN` |
| `silindir` | | sayı | | `3` |
| `supap` | | sayı | | `12` |
| `motor_yil_baslangic` | | yıl | | `2018` |
| `motor_yil_bitis` | | yıl | | `2024` |
| `dis_kimlik` | | metin | `kaynak:kimlik` formatında (`tecdoc:12345`) | |

`*` `motor_kodu` teknik olarak zorunlu değildir ama **kesinlikle önerilir** — uyumluluk eşleştirmesinin en güvenilir anahtarıdır.

---

## 4. `urunler.csv`

| Sütun | Zorunlu | Tip | Açıklama | Örnek |
|---|---|---|---|---|
| `sku` | ✔ | metin | **Benzersiz ürün anahtarı.** Tüm diğer dosyalar buna referans verir | `MANN-C35154` |
| `urun_adi` | ✔ | metin | | `Hava Filtresi` |
| `marka` | ✔ | metin | Ürün markası; yoksa oluşturulur | `MANN-FILTER` |
| `kategori_kodu` | ✔ | metin | `kategoriler.csv`'deki kod | `HAVA_FILTRESI` |
| `urun_kodu` | | metin | Üretici kodu (görünen) | `C 35 154` |
| `slug` | | metin | Boşsa `marka-urun_kodu`'ndan üretilir | `mann-c-35-154` |
| `kisa_aciklama` | | metin | Kart ve liste için, ≤ 160 karakter | |
| `aciklama` | | metin | Ürün detay açıklaması (HTML değil, düz metin) | |
| `durum` | | enum | `TASLAK` \| `AKTIF` \| `ARSIV` — varsayılan `AKTIF` | `AKTIF` |
| `one_cikan` | | evet/hayır | | `HAYIR` |
| `gorsel_1` … `gorsel_5` | | URL | Tam URL veya yükleme klasöründeki dosya adı | |
| `seo_baslik` | | metin | | |
| `seo_aciklama` | | metin | | |
| `oem_numaralari` | | metin | **Kolaylık alanı** — `\|` ile ayrılmış, satırlara bölünür | `04E129620A\|04E129620B` |
| `spec_*` | | değişken | Teknik özellik. `kategoriler.csv`'de tanımlı anahtarlar | `spec_yukseklik_mm` = `58` |

### Örnek `spec_*` sütunları

| Kategori | Kullanılan spec sütunları |
|---|---|
| Hava filtresi | `spec_yukseklik_mm` · `spec_dis_cap_mm` · `spec_ic_cap_mm` · `spec_uzunluk_mm` · `spec_genislik_mm` · `spec_filtre_tipi` |
| Yağ filtresi | `spec_yukseklik_mm` · `spec_dis_cap_mm` · `spec_dis_capi_2_mm` · `spec_dis_olcusu` · `spec_bypass_valfi` |
| Polen filtresi | `spec_uzunluk_mm` · `spec_genislik_mm` · `spec_yukseklik_mm` · `spec_filtre_tipi` |
| Motor yağı | `spec_viskozite` · `spec_acea` · `spec_api` · `spec_oem_onayi` · `spec_yag_tipi` |
| Antifriz | `spec_renk` · `spec_spesifikasyon` · `spec_konsantre` |

Tanımlı olmayan bir `spec_*` sütunu gelirse sihirbaz sorar: *"`spec_bypass_valfi` tanımlı değil. Kategoriye ekleyeyim mi?"*

---

## 5. `fiyat-stok.csv`

| Sütun | Zorunlu | Tip | Açıklama | Örnek |
|---|---|---|---|---|
| `sku` | ✔ | metin | Ürün SKU'su | `MANN-C35154` |
| `varyant_sku` | | metin | Boşsa varsayılan varyant | `LIQUI-3707-5L` |
| `varyant_adi` | | metin | Ambalaj adı | `5 L` |
| `ambalaj_miktari` | | sayı | | `5` |
| `birim` | | enum | `ADET` \| `LT` \| `KG` | `LT` |
| `barkod` | | metin | EAN-13 | `4100420035494` |
| `fiyat_net` | ✔ | ondalık | **KDV hariç** satış fiyatı | `1041,58` |
| `kdv_orani` | ✔ | sayı | Yüzde | `20` |
| `liste_fiyati` | | ondalık | Üstü çizili gösterilecek fiyat (KDV dahil) | `1499,90` |
| `para_birimi` | | metin | Varsayılan `TRY` | `TRY` |
| `stok` | ✔ | sayı | Adet | `12` |
| `depo_kodu` | | metin | Varsayılan `MERKEZ` | `MERKEZ` |
| `tedarik_suresi_gun` | | sayı | Stok 0 ise tahmini tedarik | `3` |
| `agirlik_gr` | | sayı | Kargo hesabı için | `210` |
| `musteri_grubu` | | metin | Varsayılan `RETAIL`; B2B için `BAYI` | `RETAIL` |
| `gecerli_baslangic` | | tarih | İleri tarihli fiyat için | `2026-09-01` |

**KDV notu:** Sistem `fiyat_net` + `kdv_orani` saklar, KDV dahil fiyatı hesaplar. Elinizde KDV dahil fiyat varsa `fiyat_net` sütununa `1249,90 / 1,20` hesabını yazın ya da sihirbazdaki **"Fiyatlarım KDV dahil"** kutusunu işaretleyin — dönüşümü sistem yapar.

---

## 6. `oem-capraz.csv` — ÇOKLU OEM NUMARASI

> **Kural: her numara ayrı bir satırdır.** Bir ürünün 7 OEM numarası varsa 7 satır yazılır.

| Sütun | Zorunlu | Tip | Açıklama | Örnek |
|---|---|---|---|---|
| `sku` | ✔ | metin | Ürün SKU'su (tekrar eder) | `MANN-C35154` |
| `tip` | ✔ | enum | `OEM` \| `CROSS_EQUIVALENT` \| `CROSS_REPLACES` \| `CROSS_REPLACED_BY` | `OEM` |
| `marka` | ✔ | metin | OEM'de araç markası, çaprazda rakip marka | `VW` / `FILTRON` |
| `numara` | ✔ | metin | Orijinal yazımıyla; sistem normalize eder | `04E 129 620 A` |
| `not` | | metin | | `2020 öncesi` |

### Tip anlamları

| Tip | Anlamı | Nerede görünür |
|---|---|---|
| `OEM` | Araç üreticisinin orijinal numarası | "OEM Numaraları" tabı + `/oem/...` SEO sayfası |
| `CROSS_EQUIVALENT` | Rakip üreticinin muadili | "Eşdeğer Ürünler" tabı |
| `CROSS_REPLACES` | Bu ürün, şu eski kodun yerine geçer | Eski kod aramasında bu ürün çıkar |
| `CROSS_REPLACED_BY` | Bu ürünün yerine şu geçti | "Bu ürünün yerine X kullanılıyor" uyarısı |

### Örnek — bir üründe 7 referans

```csv
sku;tip;marka;numara;not
MANN-C35154;OEM;VW;04E 129 620 A;
MANN-C35154;OEM;VW;04E 129 620 B;
MANN-C35154;OEM;AUDI;04E 129 620 C;
MANN-C35154;OEM;SEAT;04E 129 620 D;
MANN-C35154;OEM;SKODA;04E 129 620 E;
MANN-C35154;CROSS_EQUIVALENT;FILTRON;AP 182/2;muadil
MANN-C35154;CROSS_EQUIVALENT;BOSCH;F 026 400 220;muadil
```

### Normalizasyon

Sistem her numarayı arama için normalize eder:
```
normalize(x) = büyük harfe çevir, harf ve rakam dışındaki her şeyi sil

'04E 129 620 A'  →  04E129620A
'04e-129-620-a'  →  04E129620A
'AP 182/2'       →  AP1822
'C 35 154'       →  C35154
```
Kullanıcı hangi yazımla ararsa arasın ürünü bulur. **Görünen numara orijinal yazımıyla saklanır**, normalize edilmiş hali yalnızca aramada kullanılır.

### Kolaylık alternatifi

`urunler.csv` içindeki `oem_numaralari` sütununa `04E129620A|04E129620B|04E129620C` yazabilirsiniz. Sihirbaz bunu otomatik ayrı satırlara böler ve önizlemede *"3 OEM kaydına açılacak"* uyarısı gösterir. Ancak marka bilgisi ve not taşıyamazsınız — **önerilen format `oem-capraz.csv`'dir.**

---

## 7. `uyumluluk.csv` — ÇOKLU ARAÇ / MOTOR UYUMLULUĞU

> **Kural: her ürün-motor ilişkisi ayrı bir satırdır.** Bir ürün 312 motora uyuyorsa 312 satır yazılır.

| Sütun | Zorunlu | Tip | Açıklama | Örnek |
|---|---|---|---|---|
| `sku` | ✔ | metin | Ürün SKU'su (tekrar eder) | `MANN-C35154` |
| `uyumluluk_tipi` | | enum | `UYUMLU` (varsayılan) \| `UYUMSUZ` | `UYUMLU` |
| `arac_tipi` | ✔ | enum | `arac-agaci.csv` ile aynı | `OTOMOBIL` |
| `arac_markasi` | ✔ | metin | | `AUDI` |
| `model` | ✔ | metin | | `A1 (GB)` |
| `motor_kodu` | ✔* | metin | En güvenilir eşleştirme anahtarı. `TUM_MOTORLAR` özel değeri | `CHZB` |
| `motor_adi` | ✔* | metin | `motor_kodu` yoksa bununla eşleşir | `30 TFSI 1.0` |
| `hacim_cc` | | sayı | Belirsizlik varsa ayırt eder | `999` |
| `guc_hp` | | sayı | Belirsizlik varsa ayırt eder | `110` |
| `yil_baslangic` | | yıl | Boşsa motorun kendi aralığı | `2018` |
| `yil_bitis` | | yıl | | `2024` |
| `ay_baslangic` | | 1-12 | Ay hassasiyeti gerekiyorsa | `5` |
| `ay_bitis` | | 1-12 | | `3` |
| `kisit_notu` | | metin | Koşullu uyumluluk | `Şasi no 8XJ050001 sonrası` |
| `not` | | metin | İç not | |

`*` `motor_kodu` **veya** `motor_adi`'ndan en az biri zorunludur.

### Örnek — bir ürün, çok araç

```csv
sku;uyumluluk_tipi;arac_tipi;arac_markasi;model;motor_kodu;motor_adi;hacim_cc;guc_hp;yil_baslangic;yil_bitis;kisit_notu
MANN-C35154;UYUMLU;OTOMOBIL;AUDI;A1 (GB);CHZB;30 TFSI 1.0;999;110;2018;2024;
MANN-C35154;UYUMLU;OTOMOBIL;AUDI;A1 (GB);DKRF;25 TFSI 1.0;999;95;2018;2024;
MANN-C35154;UYUMLU;OTOMOBIL;VOLKSWAGEN;POLO VI;CHZB;1.0 TSI;999;110;2017;2023;
MANN-C35154;UYUMLU;OTOMOBIL;SEAT;IBIZA V;CHZB;1.0 TSI;999;110;2017;2024;
MANN-C35154;UYUMLU;OTOMOBIL;SKODA;FABIA IV;DKRF;1.0 TSI;999;95;2021;2024;Klimalı araçlar
MANN-C35154;UYUMSUZ;OTOMOBIL;AUDI;A1 (GB);DADA;40 TFSI 2.0;1984;207;2019;2024;farklı gövde ölçüsü
```

Son satır dikkat: **uyumsuzluk da veridir.** `UYUMSUZ` yazıldığında sistem o motoru ürün için kırmızı işaretler ve varsayılan listelerde gizler. Bu, "yanlış parça" iadelerini azaltan en etkili alandır.

### `TUM_MOTORLAR` toplu genişletme

Bir ürün bir modelin tüm motorlarına uyuyorsa:

```csv
sku;uyumluluk_tipi;arac_tipi;arac_markasi;model;motor_kodu;motor_adi
FILTRON-AP1822;UYUMLU;OTOMOBIL;AUDI;A1 (GB);TUM_MOTORLAR;
```

Dry-run önizlemesinde uyarı çıkar:
```
⚠ 1 satır → 12 motora genişleyecek
   CHZB, DKRF, DADA, DKLA, CZCA, DLAA, DKZA, DADB, CZEA, DKZC, DAJB, DKZB
   [Genişletmeyi onayla]  [Motorları tek tek seç]  [İptal]
```
Onaylanırsa 12 ayrı kayıt oluşur; her birine `expandedFrom` damgası yazılır, yani hangi satırdan geldiği izlenebilir kalır.

### Motor eşleştirme sırası

```
1. motor_kodu tam eşleşme (engineCodes dizisinde arar)              ← en güvenilir
2. arac_markasi + model + motor_adi (normalize edilmiş metin)
3. arac_markasi + model + hacim_cc + guc_hp
4. Bulunamadı → satır HATA
   Hata raporunda: "AUDI A1 (GB) / CHZX motoru araç ağacında yok"
   Sihirbazda tek tık: [Bu motoru araç ağacına ekle]
```

---

## 8. HATA RAPORU FORMATI

Hatalı satırlar Excel olarak indirilir. Orijinal sütunlar korunur, sona 3 sütun eklenir:

| Ek sütun | İçerik |
|---|---|
| `_satir_no` | Kaynak dosyadaki satır numarası |
| `_durum` | `HATA` \| `UYARI` \| `ATLANDI` |
| `_mesaj` | İnsan tarafından okunabilir açıklama |

```
_satir_no  _durum  _mesaj
   312     HATA    Motor bulunamadı: AUDI / A1 (GB) / CHZX
   488     HATA    Ürün bulunamadı: sku 'MANN-C99999'
   501     UYARI   Yıl aralığı motorun üretim aralığı dışında (2015 < 2018) — kırpıldı
   677     UYARI   Bu OEM numarası (04E129620A) zaten 2 ürüne bağlı
   902     ATLANDI Aynı ilişki bu dosyada 2. kez geçiyor
```

Düzeltip aynı dosyayı tekrar yükleyin; sistem daha önce başarıyla işlenen satırları tekrar işlemez.

---

## 9. HATA KODLARI

| Kod | Anlam | Çözüm |
|---|---|---|
| `E_SKU_NOT_FOUND` | Ürün yok | Önce `urunler.csv` yükleyin |
| `E_ENGINE_NOT_FOUND` | Motor araç ağacında yok | `arac-agaci.csv` güncelleyin veya sihirbazdan ekleyin |
| `E_CATEGORY_NOT_FOUND` | Kategori kodu tanımsız | `kategoriler.csv` yükleyin |
| `E_DUPLICATE_SKU` | Dosyada aynı SKU 2 kez | Satırları birleştirin |
| `E_INVALID_ENUM` | Geçersiz enum değeri | Sözlükteki değerleri kullanın |
| `E_INVALID_NUMBER` | Sayısal alanda metin | Binlik ayırıcıyı kaldırın |
| `E_REQUIRED_MISSING` | Zorunlu alan boş | Doldurun |
| `W_YEAR_CLAMPED` | Yıl aralığı kırpıldı | Bilgi amaçlı |
| `W_OEM_MULTI_PRODUCT` | OEM birden çok üründe | Çakışma ekranında incelenir |
| `W_PRICE_DEVIATION` | Fiyat %30+ değişti | Onaylayın veya düzeltin |
| `W_EXPANSION_LARGE` | `TUM_MOTORLAR` 50+ motora açılıyor | Onaylayın |

---

## 10. ÖRNEK DOSYALAR

`ornek-veri/` klasöründe, birbirine referans veren tutarlı bir örnek set:

| Dosya | Satır | İçerik |
|---|---|---|
| `01-kategoriler.csv` | 14 | Filtre + yağ kategorileri, facet tanımlarıyla |
| `02-arac-agaci.csv` | 18 | Audi / VW / SEAT / Škoda / Ford / Mercedes — model ve motorlarıyla |
| `03-urunler.csv` | 12 | 5 markadan filtre ve yağ ürünleri, teknik özellikleriyle |
| `04-fiyat-stok.csv` | 15 | Varyantlı (1 L / 4 L / 5 L) fiyat ve stok |
| `05-oem-capraz.csv` | 34 | **Çoklu OEM örneği** — tek üründe 7 referans |
| `06-uyumluluk.csv` | 41 | **Çoklu araç örneği** + `UYUMSUZ` + `TUM_MOTORLAR` + kısıt notu |

Excel şablonu (`oto-center-market-import-sablonu.xlsx`) aynı içeriği 6 sayfa + 1 talimat sayfası olarak içerir; veri girişi yapacak kişi için hazırlanmıştır.
