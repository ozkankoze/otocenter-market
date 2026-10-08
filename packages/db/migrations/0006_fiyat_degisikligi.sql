-- ════════════════════════════════════════════════════════════════════════════
--  0006 · TOPLU FİYAT DEĞİŞİKLİĞİ KAYDI
-- ════════════════════════════════════════════════════════════════════════════
--
--  `npm run db:fiyat-zam` her uygulamada buraya bir satır yazar. Amaç, aynı
--  zammın yanlışlıkla iki kez uygulanmasını yakalamak (iki kez %1 = %2,01) ve
--  geriye dönük "fiyatlar ne zaman, ne kadar değişti" sorusuna cevap vermek.
--
--  Not: Ürün içe aktarması fiyatları kaynaktaki değerle yeniden yazar; buradaki
--  zamlar içe aktarmadan sonra kalıcı değildir.
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE fiyat_degisikligi (
  id              BIGSERIAL PRIMARY KEY,
  oran_yuzde      NUMERIC(6,2) NOT NULL,
  satir_sayisi    INTEGER      NOT NULL,
  onceki_toplam   NUMERIC(14,2) NOT NULL,  -- KDV hariç, tüm fiyat satırları
  sonraki_toplam  NUMERIC(14,2) NOT NULL,
  uygulandi_at    TIMESTAMPTZ  NOT NULL DEFAULT now()
);
