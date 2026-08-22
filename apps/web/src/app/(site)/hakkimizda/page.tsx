import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Package, ShieldCheck, Truck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PageBody, PageHero, Prose, SectionTitle } from '@/components/layout/page-shell'
import { getCatalogStats } from '@/server/vehicle-queries'
import { SITE } from '@/lib/site'
import { formatCount } from '@/lib/utils'
import type { Crumb } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description:
    'Oto Center Market; otomobil, hafif ticari ve ağır vasıta araçlar için filtre, yağ ve bakım ürünleri tedarik eden e-ticaret platformudur. Uyumluluk motor kodu seviyesinde doğrulanır.',
  alternates: { canonical: '/hakkimizda' },
}

const CALISMA_BICIMI = [
  {
    icon: Check,
    title: 'Motor kodu seviyesinde eşleştirme',
    text: 'Bir ürünü “şu markaya uyar” diye listelemiyoruz. Her ürün, aracın motoruna kadar inen bir eşleştirmeyle bağlanır. Eşleştirme doğrulanmadıysa ürün sayfasında bunu açıkça yazarız; yeşil “uyumlu” rozeti yalnızca doğrulanmış eşleşmelerde çıkar.',
  },
  {
    icon: ShieldCheck,
    title: 'Yetkili kanaldan tedarik',
    text: 'Katalogdaki ürünler yetkili distribütör kanalından tedarik edilir. Orijinal ve muadil ayrımı ürün sayfasında belirtilir; muadil bir ürünü orijinal gibi göstermeyiz.',
  },
  {
    icon: Package,
    title: 'Tek katalog, üç araç sınıfı',
    text: 'Otomobil, hafif ticari ve ağır vasıta ürünleri aynı katalogda. Ağır vasıta tarafında kurutucu, AdBlue ve direksiyon filtreleri gibi binek araçlarda karşılığı olmayan gruplar da bulunur.',
  },
  {
    icon: Truck,
    title: 'Stoktan hızlı sevkiyat',
    text: "Saat 16:00'ya kadar verilen stoklu siparişler aynı gün kargoya teslim edilir. Stokta olmayan ürünlerde tedarik süresi ürün sayfasında gösterilir.",
  },
]

export default async function AboutPage() {
  const stats = await getCatalogStats()
  const crumbs: Crumb[] = [{ label: 'Ana Sayfa', href: '/' }, { label: 'Hakkımızda' }]

  return (
    <>
      <PageHero
        eyebrow="Kurumsal"
        title="Hakkımızda"
        description="Oto Center Market, doğru parçayı bulmayı tahmin işi olmaktan çıkarmak için kuruldu. Katalogdaki her ürün, uyduğu aracın motoruna kadar eşleştirilir."
        crumbs={crumbs}
      />

      <PageBody>
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <Prose>
              <h2>Ne yapıyoruz?</h2>
              <p>
                Otomobil, hafif ticari ve ağır vasıta araçlar için filtre, yağ ve bakım ürünleri
                tedarik ediyoruz. Katalogda bugün{' '}
                <strong>{formatCount(stats.products)} ürün</strong>,{' '}
                <strong>{stats.vehicleBrands} araç markası</strong> ve{' '}
                <strong>{formatCount(stats.compatibilities)} motor eşleştirmesi</strong> bulunuyor.
              </p>
              <p>
                Yedek parça alışverişinde asıl zorluk ürünü bulmak değil, <em>doğru</em> ürünü
                bulmaktır. Aynı marka ve modelin farklı motor seçenekleri çoğu zaman farklı filtre
                kullanır. Bu yüzden sitedeki uyumluluk bilgisi model seviyesinde değil, motor
                seviyesinde tutulur.
              </p>

              <h2>Uyumluluk konusunda sözümüz</h2>
              <p>
                Bir ürünün aracınıza uyduğunu <strong>ancak doğrulanmış bir kayıt varsa</strong>{' '}
                söyleriz. Kaynaklar çelişiyorsa ya da kayıt yoksa, ürün sayfasında “uyumluluk teyit
                edilmedi” yazar ve yeşil rozet çıkmaz. Emin olmadığımız bir şeyi emin gibi
                göstermek, yanlış parça göndermekten daha büyük bir sorun yaratır.
              </p>
              <p>
                Parça seçiminde tereddüt ederseniz{' '}
                <Link href="/iletisim">bize ulaşın</Link>; şasi numarasıyla doğrulama yapıyoruz.
              </p>

              <h2>Kimlere satıyoruz?</h2>
              <p>
                Bireysel araç sahiplerinin yanı sıra servisler, filo işletmeleri ve yedek parça
                satıcılarıyla da çalışıyoruz. Düzenli ve yüksek adetli alım yapıyorsanız{' '}
                <Link href="/bayilik-toptan">bayilik ve toptan koşullarımıza</Link> bakabilirsiniz.
              </p>
            </Prose>
          </div>

          <div className="space-y-4">
            <Card className="p-5">
              <span className="ocm-eyebrow">Katalog</span>
              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
                <Stat value={`${formatCount(stats.products)}+`} label="Ürün" />
                <Stat value={`${stats.vehicleBrands}+`} label="Araç markası" />
                <Stat value={`${stats.productBrands}+`} label="Ürün markası" />
                <Stat value={`${formatCount(stats.compatibilities)}+`} label="Motor eşleştirmesi" />
              </div>
            </Card>

            <Card className="p-5">
              <span className="ocm-eyebrow">İletişim</span>
              <ul className="mt-3.5 space-y-2 text-[13.5px] text-ink-600">
                <li>{SITE.addressLines.join(', ')}</li>
                <li>
                  <a href={SITE.phoneHref} className="font-semibold text-ink-900 hover:text-brand-600">
                    {SITE.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={SITE.emailHref} className="hover:text-brand-600">
                    {SITE.email}
                  </a>
                </li>
                <li>{SITE.workingHours}</li>
              </ul>
              <Link
                href="/iletisim"
                prefetch={false}
                className="mt-4 inline-flex text-[13.5px] font-semibold text-brand-600 hover:underline"
              >
                İletişim sayfası →
              </Link>
            </Card>
          </div>
        </div>

        <section className="mt-14">
          <SectionTitle eyebrow="Çalışma biçimimiz" title="Dört temel ilke" />
          <div className="grid gap-4 md:grid-cols-2">
            {CALISMA_BICIMI.map(({ icon: Icon, title, text }) => (
              <Card key={title} className="flex gap-4 p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                  <Icon size={18} strokeWidth={2} aria-hidden="true" />
                </span>
                <span>
                  <b className="mb-1 block text-sm font-semibold text-ink-900">{title}</b>
                  <p className="text-[13px] leading-relaxed text-ink-600">{text}</p>
                </span>
              </Card>
            ))}
          </div>
        </section>
      </PageBody>
    </>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <b className="block text-[22px] leading-tight font-bold tracking-tight text-ink-900">
        {value}
      </b>
      <span className="text-[12.5px] text-ink-600">{label}</span>
    </div>
  )
}
