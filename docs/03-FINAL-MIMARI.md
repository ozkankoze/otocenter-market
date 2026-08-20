# OTO CENTER MARKET — NİHAİ MİMARİ (v2.0)

**Durum:** Kodlama öncesi son onay dokümanı
**Yerine geçtiği:** `01-MIMARI-PLAN.md` (v1.0) — bu doküman v1.0'ı günceller ve kesinleştirir
**Tarih:** 16 Ağustos 2026

---

## 0. BU SÜRÜMDE NE DEĞİŞTİ

13 maddelik geri bildiriminizin her biri mimariye işlendi:

| # | Talebiniz | Nereye işlendi | Somut karşılığı |
|---|---|---|---|
| 1 | 1.000 → 100.000+ SKU ölçeklenebilirliği | §1 | `ProductCompatibility` **hash partition** ile kurulur, `EngineCategoryIndex` sayaç tablosu, staging + COPY tabanlı import |
| 2 | CSV import temel özellik olsun | §9 + `04-CSV-IMPORT-FORMATI.md` | 6 dosya tipi, sütun sözlüğü, örnek dosyalar, Excel şablonu |
| 3 | Kaynak abstraction, şema sonradan değişmesin | §2 | **Assertion (iddia) katmanı** — kaynaklar iddia eder, sistem çözümler. TecDoc/MANN/BOSCH eklenince tek satır DDL değişmez |
| 4 | Motor seviyesi doğrulama, veri yoksa "uyumlu" deme | §3 | 5 durumlu uyumluluk enum'u; **çelişkili kayıt da yeşil gösterilmez** |
| 5 | Admin araç ağacı + uyumluluk yönetimi | §10 | Araç ağacı CRUD/merge, çift yönlü uyumluluk matrisi editörü |
| 6 | "Veri Çakışmaları / İnceleme" alanı | §10.4 | `/admin/veri/cakismalar` — kuyruk, karşılaştırma görünümü, tek tıkla çözüm |
| 7 | Programatik SEO ama ürünsüz sayfa yok | §11 | `EngineCategoryIndex.productCount ≥ 1` kuralı; 0 ise sayfa üretilmez, sitemap'e girmez |
| 8 | Filtre Marketim'den belirgin ayrışma | §13 | Madde madde karşılaştırma tablosu + tasarım kararları |
| 9 | Gerçekçi verilerle tasarım önizlemesi | `onizleme.html` | Çalışan araç seçici, açılan mega menü, gerçekçi ürün/fiyat verileri |
| 10 | Yeni faz sırası | §14 | Faz 0 → DS · Faz 1 → Ana sayfa/Header/Menü/Araç seçici · Faz 2 → Katalog · Faz 3 → DB/Admin/CSV |
| 11 | Ödeme MVP'nin önüne geçmesin | §14 | Ödeme Faz 6'ya alındı; Faz 5 sepet + havale/EFT ile sipariş |
| 12 | iyzico planla, şimdi yapma | §8.6 | `PaymentProvider` arayüzü tanımlı, implementasyon yok |
| 13 | Kodlamadan önce 9 kalemin son hali | §1–§14 | Bu dokümanın tamamı |

**⚠ Bir mimari uyarı (madde 10 hakkında):** Faz 1'deki araç seçici gerçek veri olmadan çalışamaz. Bu yüzden Faz 0'a **çekirdek şema kesiti** (araç ağacı + ürün + uyumluluk tabloları + seed verisi) eklendi. Faz 3'teki "Database" işi ise tam şema, ticaret tabloları, partition ve assertion çözümleme katmanıdır. Detay §14.1'de.

---

## 1. ÖLÇEK STRATEJİSİ — 1.000'DEN 100.000+ SKU'YA

### 1.1 Ölçek varsayımları

| Ölçek | SKU | Motor kaydı | Uyumluluk satırı | OEM/çapraz satır |
|---|---|---|---|---|
| Başlangıç | 1.000 | ~4.000 | ~150.000 | ~8.000 |
| Orta vade | 20.000 | ~15.000 | ~6.000.000 | ~200.000 |
| Hedef | 100.000+ | ~40.000 | **~40.000.000+** | ~1.200.000 |

Kritik nokta: ürün sayısı 100× artarken **uyumluluk satırı 250× artar**. Mimarinin ölçek testi bu tablodur.

### 1.2 Baştan uygulanacak kararlar (sonradan migration gerektirmeyenler)

| Karar | Neden şimdi | 1.000 SKU'da maliyeti |
|---|---|---|
| `ProductCompatibility` **HASH partition** (16 parça, `engine_id` üzerinden) | 40M satırda partition'a sonradan geçmek tam tablo yeniden yazımı demektir | Yok — boş partition'lar bedava |
| `BIGINT` kimlikler (yüksek hacimli tablolarda) | `INT` 2,1 milyarda taşar; uyumluluk + assertion katmanı bunu görebilir | İhmal edilebilir |
| `EngineCategoryIndex` sayaç tablosu | Facet sayımı ve "sayfa var mı" sorgusunu O(1) yapar | Küçük tablo |
| Assertion katmanı (§2) | Sonradan eklemek tüm geçmiş verinin kaynağını kaybettirir | Bir tablo daha |
| Staging tabloları + `COPY` tabanlı import | 500.000 satırlık dosya ORM ile satır satır yazılamaz | Aynı kod yolu |
| `Product.specs` JSONB + GIN | EAV'ye göre 10–50× hızlı facet | Yok |
| Arama soyutlaması (`SearchProvider`) | Postgres FTS → Meilisearch geçişi tek dosya değişikliği olur | Bir arayüz |

### 1.3 Ölçek geldiğinde açılacaklar (mimari hazır, kod sonra)

| Eşik | Aksiyon |
|---|---|
| > 5.000 SKU | Meilisearch/Typesense'e geçiş (`SearchProvider` implementasyonu) |
| > 5M uyumluluk satırı | `EngineCategoryIndex` yenilemesi cron yerine olay tabanlı kuyruğa alınır |
| > 20M uyumluluk satırı | Okuma replikası; katalog sorguları replikaya yönlenir |
| > 50.000 SKU | Ürün görselleri için ayrı CDN kovası + imza tabanlı yükleme |
| Trafik > 1M sayfa/ay | ISR yerine tam statik üretim + on-demand revalidation |

### 1.4 Performans bütçeleri (kabul kriteri)

| Sorgu | Hedef p95 | Ölçüm koşulu |
|---|---|---|
| Motor → uyumlu ürün sayımları | < 60 ms | 40M satır, soğuk cache |
| Motor × kategori → ürün listesi (24 kayıt) | < 150 ms | aynı |
| Kod/OEM araması | < 80 ms | 1,2M referans satırı |
| Autocomplete | < 120 ms | — |
| Araç seçici her adım | < 200 ms | — |
| CSV import | ≥ 5.000 satır/dk | doğrulama dahil |

---

## 2. VERİ KAYNAĞI ABSTRACTION — "ASSERTION" MODELİ

> Talebiniz: *"İleride TecDoc, MANN, FILTRON, BOSCH bağlanabilmeli, database yapısını sonradan değiştirmek zorunda kalmayalım."*

### 2.1 Temel fikir

Klasik yaklaşımda uyumluluk tablosuna doğrudan yazılır ve kaynak bilgisi bir sütunda tutulur. İkinci kaynak geldiğinde ya üzerine yazılır (veri kaybı) ya da çift kayıt oluşur (kirlilik).

Bu mimaride **kaynaklar gerçeği yazmaz, iddia eder.** Sistem iddiaları bir politikayla çözümleyip sitenin okuduğu tek tabloya yazar.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  KATMAN 1 — STAGING           Ham satırlar, hiç yorumlanmadan            │
│  ImportJob · ImportRow        "Excel'de ne yazıyorsa o"                  │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ doğrulama + eşleştirme
┌───────────────────────────────▼─────────────────────────────────────────┐
│  KATMAN 2 — ASSERTION         Kaynak bazlı iddialar. Hiçbiri silinmez.  │
│  CompatibilityAssertion       "MANN kataloğu diyor ki: C 35 154 ↔ CHZB" │
│  OemAssertion                 "TecDoc diyor ki: OEM 04E129620A"         │
│  AttributeAssertion           "BOSCH diyor ki: dış çap 237 mm"          │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ çözümleme politikası (§2.3)
┌───────────────────────────────▼─────────────────────────────────────────┐
│  KATMAN 3 — RESOLVED          Sitenin okuduğu tek doğruluk              │
│  ProductCompatibility · OEMNumber · CrossReference · Product.specs      │
│  + status: VERIFIED / SOURCED / CONFLICTED / INCOMPATIBLE               │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │ çelişki varsa
┌───────────────────────────────▼─────────────────────────────────────────┐
│  DataConflict → /admin/veri/cakismalar  (§10.4)                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Yeni kaynak eklemek ne gerektirir

| Adım | Şema değişikliği? |
|---|---|
| `DataSource` tablosuna bir satır eklenir (`TECDOC`, trustLevel: 90) | **Hayır** — veri girişi |
| O kaynağın formatını okuyan bir **adapter** yazılır (`SourceAdapter` arayüzü) | **Hayır** — yeni dosya, mevcut kod değişmez |
| Adapter, assertion satırları üretir | **Hayır** |
| Çözümleme motoru değişmeden çalışır | **Hayır** |

**Sonuç:** TecDoc, MANN, FILTRON, BOSCH veya bir tedarikçi API'si eklendiğinde tek bir `ALTER TABLE` gerekmez.

```ts
// Arayüz sözleşmesi (uygulama Faz 3'te)
interface SourceAdapter {
  readonly code: string                     // 'CSV_V1' | 'TECDOC' | 'MANN_CATALOG'
  validate(raw: unknown): ValidationResult
  toCompatibilityAssertions(raw: unknown): CompatibilityAssertionDraft[]
  toOemAssertions(raw: unknown): OemAssertionDraft[]
  toAttributeAssertions(raw: unknown): AttributeAssertionDraft[]
}
```

### 2.3 Çözümleme politikası (deterministik, sırayla)

```
1.  Aktif bir MANUAL (admin doğrulaması) iddiası varsa → o kazanır.  status = VERIFIED
2.  Yoksa, en yüksek trustLevel'a sahip kaynağın iddiası alınır.
3.  Aynı trustLevel'da iki kaynak AYNI şeyi söylüyorsa → kazanır.   status = SOURCED
4.  İki kaynak ÇELİŞİYORSA (biri UYUMLU, biri UYUMSUZ / yıl aralıkları
    kesişmiyor) → hiçbiri kazanmaz.                                  status = CONFLICTED
    → DataConflict kaydı açılır, admin kuyruğuna düşer.
5.  Baskın iddia INCOMPATIBLE ise                                    status = INCOMPATIBLE
6.  Hiç iddia yoksa → satır oluşmaz.                                 (kayıt yok = bilinmiyor)
```

