import { cn } from '@/lib/utils'

const ETIKET: Record<string, { metin: string; cls: string }> = {
  PENDING_PAYMENT: { metin: 'Ödeme bekliyor', cls: 'bg-ink-50 text-ink-600' },
  PAID: { metin: 'Hazırlanacak', cls: 'bg-brand-50 text-brand-700' },
  PAYMENT_FAILED: { metin: 'Ödeme başarısız', cls: 'bg-[#FBEAE8] text-danger' },
  SHIPPED: { metin: 'Kargoda', cls: 'bg-accent-100 text-accent-700' },
  DELIVERED: { metin: 'Teslim edildi', cls: 'bg-accent-100 text-accent-700' },
  CANCELLED: { metin: 'İptal', cls: 'bg-ink-50 text-ink-500' },
  REFUNDED: { metin: 'İade edildi', cls: 'bg-[#FDF3E2] text-warning' },
}

export function SiparisEtiketi({ durum }: { durum: string }) {
  const e = ETIKET[durum] ?? { metin: durum, cls: 'bg-ink-50 text-ink-600' }
  return (
    <span className={cn('inline-flex rounded-sm px-2 py-0.5 text-[11.5px] font-semibold', e.cls)}>
      {e.metin}
    </span>
  )
}

export function kurus(k: number | null | undefined): string {
  if (k === null || k === undefined) return '—'
  return `${(k / 100).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺`
}
