# Bekleyen iş

## Kapatılanlar (2026-08)

- Audi'nin 40 modelinin motorları girildi (388 motor).
- Alfa Romeo'nun kalan ürünleri (Stelvio 8, MiTo 4) ve Audi A5'in 22 ürünü
  içe aktarıldı. Ürün kataloğu çok markalı hâle getirildi (`seed-data/urunler.ts`).
- Audi ürünlerinin gerçek fotoğrafı ekran görüntülerinden çıkarıldı.
- Audi A5 (8T, 8F) TAMAMLANDI: 25 motorun tamamında ürün var.
- Audi A4 (8K, B8): 23 motorun 22'sinde ürün var (13 motor daha eklendi).
- Audi A4 (8E/8H, B6+B7): 18 motorun 15'inde ürün var.
- Audi A6 (4F/C6) TAMAMLANDI: 18 motorun tamamında ürün var.
- Audi Q5 (8R) TAMAMLANDI: 19 motorun tamamında ürün var.
- Audi A3 (8P) TAMAMLANDI: 17 motorun tamamında ürün var.
- Audi A6 (4G2/4G5/4GC/4GD): 19 motorun tamamında ürün var — ama EKSİK
  (aşağıya bak, MANN kartlarının kodu okunmuyor).
- Yeni kategori: **Şanzuman Filtreleri** (`SANZUMAN_FILTRESI`, sıra 17).
- Audi A4 (8W) TAMAMLANDI: 19 motorun tamamında ürün var.
- Audi Q5 II (FY) TAMAMLANDI: 18 motorun tamamında ürün var.
- Audi A3 (8YA, 8YS) TAMAMLANDI: 14 motorun tamamında ürün var.
- Audi Q3 (8U) TAMAMLANDI: 14 motorun tamamında ürün var.
- Audi A6 (4A_/C8) TAMAMLANDI: 15 motorun tamamında ürün var.
- Audi A1 (8X) TAMAMLANDI: 11 motorun tamamında ürün var.
- Audi Q7 (4L) TAMAMLANDI: 9 motorun tamamında ürün var.
- Audi A3 (8VA/8VS/8V7) TAMAMLANDI: 11 motorun tamamında ürün var.
- Audi A7 (4GA/GF) başladı: 13 motorun 12'sinde ürün var.
- Audi Q3 (F3) başladı: 12 motorun 7'sinde ürün var.
- Audi A5 + A5 Cabriolet + Sportback (F5) TAMAMLANDI: 9 motorun tamamında ürün var.
- Audi TT/TTS/TTRS II (8J) TAMAMLANDI: 7 motorun tamamında ürün var.
- Audi A5 (F5) TAMAMLANDI: 9 motorun tamamında ürün var.
- Katalog: 251 ürün · 2.984 uyumluluk · 308 motor.

## Açık kalanlar

### A5 (F5) fiyat eşleşmesi DOĞRULANDI

Aşağıdaki not artık kapanmıştır: "A5 (F5)" modelinin kendi sayfaları (kart
başlığı kısa olduğu için kodlar AÇIK yazıyor) geldiğinde, fiyat eşleşmesiyle
çıkardığım kodların TAMAMI birebir doğrulandı — HU7020z, HU7012z, HU6013z,
W712/95, CU31003, CUK31003, FP31003, C17010, C17011, C17012/1, C17013,
WK6003, WK6008, OE688/3, OP616/3, PP991, PP991/3, K1378, K1378A.
Tek eşleşmeyen kart (hava 1.390,26) hâlâ içe aktarılmıyor.

### (kapandı) A5 (F5) fiyat eşleşmesiyle yüklendi — doğrulanması iyi olur

Bu modelin kartlarında da parça kodu görünmüyor (model adı üç satırı
dolduruyor). A6 (4G)'den farklı olarak burada 13 kartın MARKA + KATEGORİ +
FİYAT üçlüsü A4 (8W) ve Q5 II (FY) ürünleriyle kuruşuna kadar tuttuğu için —
üçü de aynı MLB evo platformu ve aynı filtre ailesi — kullanıcı kararıyla
fiyat eşleşmesi kullanıldı.

Eşleşmeyen tek kart içe AKTARILMADI: 35 TFSI sayfasındaki hava filtresi
1.390,26 (kataloğumdaki C17013 1.371,01 ile tutmuyor).

Kod görünen bir ekran gelirse eşleşmeler doğrulanabilir.

### A6 (4G) kart başlıklarında parça kodu görünmüyor — ekran gerekli

Modelin adı ("A6 (4G2/4G5/4GC/4GD)") kart başlığındaki üç satırı tek başına
doldurduğu için parça kodu kırpılıyor. MANN kartlarının ürün fotoğrafında da
kod yazmıyor. Bu yüzden bu modelden yalnızca kodu okunabilen 8 ürün içe
aktarıldı (HU7008z, HU7020z kutu fotoğrafından; OE688, OE688/3, AR371/6,
PP991, PP991/3, K1318A görsel başlığından).

19 motorun hepsinde ürün var ama listeler EKSİK: motor başına 2–8 ürün
girilebildi, kaynakta 6–13 kart var.

Okunamayan 12 MANN kartı (model genelinde tekrar ediyor):

| Kategori | Fiyat |
|---|---|
| Hava | 969,88 · 1.092,21 |
| Yağ | 382,27 · 482,41 · 635,67 · 648,77 |
| Yakıt | 1.081,29 · 1.162,11 · 1.363,08 · 2.846,30 |
| Polen | 1.515,99 · 1.931,03 |

Bunlar 12 AYRI ürün; her motorda tekrar ettikleri için 19 motorun tamamı
eksik kalıyor. En kısa yol: bu 12 kartın ürün DETAY sayfasını tek tek açıp
birer ekran görüntüsü göndermek — motor sayfalarını tekrar taramaya gerek yok.
Alternatif: tarayıcı penceresini daraltıp kartlar iki sütuna düşünce başlık
daha çok satıra yayılıyor ve kod görünür hâle geliyor.

### Parça kodu okunamayan 5 kayıt

| Marka | Ürün | Fiyat | Sorun |
|---|---|---|---|
| MANN | Polen Kabin filtresi (Tonale) | 703,31 | kaynakta kod yok |
| MANN | Polen Kabin filtresi (Tonale) | 873,73 | kaynakta kod yok |
| MANN | Polen Kabin filtresi (MiTo) | 1.347,79 | kaynakta kod yok |
| MANN | Polen Kabin (Giulietta) | 1.048,52 | **kart metni kırpık** — ekran tekrarı gerekli |
| MANN | Yağ Filtresi (Giulietta) | 224,99 | **kart metni kırpık** — ekran tekrarı gerekli |

Giulietta'nın yağ filtresi fiyatı MiTo'daki HU713/1x ile birebir aynı ve
motorları da aynı; büyük ihtimalle aynı ürün. Ama "büyük ihtimalle" yanlış
parça satmak için yeterli değil — ekranın tekrarı isteniyor.

### Kaynakta kodu ÜÇ SATIRDA KIRPILAN 6 kart (çözüldü)

B6+B7'nin bazı sayfalarında kart başlığı üç satıra sığmadığı için parça kodu
kesiliyor: 3.0 V6 / 2.0 TFSI / 3.2 FSI sayfalarındaki "Şanzuman Filtresi" ve
2.0 TFSI sayfalarındaki "Polen Kabin filtresi" kartları.

Bunlar tahminle doldurulmadı: aynı modelin başka motor sayfalarında AYNI marka,
AYNI kategori, AYNI fiyat ve AYNI ürün fotoğrafıyla kodu açık yazan kart var
(H2019KIT1 · 2.245,58 ve CUK3037 · 1.201,43). Kırpılma ekranın satır sınırından,
kaynakta kod eksikliğinden değil. Yine de gözden geçirilmek istenirse liste bu.

