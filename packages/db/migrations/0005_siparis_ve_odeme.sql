-- ════════════════════════════════════════════════════════════════════════════
--  0005 · SİPARİŞ VE ÖDEME (PayTR iFrame API)
-- ════════════════════════════════════════════════════════════════════════════
--
--  AKIŞ
--    1. Ödeme sayfası formu gönderilir. Sunucu sepeti VERİTABANINDAN yeniden
--       fiyatlar (istemciden gelen fiyata asla güvenilmez), stoğu kontrol eder,
--       siparişi PENDING_PAYMENT olarak yazar.
--    2. PayTR'dan token alınır, müşteri iFrame içinde kartla öder.
--    3. PayTR, ödeme sonucunu sunucudan sunucuya "bildirim URL"sine POST eder.
--       Sipariş YALNIZCA imzası doğrulanmış bu bildirimle PAID olur. Tarayıcının
--       başarı sayfasına yönlendirilmesi hiçbir şey kanıtlamaz.
--
--  TUTARLAR KURUŞ CİNSİNDEN TAM SAYI (BIGINT). PayTR de tutarı ×100 tam sayı
--  olarak istiyor; ondalıklı sayı hiç kullanılmayınca yuvarlama farkı olamaz.
-- ════════════════════════════════════════════════════════════════════════════

CREATE TYPE order_status AS ENUM (
  'PENDING_PAYMENT',  -- sipariş yazıldı, ödeme bekleniyor
  'PAID',             -- PayTR imzalı bildirimle ödemeyi onayladı
  'PAYMENT_FAILED',   -- PayTR imzalı bildirimle ödemenin başarısız olduğunu bildirdi
  'SHIPPED',          -- kargoya verildi
  'DELIVERED',        -- teslim edildi
  'CANCELLED',        -- iptal (ödeme alınmadan ya da iade edilerek)
  'REFUNDED'          -- iade edildi (iade PayTR panelinden yapılır, burada kayıt)
);

CREATE TYPE invoice_type    AS ENUM ('BIREYSEL', 'KURUMSAL');
-- Kargo bedelini kim öder: 500 ₺ ve üzeri SATICI, altı ALICI (teslimatta, kargoya).
CREATE TYPE shipping_payer  AS ENUM ('SATICI', 'ALICI');

