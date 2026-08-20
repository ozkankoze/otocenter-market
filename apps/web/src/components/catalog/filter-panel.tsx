'use client'

import * as React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { Check, SlidersHorizontal, X, RotateCcw } from 'lucide-react'
import { cn, formatCount, formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { countActive, type ListingFacets, type ListingFilters } from '@/features/catalog/listing-types'

type Props = {
  facets: ListingFacets
  filters: ListingFilters
  total: number
  hasVehicle: boolean
}

/** URL'i tek yerden yöneten yardımcı — masaüstü panel ve mobil drawer aynı mantığı kullanır. */
function useFilterUrl() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return React.useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString())
      mutate(params)
      params.delete('sayfa') // filtre değişince ilk sayfaya dön
      const query = params.toString()
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    },
    [router, pathname, searchParams],
  )
}

function toggleInParam(params: URLSearchParams, key: string, value: string) {
  const current = (params.get(key) ?? '').split(',').filter(Boolean)
  const next = current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value]
  if (next.length) params.set(key, next.join(','))
  else params.delete(key)
}

export function FilterPanel({ facets, filters, total, hasVehicle }: Props) {
  return (
    <>
      {/* Masaüstü sol panel */}
      <aside
        className="hidden w-[268px] shrink-0 lg:block"
        aria-label="Filtreler"
        data-testid="filter-panel"
      >
        <FilterContent facets={facets} filters={filters} hasVehicle={hasVehicle} />
      </aside>

      {/* Mobil tetikleyici + drawer */}
      <MobileFilters facets={facets} filters={filters} total={total} hasVehicle={hasVehicle} />
    </>
  )
}

function FilterContent({
  facets,
  filters,
  hasVehicle,
  onApplied,
}: {
  facets: ListingFacets
  filters: ListingFilters
  hasVehicle: boolean
  onApplied?: () => void
}) {
  const setUrl = useFilterUrl()
  const [brandQuery, setBrandQuery] = React.useState('')
  const [priceMin, setPriceMin] = React.useState(filters.priceMin?.toString() ?? '')
  const [priceMax, setPriceMax] = React.useState(filters.priceMax?.toString() ?? '')

  const visibleBrands = brandQuery
    ? facets.brands.filter((b) =>
        b.name.toLocaleLowerCase('tr').includes(brandQuery.toLocaleLowerCase('tr')),
      )
    : facets.brands

  function apply(mutate: (p: URLSearchParams) => void) {
    setUrl(mutate)
    onApplied?.()
  }

  return (
    <div className="space-y-5">
      {/* Uyumluluk — yalnızca araç seçiliyse */}
      {hasVehicle && facets.compatibility ? (
        <Group title="Uyumluluk">
          <CheckRow
            checked={filters.compatibleOnly}
            count={facets.compatibility.compatible}
            onChange={() =>
              apply((p) => {
                if (filters.compatibleOnly) p.delete('uyumlu')
                else p.set('uyumlu', '1')
              })
            }
            label={
              <span className="inline-flex items-center gap-1.5">
                <Check size={13} strokeWidth={3} className="text-accent-600" aria-hidden="true" />
                Yalnızca aracıma uygun
              </span>
            }
          />
          {facets.compatibility.unknown > 0 ? (
            <p className="mt-2 text-[11.5px] leading-relaxed text-ink-400">
              {formatCount(facets.compatibility.unknown)} ürünün uyumluluğu teyit edilmemiştir; bu
              ürünler aracınıza uygun olarak işaretlenmez.
            </p>
          ) : null}
        </Group>
      ) : null}

      {/* Marka */}
      {facets.brands.length > 0 ? (
        <Group title="Marka">
          {facets.brands.length > 8 ? (
            <Input
              className="mb-2.5 h-9 text-[13px]"
              placeholder="Marka ara..."
              value={brandQuery}
              onChange={(e) => setBrandQuery(e.target.value)}
              aria-label="Marka ara"
            />
          ) : null}
          <div className="max-h-[240px] space-y-0.5 overflow-y-auto pr-1">
            {visibleBrands.map((b) => (
              <CheckRow
                key={b.slug}
                label={b.name}
                count={b.count}
                checked={filters.brands.includes(b.slug)}
                onChange={() => apply((p) => toggleInParam(p, 'marka', b.slug))}
              />
            ))}
            {visibleBrands.length === 0 ? (
              <p className="py-2 text-[12.5px] text-ink-400">Eşleşen marka yok.</p>
            ) : null}
          </div>
        </Group>
      ) : null}

      {/* Fiyat */}
      <Group title="Fiyat">
        <p className="mb-2.5 text-[12px] text-ink-400">
          {formatPrice(facets.price.min)} – {formatPrice(facets.price.max)}
        </p>
        <div className="flex items-center gap-2">
          <Input
            className="h-9 text-[13px]"
            inputMode="numeric"
            placeholder="En az"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value.replace(/\D/g, ''))}
            aria-label="En az fiyat"
          />
          <span className="text-ink-400">–</span>
          <Input
            className="h-9 text-[13px]"
            inputMode="numeric"
            placeholder="En çok"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value.replace(/\D/g, ''))}
            aria-label="En çok fiyat"
          />
        </div>
        <Button
          size="sm"
          variant="secondary"
          block
          className="mt-2.5"
          onClick={() =>
            apply((p) => {
              if (priceMin) p.set('fiyat_min', priceMin)
              else p.delete('fiyat_min')
              if (priceMax) p.set('fiyat_max', priceMax)
              else p.delete('fiyat_max')
            })
          }
        >
          Uygula
        </Button>
      </Group>

      {/* Stok */}
      <Group title="Stok Durumu">
        <CheckRow
          label="Stokta olanlar"
          count={facets.stock.inStock}
          checked={filters.inStock}
          onChange={() =>
            apply((p) => {
              if (filters.inStock) p.delete('stok')
              else p.set('stok', '1')
            })
          }
        />
      </Group>

      {/* Teknik özellikler */}
      {facets.specs.map((spec) => (
        <Group key={spec.key} title={spec.unit ? `${spec.label} (${spec.unit})` : spec.label}>
          <div className="space-y-0.5">
            {spec.values.map((v) => (
              <CheckRow
                key={v.value}
                label={v.label}
                count={v.count}
                checked={(filters.specs[spec.key] ?? []).includes(v.value)}
                onChange={() => apply((p) => toggleInParam(p, `o_${spec.key}`, v.value))}
              />
            ))}
          </div>
        </Group>
      ))}
    </div>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-lg border border-ink-100 bg-white p-4"
      data-testid={`filter-group-${title.toLocaleLowerCase('tr').replace(/[^a-z0-9]+/g, '-')}`}
    >
      <h3 className="mb-3 text-[11px] font-bold tracking-wider text-ink-800 uppercase">{title}</h3>
      {children}
    </section>
  )
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: React.ReactNode
  count?: number
  checked: boolean
  onChange: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-sm py-1.5 text-[13.5px] text-ink-800 transition-colors hover:text-brand-600">
      <span
        className={cn(
          'flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[3px] border transition-colors',
          checked ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-200 bg-white',
        )}
        aria-hidden="true"
      >
        {checked ? <Check size={12} strokeWidth={3} /> : null}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {count !== undefined ? (
        <span className="ocm-code shrink-0 text-[11px] text-ink-400">{formatCount(count)}</span>
      ) : null}
    </label>
  )
}

