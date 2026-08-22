import type { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { PageBody, PageHero } from '@/components/layout/page-shell'
import { SITE } from '@/lib/site'
import type { Crumb } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular',
  description:
    'Uyumluluk, sipariş, kargo, iade ve ödeme konularında en sık sorulan soruların cevapları.',
  alternates: { canonical: '/sikca-sorulan-sorular' },
}

type Soru = { q: string; a: React.ReactNode; plain: string }
type Grup = { baslik: string; sorular: Soru[] }

const GRUPLAR: Grup[] = [
  {
    baslik: 'Uyumluluk',
    sorular: [
      {
        q: 'Ürünün aracıma uyduğundan nasıl emin olurum?',
        plain:
          'Aracınızı marka, model ve motor sırasıyla seçin. Uyumluluk motor kodu seviyesinde tutulur; doğrulanmış eşleşmelerde yeşil “Aracınıza uygun” rozeti çıkar.',
        a: (
          <>
            Aracınızı <strong>marka → model → motor</strong> sırasıyla seçin. Uyumluluk model
            seviyesinde değil, <strong>motor kodu seviyesinde</strong> tutulur. Doğrulanmış
            eşleşmelerde ürün sayfasında yeşil “Aracınıza uygun” rozeti görürsünüz.
          </>
        ),
      },
      {
        q: '“Uyumluluk teyit edilmedi” yazıyorsa ne yapmalıyım?',
        plain:
          'Bu, ürünün uymadığı anlamına gelmez; elimizde doğrulanmış bir kayıt olmadığı anlamına gelir. Şasi numaranızı gönderin, doğrulayalım.',
        a: (
          <>
            Bu ifade ürünün <em>uymadığı</em> anlamına gelmez; elimizde{' '}
            <strong>doğrulanmış bir kayıt olmadığı</strong> anlamına gelir. Emin olmadığımız bir şeyi
            emin gibi göstermiyoruz. Ruhsatınızdaki şasi (VIN) numarasını gönderin, doğrulamayı biz
            yapalım.
          </>
        ),
      },
      {
        q: 'Aynı model araçta neden farklı filtreler çıkıyor?',
        plain:
          'Aynı marka ve modelin farklı motor seçenekleri çoğu zaman farklı filtre kullanır. Bu yüzden motor seçimi şart.',
        a: (
          <>
            Aynı marka ve modelin farklı motor seçenekleri çoğu zaman farklı ölçüde filtre kullanır.
            Sadece model seçmek yeterli değildir; bu yüzden akışta motor adımı zorunludur.
          </>
        ),
      },
      {
        q: 'Elimde eski parçanın numarası var, onunla arayabilir miyim?',
        plain:
          'Evet. Arama kutusuna parça kodunu ya da OEM numarasını yazabilirsiniz; tire, boşluk ve nokta farkları yok sayılır.',
        a: (
          <>
            Evet. <Link href="/arama">Arama kutusuna</Link> parça kodunu, SKU’yu ya da OEM numarasını
            yazabilirsiniz. Numaradaki tire, boşluk ve nokta farkları yok sayılarak eşleştirme
            yapılır. Ayrıntı için{' '}
            <Link href="/blog/oem-numarasi-ile-parca-bulma">OEM numarasıyla parça bulma</Link>{' '}
            yazımıza bakabilirsiniz.
          </>
        ),
      },
    ],
  },
  {
    baslik: 'Sipariş ve kargo',
    sorular: [
      {
        q: 'Siparişim ne zaman kargoya verilir?',
        plain:
          "Saat 16:00'ya kadar verilen ve stokta bulunan siparişler aynı gün kargoya teslim edilir.",
        a: (
          <>
            Saat 16:00’ya kadar verilen ve <strong>stokta bulunan</strong> siparişler aynı gün
            kargoya teslim edilir. Ayrıntılar{' '}
            <Link href="/kargo-teslimat">kargo &amp; teslimat sayfasında</Link>.
          </>
        ),
      },
      {
        q: 'Kargo ücreti ne kadar?',
        plain: '500 ₺ ve üzeri siparişlerde kargo ücretsizdir. Altındaki tutarlarda ödeme adımında gösterilir.',
        a: (
          <>
            <strong>500 ₺ ve üzeri</strong> siparişlerde kargo ücretsizdir. Bu tutarın altındaki
            siparişlerde kargo bedeli, ödeme adımında toplama eklenmeden önce açıkça gösterilir.
          </>
        ),
      },
      {
        q: 'Siparişimi nasıl takip ederim?',
        plain:
          'Sipariş numaranızla telefon, WhatsApp veya e-posta üzerinden bize ulaşarak durumu öğrenebilirsiniz.',
        a: (
          <>
            Sipariş numaranızla bize ulaşın; durumu ve kargo takip numarasını iletelim.{' '}
            <Link href="/siparis-takip">Sipariş takip sayfasında</Link> hangi bilgileri hazır
            bulundurmanız gerektiği yazıyor.
          </>
        ),
      },
    ],
  },
  {
    baslik: 'İade ve ödeme',
    sorular: [
      {
        q: 'Ürünü iade edebilir miyim?',
        plain:
          'Teslim tarihinden itibaren 14 gün içinde, ürün takılmamış ve ambalajı bozulmamışsa sebep göstermeden iade edebilirsiniz.',
        a: (
          <>
            Teslim tarihinden itibaren <strong>14 gün içinde</strong>, ürün takılmamış ve ambalajı
            bozulmamışsa sebep göstermeden iade edebilirsiniz. Koşullar{' '}
            <Link href="/iade-degisim">iade &amp; değişim sayfasında</Link>.
          </>
        ),
      },
      {
        q: 'Yanlış parça geldi, kargo ücretini ben mi ödeyeceğim?',
        plain: 'Hayır. Bizim kaynaklandığımız bir hatada tüm kargo masrafı bize aittir.',
        a: (
          <>
            Hayır. Yanlış gönderim ya da bizim kaynaklandığımız bir uyumluluk hatasında{' '}
            <strong>tüm kargo masrafı bize aittir</strong>.
          </>
        ),
      },
      {
        q: 'Hangi ödeme yöntemlerini kullanabilirim?',
        plain:
          '3D Secure destekli sanal POS ile kredi kartı (taksit dâhil) ve havale/EFT seçenekleri bulunur.',
        a: (
          <>
            3D Secure destekli sanal POS üzerinden kredi kartı (taksit dâhil) ve havale/EFT ile
            ödeme yapılabilir. Havale ile ödemede sipariş, ödeme onayının ardından hazırlanır.
          </>
        ),
      },
      {
        q: 'Kurumsal fatura kesiliyor mu?',
        plain: 'Evet. Şirket adına fatura kesilir; toptan alımlar için ayrı koşullar uygulanır.',
        a: (
          <>
            Evet, şirket adına fatura kesilir. Düzenli ve yüksek adetli alım yapıyorsanız{' '}
            <Link href="/bayilik-toptan">bayilik &amp; toptan koşullarına</Link> bakın.
          </>
        ),
      },
    ],
  },
]

