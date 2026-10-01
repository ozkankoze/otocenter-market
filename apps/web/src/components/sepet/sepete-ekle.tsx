'use client'

import * as React from 'react'
import { Check, ShoppingCart } from 'lucide-react'
import { Button, type ButtonProps } from '@/components/ui/button'
import { useSepet } from '@/features/sepet/use-sepet'

export const SEPET_EKLENDI_OLAYI = 'ocm:sepet-eklendi'
export type SepetEklendiDetay = { baslik: string; adet: number }

/**
 * Sepete ekle — ürün kartı ve ürün detayında aynı bileşen.
 *
 * Düğme "pasif ama tıklanınca bir şey olmayan" hâlde HİÇ bırakılmaz: ya ekler,
 * ya da neden ekleyemediğini yazar (stokta yok / araca uygun değil).
 */
export function SepeteEkle({
  variantId,
  baslik,
  adet = 1,
  stok,
  uyumsuz = false,
  className,
  size,
  block,
}: {
  variantId: number | null
  baslik: string
  adet?: number
  stok: number
  uyumsuz?: boolean
  className?: string
  size?: ButtonProps['size']
  block?: boolean
}) {
  const { ekle } = useSepet()
  const [eklendi, setEklendi] = React.useState(false)
  const zamanlayici = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  React.useEffect(() => () => {
    if (zamanlayici.current) clearTimeout(zamanlayici.current)
  }, [])

  const stokYok = stok <= 0
  const eklenemez = uyumsuz || stokYok || variantId === null

  const tikla = () => {
    if (eklenemez || variantId === null) return
    ekle(variantId, adet)
    window.dispatchEvent(
      new CustomEvent<SepetEklendiDetay>(SEPET_EKLENDI_OLAYI, { detail: { baslik, adet } }),
    )
    setEklendi(true)
    if (zamanlayici.current) clearTimeout(zamanlayici.current)
    zamanlayici.current = setTimeout(() => setEklendi(false), 1800)
  }

  return (
    <Button
      type="button"
      size={size}
      block={block}
      variant={eklenemez ? 'secondary' : 'primary'}
      className={className}
      disabled={eklenemez}
      onClick={tikla}
      data-testid="add-to-cart"
    >
      {uyumsuz ? (
        'Aracınıza uygun değil'
      ) : stokYok ? (
        'Stokta yok'
      ) : eklendi ? (
        <>
          <Check size={17} aria-hidden="true" /> Sepete eklendi
        </>
      ) : (
        <>
          <ShoppingCart size={17} aria-hidden="true" /> Sepete Ekle
        </>
      )}
    </Button>
  )
}