### A4 (8W) fiyat çakışması — karar verildi

Aynı parça kodu Mild Hybrid ve düz 2.0 TDI sayfalarında FARKLI fiyatta
listeleniyor. Kullanıcı kararı: **en yüksek fiyat esas alınır.** Bunun yan
etkisi olarak üç mevcut ürünün fiyatı yükseldi ve bu ürünler başka modellerin
sayfalarında da yeni fiyattan görünüyor:

| Kod | Eski | Yeni | Etkilenen diğer modeller |
|---|---|---|---|
| WK6003 | 1.081,29 | 1.100,47 | A5, A4 (8K), Q5 |
| PP991 | 850,41 | 882,26 | A5, A4 (8K), Q5, A6 (4G) |
| PP991/3 | 1.080,37 | 1.122,91 | A6 (4G) |
| HU6013z | 382,27 | 388,98 | A4 (8K), Q5 (8R) |
| C17010 | 1.097,08 | 1.168,67 | — (yalnız A4 8W / Q5 FY) |
| HU719/6x | 528,63 | 539,15 | B6+B7, A6 (4F/C6), A3 (8P) |
| OE671/3 | 310,23 | 323,35 | A6 (4F/C6), A3 (8P) |
| OP616/3 | 273,35 | 282,83 | A3 (8P), A4 (8W) |
| C27009 | 663,42 | 752,43 | A3 (8P) |
| AP062/1 | 466,42 | 484,24 | A3 (8P) |
| HU7020z | 349,51 | 367,80 | A5, A4 (8K/8W), Q5 (8R), Q3, A6 (4G) |
| OE688/3 | 264,67 | 276,04 | A5, A4 (8K/8W), Q5, Q3, A6 (4G) |

Tersi istenirse tek satır değişiklikle en düşüğe dönülebilir.

### Fotoğrafı olmayan 76 ürün

