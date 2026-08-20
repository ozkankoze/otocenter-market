-- ============================================================================
-- OTO CENTER MARKET — 0001_init
-- Çekirdek şema: araç ağacı · ürün katalogu · assertion katmanı ·
--                çözümlenmiş uyumluluk · türetilmiş SEO indeksi
-- Referans: 03-FINAL-MIMARI.md §4
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ─────────────────────────────── ENUM TİPLERİ ───────────────────────────────

CREATE TYPE vehicle_fuel_type   AS ENUM ('DIZEL','BENZIN','LPG','HIBRIT','ELEKTRIK','CNG');
CREATE TYPE product_status      AS ENUM ('DRAFT','ACTIVE','ARCHIVED');
CREATE TYPE compat_status       AS ENUM ('VERIFIED','SOURCED','CONFLICTED','INCOMPATIBLE');
CREATE TYPE assertion_type      AS ENUM ('COMPATIBLE','INCOMPATIBLE');
CREATE TYPE source_kind         AS ENUM ('MANUAL','CATALOG','MANUFACTURER','SUPPLIER','CSV','DERIVED');
CREATE TYPE reference_type      AS ENUM ('OEM','CROSS_EQUIVALENT','CROSS_REPLACES','CROSS_REPLACED_BY');
CREATE TYPE conflict_status     AS ENUM ('OPEN','RESOLVED','IGNORED');
CREATE TYPE conflict_severity   AS ENUM ('HIGH','MEDIUM','LOW');
CREATE TYPE attribute_data_type AS ENUM ('NUMBER','TEXT','ENUM','BOOL');

-- ───────────────────────── YARDIMCI: KOD NORMALİZASYONU ─────────────────────
-- 'C 35 154' → 'C35154' · 'AP 182/2' → 'AP1822' · '04e-129-620-a' → '04E129620A'
-- IMMUTABLE olması indekslenebilmesi için şart.

CREATE OR REPLACE FUNCTION ocm_normalize_code(txt text)
RETURNS text
LANGUAGE sql
IMMUTABLE
STRICT
PARALLEL SAFE
AS $$
  SELECT upper(regexp_replace(txt, '[^A-Za-z0-9]', '', 'g'));
$$;

-- ──────────────────────── KAYNAK & ÇAKIŞMA KATMANI ──────────────────────────

CREATE TABLE data_source (
  id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code        VARCHAR(32)  NOT NULL UNIQUE,
  name        VARCHAR(120) NOT NULL,
  kind        source_kind  NOT NULL,
  trust_level SMALLINT     NOT NULL DEFAULT 50 CHECK (trust_level BETWEEN 0 AND 100),
  is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
  config      JSONB,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);
COMMENT ON TABLE data_source IS
  'Veri kaynakları. Yeni katalog (TecDoc/MANN/BOSCH) eklemek yalnızca bir satır + bir adapter gerektirir; şema değişmez.';

CREATE INDEX data_source_kind_active_idx ON data_source (kind, is_active);

-- ─────────────────────────────── ARAÇ AĞACI ─────────────────────────────────

