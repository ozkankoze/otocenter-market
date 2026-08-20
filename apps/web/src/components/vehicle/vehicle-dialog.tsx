'use client'

import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import { Check, ChevronRight, Search, X, RotateCw, Car } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useVehicleCascade, type CascadeStep } from '@/features/vehicle/use-vehicle-cascade'
import type { VehicleSelection, VehicleTypeOption } from '@/features/vehicle/types'

const STEP_ORDER: CascadeStep[] = ['type', 'brand', 'model', 'engine']
const STEP_TITLES: Record<CascadeStep, string> = {
  type: 'Araç tipini seçin',
  brand: 'Marka seçin',
  model: 'Model seçin',
  engine: 'Motor seçin',
}

/**
 * Araç seçim diyaloğu.
 *  · Mobilde  → alttan açılan bottom-sheet, adım adım liste
 *  · Masaüstünde → ortalanmış modal, aynı adım listesi
 *
 * Aynı içerik iki farklı kapta sunulur; davranış tek yerde tanımlı olduğu için
 * iki deneyim zamanla ayrışamaz.
 */
export function VehicleDialog({
  open,
  onOpenChange,
  types,
  initialSelection,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  types: VehicleTypeOption[]
  initialSelection: VehicleSelection | null
}) {
  const router = useRouter()
  const cascade = useVehicleCascade(types, initialSelection)
  const [step, setStep] = React.useState<CascadeStep>('type')
  const [query, setQuery] = React.useState('')

  // Diyalog her açıldığında ilk eksik adımdan başla
  React.useEffect(() => {
    if (open) {
      setStep(cascade.activeStep)
      setQuery('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const stepIndex = STEP_ORDER.indexOf(step)

  function goToStep(next: CascadeStep) {
    setStep(next)
    setQuery('')
  }

  function onPick(value: number) {
    if (step === 'type') {
      cascade.selectType(value)
      goToStep('brand')
    } else if (step === 'brand') {
      cascade.selectBrand(value)
      goToStep('model')
    } else if (step === 'model') {
      cascade.selectModel(value)
      goToStep('engine')
    } else {
      cascade.selectEngine(value)
    }
  }

  async function onSubmit() {
    const ok = await cascade.submit()
    if (ok) {
      onOpenChange(false)
      router.refresh()
    }
  }

  const list = (() => {
    if (step === 'type') {
      return {
        status: 'idle' as const,
        items: cascade.types.map((t) => ({ id: t.id, label: t.name, hint: '' })),
      }
    }
    if (step === 'brand') {
      return {
        status: cascade.brands.status,
        items: cascade.brands.items.map((b) => ({
          id: b.id,
          label: b.name,
          hint: b.isPopular ? 'Popüler' : '',
        })),
      }
    }
    if (step === 'model') {
      return {
        status: cascade.models.status,
        items: cascade.models.items.map((m) => ({ id: m.id, label: m.label, hint: '' })),
      }
    }
    return {
      status: cascade.engines.status,
      items: cascade.engines.items.map((e) => ({ id: e.id, label: e.name, hint: e.years })),
    }
  })()

  const filtered = query
    ? list.items.filter((i) =>
        i.label.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr')),
      )
    : list.items

  const selectedId =
    step === 'type'
      ? cascade.selected.typeId
      : step === 'brand'
        ? cascade.selected.brandId
        : step === 'model'
          ? cascade.selected.modelId
          : cascade.selected.engineId

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out fixed inset-0 z-90 bg-brand-900/50 backdrop-blur-[2px]" />
        <Dialog.Content
          aria-describedby={undefined}
          className={cn(
            'fixed z-100 flex flex-col bg-white shadow-lg',
            // Mobil: bottom sheet
            'inset-x-0 bottom-0 max-h-[88vh] rounded-t-xl',
            // Masaüstü: ortalanmış modal
            'sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:max-h-[80vh] sm:w-[560px]',
            'sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl',
          )}
          data-testid="vehicle-dialog"
        >
          {/* Başlık */}
          <div className="border-b border-ink-100 px-5 pt-5 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Dialog.Title className="text-base font-semibold text-ink-900">
                  Aracınızı Seçin
                </Dialog.Title>
                <p className="mt-0.5 text-[12.5px] text-ink-600">
                  Adım {stepIndex + 1} / 4 · {STEP_TITLES[step]}
                </p>
              </div>
              <Dialog.Close
                className="-mt-1 -mr-1 rounded-md p-1.5 text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-800"
                aria-label="Kapat"
              >
                <X size={18} />
              </Dialog.Close>
            </div>

            {/* İlerleme */}
            <div className="mt-3.5 flex gap-1" aria-hidden="true">
              {STEP_ORDER.map((s, i) => (
                <span
                  key={s}
                  className={cn(
                    'h-[3px] flex-1 rounded-full transition-colors duration-200',
                    i < stepIndex
                      ? 'bg-accent-600'
                      : i === stepIndex
                        ? 'bg-brand-600'
                        : 'bg-ink-100',
                  )}
                />
              ))}
            </div>
          </div>

          {/* Tamamlanan adımlar */}
          <div className="shrink-0 px-5 pt-3">
            {STEP_ORDER.slice(0, stepIndex).map((s) => {
              const label = cascade.labels[s]
              if (!label) return null
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => goToStep(s)}
                  className="mb-2 flex w-full items-center gap-2 rounded-md border border-[#BFE5D1] bg-accent-100 px-3 py-2 text-left text-[13px] font-medium text-accent-700 transition-colors hover:brightness-98"
                >
                  <Check size={14} strokeWidth={3} aria-hidden="true" />
                  <span className="truncate">{label}</span>
                  <span className="ml-auto text-[11px] font-semibold opacity-70">değiştir</span>
                </button>
              )
            })}
          </div>

          {/* Arama (uzun listelerde) */}
          {list.items.length > 10 ? (
            <div className="px-5 pt-1 pb-2">
              <div className="relative">
                <Search
                  size={15}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-400"
                  aria-hidden="true"
                />
                <Input
                  className="h-10 pl-9 text-[13.5px]"
                  placeholder={step === 'brand' ? 'Marka ara...' : 'Ara...'}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Listede ara"
                />
              </div>
            </div>
          ) : null}

          {/* Liste */}
          <div className="min-h-[180px] flex-1 overflow-y-auto px-5 pb-3">
            {list.status === 'loading' ? (
              <ul className="space-y-2 pt-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={i} className="h-11 animate-pulse rounded-md bg-ink-50" />
                ))}
              </ul>
            ) : list.status === 'error' ? (
              <div className="flex flex-col items-center gap-3 py-10 text-center">
                <p className="text-sm text-ink-600">
                  Liste yüklenemedi. Bağlantınızı kontrol edip tekrar deneyin.
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => cascade.retry(step as Exclude<CascadeStep, 'type'>)}
                >
                  <RotateCw size={14} aria-hidden="true" />
                  Tekrar dene
                </Button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm font-medium text-ink-900">
                  {query ? 'Aramanızla eşleşen kayıt yok' : 'Bu seçim için kayıt bulunamadı'}
                </p>
                <p className="mt-1.5 text-[13px] text-ink-600">
                  {query
                    ? 'Farklı bir yazım deneyin.'
                    : 'Katalogumuz genişliyor; farklı bir seçim yapabilirsiniz.'}
                </p>
              </div>
            ) : (
              <ul className="space-y-1.5 pt-1">
                {filtered.map((item) => {
                  const isSelected = selectedId === item.id
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => onPick(item.id)}
                        aria-pressed={isSelected}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-md border px-3.5 py-2.5 text-left text-sm transition-colors duration-150',
                          isSelected
                            ? 'border-accent-600 bg-accent-100 font-medium text-accent-700'
                            : 'border-ink-100 bg-white text-ink-800 hover:border-brand-300 hover:bg-brand-50',
                        )}
                      >
                        <span className="min-w-0 flex-1 truncate">{item.label}</span>
                        {item.hint ? (
                          <span className="ocm-code shrink-0 text-[11px]">{item.hint}</span>
                        ) : null}
                        {isSelected ? (
                          <Check size={15} strokeWidth={3} aria-hidden="true" />
                        ) : (
                          <ChevronRight size={15} className="text-ink-400" aria-hidden="true" />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Alt eylem */}
          <div className="border-t border-ink-100 px-5 py-4">
            {cascade.submitError ? (
              <p className="mb-2.5 text-[13px] text-danger" role="alert">
                {cascade.submitError}
              </p>
            ) : null}
            <Button
              block
              size="lg"
              disabled={!cascade.isComplete || cascade.submitting}
              onClick={() => void onSubmit()}
              data-testid="vehicle-dialog-submit"
            >
              {cascade.submitting ? (
                'Aranıyor...'
              ) : (
                <>
                  <Car size={17} aria-hidden="true" />
                  UYUMLU ÜRÜNLERİ GÖSTER
                </>
              )}
            </Button>
            {!cascade.isComplete ? (
              <p className="mt-2.5 text-center text-[12px] text-ink-400">
                Motor seçimi tamamlandığında uyumlu ürünler listelenir.
              </p>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
