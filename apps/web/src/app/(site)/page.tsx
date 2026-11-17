import type { Metadata } from 'next'
import Link from 'next/link'
import { Hero } from '@/components/marketing/hero'
import { TrustFeatures } from '@/components/marketing/trust-features'
import { VehicleSelector } from '@/components/vehicle/vehicle-selector'
import { SelectedVehicleBar } from '@/components/vehicle/selected-vehicle-bar'
import { CategoryCard } from '@/components/catalog/category-card'
import { Card } from '@/components/ui/card'
import { CompatibleResults } from '@/components/catalog/compatible-results'
import { readSelectedVehicle } from '@/features/vehicle/cookie'
import {
  getCatalogStatsCached,
  getCompatibilitySummary,
  getEngineCodes,
  getVehicleTypes,
} from '@/server/vehicle-queries'
import {
  getCategoryCards,
  getCategoryCardsCached,
  getFeaturedProductsCached,
  getProducts,
  getSetProductCountCached,
  getSetProductsCached,
} from '@/server/catalog-queries'
import { ProductCard } from '@/components/product/product-card'
import { Check, Package } from 'lucide-react'
import type { ProductCardData } from '@/features/catalog/product-types'
import { getSellingBrandsCached } from '@/server/brand-queries'
import { formatCount } from '@/lib/utils'

export const dynamic = 'force-dynamic' // araç seçimi cookie'ye bağlı

/**
 * Ana sayfanın kendi metadata'sı YOKTU — canonical üretmiyor, kökten gelen
 * açıklamayı kullanıyordu. SEO denetiminde "Canonical etiketi bulunamadı"
 * (kırmızı) ve "meta description 130 karakter, önerilen 140–160" uyarıları
 * buradan geliyordu.
 *
 * Açıklama 156 karakter: önerilen 140–160 aralığında, arama sonucunda
 * kesilme riski düşük.
 */
export const metadata: Metadata = {
  /*
   * `absolute` ŞART. Kök yerleşimdeki şablon `'%s | Oto Center Market'`;
   * düz bir string verildiğinde başlık
   *   "Oto Center Market — Aracınız İçin Doğru Parça | Oto Center Market"
   * oluyordu — marka adı iki kez. `absolute`, şablonu atlar.
   */
  title: { absolute: 'Oto Center Market — Aracınız İçin Doğru Parça' },
  description:
    'Otomobil, hafif ticari ve ağır vasıta araçlar için filtre, yağ ve bakım ürünleri. ' +
    'Aracınızı marka, model ve motora göre seçin, uyumlu ürünleri anında görün.',
  /*
   * Next.js bunu "https://otocentermarket.com" olarak yazar — SON EĞİK ÇİZGİ
   * OLMADAN. `trailingSlash: false` (varsayılan) olduğu sürece mutlak URL
   * verilse bile eğik çizgiyi kırpar; denendi.
   *
   * Sitemap ise aynı sayfayı "https://otocentermarket.com/" diye listeliyordu.
   * Aynı sayfa için iki farklı dizge = denetim aracının "canonical riski /
   * sinyal çakışması" bulgusu. Çerçeveyle güreşmek yerine sitemap bu biçime
   * hizalandı (bkz. app/sitemap.ts). Buradaki değer DEĞİŞTİRİLİRSE oradaki
   * normalleştirme de güncellenmeli.
   */
  alternates: { canonical: '/' },
}