function MobileFilters({ facets, filters, total, hasVehicle }: Props) {
  const [open, setOpen] = React.useState(false)
  const activeCount = countActive(filters)

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="fixed bottom-16 left-1/2 z-30 inline-flex h-11 -translate-x-1/2 items-center gap-2 rounded-full bg-brand-600 px-5 text-[13.5px] font-semibold text-white shadow-lg lg:hidden"
          data-testid="mobile-filter-trigger"
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          Filtrele
          {activeCount > 0 ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold text-brand-600">
              {activeCount}
            </span>
          ) : null}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-90 bg-brand-900/50 lg:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-100 flex max-h-[90vh] flex-col rounded-t-xl bg-ink-25 lg:hidden"
          data-testid="mobile-filter-drawer"
        >
          <div className="flex items-center justify-between border-b border-ink-100 bg-white px-4 py-4">
            <Dialog.Title className="text-base font-semibold text-ink-900">Filtreler</Dialog.Title>
            <Dialog.Close className="rounded-md p-1.5 text-ink-400" aria-label="Kapat">
              <X size={18} />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <FilterContent
              facets={facets}
              filters={filters}
              hasVehicle={hasVehicle}
              onApplied={() => undefined}
            />
          </div>

          <div className="flex gap-2 border-t border-ink-100 bg-white px-4 py-3">
            <ClearButton className="flex-1" />
            <Button block className="flex-[2]" onClick={() => setOpen(false)}>
              {formatCount(total)} ürünü göster
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function ClearButton({ className }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <Button
      variant="secondary"
      className={className}
      onClick={() => router.push(pathname, { scroll: false })}
    >
      <RotateCcw size={14} aria-hidden="true" />
      Temizle
    </Button>
  )
}

/** Uygulanan filtreleri çip olarak gösterir — tek tıkla kaldırılabilir. */
export function ActiveFilterChips({
  filters,
  facets,
}: {
  filters: ListingFilters
  facets: ListingFacets
}) {
  const setUrl = useFilterUrl()
  const chips: Array<{ key: string; label: string; remove: (p: URLSearchParams) => void }> = []

  for (const slug of filters.brands) {
    const brand = facets.brands.find((b) => b.slug === slug)
    chips.push({
      key: `marka-${slug}`,
      label: brand?.name ?? slug,
      remove: (p) => toggleInParam(p, 'marka', slug),
    })
  }
  if (filters.priceMin !== null || filters.priceMax !== null) {
    chips.push({
      key: 'fiyat',
      label: `${filters.priceMin ?? 0} – ${filters.priceMax ?? '∞'} ₺`,
      remove: (p) => {
        p.delete('fiyat_min')
        p.delete('fiyat_max')
      },
    })
  }
  if (filters.inStock) {
    chips.push({ key: 'stok', label: 'Stokta olanlar', remove: (p) => p.delete('stok') })
  }
  if (filters.compatibleOnly) {
    chips.push({
      key: 'uyumlu',
      label: 'Yalnızca aracıma uygun',
      remove: (p) => p.delete('uyumlu'),
    })
  }
  for (const [key, values] of Object.entries(filters.specs)) {
    const def = facets.specs.find((s) => s.key === key)
    for (const value of values) {
      chips.push({
        key: `${key}-${value}`,
        label: `${def?.label ?? key}: ${value}`,
        remove: (p) => toggleInParam(p, `o_${key}`, value),
      })
    }
  }

  if (chips.length === 0) return null

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2" data-testid="active-filters">
      <span className="text-[12.5px] text-ink-600">Aktif filtreler:</span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => setUrl(chip.remove)}
          className="inline-flex h-7 items-center gap-1.5 rounded-sm border border-brand-300 bg-brand-50 px-2.5 text-[12.5px] font-medium text-brand-700 transition-colors hover:bg-brand-100"
        >
          {chip.label}
          <X size={12} aria-hidden="true" />
        </button>
      ))}
      <ClearButton className="h-7 px-2.5 text-[12.5px]" />
    </div>
  )
}
