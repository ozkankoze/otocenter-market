'use client'

import { Check, Info, X, Car } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useVehicleUi } from '@/components/vehicle/vehicle-ui-provider'
import { cn } from '@/lib/utils'
import type { CompatibilityState, VehicleSelection } from '@/features/vehicle/types'

/**
 * Ürün detayındaki uyumluluk kutusu — sayfanın en önemli bileşeni.
 *
 * KURALLAR (Sprint 1–2 ile birebir):
 *   compatible   → yeşil, seçili araç açıkça yazılır
 *   unknown      → gri; veri yok VEYA kaynaklar çelişiyor
 *   incompatible → kırmızı, yalnızca gerçekten uyumsuzsa
 *   araç seçili değil → nötr davet kutusu
 */
export function CompatibilityBlock({
  state,
  selection,
  restriction,
  engineCodes,
}: {
  state: CompatibilityState
  selection: VehicleSelection | null
  restriction: string | null
  engineCodes: string[]
}) {
  const { openSelector } = useVehicleUi()

  if (!selection) {
    return (
      <div
        className="rounded-lg border border-brand-100 bg-brand-50 p-4"
        data-testid="compat-block"
        data-state="no-vehicle"
      >
        <b className="flex items-center gap-2 text-sm font-semibold text-ink-900">
          <Car size={16} className="text-brand-600" aria-hidden="true" />
          Bu ürün aracınıza uyuyor mu?
        </b>
        <p className="mt-1.5 mb-3 text-[13px] text-ink-600">
          Aracınızı seçin, uyumluluğu anında görün. Uyumluluk motor kodu seviyesinde kontrol edilir.
        </p>
        <Button onClick={openSelector} size="sm">
          Aracımı Seç
        </Button>
      </div>
    )
  }

  const vehicleLabel = `${selection.brandName} ${selection.modelName} · ${selection.engineName}`

  const config = {
    compatible: {
      wrapper: 'border-[#BFE5D1] bg-accent-100',
      icon: <Check size={16} strokeWidth={3} className="text-accent-700" aria-hidden="true" />,
      title: 'Aracınıza uygun',
      titleClass: 'text-accent-700',
      body: null as string | null,
    },
    unknown: {
      wrapper: 'border-ink-200 bg-ink-50',
      icon: <Info size={16} className="text-ink-500" aria-hidden="true" />,
      title: 'Uyumluluk teyit edilmedi',
      titleClass: 'text-ink-700',
      body: 'Bu ürün için aracınıza ait doğrulanmış uyumluluk kaydı bulunmuyor ya da kaynaklarımız çelişiyor. Yanlış parça riskini önlemek için uygun olarak işaretlemiyoruz; teknik ekibimizden şasi numarasıyla doğrulama isteyebilirsiniz.',
    },
    incompatible: {
      wrapper: 'border-[#F3D4CF] bg-[#FDF1EF]',
      icon: <X size={16} strokeWidth={3} className="text-danger" aria-hidden="true" />,
      title: 'Bu araca uygun değil',
      titleClass: 'text-danger',
      body: 'Kayıtlarımıza göre bu ürün seçili motora uymuyor. Aracınıza uygun alternatifler için kategori sayfasına göz atabilirsiniz.',
    },
  }[state]

  return (
    <div
      className={cn('rounded-lg border p-4', config.wrapper)}
      data-testid="compat-block"
      data-state={state}
    >
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5">{config.icon}</span>
        <div className="min-w-0 flex-1">
          <b className={cn('block text-sm font-semibold', config.titleClass)}>{config.title}</b>
          <span className="mt-0.5 block text-[13.5px] font-medium text-ink-900">
            {vehicleLabel}
          </span>
          {selection.years ? (
            <span className="ocm-code mt-0.5 block text-[11.5px]">
              {selection.years}
              {engineCodes.length ? ` · Motor kodu: ${engineCodes.join(' · ')}` : ''}
            </span>
          ) : null}

          {restriction ? (
            <p className="mt-2 flex items-start gap-1.5 rounded-sm bg-white/70 px-2.5 py-1.5 text-[12.5px] text-ink-700">
              <Info size={13} className="mt-px shrink-0" aria-hidden="true" />
              {restriction}
            </p>
          ) : null}

          {config.body ? (
            <p className="mt-2 text-[12.5px] leading-relaxed text-ink-600">{config.body}</p>
          ) : null}

          <button
            type="button"
            onClick={openSelector}
            className="mt-2.5 text-[12.5px] font-semibold text-brand-600 hover:underline"
          >
            Aracı değiştir
          </button>
        </div>
      </div>
    </div>
  )
}
