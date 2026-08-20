import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Breadcrumb, BreadcrumbJsonLd, type Crumb } from '@/components/ui/breadcrumb'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CompatibilityBlock } from '@/components/product/compatibility-block'
import { ProductPurchase } from '@/components/product/product-purchase'
import { ProductTabs } from '@/components/product/product-tabs'
import { ReferenceTable } from '@/components/product/reference-table'
import { CompatibleVehiclesTable } from '@/components/product/compatible-vehicles-table'
import { readSelectedVehicle } from '@/features/vehicle/cookie'
import { getEngineCodes } from '@/server/vehicle-queries'
import {
  getCompatibleVehicles,
  getEquivalentProducts,
  getProductDetail,
} from '@/server/product-queries'
import { cn, formatPrice, productTitle } from '@/lib/utils'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductDetail(slug, null)
  if (!product) return { title: 'Ürün bulunamadı' }
  return {
    title:
      product.seoTitle ??
      productTitle({
        brandName: product.brand.name,
        productCode: product.productCode,
        name: product.name,
      }),
    description: product.seoDescription ?? product.shortDescription ?? undefined,
    alternates: { canonical: `/urun/${product.slug}` },
  }
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams
  const selection = await readSelectedVehicle()
  const engineId = selection?.engineId ?? null

  const product = await getProductDetail(slug, engineId)
  if (!product) notFound()

  const brandFilter = typeof sp.arac_marka === 'string' ? sp.arac_marka : undefined

  const [vehicles, equivalents, engineCodes] = await Promise.all([
    getCompatibleVehicles(product.id, { limit: 25, brandSlug: brandFilter }),
    getEquivalentProducts(product.id, engineId, 4),
    engineId ? getEngineCodes(engineId) : Promise.resolve([]),
  ])

  const crumbs: Crumb[] = [
    { label: 'Ana Sayfa', href: '/' },
    ...(product.category.parentName && product.category.parentSlug
      ? [{ label: product.category.parentName, href: `/${product.category.parentSlug}` }]
      : []),
    {
      label: product.category.name,
      href: product.category.parentSlug
        ? `/${product.category.parentSlug}/${product.category.slug}`
        : `/${product.category.slug}`,
    },
    { label: `${product.brand.name} ${product.productCode ?? product.name}` },
  ]

  const defaultVariant = product.variants.find((v) => v.isDefault) ?? product.variants[0]

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productTitle({
      brandName: product.brand.name,
      productCode: product.productCode,
      name: product.name,
    }),
    sku: product.sku,
    mpn: product.productCode ?? undefined,
    brand: { '@type': 'Brand', name: product.brand.name },
    description: product.shortDescription ?? undefined,
    offers: defaultVariant
      ? {
          '@type': 'Offer',
          price: defaultVariant.price,
          priceCurrency: 'TRY',
          availability:
            defaultVariant.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          url: `${SITE_URL}/urun/${product.slug}`,
        }
      : undefined,
  }

  return (
    <div className="ocm-container py-6 md:py-8">
      <BreadcrumbJsonLd items={crumbs} baseUrl={SITE_URL} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Breadcrumb items={crumbs} />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:gap-12">
        {/* SOL — görsel */}
        <div className="mx-auto w-full max-w-[520px]">
          <Card className="flex aspect-square items-center justify-center overflow-hidden bg-white">
            {product.images[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].alt ?? product.name}
                width={600}
                height={600}
                priority
                sizes="(min-width: 1024px) 520px, 92vw"
                className="h-full w-full object-contain"
              />
            ) : (
              /* Görseli olmayan ürün — yer tutucu. Uydurma görsel konmaz. */
              <svg
                width="180"
                height="180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.9"
                className="text-ink-200"
                aria-hidden="true"
              >
                <rect x="3" y="6" width="18" height="12" rx="1.5" />
                <path d="M7 6v12M11 6v12M15 6v12" />
              </svg>
            )}
          </Card>
          {/*
            Küçük görsel şeridi yalnızca BİRDEN FAZLA görsel varsa gösterilir.
            Önceden 4 sahte kutu her ürüne çiziliyordu; tek görselli üründe
            "3 görsel daha var" izlenimi veriyordu.
          */}
          {product.images.length > 1 ? (
            <div className="mt-3 flex gap-3">
              {product.images.map((img, i) => (
                <span
                  key={img.url}
                  className={cn(
                    'flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-md border bg-white',
                    i === 0 ? 'border-brand-600' : 'border-ink-100',
                  )}
                >
                  <Image
                    src={img.url}
                    alt=""
                    width={144}
                    height={144}
                    className="h-full w-full object-contain"
                  />
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* SAĞ — künye, uyumluluk, satın alma */}
        <div>
          <div className="mb-3 flex items-center gap-3">
            <Link
              href={`/markalar/${product.brand.slug}`}
              prefetch={false}
              className="text-[11px] font-bold tracking-wider text-brand-600 uppercase hover:underline"
            >
              {product.brand.name}
            </Link>
            {product.brand.country ? (
              <span className="text-[11.5px] text-ink-400">{product.brand.country}</span>
            ) : null}
          </div>

          <h1 className="text-[22px] leading-snug font-bold text-ink-900 md:text-[26px]">
            {productTitle({
              brandName: product.brand.name,
              productCode: product.productCode,
              name: product.name,
            })}
          </h1>

          <div className="mt-2.5 flex flex-wrap items-center gap-3">
            {product.productCode ? (
              <span className="ocm-code rounded-sm border border-ink-100 bg-white px-2.5 py-1 text-[13px] text-ink-800">
                {product.productCode}
              </span>
            ) : null}
            <span className="text-[12.5px] text-ink-400">SKU: {product.sku}</span>
          </div>

          {product.shortDescription ? (
            <p className="mt-3 text-sm text-ink-600">{product.shortDescription}</p>
          ) : null}

          <div className="mt-5">
            <CompatibilityBlock
              state={product.compatibility}
              selection={selection}
              restriction={product.compatibilityRestriction}
              engineCodes={engineCodes}
            />
          </div>

          <ProductPurchase variants={product.variants} compatibility={product.compatibility} />
        </div>
      </div>

      {/* TABLAR */}
      <ProductTabs
        tabs={[
          {
            id: 'aciklama',
            label: 'Ürün Açıklaması',
            content: (
              <div className="max-w-[760px] text-sm leading-relaxed text-ink-700">
                <p>
                  {product.description ?? product.shortDescription ?? 'Açıklama eklenmemiştir.'}
                </p>
              </div>
            ),
          },
          {
            id: 'teknik',
            label: 'Teknik Özellikler',
            count: product.specs.length,
            content:
              product.specs.length > 0 ? (
                <div className="max-w-[640px] overflow-hidden rounded-lg border border-ink-100 bg-white">
                  <table className="w-full text-left text-[13.5px]" data-testid="spec-table">
                    <tbody>
                      {product.specs.map((s) => (
                        <tr key={s.key} className="border-b border-ink-50 last:border-0">
                          <th className="w-1/2 px-4 py-2.5 font-medium text-ink-600">{s.label}</th>
                          <td className="ocm-code px-4 py-2.5 text-[13px] text-ink-900">
                            {s.value}
                            {s.unit ? ` ${s.unit}` : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-ink-600">Teknik özellik bilgisi eklenmemiştir.</p>
              ),
          },
          {
            id: 'uyumlu-araclar',
            label: 'Uyumlu Araçlar',
            count: vehicles.total,
            content: (
              <CompatibleVehiclesTable
                rows={vehicles.rows}
                total={vehicles.total}
                brands={vehicles.brands}
                productSlug={product.slug}
                activeBrand={brandFilter ?? null}
                shown={vehicles.rows.length}
              />
            ),
          },
          {
            id: 'oem',
            label: 'OEM Numaraları',
            count: product.references.filter((r) => r.type === 'OEM').length,
            content: (
              <div className="max-w-[760px] space-y-4">
                <ReferenceTable references={product.references} type="OEM" />
                <p className="text-[12.5px] text-ink-500">
                  OEM numarası ile arama yaptığınızda bu ürün sonuçlarda çıkar. Numaralar boşluk ve
                  tire farkı gözetilmeden eşleştirilir.
                </p>
              </div>
            ),
          },
          {
            id: 'esdeger',
            label: 'Eşdeğer Ürünler',
            count: equivalents.length,
            content:
              equivalents.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {equivalents.map((e) => (
                    <Link key={e.id} href={`/urun/${e.slug}`} prefetch={false}>
                      <Card interactive className="h-full p-4">
                        {/* Ürün kartıyla aynı düzen: tam ad + monospace kod. */}
                        <span className="mb-1 block text-sm leading-snug font-medium text-ink-900">
                          {productTitle({
                            brandName: e.brandName,
                            productCode: e.productCode,
                            name: e.name,
                          })}
                        </span>
                        <span className="ocm-code mb-2.5 block">{e.productCode}</span>
                        {e.compatibility === 'compatible' ? (
                          <Badge tone="fit">
                            <Check size={11} strokeWidth={3} aria-hidden="true" />
                            Aracınıza uygun
                          </Badge>
                        ) : null}
                        <span className="mt-2 block text-[17px] font-bold text-ink-900">
                          {formatPrice(e.price)}
                        </span>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ink-600">
                  Bu ürün için tanımlı eşdeğer ürün bulunmuyor.
                </p>
              ),
          },
          {
            id: 'capraz',
            label: 'Çapraz Kodlar',
            count: product.references.filter((r) => r.type !== 'OEM').length,
            content: <ReferenceTable references={product.references} type="CROSS" />,
          },
        ]}
      />
    </div>
  )
}
