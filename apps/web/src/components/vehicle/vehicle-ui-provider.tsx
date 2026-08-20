'use client'

import * as React from 'react'
import { VehicleDialog } from './vehicle-dialog'
import type { VehicleSelection, VehicleTypeOption } from '@/features/vehicle/types'

type VehicleUiContextValue = {
  openSelector: () => void
  selection: VehicleSelection | null
}

const VehicleUiContext = React.createContext<VehicleUiContextValue | null>(null)

/**
 * Araç seçim diyaloğunu uygulamanın her yerinden açılabilir kılar.
 * Header'daki "Aracı Değiştir", mega menüdeki "Aracımı Seç", mobil alt bardaki
 * "Aracım" ve boş durum ekranları aynı diyaloğu açar.
 */
export function VehicleUiProvider({
  types,
  selection,
  children,
}: {
  types: VehicleTypeOption[]
  selection: VehicleSelection | null
  children: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)

  const value = React.useMemo<VehicleUiContextValue>(
    () => ({ openSelector: () => setOpen(true), selection }),
    [selection],
  )

  return (
    <VehicleUiContext.Provider value={value}>
      {children}
      <VehicleDialog
        open={open}
        onOpenChange={setOpen}
        types={types}
        initialSelection={selection}
      />
    </VehicleUiContext.Provider>
  )
}

export function useVehicleUi(): VehicleUiContextValue {
  const ctx = React.useContext(VehicleUiContext)
  if (!ctx) {
    throw new Error('useVehicleUi yalnızca VehicleUiProvider içinde kullanılabilir.')
  }
  return ctx
}
