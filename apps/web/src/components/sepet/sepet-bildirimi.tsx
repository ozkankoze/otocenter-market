'use client'

import * as React from 'react'
import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { SEPET_EKLENDI_OLAYI, type SepetEklendiDetay } from './sepete-ekle'

/**
 * "Sepete eklendi" bildirimi — sayfanın neresinde olursa olsun görünür.
 *
 * Header'daki sepet rozeti sayfa aşağı kaydırılınca görünmüyor; mobilde ise
 * küçük. Kullanıcı eklemenin gerçekleştiğini ve sepete nasıl gideceğini
 * görmezse aynı ürünü tekrar ekliyor.
 */
export function SepetBildirimi() {
  const [detay, setDetay] = React.useState<SepetEklendiDetay | null>(null)
  const zamanlayici = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => {
    const dinle = (e: Event) => {
      setDetay((e as CustomEvent<SepetEklendiDetay>).detail)
      if (zamanlayici.current) clearTimeout(zamanlayici.current)
      zamanlayici.current = setTimeout(() => setDetay(null), 4000)
    }
    window.addEventListener(SEPET_EKLENDI_OLAYI, dinle)
    return () => {
      window.removeEventListener(SEPET_EKLENDI_OLAYI, dinle)
      if (zamanlayici.current) clearTimeout(zamanlayici.current)
    }
  }, [])

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[140px] z-[60] flex justify-center px-4 lg:bottom-6"
    >
      {detay ? (
        <div
          role="status"
          className="pointer-events-auto flex w-full max-w-[440px] items-center gap-3 rounded-lg border border-ink-100 bg-white p-3.5 shadow-lg"
          data-testid="sepet-bildirimi"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700">
            <Check size={16} strokeWidth={2.6} aria-hidden="true" />
          </span>
          <p className="min-w-0 flex-1 text-[13px] text-ink-700">
            <b className="block truncate font-semibold text-ink-900">{detay.baslik}</b>
            {detay.adet > 1 ? `${detay.adet} adet sepete eklendi` : 'Sepete eklendi'}
          </p>
          <Link
            href="/sepet"
            prefetch={false}
            title="Sepete git"
            className="shrink-0 rounded-md bg-brand-600 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-brand-700"
          >
            Sepete git
          </Link>
          <button
            type="button"
            onClick={() => setDetay(null)}
            aria-label="Bildirimi kapat"
            className="shrink-0 p-1 text-ink-400 hover:text-ink-700"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </div>
  )
}
