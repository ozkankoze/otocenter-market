-- ════════════════════════════════════════════════════════════════════════════
--  0003 — product_variant.sku için normalleştirilmiş arama indeksi
-- ════════════════════════════════════════════════════════════════════════════
--  YALNIZCA EKLER. Hiçbir tablo, kolon veya mevcut indeks değiştirilmez.
--
--  NEDEN
--  ─────
--  İçe aktarma varyantları `ocm_normalize_code(sku)` ile arıyor. `product`
--  tablosunda bunun indeksi var (`product_sku_norm_idx`, 0001), `product_variant`
--  tablosunda YOKTU. Sonuç: her arama tam tablo taraması.
--
--  Ölçüm (2.677 varyant, yerel):
--      select * from product_variant where ocm_normalize_code(sku) = ?
--      → 2.677 çağrı · 9.724 ms   (çağrı başına 3,6 ms — grubun en yavaşı)
--
--  Toplu okumaya geçildikten sonra içe aktarma bu sorguyu artık satır satır
--  atmıyor; ama aynı arama yönetim panelinde ve tekil aramalarda da kullanılıyor.
--  İndeks oradaki gecikmeyi de kaldırır.

CREATE INDEX IF NOT EXISTS product_variant_sku_norm_idx
  ON product_variant (ocm_normalize_code(sku));
