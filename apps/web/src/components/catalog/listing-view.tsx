import Link from 'next/link'
import { Breadcrumb, type Crumb } from '@/components/ui/breadcrumb'
import { ProductCard } from '@/components/product/product-card'
import { SelectedVehicleBar } from '@/components/vehicle/selected-vehicle-bar'
import { FilterPanel, ActiveFilterChips } from './filter-panel'
import { ListingToolbar } from './listing-toolbar'
import { Pagination } from './pagination'
import { EmptyListing } from './empty-listing'
import {
  countActive,
  type ListingResult,
  type ListingFilters,
  type SortKey,
} from '@/features/catalog/listing-types'
import type { VehicleSelection } from '@/features/vehicle/types'

/**
 * Ortak liste görünümü — kategori sayfaları ve araç sonuç sayfaları aynı
 * bileşeni kullanır; böylece filtre/sıralama/sayfalama davranışı ayrışmaz.
 */
export function ListingView({
  crumbs,
  eyebrow,
  title,
  subtitle,
  intro,
  result,
  filters,
  sort,
  selection,
  engineCodes,
  relatedLinks,
}: {
  crumbs: Crumb[]
  eyebrow: string
  title: string
  subtitle?: string
  intro?: string | null
  result: ListingResult
  filters: ListingFilters
  sort: SortKey
  selection: VehicleSelection | null
  engineCodes?: string[]
  relatedLinks?: Array<{ label: string; href: string; count?: number }>
}) {
  return (
    <div className="ocm-container py-6 md:py-8">
      <Breadcrumb items={crumbs} />

      <header className="mb-5">
        <span className="ocm-eyebrow">{eyebrow}</span>
        <h1 className="mt-2 text-[24px] font-bold tracking-tight text-ink-900 md:text-[30px]">
          {title}
        </h1>
        {subtitle ? <p className="mt-1.5 text-sm text-ink-600">{subtitle}</p> : null}
      </header>

      {selection ? (
        <div className="mb-5">
          <SelectedVehicleBar selection={selection} engineCodes={engineCodes} />
        </div>
      ) : null}

      {relatedLinks && relatedLinks.length > 0 ? (
        <nav className="ocm-noscrollbar mb-5 flex gap-2 overflow-x-auto" aria-label="Alt kategoriler">
          {relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch={false}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-sm border border-ink-100 bg-white px-3 text-[12.5px] font-medium text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-600"
            >
              {link.label}
              {link.count !== undefined ? (
                <b className="font-bold text-ink-400">{link.count}</b>
              ) : null}
            </Link>
          ))}
        </nav>
      ) : null}

      <div className="flex gap-6">
        <FilterPanel
          facets={result.facets}
          filters={filters}
          total={result.total}
          hasVehicle={Boolean(selection)}
        />

        <div className="min-w-0 flex-1">
          <ListingToolbar total={result.total} sort={sort} />
          <ActiveFilterChips filters={filters} facets={result.facets} />

          {/*
            Boş durum metni, sonucun boş OLMA NEDENİNE göre değişir:
            filtre uygulanmışsa "filtreleri gevşetin", hiç filtre yoksa
            "bu kategoriye henüz ürün eklenmemiştir". Daha önce burada
            `result.total === 0` vardı; bu, filtresiz boş katalogda da
            yanlışlıkla filtre mesajı gösteriyordu.
          */}
          {result.products.length === 0 ? (
            <EmptyListing hasFilters={countActive(filters) > 0} hasVehicle={Boolean(selection)} />
          ) : (
            <>
              <div
                className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4"
                data-testid="product-grid"
              >
                {result.products.map((p) => (
                  <ProductCard key={p.id} product={p} hasVehicle={Boolean(selection)} />
                ))}
              </div>
              <Pagination page={result.page} pageSize={result.pageSize} total={result.total} />
            </>
          )}

          {intro ? (
            <section className="mt-10 rounded-lg border border-ink-100 bg-white p-6">
              <h2 className="mb-2 text-base font-semibold text-ink-900">{title} Hakkında</h2>
              <p className="max-w-[760px] text-sm leading-relaxed text-ink-600">{intro}</p>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  )
}
