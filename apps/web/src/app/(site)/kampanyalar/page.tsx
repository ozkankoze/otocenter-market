import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, CreditCard, Percent, Truck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { ProductCard } from '@/components/product/product-card'
import { PageBody, PageHero, SectionTitle } from '@/components/layout/page-shell'
import { getProducts } from '@/server/catalog-queries'
import { readSelectedVehicle } from '@/features/vehicle/cookie'
import { DIS_BAGLANTI_REL, SITE } from '@/lib/site'
import type { Crumb } from '@/components/ui/breadcrumb'

export const dynamic = 'force-dynamic' // araç seçimi cookie'ye bağlı

export const metadata: Metadata = {
  title: 'Kampanyalar',
  description:
    'Oto Center Market’te geçerli kampanya ve avantajlar: 500 ₺ üzeri kargo ücretsiz, aynı gün kargo, taksit ve toptan alım koşulları.',
  alternates: { canonical: '/kampanyalar' },
}

/**
 * KAMPANYALAR.
 *
 * Sitede kampanya verisi tutan bir tablo YOK. Bu yüzden burada uydurma indirim
 * oranı ya da sahte "son 2 gün" sayacı gösterilmiyor. Sayfa, sitenin başka
 * yerlerinde zaten duyurulan GERÇEK ve SÜREKLİ avantajları tek yerde toplar
 * (ürün sayfasındaki kargo ve iade koşulları, ana sayfadaki hızlı kargo
 * taahhüdü) ve gerçek öne çıkan ürünleri listeler.
 */
const AVANTAJLAR = [
  {
    icon: Truck,
    title: '500 ₺ üzeri kargo ücretsiz',
    text: 'Sepet tutarı 500 ₺ ve üzerindeki siparişlerde kargo ücreti alınmaz. Tutarın altındaki siparişlerde kargo bedeli ödeme adımında açıkça gösterilir.',
    badge: 'Sürekli',
  },
  {
    icon: Clock,
    title: 'Aynı gün kargo',
    text: "Saat 16:00'ya kadar verilen ve stokta bulunan siparişler aynı gün kargoya teslim edilir. Stokta olmayan ürünlerde tedarik süresi ürün sayfasında yazar.",
    badge: 'Sürekli',
  },
  {
    icon: CreditCard,
    title: 'Taksit ve havale seçeneği',
    text: '3D Secure destekli sanal POS üzerinden kredi kartına taksit yapılabilir. Havale/EFT ile ödemede sipariş, ödeme onayının ardından hazırlanır.',
    badge: 'Sürekli',
  },
  {
    icon: Percent,
    title: 'Toptan ve servis fiyatı',
    text: 'Servisler, filolar ve yedek parça satıcıları için adede göre fiyatlandırma uygulanır. Koşullar alım hacmine göre belirlenir.',
    badge: 'Kurumsal',
    href: '/bayilik-toptan',
    hrefLabel: 'Bayilik koşullarına bakın',
  },
]

export default async function CampaignsPage() {
  const selection = await readSelectedVehicle()
  const products = await getProducts({ engineId: null, limit: 8, featuredOnly: true })
  const crumbs: Crumb[] = [{ label: 'Ana Sayfa', href: '/' }, { label: 'Kampanyalar' }]

  return (
    <>
      <PageHero
        eyebrow="Fırsatlar"
        title="Kampanyalar & Avantajlar"
        description="Dönemsel indirim duyuruları bu sayfada yayımlanır. Aşağıdaki avantajlar ise süreklidir; ayrı bir kod ya da başvuru gerektirmez."
        crumbs={crumbs}
      />

      <PageBody>
        <div className="grid gap-4 md:grid-cols-2">
          {AVANTAJLAR.map(({ icon: Icon, title, text, badge, href, hrefLabel }) => (
            <Card key={title} className="flex gap-4 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                <Icon size={19} strokeWidth={2} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <b className="text-sm font-semibold text-ink-900">{title}</b>
                  <span className="inline-flex h-5 items-center rounded-sm bg-accent-100 px-2 text-[10.5px] font-semibold tracking-wide text-accent-700 uppercase">
                    {badge}
                  </span>
                </div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">{text}</p>
                {href ? (
                  <Link
                    href={href}
                    prefetch={false}
                    title={`${hrefLabel} — ürünleri görüntüle`}
                    className="mt-2.5 inline-flex text-[13px] font-semibold text-brand-600 hover:underline"
                  >
                    {hrefLabel} →
                  </Link>
                ) : null}
              </div>
            </Card>
          ))}
        </div>

        {products.length > 0 ? (
          <section className="mt-14">
            <SectionTitle
              eyebrow="Öne çıkanlar"
              title="Çok tercih edilen ürünler"
              subtitle="Katalogda en sık talep gören filtre ve bakım ürünleri"
            />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} hasVehicle={Boolean(selection)} />
              ))}
            </div>
          </section>
        ) : null}

        <Card className="mt-12 flex flex-wrap items-center justify-between gap-5 bg-brand-50 p-6">
          <div className="max-w-[560px]">
            <b className="block text-[15px] font-semibold text-ink-900">
              Kampanyalardan haberdar olmak ister misiniz?
            </b>
            <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
              Dönemsel indirimleri ve yeni ürün gruplarını WhatsApp üzerinden duyuruyoruz. Numaranızı
              eklemek için bize bir mesaj göndermeniz yeterli.
            </p>
          </div>
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel={DIS_BAGLANTI_REL}
            title={`WhatsApp'tan ${SITE.phoneDisplay} numarasına yazın`}
            className="inline-flex h-11 items-center rounded-md bg-brand-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
          >
            WhatsApp ile yazın
          </a>
        </Card>
      </PageBody>
    </>
  )
}
