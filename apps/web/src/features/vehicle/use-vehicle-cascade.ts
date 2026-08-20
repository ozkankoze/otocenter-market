'use client'

import * as React from 'react'
import type {
  VehicleBrandOption,
  VehicleEngineOption,
  VehicleModelOption,
  VehicleSelection,
  VehicleTypeOption,
} from './types'

export type CascadeStep = 'type' | 'brand' | 'model' | 'engine'
export type StepStatus = 'idle' | 'loading' | 'error'

type Options<T> = { items: T[]; status: StepStatus }

export type VehicleCascade = {
  types: VehicleTypeOption[]
  brands: Options<VehicleBrandOption>
  models: Options<VehicleModelOption>
  engines: Options<VehicleEngineOption>

  selected: {
    typeId: number | null
    brandId: number | null
    modelId: number | null
    engineId: number | null
  }
  labels: { type: string; brand: string; model: string; engine: string }

  /** Şu an hangi adım doldurulmalı */
  activeStep: CascadeStep
  isComplete: boolean
  submitting: boolean
  submitError: string | null

  selectType: (id: number | null) => void
  selectBrand: (id: number | null) => void
  selectModel: (id: number | null) => void
  selectEngine: (id: number | null) => void
  retry: (step: Exclude<CascadeStep, 'type'>) => void
  reset: () => void
  submit: () => Promise<boolean>
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`İstek başarısız: ${res.status}`)
  return (await res.json()) as T
}

/**
 * Araç seçicinin tüm mantığı — sunum bileşenlerinden bağımsız.
 * Hem masaüstü dropdown'ları hem mobil bottom-sheet aynı hook'u kullanır,
 * böylece davranış iki yerde ayrışamaz.
 */
export function useVehicleCascade(
  types: VehicleTypeOption[],
  initial?: VehicleSelection | null,
): VehicleCascade {
  const [typeId, setTypeId] = React.useState<number | null>(initial?.typeId ?? null)
  const [brandId, setBrandId] = React.useState<number | null>(initial?.brandId ?? null)
  const [modelId, setModelId] = React.useState<number | null>(initial?.modelId ?? null)
  const [engineId, setEngineId] = React.useState<number | null>(initial?.engineId ?? null)

  const [brands, setBrands] = React.useState<Options<VehicleBrandOption>>({
    items: [],
    status: 'idle',
  })
  const [models, setModels] = React.useState<Options<VehicleModelOption>>({
    items: [],
    status: 'idle',
  })
  const [engines, setEngines] = React.useState<Options<VehicleEngineOption>>({
    items: [],
    status: 'idle',
  })

  const [submitting, setSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)

  const loadBrands = React.useCallback(async (id: number) => {
    setBrands({ items: [], status: 'loading' })
    try {
      const data = await fetchJson<{ brands: VehicleBrandOption[] }>(
        `/api/vehicles/brands?typeId=${id}`,
      )
      setBrands({ items: data.brands, status: 'idle' })
    } catch {
      setBrands({ items: [], status: 'error' })
    }
  }, [])

  const loadModels = React.useCallback(async (id: number) => {
    setModels({ items: [], status: 'loading' })
    try {
      const data = await fetchJson<{ models: VehicleModelOption[] }>(
        `/api/vehicles/models?brandId=${id}`,
      )
      setModels({ items: data.models, status: 'idle' })
    } catch {
      setModels({ items: [], status: 'error' })
    }
  }, [])

  const loadEngines = React.useCallback(async (id: number) => {
    setEngines({ items: [], status: 'loading' })
    try {
      const data = await fetchJson<{ engines: VehicleEngineOption[] }>(
        `/api/vehicles/engines?modelId=${id}`,
      )
      setEngines({ items: data.engines, status: 'idle' })
    } catch {
      setEngines({ items: [], status: 'error' })
    }
  }, [])

  // Kayıtlı seçim varsa listeleri geri doldur
  React.useEffect(() => {
    if (!initial) return
    void loadBrands(initial.typeId)
    void loadModels(initial.brandId)
    void loadEngines(initial.modelId)
  }, [initial, loadBrands, loadModels, loadEngines])

  const selectType = React.useCallback(
    (id: number | null) => {
      setTypeId(id)
      setBrandId(null)
      setModelId(null)
      setEngineId(null)
      setModels({ items: [], status: 'idle' })
      setEngines({ items: [], status: 'idle' })
      setSubmitError(null)
      if (id) void loadBrands(id)
      else setBrands({ items: [], status: 'idle' })
    },
    [loadBrands],
  )

  const selectBrand = React.useCallback(
    (id: number | null) => {
      setBrandId(id)
      setModelId(null)
      setEngineId(null)
      setEngines({ items: [], status: 'idle' })
      if (id) void loadModels(id)
      else setModels({ items: [], status: 'idle' })
    },
    [loadModels],
  )

  const selectModel = React.useCallback(
    (id: number | null) => {
      setModelId(id)
      setEngineId(null)
      if (id) void loadEngines(id)
      else setEngines({ items: [], status: 'idle' })
    },
    [loadEngines],
  )

  const retry = React.useCallback(
    (step: Exclude<CascadeStep, 'type'>) => {
      if (step === 'brand' && typeId) void loadBrands(typeId)
      if (step === 'model' && brandId) void loadModels(brandId)
      if (step === 'engine' && modelId) void loadEngines(modelId)
    },
    [typeId, brandId, modelId, loadBrands, loadModels, loadEngines],
  )

  const reset = React.useCallback(() => {
    setTypeId(null)
    setBrandId(null)
    setModelId(null)
    setEngineId(null)
    setBrands({ items: [], status: 'idle' })
    setModels({ items: [], status: 'idle' })
    setEngines({ items: [], status: 'idle' })
    setSubmitError(null)
  }, [])

  const submit = React.useCallback(async () => {
    if (!engineId) return false
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/vehicles/select', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engineId }),
      })
      if (!res.ok) {
        setSubmitError('Araç kaydedilemedi. Lütfen tekrar deneyin.')
        return false
      }
      return true
    } catch {
      setSubmitError('Bağlantı hatası. İnternet bağlantınızı kontrol edip tekrar deneyin.')
      return false
    } finally {
      setSubmitting(false)
    }
  }, [engineId])

  const labels = {
    type: types.find((t) => t.id === typeId)?.name ?? '',
    brand: brands.items.find((b) => b.id === brandId)?.name ?? initial?.brandName ?? '',
    model: models.items.find((m) => m.id === modelId)?.name ?? initial?.modelName ?? '',
    engine: engines.items.find((e) => e.id === engineId)?.name ?? initial?.engineName ?? '',
  }

  const activeStep: CascadeStep = !typeId
    ? 'type'
    : !brandId
      ? 'brand'
      : !modelId
        ? 'model'
        : 'engine'

  return {
    types,
    brands,
    models,
    engines,
    selected: { typeId, brandId, modelId, engineId },
    labels,
    activeStep,
    isComplete: Boolean(engineId),
    submitting,
    submitError,
    selectType,
    selectBrand,
    selectModel,
    selectEngine: setEngineId,
    retry,
    reset,
    submit,
  }
}
