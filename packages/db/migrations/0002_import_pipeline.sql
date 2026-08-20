-- ════════════════════════════════════════════════════════════════════════════
--  FAZ 2 / SPRINT 4 — IMPORT PIPELINE
-- ════════════════════════════════════════════════════════════════════════════
--  Bu migration YALNIZCA EKLER. Mevcut tablo, kolon, enum veya index
--  değiştirilmez/silinmez. Assertion mimarisi, data_source ve çözümleme
--  motoru olduğu gibi kalır — import pipeline onların ÜSTÜNE oturur.
--
--  Akış:
--    UPLOAD → PARSE → STAGING → VALIDATE → PREVIEW → CONFIRM → COMMIT
--           → RESOLVE → REPORT        (geri alma: import_change defteri)
-- ════════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────── ENUM'LAR ─────────────────────────────────

CREATE TYPE import_status AS ENUM (
  'UPLOADED',     -- dosya alındı
  'PARSED',       -- sayfalar okundu, staging'e yazıldı
  'VALIDATED',    -- satır bazlı doğrulama bitti, önizleme hazır
  'COMMITTING',   -- production tablolarına yazılıyor
  'COMPLETED',    -- uygulandı
  'FAILED',       -- ayrıştırma/uygulama hatası
  'CANCELLED',    -- kullanıcı onaylamadan iptal etti
  'ROLLED_BACK'   -- geri alındı
);

-- Dosyadaki mantıksal sayfa tipleri (04-CSV-IMPORT-FORMATI.md ile birebir)
CREATE TYPE import_sheet AS ENUM (
  'CATEGORY',      -- kategoriler
  'VEHICLE',       -- arac-agaci
  'PRODUCT',       -- urunler
  'PRICE_STOCK',   -- fiyat-stok
  'REFERENCE',     -- oem-capraz
  'COMPATIBILITY'  -- uyumluluk
);

CREATE TYPE import_row_status AS ENUM (
  'VALID',    -- uygulanabilir
  'WARNING',  -- uygulanabilir ama kullanıcı bilmeli
  'ERROR',    -- uygulanmaz; DİĞER SATIRLARI ETKİLEMEZ
  'SKIPPED',  -- dosya içinde tekrar eden satır
  'APPLIED'   -- commit sırasında uygulandı
);

CREATE TYPE import_action AS ENUM ('CREATE', 'UPDATE', 'UNCHANGED', 'NONE');

-- ─────────────────────────────── ADMIN KULLANICI ────────────────────────────
-- Import geçmişinde "kim yükledi" izini tutabilmek için minimum kullanıcı.
-- Tam yetkilendirme sistemi bu sprintin kapsamı değil.