Kaynakta da fotoğrafı yok ("Ürün görseli hazırlanıyor" ya da "Alerji Önleyici
Filtre" pazarlama görseli). Kategori çizimi gösteriliyor. Gerçek fotoğraf
gelince `apps/web/public/urun/<SKU>.png` üzerine kopyalamak yeterli; çıkarıcı
betik yer tutucuyu ezer, gerçek fotoğrafı ezmez.

### Eksik kalan tek A4 (8K, B8) motoru

`1.8 TFSI 125kw 170hp` — bu motorun ürün listesi ekran görüntüsü gelmedi.
Aynı isimli motor A5 (8T, 8F) tarafında dolu; ama A5 listesini A4'e kopyalamak
"muhtemelen aynıdır" varsayımı olur, o yüzden yapılmadı. Ekran gelince eklenir.

### Ürünü gelmeyen motorlar

**A7 (4GA/GF)** — 1 motor: `3.0 TDI 160kw 218hp`

**Q3 (F3)** — 5 motor: `40 TDI 2.0 147kw 200hp` · `35 TFSI 1.5 110kw 150hp` ·
`1.5 TSI 110 kW` · `2.0 TDI 110 kW` · `2.0 TDI 85 kW`

**A5 + A5 Cabriolet + Sportback (F5)** — 3 motor: `45 TFSI MH 195kw` ·
`50 TDI MH 210kw` · `S5 TDI MH 251kw`


**A4 (8E/8H, B6+B7)** — 3 motor: `2.0 TDI 103kw 140hp` · `2.0 TFSI 162kw 220hp` ·
`2.0 FSI 110kw 150hp`

**A6 (4G2/4G5/4GC/4GD)** — 15 motor: `3.0 TDI 140/150/155/160/176/180/200kw` ·
`2.0 TDI 110kw` · `2.8 FSI 150/162kw` · `2.0 TFSI 132/155/162/183/185kw`

### Ekran görüntüsü diske kaydedilmeyen sayfalar

`3.2 FSI 188kw 256hp`, `2.0 96kw 130hp` (B6+B7) · `3.0 TDI V6 171kw 233hp`,
`2.8 FSI V6 154/162kw` (A6) · `2.0 TDI quattro 140kw`, `2.0 TFSI quattro 132kw`
(Q5) · `1.2 TFSI 77kw`, `1.8 TFSI 118kw` (A3). Ürün listeleri doğru girildi ama
görsel çıkarıcıya eklenemedi; hepsinin ürünleri başka motor sayfalarından
gerçek fotoğrafla geldiği için eksik kalan görsel YOK.

**Mesaj başına en fazla 16 ekran görüntüsü ulaşıyor.** Fazlası hiç
kaydedilmiyor; parti boyutunu 16'da tutmak gerekiyor.

(A6 2.0 TDI 100kw'ın fotoğrafsız 4 ürünü — C16118, WK6001, AR371/2, PP993 —
bu partide 120kw ve 103kw sayfalarından gerçek fotoğrafla geldi, kapandı.)

### Q2 (GA) — ekran görüntüleri diske ulaşmadı (16 sınırı)

28. partide 20 kalem iletildi; diske yalnızca ilk **16** ekran görüntüsü indi.
Kaybolan 4'ü Q2 (GA) sayfalarıydı. Ürün listeleri mesaj metninden doğru
girildi (30 TDI 16 ürün · 1.0 30 TFSI 8 ürün), fakat bu partinin YENİ ürünü
`MANN H6003z` (şanzuman filtresi, 604,15) fotoğrafsız kaldı — kaynağın Q2
sayfası tekrar, 16'lık partide gönderilirse kapanır.

### Kaynağında fotoğrafı olmayan ürünler (bu partiden)

`FP2641` · `FP26009` ("Alerji Önleyici Filtre" afişi) · `HU6013z` · `K1311` ·
`OE688/5` ("ÜRÜN GÖRSELİ HAZIRLANIYOR"). TT III (FV) 2.0 TFSI (TTS) 235kw
sayfasının **sekiz kartı da** hazırlanıyor görselli. Kategori çizimi kalıyor.

### Q7 (4M) 55 TFSI e / 55 TFSI MH / 60 TFSI e + Q8 (4M) — ekran gelmedi (16 sınırı)

29. partide de 20 kalem iletildi, diske yine ilk **16** ekran görüntüsü indi.
Kaybolan 4'ü Q7'nin üç TFSI e/MH sayfası ile Q8 (4M) 3.0 TDI sayfasıydı. Ürün
listeleri mesaj metninden doğru girildi; kaynakta bu dört sayfanın kartları
zaten "ÜRÜN GÖRSELİ HAZIRLANIYOR" olduğu için `HU7049z`, `OE688/4` ve
`PU10010z` kategori çizimiyle kaldı — ekran gelse de değişmezdi.

### Q8 (4M) — ürünü gelmeyen 5 motor

`45 TDI 3.0 quattro 170kw 231hp` · `50 TDI 3.0 quattro 210kw 286hp` ·
`45 TFSI 180kw 245hp` · `55 TFSI e 280kw 381hp` · `60 TFSI e 340kw 462hp`

### A8 (4N) 60 TDI MH — kodu görünmeyen iki yakıt filtresi

Sayfadaki iki yakıt filtresi kartında kod yok (MANN 1.354,16 · FİLTRON
1.242,93) ve fiyatları aynı modelin kodu açık 45 TDI sayfasıyla da tutmuyor
(orada PU7008zKIT 3.045,75 · PE993/5 1.881,37). `AUDI_MISSING_CODE`'a alındı.
Kodu açık bir ekran (ör. ürün DETAY sayfası) gerekiyor.

Aynı sayfadaki BEŞ polen kartı da kırpıktı ama fiyatları 45 TDI sayfasındaki
kodu açık kartlarla birebir tuttuğu için eşleştirildi (CU31003 · CUK31003 ·
FP31003 · K1378 · K1378A) — tahmin değil, fiyat kimliği.

### A8 (4N) — 30. partide ekranı gelmeyen 4 sayfa (16 sınırı)

45 TDI (devam) · 60 TDI MH · 60 TFSI e · 50 TDI. Ürün listeleri mesajdan doğru
girildi; kartları zaten "ÜRÜN GÖRSELİ HAZIRLANIYOR" olduğu için `HU9011z`
kategori çizimiyle kaldı.

### A1 (GB) — İKİZ MOTOR bulundu ve kapatıldı

`vehicles.ts` A1 (GB)'nin üç motorunu motor kodu/hacim/yıl bilgisiyle
tanımlıyordu ("30 TFSI 1.0 81 kW 110 HP"); `arac-motorlari.ts` aynı motorları
kaynağın yazımıyla ("30 TFSI 1.0 81kw 110hp") bir kez daha ekliyordu. Slug
farklı çıktığı için ikisi de kaydediliyor, katalogda aynı motor İKİ kez
görünüyordu (biri ürünlü, biri boş).

Düzeltme: A1 (GB) satırı `arac-motorlari.ts`'den kaldırıldı, ürün eşlemeleri
`vehicles.ts` yazımına çevrildi. `vehicle-tree-sync.ts`'e **ikiz motor
koruması** eklendi: yazım farkını yok sayan karşılaştırma ile ikiz bulunursa
sessizce ikinci satır açmak yerine HATA veriyor. Tüm ağaç tarandı, başka ikiz
yok.

### A8 (4D) · A8 (4N) — ekranı gelmeyen sayfalar (16 sınırı)

A8 (4D) 2.5 TDI'nin iki ekranı 16 sınırına takıldı; yedi yeni ürünü
(C28214/1 · CU2949-2 · CUK2949-2 · H2120xKIT · AP004/2 · K1069-2x ·
K1069A-2x) kaynakta gerçek fotoğrafı OLDUĞU HÂLDE kategori çizimiyle kaldı.
Tek başına 2 ekran gönderilirse kapanır.

### E-Tron GT · GT quattro — iki kodsuz kart

Sayfada yalnızca iki kart var; ikisi de kodsuz MANN "Polen Kabin Filtresi" ve
ikisinin de fiyatı 2.060,80 — birbirinden bile ayırt edilemiyor.
`AUDI_MISSING_CODE`'a alındı. **RS 440kw 599hp** sayfası hiç gelmedi.

### Q8 e-tron eşleştirmesi bağımsız doğrulandı

Q8 e-tron'un üç sayfasında da beş polen kartı kodsuzdu; usta onayıyla fiyat
eşleşmesi kullanıldı. Sonraki partide gelen **E-Tron (GE) E-TRON 230kw**
sayfası aynı beş fiyatı KODLARI AÇIK gösterdi: CU31003 · CUK31003 · FP31003 ·
K1378 · K1378A. Eşleştirme doğru.

### BMW motor ağacı — 56 model, 482 motor

237 dizel · 237 benzin · 8 elektrik. Kaynağın model dizin sayfalarından
girildi (ürün listeleri DEĞİL). **BMW ürünleri henüz YOK.**

Yakıt her motorda AÇIKÇA yazıldı; "320d" ile "320i" farkı tek harf olduğu için
ad çıkarımı BMW'de çalışmıyor. Temel yakıt önceliği korundu:

* `520d Mild-Hybrid` · `840d Mild-Hybrid` · `740d Mild-Hybrid` → **DİZEL**
* `530e` · `225xe` · `25ex` · `45e xDrive` · `745Le` · `230e` · `225e` →
  **BENZİN** (şarj edilebilir hibrit, altındaki motor benzinli)
* `320xd` · `320tdcompact(Turbodiesel)` → **DİZEL**
* `iX1 30` (×2) · `i4 (G26)` eDrive35/eDrive40/M50 · `iX3 (G08)` Electric
  (×2) · `i3 125kw` → **ELEKTRİK**
* `X5 (E53)` "3.0 163kw" ve "3.0 170kw" — harfsiz ad, benzinli (3.0i)

### ⚠ İKİZ MODEL KURALI YANLIŞTI — DÜZELTİLDİ

İlk kural "seri adı aynı + nesil kodlarından biri ortak → aynı araç" idi.
Bu kurala dayanarak DÖRT BMW modelini ikiz sanıp kaldırdım:
`X3 (G01)` · `3 (G20)` · `X4 (G02)` · `X5 (G05)`.

**Yanlıştı.** Kaynağın kendi sayfaları geldiğinde ortaya çıktı: bunlar ayrı
kategori sayfaları ve motor listeleri tamamen farklı —

| model | motorlar |
|---|---|
| `X3 (G01)` | 20i/iX · 20i1.6 · 30iX · 20dX ×2 · 25dX · 30dX (7) |
| `X3 (G01, F97)` | 18 d MH ×2 · 30 dX MH ×2 · M40 iX ×2 · 20 i MH · 30 i MH · 30eX · M (10) |

Dördü de geri kondu, motorlarıyla birlikte yüklendi.

Kural düzeltildi: **kod kümesi BİREBİR eşit olmalı** (kesişim yetmez).
`3 (G20)` ↔ `3 SERİSİ (G20)` hâlâ ikiz sayılır; `X3 (G01)` ↔ `X3 (G01, F97)`
sayılmaz. Ayrıca `similarVehicle()` eklendi: aynı seri + farklı kod kümesi
olan çiftler "AYNI SERİ, FARKLI KOD" başlığıyla ayrıca raporlanıyor —
birleştirilmiyor, yalnızca göze gösteriliyor.

Hâlâ geçerli olan tek gerçek birleştirme: `vehicles.ts`'den kaldırılan
`3 SERİSİ (G20)` ve `1 SERİSİ (F40)` (bu yazım kaynakta hiç geçmiyor).

### ⚠ 32 çift "aynı seri, farklı kod" — gözle bakılmalı

Her seed çıktısının sonunda listeleniyor. Dördü BMW'nin gerçek ayrı
sayfaları (yukarıda); kalan 28'i `vehicles.ts` eski adı ↔ `arac-agaci.ts`
kaynak adı desenindeymiş gibi görünüyor ama BMW dersinden sonra hiçbiri
kaynağın sayfası görülmeden birleştirilmeyecek.

`citroen` C3 III · Jumper III — `fiat` Doblo — `ford` Focus IV · Transit
Connect · Ranger — `jaguar` XF — `jeep` Renegade — `land-rover` Discovery
Sport · Range Rover Evoque · Defender · Range Rover IV — `mini` Mini III —
`nissan` Juke — `peugeot` Partner III — `porsche` Cayenne III — `renault`
Captur II — `skoda` Karoq — `toyota` Corolla — `volkswagen` Golf VIII ·
Tiguan II · Touran · Passat B8 · Touareg III · Golf VII · Crafter II ·
Caddy IV — `volvo` XC40

### BMW TAMAMLANDI — 56 model · 482 motor · 225 ürün · 4.359 uyumluluk

Tamamı kaynağın HTML'inden okundu, yalnızca **stoktaki** ürünler
(`?stoktakiler=1`). Ham çekim `veri/bmw-cekim-tam.json` ve
`veri/bmw-3-e90-cekim-*.json` dosyalarında.

`BMW_MISSING_CODE` **BOŞ** — tarayıcıdan okunduğu için tek bir üründe bile
parça kodu kırpılmadı.

**Kaynağın kategori adında BEŞ yazım var** (hepsi ayrıştırıcıda tanınıyor):
Yakıt: "Yakıt Filtresi" · "Yakıt Mazot Filtresi" · "Yakıt (Mazot) Filtresi"
Polen: "Polen Kabin Filtresi" · "Polen Filtresi"
Şanzuman: "Şanzuman Filtresi" · "Şanzıman Filtresi" (ı ile)

Üçü de ancak "çözülemeyen başlığı sessizce düşürme, hata listesine yaz"
kuralı sayesinde yakalandı. `Şanzıman` yazımı tek başına 17 motorda H50004'ü
düşürüyordu.

**Kart başlığı bazen eksik geliyor**, görselin `alt` metninde tam duruyor —
ayrıştırıcı önce başlığı, olmazsa alt metni deniyor.

**Üç kartta kaynağın kendi adı bozuk** (ürün sayfalarında da öyle):
`AP026/6` · `K1425A` · `K1428A-2x`. Kod okunuyor, kategori okunmuyor.
Üçünün de kategorisi AYNI ürünün adı tam görünen başka sayfasından alındı —
tahmin değil, aynı ürünün başka listelenişi.

### 3 GT (F34) motor adları düzeltildi

Ekran görüntüsünden `GranTurismo` diye girilmişti; kaynağın HTML'i
`GranTourismo` yazıyor. Tarayıcı çekiminde 11 motor eşleşmeyince yakalandı,
ağaç kaynağa göre düzeltildi. Motor adı ürün eşleştirmesinin anahtarı olduğu
için harfi harfine önemli — bu, tarayıcı yönteminin transkripsiyon hatası
yakaladığı ilk somut örnek.

### Tarayıcı yöntemi — kalıcı notlar

* **Adres uydurma.** Motor adları modeller arasında ortak; site sonlarına
  `-1`, `-2` ekliyor. `/kategori/30i-190kw-258hp` başka bir modeli,
  `.../30i-190kw-258hp-1` Z4 (G29)'u veriyor. Her zaman model sayfasındaki
  bağlantıdan gidilir.
* **Kaynak aynı ürünü bir sayfada iki kez listeleyebiliyor.** Marka + parça
  koduna göre tekilleştirilir; sitenin "Toplam N ürün" sayacı çiftlenmiş
  kartları saydığı için ürün sayısıyla tutmayabilir.
* **Paylaşılan görsel ürün fotoğrafı değildir** (ör. "Alerji Önleyici Filtre"
  afişi). Aynı dosya birden fazla üründe geçiyorsa alınmaz.
* **Tekilleştirme tarayıcıda yapılmaz.** İlk denemede zaman aşımına uğrayan
  bir çağrı "gördüm" listesini kalıcı kirletti; sonuçları kaybolduğu hâlde
  ürünler bilinen sayıldı ve bir model sessizce eksik girecekti. Tekilleştirme
  durumu kalıcı olan yerde — veritabanı tarafında — yapılır.
* **Bulut ortamı siteye çıkamıyor** (proxy 403). Görseller tarayıcıda tek zip
  yapılıp indiriliyor, cihaz köprüsüyle aktarılıyor. Chrome ikinci indirmeyi
  engelliyor; kullanıcının "çoklu indirmeye izin ver" demesi gerekiyor.
* **45 sn araç çağrısı sınırı.** Uzun çekimler zaman bütçeli sürücüyle
  parçalanır; sonuçlar sekmenin belleğinde birikir, aralarda dosyaya yazılır.

**Doğrulama:** dört motorun (7 (E38) 730d · X1 (U11) 23d MH · X1 (U11)
iX1 30 · Z4 (G29) 30i) kod listesi kaynaktan yeniden çekilip veritabanıyla
karşılaştırıldı, dördü de birebir tuttu. Rozet değişmezi korunuyor: elektrikli
iX1'de yakıt filtresi gri, dizel 730d'de yeşil.

**Kalan:** diğer araç markaları, ağır vasıta ve OEM numaraları.

### CHEVROLET · CITROEN · CUPRA TAMAMLANDI

Bu üç marka baştan sona tarayıcıdan çekildi: **motor ağaçları da dâhil**
(daha önce hiç girilmemişlerdi). Yalnızca **stoktaki** ürünler
(`?stoktakiler=1`). Ham çekim `veri/chevrolet-citroen-cupra-cekim.json`.

| Marka | Model | Motor | Uyumluluk |
|---|---|---|---|
| Citroen | 34 (31'i çekimden, 3'ü eski ağaçtan) | 242 | 2.233 |
| Chevrolet | 7 | 37 | 304 |
| Cupra | 1 | 7 | 75 |

`CHEVROLET_MISSING_CODE` · `CITROEN_MISSING_CODE` · `CUPRA_MISSING_CODE`
**üçü de BOŞ** — tarayıcıdan okunduğu için tek bir kod kırpılmadı.

**Yakıt tipi tahmin edilmedi.** 89 motorun adından yakıt anlaşılmıyordu
(ör. `1.6 80kw 109hp`). Kaynağın kendi kategori adındaki "Mazot" sözcüğü
ölçüt alındı: sayfasında "Yakıt Mazot Filtresi" geçen motor DİZEL sayıldı.
5 motor dizel çıktı (beşi de adında zaten `CDTi`/`TD`/`HDi` taşıyor),
53 motor benzin olarak doğrulandı, 31 motorda hiç yakıt filtresi yok
(5'i elektrik, 26'sı benzin adlandırmalı).

**Ürünü olmayan 3 Citroen modeli:** `BERLINGO III` · `Berlingo I (M49, M59)`
· `C3 III`. Üçü de eski `vehicles.ts` kayıtları; kaynağın Citroen listesinde
bu adlarla sayfa YOK (kaynakta `Berlingo III (K9)` ve `C3 III (B618)` var,
ikisi de dolu). Silinmediler, yalnızca boş duruyorlar.

**Kaynak çekiminde 3 bozuk kart** (`veri/...json` içindeki `hata` alanı):
`K1093` (DS4) · `AR316/1` (Jumper III (Relay III)) · `K1127` (Xsara).
Üçünde de kategori adı kırpıktı ama kod okunuyordu; kategorileri aynı ürünün
başka sayfadaki tam başlığından alındı ve üçü de doğru motorlara bağlandı
(veritabanından tek tek doğrulandı).

**Fiyat çakışması:** `MANN PU7005` Alfa Romeo'da 1.717,12, Citroen'de
1.686,37 listeleniyor. Kullanıcının "en yüksek" kuralıyla 1.717,12 kaldı.
`merge()` artık yalnızca FİYAT farkında birleştiriyor; marka/kategori farkı
hâlâ seed'i durduruyor.

**Doğrulama:** üç markadan birer motorun (Chevrolet Captiva 2.2 D 4WD ·
Citroen C3 Aircross (A88) 1.5 BlueHDi 110 · Cupra Formentor 1.5 TSI) kod
listesi kaynaktan yeniden çekilip veritabanıyla karşılaştırıldı — 9/9, 8/8,
10/10 birebir tuttu. Rozet değişmezi de tarandı: `PU7006` yalnızca kaynağın
listelediği tek motorda yeşil; benzinli Captiva'da, diğer iki Captiva
dizelinde ve Citroen/Cupra motorlarında gri. Yanlış yeşil yok.

### DACIA · DS · FIAT · FORD · GEELY · GENESIS · HAVAL TAMAMLANDI

Yedi markanın da motor ağacı yoktu; ağaç ve ürünler tek seferde kaynağın
HTML'inden okundu. Yalnızca **stoktaki** ürünler. Ham çekim
`veri/7marka-cekim.json`.

| Marka | Model | Motor | Uyumluluk |
|---|---|---|---|
| Ford | 44 | 341 | 2.945 |
| Fiat | 22 | 166 | 1.452 |
| Dacia | 13 | 90 | 684 |
| DS Automobiles | 8 | 63 | 547 |
| Genesis | 4 | 8 | 15 |
| Haval | 2 | 3 | 5 |
| Geely | 1 | 1 | 4 |

**Ford ikiye ayrılmış.** Kaynakta İKİ Ford markası var: `/kategori/ford`
= Cargo + Cargo F-Max (kamyon) ve `/kategori/ford-1` = 44 binek/hafif ticari
model. Kullanıcı kararıyla şimdilik yalnız binek tarafı alındı; Cargo ve
F-Max ağır vasıtayla birlikte en sona kaldı. Aynı desen `renault`
(`/kategori/renault` kamyon · `/kategori/renault-1` binek) ve `iveco`,
`cf75` için de var — o markalara sıra gelince aynı ayrım yapılacak.
`dacia-renault-group` sayfası Dacia binek modellerini veriyor, karışmıyor.

**DS3/DS4/DS5 hem Citroen'de hem DS'te var** ama AYRI sayfalar
(`/kategori/ds3` ↔ `/kategori/ds3-1`). BMW dersi gereği birleştirilmedi.

### ⚠ İKİ SESSİZ VERİ KAYBI YAKALANDI — koruma eklendi

**1. Sunucu kısıtlaması boş sayfa döndürüyor.** Eşzamanlı istek sayısını
24'e çıkarınca kaynak, gövdesi boş ama 200 dönen sayfalar verdi. Bunlar
"bu motorda stokta ürün yok" gibi görünüyor: **386 motor yanlışlıkla
ürünsüz kaydedilmişti.** Rastgele beşi tek tek yeniden çekilince beşinde de
11/6/7/7/7 ürün çıktı — hepsi sahteydi.

Koruma: her sayfanın kendi "Toplam N ürün" işareti okunuyor ve kart sayısı
N ile karşılaştırılıyor. Tutmayan sayfa KAYDEDİLMİYOR, hata listesine
yazılıp yeniden çekiliyor. 77 sayfa bu şekilde yeniden çekildi. Son durumda
**672 motorun hiçbiri ürünsüz değil** — yani gerçek "boş motor" hiç yokmuş.

**2. Aynı tuzak model sayfalarında da vardı.** Ford **Puma II** 7 motorlu
olduğu hâlde motorsuz kaydedilmişti. Yakalanma biçimi: üretilen dosyada
Ford 43 model çıktı, kaynakta 44 vardı — sayı tutmayınca bakıldı. Ardından
94 model sayfasının TAMAMI düşük eşzamanlılıkla yeniden çekilip motor
listeleri birebir karşılaştırıldı; tek fark Puma II'ydi (0 → 7).

**Ders:** "sonuç boş geldi" ile "sonuç gelmedi" ayrı şeylerdir. Boş sonuç,
kaynağın kendi sayacıyla doğrulanmadan kaydedilmemeli.

### Yakıt tipi — kaynağın "Mazot" yazımı TEK BAŞINA yetmiyor

Chevrolet/Citroen/Cupra partisinde ölçüt olarak yalnız kategori adındaki
"Mazot" sözcüğü kullanılmıştı. Bu partide o ölçütün İKİ YÖNDE de hata
verdiği kanıtlandı:

* **Yanlış dizel:** Duster I 1.2 TCe sayfasında WK6002 ve PP831/1 "Yakıt
  (Mazot) Filtresi" yazıyor. Aynı iki ürünün diğer 15 ve 22 listelenişinde
  düz "Yakıt Filtresi" yazıyor ve taşıdıkları motorların HEPSİ benzinli.
  Tek sayfalık yazım hatası. Aynı desende 6 ürün var (12:1, 33:1, 22:1,
  12:1, 32:1, 15:1) — hepsinde azınlık tek listeleme.
* **Kaçan dizel:** Ford EcoBlue, Fiat 2.2 Multijet ve PSA BlueHDi
  dizellerinin yakıt filtrelerinde kaynak "Mazot" YAZMIYOR. 52 motorda ad
  dizel diyor, kategori yazımı sessiz kalıyor.

Yeni sıra: **(1) motor adındaki üretici yakıt eki → (2) ürün bazında
çoğunluk "Mazot" oyu → (3) yalnız polen filtresi varsa elektrik → (4) aynı
modelde dizeller açıkça işaretliyse işaretsiz motor benzin.** Dağılım:
366 ad-dizel · 223 ad-benzin · 17 ad-elektrik · 20 kaynak-yakıt ·
3 yalnız-polen (Dacia Spring, Genesis GV60 ×2) · 39 model testi ·
1 marka testi (Ford Fiesta VII / Mk VIII 1.1).

**Usta kararı:** Genesis GV70 2.2 (148kw · 154kw) ve G80 II 2.2 (154kw)
kaynakta düz "2.2" yazıyor; aynı markanın G70 sayfasında "2.2 CRDi" açık.
Kullanıcı kararıyla üçü de DİZEL.

**CCC partisi gözden geçirilmeli:** o partide "53 motor benzin doğrulandı"
denmişti; ölçüt buysa aralarında yanlış benzin olabilir. Aynı dört adımlı
sıra CCC verisine de uygulanmalı.

### Kaynağın KENDİ kaydı bozuk 6 kart

Kart başlığı da, ürün detay sayfasının başlığı da kırpık.

Üçünde kod okunuyor ve **aynı ürün başka sayfalarda tam adıyla listelenmiş**
— kategoriler oradan geldi, tahmin yok: `AP186/2` (15 motorda) ·
`K1377` (13) · `AP074/8` (14).

Üçünde kod HİÇ okunmuyor (`"2 FİLTRON"` · `"2/3 FİLTRON"` · `"51 FİLTRON"`).
Ürün fotoğrafları da başka ürünlerle paylaşılmış, oradan da
kimliklendirilemiyor. `FIAT_MISSING_CODE` ve `FORD_MISSING_CODE`'a alındı.

### İKİZ MOTOR — 5 motor vehicles.ts'de kodlu duruyordu

`vehicles.ts` bu beş motoru MOTOR KODUYLA tanımlıyor (ZTDA, M0DA…), kaynak
ise kodsuz ve başka yazımla: Ford Fiesta VII 1.0 EcoBoost · Ford Kuga III
1.5 EcoBlue · Dacia Duster II 1.3 TCe ve 1.5 Blue dCi · Dacia Sandero III
1.0 TCe. A1 (GB) kararıyla aynı yönde: `vehicles.ts` yazımı korundu (motor
kodu kaybolmasın), `arac-motorlari.ts`'de tekrarlanmadı, ürün eşlemeleri
`vehicles.ts` yazımına çevrildi.

İkisini ikiz koruması yakaladı; diğer üçü koruma eşiğinin ALTINDA kalıyordu
(`1.3 TCe 96 kW 130 HP` ↔ `1.3 TCe 130 96kw 131hp` — 130/131 HP farkı).
Bunlar elle bulundu.

### 6 model adı kaynağın yazımına çevrildi

`arac-agaci.ts` bu altı modeli daha önce farklı yazmıştı; canlı kaynakla
karşılaştırılıp düzeltildi (BMW `GranTourismo` dersiyle aynı):

`DS7 / DS7 Crossback` → `DS7 / DS7 CROSSBACK` · `DS7 Crossback` →
`DS7 CROSSBACK` · `B-Max` → `B-MAX` · `EcoSport` → `Ecosport` ·
`Mondeo III (B4Y/B5Y/BWY)` → `Mondeo III (B4Y/5Y/BWY)` ·
`Fiesta VIII` → `Fiesta VIIII` (kaynağın adresi de `/kategori/fiesta-viiii`).

Son ikisi slug'ı değiştirdiği için eski boş model satırları silindi.

### Yer tutucu çizim adımı SESSİZCE atlanıyormuş — düzeltildi

`urun-gorsel-yertutucu.ts` tüm iş listesini tek argv olarak `python3`'e
geçiriyordu. Katalog 1000 ürünü aşınca argüman 150 KB'ı geçti,
`execFileSync` `pid: 0` ile düştü ve betik bunu "Pillow yok" sanıp adımı
atladı. Sonuç: fotoğrafı olmayan ürünler görselsiz kalıyordu. İş listesi
artık 200'lük parçalara bölünüyor. Şimdi: **809 gerçek fotoğraf ·
276 kategori çizimi = 1.085 ürünün tamamı görselli.**

Not: kaynağın ürün fotoğrafları en fazla 240 piksel (`_min.jpg` ve tam boy
`.jpg` 200×263). Kareye oturtulup 600×600 tuvale yerleştiriliyor.

**Doğrulama:** sekiz motorun kod listesi kaynaktan yeniden çekilip
veritabanıyla karşılaştırıldı — 12/12, 9/9, 8/8, 10/10, 11/11, 4/4, 1/1,
2/2 birebir tuttu (ikiz eşlemesi yapılan Kuga III dâhil). Rozet değişmezi:
`WK11026` (Puma II mazot filtresi) yalnız dizel motorda yeşil, altı benzinli
Puma II motorunda gri. Genesis GV60 elektrikli sayfasında yalnız polen
filtresi listeleniyor.

### HONDA · HYUNDAI · ISUZU · IVECO · JAGUAR · JEEP · KIA · LAND ROVER · MAZDA

Dokuz markanın da motor ağacı yoktu. Ham çekim `veri/9marka-cekim.json`.

| Marka | Model | Motor | Uyumluluk |
|---|---|---|---|
| Hyundai | 39 | 196 | 1.201 |
| Kia | 28 | 135 | 884 |
| Land Rover | 21 | 110 | 756 |
| Jeep | 12 | 61 | 376 |
| Iveco (Daily) | 4 | 92 | 371 |
| Honda | 22 | 71 | 343 |
| Mazda | 7 | 56 | 319 |
| Jaguar | 10 | 46 | 293 |
| Isuzu | 1 | 5 | 22 |

**Iveco ikiye ayrılmış** (Ford deseni): `/kategori/iveco` kamyonları
(EuroCargo II/III/IV · Stralis · Stralis II · EuroMover) ve Daily III/IV'ü,
`/kategori/iveco-1` Daily ile Daily VI'yı veriyor. Kullanıcı kararıyla
**yalnız Daily'ler** alındı — Ducato/Transit ile aynı hafif ticari sınıf.
Altı kamyon modeli ağır vasıtayla birlikte sona kaldı.

### İKİ YENİ KATEGORİ AÇILDI (kullanıcı onayıyla)

Iveco Daily sayfalarında kataloğumuzda karşılığı olmayan iki filtre türü var:

| Kategori | Ürün | Fiyat | Kapsam |
|---|---|---|---|
| `DIREKSIYON_FILTRESI` (sıra 18) | MANN H601/4 | 163,83 | 64 motor |
| `KARTER_HAVALANDIRMA` (sıra 19) | MANN LC9005 | 2.330,03 | 9 motor |

`catalog.ts`, `CategoryCode`, `urun-import-uret.ts` (ad + açıklama metinleri)
ve `urun-gorsel-yertutucu.ts` (iki yeni kategori çizimi) güncellendi.
Katalog artık **15 kategori**.

### ÜÇÜNCÜ SESSİZ VERİ KAYBI: SAYFALANMIŞ MOTOR SAYFALARI

Önceki partilerde hiç görülmemişti; bu partide Iveco Daily'nin dört motoru
tek sayfaya sığmıyor. İlk denemede sayfa bağlantılarını yanlış izledim:
href'te zaten `?` olduğu hâlde `&stoktakiler=1` yerine `?` ekledim ve AKTİF
sayfanın bağlantısını da izledim — sonuç 41 yerine 49 kart, yani stok
filtresi düşmüş kayıtlar karışmıştı. Kaynağın "Toplam N ürün" sayacı
tutmadığı için KAYDEDİLMEDİ.

Doğrusu: metni sayı olan ve `paginate-element-active` OLMAYAN bağlantılar
izlenir, `stoktakiler` parametresi `URL.searchParams.set` ile yazılır.
Düzeltmeden sonra 41/41, 27/27, 27/27, 27/27 tam tuttu.

### Kategori yazımı çelişen ürün — ÇOĞUNLUK, berabere kalırsa KOD AİLESİ

`FILTRON AP113` üç Mazda sayfasında "Polen Kabin filtresi", üç sayfada
"Hava Filtresi" yazıyor — 3'e 3 berabere. FILTRON'un kendi kod ailesi
karar verdi: bu partide AP öneki 473 kartta HAVA, 3 kartta POLEN; yani
üç Mazda kartı yazım hatası. **AP113 = Hava Filtresi.**

Kod ailesi tablosu bu partide de sıfır istisnayla doğrulandı (AP113 hariç):
FILTRON AE/AK/AM/AP/AR→Hava · K→Polen · OE/OP/OR→Yağ · PE/PP/PS→Yakıt;
MANN C→Hava · CU/CUK/FP→Polen · H→Şanzuman · HU/W/WP/ZR→Yağ · PU/WK→Yakıt.
**Kural yalnızca BERABERLİKTE devreye girer** — açık ve tek sesli bir
yazımı ezmez. (Aksi hâlde MANN H601/4 "Direksiyon Filtresi" yazdığı hâlde
H→Şanzuman ailesine düşerdi; bu hata denemede yakalandı ve kural
düzeltildi.)

### Kaynağın kendi kaydı bozuk 7 kart — hepsi çözüldü

Dördü aynı ürünün başka sayfadaki TAM adından, üçü kod ailesinden:
`K1257-2x` · `K1245` · `K1210A` · `PP969/3` · `K1314A` · `W920/21`
(kart adı sadece "w920/21") · ve i20'nin iki kopya kartı.

⚠ Görsel eşleştirme anahtarı DÜZELTİLDİ: kaynak aynı görseli farklı klasör
önekiyle servis edebiliyor (`680/…` ve `676/…`). Tam yol anahtar alındığında
`K1257-2x` eşleşmiyordu; artık yalnız dosya adı kullanılıyor.

### Kaynak içi ikiz motor — Hyundai i30

Kaynak i30'da iki motoru İKİ KEZ listelemiş, fark yalnızca büyük/küçük
harfte: `1.6 CRDi 100kw 136hp` ↔ `1.6 CRDI 100kw 136hp` ve
`1.6 CRDI 81kw 110hp` ↔ `1.6 CRDi 81kw 110hp`. Ürün listeleri FARKLI
(5 ve 8 · 8 ve 4). Aynı motorun iki listelenişi sayılıp birleştirildi
(ürünlerin birleşimi: 9 ve 8), ilk yazım korundu. Doğrulamada kaynağın iki
sayfasının birleşimi ile veritabanı birebir tuttu.

### Yakıt adlandırma sözlüğü genişletildi — 122 motoru kurtardı

Önceki sözlük bu markaların yazımını tanımıyordu ve Honda i-DTEC ile JLR
D165/D200/D250/D300 gibi AÇIKÇA dizel motorları "marka testi → benzin"e
düşürüyordu. Eklenenler:

* dizel → `i-DTEC` `i-CTDi` `SkyActiv-D` `MZR-CD` `DiTD` `CD` `TDV6/TDV8`
  `SDV6/SDV8` `SD4` `TD4/TD5/TD6` `Ddi` `D###` (JLR)
* benzin → `VTEC` `i-VTEC` `i-DSi` `e:HEV` `Type-R` `CVVT` `CVVL` `Kappa`
  `Gamma` `SkyActiv-G` `MZR` `P###` (JLR) `Si4` `SCV8`

Ayrıca "yalnız polen filtresi → elektrik" kuralına koruma eklendi: motor adı
hacimle başlıyorsa elektrik denmez (Hyundai Elantra VII "1.6 90kw 123hp"
yanlışlıkla elektrikli işaretlenmişti; stokta yağ/hava filtresi olmaması
aynı görüntüyü veriyor).

**Usta kararı:** Iveco Daily'nin 56 motoru kaynakta yük/güç koduyla yazılı
("50 C 18", "35-14 Turbo HPT"), yakıt eki yok ve yakıt filtresi de yok.
Kaynak yalnızca CNG'lileri işaretlemiş (6 motor). Kullanıcı kararıyla
işaretsiz 56 motor DİZEL.

### 7 model adı kaynağın yazımına çevrildi, 2'si çevrilmedi

Çevrilenler: `Santa Fe I/II/IV` → `Santa Fé I/II/IV` ·
`Sonata IV (EU4/EF-B)` → `Sonata IV (EU4 / EF-B)` · `D-Max` → `D-MAX` ·
`I-Pace (X590)` → `I-PACE (X590)`. Ayrıca kaynakta AYRI sayfa olan
`Santa Fé` (aksanlı) modeli eklendi — `Santa Fe` ile birlikte ikisi de var.
`Daily III` ve `Daily IV` ağaca eklendi.

Çevrilmeyen ikisi kaynağın YAZIM HATASI; ekranda düzeltilmiş hâli duruyor,
eşleme `uret9.py`'deki `MODEL_ESLE`'de: kaynak `Ionic 6` yazıyor (doğrusu
`Ioniq 6`), kaynak `Carnival IV / Sedona ((KA4)` yazıyor (çift parantez).

**Doğrulama:** dokuz motorun kod listesi kaynaktan yeniden çekilip
karşılaştırıldı — Civic IX 4/4 · D-MAX 8/8 · Daily 20/20 (41 kart, kaynak
çiftlemesi ayıklandı) · F-Pace 8/8 · Renegade 9/9 · Sportage 8/8 ·
Discovery Sport 10/10 · Mazda 6 7/7 · i30 9/9 (iki ikiz sayfanın birleşimi).
Rozet değişmezi: `PE992` yalnız Isuzu D-MAX 1.9 Ddi'de yeşil, diğer dört
D-MAX dizelinde ve Mazda 6 dizelinde gri.

### 19 MARKA — MERCEDES'TEN VOLVO'YA

Hepsinin motor ağacı yoktu. Ham çekim `veri/19marka-cekim.json`.
**482 model · 3.554 motor · 32.112 uyumluluk satırı** — tek partide en büyüğü.

| Marka | Model | Motor | Uyumluluk |
|---|---|---|---|
| Volkswagen | 65 | 564 | 6.379 |
| Mercedes-Benz | 77 | 546 | 5.261 |
| Renault | 55 | 413 | 3.521 |
| Opel | 38 | 291 | 2.615 |
| Volvo | 30 | 324 | 2.605 |
| Seat | 19 | 223 | 2.577 |
| Peugeot | 33 | 286 | 2.556 |
| Skoda | 19 | 207 | 2.353 |
| Toyota | 42 | 167 | 1.162 |
| Nissan | 28 | 104 | 794 |
| Porsche | 16 | 172 | 742 |
| Mini | 6 | 47 | 493 |
| Toplam kalan | 5 marka | 156 | 1.054 |

**Renault ikiye ayrılmış** (Ford/Iveco deseni): `/kategori/renault` kamyon
(Midlum · Premium · Kerax · Magnum · T/C/K/D serileri), `/kategori/renault-1`
binek. Binek taraf alındı, kamyonlar ağır vasıtayla birlikte sona kaldı.
Mercedes'in kaynak sayfasında kamyon/otobüs YOK (Actros, Atego, Tourismo
ayrı bir markada) — 77 modelin tamamı binek + hafif ticari.

