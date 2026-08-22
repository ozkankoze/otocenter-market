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
  getCatalogStats,
  getCompatibilitySummary,
  getEngineCodes,
  getVehicleTypes,
} from '@/server/vehicle-queries'
import { getCategoryCards, getProducts } from '@/server/catalog-queries'
import { getSellingBrands } from '@/server/brand-queries'
import { formatCount } from '@/lib/utils'

export const dynamic = 'force-dynamic' // araç seçimi cookie'ye bağlı

export default async function HomePage() {
  const selection = await readSelectedVehicle()
  const engineId = selection?.engineId ?? null

  const [types, stats, categories, products, brands, summary, engineCodes] = await Promise.all([
    getVehicleTypes(),
    getCatalogStats(),
    getCategoryCards(engineId),
    getProducts({ engineId, limit: engineId ? 12 : 8, featuredOnly: !engineId }),
    getSellingBrands(),
    engineId ? getCompatibilitySummary(engineId) : Promise.resolve([]),
    engineId ? getEngineCodes(engineId) : Promise.resolve([]),
  ])

  return (
    <>
      <Hero stats={stats} />

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
            />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {brands.slice(0, 8).map((b) => (
                <Link key={b.id} href={`/markalar/${b.slug}`} prefetch={false}>
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

function SectionHead({
  eyebrow,
  title,
  subtitle,
  href,
  linkLabel,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  href: string
  linkLabel: string
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
