# Vercel'e yayın — adım adım

Bu dosya, projeyi ilk kez canlıya çıkarmak için izlenecek sırayı anlatır.
Yayından sonraki güncellemeler için en alttaki "Sonraki yayınlar" bölümüne
bakın.

---

## 0. Önce bilinmesi gerekenler

**Site her isteği veritabanından karşılıyor.** Build çıktısında 15 sayfanın
yalnızca 3'ü statik (ikonlar ve 404); ürün, araç ve kategori sayfalarının
tamamı `ƒ` (istek anında sunucuda üretiliyor). Bunun iki sonucu var:

1. Build sırasında `DATABASE_URL` gerekmez — veritabanı hazır olmadan da
   deploy alınır, ama site açılmaz.
2. Canlıda veritabanı bağlantısı sitenin can damarıdır; **havuzlanmış
   (pooled) bir bağlantı adresi** kullanılmalıdır (aşağıda).

**Görseller depoda.** `apps/web/public/urun` içinde 2.677 görsel var,
toplam 26 MB. Ayrı bir depolama servisi gerekmiyor; Vercel bunları statik
dosya olarak sunar.

---

## 1. Depoyu GitHub'a yükleyin

Proje şu an yalnızca yerelde ve `master` dalında; uzak depo tanımlı değil.

```bash
# GitHub'da boş bir depo açın (README/gitignore EKLEMEDEN), sonra:
git remote add origin https://github.com/<kullanıcı>/otocenter-market.git
git branch -M main
git push -u origin main
```

`.env` dosyası `.gitignore`'da — parolalar depoya gitmez. Bu doğrudur,
böyle kalmalı.

---

## 2. Veritabanını kurun

PostgreSQL 16 gerekiyor. Vercel ile en az sürtünmeli üç seçenek:

| Servis              | Not                                                              |
| ------------------- | ---------------------------------------------------------------- |
| **Neon**            | Vercel'in kendi entegrasyonu var; ücretsiz katman yeterli başlar |
| **Supabase**        | Yönetim paneli daha zengin; connection pooler'ı ayrıca açılır    |
| **Vercel Postgres** | Altında zaten Neon çalışıyor                                     |

Hangisini seçerseniz seçin **iki ayrı bağlantı adresi** alacaksınız:

- **Pooled (havuzlanmış)** — `...-pooler...` içerir. **Siteye bu verilecek.**
- **Direct (doğrudan)** — migrasyon ve seed için kullanılır.

Sunucusuz (serverless) bir uygulama her istekte yeni bağlantı açar; doğrudan
adres verilirse veritabanı kısa sürede bağlantı limitine dayanır. Bu yüzden
ayrım önemli.

---

## 3. Şemayı ve veriyi uzak veritabanına yükleyin

Bu adım **kendi bilgisayarınızdan** çalıştırılır, Vercel'den değil.

```bash
# Depo kökünde .env dosyasını DOĞRUDAN adresle geçici olarak güncelleyin:
#   DATABASE_URL="postgresql://...@...neon.tech/otocenter?sslmode=require"

npm ci
npm run db:migrate     # şemayı kurar
npm run db:seed        # araç ağacı + 2.677 ürün + 60.599 uyumluluk
npm run db:reindex     # arama ve uyumluluk indekslerini kurar
```

`db:seed` yerelde ~2,5 dakika sürüyor. Uzak veritabanında araç ağacı adımı
birkaç saniye, ürün yükleme birkaç dakika sürer. Kesilirse baştan çalıştırmak
güvenlidir: seed önce mevcut veriyi temizler, araç ağacı ise tek işlemde
yazıldığı için yarıda kalırsa hiçbir şey yazmaz.

> **Not (2026-08).** Araç ağacı senkronizasyonu eskiden satır satır sorgu
> atıyordu — bir çalıştırma 29.951 SQL sorgusu demekti. Yerelde 8 saniye
> süren bu iş, Neon gibi uzak bir veritabanında (~45 ms gidiş-dönüş)
> 20 dakikayı aşıyor ve ekrana hiçbir çıktı vermiyordu. Artık toplu okuma /
> toplu yazma kullanılıyor: **125 sorgu**, uzakta birkaç saniye. Her aşama
> geçen süreyle birlikte ekrana yazılıyor.

### Takılırsa: `npm run db:doctor`

Bir veritabanı komutu beklemeye girerse **beklemeyin**, teşhisi çalıştırın:

```bash
npm run db:doctor
```

En geç 90 saniyede biter ve bağlantıyı katman katman ölçer:
DNS → TCP → SSLRequest → TLS → kimlik doğrulama → `SELECT 1` → gerçek
tablolar → işlem turu. Takılan katmanı adıyla söyler; ayrıca **açık
oturumları ve kilitleri** listeler.

En sık sebep budur: `Ctrl+C` ile yarıda kesilen bir çalıştırma sunucuda açık
bir işlem bırakır, o işlem araç ağacı satırlarının kilidini tutar ve sonraki
her çalıştırma hiçbir çıktı vermeden sonsuza kadar bekler. Teşhis bunu
`⚠ KİLİTLİ TABLO(LAR)` başlığıyla gösterir ve sonlandırılacak `pid`'i yazar.