### ⚠ YAKIT SÖZLÜĞÜNDE ÜÇ CİDDİ EKSİK — 96 motoru kurtardı

Bu parti, sözlüğün önceki hâlindeki üç boşluğu ortaya çıkardı:

1. **"Diesel" kelimesinin KENDİSİ sözlükte yoktu.** Kaynak 57 motorun adına
   düpedüz "Diesel" yazıyor (Opel Insignia B "1.6 Diesel", Porsche Panamera
   "3.0 Diesel", Subaru "2.0 Diesel"). 18'i benzin işaretlenmişti.
2. **Mercedes'in "NNN d" rozeti** ("C220 d", "GLC 300 d", "CLA 180d") —
   **59 motor** benzin işaretlenmişti. Bu motorların yakıt filtresini kaynak
   düz "Yakıt Filtresi" diye yazdığı için 1. adım da yakalamıyordu.
3. **Volvo'nun D1–D5 rozeti** ("2.0 D4 AWD") — **19 motor**. T1–T8 zaten
   benzindi (94 motorda doğrulandı). SsangYong `Xdi` de eklendi.

Düzeltmeden sonra çift yönlü tarama **TEMİZ**: 3.554 motorun hiçbirinde
"benzin dendi ama adında dizel rozeti var" ya da tersi bir çelişki yok.

