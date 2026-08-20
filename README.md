# Oto Center Market

Otomotiv filtre, yağ ve bakım ürünleri e-ticaret platformu.

> **Durum:** Faz 0 / Sprint 1 tamamlandı — design system, çekirdek veritabanı,
> araç seçici ve ana sayfa çalışır durumda.
> Mimari referans: `docs/03-FINAL-MIMARI.md`

---

## Hızlı başlangıç

```bash
# 1) Bağımlılıklar
npm install

# 2) Ortam değişkenleri
cp .env.example .env      # DATABASE_URL değerini doldurun

# 3) Veritabanı
npm run db:migrate        # şema (16 hash partition dahil)
npm run db:seed           # temel veri + araç ağacı + ÜRÜNLER + çözümleme + indeksleme

# 4) Geliştirme sunucusu
npm run dev               # http://localhost:3000
```

> **Ürün görselleri** depoda `apps/web/public/urun/<SKU>.png` olarak gelir ve
> `db:seed` sırasında ürünlere bağlanır; ek bir kurulum gerekmez.
> Python 3 + Pillow kuruluysa seed, fotoğrafı olmayan ürünler için ayrıca
> kategori çizimi üretir (`pip install pillow numpy`). Kurulu değilse bu adım
> atlanır, gerçek fotoğraflar yine görünür.

> `db:seed` bütün katalog tablolarını **sıfırlayıp** yeniden kurar. Araç ağacı
> ve ürünler kodda (`packages/db/scripts/seed-data/`) durduğu için seed kendi
> sonunda `db:vehicle-tree` ve `db:urun-yukle` adımlarını otomatik çalıştırır —
> yani tek komut yeterli. Bunları ayrı ayrı çalıştıracaksanız sırayı ters
> çevirmeyin: `db:seed`'den ÖNCE çalıştırılan her şeyi seed siler.

> **Onay kapısı** yalnızca DIŞARIDAN gelen yeni veri için geçerlidir:
> `db:urun-import-onizle` sayaçları gösterir, `db:urun-import-onayla` siz
> isteyince yazar. `db:urun-yukle` ise depoya işlenmiş, daha önce onaylanmış
> veriyi geri yükler ve durup sormaz.

PostgreSQL 16+ gerekir (`pg_trgm` eklentisi migration içinde kurulur).

---

## Komutlar

| Komut                            | Açıklama                                                                 |
| -------------------------------- | ------------------------------------------------------------------------ |
| `npm run dev`                    | Geliştirme sunucusu                                                      |
| `npm run build` / `npm start`    | Üretim derlemesi / sunucu                                                |
| `npm run typecheck`              | TypeScript (strict) kontrolü — her iki paket                             |
| `npm run lint`                   | ESLint                                                                   |
| `npm run format`                 | Prettier                                                                 |
| `npm run db:migrate`             | Bekleyen SQL migration'ları uygular                                      |
| `npm run db:migrate:status`      | Migration durumu                                                         |
| `npm run db:seed`                | Veritabanını sıfırlar, temel veriyi ve gerçek araç ağacını yükler        |
| `npm run db:vehicle-tree`        | Araç ağacını (tür/marka/model) senkronize eder — ekler/günceller, silmez |
| `npm run db:vehicle-tree:export` | Araç ağacını kontrol amaçlı XLSX olarak dışa aktarır                     |
| `npm run db:urun-yukle`          | Ürünleri + fiyat/stok + uyumluluk + görsel bağlarını kurar               |
| `npm run db:urun-import-onizle`  | Bir XLSX'i doğrular ve sayaçları gösterir — HİÇBİR ŞEY YAZMAZ            |
| `npm run db:urun-import-onayla`  | Önizlenen işi uygular (`-- <isNo>`)                                      |
| `npm run db:urun-gorsel-bagla`   | `public/urun/<SKU>.png` dosyalarını ürünlerle eşler                      |
| `npm run db:reindex`             | Uyumluluk çözümlemesi + SEO indeksini yeniden hesaplar                   |
| `npm run db:reset`               | Şemayı düşürüp migration'ları baştan uygular                             |

---

## Klasör yapısı

