-- ════════════════════════════════════════════════════════════════════════════
--  0007 · SET ÜRÜNLER
-- ════════════════════════════════════════════════════════════════════════════
--
--  Bir aracın yağ, hava, yakıt ve polen filtresini tek üründe toplayan setler.
--  Set, sitede sıradan bir ürün gibi listelenir (kendi fiyatı, stoğu, görseli
--  ve uyumluluğu vardır); içeriği product_set_item tablosunda tutulur.
--
--  Setleri `npm run db:set-olustur` üretir: fiyat, bileşenlerin toplamından
--  indirimle; stok, bileşenlerin en düşüğünden; uyumluluk, bileşenlerin ORTAK
--  motorlarından hesaplanır.
-- ════════════════════════════════════════════════════════════════════════════

CREATE TABLE product_set_item (
  set_product_id       BIGINT   NOT NULL REFERENCES product(id) ON DELETE CASCADE,
  component_product_id BIGINT   NOT NULL REFERENCES product(id) ON DELETE RESTRICT,
  quantity             SMALLINT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  sort_order           SMALLINT NOT NULL DEFAULT 0,
  PRIMARY KEY (set_product_id, component_product_id)
);
CREATE INDEX product_set_item_component_idx ON product_set_item (component_product_id);

-- Setlerin uyumluluk iddiaları bu kaynaktan gelir; çözümleme motoru onları
-- diğer iddialar gibi product_compatibility'ye taşır.
INSERT INTO data_source (code, name, kind, trust_level)
VALUES ('SET_TURETILMIS', 'Filtre setleri (bileşenlerin ortak uyumluluğu)', 'DERIVED', 60)
ON CONFLICT (code) DO NOTHING;

INSERT INTO category (parent_id, code, name, slug, path, depth, icon, sort_order,
                      seo_title, seo_description, seo_intro)
SELECT f.id, 'SET_URUNLER', 'Set Ürünler', 'set-urunler', f.path || '.set-urunler', 1,
       'package', 10,
       'Filtre Setleri | Oto Center Market',
       'Aracınıza uygun yağ, hava, yakıt ve polen filtresi setleri. Ayrı ayrı almaya göre daha uygun fiyatlı MANN-FILTER bakım setleri.',
       'Filtre setleri, aracınızın periyodik bakımında değişen yağ, hava, yakıt ve polen filtrelerini tek pakette toplar. Setler ayrı ayrı almaya göre daha uygundur.'
FROM category f
WHERE f.code = 'FILTRELER'
ON CONFLICT (code) DO NOTHING;
