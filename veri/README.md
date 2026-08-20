# veri/

Betiklerin ÜRETTİĞİ ara dosyalar burada oluşur:

- `urunler.xlsx` — içe aktarma şablonuna uygun ürün dosyası
  (`npm run db:urun-import-uret`)
- `arac-agaci-kontrol.xlsx` — araç ağacının gözle kontrol çıktısı
  (`npm run db:vehicle-tree:export`)

Bu dosyalar **kaynak değildir**, her çalıştırmada yeniden üretilir. Doğruluk
kaynağı `packages/db/scripts/seed-data/` altındaki transkripsiyon dosyalarıdır.
