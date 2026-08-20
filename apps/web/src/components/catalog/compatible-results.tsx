'use client'

import * as React from 'react'
import { Check, Info } from 'lucide-react'
import { cn, formatCount } from '@/lib/utils'
import { ProductCard } from '@/components/product/product-card'
import { Button } from '@/components/ui/button'
import { useVehicleUi } from '@/components/vehicle/vehicle-ui-provider'
import type { ProductCardData } from '@/features/catalog/product-types'
import type { VehicleSelection } from '@/features/vehicle/types'

/**
 * Araç seçildikten sonraki sonuç deneyimi.
 * Kategori çipleri istemcide filtreler — sunucuya gitmeden anında daralt.
 */
export function CompatibleResults({
  products,
  selection,
  summary,
}: {
  products: ProductCardData[]
  selection: VehicleSelection | null
  summary: Array<{ categoryId: number; categoryCode: string; categoryName: string; count: number }>
}) {
  const { openSelector } = useVehicleUi()
  const [activeCategory, setActiveCategory] = React.useState<string>('ALL')

  const hasVehicle = Boolean(selection)
  const compatibleCount = summary.reduce((acc, s) => acc + s.count, 0)

  const visible = React.useMemo(
    () =>
      activeCategory === 'ALL'
        ? products
        : products.filter((p) => p.categoryCode === activeCategory),
    [products, activeCategory],
  )

  const unknownCount = products.filter((p) => hasVehicle && p.compatibility === 'unknown').length

  if (hasVehicle && products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-ink-200 bg-white px-6 py-14 text-center">
        <p className="text-base font-semibold text-ink-900">
          Bu araç için henüz uyumlu ürün eklenmedi
        </p>
        <p className="mx-auto mt-2 max-w-[460px] text-sm text-ink-600">
          Katalogumuz sürekli genişliyor. Farklı bir motor seçebilir ya da parça kodu / OEM numarası
          ile arama yapabilirsiniz.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="secondary" onClick={openSelector}>
            Aracı Değiştir
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      {hasVehicle ? (
        <div
          className="mb-5 rounded-lg border border-ink-100 bg-white px-5 py-4"
          data-testid="result-bar"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="inline-flex items-center gap-2 text-[13px] text-ink-600">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                <Check size={12} strokeWidth={3} aria-hidden="true" />
              </span>
              Aracınıza uygun{' '}
              <b className="font-semibold text-ink-900" data-testid="result-total">
                {formatCount(compatibleCount)}
              </b>{' '}
              ürün bulundu
            </span>

            <div className="ml-auto flex flex-wrap gap-2">
              <Chip
                active={activeCategory === 'ALL'}
                onClick={() => setActiveCategory('ALL')}
                label="Tümü"
                count={compatibleCount}
              />
              {summary.slice(0, 5).map((s) => (
                <Chip
                  key={s.categoryId}
                  active={activeCategory === s.categoryCode}
                  onClick={() => setActiveCategory(s.categoryCode)}
                  label={s.categoryName}
                  count={s.count}
                />
              ))}
            </div>
          </div>

          {unknownCount > 0 ? (
            <p className="mt-3 flex items-start gap-2 border-t border-ink-50 pt-3 text-[12.5px] text-ink-600">
              <Info size={14} className="mt-px shrink-0 text-ink-400" aria-hidden="true" />
              <span>
                Listede uyumluluğu <b className="font-semibold">teyit edilmemiş</b> {unknownCount}{' '}
                ürün var. Bunlar aracınıza uygun olarak işaretlenmez; kaynaklarımız çeliştiğinde ya
                da veri eksik olduğunda bilinçli olarak gri gösterilir.
              </span>
            </p>
          ) : null}
        </div>
      ) : null}

      {visible.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink-200 bg-white px-6 py-12 text-center">
          <p className="text-sm font-medium text-ink-900">Bu kategoride gösterilecek ürün yok</p>
          <button
            type="button"
            onClick={() => setActiveCategory('ALL')}
            className="mt-3 text-[13px] font-semibold text-brand-600 hover:underline"
          >
            Tüm ürünleri göster
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} hasVehicle={hasVehicle} />
            ))}
          </div>
          {hasVehicle && compatibleCount > products.length ? (
            <p className="mt-4 text-center text-[13px] text-ink-600">
              {formatCount(compatibleCount)} uyumlu üründen ilk {products.length} tanesi
              gösteriliyor. <span className="font-semibold text-brand-600">Tümünü gör →</span>
            </p>
          ) : null}
        </>
      )}
    </>
  )
}

function Chip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  label: string
  count: number
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-sm border px-3 text-[12.5px] font-medium transition-colors duration-150',
        active
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-ink-100 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-600',
      )}
    >
      {label}
      <b className={cn('font-bold', active ? 'text-white' : 'text-ink-400')}>{count}</b>
    </button>
  )
}
