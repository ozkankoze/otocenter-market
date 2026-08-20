'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { LayoutGrid, ArrowUpDown } from 'lucide-react'
import { formatCount } from '@/lib/utils'
import { SORT_OPTIONS, type SortKey } from '@/features/catalog/listing-types'

export function ListingToolbar({ total, sort }: { total: number; sort: SortKey }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function onSortChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'onerilen') params.delete('siralama')
    else params.set('siralama', value)
    params.delete('sayfa')
    const q = params.toString()
    router.push(q ? `${pathname}?${q}` : pathname, { scroll: false })
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-ink-100 bg-white px-4 py-3">
      <span className="inline-flex items-center gap-2 text-[13.5px] text-ink-600">
        <LayoutGrid size={15} className="text-ink-400" aria-hidden="true" />
        <b className="font-semibold text-ink-900" data-testid="listing-total">
          {formatCount(total)}
        </b>
        ürün
      </span>

      <label className="ml-auto inline-flex items-center gap-2 text-[13px] text-ink-600">
        <ArrowUpDown size={14} className="text-ink-400" aria-hidden="true" />
        <span className="hidden sm:inline">Sıralama</span>
        <select
          className="h-9 rounded-md border border-ink-200 bg-white pr-8 pl-3 text-[13px] text-ink-900 focus:border-brand-600 focus:ring-3 focus:ring-brand-600/12 focus:outline-none"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sıralama"
          data-testid="sort-select"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
