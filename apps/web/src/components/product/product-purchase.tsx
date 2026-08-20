'use client'

import * as React from 'react'
import { Minus, Plus, ShoppingCart, Truck, RotateCcw, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn, formatPrice } from '@/lib/utils'
import type { ProductVariantView } from '@/server/product-queries'
import type { CompatibilityState } from '@/features/vehicle/types'

export function ProductPurchase({
  variants,
  compatibility,
}: {
  variants: ProductVariantView[]
  compatibility: CompatibilityState
}) {
  const defaultIndex = Math.max(
    0,
    variants.findIndex((v) => v.isDefault),
  )
  const [index, setIndex] = React.useState(defaultIndex)
  const [qty, setQty] = React.useState(1)

  const variant = variants[index]
  if (!variant) return null

  const outOfStock = variant.stock <= 0
  const lowStock = !outOfStock && variant.stock <= 8
  const incompatible = compatibility === 'incompatible'

  return (
    <div className="mt-5">
      {variants.length > 1 ? (
        <div className="mb-4">
          <span className="mb-2 block text-xs font-semibold text-ink-800">Ambalaj</span>
          <div className="flex flex-wrap gap-2">
            {variants.map((v, i) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-pressed={i === index}
                className={cn(
                  'inline-flex h-9 items-center gap-2 rounded-md border px-3 text-[13px] font-medium transition-colors',
                  i === index
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300',
                )}
              >
                {v.name ?? `${v.packSize} ${v.unit}`}
                {v.stock <= 0 ? <span className="text-[11px] text-ink-400">(tükendi)</span> : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex items-baseline gap-3">
        <span className="text-[30px] font-bold tracking-tight text-ink-900" data-testid="product-price">
          {formatPrice(variant.price)}
        </span>
        {variant.listPrice && variant.listPrice > variant.price ? (
          <span className="text-[15px] text-ink-400 line-through">
            {formatPrice(variant.listPrice)}
          </span>
        ) : null}
      </div>
      <span className="mt-1 block text-[12px] text-ink-400">KDV dahil · %{variant.taxRate} KDV</span>

      <span
        className="mt-3 inline-flex items-center gap-2 text-[13.5px] text-ink-700"
        data-testid="product-stock"
      >
        <span
          className={cn(
            'inline-block h-[8px] w-[8px] rounded-full',
            outOfStock ? 'bg-ink-200' : lowStock ? 'bg-warning' : 'bg-success',
          )}
          aria-hidden="true"
        />
        {outOfStock
          ? variant.leadTimeDays
            ? `Stokta yok · ${variant.leadTimeDays} iş gününde tedarik`
            : 'Stokta yok'
          : lowStock
            ? `Son ${variant.stock} adet`
            : `Stokta (${variant.stock} adet)`}
      </span>

      <div className="mt-5 flex flex-wrap gap-3">
        <div className="inline-flex h-13 items-center rounded-md border border-ink-200 bg-white">
          <button
            type="button"
            className="flex h-full w-11 items-center justify-center text-ink-600 transition-colors hover:text-brand-600 disabled:opacity-40"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Adet azalt"
          >
            <Minus size={16} />
          </button>
          <span className="w-9 text-center text-sm font-semibold text-ink-900" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            className="flex h-full w-11 items-center justify-center text-ink-600 transition-colors hover:text-brand-600"
            onClick={() => setQty((q) => q + 1)}
            aria-label="Adet artır"
          >
            <Plus size={16} />
          </button>
        </div>

        <Button
          size="lg"
          className="min-w-[220px] flex-1"
          disabled={incompatible}
          variant={outOfStock ? 'secondary' : 'primary'}
          data-testid="add-to-cart"
        >
          {incompatible ? (
            'Aracınıza uygun değil'
          ) : outOfStock ? (
            'Gelince Haber Ver'
          ) : (
            <>
              <ShoppingCart size={18} aria-hidden="true" />
              SEPETE EKLE
            </>
          )}
        </Button>
      </div>

      <ul className="mt-5 space-y-2 border-t border-ink-50 pt-4 text-[12.5px] text-ink-600">
        <li className="flex items-center gap-2">
          <Truck size={14} className="text-ink-400" aria-hidden="true" />
          500 ₺ üzeri siparişlerde kargo ücretsiz
        </li>
        <li className="flex items-center gap-2">
          <RotateCcw size={14} className="text-ink-400" aria-hidden="true" />
          14 gün içinde koşulsuz iade
        </li>
        <li className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-ink-400" aria-hidden="true" />
          Yetkili distribütör kanalından tedarik
        </li>
      </ul>
    </div>
  )
}
