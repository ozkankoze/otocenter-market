import Link from 'next/link'
import { Check, Info, X } from 'lucide-react'
import { cn, formatCount } from '@/lib/utils'
import type { CompatibleVehicleRow } from '@/server/product-queries'

const STATUS_VIEW = {
  VERIFIED: {
    label: 'Doğrulandı',
    className: 'bg-accent-100 text-accent-700',
    icon: <Check size={11} strokeWidth={3} aria-hidden="true" />,
  },
  SOURCED: {
    label: 'Uyumlu',
    className: 'bg-accent-100 text-accent-700',
    icon: <Check size={11} strokeWidth={3} aria-hidden="true" />,
  },
  CONFLICTED: {
    label: 'Teyit edilmedi',
    className: 'bg-ink-50 text-ink-600',
    icon: <Info size={11} aria-hidden="true" />,
  },
  INCOMPATIBLE: {
    label: 'Uygun değil',
    className: 'bg-[#FBEAE8] text-danger',
    icon: <X size={11} strokeWidth={3} aria-hidden="true" />,
  },
} as const

export function CompatibleVehiclesTable({
  rows,
  total,
  brands,
  productSlug,
  activeBrand,
  shown,
}: {
  rows: CompatibleVehicleRow[]
  total: number
  brands: Array<{ slug: string; name: string; count: number }>
  productSlug: string
  activeBrand: string | null
  shown: number
}) {
  return (
    <div data-testid="compatible-vehicles">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <p className="text-[13px] text-ink-600">
          Bu ürün <b className="font-semibold text-ink-900">{formatCount(total)}</b> motor kaydıyla
          eşleştirilmiştir.
        </p>
        <div className="ocm-noscrollbar ml-auto flex gap-2 overflow-x-auto">
          <BrandChip href={`/urun/${productSlug}`} active={!activeBrand} label="Tümü" />
          {brands.slice(0, 6).map((b) => (
            <BrandChip
              key={b.slug}
              href={`/urun/${productSlug}?arac_marka=${b.slug}`}
              active={activeBrand === b.slug}
              label={b.name}
              count={b.count}
            />
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-ink-100 bg-white">
        <table className="w-full text-left text-[13.5px]">
          <thead>
            <tr className="border-b border-ink-100 bg-ink-25">
              <Th>Marka</Th>
              <Th>Model</Th>
              <Th>Motor</Th>
              <Th>Yıl</Th>
              <Th>Durum</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const view = STATUS_VIEW[r.status]
              return (
                <tr key={`${r.engineSlug}-${i}`} className="border-b border-ink-50 last:border-0">
                  <td className="px-4 py-2.5 font-medium text-ink-800">{r.brandName}</td>
                  <td className="px-4 py-2.5 text-ink-700">
                    <Link
                      href={`/${r.typeSlug}/${r.brandSlug}/${r.modelSlug}`}
                      prefetch={false}
                      className="transition-colors hover:text-brand-600"
                    >
                      {r.modelName}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-ink-700">
                    <Link
                      href={`/${r.typeSlug}/${r.brandSlug}/${r.modelSlug}/${r.engineSlug}`}
                      prefetch={false}
                      className="transition-colors hover:text-brand-600"
                    >
                      {r.engineName}
                    </Link>
                    {r.restriction ? (
                      <span className="ml-1.5 text-[11.5px] text-ink-400">({r.restriction})</span>
                    ) : null}
                  </td>
                  <td className="ocm-code px-4 py-2.5 text-[12px]">{r.years || '—'}</td>
                  <td className="px-4 py-2.5">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[11.5px] font-medium',
                        view.className,
                      )}
                    >
                      {view.icon}
                      {view.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {shown < total ? (
        <p className="mt-3 text-center text-[12.5px] text-ink-600">
          {formatCount(total)} kayıttan ilk {formatCount(shown)} tanesi gösteriliyor. Marka seçerek
          daraltabilirsiniz.
        </p>
      ) : null}
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2.5 text-[11px] font-semibold tracking-wider text-ink-600 uppercase">
      {children}
    </th>
  )
}

function BrandChip({
  href,
  active,
  label,
  count,
}: {
  href: string
  active: boolean
  label: string
  count?: number
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      scroll={false}
      className={cn(
        'inline-flex h-7 shrink-0 items-center gap-1.5 rounded-sm border px-2.5 text-[12px] font-medium transition-colors',
        active
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-ink-100 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-600',
      )}
    >
      {label}
      {count !== undefined ? (
        <b className={active ? 'font-bold text-white' : 'font-bold text-ink-400'}>{count}</b>
      ) : null}
    </Link>
  )
}
