-- ════════════════════════════════════════════════════════════════════════════
--  0004 — Araç tipleri ikiye indirildi · öne çıkan ürünler işaretlendi
-- ════════════════════════════════════════════════════════════════════════════
--  HİÇBİR KAYIT SİLİNMEZ. Yalnızca `is_active` ve `is_featured` bayrakları
--  değişir. Şema değişmez.
--
--  Bu migration, KURULU bir veritabanını (canlı Neon dahil) yeniden seed
--  etmeden düzeltmek için var. Sıfırdan kurulumda aynı sonucu
--  `seed-data/vehicles.ts` ve `seed-data/one-cikanlar.ts` üretir.

-- ─────────────────────── 1. ARAÇ TİPLERİ: 7 → 2 ─────────────────────────────
--
--  Araç seçim menüsünde yedi tip görünüyordu; beşinin arkasında ürün yoktu:
--
--    Otobüs       → markaları (MAN, Mercedes-Benz, Otokar, Temsa) zaten
--                   "Ağır Vasıta" altında. Aynı araçlar menüde iki kez.
--    İş Makinesi  → CATERPILLAR / JCB / HİDROMEK: 1 model, 1 motor, 0 uyumluluk
--    Traktör      → NEW HOLLAND / MASSEY FERGUSON: aynı şekilde 0 uyumluluk
--    Motosiklet   → hiç marka yok
--    Jeneratör    → hiç marka yok
--
--  Arayüzdeki bütün sorgular `is_active = true` süzüyor; pasife çekmek
--  görünmez kılmak için yeterli, kayıt silmek gerekmiyor.

UPDATE vehicle_type
   SET is_active = false
 WHERE slug NOT IN ('otomobil', 'agir-vasita');

--  Yalnızca kapatılan tiplere bağlı kalan markalar da görünmez olsun.
--  Ağır Vasıta'da da bulunan markalar (MAN, Mercedes-Benz, Otokar, Temsa)
--  bu koşula TAKILMAZ; onların aktif bir tip bağı var ve dokunulmaz.

UPDATE vehicle_brand b
   SET is_active = false
 WHERE b.is_active
   AND NOT EXISTS (
     SELECT 1
       FROM vehicle_brand_type bt
       JOIN vehicle_type t ON t.id = bt.type_id
      WHERE bt.brand_id = b.id
        AND t.is_active
   );

-- ──────────────────── 2. ÖNE ÇIKAN ÜRÜNLER (20 adet) ────────────────────────
--
--  Seçim kuralı ve gerekçesi: packages/db/scripts/seed-data/one-cikanlar.ts
--  Özet: gerçek fotoğrafı olan (.webp), en az 3 araca uyumlu, kategoriye
--  dağıtılmış, markaya dengeli (9 FILTRON · 11 MANN-FILTER) ürünler.
--
--  Önce sıfırlanır: liste değiştiğinde eski işaretler kalmasın.

UPDATE product SET is_featured = false WHERE is_featured;

UPDATE product
   SET is_featured = true
 WHERE sku IN (
   -- Hava filtreleri
   'FILTRON-AP1497', 'FILTRON-AP1792', 'FILTRON-AP1909',
   'MANN-C25002', 'MANN-C28155',
   -- Yağ filtreleri
   'FILTRON-OE6409', 'FILTRON-OE6724', 'MANN-HU7001X', 'MANN-HU7186X',
   -- Yakıt filtreleri
   'FILTRON-PE995', 'FILTRON-PP8483', 'MANN-WK8243', 'MANN-WK8544',
   -- Polen / kabin filtreleri
   'FILTRON-K1302', 'FILTRON-K1308', 'MANN-CU17212', 'MANN-CUK2559', 'MANN-CUK3172',
   -- Ağır vasıta
   'MANN-TB13943X', 'MANN-H50001'
 );