```
otocenter-market/
├── apps/web/                     Next.js 15 (App Router)
│   └── src/
│       ├── app/                  sayfalar + route handler'lar
│       ├── components/
│       │   ├── ui/               primitifler (Button, Select, Badge…)
│       │   ├── layout/           Header, MainNav (mega menü), Footer
│       │   ├── vehicle/          araç seçici ailesi
│       │   ├── product/          ürün kartı, uyumluluk rozeti
│       │   ├── catalog/          kategori kartı
│       │   └── marketing/        hero, güven bölümü
│       ├── features/vehicle/     araç bağlamı (tipler, cookie)
│       ├── server/               veri erişim katmanı (server-only)
│       ├── lib/                  yardımcılar
│       └── styles/               design token'lar
└── packages/db/
    ├── migrations/*.sql          ŞEMANIN TEK DOĞRULUK KAYNAĞI
    ├── scripts/                  migrate · seed · reindex
    └── src/
        ├── types.ts              Kysely tipleri (SQL'in TS karşılığı)
        ├── client.ts             tembel havuz + tek Kysely örneği
        ├── resolve.ts            ÇÖZÜMLEME MOTORU (assertion → uyumluluk)
        └── normalize.ts          kod normalizasyonu, slug
```

---

## Mimarinin üç kritik kuralı

**1. Kaynaklar gerçeği yazmaz, iddia eder.**
`compatibility_assertion` tablosuna her kaynak (CSV, TecDoc, MANN, admin) kendi
iddiasını yazar. `resolve.ts` bunları bir politikayla çözümleyip sitenin okuduğu
`product_compatibility` tablosunu üretir. Yeni bir katalog eklemek `data_source`
tablosuna bir satır + bir adapter demektir — **şema değişmez**.

**2. Veri yoksa veya çelişkiliyse asla "uyumlu" gösterilmez.**
`CONFLICTED` durumundaki kayıt arayüzde gri "Uyumluluk teyit edilmedi" rozetiyle
görünür ve `data_conflict` kuyruğuna düşer. Yalnızca `VERIFIED` ve `SOURCED`
yeşil rozet alır.

**3. Ürünsüz sayfa üretilmez.**
`engine_category_index.product_count = 0` olan araç×kategori kombinasyonu için
sayfa üretilmez ve sitemap'e girmez.

---

## Teknoloji

| Katman        | Seçim                                          | Not                                       |
| ------------- | ---------------------------------------------- | ----------------------------------------- |
| Framework     | Next.js 15 (App Router, RSC)                   | —                                         |
| Dil           | TypeScript strict + `noUncheckedIndexedAccess` | —                                         |
| Stil          | Tailwind CSS v4 (`@theme` token'ları)          | design system'den birebir                 |
| UI            | Radix primitifleri + kendi bileşen katmanımız  | —                                         |
| Veritabanı    | PostgreSQL 16                                  | `product_compatibility` 16 hash partition |
| Sorgu katmanı | **Kysely + pg**                                | bkz. aşağıdaki not                        |
| Doğrulama     | Zod                                            | route handler girdileri                   |

### Neden Prisma değil, Kysely?

Onaylanan mimari Prisma öngörüyordu. Uygulamada Prisma CLI'ın motor ikililerini
`binaries.prisma.sh` üzerinden indirmesi gerekiyor; bu, kapalı/kısıtlı ağlarda ve
bu projenin CI ortamında çalışmıyor. Kysely'ye geçiş aynı zamanda projenin en zor
sorgularında avantaj sağlıyor:

- Hash partition'lı tablo, `INSERT … ON CONFLICT` ile çözümleme, `TRUNCATE`+
  yeniden indeksleme, GIN/trigram sorguları — Prisma'da hepsi `$queryRaw` ile
  yazılırdı; yani tip güvenliği tam da en kritik yerde kaybolurdu.
- Migration'lar zaten elle yazılmak zorundaydı (Prisma partition üretmiyor).
- Kurulum ikili indirmeye bağlı değil; CI ve serverless soğuk başlangıç daha hafif.

Şemanın tek doğruluk kaynağı `packages/db/migrations/*.sql`, TypeScript karşılığı
`packages/db/src/types.ts`.