### ⚠ "YALNIZ POLEN → ELEKTRİK" kuralı sıkılaştırıldı

Kaynak, **C 43 AMG (W206)** ve **SL 43 AMG (R232)** için stok filtresi
OLMADAN da yalnızca polen filtresi listeliyor — ikisi de benzinli. Kural
artık ya adda elektrik rozeti (EQA/EQB/EQC/EQV · eVito/eSprinter · Corsa-e ·
Z.E · ZOE · Recharge · Plaid · F-CELL · EV40/EV60) ya da MODELİN BÜTÜN
motorlarının yalnız-polen olmasını istiyor. İki AMG benzine döndü,
110 gerçek elektrikli doğru kaldı.

### İÇE AKTARICIDA GERÇEK HATA: model adı normalizasyonu çakışıyordu

`normalizeName` harf/rakam dışındaki her şeyi atıyor; Peugeot'nun **"206"**
ve **"206+"** modelleri aynı anahtara ("206") düşüyordu. Tek eşleşme arandığı
için yanlış model seçiliyor, o modelde bulunmayan motor
"Motor bulunamadı" hatası veriyordu — model de motor da ağaçta olduğu hâlde.
25 uyumluluk satırı bu yüzden reddedilmişti (Peugeot 206+ ×16,
Mitsubishi L 200 ×9).

