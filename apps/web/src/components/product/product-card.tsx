import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CompatibilityBadge } from './compatibility-badge'
import { cn, formatPrice, productTitle } from '@/lib/utils'
import type { ProductCardData } from '@/features/catalog/product-types'

/**
 * Ürün kartı — bilgi hiyerarşisi ustanın "kod ile arama" senaryosuna göre:
 * görsel → TAM AD (marka + kod + tip) → KOD (monospace) → uyumluluk →
 * teknik şerit → fiyat → stok → eylem.
 *
 * ROZET DİSİPLİNİ: kart başına en fazla 2 rozet.
 */
export function ProductCard({
  product,
  hasVehicle,
}: {
  product: ProductCardData
  hasVehicle: boolean
}) {
  const discount =
    product.listPrice && product.listPrice > product.price
      ? Math.round((1 - product.price / product.listPrice) * 100)
      : null

  const outOfStock = product.stock <= 0
  const lowStock = !outOfStock && product.stock <= 8
  const incompatible = product.compatibility === 'incompatible'

  return (
    <Card
      interactive
      className={cn('group relative flex flex-col p-4', incompatible && 'opacity-70')}
      data-testid="product-card"
      data-compat={product.compatibility}
      data-sku={product.sku}
    >
      <div className="relative mb-3.5 flex aspect-square items-center justify-center overflow-hidden rounded-md bg-white">
        {discount ? (
          <Badge tone="warning" className="absolute top-2 left-2 z-10">
            %{discount} indirim
          </Badge>
        ) : null}
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={productTitle(product)}
            width={600}
            height={600}
            sizes="(min-width: 1280px) 220px, (min-width: 768px) 260px, 45vw"
            className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.04]"
          />
        ) : (
          /* Görseli olmayan ürün — yer tutucu. Uydurma görsel konmaz. */
          <svg
            width="72"
            height="72"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            className="text-ink-200 transition-transform duration-200 group-hover:scale-[1.04]"
            aria-hidden="true"
          >
            <rect x="3" y="6" width="18" height="12" rx="1.5" />
            <path d="M7 6v12M11 6v12M15 6v12" />
          </svg>
        )}
      </div>

      {/*
        Başlık TAM AD: "MANN-FILTER WK854/5 Yakıt Filtresi". Kart ile detay
        sayfası aynı ismi gösteriyor; ayrı marka satırı kaldırıldı, çünkü marka
        artık başlığın içinde. Üç satıra kadar yer var — tam ad iki dar sütunda
        üç satıra taşabiliyor ve iki satırda kesilirse ürün tipi kayboluyordu.
      */}
      <h3 className="mb-1.5 line-clamp-3 min-h-[3.75rem] text-sm leading-snug font-medium text-ink-900">
        {/*
          Kartın tamamı tıklanabilir: bağlantı mutlak konumla kartı kaplar,
          ama "Sepete Ekle" butonu z-index ile üstte kalır. Erişilebilir ad
          ürün başlığından gelir — ekran okuyucu için tek anlamlı bağlantı.
        */}
        <Link
          href={`/urun/${product.slug}`}
          prefetch={false}
          className="after:absolute after:inset-0 after:content-[''] hover:text-brand-600"
        >
          {productTitle(product)}
        </Link>
      </h3>
      {product.productCode ? (
        <span className="ocm-code mb-2.5 block">{product.productCode}</span>
      ) : null}

      <CompatibilityBadge
        state={product.compatibility}
        restriction={product.restriction}
        hasVehicle={hasVehicle}
        hideWhenNoVehicle
      />

      {product.specs.length > 0 ? (
        <dl className="ocm-specstrip mt-3">
          {product.specs.map((s) => (
            <div key={s.label} className="flex gap-1">
              <dt>{s.label}</dt>
              <dd>
                <b>{s.value}</b>
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="mt-3 mb-0.5 text-[19px] font-bold tracking-tight text-ink-900">
        {formatPrice(product.price)}
        {product.listPrice && product.listPrice > product.price ? (
          <span className="ml-2 text-[12.5px] font-normal text-ink-400 line-through">
            {formatPrice(product.listPrice)}
          </span>
        ) : null}
      </div>
      <span className="mb-2.5 block text-[11px] text-ink-400">KDV dahil</span>

      <span className="mb-3.5 inline-flex items-center gap-2 text-[12.5px] text-ink-600">
        <span
          className={cn(
            'inline-block h-[7px] w-[7px] rounded-full',
            outOfStock ? 'bg-ink-200' : lowStock ? 'bg-warning' : 'bg-success',
          )}
          aria-hidden="true"
        />
        {outOfStock
          ? product.leadTimeDays
            ? `${product.leadTimeDays} iş gününde tedarik`
            : 'Stokta yok'
          : lowStock
            ? `Son ${product.stock} adet`
            : `Stokta (${product.stock} adet)`}
      </span>

      <Button
        block
        variant={outOfStock ? 'secondary' : 'primary'}
        className="relative z-10 mt-auto"
        disabled={incompatible}
      >
        {incompatible ? 'Aracınıza uygun değil' : outOfStock ? 'Gelince Haber Ver' : 'Sepete Ekle'}
      </Button>
    </Card>
  )
}
