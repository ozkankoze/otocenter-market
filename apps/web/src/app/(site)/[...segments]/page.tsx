import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { ListingView } from '@/components/catalog/listing-view'
import { Breadcrumb, BreadcrumbJsonLd, type Crumb } from '@/components/ui/breadcrumb'
import { Card } from '@/components/ui/card'
import { readSelectedVehicle } from '@/features/vehicle/cookie'
import { getEngineCodes } from '@/server/vehicle-queries'
import {
  getCategoryBySlug,
  getListing,
  parseFilters,
  type CategoryNode,
} from '@/server/listing-queries'
import {
  getBrandsOfType,
  getEngineCategoryCounts,
  getEnginesOfModel,
  getModelsOfBrand,
  getVehicleBrandBySlug,
  getVehicleEngineBySlug,
  getVehicleModelBySlug,
  getVehicleTypeBySlug,
} from '@/server/vehicle-page-queries'
import { formatCount } from '@/lib/utils'

export const dynamic = 'force-dynamic' // araç bağlamı cookie'ye bağlı

type Props = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

// ═══════════════════════════════ METADATA ═══════════════════════════════════

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments } = await params
  const category = segments.length <= 2 ? await getCategoryBySlug(segments.at(-1) ?? '') : null

  if (category) {
    return {
      title: category.seoTitle ?? category.name,
      description: category.seoDescription ?? undefined,
      alternates: { canonical: `/${segments.join('/')}` },
    }
  }

  const vehicle = await resolveVehicle(segments)
  if (vehicle?.engine) {
    const title = `${vehicle.brand!.name} ${vehicle.model!.name} ${vehicle.engine.name} Yedek Parça`
    return {
      title,
      description: `${vehicle.brand!.name} ${vehicle.model!.name} ${vehicle.engine.name} için uyumlu filtre, yağ ve bakım ürünleri. Motor kodu seviyesinde doğrulanmış uyumluluk.`,
      alternates: { canonical: `/${segments.join('/')}` },
    }
  }

  return { title: 'Katalog' }
}

// ═══════════════════════════════ ÇÖZÜMLEYİCİ ════════════════════════════════

type VehicleResolution = {
  type: { id: number; name: string; slug: string }
  brand: { id: number; name: string; slug: string } | null
  model: { id: number; name: string; slug: string; yearFrom: number | null; yearTo: number | null } | null
  engine: Awaited<ReturnType<typeof getVehicleEngineBySlug>>
  categorySlug: string | null
}

async function resolveVehicle(segments: string[]): Promise<VehicleResolution | null> {
  const [typeSlug, brandSlug, modelSlug, engineSlug, categorySlug] = segments
  if (!typeSlug) return null

  const type = await getVehicleTypeBySlug(typeSlug)
  if (!type) return null
  if (!brandSlug) return { type, brand: null, model: null, engine: null, categorySlug: null }

  const brand = await getVehicleBrandBySlug(type.id, brandSlug)
  if (!brand) return null
  if (!modelSlug) return { type, brand, model: null, engine: null, categorySlug: null }

  const model = await getVehicleModelBySlug(brand.id, modelSlug)
  if (!model) return null
  if (!engineSlug) return { type, brand, model, engine: null, categorySlug: null }

  const engine = await getVehicleEngineBySlug(model.id, engineSlug)
  if (!engine) return null

  return { type, brand, model, engine, categorySlug: categorySlug ?? null }
}

// ═══════════════════════════════ SAYFA ══════════════════════════════════════

export default async function CatalogPage({ params, searchParams }: Props) {
  const { segments } = await params
  const sp = await searchParams
  const selection = await readSelectedVehicle()

  // 1) Kategori sayfası mı? (1 veya 2 segment)
  if (segments.length <= 2) {
    const category = await getCategoryBySlug(segments.at(-1)!)
    if (category) {
      // Kanonik yol denetimi: /filtreler/hava-filtreleri
      const canonical = category.parentSlug
        ? `/${category.parentSlug}/${category.slug}`
        : `/${category.slug}`
      if (`/${segments.join('/')}` !== canonical) redirect(canonical)
      return renderCategory({ category, searchParams: sp, selection })
    }
  }

  // 2) Araç ağacı sayfası mı?
  const vehicle = await resolveVehicle(segments)
  if (!vehicle) notFound()

  if (vehicle.engine) return renderEngine({ vehicle, searchParams: sp, selection })
  if (vehicle.model) return renderModel(vehicle)
  if (vehicle.brand) return renderBrand(vehicle)
  return renderType(vehicle)
}

// ─────────────────────────── KATEGORİ LİSTELEME ─────────────────────────────

