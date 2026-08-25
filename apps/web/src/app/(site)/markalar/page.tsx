import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PageBody, PageHero } from '@/components/layout/page-shell'
import { getSellingBrandsCached } from '@/server/brand-queries'
import { formatCount } from '@/lib/utils'
import type { Crumb } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Ürün Markaları',
  description:
    'Oto Center Market’te satışta olan filtre ve bakım ürünü markaları. Yetkili distribütör kanalından tedarik edilen orijinal ve muadil ürünler.',
  alternates: { canonical: '/markalar' },
}

export default async function BrandsPage() {
  const brands = await getSellingBrandsCached()
  const crumbs: Crumb[] = [{ label: 'Ana Sayfa', href: '/' }, { label: 'Markalar' }]
  const toplam = brands.reduce((a, b) => a + b.productCount, 0)

  return (
    <>
      <PageHero
        eyebrow="Tedarik"
        title="Ürün Markaları"
        description={`Katalogda ${formatCount(toplam)} ürün, ${brands.length} markadan geliyor. Listede yalnızca hâlihazırda satışta olan markalar yer alır.`}
        crumbs={crumbs}
      />

      <PageBody>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {brands.map((b) => (
            <Link
              key={b.slug}
              href={`/markalar/${b.slug}`}
              prefetch={false}
              title={`${b.name} markasının ${formatCount(b.productCount)} ürününü görüntüle`}
            >
              <Card interactive className="flex h-full flex-col p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-12 flex-1 items-center rounded-md border border-ink-100 bg-ink-25 px-3 text-[13px] font-bold tracking-wide text-ink-700">
                    {b.name}
                  </span>
                  <ChevronRight size={18} className="mt-3.5 shrink-0 text-ink-400" aria-hidden="true" />
                </div>
                <p className="mt-3.5 text-[13px] text-ink-600">
                  <b className="font-semibold text-ink-900">{formatCount(b.productCount)} ürün</b>
                  {' · '}
                  {b.categories.length} kategori
                </p>
                <p className="mt-1.5 line-clamp-2 text-[12.5px] text-ink-400">
                  {b.categories.join(' · ')}
                </p>
              </Card>
            </Link>
          ))}
        </div>

        {brands.length === 0 ? (
          <Card className="p-8 text-center text-sm text-ink-600">
            Katalogda henüz satışta olan bir marka bulunmuyor.
          </Card>
        ) : null}
      </PageBody>
    </>
  )
}
