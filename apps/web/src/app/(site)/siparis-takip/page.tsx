import type { Metadata } from 'next'
import Link from 'next/link'
import { MessageCircle, Phone, Mail } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { PageBody, PageHero, Prose } from '@/components/layout/page-shell'
import { DIS_BAGLANTI_REL, SITE } from '@/lib/site'
import type { Crumb } from '@/components/ui/breadcrumb'
import { SiparisSorgu } from './siparis-sorgu'

export const metadata: Metadata = {
  title: 'Sipariş Takip',
  description:
    'Sipariş durumunuzu ve kargo takip numaranızı öğrenmek için gereken bilgiler ve iletişim kanalları.',
  alternates: { canonical: '/siparis-takip' },
}

type Props = { searchParams: Promise<{ siparis?: string; email?: string }> }

export default async function OrderTrackingPage({ searchParams }: Props) {
  const sp = await searchParams
  const ilkNo = (sp.siparis ?? '').slice(0, 40)
  const ilkEmail = (sp.email ?? '').slice(0, 100)
  const crumbs: Crumb[] = [{ label: 'Ana Sayfa', href: '/' }, { label: 'Sipariş Takip' }]

  return (
    <>
      <PageHero
        eyebrow="Müşteri hizmetleri"
        title="Sipariş Takip"
        description="Sipariş numaranız ve e-posta adresinizle siparişinizin durumunu ve kargo takip numarasını görebilirsiniz."
        crumbs={crumbs}
      />

      <PageBody>
        <SiparisSorgu ilkNo={ilkNo} ilkEmail={ilkEmail} />
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Prose>
            <h2>Hangi bilgileri hazır bulundurmalısınız?</h2>
            <p>
              Size hızlı dönebilmemiz için şu iki bilgi yeterli:
            </p>
            <ul>
              <li>
                <strong>Sipariş numaranız</strong> — ödeme tamamlandığında ekranda gösterilir
                (OCM ile başlar).
              </li>
              <li>
                <strong>Sipariş sırasında verdiğiniz telefon numarası ya da e-posta adresi</strong> —
                siparişin size ait olduğunu doğrulamak için.
              </li>
            </ul>
            <p>
              Sipariş numaranızı bulamıyorsanız, sipariş verdiğiniz telefon numarasını söylemeniz de
              yeterlidir.
            </p>

            <h2>Siparişim ne durumda olabilir?</h2>
            <ul>
              <li>
                <strong>Hazırlanıyor</strong> — ödeme alındı, ürünler toplanıyor. Stoklu ürünlerde
                bu aşama aynı gün tamamlanır.
              </li>
              <li>
                <strong>Kargoya verildi</strong> — takip numarası oluşturuldu, kargo firmasının
                sistemine düştü.
              </li>
              <li>
                <strong>Tedarik bekliyor</strong> — siparişinizde stokta olmayan bir kalem var. Bu
                durumda sizi arayıp seçenekleri konuşuruz: bekleyebilir, kalemleri ayırıp stoklu
                olanları önce gönderebilir ya da iptal edebilirsiniz.
              </li>
            </ul>
            <p>
              Kargoya verildikten sonraki hareketleri kargo firmasının kendi takip ekranından da
              izleyebilirsiniz; takip numarasını size ilettiğimizde birlikte gönderiyoruz.
            </p>

            <h2>Teslimat süresi ve iade</h2>
            <p>
              Sevkiyat saatleri ve kargo ücreti için{' '}
              <Link href="/kargo-teslimat" title="Kargo & Teslimat sayfasına git">kargo &amp; teslimat</Link>, iade koşulları için{' '}
              <Link href="/iade-degisim" title="İade & Değişim sayfasına git">iade &amp; değişim</Link> sayfasına bakabilirsiniz.
            </p>
          </Prose>

          <div className="space-y-3">
            <Kanal
              icon={MessageCircle}
              title="WhatsApp"
              value={SITE.phoneDisplay}
              href={SITE.whatsappHref}
              external
              note="En hızlı yanıt buradan gelir."
            />
            <Kanal
              icon={Phone}
              title="Telefon"
              value={SITE.phoneDisplay}
              href={SITE.phoneHref}
              note={SITE.workingHours}
            />
            <Kanal
              icon={Mail}
              title="E-posta"
              value={SITE.email}
              href={SITE.emailHref}
              note="Sipariş numaranızı konu satırına yazın."
            />
          </div>
        </div>
      </PageBody>
    </>
  )
}

function Kanal({
  icon: Icon,
  title,
  value,
  href,
  note,
  external,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>
  title: string
  value: string
  href: string
  note: string
  external?: boolean
}) {
  return (
    <Card className="flex gap-4 p-5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-600">
        <Icon size={18} strokeWidth={2} aria-hidden />
      </span>
      <span className="min-w-0">
        <b className="block text-[11.5px] font-semibold tracking-wider text-ink-400 uppercase">
          {title}
        </b>
        <a
          href={href}
          {...(external ? { target: '_blank', rel: DIS_BAGLANTI_REL } : {})}
          title={`${title} — ${value}`}
          className="mt-0.5 block text-[15px] font-semibold text-ink-900 transition-colors hover:text-brand-600"
        >
          {value}
        </a>
        <p className="mt-1 text-[12.5px] text-ink-600">{note}</p>
      </span>
    </Card>
  )
}
