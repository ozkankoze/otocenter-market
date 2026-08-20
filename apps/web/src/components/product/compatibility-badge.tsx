import { Check, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { CompatibilityState } from '@/features/vehicle/types'

/**
 * UYUMLULUK ROZETİ — sitenin güven vaadinin görsel karşılığı.
 *
 * KURAL (03-FINAL-MIMARI.md §3.2):
 *   'compatible'   → yeşil ✓   (yalnızca VERIFIED / SOURCED)
 *   'unknown'      → gri       (veri yok VEYA kaynaklar çelişiyor)
 *   'incompatible' → kırmızı
 *
 * Veri yoksa veya çelişkiliyse ASLA yeşil gösterilmez.
 * Renk tek başına bilgi taşımaz: ikon + metin her zaman birlikte.
 */
export function CompatibilityBadge({
  state,
  restriction,
  hideWhenNoVehicle = false,
  hasVehicle = true,
}: {
  state: CompatibilityState
  restriction?: string | null
  hideWhenNoVehicle?: boolean
  hasVehicle?: boolean
}) {
  if (!hasVehicle && hideWhenNoVehicle) return null

  if (state === 'compatible') {
    return (
      <Badge tone="fit">
        <Check size={12} strokeWidth={3.2} aria-hidden="true" />
        Aracınıza uygun
        {restriction ? (
          <span title={restriction} className="inline-flex opacity-75">
            <Info size={11} aria-hidden="true" />
            <span className="sr-only">{restriction}</span>
          </span>
        ) : null}
      </Badge>
    )
  }

  if (state === 'incompatible') {
    return <Badge tone="danger">Bu araca uygun değil</Badge>
  }

  return <Badge tone="neutral">Uyumluluk teyit edilmedi</Badge>
}
