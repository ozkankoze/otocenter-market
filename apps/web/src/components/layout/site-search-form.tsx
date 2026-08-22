'use client'

import * as React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const SEARCH_PLACEHOLDER = 'Ürün, OEM numarası veya parça kodu ara...'

/**
 * SİTE ARAMASI — tek form, üç yerde.
 *
 * Header (masaüstü), mobil arama katmanı ve hero aynı bileşeni kullanır.
 * Daha önce bunların hepsi süssüz bir `<input>` idi: yazıp Enter'a basmak da,
 * "Ürünleri Keşfet" düğmesine tıklamak da hiçbir şey yapmıyordu.
 *
 * Gerçek bir `<form>` kullanılıyor; böylece Enter tuşu tarayıcının kendi
 * davranışıyla çalışır ve klavye/ekran okuyucu için doğru anlam taşır.
 * Gönderim `/arama?q=...` adresine yönlendirir.
 */
export function SiteSearchForm({
  className,
  inputClassName,
  variant = 'inline',
  submitLabel,
  autoFocus,
  onNavigate,
}: {
  className?: string
  inputClassName?: string
  /** 'inline' → kutunun içinde ikon; 'hero' → yanında ayrı düğme */
  variant?: 'inline' | 'hero'
  submitLabel?: string
  autoFocus?: boolean
  /** Yönlendirme sonrası kapatılacak katman (mobil arama/drawer) */
  onNavigate?: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = React.useState('')

  /*
   * Arama sayfasındayken kutu mevcut sorguyla dolu gelsin.
   *
   * Bunun için `useSearchParams()` KULLANILMIYOR: bu kanca, kendisini içeren
   * her sayfayı istemci tarafında render edilmeye zorlar ve Suspense sınırı
   * ister. Bu bileşen header'da, yani TÜM sayfalarda bulunduğu için hukuki ve
   * kurumsal sayfaların statik üretimi bozulurdu. Değer bunun yerine
   * bağlanmadan sonra adres çubuğundan okunuyor — hidrasyon uyuşmazlığı da
   * olmuyor, çünkü ilk render her zaman boş.
   */
  React.useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('q')
    setValue(q ?? '')
  }, [pathname])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const q = value.trim()
    if (!q) return
    onNavigate?.()
    router.push(`/arama?q=${encodeURIComponent(q)}`)
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className={cn(variant === 'hero' ? 'flex flex-col gap-3 sm:flex-row' : 'relative', className)}
    >
      <div className={cn('relative', variant === 'hero' && 'flex-1')}>
        <Search
          size={18}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-400"
          aria-hidden="true"
        />
        <Input
          name="q"
          type="search"
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => setValue(e.target.value)}
          placeholder={SEARCH_PLACEHOLDER}
          aria-label={SEARCH_PLACEHOLDER}
          className={cn('pl-11', inputClassName)}
        />
        {variant === 'inline' ? (
          <kbd className="ocm-code pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded border border-ink-200 bg-white px-1.5 py-0.5 text-[10px] text-ink-400 xl:block">
            OEM / KOD
          </kbd>
        ) : null}
      </div>

      {variant === 'hero' ? (
        <Button type="submit" size="lg" variant="white">
          {submitLabel ?? 'Ürünleri Keşfet'}
        </Button>
      ) : (
        /* Görsel olarak gizli ama klavye ve ekran okuyucu için var: formun
           gönderilebilir olduğunu belirtir. */
        <button type="submit" className="sr-only">
          {submitLabel ?? 'Ara'}
        </button>
      )}
    </form>
  )
}
