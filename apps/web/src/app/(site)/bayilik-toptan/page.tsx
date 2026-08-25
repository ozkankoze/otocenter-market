import type { Metadata } from 'next'
import Link from 'next/link'
import { Building2, FileText, Percent, Truck, Wrench } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageBody, PageHero, Prose, SectionTitle } from '@/components/layout/page-shell'
import { DIS_BAGLANTI_REL, SITE } from '@/lib/site'
import type { Crumb } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Bayilik & Toptan',
  description:
    'Servisler, filo işletmeleri ve yedek parça satıcıları için toptan fiyatlandırma, cari hesap ve teknik destek. Oto Center Market bayilik koşulları.',
  alternates: { canonical: '/bayilik-toptan' },
}

const KIMLER = [
  {
    icon: Wrench,
    title: 'Servisler ve tamirhaneler',
    text: 'Periyodik bakım setlerini tek kalemde toplayın. Araç bazlı filtre setleri motor koduna göre eşleştirilir; yanlış parça riski ortadan kalkar.',
  },
  {
    icon: Truck,
    title: 'Filo işletmeleri',
    text: 'Araç listenizi bir kez tanımlayın; her bakım döneminde aynı ürün setini tekrar sipariş edin. Ağır vasıta grubunda kurutucu, AdBlue ve direksiyon filtreleri de dâhil.',
  },
  {
    icon: Building2,
    title: 'Yedek parça satıcıları',
    text: 'Raf kodu ve OEM eşleştirmeleriyle birlikte toplu liste alın. Stok yenilemede tekrar eden kalemler için sabit fiyat çalışıyoruz.',
  },
]

const AVANTAJLAR = [
  {
    icon: Percent,
    title: 'Adede göre fiyat',
    text: 'Fiyat, kalem sayısına ve düzenli alım hacmine göre belirlenir. Tek seferlik büyük alım ile düzenli küçük alım farklı değerlendirilir.',
  },
  {
    icon: FileText,
    title: 'Kurumsal faturalandırma',
    text: 'Şirket adına fatura, dönemsel ekstre ve cari hesap çalışma imkânı. Ödeme koşulları görüşmeye açıktır.',
  },
  {
    icon: Wrench,
    title: 'Teknik doğrulama',
    text: 'Şasi numarasıyla parça doğrulama hizmetinden bayilerimiz de yararlanır. Şüpheli bir eşleştirmede ürünü göndermeden önce teyit ederiz.',
  },
]

export default function DealerPage() {
  const crumbs: Crumb[] = [{ label: 'Ana Sayfa', href: '/' }, { label: 'Bayilik & Toptan' }]

  return (
    <>
      <PageHero
        eyebrow="Kurumsal"
        title="Bayilik & Toptan"
        description="Düzenli ve yüksek adetli alım yapan servisler, filolar ve yedek parça satıcılarıyla doğrudan çalışıyoruz."
        crumbs={crumbs}
      />

      <PageBody>
        <SectionTitle eyebrow="Kimler için" title="Kurumsal çalışma modelimiz" />
        <div className="grid gap-4 md:grid-cols-3">
          {KIMLER.map(({ icon: Icon, title, text }) => (
            <Card key={title} className="p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                <Icon size={18} strokeWidth={2} aria-hidden="true" />
              </span>
              <b className="mt-3.5 block text-sm font-semibold text-ink-900">{title}</b>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">{text}</p>
            </Card>
          ))}
        </div>

        <section className="mt-12">
          <SectionTitle eyebrow="Ne sağlıyoruz" title="Bayilik avantajları" />
          <div className="grid gap-4 md:grid-cols-3">
            {AVANTAJLAR.map(({ icon: Icon, title, text }) => (
              <Card key={title} className="flex gap-4 p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent-100 text-accent-700">
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

        <section className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Prose>
            <h2>Nasıl başvurulur?</h2>
            <p>
              Ayrı bir başvuru formu tutmuyoruz; süreci telefonda ya da WhatsApp üzerinden
              yürütüyoruz. Bize ulaşırken şu üç bilgiyi hazır bulundurmanız görüşmeyi hızlandırır:
            </p>
            <ol>
              <li>
                <strong>Faaliyet alanınız</strong> — servis, filo, perakende satış ya da diğer.
              </li>
              <li>
                <strong>Düzenli ihtiyaç duyduğunuz ürün grupları</strong> — örneğin hava/yağ/yakıt
                filtresi setleri, ağır vasıta kurutucu filtreleri.
              </li>
              <li>
                <strong>Yaklaşık aylık alım hacminiz</strong> — kalem sayısı ya da tutar olarak.
              </li>
            </ol>
            <p>
              Görüşmenin ardından size özel fiyat listesi ve çalışma koşullarını yazılı olarak
              iletiriz. Fiyat listesi araç grubuna ve markaya göre farklılık gösterir.
            </p>

            <h2>Katalog ve stok</h2>
            <p>
              Katalogun tamamını <Link href="/markalar" title="Ürün Markaları sayfasına git">marka</Link> ya da{' '}
              <Link href="/filtreler" title="Filtreler sayfasına git">kategori</Link> bazında inceleyebilirsiniz. Toplu alımlarda
              stokta olmayan kalemler için tedarik süresi baştan bildirilir; “gelince göndeririz”
              diye açık bırakmayız.
            </p>
          </Prose>

          <Card className="h-fit p-6">
            <span className="ocm-eyebrow">Doğrudan iletişim</span>
            <b className="mt-3 block text-[17px] font-semibold text-ink-900">
              Koşulları konuşalım
            </b>
            <p className="mt-2 text-[13px] leading-relaxed text-ink-600">
              {SITE.workingHours} arasında telefonla, dilediğiniz saatte WhatsApp üzerinden
              ulaşabilirsiniz.
            </p>
            <div className="mt-5 space-y-2.5">
              <Button asChild block>
                <a href={SITE.whatsappHref} title={`WhatsApp'tan ${SITE.phoneDisplay} numarasına yazın`} target="_blank" rel={DIS_BAGLANTI_REL}>
                  WhatsApp ile yazın
                </a>
              </Button>
              <Button asChild block variant="secondary">
                <a href={SITE.phoneHref} title={`${SITE.phoneDisplay} numarasını ara`}>{SITE.phoneDisplay}</a>
              </Button>
            </div>
            <p className="mt-4 border-t border-ink-100 pt-4 text-[12.5px] text-ink-600">
              E-posta:{' '}
              <a href={SITE.emailHref} title={`${SITE.email} adresine e-posta gönder`} className="text-brand-600 hover:underline">
                {SITE.email}
              </a>
            </p>
          </Card>
        </section>
      </PageBody>
    </>
  )
}