Düzeltme (`packages/db/src/import/validate.ts`): aynı anahtara düşen TÜM
modeller aday sayılıyor; aralarında istenen motoru gerçekten içeren varsa o
seçiliyor. Bu, bundan sonraki bütün içe aktarmaları da korur.

### Kaynağın kart biçimlerine üç yeni desen eklendi

* `"Hava Filtresi for compressor intake WK32/7 MANN"` — kategori ile kod
  arasına açıklama girebiliyor. Kategori yine KAYNAĞIN yazdığıdır; kod son
  parçadan okunur. (Kod ailesi kuralı burada devreye girseydi WK→Yakıt
  diyecekti; kaynağın açık yazımı ezilmez.)
* `"PU9012z (PU9012/1z) MANN"` — parantez içinde muadil kod; ilk kod alınır.
* `"… 66kw 90hp WK8028z Yakıt Mazot Filtresi MANN"` — kod kategoriden ÖNCE.

Ayrıca kırpık koda son çare olarak **model içi fiyat + kod sonu** eşleşmesi
eklendi: Renault Talisman'da `"1355 FİLTRON" 208,26` kartı, aynı modelin altı
motorunda kodu açık yazan `K1355` (aynı fiyat) ile eşleşti.

### Kaynak içi ikiz motor — 6 çift

