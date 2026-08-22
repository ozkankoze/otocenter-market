import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ListingView } from '@/components/catalog/listing-view'
import { BreadcrumbJsonLd, type Crumb } from '@/components/ui/breadcrumb'
import { readSelectedVehicle } from '@/features/vehicle/cookie'
import { getEngineCodes } from '@/server/vehicle-queries'
import { getListing, parseFilters } from '@/server/listing-queries'
import { getSellingBrandBySlug } from '@/server/brand-queries'
import { formatCount } from '@/lib/utils'

export const dynamic = 'force-dynamic' // araç bağlamı cookie'ye bağlı

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const brand = await getSellingBrandBySlug(slug)
  if (!brand) return { title: 'Marka bulunamadı' }

  return {
    title: `${brand.name} Filtre ve Bakım Ürünleri`,
    description:
      `${brand.name} ürünleri Oto Center Market’te: ${formatCount(brand.productCount)} ürün, ` +
      `${brand.categories.join(', ')}. Uyumluluk motor kodu seviyesinde doğrulanır.`,
    alternates: { canonical: `/markalar/${brand.slug}` },
  }
}

export default async function BrandDetailPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams

  const brand = await getSellingBrandBySlug(slug)
  if (!brand) notFound()

  const selection = await readSelectedVehicle()
  const engineId = selection?.engineId ?? null

  const facetKeys = Object.keys(sp)
    .filter((k) => k.startsWith('o_'))
    .map((k) => k.slice(2))
  const { filters, sort, page } = parseFilters(sp, facetKeys)

  const [result, engineCodes] = await Promise.all([
    getListing({ scope: { brandId: brand.id, engineId }, filters, sort, page }),
    engineId ? getEngineCodes(engineId) : Promise.resolve([]),
  ])

  const crumbs: Crumb[] = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Markalar', href: '/markalar' },
    { label: brand.name },
  ]

  return (
    <>
      <BreadcrumbJsonLd items={crumbs} baseUrl={SITE_URL} />
      <ListingView
        crumbs={crumbs}
        eyebrow="Ürün markası"
        title={`${brand.name} Ürünleri`}
        subtitle={
          selection
            ? `${selection.brandName} ${selection.modelName} · ${selection.engineName} için uyumluluk gösteriliyor`
            : `${formatCount(result.total)} ürün listeleniyor`
        }
        result={result}
        filters={filters}
        sort={sort}
        selection={selection}
        engineCodes={engineCodes}
      />
    </>
  )
}