export default function FaqPage() {
  const crumbs: Crumb[] = [{ label: 'Ana Sayfa', href: '/' }, { label: 'Sıkça Sorulan Sorular' }]

  // Schema.org FAQPage — arama sonuçlarında soru/cevap olarak görünebilmesi için.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: GRUPLAR.flatMap((g) =>
      g.sorular.map((s) => ({
        '@type': 'Question',
        name: s.q,
        acceptedAnswer: { '@type': 'Answer', text: s.plain },
      })),
    ),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        eyebrow="Yardım"
        title="Sıkça Sorulan Sorular"
        description="Aradığınız cevabı bulamazsanız bize yazın; hafta içi mesai saatlerinde hızlıca dönüyoruz."
        crumbs={crumbs}
      />

      <PageBody>
        <div className="space-y-10">
          {GRUPLAR.map((grup) => (
            <section key={grup.baslik}>
              <span className="ocm-eyebrow">{grup.baslik}</span>
              <div className="mt-4 space-y-3">
                {grup.sorular.map((s) => (
                  <Card key={s.q} className="overflow-hidden">
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[14.5px] font-semibold text-ink-900 transition-colors hover:text-brand-600">
                        {s.q}
                        <span
                          aria-hidden="true"
                          className="shrink-0 text-[18px] leading-none font-normal text-ink-400 transition-transform duration-200 group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <div className="border-t border-ink-100 px-5 py-4 text-[13.5px] leading-relaxed text-ink-600 [&_a]:text-brand-600 [&_a]:underline [&_a]:underline-offset-2">
                        {s.a}
                      </div>
                    </details>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        <Card className="mt-10 p-6">
          <b className="block text-sm font-semibold text-ink-900">Cevabını bulamadınız mı?</b>
          <p className="mt-1.5 text-[13px] text-ink-600">
            <a href={SITE.phoneHref} className="font-semibold text-brand-600 hover:underline">
              {SITE.phoneDisplay}
            </a>{' '}
            · {SITE.workingHours} ·{' '}
            <Link href="/iletisim" prefetch={false} className="font-semibold text-brand-600 hover:underline">
              İletişim sayfası
            </Link>
          </p>
        </Card>
      </PageBody>
    </>
  )
}