**Kritik kural (madde 4'ün doğal uzantısı):** `CONFLICTED` durumundaki bir kayıt kullanıcı arayüzünde **asla yeşil uyumluluk rozeti almaz.** Gri "Uyumluluk teyit edilmedi" gösterilir. Yani veri çelişkisi, kullanıcıya yanlış güven vermek yerine sessizce admin kuyruğuna gider.

### 2.4 Varsayılan güven seviyeleri (admin panelinden değiştirilebilir)

| Kaynak | kind | trustLevel |
|---|---|---|
| Admin manuel doğrulama | `MANUAL` | 100 (her zaman kazanır) |
| TecDoc | `CATALOG` | 90 |
| Üretici kataloğu (MANN, BOSCH, MAHLE…) | `MANUFACTURER` | 80 |
| Tedarikçi listesi | `SUPPLIER` | 60 |
| Kendi Excel/CSV dosyamız | `CSV` | 50 |
| Otomatik türetme (çapraz referanstan çıkarım) | `DERIVED` | 30 |

---

## 3. ARAÇ / ÜRÜN UYUMLULUK MODELİ (NİHAİ)

### 3.1 İlişki seviyesi

Uyumluluk **`Product ↔ VehicleEngine`** arasında kurulur. Model seviyesinde eşleştirme yapılmaz — aynı modelin farklı motorları farklı filtre kullanır ve bu, yanlış parça satmanın en yaygın nedenidir.

```
Product ──< CompatibilityAssertion >── VehicleEngine        (kaynak bazlı iddialar)
                     │ çözümleme
Product ──< ProductCompatibility >── VehicleEngine          (site bunu okur)
```

### 3.2 Uyumluluk durumları ve arayüz karşılıkları

| `status` | Anlamı | Rozet | Renk | Listede |
|---|---|---|---|---|
| `VERIFIED` | Admin doğruladı | `✓ Aracınıza uygun` | Yeşil | Gösterilir, öne alınır |
| `SOURCED` | Kaynak(lar) hemfikir, doğrulanmadı | `✓ Aracınıza uygun` | Yeşil | Gösterilir |
| `CONFLICTED` | Kaynaklar çelişiyor | `Uyumluluk teyit edilmedi` | Gri | Gösterilir, rozet gri |
| `INCOMPATIBLE` | Bu araca uymadığı belirtilmiş | `Bu araca uygun değil` | Kırmızı | Varsayılan filtrede gizli |
| *(kayıt yok)* | Veri yok | `Uyumluluk teyit edilmedi` | Gri | Gösterilir, rozet gri |

`VERIFIED` ile `SOURCED` aynı rozeti taşır; fark tooltip'te belirtilir (*"Kaynak: üretici kataloğu"* / *"Ekibimizce doğrulandı"*). Kullanıcıya gereksiz karmaşıklık yansıtılmaz, ama iç raporlamada ayrışır.

### 3.3 Kısıt (restriction) desteği

Gerçek hayatta uyumluluk çoğu zaman koşulludur:

| Örnek kısıt | Alan |
|---|---|
| "Şasi no 8X-J-050 001'den sonrası" | `restriction` (serbest metin) |
| "Yalnızca klimalı araçlar" | `restriction` |
| "2020/05 – 2024/03 üretim" | `yearFrom` / `yearTo` (+ `monthFrom`/`monthTo`) |
| "Motor kodu CHZB, CHZJ hariç" | ayrı `INCOMPATIBLE` iddiası |

Kısıt varsa ürün kartında rozetin yanında ⓘ ikonu çıkar; ürün detayda tam metin gösterilir. **Kısıtlı uyumluluk, kısıtsız uyumluluktan sonra sıralanır.**

### 3.4 Uyumluluk sorgusu (okuma yolu)

```
engineId = 4471
   │
   ├─► EngineCategoryIndex  ──► kategori sayımları (tek satır okuma, < 5 ms)
   │      "Hava Filtreleri 14 · Yağ Filtreleri 9 · Polen 11 ..."
   │
   └─► ProductCompatibility (partition: hash(4471) → p07)
          WHERE engine_id = 4471
            AND status IN ('VERIFIED','SOURCED','CONFLICTED')
            AND (year_from IS NULL OR year_from <= :yil)
            AND (year_to   IS NULL OR year_to   >= :yil)
          JOIN Product ... JOIN Price ... JOIN Stock
          ORDER BY status='VERIFIED' DESC, restriction IS NULL DESC, ...
```

---

## 4. NİHAİ DATABASE ŞEMASI

> Aşağıdaki tanımlar **spesifikasyondur**, üretim kodu değildir. Onay sonrası Prisma şemasına birebir çevrilecektir.

### 4.1 Enum'lar

```
VehicleFuelType     DIZEL | BENZIN | LPG | HIBRIT | ELEKTRIK | CNG
ProductStatus       DRAFT | ACTIVE | ARCHIVED
CompatStatus        VERIFIED | SOURCED | CONFLICTED | INCOMPATIBLE
AssertionType       COMPATIBLE | INCOMPATIBLE
SourceKind          MANUAL | CATALOG | MANUFACTURER | SUPPLIER | CSV | DERIVED
ImportType          PRODUCT | PRICE_STOCK | OEM_CROSS | COMPATIBILITY | VEHICLE_TREE | CATEGORY
ImportStatus        PENDING | VALIDATING | DRY_RUN_READY | COMMITTING | COMPLETED | FAILED | ROLLED_BACK
ImportRowStatus     OK | WARNING | ERROR | SKIPPED
ConflictStatus      OPEN | RESOLVED | IGNORED
ReferenceType       OEM | CROSS_EQUIVALENT | CROSS_REPLACES | CROSS_REPLACED_BY
UserRole            SUPER_ADMIN | ADMIN | EDITOR | OPERATION | CUSTOMER
OrderStatus         PENDING | CONFIRMED | PREPARING | SHIPPED | DELIVERED | CANCELLED | RETURNED
```

### 4.2 Kaynak, import ve çakışma katmanı

```
DataSource
  id            INT PK
  code          VARCHAR(32)  UNIQUE      -- 'MANUAL','CSV_V1','TECDOC','MANN','BOSCH'
  name          VARCHAR(120)
  kind          SourceKind
  trustLevel    SMALLINT                 -- 0..100
  isActive      BOOLEAN DEFAULT true
  config        JSONB                    -- adapter ayarları (endpoint, kimlik vb.)
  createdAt     TIMESTAMPTZ

ImportJob
  id            BIGINT PK
  type          ImportType
  sourceId      INT  FK→DataSource
  userId        BIGINT FK→User
  fileName      TEXT
  fileHash      CHAR(64)                 -- aynı dosyanın iki kez yüklenmesini yakalar
  mode          'DRY_RUN' | 'COMMIT'
  status        ImportStatus
  totalRows     INT
  okRows / warningRows / errorRows       INT
  createdCount / updatedCount / skippedCount INT
  errorReportUrl TEXT                    -- indirilebilir hata Excel'i
  summary       JSONB                    -- önizleme özeti
  startedAt / finishedAt  TIMESTAMPTZ
  INDEX (type, status, startedAt DESC)

ImportRow                                -- PARTITION BY RANGE (importJobId), 90 gün saklanır
  id            BIGINT
  importJobId   BIGINT FK→ImportJob
  rowNumber     INT
  raw           JSONB                    -- dosyadaki satır, olduğu gibi
  status        ImportRowStatus
  messages      JSONB                    -- [{code,field,message,severity}]
  resultRef     JSONB                    -- oluşan/güncellenen kaydın kimliği
  INDEX (importJobId, status)

DataConflict
  id            BIGINT PK
  entityType    'COMPATIBILITY' | 'OEM' | 'ATTRIBUTE' | 'PRODUCT_FIELD'
  productId     BIGINT FK→Product     NULL
  engineId      BIGINT FK→VehicleEngine NULL
  field         VARCHAR(64)           NULL   -- attribute çakışmasında
  candidates    JSONB                        -- [{sourceId,sourceName,trust,value,assertedAt,assertionId}]
  status        ConflictStatus DEFAULT 'OPEN'
  severity      'HIGH'|'MEDIUM'|'LOW'
  resolvedAssertionId BIGINT NULL
  resolvedByUserId    BIGINT NULL
  resolvedAt / createdAt TIMESTAMPTZ
  INDEX (status, severity, createdAt DESC)
  INDEX (productId), INDEX (engineId)
```

### 4.3 Araç ağacı

```
VehicleType
  id INT PK · name · slug UNIQUE · icon · sortOrder · isActive
  -- Otomobil & Hafif Ticari, Ağır Vasıta, Otobüs, İş Makinesi, Traktör, Motosiklet, Jeneratör

VehicleBrand
  id INT PK · name · slug UNIQUE · logoUrl · country · isPopular · sortOrder · isActive
  externalRefs JSONB                      -- {"tecdoc": 5, "mann": "AUDI"}

VehicleBrandType                          -- N:M (Mercedes hem otomobil hem ağır vasıta)
  brandId INT FK · typeId INT FK · PK(brandId,typeId)

VehicleModel
  id INT PK · brandId FK · name · slug · code          -- 'A1 (GB)', 'a1-gb', 'GB'
  yearFrom SMALLINT · yearTo SMALLINT · bodyType · imageUrl · isActive
  externalRefs JSONB
  UNIQUE (brandId, slug) · INDEX (brandId)

VehicleGeneration                         -- opsiyonel ara katman, UI'da adım değil
  id INT PK · modelId FK · name · code · yearFrom · yearTo · isFacelift
  INDEX (modelId)

VehicleEngine
  id BIGINT PK · generationId FK · modelId FK (denormalize, hızlı sorgu)
  name VARCHAR(120)                       -- '30 TFSI 1.0 81kW 110HP'
  slug VARCHAR(80)                        -- '30-tfsi'
  engineCodes TEXT[]                      -- {'CHZB','CHZJ','DKRF'}
  displacementCc INT · powerKw SMALLINT · powerHp SMALLINT
  fuelType VehicleFuelType · cylinders SMALLINT · valves SMALLINT
  bodyNote · yearFrom · yearTo · isActive
  externalRefs JSONB
  UNIQUE (generationId, slug) · INDEX (modelId) · GIN (engineCodes)
```

### 4.4 Ürün katalogu

```
ProductBrand
  id INT PK · name · slug UNIQUE · logoUrl · country · description
  seoTitle · seoDescription · isFeatured · sortOrder · isActive

Category                                  -- self-referential ağaç
  id INT PK · parentId FK→Category NULL
  name · slug · path LTREE UNIQUE         -- 'filtreler.hava-filtreleri.panel'
  description · imageUrl · icon · sortOrder · isActive
  seoTitle · seoDescription · seoIntro TEXT
  GIST (path) · INDEX (parentId)

CategoryAttribute                         -- facet tanımları; yeni kategori = kod değişikliği YOK
  id INT PK · categoryId FK · key VARCHAR(48)   -- 'yukseklik_mm','viskozite'
  label · unit · dataType 'NUMBER'|'TEXT'|'ENUM'|'BOOL'
  enumValues TEXT[] NULL · isFacet · isFilterable · isComparable · sortOrder
  UNIQUE (categoryId, key)

Product
  id BIGINT PK · sku VARCHAR(64) UNIQUE · slug VARCHAR(140) UNIQUE
  name · brandId FK · categoryId FK       -- kanonik kategori
  shortDescription · description TEXT
  specs JSONB                             -- {"yukseklik_mm":58,"dis_cap_mm":237,...}
  status ProductStatus · isFeatured · sortWeight INT
  seoTitle · seoDescription
  searchVector TSVECTOR                   -- generated, 'turkish' config
  createdAt · updatedAt
  GIN (specs jsonb_path_ops) · GIN (searchVector) · GIN (name gin_trgm_ops)
  INDEX (categoryId, status) · INDEX (brandId, status)

ProductCategory                           -- ek kategoriler (kanonik URL çakışmaz)
  productId BIGINT FK · categoryId INT FK · PK(productId,categoryId)

ProductVariant                            -- 1 L / 4 L / 20 L ambalajlar
  id BIGINT PK · productId FK · sku UNIQUE · name · barcode
  packSize NUMERIC(10,3) · unit 'ADET'|'LT'|'KG' · weightGr INT
  isDefault BOOLEAN · isActive
  INDEX (productId)

Price
  id BIGINT PK · variantId FK
  priceNet NUMERIC(12,2) · taxRate SMALLINT · listPrice NUMERIC(12,2) NULL
  currency CHAR(3) DEFAULT 'TRY'
  customerGroup VARCHAR(24) DEFAULT 'RETAIL'   -- B2B'ye hazır
  validFrom · validTo TIMESTAMPTZ NULL
  UNIQUE (variantId, customerGroup, validFrom)

Stock
  id BIGINT PK · variantId FK · warehouseId INT DEFAULT 1
  quantity INT · reserved INT · leadTimeDays SMALLINT · updatedAt
  UNIQUE (variantId, warehouseId)

ProductImage    id · productId FK · url · alt · sortOrder · isPrimary
ProductDocument id · productId FK · type 'TDS'|'MSDS'|'CERT' · url · title
ProductRelation productId · relatedProductId · type 'EQUIVALENT'|'UPGRADE'|'BUNDLE'|'ACCESSORY' · sortOrder
```

### 4.5 Uyumluluk ve referanslar

```
CompatibilityAssertion                    -- KATMAN 2: iddialar (silinmez)
  id BIGINT PK
  productId BIGINT FK · engineId BIGINT FK
  sourceId INT FK→DataSource · importJobId BIGINT FK NULL
  assertionType AssertionType             -- COMPATIBLE | INCOMPATIBLE
  yearFrom SMALLINT NULL · yearTo SMALLINT NULL
  monthFrom SMALLINT NULL · monthTo SMALLINT NULL
  restriction TEXT NULL · note TEXT NULL
  expandedFrom TEXT NULL                  -- 'TUM_MOTORLAR:model=A1(GB)' izlenebilirliği
  isActive BOOLEAN DEFAULT true
  assertedAt TIMESTAMPTZ
  UNIQUE (productId, engineId, sourceId, assertionType)
  INDEX (productId, engineId) · INDEX (sourceId) · INDEX (importJobId)

ProductCompatibility                      -- KATMAN 3: çözümlenmiş (site bunu okur)
  ────────────────────────────────────────────────────────────────
  PARTITION BY HASH (engineId)  →  16 partition
  ────────────────────────────────────────────────────────────────
  id BIGINT
  productId BIGINT FK · engineId BIGINT FK
  status CompatStatus
  yearFrom · yearTo · monthFrom · monthTo · restriction TEXT NULL
  winningAssertionId BIGINT · sourceId INT · confidence SMALLINT
  hasConflict BOOLEAN DEFAULT false
  verifiedByUserId BIGINT NULL · verifiedAt TIMESTAMPTZ NULL
  updatedAt TIMESTAMPTZ
  PRIMARY KEY (engineId, productId)       -- partition anahtarı PK'nın parçası
  INDEX (engineId, status) INCLUDE (productId)
  INDEX (productId)

ProductReference                          -- OEM + çapraz referans tek tabloda
  id BIGINT PK · productId BIGINT FK
  type ReferenceType                      -- OEM | CROSS_EQUIVALENT | CROSS_REPLACES | ...
  brandName VARCHAR(80) NULL              -- 'VW' (OEM) veya 'FILTRON' (çapraz)
  vehicleBrandId INT FK NULL              -- OEM ise araç markasına bağlanabilir
  number VARCHAR(64)                      -- '04E 129 620 A'
  normalized VARCHAR(64)                  -- '04E129620A'  ← arama bunun üzerinden
  sourceId INT FK · importJobId BIGINT NULL · note TEXT
  UNIQUE (productId, type, normalized)
  INDEX (normalized) · INDEX (productId, type)

  -- normalize(x) = upper(regexp_replace(x, '[^A-Za-z0-9]', '', 'g'))
  -- 'C 35 154' → 'C35154' · 'AP 182/2' → 'AP1822' · 'c-35-154' → 'C35154'

AttributeAssertion                        -- teknik özellik çakışmaları için
  id BIGINT PK · productId FK · key VARCHAR(48) · value JSONB
  sourceId INT FK · importJobId BIGINT NULL · assertedAt
  UNIQUE (productId, key, sourceId)
```

### 4.6 SEO ve türetilmiş tablolar

```
EngineCategoryIndex                       -- programatik SEO + facet sayımı
  engineId BIGINT · categoryId INT
  productCount INT · verifiedCount INT · brandCount SMALLINT
  minPrice NUMERIC(12,2) · maxPrice NUMERIC(12,2)
  updatedAt TIMESTAMPTZ
  PRIMARY KEY (engineId, categoryId)
  INDEX (categoryId, productCount DESC)
  -- productCount = 0 ise sayfa ÜRETİLMEZ, sitemap'e girmez  (§11)

Redirect        id · fromPath UNIQUE · toPath · statusCode DEFAULT 301 · reason · createdAt
SearchLog       id · query · normalizedQuery · resultCount · clickedProductId · sessionId · createdAt
                INDEX (normalizedQuery) · INDEX (resultCount) WHERE resultCount = 0
```

### 4.7 Kullanıcı ve ticaret (Faz 5–6)

```
User            id · email UNIQUE · phone · passwordHash · firstName · lastName
                role UserRole · customerGroup · companyName · taxNumber · taxOffice
                kvkkConsentAt · emailVerifiedAt · createdAt
Address         id · userId FK · title · fullName · phone · city · district
                neighborhood · addressLine · postCode · type 'BILLING'|'SHIPPING'
UserVehicle     id · userId FK · engineId FK · nickname · plate · isDefault · createdAt
Cart            id · userId FK NULL · sessionId · engineId FK NULL · updatedAt
CartItem        id · cartId FK · variantId FK · qty · addedPriceNet · compatStatusAtAdd
Order           id · orderNo UNIQUE · userId FK · status OrderStatus
                subtotalNet · taxTotal · shippingTotal · discountTotal · grandTotal
                currency · paymentMethod · paymentStatus · paymentProvider NULL
                shippingProvider · trackingNo · addresses JSONB · createdAt
OrderItem       id · orderId FK · variantId FK · productSnapshot JSONB
                qty · unitPriceNet · taxRate · lineTotal · vehicleSnapshot JSONB
Coupon          id · code UNIQUE · type · value · conditions JSONB · validFrom · validTo · usageLimit
```

### 4.8 Kritik indeks ve partition tanımları

```sql
-- Uyumluluk: 16 hash partition (baştan kurulur)
CREATE TABLE product_compatibility (...) PARTITION BY HASH (engine_id);
CREATE TABLE product_compatibility_p00 PARTITION OF product_compatibility
  FOR VALUES WITH (MODULUS 16, REMAINDER 0);
-- ... p01 … p15

-- En sık çalışan sorgu
CREATE INDEX ON product_compatibility (engine_id, status) INCLUDE (product_id, restriction);

-- Kod / OEM araması
CREATE INDEX ON product_reference (normalized);
CREATE INDEX ON product_reference (product_id, type);
CREATE INDEX ON product (sku);

-- Türkçe metin araması + yazım hatası toleransı
CREATE INDEX ON product USING GIN (search_vector);
CREATE INDEX ON product USING GIN (name gin_trgm_ops);

-- Facet
CREATE INDEX ON product USING GIN (specs jsonb_path_ops);

-- Kategori ağacı
CREATE INDEX ON category USING GIST (path);

-- Sonuçsuz arama raporu
CREATE INDEX ON search_log (normalized_query) WHERE result_count = 0;
```

---

## 5. ENTITY İLİŞKİ DİYAGRAMI

```
                        ┌──────────────┐
                        │  DataSource  │  MANUAL(100) · TECDOC(90) · MANN(80) · CSV(50)
                        └──┬────────┬──┘
              ┌────────────┘        └──────────────┐
              │ 1:N                            1:N │
     ┌────────▼─────────────────┐        ┌─────────▼──────────┐
     │ CompatibilityAssertion   │        │ ProductReference   │
     │ AttributeAssertion       │        │ (OEM + çapraz)     │
     └────────┬─────────────────┘        └─────────┬──────────┘
              │ çözümleme                          │
              │ (politika §2.3)                    │
     ┌────────▼─────────────────┐                  │
     │  ProductCompatibility    │                  │
     │  status: VERIFIED/…      │◄─── çelişki ──► DataConflict
     └───┬──────────────────┬───┘
    N:1  │                  │  N:1
┌────────▼───────┐   ┌──────▼──────────┐
│    Product     │   │ VehicleEngine   │
└──┬──┬──┬──┬────┘   └──────┬──────────┘
   │  │  │  │               │ N:1
   │  │  │  │        ┌──────▼──────────────┐
   │  │  │  │        │ VehicleGeneration   │
   │  │  │  │        └──────┬──────────────┘
   │  │  │  │               │ N:1
   │  │  │  │        ┌──────▼──────────┐
   │  │  │  │        │  VehicleModel   │
   │  │  │  │        └──────┬──────────┘
   │  │  │  │               │ N:1
   │  │  │  │        ┌──────▼──────────┐      ┌──────────────┐
   │  │  │  │        │  VehicleBrand   │─N:M─►│ VehicleType  │
   │  │  │  │        └─────────────────┘      └──────────────┘
   │  │  │  │
   │  │  │  └── N:1 ─► ProductBrand      (MANN-FILTER, BOSCH…)
   │  │  └───── N:1 ─► Category ──1:N──► CategoryAttribute  (facet tanımları)
   │  │           └── N:M ─► ProductCategory
   │  └──────── 1:N ─► ProductImage · ProductDocument · ProductRelation
   └─────────── 1:N ─► ProductVariant ──1:N──► Price
                                       └─1:N──► Stock

  Türetilmiş:  EngineCategoryIndex (engineId × categoryId → productCount)
               ← ProductCompatibility + Product + Price'tan hesaplanır
```

**Kardinalite özeti**

| İlişki | Tip | Not |
|---|---|---|
| Product ↔ VehicleEngine | **N:M** | `ProductCompatibility` üzerinden; bir ürün binlerce motora, bir motor yüzlerce ürüne |
| Product → ProductReference | 1:N | Bir üründe sınırsız OEM + çapraz kod |
| Product → ProductVariant | 1:N | Ambalaj boyutları |
| ProductVariant → Price / Stock | 1:N | Müşteri grubu ve depo kırılımı |
| Category → Category | 1:N (self) | Sınırsız derinlik, UI 3 seviye |
| VehicleBrand ↔ VehicleType | **N:M** | Mercedes hem otomobil hem ağır vasıta |
| DataSource → *Assertion | 1:N | Kaynak izlenebilirliği |

---

## 6. SAYFA AĞACI (NİHAİ)

```
PUBLIC
│
├── /                                                Ana sayfa                    [Faz 1]
├── /arama?q=                                        Arama sonuçları  (noindex)   [Faz 4]
│
├── KATALOG                                                                       [Faz 2]
│   ├── /kategori                                    Kategori hub
│   ├── /filtreler
│   │   ├── /filtreler/hava-filtreleri
│   │   │   ├── /filtreler/hava-filtreleri/panel-hava-filtresi
│   │   │   └── /filtreler/hava-filtreleri/mann-filter        (kategori × marka)
│   │   ├── /filtreler/yag-filtreleri
│   │   ├── /filtreler/yakit-filtreleri
│   │   ├── /filtreler/polen-kabin-filtreleri
│   │   ├── /filtreler/sanziman-filtreleri
│   │   ├── /filtreler/hidrolik-filtreler
│   │   ├── /filtreler/kurutucu-filtreler
│   │   ├── /filtreler/adblue-filtreleri
│   │   ├── /filtreler/yag-ayirici-filtreler
│   │   └── /filtreler/filtre-setleri
│   ├── /yaglar-sivilar
│   │   ├── /yaglar-sivilar/motor-yaglari
│   │   ├── /yaglar-sivilar/sanziman-yaglari
│   │   ├── /yaglar-sivilar/diferansiyel-yaglari
│   │   ├── /yaglar-sivilar/hidrolik-yaglar
│   │   ├── /yaglar-sivilar/antifriz
│   │   ├── /yaglar-sivilar/fren-hidroligi
│   │   ├── /yaglar-sivilar/adblue
│   │   └── /yaglar-sivilar/gres-yaglayicilar
│   ├── /bakim-sarf                                  [Faz 7 — büyüme]
│   ├── /markalar
│   │   └── /markalar/[marka]                        /markalar/mann-filter
│   ├── /urun/[slug]                                 /urun/mann-c-35-154
│   └── /oem/[numara]                                /oem/04e129620a  (SEO landing)
│
├── ARAÇ AĞACI (programatik SEO)                                                  [Faz 2/4]
│   └── /[tip]/[marka]/[model]/[motor]/[kategori]
│       ├── /otomobil
│       ├── /otomobil/audi
│       ├── /otomobil/audi/a1
│       ├── /otomobil/audi/a1/30-tfsi                    ← tüm uyumlu ürünler
│       └── /otomobil/audi/a1/30-tfsi/hava-filtreleri    ← en değerli SEO sayfası
│       (aynı yapı: /hafif-ticari, /agir-vasita, /otobus, /is-makineleri,
│                   /traktor, /motosiklet)
│
├── TİCARET                                                                       [Faz 5]
│   ├── /sepet
│   ├── /odeme                                       3 adım (ödeme yöntemi Faz 5'te havale/EFT)
│   └── /siparis/tesekkurler/[orderNo]
│
├── HESAP                                                                         [Faz 5]
│   ├── /giris · /kayit · /sifremi-unuttum
│   ├── /hesap
│   ├── /hesap/siparisler · /hesap/siparis/[no]
│   ├── /hesap/araclarim                             Garaj
│   ├── /hesap/adresler · /hesap/favoriler · /hesap/bilgilerim
│
└── KURUMSAL / YASAL                                                              [Faz 1]
    ├── /hakkimizda · /iletisim · /bayilik · /kampanyalar
    ├── /kargo-teslimat · /iade-degisim · /sikca-sorulan-sorular
    └── /kvkk · /gizlilik-politikasi · /mesafeli-satis-sozlesmesi · /cerez-politikasi

ADMIN                                                                             [Faz 3]
├── /admin                                           Dashboard
├── /admin/urunler · /admin/urunler/[id] · /admin/urunler/yeni
├── /admin/kategoriler · /admin/kategoriler/[id]/ozellikler
├── /admin/markalar
├── ARAÇ AĞACI
│   ├── /admin/araclar/tipler
│   ├── /admin/araclar/markalar
│   ├── /admin/araclar/modeller
│   ├── /admin/araclar/nesiller
│   ├── /admin/araclar/motorlar
│   └── /admin/araclar/birlestir                     Duplicate merge
├── UYUMLULUK
│   ├── /admin/uyumluluk                             Matris editörü (çift yönlü)
│   ├── /admin/uyumluluk/urun/[id]                   Ürün → araçlar
│   ├── /admin/uyumluluk/motor/[id]                  Motor → ürünler
│   └── /admin/uyumluluk/eksikler                    "Hiç uyumluluğu olmayan ürünler"
├── VERİ
│   ├── /admin/veri/kaynaklar                        DataSource + trustLevel
│   ├── /admin/veri/ice-aktar                        Import sihirbazı
│   ├── /admin/veri/ice-aktar/[jobId]                İlerleme + hata raporu
│   ├── /admin/veri/gecmis                           ImportJob geçmişi + geri alma
│   └── /admin/veri/cakismalar                       ⚑ Veri Çakışmaları / İnceleme
├── /admin/referanslar                               OEM & çapraz kod yönetimi
├── /admin/stok · /admin/fiyat                       Toplu grid düzenleme
├── /admin/siparisler · /admin/musteriler            [Faz 5]
├── /admin/icerik/sayfalar|bannerlar|kampanyalar
├── /admin/seo/yonlendirmeler · /admin/seo/sayfa-durumu
└── /admin/ayarlar · /admin/kullanicilar · /admin/loglar
```

---

## 7. COMPONENT AĞACI (NİHAİ)

### 7.1 Katman modeli

```
Katman 4  SAYFA (app/**/page.tsx)          metadata + layout + konteyner çağrısı
Katman 3  KONTEYNER (Server Component)     veri çeker, domain servisini çağırır
Katman 2  KOMPOZİT (feature bileşenleri)   domain bilir, veriyi props ile alır
Katman 1  PRİMİTİF (ui/)                   domain bilmez, tamamen yeniden kullanılabilir
```

### 7.2 Ağaç

```
components/
│
├── ui/  ── PRİMİTİF (26)                                              [Faz 0]
│   Button · IconButton · Input · SearchInput · Select · Combobox
│   Checkbox · Radio · Switch · RangeSlider · Badge · Chip · Card
│   Tabs · Accordion · Dialog · Drawer · Sheet · Tooltip · Popover
│   Toast · Skeleton · Spinner · Pagination · Breadcrumb · EmptyState
│
├── layout/  ── (10)                                                   [Faz 1]
│   Header
│   ├── UtilityBar
│   ├── HeaderSearch ──► search/SearchAutocomplete
│   ├── HeaderActions            (Hesabım · Siparişlerim · Sepetim)
│   └── MainNav
│       ├── MegaMenu
│       │   ├── MegaMenuColumn × 3        (Filtreler · Yağlar · Araç Grupları)
│       │   └── MegaMenuPromo             (Aracımı Seç + popüler markalar)
│       └── VehicleChip ──► vehicle/VehicleChangeModal
│   MobileDrawer · MobileBottomBar · Footer · FooterColumn · Container
│
├── vehicle/  ── ARAÇ SİSTEMİ (9)                                      [Faz 1]
│   VehicleSelector                       variant: hero|inline|sidebar|modal|sheet|empty
│   ├── VehicleStepSelect                 desktop kademeli dropdown
│   ├── VehicleStepSheet                  mobil bottom-sheet (1/4 ilerleme)
│   └── VehicleBrandGrid                  popüler 8 marka kısayolu
│   SelectedVehicleBar · VehicleChip · VehicleChangeModal
│   VehicleGarageList · VehicleBreadcrumb
│
├── product/  ── (14)                                                  [Faz 2]
│   ProductCard ──┬── CompatibilityBadge
│                 ├── ProductPrice
│                 ├── StockBadge
│                 └── AddToCartButton
│   ProductCardCompact · ProductGrid
│   ProductGallery ── ProductThumbnails
│   CompatibilityBlock          (detay sayfası uyumluluk kutusu)
│   CompatibilityTable          (uyumlu araçlar tabı, sayfalı)
│   ReferenceTable              (OEM + çapraz kodlar, kopyalanabilir)
│   EquivalentProducts · ProductTabs · ProductSpecs · BundleOffer
│
├── catalog/  ── (9)                                                   [Faz 2]
│   FilterSidebar
│   ├── FilterGroup
│   ├── FilterCheckboxList     (arama kutulu, sayımlı)
│   └── FilterPriceRange
│   ActiveFilterChips · SortDropdown · ResultCountBar
│   MobileFilterDrawer · CategoryCard · CategoryCardGrid
│
├── search/  ── (6)                                                    [Faz 4]
│   SearchBox · SearchAutocomplete
│   ├── SearchSuggestionGroup   (Ürünler · Kodlar · Kategoriler · Markalar · Araçlar)
│   └── RecentSearches
│   SearchResultTabs · NoResultsHelp
│
├── marketing/  ── (8)                                                 [Faz 1]
│   Hero · CategoryShowcase · FeaturedProducts · BrandLogoGrid
│   TrustFeatures · StatsBar · CorporateStrip · CTABanner
│
├── cart/ · checkout/ · account/  ── (11)                              [Faz 5]
│   CartDrawer · CartLineItem · CartSummary · CartCompatibilityWarning
│   CheckoutStepper · AddressForm · AddressCard · ShippingOptions
│   PaymentMethods · OrderSummary · CouponInput
│
├── admin/  ── (14)                                                    [Faz 3]
│   AdminShell · AdminSidebar · StatCard
│   DataTable ── BulkActionBar · InlineEditGrid
│   ImportWizard
│   ├── FileDropzone
│   ├── ColumnMapper            (dosya sütunu → sistem alanı eşleştirme)
│   ├── ImportPreviewTable      (dry-run sonucu, satır bazlı durum)
│   └── ImportProgress
│   CompatibilityMatrixEditor ── VehicleTreePicker   (çoklu seçim, sayaçlı)
│   ConflictQueue ── ConflictDiffView                (§10.4)
│   SpecFormBuilder             (CategoryAttribute'tan dinamik form)
│   ImageUploader
│
└── seo/  ── (4)                                                       [Faz 4]
    JsonLd · BreadcrumbSchema · SeoIntroBlock · InternalLinkCluster
```

**Toplam:** 111 bileşen · Faz 1 sonunda 45'i, Faz 2 sonunda 68'i yazılmış olur.

### 7.3 Kritik bileşen sözleşmeleri

```ts
type VehicleSelectorProps = {
  variant: 'hero' | 'inline' | 'sidebar' | 'modal' | 'sheet' | 'empty-state'
  initialSelection?: Partial<VehicleSelection>
  onSelect?: (s: VehicleSelection) => void
  submitLabel?: string              // varsayılan 'UYUMLU ÜRÜNLERİ GÖSTER'
  redirectOnSubmit?: boolean        // true → /otomobil/audi/a1/30-tfsi
  showUnknownEngineOption?: boolean // 'Motorumu bilmiyorum'
}

type VehicleSelection = {
  typeId: number; typeSlug: string
  brandId: number; brandSlug: string; brandName: string
  modelId: number; modelSlug: string; modelName: string
  engineId: number; engineSlug: string; engineName: string
  year?: number
}

type CompatibilityState =
  | { status: 'VERIFIED' | 'SOURCED'; vehicleLabel: string; restriction?: string }
  | { status: 'CONFLICTED' | 'UNKNOWN' }
  | { status: 'INCOMPATIBLE'; vehicleLabel: string }

type ProductCardProps = {
  product: ProductCardData
  compatibility?: CompatibilityState   // araç seçili değilse undefined
  layout?: 'grid' | 'list'
  priority?: boolean                   // LCP görseli
}
```

---

## 8. API YAPISI (NİHAİ)

### 8.1 Genel ilke

| İşlem tipi | Mekanizma | Neden |
|---|---|---|
| Sayfa verisi okuma | **Server Component → servis katmanı → DB** | Ekstra HTTP turu yok, en hızlı |
| Form gönderimi / mutasyon | **Server Action** | Tip güvenli, ayrı endpoint gerekmez |
| İstemci etkileşimi (kademeli seçim, autocomplete, facet) | **Route Handler** (`/api/*`) | Sayfa yenilenmeden veri |
| Dış sistem (ödeme, kargo) | **Webhook Route Handler** | Zorunlu |

### 8.2 Araç

| Method | Endpoint | Yanıt | Cache |
|---|---|---|---|
| GET | `/api/vehicles/types` | `VehicleType[]` | 24 s (statik) |
| GET | `/api/vehicles/brands?typeId=` | `{popular[], all[]}` | 1 s |
| GET | `/api/vehicles/models?brandId=&typeId=` | `VehicleModel[]` (nesil etiketiyle) | 1 s |
| GET | `/api/vehicles/engines?modelId=` | `VehicleEngine[]` (nesle göre gruplu) | 1 s |
| GET | `/api/vehicles/resolve?path=otomobil/audi/a1/30-tfsi` | `VehicleSelection \| 404` | 1 s |
| POST | `/api/vehicles/select` | cookie + session'a yazar | — |
| DELETE | `/api/vehicles/select` | seçimi temizler | — |

### 8.3 Katalog ve uyumluluk

| Method | Endpoint | Not |
|---|---|---|
| GET | `/api/compatibility/summary?engineId=` | `EngineCategoryIndex`'ten kategori sayımları — **tek satır okuma** |
| GET | `/api/compatibility/products?engineId=&categoryId=&page=` | Uyumlu ürünler, status'e göre sıralı |
| GET | `/api/products?category=&brand=&engineId=&priceMin=&priceMax=&inStock=&spec.*=&sort=&page=` | Ana liste sorgusu |
| GET | `/api/products/[slug]` | Ürün detay |
| GET | `/api/products/[slug]/compatibility?brandId=&page=` | Uyumlu araçlar (sayfalı, markaya göre filtrelenebilir) |
| GET | `/api/products/[slug]/references` | OEM + çapraz kodlar |
| GET | `/api/products/[slug]/equivalents` | Eşdeğer ürünler |
| GET | `/api/categories/tree` | Kategori ağacı (Redis, 1 s) |
| GET | `/api/categories/[slug]/facets?engineId=` | Bağlama duyarlı facet + sayımlar |
| GET | `/api/brands` · `/api/brands/[slug]` | Marka listesi/detay |

### 8.4 Arama

| Method | Endpoint | Not |
|---|---|---|
| GET | `/api/search/suggest?q=&engineId=` | Gruplu autocomplete, < 120 ms |
| GET | `/api/search?q=&…` | Tam sonuç + facet |
| POST | `/api/search/log` | Tıklama / sonuçsuz arama |

**Sorgu ayrıştırma sırası** (`/api/search`):
```
1. normalize(q) → ProductReference.normalized tam eşleşme?     → OEM/çapraz sonucu (en üstte)
2. normalize(q) → Product.sku tam eşleşme?                     → Ürün kodu sonucu
3. q araç markası/modeli mi?                                   → "Audi A1 için parçalar" önerisi
4. Türkçe FTS (search_vector)                                  → Ürün sonuçları
5. Sonuç < 3 ise trigram fuzzy (yazım hatası toleransı)        → "Bunu mu demek istediniz?"
```

### 8.5 Admin (`/api/admin/*` — rol korumalı)

| Method | Endpoint | Not |
|---|---|---|
| CRUD | `/api/admin/products` · `/categories` · `/brands` | Standart |
| CRUD | `/api/admin/vehicles/{types,brands,models,generations,engines}` | Araç ağacı |
| POST | `/api/admin/vehicles/merge` | Duplicate motor/model birleştirme |
| GET/POST/DELETE | `/api/admin/compatibility` | Tekil uyumluluk kaydı |
| POST | `/api/admin/compatibility/bulk` | Araç ağacından çoklu atama |
| POST | `/api/admin/compatibility/verify` | `SOURCED` → `VERIFIED` yükseltme |
| POST | `/api/admin/import/[type]` | Dosya yükle → doğrula → dry-run |
| POST | `/api/admin/import/[jobId]/commit` | Onaylanan dry-run'ı uygula |
| POST | `/api/admin/import/[jobId]/rollback` | Bu job'ın yazdığı her şeyi geri al |
| GET | `/api/admin/import/[jobId]` | İlerleme + özet |
| GET | `/api/admin/import/[jobId]/errors.xlsx` | Hatalı satır raporu |
| GET | `/api/admin/conflicts?status=&severity=` | Çakışma kuyruğu |
| POST | `/api/admin/conflicts/[id]/resolve` | `{winningAssertionId}` veya manuel değer |
| POST | `/api/admin/bulk/price` · `/bulk/stock` | Toplu güncelleme |
| POST | `/api/admin/revalidate` | ISR temizleme (yol veya etiket bazlı) |

### 8.6 İleride eklenecek (şimdi implement edilmiyor — madde 11 & 12)

```ts
// Arayüz bugün tanımlanır, implementasyon Faz 6'da
interface PaymentProvider {
  readonly code: 'IYZICO' | 'PAYTR' | 'BANK_TRANSFER'
  createPayment(order: Order): Promise<PaymentSession>
  verifyCallback(payload: unknown): Promise<PaymentResult>
  refund(orderId: string, amount: Money): Promise<RefundResult>
}
interface ShippingProvider {
  readonly code: 'ARAS' | 'YURTICI' | 'SURAT'
  quote(basket: Basket, address: Address): Promise<ShippingQuote[]>
  createShipment(order: Order): Promise<{ trackingNo: string; labelUrl: string }>
  track(trackingNo: string): Promise<TrackingEvent[]>
}
```
Faz 5'te yalnızca `BANK_TRANSFER` (havale/EFT) implementasyonu yapılır — sipariş akışı çalışır, sanal POS entegrasyonu MVP'yi bekletmez.

---

## 9. CSV IMPORT — ÖZET

> **Tam sütun sözlüğü, kural tablosu ve örnek dosyalar:** `04-CSV-IMPORT-FORMATI.md` + `ornek-veri/` klasörü + `oto-center-market-import-sablonu.xlsx`

### 9.1 Altı dosya tipi

| # | Dosya | Ne yükler | Sıra |
|---|---|---|---|
| 1 | `kategoriler.csv` | Kategori ağacı + facet tanımları | İlk |
| 2 | `arac-agaci.csv` | Tip → marka → model → nesil → motor | İlk |
| 3 | `urunler.csv` | Ürün ana verisi + teknik özellikler | 3. |
| 4 | `fiyat-stok.csv` | Varyant, fiyat, KDV, stok | 4. |
| 5 | `oem-capraz.csv` | OEM + muadil kodlar | 5. |
| 6 | `uyumluluk.csv` | Ürün ↔ motor eşleştirmesi | Son |

### 9.2 Temel format kararları

| Konu | Karar | Gerekçe |
|---|---|---|
| Ayırıcı | `;` (noktalı virgül) — `,` da otomatik algılanır | Türkçe Excel varsayılanı |
| Kodlama | UTF-8 **BOM'lu** | Excel'de Türkçe karakter bozulmasın |
| Ondalık | `,` veya `.` — ikisi de kabul | Operatör hatası olmasın |
| Boş hücre | "değiştirme" anlamına gelir; silmek için `[BOŞALT]` | Kısmi güncelleme mümkün olsun |
| Satır kimliği | `sku` (ürün), `motor_kodu` (araç) | Doğal anahtar |
| Çoklu değer | **Satır çoğaltma (long format)** | Sınırsız N, satır bazlı hata raporu |

### 9.3 Çoklu OEM ve çoklu araç uyumluluğu — netleştirme

**Bu, en sık sorulan iki soru. Cevap: her ilişki ayrı bir satırdır.**

Bir ürünün 7 OEM numarası varsa `oem-capraz.csv` içinde **aynı SKU ile 7 satır** olur:

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

Bir ürün 312 motora uyuyorsa `uyumluluk.csv` içinde **aynı SKU ile 312 satır** olur:

```csv
sku;uyumluluk_tipi;arac_tipi;arac_markasi;model;motor_kodu;motor_adi;yil_baslangic;yil_bitis;kisit_notu
MANN-C35154;UYUMLU;OTOMOBIL;AUDI;A1 (GB);CHZB;30 TFSI 1.0;2018;2024;
MANN-C35154;UYUMLU;OTOMOBIL;AUDI;A1 (GB);DKRF;25 TFSI 1.0;2018;2024;
MANN-C35154;UYUMLU;OTOMOBIL;VOLKSWAGEN;POLO VI;CHZB;1.0 TSI;2017;2023;
MANN-C35154;UYUMLU;OTOMOBIL;SEAT;IBIZA V;CHZB;1.0 TSI;2017;2024;
MANN-C35154;UYUMSUZ;OTOMOBIL;AUDI;A1 (GB);DADA;40 TFSI 2.0;2019;2024;farklı gövde
```

**Neden yan yana sütun (`oem_1;oem_2;oem_3…`) değil?**

| Long format (satır çoğaltma) | Wide format (sütun) |
|---|---|
| Sınırsız sayıda ilişki | Sütun sayısı kadar sınır |
| Hata raporu satır bazlı: "312. satırdaki motor bulunamadı" | Hangi sütunun hatalı olduğu belirsiz |
| Her ilişkiye ayrı kaynak damgası ve yıl aralığı yazılabilir | Yazılamaz |
| Excel'de filtrele/sırala ile kolay yönetim | 40 sütunlu dosya okunamaz |
| Veritabanı satırıyla birebir | Dönüştürme katmanı gerekir |

**Kolaylık istisnası:** Hızlı başlangıç için `urunler.csv` içinde tek hücrede `|` ile ayrılmış OEM listesi de kabul edilir (`04E129620A|04E129620B|04E129620C`). İçe aktarma sihirbazı bunu otomatik olarak ayrı satırlara böler ve önizlemede kaç satıra açıldığını gösterir. Ancak **önerilen ve varsayılan format long format'tır.**

### 9.4 Toplu genişletme (`TUM_MOTORLAR`)

Bir ürün bir modelin tüm motorlarına uyuyorsa 12 satır yazmak yerine:

```csv
sku;uyumluluk_tipi;arac_tipi;arac_markasi;model;motor_kodu;...
FILTRON-AP182;UYUMLU;OTOMOBIL;AUDI;A1 (GB);TUM_MOTORLAR;...
```

Sihirbaz dry-run önizlemesinde **"Bu satır 12 motora genişleyecek: CHZB, DKRF, DADA, …"** uyarısı gösterir; onaylanırsa 12 ayrı assertion oluşur ve her birine `expandedFrom` damgası yazılır. Böylece hem kolaylık sağlanır hem izlenebilirlik korunur.

### 9.5 Motor eşleştirme sırası

```
1. motor_kodu tam eşleşme (engineCodes dizisinde ara)        → en güvenilir
2. arac_markasi + model + motor_adi normalize eşleşme
3. arac_markasi + model + hacim_cc + guc_hp eşleşme
4. Bulunamadı → satır ERROR, hata raporuna düşer
   → sihirbazda "Bu motoru araç ağacına ekle" tek tık seçeneği sunulur
```

### 9.6 Import güvenlik mekanizmaları

| Mekanizma | Davranış |
|---|---|
| **Dry-run zorunlu** | Hiçbir import doğrudan yazmaz. Önce "X eklenecek · Y güncellenecek · Z hatalı" özeti onaylanır |
| **Satır bazlı hata raporu** | Hatalı satırlar, hata açıklamasıyla birlikte Excel olarak indirilir; düzeltilip tekrar yüklenir |
| **Dosya parmak izi** | Aynı dosya ikinci kez yüklenirse uyarı verir |
| **Kaynak damgası** | Her satıra `sourceId` + `importJobId` yazılır |
| **Tek tıkla geri alma** | `POST /api/admin/import/[jobId]/rollback` — o job'ın yazdığı tüm assertion'lar pasifleşir, çözümleme yeniden çalışır |
| **Kuyruk** | 10.000+ satır arka planda (BullMQ), ilerleme çubuğu ile |
| **Kısmi başarı** | Hatalı satırlar atlanır, doğru satırlar yazılır (isteğe bağlı: "hepsi ya da hiçbiri" modu) |

---

## 10. ADMİN PANELİ (NİHAİ)

### 10.1 Tasarım felsefesi

Admin bir "gösterge paneli" değil, **veri operasyonu aracıdır.** Ana senaryo: haftada bir 3.000 satırlık tedarikçi listesi yüklemek, 200 yeni ürünün uyumluluğunu tanımlamak, çakışmaları temizlemek. Buna göre: tablo yoğun, klavye dostu, toplu işlem odaklı.

### 10.2 Araç ağacı yönetimi (madde 5)

| Yetenek | Detay |
|---|---|
| Ağaç görünümü | Tip → Marka → Model → Nesil → Motor; her seviyede alt kayıt sayacı |
| CRUD | Her seviyede ekle/düzenle/pasifleştir (silme yerine pasifleştirme — geçmiş uyumluluk korunur) |
| Toplu import | `arac-agaci.csv` ile ağacın tamamı |
| **Birleştirme (merge)** | Yanlışlıkla iki kez açılmış "A1 (GB)" ve "A1 GB" kayıtları tek tıkla birleşir; tüm uyumluluk kayıtları hedefe taşınır |
| Dış kimlik | `externalRefs` ile TecDoc/üretici kimlikleri saklanır (ileride eşleştirme için) |
| Kullanım raporu | "Bu motora hiç ürün bağlı değil" / "Bu model hiç aranmamış" |

### 10.3 Uyumluluk yönetimi (madde 5)

**Çift yönlü editör** — operatörün elindeki veriye göre yön seçer:

```
YÖN A — Ürün merkezli  (/admin/uyumluluk/urun/[id])
┌────────────────────────────────────────────────────────────────────┐
│ MANN-FILTER C 35 154                          312 motor · 4 marka  │
├──────────────────────┬─────────────────────────────────────────────┤
│ ARAÇ AĞACI           │  SEÇİLİ UYUMLULUKLAR                        │
│ ☑ AUDI          (24) │  AUDI A1 (GB) 30 TFSI    2018–2024  ✓ VERIFIED │
│   ☑ A1 (GB)      (3) │  AUDI A1 (GB) 25 TFSI    2018–2024  ● SOURCED  │
│     ☑ 30 TFSI 1.0    │  VW  POLO VI  1.0 TSI    2017–2023  ⚑ CONFLICTED│
│     ☑ 25 TFSI 1.0    │  ...                                        │
│     ☐ 40 TFSI 2.0    │                                             │
│   ☐ A3 (8Y)     (12) │  [Seçilenleri Doğrula]  [Seçilenleri Kaldır]│
│ ☐ VOLKSWAGEN    (48) │  [Yıl aralığı ata]  [Kısıt notu ekle]       │
└──────────────────────┴─────────────────────────────────────────────┘
  Marka seçilince tüm modeller, model seçilince tüm motorlar işaretlenir.
  Seçim sayacı: "312 motor seçildi" — yanlışlıkla toplu atamayı önler.

YÖN B — Araç merkezli  (/admin/uyumluluk/motor/[id])
  "AUDI A1 30 TFSI için hangi ürünler tanımlı?" — kategori kategori,
  eksik kategoriler kırmızı ile işaretli: "Yakıt Filtresi: 0 ürün ⚠"
```

**Eksik raporu** (`/admin/uyumluluk/eksikler`): hiç uyumluluğu olmayan aktif ürünler, hiç ürünü olmayan popüler motorlar. Bu iki liste, veri operasyonunun günlük iş kuyruğudur.

### 10.4 ⚑ Veri Çakışmaları / İnceleme (madde 6)

`/admin/veri/cakismalar`

```
┌───────────────────────────────────────────────────────────────────────────┐
│  VERİ ÇAKIŞMALARI                                    47 açık · 12 yüksek  │
│  [Tümü] [Uyumluluk 31] [OEM 9] [Teknik Özellik 7]     Önem: [Yüksek ▾]   │
├───────────────────────────────────────────────────────────────────────────┤
│ ⚑ YÜKSEK · UYUMLULUK                                        2 gün önce   │
│   MANN-FILTER C 35 154  ↔  AUDI A1 (GB) 30 TFSI                          │
│                                                                           │
│   ┌─ Kaynak ────────────┬─ Güven ─┬─ İddia ──────────┬─ Tarih ──────┐   │
│   │ TecDoc              │   90    │ UYUMLU 2018–2024 │ 12.08.2026   │   │
│   │ MANN Kataloğu       │   80    │ UYUMSUZ          │ 14.08.2026   │   │
│   │ Excel (bizim)       │   50    │ UYUMLU 2019–2023 │ 15.08.2026   │   │
│   └─────────────────────┴─────────┴──────────────────┴──────────────┘   │
│                                                                           │
│   Şu anki durum: CONFLICTED → sitede GRİ rozet gösteriliyor              │
│                                                                           │
│   [TecDoc'u kabul et] [MANN'ı kabul et] [Excel'i kabul et]               │
│   [Manuel değer gir] [Yok say]              [Ürün detayına git ↗]        │
├───────────────────────────────────────────────────────────────────────────┤
│ ⚑ ORTA · OEM                                                 5 gün önce  │
│   04E 129 620 A  →  2 farklı ürüne bağlı (MANN-C35154, BOSCH-F026400220) │
│   [Her ikisi de doğru (muadil)] [Birini kaldır] [İncele]                 │
└───────────────────────────────────────────────────────────────────────────┘
```

**Çakışma üretme kuralları**

| Tip | Ne zaman açılır | Önem |
|---|---|---|
| Uyumluluk çelişkisi | İki kaynak `COMPATIBLE` / `INCOMPATIBLE` diyor | Yüksek |
| Yıl aralığı uyuşmazlığı | Aralıklar kesişmiyor | Orta |
| OEM çoklu bağ | Aynı OEM numarası 2+ ürüne bağlı | Orta |
| Teknik özellik farkı | Aynı `key` için farklı değer (sayısal %5+ sapma) | Düşük |
| Fiyat sapması | Tedarikçi listesi mevcut fiyattan %30+ farklı | Orta |

**Çözüm aksiyonları:** kaynak seç · manuel değer gir · yok say (60 gün sessize al) · kaynağın güven seviyesini düzenle. Her çözüm bir `MANUAL` assertion üretir (trustLevel 100) ve çözümleme yeniden çalışır → durum `VERIFIED` olur.

### 10.5 Diğer modüller

| Modül | Ana yetenekler |
|---|---|
| Dashboard | Sipariş/ciro özeti, düşük stok, **sonuçsuz aramalar**, **açık çakışmalar**, **uyumluluğu olmayan ürünler** |
| Ürünler | CRUD, varyant, görsel sürükle-bırak, `CategoryAttribute`'tan dinamik teknik özellik formu, SEO alanları, canlı önizleme |
| Kategoriler | Sürükle-bırak ağaç, facet (CategoryAttribute) tanımlama |
| Referanslar | OEM/çapraz kod yönetimi, toplu import, "bu numara birden çok üründe" uyarısı |
| Stok & Fiyat | Excel benzeri inline grid, toplu yüzde zam, tedarikçi listesiyle eşleştirme |
| İçe aktarma | §9 sihirbazı + geçmiş + geri alma |
| SEO | 301 yönlendirmeler, sayfa durum raporu ("0 ürünlü kaç sayfa gizlendi") |
| Loglar | Kim neyi ne zaman değiştirdi (audit trail) |

### 10.6 Roller

| Rol | Yetki |
|---|---|
| `SUPER_ADMIN` | Her şey + kullanıcı + ayarlar + kaynak güven seviyeleri |
| `ADMIN` | Ürün, kategori, araç ağacı, uyumluluk, import, çakışma çözümü, sipariş |
| `EDITOR` | Ürün ve içerik düzenleme; fiyat/stok/import salt-okunur |
| `OPERATION` | Sipariş ve kargo yönetimi |

---

## 11. PROGRAMATİK SEO — ÜRÜNSÜZ SAYFA ÜRETİLMEZ (madde 7)

### 11.1 Kapı bekçisi: `EngineCategoryIndex`

```
Sayfa isteği: /otomobil/audi/a1/30-tfsi/hava-filtreleri
        ↓
EngineCategoryIndex WHERE engineId=4471 AND categoryId=12
        ↓
   productCount = 0  →  302 → /otomobil/audi/a1/30-tfsi   (üst sayfaya)
                        sitemap'e GİRMEZ · statik üretilmez · noindex
   productCount ≥ 1  →  sayfa üretilir, sitemap'e girer
```

Aynı kural motor sayfası için de geçerlidir: bir motorun **hiç** uyumlu ürünü yoksa `/otomobil/audi/a1/30-tfsi` üretilmez, model sayfasına yönlendirilir.

### 11.2 Sayfa üretim matrisi

| Seviye | Üretim koşulu | Tahmini adet | Öncelik |
|---|---|---|---|
| `/{tip}` | Her zaman | 7 | Yüksek |
| `/{tip}/{marka}` | ≥ 1 modelde ürün var | ~80 | Yüksek |
| `/{tip}/{marka}/{model}` | ≥ 1 motorda ürün var | ~900 | Yüksek |
| `/{tip}/{marka}/{model}/{motor}` | `SUM(productCount) ≥ 1` | ~4.000 | Çok yüksek |
| `/{tip}/{marka}/{model}/{motor}/{kategori}` | `productCount ≥ 1` | ~12.000 (40.000 değil) | **En yüksek** |
| `/oem/{numara}` | Referans kaydı var | ~8.000 | Orta |

> Teorik kombinasyon 40.000+; gerçek üretilen sayfa ~17.000. **Aradaki fark bilinçli olarak üretilmez.** Bu, thin content cezasından kaçınmanın en etkili yoludur.

### 11.3 İçerik zenginleştirme (thin content koruması)

Üretilen her araç×kategori sayfasında, şablon tekrarını kıran gerçek veri bulunur:

1. **Araç teknik künyesi** — motor kodu, kW/HP, hacim, yakıt, üretim yılları, nesil
2. **Katalog özeti** — "14 ürün · 5 marka · 849 ₺ – 2.190 ₺ fiyat aralığı"
3. **Kategori bilgi bloğu** — o kategoriye özgü değişim aralığı ve teknik açıklama (`Category.seoIntro`)
4. **İç link kümesi** — aynı modelin diğer motorları, aynı motorun diğer kategorileri, aynı markanın popüler modelleri
5. **SSS bloğu** — kategori + araç kombinasyonundan üretilen 3 soru (`FAQPage` schema)

### 11.4 Structured data

| Sayfa | Schema |
|---|---|
| Ürün detay | `Product` + `Offer` + `Brand` + `isAccessoryOrSparePartFor` |
| Tüm sayfalar | `BreadcrumbList` |
| Liste / araç×kategori | `ItemList` + `CollectionPage` + `FAQPage` |
| Ana sayfa | `Organization` + `WebSite` + `SearchAction` |
| İletişim | `LocalBusiness` / `AutoPartsStore` |
| Marka | `Brand` + `ItemList` |

### 11.5 Sitemap

```
/sitemap.xml (index)
├── /sitemap-statik.xml            kurumsal + kategori hub'ları
├── /sitemap-kategoriler.xml       ~60 URL
├── /sitemap-markalar.xml          ~40 URL
├── /sitemap-urunler-[1..n].xml    45.000 URL/dosya
├── /sitemap-araclar-[1..n].xml    yalnızca productCount ≥ 1 olanlar
└── /sitemap-oem-[1..n].xml
```
Sitemap'ler `EngineCategoryIndex`'ten üretilir — yani "üretilen sayfa" ile "sitemap'teki URL" tanımı gereği aynıdır, tutarsızlık imkânsızdır.

---

## 12. DESIGN TOKENS (NİHAİ)

> Görsel karşılıkları: `design-system.html` · Gerçekçi uygulama: `onizleme.html`

### 12.1 Renk

```css
:root{
  /* Marka — Oto Center Market logosundan türetilmiş */
  --brand-900:#08203C;  --brand-800:#0B315B;  --brand-700:#0F4179;
  --brand-600:#14549A;  --brand-500:#2569B4;  --brand-300:#8FBCE4;
  --brand-100:#D5E6F5;  --brand-50:#EAF3FB;

  /* Accent — YALNIZCA uyumluluk ve başarı */
  --accent-700:#177247; --accent-600:#1E9159; --accent-100:#DEF3E8;

  /* Nötr */
  --n-0:#FFFFFF;   --n-25:#F6F8FB;  --n-50:#F1F4F8;  --n-100:#E6EBF1;
  --n-200:#D3DAE3; --n-400:#97A3B2; --n-600:#5B6675; --n-800:#2C3340; --n-900:#171C24;

  /* Durum */
  --success:#1E9159; --warning:#B7791F; --danger:#C0392B; --info:#14549A;
}
```

**Kullanım oranı hedefi:** %90 nötr/beyaz · %8 mavi · %2 yeşil.
**Yasak:** yeşil butonda/banner'da/başlıkta · sarı marka rengi olarak · birden fazla gradient.

### 12.2 Tipografi

```css
--font-sans:'Inter', -apple-system, 'Segoe UI', Roboto, sans-serif;
--font-mono:'JetBrains Mono', ui-monospace, SFMono-Regular, monospace;  /* kod/OEM */
```

| Token | Desktop | Mobil | Ağırlık |
|---|---|---|---|
| `--t-display` | 44/52 | 32/40 | 700 |
| `--t-h1` | 32/40 | 26/34 | 700 |
| `--t-h2` | 24/32 | 21/28 | 600 |
| `--t-h3` | 20/28 | 18/26 | 600 |
| `--t-body-lg` | 17/26 | 16/25 | 400 |
| `--t-body` | 15/24 | 15/24 | 400 |
| `--t-body-sm` | 13/20 | 13/20 | 400 |
| `--t-caption` | 12/16 | 12/16 | 500 |
| `--t-mono` | 14/20 | 13/19 | 500 |

Başlıklarda `letter-spacing:-0.01em` (display: `-0.025em`).

### 12.3 Spacing, radius, gölge, hareket

```css
/* Spacing — 4px tabanı */
--s-1:4px;  --s-2:8px;  --s-3:12px; --s-4:16px; --s-5:20px; --s-6:24px;
--s-8:32px; --s-10:40px; --s-12:48px; --s-16:64px; --s-20:80px; --s-24:96px;

--container-max:1320px;  --container-pad:24px;   /* mobil 16px */
--section-gap:80px;      /* mobil 48px */
--grid-gap:24px;

/* Radius — kontrollü */
--r-sm:4px;   /* rozet, chip      */
--r-md:6px;   /* buton, input     */
--r-lg:8px;   /* kart, panel      */
--r-xl:12px;  /* modal            */
--r-full:999px; /* yalnız avatar ve sayaç */

/* Gölge */
--sh-xs:0 1px 2px rgba(11,49,91,.05);
--sh-sm:0 2px 6px rgba(11,49,91,.06);
--sh-md:0 6px 16px rgba(11,49,91,.08);
--sh-lg:0 14px 34px rgba(11,49,91,.10);

/* Hareket */
--e-out:cubic-bezier(.16,1,.3,1);
--d-fast:150ms;   /* buton, link hover     */
--d-menu:180ms;   /* dropdown, mega menü   */
--d-modal:220ms;  /* modal, drawer         */
@media (prefers-reduced-motion:reduce){ *{transition-duration:0ms!important} }
```

### 12.4 Bileşen ölçüleri

| Öğe | Değer |
|---|---|
| Buton yükseklikleri | sm 36 · md 44 · lg 52 px |
| Input yüksekliği | 44 px (mobil 48) |
| Dokunma hedefi | min 44×44 px |
| Header katmanları | 32 / 80 / 48 px · sticky'de 56 px |
| Rozet | 24 px yükseklik, `--r-sm` |
| Ürün kartı | border `1px --n-100`, radius `--r-lg`, padding 16 |
| Odak halkası | `2px --brand-600`, offset 2px |
| Ürün görseli | 1:1 sabit oran (CLS 0) |

### 12.5 İkonografi

Lucide Icons · stroke 1.75px · 20/24px · tek set. Kategori ikonları için 12 özel çizim (aynı stil). **Arayüzde emoji kullanılmaz.**

---

## 13. MARKA AYRIŞMASI — FİLTRE MARKETİM vs OTO CENTER MARKET (madde 8)

Referans site yalnızca **fonksiyonel** referanstır: "araç tipi → marka → model → motor → ara" akışının işe yaradığı doğrulanmıştır. Görsel dilin tamamı özgündür.

| Boyut | Filtre Marketim | Oto Center Market | Ayrışma |
|---|---|---|---|
| Ana renk | Sarı + yeşil bloklar | Lacivert–mavi, logodan türetilmiş | **Tam ayrışma** |
| Yeşil kullanımı | Geniş zemin bloğu | Yalnızca uyumluluk rozeti (%2 alan) | Anlam yüklenmiş renk |
| Sarı | Dikkat çekici şerit | Kullanılmıyor (yalnız `--warning` ikonu) | Tam ayrışma |
| Arka plan | Doygun renk blokları | Beyaz + `#F6F8FB` nötr | Premium his |
| Araç seçici | Renkli şerit içinde yatay bar | Beyaz kart, hero üzerine binen, numaralı adımlar, kilit durumları | Farklı yerleşim + etkileşim |
| Hero | Banner/kampanya görseli | Koyu degrade + teknik grid + soyut geometri, stok fotoğraf yok | Farklı görsel dil |
| Tipografi | Ağır, sıkışık, çok büyük | Inter, ölçekli hiyerarşi, kodlar monospace | Farklı ritim |
| Ürün kodu | Gövde metniyle aynı | **Monospace**, ayrı satır, kopyalanabilir | Ustalar için işlevsel fark |
| Uyumluluk gösterimi | Belirgin bir sistem yok | 5 durumlu, renk+ikon+metin, "veri yoksa yeşil yok" | **Ürünün temel farkı** |
| Rozet yoğunluğu | Çoklu renkli etiketler | Kart başına en fazla 2 | Sakinlik |
| Kart tasarımı | Gölge ağırlıklı | Border ağırlıklı, gölge yalnız hover | Hafiflik |
| Menü | Klasik açılır liste | 4 kolonlu mega menü + promo bloğu | Kurumsal derinlik |
| Header | 2 katman | 3 katman + kalıcı araç çipi | Araç hafızası görünür |
| Mobil araç seçimi | Küçültülmüş dropdown | Tam ekran bottom-sheet, adım göstergeli | Mobil öncelikli |
| Genel his | Yerel perakende | Kurumsal distribütör + teknoloji şirketi | Konumlandırma farkı |

**Kopyalanan tek şey:** kademeli araç seçim *mantığı* (sektör standardı, herkeste var).
**Kopyalanmayan:** renk, yerleşim, tipografi, bileşen dili, etkileşim, içerik hiyerarşisi, uyumluluk sistemi.

---

## 14. FAZ PLANI (YENİDEN SIRALANMIŞ — madde 10, 11, 12)

### 14.1 Sıralama ve bir uyarı

Talebiniz doğrultusunda ana sayfa ve araç seçici öne alındı. Ancak **araç seçici gerçek veri olmadan çalışamaz.** Çözüm: Faz 0'a "çekirdek şema kesiti" eklendi — tam veritabanı işi yine Faz 3'te, ama Faz 1'in ihtiyacı olan 6 tablo ve seed verisi Faz 0'da hazır olur.

```
Faz 0  ▸ Mimari + Design System + ÇEKİRDEK ŞEMA                  Hafta 1–2
Faz 1  ▸ Ana Sayfa + Header + Mega Menu + Araç Seçici            Hafta 3–5
Faz 2  ▸ Kategori + Ürün Listeleme + Ürün Detay                  Hafta 6–8
Faz 3  ▸ Tam Database + Admin + CSV Import                       Hafta 9–12
Faz 4  ▸ Arama + SEO + Performans                                Hafta 13–14
Faz 5  ▸ Sepet + Üyelik + Sipariş (havale/EFT)                   Hafta 15–16
Faz 6  ▸ iyzico / sanal POS  ← MVP'den SONRA                     Hafta 17+
Faz 7  ▸ Büyüme (B2B, blog, değerlendirme, pazaryeri)            sonrası
```

### 14.2 Faz 0 — Mimari + Design System (Hafta 1–2)

| İş | Çıktı |
|---|---|
| Repo, monorepo, TS strict, ESLint, CI | Çalışan iskelet |
| Design token'lar CSS değişkeni olarak | `tokens.css` |
| 26 primitif bileşen (`ui/`) | Bileşen kütüphanesi + `/kitchen-sink` |
| **Çekirdek şema:** `VehicleType/Brand/Model/Generation/Engine`, `Category`, `ProductBrand`, `Product`, `ProductCompatibility` (partition'lı) | İlk migration |
| **Seed verisi:** 7 tip · 20 marka · 120 model · 400 motor · 12 kategori · 120 ürün · ~4.000 uyumluluk | Faz 1 gerçek veriyle çalışır |
| Logo varyantları (SVG, favicon, OG) | Marka varlıkları |

**Kabul:** Design system sayfası canlı, seed veriyle boş sayfalar açılıyor, CI yeşil.

### 14.3 Faz 1 — Ana Sayfa + Header + Mega Menu + Araç Seçici (Hafta 3–5)

| Sprint | İş |
|---|---|
| 1 | `Header` 3 katman · `UtilityBar` · `MainNav` · `MegaMenu` (4 kolon + promo) · `MobileDrawer` · `Footer` · sticky davranışı |
| 2 | **`VehicleSelector`** 6 varyant · kademeli API'ler · Redis cache · kilit/temizleme mantığı · mobil bottom-sheet · `SelectedVehicleBar` · `VehicleChip` · araç hafızası (cookie + localStorage + SSR) |
| 3 | `Hero` · `CategoryShowcase` · `FeaturedProducts` · `BrandLogoGrid` · `TrustFeatures` · `CorporateStrip` · kurumsal/yasal sayfalar · erişilebilirlik denetimi |

**Kabul:** Ana sayfa canlı veriyle çalışıyor; araç seçildiğinde `/otomobil/audi/a1/30-tfsi` adresine gidiliyor; Lighthouse ≥ 90; mobil/desktop kusursuz.

### 14.4 Faz 2 — Katalog (Hafta 6–8)

| Sprint | İş |
|---|---|
| 4 | Kategori listeleme · `FilterSidebar` + facet · `SortDropdown` · sayfalama · mobil filtre drawer · boş durumlar |
| 5 | Ürün detay · galeri · `CompatibilityBlock` · `ProductTabs` · `CompatibilityTable` · `ReferenceTable` · `EquivalentProducts` |
| 6 | Araç sayfaları (`/[tip]/[marka]/[model]/[motor]/[kategori]`) · `EngineCategoryIndex` · uyumluluk sorgu servisi + yük testi (20M satır) · marka sayfaları |

**Kabul:** Araç seçiliyken yalnızca uyumlu ürünler doğru rozetlerle listeleniyor; uyumluluk sorgusu p95 < 150 ms.

### 14.5 Faz 3 — Database + Admin + CSV Import (Hafta 9–12)

| Sprint | İş |
|---|---|
| 7 | Tam şema: assertion katmanı · `DataSource` · `DataConflict` · `ProductVariant/Price/Stock` · çözümleme motoru · indeks ve partition doğrulaması |
| 8 | `AdminShell` · yetkilendirme · `DataTable` · ürün CRUD · dinamik teknik özellik formu · kategori ağacı · marka yönetimi · stok/fiyat grid |
| 9 | **CSV Import:** `ImportWizard` · `ColumnMapper` · doğrulama · dry-run · commit · hata raporu · BullMQ kuyruk · geri alma · 6 dosya tipi |
| 10 | Araç ağacı yönetimi + merge · **çift yönlü uyumluluk matrisi** · **Veri Çakışmaları ekranı** · eksik raporları |

**Kabul:** 5.000 satırlık Excel hatasız içe aktarılıyor, hatalı satırlar rapor olarak iniyor; çakışan iki kaynak yüklendiğinde çakışma ekranında görünüyor ve sitede gri rozet çıkıyor.

### 14.6 Faz 4 — Arama + SEO (Hafta 13–14)

Sorgu ayrıştırma · Türkçe FTS + trigram · autocomplete · arama sonuç sayfası · `SearchLog` · metadata sistemi · structured data · bölünmüş sitemap · 301 yönetimi · içerik şablon motoru · Core Web Vitals · Playwright E2E · Sentry.

### 14.7 Faz 5 — Sepet + Üyelik + Sipariş (Hafta 15–16)

Sepet (drawer + sayfa) · sepet-araç uyumluluk uyarısı · checkout 3 adım · **ödeme yöntemi: havale/EFT + kapıda ödeme** · Auth.js üyelik · hesap paneli · garaj · sipariş e-postaları · admin sipariş yönetimi.

> **🚀 MVP canlıya çıkış — Hafta 16 sonu.** Katalog, araç uyumluluğu, ürün deneyimi, admin ve sipariş akışı tamam; sanal POS yok.

### 14.8 Faz 6 — Ödeme (Hafta 17+)

`PaymentProvider` arayüzünün iyzico implementasyonu · 3D Secure · taksit · webhook · iade · sipariş durumu entegrasyonu. **Faz 5 bitmeden başlanmaz.**

### 14.9 Faz 7 — Büyüme

Değerlendirmeler · blog/bakım rehberi · B2B bayi paneli · bakım seti oluşturucu · Meilisearch geçişi · kargo entegrasyonu · e-fatura · pazaryeri.

### 14.10 Zaman çizelgesi

```
Hafta  1  2 │ 3  4  5 │ 6  7  8 │ 9 10 11 12│13 14│15 16│ 17+
      ┌─────┬─────────┬─────────┬───────────┬─────┬─────┬──────┐
      │FAZ 0│  FAZ 1  │  FAZ 2  │   FAZ 3   │FAZ 4│FAZ 5│FAZ 6 │
      │ DS +│Ana sayfa│ Katalog │ DB+Admin+ │Arama│Sepet│Ödeme │
      │şema │Araç seç.│         │CSV Import │+SEO │+Üye │iyzico│
      └─────┴─────────┴─────────┴───────────┴─────┴─────┴──────┘
                                                        ▲
                                                   🚀 MVP CANLI

Paralel iş kolu — VERİ HAZIRLIĞI (Hafta 2'den itibaren, sizin tarafınızda)
  Hafta 2–5   : arac-agaci.csv + kategoriler.csv hazırlanır
  Hafta 5–9   : urunler.csv + fiyat-stok.csv + görseller
  Hafta 8–12  : oem-capraz.csv + uyumluluk.csv
  ⚠ Bu iş kolu gecikirse Faz 2'nin uyumluluk testi ve Faz 3'ün import testi
    gerçek veriyle yapılamaz. Şablonlar bugün elinizde.
```

### 14.11 Riskler

| # | Risk | Etki | Azaltma |
|---|---|---|---|
| R1 | Uyumluluk verisi geç hazırlanır | Çok yüksek | Şablonlar Faz 0'da teslim edildi; MVP dar araç segmentiyle açılabilir |
| R2 | 40M satırda sorgu yavaşlar | Yüksek | Partition baştan kuruldu; Faz 2 Sprint 6'da sentetik yük testi |
| R3 | Ürün görselleri eksik | Orta | Marka+kategori bazlı yer tutucu sistemi |
| R4 | CSV dosyaları tutarsız formatta | Orta | Esnek sütun eşleştirme + dry-run + satır bazlı hata raporu |
| R5 | Kapsam büyümesi | Orta | Faz 7 "sonra kutusu"; her yeni istek oraya yazılır |
| R6 | Ödemesiz MVP'de sipariş dönüşümü düşer | Orta | Havale/EFT + kapıda ödeme aktif; Faz 6 hemen ardından |

---

## 15. ONAY

| # | Kalem | Bölüm | Durum |
|---|---|---|---|
| 1 | Database schema | §4 | ☐ Onaylandı |
| 2 | Entity ilişkileri | §5 | ☐ Onaylandı |
| 3 | Sayfa ağacı | §6 | ☐ Onaylandı |
| 4 | Component ağacı | §7 | ☐ Onaylandı |
| 5 | API yapısı | §8 | ☐ Onaylandı |
| 6 | CSV import formatı | §9 + `04-CSV-IMPORT-FORMATI.md` | ☐ Onaylandı |
| 7 | Araç/ürün uyumluluk modeli | §2 + §3 | ☐ Onaylandı |
| 8 | Design tokens | §12 + `design-system.html` + `onizleme.html` | ☐ Onaylandı |
| 9 | Faz planı | §14 | ☐ Onaylandı |

**Hâlâ sizden beklenen bilgiler** (kodlamayı engellemez, Faz 3–5'te gerekir):

1. Logo SVG orijinali + varyantlar
2. Kurumsal bilgiler: ünvan, adres, telefon, vergi dairesi/no, MERSİS (yasal sayfalar)
3. Kargo firması tercihi (Faz 5)
4. E-fatura/muhasebe entegrasyonu tercihi (Faz 6)
5. Başlangıç ürün verisi — şablonlar teslim edildi, doldurulması sizin tarafınızda

Onay verdiğinizde **Faz 0 Sprint 1** ile başlanır: repo kurulumu, token'lar, primitif bileşenler ve çekirdek şema.