Artık böyle bir bekleme mümkün değil: her bağlantıda `lock_timeout = 15s` ve
`statement_timeout = 900s` ayarlanıyor (bkz. `packages/db/src/client.ts`),
`vehicle-tree-sync` her sorgunun başladığını/bittiğini ekrana yazıyor ve
betiğin tamamı 10 dakikada kendini durdurup **takıldığı aşamanın adını**
basıyor.

Bittiğinde doğrulayın:

```bash
psql "$DATABASE_URL" -c "select count(*) from product;"          # 2677
psql "$DATABASE_URL" -c "select count(*) from product_compatibility;"  # 60599
psql "$DATABASE_URL" -c "select count(*) from data_conflict;"    # 0
```

---

## 4. Vercel projesini oluşturun

1. vercel.com → **Add New → Project** → GitHub deposunu seçin.
2. **Root Directory: `apps/web`** olarak ayarlayın ve
   **"Include files outside of the root directory"** seçeneğini açın.
   (Proje bir npm workspace monorepo'su; `@ocm/db` paketi depo kökünde.)
3. Framework otomatik **Next.js** algılanır; Build/Install komutlarına
   dokunmayın.
4. Node sürümü **20.x veya üzeri** olmalı (`engines: >=20.11`).

---

## 5. Ortam değişkenleri

Vercel → Project → Settings → **Environment Variables**. Hepsini
**Production** ve **Preview** için ekleyin.

| Değişken                | Değer                                              | Zorunlu |
| ----------------------- | -------------------------------------------------- | ------- |
| `DATABASE_URL`          | **pooled** bağlantı adresi, `?sslmode=require` ile | ✅      |
| `DB_POOL_MAX`           | `3`                                                | ✅      |
| `NEXT_PUBLIC_SITE_URL`  | `https://alan-adiniz.com`                          | ✅      |
| `NEXT_PUBLIC_SITE_NAME` | `Oto Center Market`                                | —       |
| `ADMIN_PASSWORD`        | uzun, rastgele bir parola                          | ✅      |
| `ADMIN_SESSION_SECRET`  | 32+ karakter rastgele dizi                         | ✅      |

### ⚠ `ADMIN_PASSWORD` ve `ADMIN_SESSION_SECRET` mutlaka verilmeli

Kodda tanımlı varsayılanlar var:

```
ADMIN_PASSWORD        varsayılan: "otocenter"
ADMIN_SESSION_SECRET  varsayılan: "ocm-gelistirme-anahtari"
```

Bunlar geliştirme kolaylığı için konulmuştu. Değişkenler tanımlanmadan
canlıya çıkılırsa **`/admin` paneline bu varsayılan parolayla herkes
girebilir** — ürün, fiyat ve içe aktarma ekranlarının tamamı oradadır.
Yayından önce ikisini de mutlaka ayarlayın.

Rastgele değer üretmek için:

```bash
openssl rand -base64 32
```

`DB_POOL_MAX` neden 3? Kod varsayılanı 10 (`packages/db/src/client.ts`).
Sunucusuz ortamda her fonksiyon örneği kendi havuzunu açar; 10 × örnek
sayısı hızla limiti aşar. Pooled adresle birlikte 3 güvenli bir başlangıç.

---

## 6. Deploy ve alan adı

**Deploy** düğmesine basın. İlk build ~2 dakika sürer.

Alan adı için: Settings → **Domains** → alan adını ekleyin → Vercel'in
verdiği DNS kayıtlarını alan adı sağlayıcınızda tanımlayın. Alan adı
bağlandıktan sonra `NEXT_PUBLIC_SITE_URL` değişkenini gerçek adrese
güncelleyip **yeniden deploy** edin (bu değişken derleme anında gömülür).

---

## 7. Yayın sonrası kontrol listesi

- [ ] Ana sayfa açılıyor
- [ ] `/otomobil` → marka → model → motor akışı çalışıyor
- [ ] Bir ürün sayfasında araç seçildiğinde **yeşil "Aracınıza uygun"**
      rozeti çıkıyor, uymayan araçta **gri** kalıyor
- [ ] `/agir-vasita` 13 markayı listeliyor
- [ ] Ürün görselleri geliyor (WebP)
- [ ] `/admin` **yeni** parolayla açılıyor, eski `otocenter` ile açılmıyor
- [ ] Vercel → Logs'ta veritabanı bağlantı hatası yok

---

## Sonraki yayınlar

`main` dalına her push otomatik deploy tetikler. Katalog verisi değiştiğinde
(yeni marka, yeni ürün) sıra şudur:

```bash
# .env'de DATABASE_URL = DOĞRUDAN adres iken:
npm run db:seed
npm run db:reindex
git push          # kod değiştiyse
```

Veri yalnızca veritabanında yaşar; seed'i çalıştırmadan yeni ürünler
canlıda görünmez.

---

## Bilinen eksikler (yayına engel değil)

- **`sitemap.xml` ve `robots.txt` yok.** 28 bin araç×kategori sayfası
  üretiliyor ama arama motorlarına haritalanmıyor. SEO için eklenmeli.
- **OEM numaraları girilmedi.** Ürün sayfalarındaki "OEM Numaraları" sekmesi
  boş görünüyor.
- **Ödeme ve kargo entegrasyonu yok.** Sepet ve sipariş akışı hazır, ödeme
  sağlayıcısı bağlı değil.