async function renderCategory({
  category,
  searchParams,
  selection,
}: {
  category: CategoryNode
  searchParams: Record<string, string | string[] | undefined>
  selection: Awaited<ReturnType<typeof readSelectedVehicle>>
}) {
  const engineId = selection?.engineId ?? null

  // Facet anahtarlarını bilmek için önce boş filtreyle sorgu yapmıyoruz;
  // spec anahtarları searchParams'tan `o_` öneki ile okunuyor.
  const facetKeys = Object.keys(searchParams)
    .filter((k) => k.startsWith('o_'))
    .map((k) => k.slice(2))

  const { filters, sort, page } = parseFilters(searchParams, facetKeys)

  const [result, engineCodes] = await Promise.all([
    getListing({
      scope: { category: { id: category.id, path: category.path }, engineId },
      filters,
      sort,
      page,
    }),
    engineId ? getEngineCodes(engineId) : Promise.resolve([]),
  ])

  const crumbs: Crumb[] = [
    { label: 'Ana Sayfa', href: '/' },
    ...(category.parentSlug && category.parentName
      ? [{ label: category.parentName, href: `/${category.parentSlug}` }]
      : []),
    { label: category.name },
  ]

  return (
    <>
      <BreadcrumbJsonLd items={crumbs} baseUrl={SITE_URL} />
      <ListingView
        crumbs={crumbs}
        eyebrow={category.parentName ?? 'Katalog'}
        title={category.name}
        subtitle={
          selection
            ? `${selection.brandName} ${selection.modelName} · ${selection.engineName} için uyumluluk gösteriliyor`
            : `${formatCount(result.total)} ürün listeleniyor`
        }
        intro={category.seoIntro}
        result={result}
        filters={filters}
        sort={sort}
        selection={selection}
        engineCodes={engineCodes}
        relatedLinks={category.children.map((c) => ({
          label: c.name,
          href: `/${category.slug}/${c.slug}`,
          count: c.productCount,
        }))}
      />
    </>
  )
}

// ─────────────────────────── ARAÇ SONUÇ SAYFASI ─────────────────────────────

async function renderEngine({
  vehicle,
  searchParams,
  selection,
}: {
  vehicle: VehicleResolution
  searchParams: Record<string, string | string[] | undefined>
  selection: Awaited<ReturnType<typeof readSelectedVehicle>>
}) {
  const engine = vehicle.engine!
  const brand = vehicle.brand!
  const model = vehicle.model!

  const category = vehicle.categorySlug ? await getCategoryBySlug(vehicle.categorySlug) : null
  if (vehicle.categorySlug && !category) notFound()

  const facetKeys = Object.keys(searchParams)
    .filter((k) => k.startsWith('o_'))
    .map((k) => k.slice(2))
  const { filters, sort, page } = parseFilters(searchParams, facetKeys)

  const [result, categoryCounts] = await Promise.all([
    getListing({
      scope: {
        engineId: engine.id,
        engineScoped: true,
        ...(category ? { category: { id: category.id, path: category.path } } : {}),
      },
      filters,
      sort,
      page,
    }),
    getEngineCategoryCounts(engine.id),
  ])

  // ÜRÜNSÜZ SAYFA ÜRETİLMEZ — mimari §11
  if (result.total === 0 && page === 1 && Object.keys(searchParams).length === 0) {
    if (category) {
      redirect(`/${vehicle.type.slug}/${brand.slug}/${model.slug}/${engine.slug}`)
    }
    if (categoryCounts.length === 0) {
      redirect(`/${vehicle.type.slug}/${brand.slug}/${model.slug}`)
    }
  }

  const base = `/${vehicle.type.slug}/${brand.slug}/${model.slug}/${engine.slug}`
  const crumbs: Crumb[] = [
    { label: 'Ana Sayfa', href: '/' },
    { label: vehicle.type.name, href: `/${vehicle.type.slug}` },
    { label: brand.name, href: `/${vehicle.type.slug}/${brand.slug}` },
    { label: model.name, href: `/${vehicle.type.slug}/${brand.slug}/${model.slug}` },
    ...(category ? [{ label: engine.name, href: base }, { label: category.name }] : [{ label: engine.name }]),
  ]

  const engineLabel = [
    engine.displacementCc ? `${(engine.displacementCc / 1000).toFixed(1)} L` : null,
    engine.powerKw ? `${engine.powerKw} kW` : null,
    engine.powerHp ? `${engine.powerHp} HP` : null,
    engine.fuelType,
    engine.engineCodes.length ? `Motor kodu: ${engine.engineCodes.join(' · ')}` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <>
      <BreadcrumbJsonLd items={crumbs} baseUrl={SITE_URL} />
      <ListingView
        crumbs={crumbs}
        eyebrow="Araç uyumluluğu"
        title={
          category
            ? `${brand.name} ${model.name} ${engine.name} ${category.name}`
            : `${brand.name} ${model.name} ${engine.name} Yedek Parça`
        }
        subtitle={engineLabel}
        result={result}
        filters={filters}
        sort={sort}
        selection={selection}
        engineCodes={engine.engineCodes}
        relatedLinks={[
          { label: 'Tüm kategoriler', href: base },
          ...categoryCounts.map((c) => ({
            label: c.name,
            href: `${base}/${c.slug}`,
            count: c.productCount,
          })),
        ]}
      />
    </>
  )
}

// ────────────────────── ARAÇ AĞACI ARA SAYFALARI ────────────────────────────