export default async function HomePage() {
  const selection = await readSelectedVehicle()
  const engineId = selection?.engineId ?? null

  const [types, stats, categories, products, brands, summary, engineCodes, setCount, aracSetleri] = await Promise.all([
    getVehicleTypes(),
    getCatalogStatsCached(),
    /*
     * Araç SEÇİLİYSE canlı sorgu (uyumluluk sayıları kullanıcıya özel),
     * seçili DEĞİLSE önbellekli sürüm. Ziyaretçilerin çoğunda çerez yok;
     * bu iki sorgu o durumda herkes için aynı sonucu veriyor ve önceden
     * her açılışta uzaktaki veritabanına gidiyordu.
     */
    engineId ? getCategoryCards(engineId) : getCategoryCardsCached(),
    engineId
      ? getProducts({ engineId, limit: 12, featuredOnly: false })
      : getFeaturedProductsCached(8),
    getSellingBrandsCached(),
    engineId ? getCompatibilitySummary(engineId) : Promise.resolve([]),
    engineId ? getEngineCodes(engineId) : Promise.resolve([]),
    getSetProductCountCached(),
    engineId
      ? getProducts({ engineId, limit: 4, categoryCode: 'SET_URUNLER' })
      : Promise.resolve([] as ProductCardData[]),
  ])
  /*
   * Set vitrini: araç seçiliyse ÖNCE o araca uyan setler; uyan set yoksa
   * genel vitrin (4'lü setler önce). Uyumsuz set asla "aracınıza uygun" diye
   * gösterilmez — yalnızca compatibility === 'compatible' olanlar alınır.
   */
  const uyanSetler = aracSetleri.filter((p) => p.compatibility === 'compatible')
  const setler = uyanSetler.length > 0 ? uyanSetler : await getSetProductsCached(4)
  const setlerAracaOzel = uyanSetler.length > 0

  return (
    <>
      {/*
        Hero'nun "Popüler" satırı en çok ürünü olan beş kategoriden kurulur.
        `categories` zaten boş kategorileri elemiş durumda, dolayısıyla burada
        ürünü olmayan bir bağlantı oluşamaz.
      */}
      <Hero
        stats={stats}
        popular={[...categories]
          .sort((a, b) => b.productCount - a.productCount)
          .slice(0, 5)
          .map((c) => ({ label: c.name, href: c.href }))}
      />

      {/* Araç seçici — hero'nun üzerine binen kart */}
      <div className="ocm-container relative z-20 -mt-14 md:-mt-16">
        <div id="arac-secici" className="scroll-mt-28">
          <VehicleSelector variant="hero" types={types} initialSelection={selection} />
          {selection ? (
            <div className="mt-4">
              <SelectedVehicleBar selection={selection} engineCodes={engineCodes} />
            </div>
          ) : null}
        </div>
      </div>

      {/* Set Ürünler — ana sayfada öne çıkarılan vitrin */}
      {setCount > 0 && setler.length > 0 ? (
        <SetVitrini
          count={setCount}
          products={setler}
          hasVehicle={Boolean(selection)}
          aracaOzel={setlerAracaOzel}
          aracAdi={selection ? `${selection.brandName} ${selection.modelName}` : null}
        />
      ) : null}

      {/* Kategoriler */}
      <section className="py-12 md:py-16">
        <div className="ocm-container">
          <SectionHead
            eyebrow="Katalog"
            title="Kategoriler"
            subtitle={
              selection
                ? `${selection.brandName} ${selection.modelName} için kategori bazlı uyumluluk`
                : 'Aradığınız ürün grubunu seçin'
            }
            href="/filtreler"
            linkLabel="Tüm kategoriler →"
            linkTitle="Tüm filtre ve bakım ürünü kategorilerini görüntüle"
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {categories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Ürünler */}
      <section className="pb-12 md:pb-16">
        <div className="ocm-container">
          <SectionHead
            eyebrow={selection ? 'Aracınıza uygun' : 'Öne çıkanlar'}
            title={
              selection
                ? `${selection.brandName} ${selection.modelName} için uyumlu ürünler`
                : 'Öne Çıkan Ürünler'
            }
            subtitle={
              selection
                ? `${selection.engineName}${selection.years ? ` · ${selection.years}` : ''}`
                : 'Çok tercih edilen filtre ve yağ ürünleri'
            }
            href="/filtreler"
            linkLabel="Tümünü gör →"
            linkTitle={
              selection
                ? `${selection.brandName} ${selection.modelName} için tüm uyumlu ürünleri görüntüle`
                : 'Katalogdaki tüm ürünleri görüntüle'
            }
          />
          <CompatibleResults products={products} selection={selection} summary={summary} />
        </div>
      </section>

      {/*
        Markalar — YALNIZCA gerçekten satışta olan markalar.
        Liste ürün verisinden türetilir; ürünü olmayan marka kaydı (BOSCH,
        MAHLE, PURFLUX gibi kurulumdan kalan boş kayıtlar) vitrine çıkmaz,
        çünkü tıklayan kullanıcı boş bir sayfayla karşılaşırdı.
      */}
      {brands.length > 0 ? (
        <section className="pb-12 md:pb-16">
          <div className="ocm-container">
            <SectionHead
              eyebrow="Tedarik"
              title="Ürün Markaları"
              subtitle="Yetkili distribütör kanalından tedarik edilen ürün markaları"
              href="/markalar"
              linkLabel="Tüm markalar →"
              linkTitle="Satıştaki tüm ürün markalarını görüntüle"
            />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {brands.slice(0, 8).map((b) => (
                <Link
                  key={b.id}
                  href={`/markalar/${b.slug}`}
                  prefetch={false}
                  title={`${b.name} markasının ${formatCount(b.productCount)} ürününü görüntüle`}
                >
                  <Card
                    interactive
                    className="flex h-[86px] flex-col items-center justify-center gap-1 px-3 text-center"
                  >
                    <span className="text-[13px] font-bold tracking-wide text-ink-700">
                      {b.name}
                    </span>
                    <span className="text-[11.5px] text-ink-400">
                      {formatCount(b.productCount)} ürün
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <TrustFeatures />

      {/* Kurumsal şerit */}
      <section className="relative overflow-hidden bg-brand-900 py-14 text-white">
        <span className="ocm-grid-pattern absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="ocm-container relative flex flex-wrap items-center gap-10">
          <div className="min-w-[280px] flex-1">
            <span className="ocm-eyebrow text-brand-300 before:bg-brand-300">Kurumsal</span>
            <h2 className="mt-2.5 mb-2 text-[19px] font-semibold text-white md:text-[22px]">
              Oto Center Market
            </h2>
            <p className="max-w-[620px] text-sm text-white/70">
              Otomobil, hafif ticari ve ağır vasıta araçlar için filtre, yağ ve bakım ürünleri
              tedarik ediyoruz. Ürünlerimiz araç motor kodu seviyesinde eşleştirilir; uyumluluk
              doğrulanmadığında bunu açıkça belirtiriz.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-6">
            <Stat value={`${formatCount(stats.products)}+`} label="Ürün" />
            <Stat value={`${stats.vehicleBrands}+`} label="Araç markası" />
            <Stat value={`${stats.productBrands}+`} label="Ürün markası" />
            <Stat value={`${formatCount(stats.compatibilities)}+`} label="Motor eşleştirmesi" />
          </div>
        </div>
      </section>
    </>
  )
}

const SET_HREF = '/filtreler/set-urunler'

function SetVitrini({
  count,
  products,
  hasVehicle,
  aracaOzel,
  aracAdi,
}: {
  count: number
  products: ProductCardData[]
  hasVehicle: boolean
  aracaOzel: boolean
  aracAdi: string | null
}) {
  return (
    <section className="pt-12 md:pt-16" data-testid="set-vitrini">
      <div className="ocm-container">
        <div className="relative overflow-hidden rounded-xl bg-brand-900 p-5 text-white md:p-7">
          <span className="ocm-grid-pattern absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative grid gap-6 lg:grid-cols-[300px_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-accent-600 px-2 py-1 text-[11.5px] font-bold tracking-wide text-white uppercase">
                <Package size={13} aria-hidden="true" />
                Yeni · Set Ürünler
              </span>
              <h2 className="mt-3 text-[22px] leading-tight font-semibold text-white md:text-[26px]">
                {aracaOzel && aracAdi ? `${aracAdi} için filtre setleri` : 'Periyodik bakım tek pakette'}
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Aracınızın yağ, hava, yakıt ve polen filtresi tek sette. Ayrı ayrı almaya göre{' '}
                <b className="text-white">%5 daha uygun</b>.
              </p>
              <ul className="mt-4 space-y-1.5 text-[13px] text-white/80">
                {[
                  'Orijinal MANN-FILTER filtreler',
                  'MANN-FILTER uygulama listesine göre hazırlandı',
                  'Motor seviyesinde uyumluluk kontrolü',
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check size={14} className="text-accent-600" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
              <Link
                href={SET_HREF}
                prefetch={false}
                title="Tüm filtre setlerini görüntüle"
                className="mt-5 inline-flex h-10 items-center rounded-md bg-white px-4 text-sm font-semibold text-brand-800 transition hover:bg-brand-50"
                data-testid="set-vitrini-cta"
              >
                {formatCount(count)} setin tümünü gör →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 text-ink-900 xl:grid-cols-4">
              {/* Mobilde 2 kart: vitrin ekranı uzatmasın, gerisi "tümünü gör"de */}
              {products.slice(0, 4).map((p, i) => (
                <div key={p.id} className={i >= 2 ? 'hidden xl:block' : undefined}>
                  <ProductCard product={p} hasVehicle={hasVehicle} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * `linkTitle` ZORUNLU. SEO denetimi "Tüm kategoriler →" ve "Tümünü gör →"
 * bağlantılarını title etiketi olmadığı için işaretliyordu; ok işaretli kısa
 * etiketler zaten bağlam dışında hiçbir şey anlatmıyor. Prop opsiyonel
 * bırakılsaydı yeni bir bölüm eklendiğinde sessizce yeniden unutulurdu —
 * zorunlu olduğu için derleyici hatırlatıyor.
 */
function SectionHead({
  eyebrow,
  title,
  subtitle,
  href,
  linkLabel,
  linkTitle,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  href: string
  linkLabel: string
  linkTitle: string
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <span className="ocm-eyebrow">{eyebrow}</span> : null}
        <h2 className="mt-2 text-[21px] font-semibold text-ink-900 md:text-[25px]">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-ink-600">{subtitle}</p> : null}
      </div>
      <Link
        href={href}
        prefetch={false}
        title={linkTitle}
        className="text-[13.5px] font-semibold text-brand-600 hover:underline"
      >
        {linkLabel}
      </Link>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <b className="block text-[26px] leading-tight font-bold tracking-tight text-white">{value}</b>
      <span className="text-[12.5px] text-white/60">{label}</span>
    </div>
  )
}