Mercedes A W177 `A 180 d`/`A180 d` · Peugeot Partner `2.0 HDI`/`2.0 HDi` ·
Porsche 911 (996) `3.6 Carrera` (birebir aynı ad, iki kez) · Skoda Octavia IV
`2.0 TDI`/`2.0 TDi` · VW Tiguan I `1.4 TSI` (iki kez) · Volvo S60 III
`Mild Hybrid`/`Mild-Hybrid`. Ürünlerin birleşimi alındı, ilk yazım korundu.

**Usta kararı:** Volga (GAZ) Gazelle Next 2.0 — markanın tek motoru, kaynakta
yakıt işareti ve yakıt filtresi yok, kardeş motor yok. Kullanıcı kararıyla
BENZİN.

**4 model adı** kaynağın yazımına çevrildi (yalnız boşluk/büyük harf farkı):
`Mini Cooper II,Cabr,…` · `Colt VI/Colt CZ3/…` · `HIACE VI` · `Bora (1J2,1J6)`.

**Doğrulama:** on iki motorun kod listesi kaynaktan yeniden çekilip
karşılaştırıldı — Vito III 9/9 · Corsa-C 11/11 · 208 9/9 · Captur II 7/7 ·
Leon III 12/12 · Octavia III 8/8 · RAV4 IV 9/9 · Caddy V 10/10 · XC60 10/10 ·
Cayenne II 9/9 · X-Trail III 7/7 · Impreza II 6/6. Rozet değişmezi:
`PU8007` Cayenne II'nin ALTI dizelinde yeşil, üç benzinlisinde gri.