CREATE TABLE admin_user (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      VARCHAR(160) NOT NULL UNIQUE,
  name       VARCHAR(120) NOT NULL,
  role       VARCHAR(24)  NOT NULL DEFAULT 'ADMIN',
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- ────────────────────────────────── IMPORT JOB ──────────────────────────────

CREATE TABLE import_job (
  id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  file_name            VARCHAR(255) NOT NULL,
  file_size            INT          NOT NULL DEFAULT 0,
  -- aynı dosyanın tekrar yüklendiğini fark etmek için
  file_hash            CHAR(64),
  -- İDDİALARIN SAHİBİ. Çözümleme motoru güven seviyesini buradan okur.
  source_id            INT NOT NULL REFERENCES data_source(id),
  status               import_status NOT NULL DEFAULT 'UPLOADED',
  created_by_user_id   BIGINT REFERENCES admin_user(id),
  rolled_back_by_user_id BIGINT REFERENCES admin_user(id),

  -- {"PRODUCT": 120, "COMPATIBILITY": 3120, ...}
  sheet_counts         JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- {"total":..,"valid":..,"error":..,"warning":..,"created":..,"updated":..,
  --  "duplicate":..,"conflictRisk":..,"missingVehicle":..}
  totals               JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- {"pricesIncludeTax":false,"expandAllEngines":true,"dryRun":false}
  options              JSONB NOT NULL DEFAULT '{}'::jsonb,
  error_message        TEXT,

  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  parsed_at            TIMESTAMPTZ,
  validated_at         TIMESTAMPTZ,
  committed_at         TIMESTAMPTZ,
  rolled_back_at       TIMESTAMPTZ
);

COMMENT ON TABLE import_job IS
  'Her içe aktarma denemesi. Kullanıcı onaylamadan production tablolarına tek satır yazılmaz.';

CREATE INDEX import_job_status_idx ON import_job (status, created_at DESC);
CREATE INDEX import_job_source_idx ON import_job (source_id, created_at DESC);
CREATE INDEX import_job_hash_idx   ON import_job (file_hash) WHERE file_hash IS NOT NULL;

-- 0001'de "Faz 3'te import_job tablosuna FK olacak" notu bırakılmıştı; artık var.
ALTER TABLE compatibility_assertion
  ADD CONSTRAINT compatibility_assertion_import_job_fk
  FOREIGN KEY (import_job_id) REFERENCES import_job(id) ON DELETE SET NULL;

ALTER TABLE product_reference
  ADD CONSTRAINT product_reference_import_job_fk
  FOREIGN KEY (import_job_id) REFERENCES import_job(id) ON DELETE SET NULL;

-- ─────────────────────────────── STAGING SATIRLARI ──────────────────────────
-- Dosyadaki HER satır önce buraya yazılır. Production tablolarına yazım
-- yalnızca kullanıcı onayından sonra ve yalnızca VALID/WARNING satırlar için
-- yapılır. Böylece 10.000 satırın 150'si hatalıysa kalan 9.850 satır uygulanır.

CREATE TABLE import_staging_row (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  import_job_id  BIGINT NOT NULL REFERENCES import_job(id) ON DELETE CASCADE,
  sheet          import_sheet NOT NULL,
  -- kaynak dosyadaki satır numarası (başlık satırı = 1)
  row_no         INT NOT NULL,
  -- ham hücreler, olduğu gibi (hata raporunda orijinal sütunlar korunur)
  raw            JSONB NOT NULL,
  -- doğrulama sonrası normalize edilmiş değerler + çözümlenmiş id'ler
  normalized     JSONB,
  status         import_row_status NOT NULL DEFAULT 'VALID',
  action         import_action     NOT NULL DEFAULT 'NONE',
  entity_type    VARCHAR(32),
  entity_id      BIGINT,
  -- [{"code":"E_ENGINE_NOT_FOUND","level":"ERROR","field":"motor_kodu","message":"..."}]
  messages       JSONB NOT NULL DEFAULT '[]'::jsonb,
  UNIQUE (import_job_id, sheet, row_no)
);

CREATE INDEX import_staging_row_job_idx    ON import_staging_row (import_job_id, sheet, status);
CREATE INDEX import_staging_row_status_idx ON import_staging_row (import_job_id, status, row_no);

-- ────────────────────────── DEĞİŞİKLİK DEFTERİ (ROLLBACK) ───────────────────
-- Commit sırasında yazılan/güncellenen HER kaydın öncesi ve sonrası buraya
-- düşer. Geri alma bu defterden yapılır.
--
-- GÜVENLİK KURALI: bir kayıt daha sonraki BAŞKA bir import tarafından
-- güncellendiyse geri alınmaz — atlanır ve nedeni yazılır. Böylece eski bir
-- import'un geri alınması, sonraki import'un doğru verisini bozmaz.

CREATE TABLE import_change (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  import_job_id BIGINT NOT NULL REFERENCES import_job(id) ON DELETE CASCADE,
  -- 'product' | 'product_variant' | 'price' | 'stock' | 'product_reference'
  -- | 'compatibility_assertion' | 'category' | 'product_brand'
  -- | 'vehicle_brand' | 'vehicle_model' | 'vehicle_generation' | 'vehicle_engine'
  entity_type   VARCHAR(32) NOT NULL,
  entity_id     BIGINT      NOT NULL,
  operation     VARCHAR(8)  NOT NULL CHECK (operation IN ('INSERT', 'UPDATE')),
  -- UPDATE ise değişen kolonların ESKİ hali; INSERT ise NULL
  before        JSONB,
  -- yazılan hal (denetim izi)
  after         JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  reverted_at   TIMESTAMPTZ,
  skip_reason   TEXT
);

COMMENT ON TABLE import_change IS
  'Rollback defteri. Sonraki bir import aynı kaydı güncellediyse geri alma atlanır.';

CREATE INDEX import_change_job_idx    ON import_change (import_job_id, id DESC);
CREATE INDEX import_change_entity_idx ON import_change (entity_type, entity_id, id DESC);
