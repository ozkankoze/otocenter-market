import type { Metadata } from 'next'
import Link from 'next/link'
import { ListingView } from '@/components/catalog/listing-view'
import { Card } from '@/components/ui/card'
import { SiteSearchForm } from '@/components/layout/site-search-form'
import { PageBody, PageHero } from '@/components/layout/page-shell'
import { readSelectedVehicle } from '@/features/vehicle/cookie'
import { getEngineCodes } from '@/server/vehicle-queries'
import { getListing, parseFilters } from '@/server/listing-queries'
import { formatCount } from '@/lib/utils'
import type { Crumb } from '@/components/ui/breadcrumb'

export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/** Arama sonuçları arama motorlarına açılmaz — ince/yinelenen içerik üretir. */
export const metadata: Metadata = {
  title: 'Arama',
  description: 'Ürün adı, parça kodu veya OEM numarasıyla arama yapın.',
  robots: { index: false, follow: true },
}

const POPULER = [
  { label: 'Hava Filtresi', href: '/filtreler/hava-filtreleri' },
  { label: 'Yağ Filtresi', href: '/filtreler/yag-filtreleri' },
  { label: 'Polen Filtresi', href: '/filtreler/polen-kabin-filtreleri' },
  { label: 'Yakıt Filtresi', href: '/filtreler/yakit-filtreleri' },
]

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams
  const query = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.trim() ?? ''

  const crumbs: Crumb[] = [{ label: 'Ana Sayfa', href: '/' }, { label: 'Arama' }]

  // Sorgu yoksa liste sorgusu hiç atılmaz; boş bir katalog dökümü göstermek
  // kullanıcıya bir şey anlatmaz.
  if (!query) {
    return (
      <>
        <PageHero
          eyebrow="Arama"
          title="Ne arıyorsunuz?"
          description="Ürün adı, parça kodu, SKU ya da OEM numarası yazın. Aracınızı seçtiyseniz sonuçlarda uyumluluk da gösterilir."
          crumbs={crumbs}
        >
          <SiteSearchForm variant="hero" className="mt-6 max-w-[620px]" submitLabel="Ara" />
        </PageHero>
        <PageBody>
          <Card className="p-6">
            <b className="block text-sm font-semibold text-ink-900">Popüler kategoriler</b>
            <div className="mt-3 flex flex-wrap gap-2">
              {POPULER.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  prefetch={false}
                  className="inline-flex h-9 items-center rounded-sm border border-ink-100 bg-white px-3.5 text-[13px] text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-600"
                >
                  {p.label}
                </Link>
              ))}
            </div>
          </Card>
        </PageBody>
      </>
    )
  }

  const selection = await readSelectedVehicle()
  const engineId = selection?.engineId ?? null

  const facetKeys = Object.keys(sp)
    .filter((k) => k.startsWith('o_'))
    .map((k) => k.slice(2))
  const { filters, sort, page } = parseFilters(sp, facetKeys)

  const [result, engineCodes] = await Promise.all([
    getListing({ scope: { query, engineId }, filters, sort, page }),
    engineId ? getEngineCodes(engineId) : Promise.resolve([]),
  ])

  return (
    <ListingView
      crumbs={[...crumbs.slice(0, 1), { label: `“${query}” araması` }]}
      eyebrow="Arama sonuçları"
      title={`“${query}”`}
      subtitle={
        result.total > 0
          ? `${formatCount(result.total)} ürün bulundu`
          : 'Bu arama için ürün bulunamadı. Parça kodunu ya da OEM numarasını da deneyebilirsiniz.'
      }
      result={result}
      filters={filters}
      sort={sort}
      selection={selection}
      engineCodes={engineCodes}
      relatedLinks={POPULER.map((p) => ({ label: p.label, href: p.href }))}
    />
  )
}
