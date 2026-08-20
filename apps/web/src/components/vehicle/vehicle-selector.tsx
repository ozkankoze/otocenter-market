'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Car, RotateCw, Search } from 'lucide-react'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useVehicleCascade, type CascadeStep } from '@/features/vehicle/use-vehicle-cascade'
import { useVehicleUi } from './vehicle-ui-provider'
import type { VehicleSelection, VehicleTypeOption } from '@/features/vehicle/types'

type Props = {
  variant?: 'hero' | 'inline'
  types: VehicleTypeOption[]
  initialSelection?: VehicleSelection | null
  submitLabel?: string
}

/**
 * ARAÇ SEÇİCİ — masaüstü kademeli dropdown deneyimi.
 * Mobilde (md altı) tek bir eylem butonuna dönüşür ve bottom-sheet diyaloğunu açar;
 * dört dropdown'ı küçük ekrana sıkıştırmak yerine adım adım liste sunulur.
 */
export function VehicleSelector({
  variant = 'hero',
  types,
  initialSelection = null,
  submitLabel = 'UYUMLU ÜRÜNLERİ GÖSTER',
}: Props) {
  const router = useRouter()
  const { openSelector } = useVehicleUi()
  const c = useVehicleCascade(types, initialSelection)

  async function onSubmit() {
    const ok = await c.submit()
    if (ok) router.refresh()
  }

  return (
    <div
      className={cn(
        'rounded-xl border border-ink-100 bg-white',
        variant === 'hero' ? 'p-5 shadow-lg md:p-7' : 'p-5 shadow-sm',
      )}
      data-testid="vehicle-selector"
    >
      <span className="ocm-eyebrow">Araç uyumluluğu</span>
      <h2
        className={cn(
          'mt-2 font-semibold text-ink-900',
          variant === 'hero' ? 'text-xl md:text-[22px]' : 'text-lg',
        )}
      >
        Aracınıza Göre Parça Bulun
      </h2>
      <p className="mt-1 mb-5 text-sm text-ink-600">
        Aracınızı seçin, yalnızca uyumlu ürünleri görüntüleyin.
      </p>

      {/* ── Mobil: tek eylem, bottom-sheet açar ── */}
      <div className="md:hidden">
        <Button block size="lg" onClick={openSelector} data-testid="vehicle-mobile-trigger">
          <Car size={18} aria-hidden="true" />
          {initialSelection ? 'Aracı Değiştir' : 'Aracınızı Seçin'}
        </Button>
        <p className="mt-2.5 text-center text-[12px] text-ink-400">
          Marka, model ve motoru adım adım seçin
        </p>
      </div>

      {/* ── Masaüstü: kademeli dropdown ── */}
      <div className="hidden gap-3 md:grid md:grid-cols-2 xl:grid-cols-[repeat(4,1fr)_auto] xl:items-end">
        <Step no={1} label="Araç Tipi" done={Boolean(c.selected.typeId)}>
          <Select
            aria-label="Araç tipi"
            value={c.selected.typeId ?? ''}
            onChange={(e) => c.selectType(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Seçiniz</option>
            {c.types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </Step>

        <Step
          no={2}
          label="Marka"
          done={Boolean(c.selected.brandId)}
          locked={!c.selected.typeId}
          status={c.brands.status}
          onRetry={() => c.retry('brand')}
        >
          <Select
            aria-label="Araç markası"
            disabled={!c.selected.typeId || c.brands.status !== 'idle'}
            value={c.selected.brandId ?? ''}
            onChange={(e) => c.selectBrand(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">
              {placeholder(!c.selected.typeId, c.brands.status, c.brands.items.length, {
                locked: 'Önce araç tipi seçiniz',
                empty: 'Bu tipte marka yok',
                ready: 'Marka seçiniz',
              })}
            </option>
            {c.brands.items.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </Select>
        </Step>

        <Step
          no={3}
          label="Model"
          done={Boolean(c.selected.modelId)}
          locked={!c.selected.brandId}
          status={c.models.status}
          onRetry={() => c.retry('model')}
        >
          <Select
            aria-label="Araç modeli"
            disabled={!c.selected.brandId || c.models.status !== 'idle'}
            value={c.selected.modelId ?? ''}
            onChange={(e) => c.selectModel(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">
              {placeholder(!c.selected.brandId, c.models.status, c.models.items.length, {
                locked: 'Önce marka seçiniz',
                empty: 'Model bulunamadı',
                ready: 'Model seçiniz',
              })}
            </option>
            {c.models.items.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </Select>
        </Step>

        <Step
          no={4}
          label="Motor"
          done={Boolean(c.selected.engineId)}
          locked={!c.selected.modelId}
          status={c.engines.status}
          onRetry={() => c.retry('engine')}
        >
          <Select
            aria-label="Motor"
            disabled={!c.selected.modelId || c.engines.status !== 'idle'}
            value={c.selected.engineId ?? ''}
            onChange={(e) => c.selectEngine(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">
              {placeholder(!c.selected.modelId, c.engines.status, c.engines.items.length, {
                locked: 'Önce model seçiniz',
                empty: 'Motor bulunamadı',
                ready: 'Motor seçiniz',
              })}
            </option>
            {c.engines.items.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
                {e.years ? ` · ${e.years}` : ''}
              </option>
            ))}
          </Select>
        </Step>

        <Button
          size="lg"
          disabled={!c.isComplete || c.submitting}
          onClick={() => void onSubmit()}
          className="md:col-span-2 xl:col-span-1"
          data-testid="vehicle-submit"
        >
          {c.submitting ? 'Aranıyor...' : submitLabel}
        </Button>
      </div>

      {c.submitError ? (
        <p className="mt-3 text-sm text-danger" role="alert">
          {c.submitError}
        </p>
      ) : null}

      <div className="mt-5 flex flex-col gap-2 border-t border-ink-50 pt-4 text-[13px] text-ink-600 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-2">
          <Car size={15} className="text-ink-400" aria-hidden="true" />
          {initialSelection ? (
            <span>
              Kayıtlı aracınız:{' '}
              <b className="font-semibold text-ink-800">
                {initialSelection.brandName} {initialSelection.modelName}
              </b>
            </span>
          ) : (
            'Kayıtlı aracınız yok'
          )}
        </span>
        <span className="inline-flex items-center gap-1.5 text-ink-400">
          <Search size={13} aria-hidden="true" />
          Aracınızı bilmiyorsanız parça kodu veya OEM numarası ile arayın
        </span>
      </div>
    </div>
  )
}

function placeholder(
  locked: boolean,
  status: 'idle' | 'loading' | 'error',
  count: number,
  labels: { locked: string; empty: string; ready: string },
): string {
  if (locked) return labels.locked
  if (status === 'loading') return 'Yükleniyor...'
  if (status === 'error') return 'Yüklenemedi'
  return count ? labels.ready : labels.empty
}

function Step({
  no,
  label,
  done,
  locked,
  status = 'idle',
  onRetry,
  children,
}: {
  no: number
  label: string
  done?: boolean
  locked?: boolean
  status?: 'idle' | 'loading' | 'error'
  onRetry?: () => void
  children: React.ReactNode
}) {
  return (
    <div>
      <span className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-ink-800">
        <span
          className={cn(
            'inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white transition-colors duration-150',
            locked ? 'bg-ink-200' : done ? 'bg-accent-600' : 'bg-brand-600',
          )}
          aria-hidden="true"
        >
          {no}
        </span>
        {label}
        {status === 'error' && onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-danger hover:underline"
          >
            <RotateCw size={11} aria-hidden="true" />
            Tekrar dene
          </button>
        ) : null}
      </span>
      {children}
    </div>
  )
}

export type { CascadeStep }
