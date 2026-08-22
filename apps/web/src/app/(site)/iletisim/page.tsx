import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PageBody, PageHero, Prose, SectionTitle } from '@/components/layout/page-shell'
import { SITE } from '@/lib/site'
import type { Crumb } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'İletişim',
  description: `Oto Center Market iletişim bilgileri: ${SITE.address}. Telefon ${SITE.phoneDisplay}, WhatsApp destek ve e-posta ile ulaşabilirsiniz.`,
  alternates: { canonical: '/iletisim' },
}

const KANALLAR = [
  {
    icon: Phone,
    title: 'Telefon',
    value: SITE.phoneDisplay,
    href: SITE.phoneHref,
    note: SITE.workingHours,
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: SITE.phoneDisplay,
    href: SITE.whatsappHref,
    note: 'Parça kodu ve şasi numarası göndererek hızlı doğrulama isteyebilirsiniz.',
    external: true,
  },
  {
    icon: Mail,
    title: 'E-posta',
    value: SITE.email,
    href: SITE.emailHref,
    note: 'Kurumsal teklif ve fatura talepleri için.',
  },
]

export default function ContactPage() {
  const crumbs: Crumb[] = [{ label: 'Ana Sayfa', href: '/' }, { label: 'İletişim' }]

  return (
    <>
      <PageHero
        eyebrow="Kurumsal"
        title="İletişim"
        description="Parça seçiminde tereddüt ederseniz aracınızın şasi numarasıyla doğrulama yapıyoruz. En hızlı yanıt WhatsApp üzerinden gelir."
        crumbs={crumbs}
      />

      <PageBody>
        <div className="grid gap-4 md:grid-cols-3">
          {KANALLAR.map(({ icon: Icon, title, value, href, note, external }) => (
            <Card key={title} className="p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                <Icon size={18} strokeWidth={2} aria-hidden="true" />
              </span>
              <b className="mt-3.5 block text-[11.5px] font-semibold tracking-wider text-ink-400 uppercase">
                {title}
              </b>
              <a
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="mt-1 block text-[15px] font-semibold text-ink-900 transition-colors hover:text-brand-600"
              >
                {value}
              </a>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink-600">{note}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <Card className="p-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-brand-600">
              <MapPin size={18} strokeWidth={2} aria-hidden="true" />
            </span>
            <b className="mt-3.5 block text-[11.5px] font-semibold tracking-wider text-ink-400 uppercase">
              Adres
            </b>
            <address className="mt-1.5 text-[15px] leading-relaxed font-medium text-ink-900 not-italic">
              {SITE.addressLines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
            </address>
            <p className="mt-4 flex items-center gap-2 text-[13px] text-ink-600">
              <Clock size={15} className="text-ink-400" aria-hidden="true" />
              {SITE.workingHours}
            </p>
            <p className="mt-4 border-t border-ink-100 pt-4 text-[12.5px] leading-relaxed text-ink-600">
              Adrese gelmeden önce aramanızı öneririz: bazı ürünler depoda, bazıları tedarikçi
              kanalında bulunur. Aradığınız parçanın hazır olup olmadığını önceden teyit edebiliriz.
            </p>
          </Card>

          <div>
            <SectionTitle
              eyebrow="Nasıl yardımcı olabiliriz"
              title="Sık gelen talepler"
            />
            <Prose>
              <h3>Parça uyumluluğu doğrulama</h3>
              <p>
                Araç ruhsatınızdaki şasi (VIN) numarasını gönderin; ürünün aracınıza uyup uymadığını
                teyit edelim. Sitede aracınızı seçerek de{' '}
                <Link href="/">uyumlu ürünleri listeleyebilirsiniz</Link>.
              </p>

              <h3>Toplu ve kurumsal alım</h3>
              <p>
                Servis, filo ve yedek parça satıcıları için ayrı koşullar uyguluyoruz. Ayrıntılar{' '}
                <Link href="/bayilik-toptan">bayilik &amp; toptan sayfasında</Link>.
              </p>

              <h3>Sipariş ve kargo</h3>
              <p>
                Sipariş durumu, kargo ve iade süreçleri için{' '}
                <Link href="/kargo-teslimat">kargo &amp; teslimat</Link> ve{' '}
                <Link href="/iade-degisim">iade &amp; değişim</Link> sayfalarına bakabilir, ya da
                sipariş numaranızla bize yazabilirsiniz.
              </p>

              <h3>Katalogda olmayan ürün</h3>
              <p>
                Aradığınız parça sitede görünmüyorsa yine de sorun. Katalog sürekli genişliyor;
                birçok ürün stokta olduğu hâlde henüz siteye işlenmemiş olabilir.
              </p>
            </Prose>
          </div>
        </div>
      </PageBody>
    </>
  )
}