async function renderType(vehicle: VehicleResolution) {
  const brands = await getBrandsOfType(vehicle.type.id)
  const crumbs: Crumb[] = [{ label: 'Ana Sayfa', href: '/' }, { label: vehicle.type.name }]

  return (
    <div className="ocm-container py-6 md:py-8">
      <BreadcrumbJsonLd items={crumbs} baseUrl={SITE_URL} />
      <Breadcrumb items={crumbs} />
      <span className="ocm-eyebrow">Araç grubu</span>
      <h1 className="mt-2 mb-1.5 text-[24px] font-bold tracking-tight text-ink-900 md:text-[30px]">
        {vehicle.type.name} Yedek Parça
      </h1>
      <p className="mb-6 text-sm text-ink-600">
        Marka seçerek aracınıza uyumlu filtre, yağ ve bakım ürünlerine ulaşın.
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        {brands.map((b) => (
          <Link key={b.slug} href={`/${vehicle.type.slug}/${b.slug}`} prefetch={false}>
            <Card interactive className="flex h-[76px] items-center justify-center px-3 text-center">
              <span className="text-[13px] font-semibold text-ink-800">{b.name}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

async function renderBrand(vehicle: VehicleResolution) {
  const brand = vehicle.brand!
  const models = await getModelsOfBrand(brand.id)
  const crumbs: Crumb[] = [
    { label: 'Ana Sayfa', href: '/' },
    { label: vehicle.type.name, href: `/${vehicle.type.slug}` },
    { label: brand.name },
  ]

  return (
    <div className="ocm-container py-6 md:py-8">
      <BreadcrumbJsonLd items={crumbs} baseUrl={SITE_URL} />
      <Breadcrumb items={crumbs} />
      <span className="ocm-eyebrow">{vehicle.type.name}</span>
      <h1 className="mt-2 mb-1.5 text-[24px] font-bold tracking-tight text-ink-900 md:text-[30px]">
        {brand.name} Yedek Parça
      </h1>
      <p className="mb-6 text-sm text-ink-600">Model seçerek devam edin.</p>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {models.map((m) => (
          <Link key={m.slug} href={`/${vehicle.type.slug}/${brand.slug}/${m.slug}`} prefetch={false}>
            <Card interactive className="flex items-center gap-3 px-4 py-3.5">
              <span className="min-w-0">
                <b className="block truncate text-sm font-semibold text-ink-900">{m.name}</b>
                <span className="ocm-code text-[11.5px]">
                  {m.yearFrom ? `${m.yearFrom}${m.yearTo ? `–${m.yearTo}` : '→'}` : ''}
                </span>
              </span>
              <ChevronRight size={16} className="ml-auto shrink-0 text-ink-400" aria-hidden="true" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

async function renderModel(vehicle: VehicleResolution) {
  const brand = vehicle.brand!
  const model = vehicle.model!
  const engines = await getEnginesOfModel(model.id)
  const crumbs: Crumb[] = [
    { label: 'Ana Sayfa', href: '/' },
    { label: vehicle.type.name, href: `/${vehicle.type.slug}` },
    { label: brand.name, href: `/${vehicle.type.slug}/${brand.slug}` },
    { label: model.name },
  ]

  return (
    <div className="ocm-container py-6 md:py-8">
      <BreadcrumbJsonLd items={crumbs} baseUrl={SITE_URL} />
      <Breadcrumb items={crumbs} />
      <span className="ocm-eyebrow">{brand.name}</span>
      <h1 className="mt-2 mb-1.5 text-[24px] font-bold tracking-tight text-ink-900 md:text-[30px]">
        {brand.name} {model.name} Yedek Parça
      </h1>
      <p className="mb-6 text-sm text-ink-600">
        Motorunuzu seçin — uyumluluk motor kodu seviyesinde doğrulanır.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        {engines.map((e) => {
          const href = `/${vehicle.type.slug}/${brand.slug}/${model.slug}/${e.slug}`
          const hasProducts = e.productCount > 0
          return (
            <Link key={e.slug} href={href} prefetch={false}>
              <Card interactive className="flex items-center gap-4 px-4 py-4">
                <span className="min-w-0 flex-1">
                  <b className="block truncate text-sm font-semibold text-ink-900">{e.name}</b>
                  <span className="ocm-code mt-0.5 block text-[11.5px]">
                    {e.engineCodes.join(' · ')}
                    {e.yearFrom ? ` · ${e.yearFrom}${e.yearTo ? `–${e.yearTo}` : '→'}` : ''}
                  </span>
                </span>
                <span
                  className={
                    hasProducts
                      ? 'shrink-0 rounded-sm bg-accent-100 px-2.5 py-1 text-[11.5px] font-semibold text-accent-700'
                      : 'shrink-0 text-[11.5px] font-medium text-ink-400'
                  }
                >
                  {hasProducts ? `${formatCount(e.productCount)} uyumlu ürün` : 'Ürün eklenmedi'}
                </span>
                <ChevronRight size={16} className="shrink-0 text-ink-400" aria-hidden="true" />
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