### AĞIR VASITA TAMAMLANDI — 13 marka · 99 model · 1.526 motor

Kamyon ve otobüsler. Ham çekim `veri/agir-vasita-cekim.json`.

| Marka | Model | Motor | Uyumluluk |
|---|---|---|---|
| Mercedes-Benz Kamyon & Otobüs | 10 | 551 | 2.426 |
| MAN | 4 | 347 | 2.316 |
| Iveco Trucks | 6 | 179 | 700 |
| Renault Trucks | 11 | 122 | 658 |
| Scania | 8 | 96 | 492 |
| Setra | 18 | 73 | 402 |
| Volvo Trucks | 11 | 67 | 335 |
| Ford Trucks | 2 | 21 | 146 |
| DAF | 4 | 20 | 134 |
| Neoplan | 8 | 14 | 77 |
| Temsa | 9 | 12 | 60 |
| Otokar | 4 | 14 | 52 |
| BMC | 4 | 9 | 25 |

Yalnız 83 ayrı ürün, 7.823 uyumluluk satırı: ağır vasıtada aynı filtre çok
sayıda modelde kullanılıyor. `MISSING_CODE` on üçünde de BOŞ.

### Kamyon kolları AYRI MARKA (kullanıcı kararı)

Kaynak da böyle ayırıyor: "MERCEDES BENZ" ile "MERCEDES", "VOLVO CARS" ile
"VOLVO", "FORD" ile "FORD", "RENAULT" ile "RENAULT", "IVECO" ile "IVECO"
ayrı sayfalar.

Bizde model listesi ARAÇ TÜRÜNE GÖRE SÜZÜLMÜYOR (`getVehicleModels(brandId)`
markanın tüm modellerini döndürüyor). Kamyonları `mercedes-benz` altına
koysaydık binek Mercedes seçicisinde Actros da görünecekti. `ford-trucks`
zaten ayrı markaydı; kalanlar ona uyduruldu:

`mercedes-benz-kamyon-otobus` · `volvo-trucks` · `renault-trucks` ·
`iveco-trucks` · `ford-trucks`

Ayrıca `mercedes-benz`, `volvo`, `renault`, `ford`, `iveco` markalarının
ESKİ `agir-vasita` / `otobus` tür bağları kaldırıldı — bu markalar artık
yalnız "Otomobil & Hafif Ticari" altında. (Senkron betiği tür bağı silmiyor,
temizlik elle yapıldı.) Iveco'nun Daily'leri binek tarafında kalır;
`iveco-trucks` yalnız EuroCargo/Stralis/EuroMover taşır.

### ÜÇ YENİ KATEGORİ, BİRİ ZATEN VARDI

| Kategori | Ürün | Kart |
|---|---|---|
| `KURUTUCU_FILTRE` (zaten tanımlıydı, ilk kez doldu) | 6 | 1.853 |
| `AD_BLUE_FILTRESI` (yeni, sıra 21) | 3 | 649 |
| `IC_HAVA_FILTRESI` (yeni, sıra 20) | 3 | 332 |

`İç Hava Filtresi`, ana hava filtresinin içindeki güvenlik filtresidir;
kaynak ayrı parça numarasıyla satıyor, bu yüzden ayrı kategori. Katalog
**17 kategori**. Yağlar bloğu 30+'a kaydırıldı ki filtrelere yer açılsın.

### ⚠ YAKIT KURALI AĞIR VASITADA FARKLI

Binek partilerinde kullanılan **"mazotsuz yakıt filtresi taşıyor → benzin"**
adımı bu veri setinde GEÇERSİZDİR: kaynak ağır vasıta sayfalarında
"Yakıt (Mazot) Filtresi" yazımını **hiç** kullanmıyor (salt-mazot ürün
sayısı 0). O adım uygulandığında **831 kamyon motoru BENZİN işaretlendi** —
tabloyu görünce yakalandı.

Kaynak bunun yerine yalnız dizel OLMAYANI işaretliyor: 1.528 motorun 4'ünde
"CNG" yazıyor (Stralis 270/300/330 CNG · Volvo FE III 320 CNG), kalan
1.524'ünde hiçbir yakıt eki yok. Iveco Daily kararıyla aynı yönde:
işaretsizler DİZEL.

**Ders:** yakıt sırası veri setine göre değişir. Kaynağın o bölümde hangi
işareti KULLANDIĞINI önce ölçmek gerekiyor; kullanmadığı bir işaretin
yokluğundan anlam çıkarmak yanlış.

### Kategori yazımı ağır vasıtada küçük harfli

"Hava filtresi", "Yağ filtresi" (küçük f). Bu yazım sözlükte yoktu; 1.094
kart kod ailesi yedeğine düşmüştü. Sözlüğe eklendi, artık kaynağın kendi
yazımından okunuyor. Toplam yazım sayısı: 10.

### Ürün fotoğrafları WebP'ye çevrildi (kullanıcı kararı)

`apps/web/public/urun` **209 MB → 15 MB** (klasör toplamı 26 MB). 2.085
gerçek fotoğraf WebP q82; 592 kategori çizimi PNG kaldı çünkü "bunu ben
çizdim" işareti PNG metadata'sında duruyor.

İki betik düzeltildi:
* `urun-gorsel-yertutucu.ts` yalnız `.png` arıyordu; WebP fotoğrafın üstüne
  çizim basardı. Artık her uzantıya bakıyor ve PNG olmayan dosyayı asla
  "çizim" saymıyor.
* `urun-gorsel-bagla.ts` diskte karşılığı kalmayan `/urun/…` satırlarını
  silmiyordu; çevirimden sonra her ürün İKİ görselle görünüyordu (png+webp).
  Artık artık satırları temizliyor.

**Doğrulama:** beş kamyon motorunun kod listesi kaynaktan yeniden çekilip
karşılaştırıldı — Scania R 480 8/8 · Mercedes Actros 2046 6/6 · BMC PRO 1144
3/3 · MAN TGS 18.320 8/8 · DAF CF85.460 11/11. Rozet değişmezi: `TB1394/1x`
(kurutucu) MAN TGS ve BMC PRO'da yeşil; TB1394/3x kullanan Scania R 480'de
ve tüm binek Audi 2.0 TDI'larda gri.

**Not:** Mercedes Actros 2046 sayfasında kaynak binek kabin filtrelerini
(CU23024 · CUK23024 · FP23024) listeliyor. Kaynaktan yeniden çekildi, aynı
çıktı — bizim hatamız değil, kaynağın kendi verisi.

### Sıradaki

Kalan araç markalarının motor ağaçları + ürünleri (aynı tarayıcı yöntemiyle:
marka sayfası → model → motor → `?stoktakiler=1`). Ağır vasıta en sona,
OEM numaraları katalog bittikten sonra.

Katalog durumu: **2.677 ürün · 60.599 uyumluluk · 0 çelişki · 17 kategori.**