CREATE TABLE vehicle_type (
  id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       VARCHAR(80) NOT NULL,
  slug       VARCHAR(60) NOT NULL UNIQUE,
  icon       VARCHAR(40),
  sort_order INT     NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE vehicle_brand (
  id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name          VARCHAR(80) NOT NULL,
  slug          VARCHAR(60) NOT NULL UNIQUE,
  logo_url      TEXT,
  country       VARCHAR(40),
  is_popular    BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order    INT     NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  external_refs JSONB
);
CREATE INDEX vehicle_brand_popular_idx ON vehicle_brand (is_popular DESC, sort_order, name);

-- Mercedes hem otomobil hem ağır vasıta markasıdır → N:M zorunlu
CREATE TABLE vehicle_brand_type (
  brand_id INT NOT NULL REFERENCES vehicle_brand(id) ON DELETE CASCADE,
  type_id  INT NOT NULL REFERENCES vehicle_type(id)  ON DELETE CASCADE,
  PRIMARY KEY (brand_id, type_id)
);
CREATE INDEX vehicle_brand_type_type_idx ON vehicle_brand_type (type_id);

CREATE TABLE vehicle_model (
  id         INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  brand_id   INT NOT NULL REFERENCES vehicle_brand(id) ON DELETE CASCADE,
  name       VARCHAR(120) NOT NULL,
  slug       VARCHAR(80)  NOT NULL,
  code       VARCHAR(40),
  year_from  SMALLINT,
  year_to    SMALLINT,
  body_type  VARCHAR(60),
  image_url  TEXT,
  sort_order INT     NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (brand_id, slug)
);
CREATE INDEX vehicle_model_brand_idx ON vehicle_model (brand_id, is_active);

-- Model ile motor arasındaki opsiyonel katman.
-- Arayüzde AYRI ADIM olarak gösterilmez; model etiketine gömülür.
CREATE TABLE vehicle_generation (
  id          INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  model_id    INT NOT NULL REFERENCES vehicle_model(id) ON DELETE CASCADE,
  name        VARCHAR(120) NOT NULL,
  code        VARCHAR(40),
  year_from   SMALLINT,
  year_to     SMALLINT,
  is_facelift BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX vehicle_generation_model_idx ON vehicle_generation (model_id);

CREATE TABLE vehicle_engine (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  generation_id   INT NOT NULL REFERENCES vehicle_generation(id) ON DELETE CASCADE,
  -- denormalize: model → motor sorgusunu tek atlamada yapmak için
  model_id        INT NOT NULL REFERENCES vehicle_model(id) ON DELETE CASCADE,
  name            VARCHAR(120) NOT NULL,
  slug            VARCHAR(80)  NOT NULL,
  -- uyumluluk eşleştirmesinin en güvenilir anahtarı; bir motorun birden çok kodu olabilir
  engine_codes    TEXT[]       NOT NULL DEFAULT '{}',
  displacement_cc INT,
  power_kw        SMALLINT,
  power_hp        SMALLINT,
  fuel_type       vehicle_fuel_type NOT NULL,
  cylinders       SMALLINT,
  valves          SMALLINT,
  year_from       SMALLINT,
  year_to         SMALLINT,
  body_note       VARCHAR(120),
  sort_order      INT     NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  external_refs   JSONB,
  UNIQUE (generation_id, slug)
);
CREATE INDEX vehicle_engine_model_idx  ON vehicle_engine (model_id, is_active, sort_order);
CREATE INDEX vehicle_engine_codes_idx  ON vehicle_engine USING GIN (engine_codes);

-- ────────────────────────────── ÜRÜN KATALOGU ───────────────────────────────

CREATE TABLE product_brand (
  id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name            VARCHAR(80) NOT NULL,
  slug            VARCHAR(60) NOT NULL UNIQUE,
  logo_url        TEXT,
  country         VARCHAR(40),
  description     TEXT,
  seo_title       VARCHAR(160),
  seo_description VARCHAR(320),
  is_featured     BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order      INT     NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX product_brand_featured_idx ON product_brand (is_featured DESC, sort_order);

CREATE TABLE category (
  id              INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  parent_id       INT REFERENCES category(id) ON DELETE RESTRICT,
  code            VARCHAR(48)  NOT NULL UNIQUE,
  name            VARCHAR(120) NOT NULL,
  slug            VARCHAR(80)  NOT NULL UNIQUE,
  -- materialized path: 'filtreler.hava-filtreleri'
  path            VARCHAR(255) NOT NULL UNIQUE,
  depth           SMALLINT NOT NULL DEFAULT 0,
  icon            VARCHAR(40),
  image_url       TEXT,
  description     TEXT,
  seo_title       VARCHAR(160),
  seo_description VARCHAR(320),
  seo_intro       TEXT,
  sort_order      INT     NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX category_parent_idx ON category (parent_id, sort_order);
CREATE INDEX category_path_idx   ON category (path varchar_pattern_ops);

-- Facet tanımları. Yeni teknik özellik eklemek kod değişikliği gerektirmez.
CREATE TABLE category_attribute (
  id            INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id   INT NOT NULL REFERENCES category(id) ON DELETE CASCADE,
  key           VARCHAR(48) NOT NULL,
  label         VARCHAR(80) NOT NULL,
  unit          VARCHAR(16),
  data_type     attribute_data_type NOT NULL DEFAULT 'TEXT',
  enum_values   TEXT[] NOT NULL DEFAULT '{}',
  is_facet      BOOLEAN NOT NULL DEFAULT TRUE,
  is_filterable BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order    INT     NOT NULL DEFAULT 0,
  UNIQUE (category_id, key)
);

CREATE TABLE product (
  id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  sku               VARCHAR(64)  NOT NULL UNIQUE,
  slug              VARCHAR(140) NOT NULL UNIQUE,
  name              VARCHAR(200) NOT NULL,
  -- üreticinin görünen kodu; arayüzde monospace: 'C 35 154'
  product_code      VARCHAR(64),
  brand_id          INT NOT NULL REFERENCES product_brand(id),
  category_id       INT NOT NULL REFERENCES category(id),
  short_description VARCHAR(320),
  description       TEXT,
  -- teknik özellikler; anahtarlar category_attribute.key ile eşleşir
  specs             JSONB NOT NULL DEFAULT '{}'::jsonb,
  status            product_status NOT NULL DEFAULT 'ACTIVE',
  is_featured       BOOLEAN NOT NULL DEFAULT FALSE,
  sort_weight       INT     NOT NULL DEFAULT 0,
  seo_title         VARCHAR(160),
  seo_description   VARCHAR(320),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Türkçe tam metin arama vektörü (Faz 4'te arama servisi bunu kullanır)
  search_vector     tsvector GENERATED ALWAYS AS (
                      to_tsvector('turkish',
                        coalesce(name,'') || ' ' ||
                        coalesce(product_code,'') || ' ' ||
                        coalesce(short_description,''))
                    ) STORED
);
CREATE INDEX product_category_idx   ON product (category_id, status);
CREATE INDEX product_brand_idx      ON product (brand_id, status);
CREATE INDEX product_featured_idx   ON product (is_featured DESC, sort_weight);
CREATE INDEX product_search_idx     ON product USING GIN (search_vector);
CREATE INDEX product_name_trgm_idx  ON product USING GIN (name gin_trgm_ops);
CREATE INDEX product_specs_idx      ON product USING GIN (specs jsonb_path_ops);
CREATE INDEX product_sku_norm_idx   ON product (ocm_normalize_code(sku));

CREATE TABLE product_variant (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  sku        VARCHAR(64) NOT NULL UNIQUE,
  name       VARCHAR(80),
  barcode    VARCHAR(32),
  pack_size  NUMERIC(10,3) NOT NULL DEFAULT 1,
  unit       VARCHAR(8) NOT NULL DEFAULT 'ADET',
  weight_gr  INT,
  is_default BOOLEAN NOT NULL DEFAULT TRUE,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX product_variant_product_idx ON product_variant (product_id, is_default DESC);

CREATE TABLE price (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  variant_id     BIGINT NOT NULL REFERENCES product_variant(id) ON DELETE CASCADE,
  -- KDV HARİÇ; brüt = price_net * (1 + tax_rate/100)
  price_net      NUMERIC(12,2) NOT NULL CHECK (price_net >= 0),
  tax_rate       SMALLINT NOT NULL DEFAULT 20,
  list_price     NUMERIC(12,2),
  currency       CHAR(3) NOT NULL DEFAULT 'TRY',
  -- B2B'ye hazır
  customer_group VARCHAR(24) NOT NULL DEFAULT 'RETAIL',
  valid_from     TIMESTAMPTZ NOT NULL DEFAULT now(),
  valid_to       TIMESTAMPTZ,
  UNIQUE (variant_id, customer_group, valid_from)
);
CREATE INDEX price_variant_idx ON price (variant_id, customer_group);

CREATE TABLE stock (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  variant_id     BIGINT NOT NULL REFERENCES product_variant(id) ON DELETE CASCADE,
  warehouse_code VARCHAR(24) NOT NULL DEFAULT 'MERKEZ',
  quantity       INT NOT NULL DEFAULT 0,
  reserved       INT NOT NULL DEFAULT 0,
  lead_time_days SMALLINT,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (variant_id, warehouse_code)
);

CREATE TABLE product_image (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  url        TEXT NOT NULL,
  alt        VARCHAR(200),
  sort_order INT     NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX product_image_product_idx ON product_image (product_id, sort_order);

-- ─────────────────── KATMAN 2: KAYNAK BAZLI İDDİALAR ────────────────────────

CREATE TABLE compatibility_assertion (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id     BIGINT NOT NULL REFERENCES product(id)        ON DELETE CASCADE,
  engine_id      BIGINT NOT NULL REFERENCES vehicle_engine(id) ON DELETE CASCADE,
  source_id      INT    NOT NULL REFERENCES data_source(id),
  -- Faz 3'te import_job tablosuna FK olacak; kolon şimdiden ayrıldı
  import_job_id  BIGINT,
  assertion_type assertion_type NOT NULL DEFAULT 'COMPATIBLE',
  year_from      SMALLINT,
  year_to        SMALLINT,
  month_from     SMALLINT,
  month_to       SMALLINT,
  restriction    TEXT,
  note           TEXT,
  -- 'TUM_MOTORLAR:model=A1 (GB)' gibi toplu genişletme izi
  expanded_from  TEXT,
  is_active      BOOLEAN NOT NULL DEFAULT TRUE,
  asserted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, engine_id, source_id, assertion_type)
);
COMMENT ON TABLE compatibility_assertion IS
  'Kaynakların ürün↔motor İDDİALARI. Silinmez; çözümleme motoru bunlardan product_compatibility üretir.';

CREATE INDEX compat_assertion_pair_idx   ON compatibility_assertion (product_id, engine_id);
CREATE INDEX compat_assertion_engine_idx ON compatibility_assertion (engine_id);
CREATE INDEX compat_assertion_source_idx ON compatibility_assertion (source_id);
CREATE INDEX compat_assertion_job_idx    ON compatibility_assertion (import_job_id);

CREATE TABLE attribute_assertion (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id  BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  key         VARCHAR(48) NOT NULL,
  value       JSONB NOT NULL,
  source_id   INT NOT NULL REFERENCES data_source(id),
  asserted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, key, source_id)
);

-- ───────────── KATMAN 3: ÇÖZÜMLENMİŞ UYUMLULUK (HASH PARTITION × 16) ────────
-- Partition anahtarı (engine_id) birincil anahtarın parçası olmak ZORUNDA.
-- 40M+ satır hedefinde partition'a sonradan geçmek tam tablo yeniden yazımı
-- demektir; bu yüzden baştan kuruluyor. 1.000 SKU'da maliyeti sıfırdır.

CREATE TABLE product_compatibility (
  engine_id            BIGINT NOT NULL REFERENCES vehicle_engine(id) ON DELETE CASCADE,
  product_id           BIGINT NOT NULL REFERENCES product(id)        ON DELETE CASCADE,
  status               compat_status NOT NULL,
  year_from            SMALLINT,
  year_to              SMALLINT,
  month_from           SMALLINT,
  month_to             SMALLINT,
  restriction          TEXT,
  winning_assertion_id BIGINT,
  source_id            INT REFERENCES data_source(id),
  confidence           SMALLINT NOT NULL DEFAULT 50,
  has_conflict         BOOLEAN  NOT NULL DEFAULT FALSE,
  verified_by_user_id  BIGINT,
  verified_at          TIMESTAMPTZ,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (engine_id, product_id)
) PARTITION BY HASH (engine_id);

COMMENT ON TABLE product_compatibility IS
  'Sitenin okuduğu tek doğruluk. KURAL: yalnızca VERIFIED ve SOURCED arayüzde uyumlu gösterilir; CONFLICTED asla yeşil rozet almaz.';

CREATE TABLE product_compatibility_p00 PARTITION OF product_compatibility FOR VALUES WITH (MODULUS 16, REMAINDER 0);
CREATE TABLE product_compatibility_p01 PARTITION OF product_compatibility FOR VALUES WITH (MODULUS 16, REMAINDER 1);
CREATE TABLE product_compatibility_p02 PARTITION OF product_compatibility FOR VALUES WITH (MODULUS 16, REMAINDER 2);
CREATE TABLE product_compatibility_p03 PARTITION OF product_compatibility FOR VALUES WITH (MODULUS 16, REMAINDER 3);
CREATE TABLE product_compatibility_p04 PARTITION OF product_compatibility FOR VALUES WITH (MODULUS 16, REMAINDER 4);
CREATE TABLE product_compatibility_p05 PARTITION OF product_compatibility FOR VALUES WITH (MODULUS 16, REMAINDER 5);
CREATE TABLE product_compatibility_p06 PARTITION OF product_compatibility FOR VALUES WITH (MODULUS 16, REMAINDER 6);
CREATE TABLE product_compatibility_p07 PARTITION OF product_compatibility FOR VALUES WITH (MODULUS 16, REMAINDER 7);
CREATE TABLE product_compatibility_p08 PARTITION OF product_compatibility FOR VALUES WITH (MODULUS 16, REMAINDER 8);
CREATE TABLE product_compatibility_p09 PARTITION OF product_compatibility FOR VALUES WITH (MODULUS 16, REMAINDER 9);
CREATE TABLE product_compatibility_p10 PARTITION OF product_compatibility FOR VALUES WITH (MODULUS 16, REMAINDER 10);
CREATE TABLE product_compatibility_p11 PARTITION OF product_compatibility FOR VALUES WITH (MODULUS 16, REMAINDER 11);
CREATE TABLE product_compatibility_p12 PARTITION OF product_compatibility FOR VALUES WITH (MODULUS 16, REMAINDER 12);
CREATE TABLE product_compatibility_p13 PARTITION OF product_compatibility FOR VALUES WITH (MODULUS 16, REMAINDER 13);
CREATE TABLE product_compatibility_p14 PARTITION OF product_compatibility FOR VALUES WITH (MODULUS 16, REMAINDER 14);
CREATE TABLE product_compatibility_p15 PARTITION OF product_compatibility FOR VALUES WITH (MODULUS 16, REMAINDER 15);

-- En sık çalışan sorgu: motor → uyumlu ürünler
CREATE INDEX product_compatibility_engine_status_idx
  ON product_compatibility (engine_id, status) INCLUDE (product_id, restriction);
CREATE INDEX product_compatibility_product_idx
  ON product_compatibility (product_id);

-- ───────────────────────── OEM & ÇAPRAZ REFERANSLAR ─────────────────────────

CREATE TABLE product_reference (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id       BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  type             reference_type NOT NULL,
  brand_name       VARCHAR(80),
  vehicle_brand_id INT REFERENCES vehicle_brand(id),
  number           VARCHAR(64) NOT NULL,
  -- arama bunun üzerinden çalışır
  normalized       VARCHAR(64) NOT NULL,
  source_id        INT REFERENCES data_source(id),
  import_job_id    BIGINT,
  note             TEXT,
  UNIQUE (product_id, type, normalized)
);
CREATE INDEX product_reference_norm_idx ON product_reference (normalized);
CREATE INDEX product_reference_prod_idx ON product_reference (product_id, type);

-- ─────────────────────── ÇAKIŞMA KUYRUĞU (ADMIN) ────────────────────────────

CREATE TABLE data_conflict (
  id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  entity_type           VARCHAR(24) NOT NULL,
  product_id            BIGINT REFERENCES product(id) ON DELETE CASCADE,
  engine_id             BIGINT REFERENCES vehicle_engine(id) ON DELETE CASCADE,
  field                 VARCHAR(64),
  -- [{sourceId, sourceCode, trustLevel, value, assertedAt, assertionId}]
  candidates            JSONB NOT NULL,
  status                conflict_status   NOT NULL DEFAULT 'OPEN',
  severity              conflict_severity NOT NULL DEFAULT 'MEDIUM',
  resolved_assertion_id BIGINT,
  resolved_by_user_id   BIGINT,
  resolved_at           TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX data_conflict_unique_open_idx
  ON data_conflict (entity_type, product_id, engine_id, coalesce(field, ''))
  WHERE status = 'OPEN';
CREATE INDEX data_conflict_queue_idx ON data_conflict (status, severity, created_at DESC);

-- ──────────────── TÜRETİLMİŞ: PROGRAMATİK SEO KAPI BEKÇİSİ ──────────────────
-- product_count = 0 ise ilgili araç×kategori sayfası ÜRETİLMEZ ve sitemap'e girmez.

CREATE TABLE engine_category_index (
  engine_id      BIGINT NOT NULL REFERENCES vehicle_engine(id) ON DELETE CASCADE,
  category_id    INT    NOT NULL REFERENCES category(id)       ON DELETE CASCADE,
  product_count  INT NOT NULL DEFAULT 0,
  verified_count INT NOT NULL DEFAULT 0,
  brand_count    SMALLINT NOT NULL DEFAULT 0,
  min_price      NUMERIC(12,2),
  max_price      NUMERIC(12,2),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (engine_id, category_id)
);
CREATE INDEX engine_category_index_cat_idx
  ON engine_category_index (category_id, product_count DESC);
