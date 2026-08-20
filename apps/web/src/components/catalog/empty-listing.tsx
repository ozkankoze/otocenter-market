'use client'

import { SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClearButton } from './filter-panel'
import { useVehicleUi } from '@/components/vehicle/vehicle-ui-provider'

export function EmptyListing({
  hasFilters,
  hasVehicle,
}: {
  hasFilters: boolean
  hasVehicle: boolean
}) {
  const { openSelector } = useVehicleUi()

  return (
    <div className="rounded-lg border border-dashed border-ink-200 bg-white px-6 py-16 text-center">
      <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ink-50 text-ink-400">
        <SearchX size={22} aria-hidden="true" />
      </span>
      <p className="text-base font-semibold text-ink-900">
        {hasFilters ? 'Bu filtrelerle eşleşen ürün yok' : 'Gösterilecek ürün bulunamadı'}
      </p>
      <p className="mx-auto mt-2 max-w-[440px] text-sm text-ink-600">
        {hasFilters
          ? hasVehicle
            ? 'Filtreleri gevşetebilir, farklı bir araç seçebilir ya da parça kodu / OEM numarası ile arayabilirsiniz.'
            : 'Filtreleri gevşetebilir veya parça kodu / OEM numarası ile arayabilirsiniz.'
          : 'Bu kategoriye henüz ürün eklenmemiştir.'}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {/* Temizlenecek filtre yoksa buton gösterilmez */}
        {hasFilters ? <ClearButton /> : null}
        {hasVehicle ? (
          <Button variant="ghost" onClick={openSelector}>
            Aracı Değiştir
          </Button>
        ) : null}
      </div>
    </div>
  )
}
