'use client'

import * as React from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductReferenceView } from '@/server/product-queries'

const TYPE_LABELS: Record<ProductReferenceView['type'], string> = {
  OEM: 'OEM numarası',
  CROSS_EQUIVALENT: 'Muadil',
  CROSS_REPLACES: 'Yerine geçtiği kod',
  CROSS_REPLACED_BY: 'Yerine geçen kod',
}

/**
 * OEM ve çapraz referans tablosu.
 * Kodlar monospace ve tek tıkla kopyalanabilir — usta senaryosunun merkezinde.
 */
export function ReferenceTable({
  references,
  type,
}: {
  references: ProductReferenceView[]
  type: 'OEM' | 'CROSS'
}) {
  const [copied, setCopied] = React.useState<string | null>(null)

  const rows = references.filter((r) => (type === 'OEM' ? r.type === 'OEM' : r.type !== 'OEM'))
  if (rows.length === 0) return null

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(value)
      setTimeout(() => setCopied(null), 1600)
    } catch {
      /* pano erişimi yoksa sessizce geç */
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-ink-100 bg-white">
      <table className="w-full text-left text-[13.5px]" data-testid={`reference-table-${type}`}>
        <thead>
          <tr className="border-b border-ink-100 bg-ink-25">
            <th className="px-4 py-2.5 text-[11px] font-semibold tracking-wider text-ink-600 uppercase">
              {type === 'OEM' ? 'Araç markası' : 'Üretici'}
            </th>
            <th className="px-4 py-2.5 text-[11px] font-semibold tracking-wider text-ink-600 uppercase">
              Numara
            </th>
            <th className="px-4 py-2.5 text-[11px] font-semibold tracking-wider text-ink-600 uppercase">
              Tür
            </th>
            <th className="w-10" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={`${r.number}-${i}`} className="border-b border-ink-50 last:border-0">
              <td className="px-4 py-2.5 font-medium text-ink-800">{r.brandName ?? '—'}</td>
              <td className="ocm-code px-4 py-2.5 text-[13px] text-ink-900">{r.number}</td>
              <td className="px-4 py-2.5 text-[12.5px] text-ink-600">
                {TYPE_LABELS[r.type]}
                {r.note ? <span className="text-ink-400"> · {r.note}</span> : null}
              </td>
              <td className="px-2 py-2.5">
                <button
                  type="button"
                  onClick={() => void copy(r.number)}
                  aria-label={`${r.number} numarasını kopyala`}
                  className={cn(
                    'rounded p-1.5 transition-colors',
                    copied === r.number
                      ? 'text-accent-600'
                      : 'text-ink-400 hover:bg-ink-50 hover:text-brand-600',
                  )}
                >
                  {copied === r.number ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