CREATE TABLE customer_order (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  -- Müşteriye gösterilen sipariş numarası AYNI ZAMANDA PayTR `merchant_oid`.
  -- PayTR yalnızca harf ve rakam kabul ediyor (en fazla 64), bu yüzden tire yok.
  order_no         VARCHAR(32) NOT NULL UNIQUE CHECK (order_no ~ '^[A-Z0-9]+$'),
  status           order_status NOT NULL DEFAULT 'PENDING_PAYMENT',

  -- ── Müşteri ──
  full_name        VARCHAR(60)  NOT NULL,
  email            VARCHAR(100) NOT NULL,
  phone            VARCHAR(20)  NOT NULL,

  -- ── Teslimat adresi ──
  ship_city        VARCHAR(40)  NOT NULL,
  ship_district    VARCHAR(60)  NOT NULL,
  ship_address     VARCHAR(300) NOT NULL,
  ship_postal_code VARCHAR(10),

  -- ── Fatura ──
  invoice_type       invoice_type NOT NULL DEFAULT 'BIREYSEL',
  invoice_name       VARCHAR(160),          -- kurumsal: şirket unvanı
  invoice_tax_office VARCHAR(60),
  invoice_tax_no     VARCHAR(11),           -- VKN (10) veya TCKN (11)
  invoice_address    VARCHAR(300),          -- NULL → teslimat adresiyle aynı

  -- ── Tutarlar (kuruş) ──
  subtotal_kurus     BIGINT NOT NULL CHECK (subtotal_kurus > 0),   -- ürünler, KDV dahil
  shipping_kurus     BIGINT NOT NULL DEFAULT 0 CHECK (shipping_kurus >= 0),
  shipping_payer     shipping_payer NOT NULL,
  total_kurus        BIGINT NOT NULL CHECK (total_kurus > 0),      -- PayTR payment_amount
  currency           CHAR(3) NOT NULL DEFAULT 'TRY',

  -- ── PayTR sonucu ──
  -- total_amount: müşteriden ÇEKİLEN tutar. Taksitli ödemede vade farkı müşteriye
  -- yansıtıldığı için total_kurus'tan BÜYÜK olabilir. İkisi ayrı tutulur.
  paid_total_kurus   BIGINT,
  installment_count  SMALLINT,
  payment_type       VARCHAR(16),           -- 'card' | 'eft'
  test_mode          BOOLEAN NOT NULL DEFAULT FALSE,
  failed_reason_code VARCHAR(16),
  failed_reason_msg  VARCHAR(300),

  -- Ödeme onaylandığında stok sipariş adedinden az kaldıysa işaretlenir.
  -- Ödeme zaten alınmıştır; sipariş reddedilmez, yönetim panelinde öne çıkar.
  stock_shortage     BOOLEAN NOT NULL DEFAULT FALSE,

  -- ── Kargo ──
  cargo_company      VARCHAR(40),
  tracking_no        VARCHAR(60),

  -- ── Yasal onay ──
  -- Ön bilgilendirme formu + mesafeli satış sözleşmesi bu sürümle onaylandı.
  terms_version      VARCHAR(16) NOT NULL,
  terms_accepted_at  TIMESTAMPTZ NOT NULL,
  customer_ip        VARCHAR(45) NOT NULL,

  admin_note         TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at            TIMESTAMPTZ,
  shipped_at         TIMESTAMPTZ,

  CHECK (total_kurus = subtotal_kurus + shipping_kurus),
  CHECK (invoice_type = 'BIREYSEL' OR (invoice_name IS NOT NULL AND invoice_tax_office IS NOT NULL AND invoice_tax_no IS NOT NULL))
);
CREATE INDEX customer_order_status_idx  ON customer_order (status, created_at DESC);
CREATE INDEX customer_order_email_idx   ON customer_order (lower(email));
CREATE INDEX customer_order_created_idx ON customer_order (created_at DESC);

-- Sipariş satırları — sipariş anındaki ürün ve fiyatın ANLIK GÖRÜNTÜSÜ.
-- Ürün sonradan değişse ya da silinse bile sipariş ne alındıysa onu gösterir.
CREATE TABLE order_item (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id         BIGINT NOT NULL REFERENCES customer_order(id) ON DELETE CASCADE,
  variant_id       BIGINT REFERENCES product_variant(id) ON DELETE SET NULL,
  product_id       BIGINT REFERENCES product(id) ON DELETE SET NULL,
  sku              VARCHAR(64)  NOT NULL,
  product_title    VARCHAR(255) NOT NULL,
  product_slug     VARCHAR(255),
  quantity         INT    NOT NULL CHECK (quantity > 0),
  unit_price_kurus BIGINT NOT NULL CHECK (unit_price_kurus > 0),   -- KDV dahil
  tax_rate         SMALLINT NOT NULL,
  line_total_kurus BIGINT NOT NULL,
  CHECK (line_total_kurus = unit_price_kurus * quantity)
);
CREATE INDEX order_item_order_idx ON order_item (order_id);

-- PayTR'dan gelen HER bildirim, doğrulansın ya da doğrulanmasın, ham hâliyle
-- kayda geçer. İtiraz, ters ibraz ve hata ayıklama için tek kanıt budur.
CREATE TABLE payment_notification (
  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_no     VARCHAR(64),
  status       VARCHAR(16),
  total_amount BIGINT,
  hash_valid   BOOLEAN NOT NULL,
  -- Bildirimin işlenme sonucu: 'PAID', 'FAILED', 'DUPLICATE', 'BAD_HASH',
  -- 'UNKNOWN_ORDER', 'AMOUNT_MISMATCH', 'IGNORED_LATE' ...
  outcome      VARCHAR(32) NOT NULL,
  payload      JSONB NOT NULL,
  received_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX payment_notification_order_idx ON payment_notification (order_no, received_at DESC);
