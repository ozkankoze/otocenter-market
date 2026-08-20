'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Check, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useVehicleUi } from './vehicle-ui-provider'
import type { VehicleSelection } from '@/features/vehicle/types'

/**
 * Seçili araç şeridi — "araç hafızası" vaadinin görsel çapası.
 * Liste ve ürün detay sayfalarında da kullanılacak (Faz 2).
 */
export function SelectedVehicleBar({
  selection,
  engineCodes,
}: {
  selection: VehicleSelection
  engineCodes?: string[]
}) {
  const router = useRouter()
  const { openSelector } = useVehicleUi()
  const [busy, setBusy] = React.useState(false)

  async function clear() {
    setBusy(true)
    try {
      await fetch('/api/vehicles/select', { method: 'DELETE' })
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="flex flex-wrap items-center gap-4 rounded-lg border border-[#BFE5D1] bg-accent-100 px-4 py-3.5"
      data-testid="selected-vehicle-bar"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-accent-700">
        <Car size={21} strokeWidth={1.9} aria-hidden="true" />
      </span>

      <span className="min-w-0">
        <b className="flex items-center gap-1.5 text-[13px] font-semibold text-accent-700">
          <Check size={13} strokeWidth={3} aria-hidden="true" />
          Aracınız seçildi
        </b>
        <span className="block text-sm font-medium text-ink-900">
          {selection.brandName} {selection.modelName} · {selection.engineName}
          {selection.years ? ` · ${selection.years}` : ''}
        </span>
        {engineCodes && engineCodes.length > 0 ? (
          <span className="ocm-code mt-0.5 block text-[11.5px] text-accent-700/80">
            Motor kodu: {engineCodes.join(' · ')}
          </span>
        ) : null}
      </span>

      <span className="ml-auto flex gap-2">
        <Button size="sm" variant="secondary" onClick={openSelector}>
          Aracı Değiştir
        </Button>
        <Button size="sm" variant="ghost" disabled={busy} onClick={() => void clear()}>
          Kaldır ✕
        </Button>
      </span>
    </div>
  )
}
