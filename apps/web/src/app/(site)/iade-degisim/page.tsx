import type { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { PageBody, PageHero, Prose } from '@/components/layout/page-shell'
import { DIS_BAGLANTI_REL, SITE } from '@/lib/site'
import type { Crumb } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'İade & Değişim',
  description:
    '14 gün içinde koşulsuz cayma hakkı, yanlış parça durumunda ücretsiz değişim ve iade sürecinin adımları.',
  alternates: { canonical: '/iade-degisim' },
}

export default function ReturnsPage() {
  const crumbs: Crumb[] = [{ label: 'Ana Sayfa', href: '/' }, { label: 'İade & Değişim' }]

  return (
    <>
      <PageHero
        eyebrow="Müşteri hizmetleri"
        title="İade & Değişim"
        description="Yanlış parça aldıysanız ya da fikrinizi değiştirdiyseniz süreç basittir. Aşağıda ne yapmanız gerektiği adım adım yazıyor."
        crumbs={crumbs}
      />

      <PageBody>
        <div className="grid gap-4 md:grid-cols-3">
          <Ozet baslik="Cayma süresi" deger="14 gün" not="Teslim aldığınız tarihten itibaren, sebep belirtmeden." />
          <Ozet baslik="Bizim hatamızsa" deger="Kargo bize ait" not="Yanlış ya da hatalı gönderimde değişim masrafı bizdedir." />
          <Ozet baslik="Geri ödeme" deger="Aynı yöntemle" not="Ödemeyi hangi yolla yaptıysanız iade de o yolla yapılır." />
        </div>

        <div className="mt-10">
          <Prose>
            <h2>14 gün içinde koşulsuz iade</h2>
            <p>
              Ürünü teslim aldığınız tarihten itibaren <strong>14 gün içinde</strong> hiçbir gerekçe
              göstermeden cayma hakkınızı kullanabilirsiniz. Bu, mesafeli satış mevzuatından doğan
              yasal hakkınızdır; ayrıntılar{' '}
              <Link href="/mesafeli-satis-sozlesmesi" title="Mesafeli Satış Sözleşmesi metnini oku">mesafeli satış sözleşmesinde</Link>.
            </p>

            <h2>İade edilebilmesi için ürün nasıl olmalı?</h2>
            <ul>
              <li>Orijinal ambalajı ile birlikte, ambalaj tahrip edilmemiş olmalı.</li>
              <li>
                <strong>Takılmamış ve kullanılmamış</strong> olmalı. Araca takılıp sökülen bir filtre
                yeniden satılamaz; bu ürünler iade alınamaz.
              </li>
              <li>Fatura ve varsa hediye/aksesuar içeriği eksiksiz olmalı.</li>
              <li>
                Yağ, antifriz, fren hidroliği gibi <strong>ambalajı açılmış sıvı ürünler</strong>{' '}
                sağlık ve güvenlik gerekçesiyle iade alınamaz. Açılmamış ambalajda sorun yoktur.
              </li>
            </ul>

            <h2>Yanlış parça geldiyse</h2>
            <p>
              Sipariş ettiğinizden farklı bir ürün geldiyse ya da uyumluluk bilgisi bizim
              kaynaklandığımız bir hata içeriyorsa, <strong>tüm kargo masrafı bize aittir</strong>.
              Doğru ürünü gönderir, yanlış gelen ürünü aynı kargoyla geri alırız. Bu durumda
              14 günlük süre şartı aranmaz.
            </p>
            <p>
              Uyumluluk bilgisini motor kodu seviyesinde tutuyoruz ve doğrulanmamış eşleşmeleri
              açıkça işaretliyoruz. Yine de bir hata olduysa düzeltmek bizim işimiz.
            </p>

            <h2>Adım adım süreç</h2>
            <ol>
              <li>
                Sipariş numaranız ve iade etmek istediğiniz ürünle birlikte bize ulaşın (telefon,
                WhatsApp ya da e-posta).
              </li>
              <li>Size iade için kullanacağınız kargo bilgisini iletelim.</li>
              <li>Ürünü faturasıyla birlikte paketleyip kargoya verin.</li>
              <li>
                Ürün elimize ulaştıktan sonra kontrol edilir; uygunsa geri ödeme{' '}
                <strong>aynı ödeme yöntemiyle</strong> başlatılır.
              </li>
            </ol>
            <p>
              Kredi kartına yapılan iadelerde tutarın kartınıza yansıması bankanıza bağlı olarak
              birkaç iş günü sürebilir; bu süre bankanın işleyişindedir.
            </p>

            <h2>Değişim</h2>
            <p>
              Ölçü ya da uyumluluk nedeniyle değişim istiyorsanız iade sürecinin aynısı işler;
              yeni ürün, iade onaylandıktan sonra gönderilir. Aradaki fiyat farkı varsa tahsil ya da
              iade edilir.
            </p>
          </Prose>
        </div>

        <Card className="mt-10 p-6">
          <b className="block text-sm font-semibold text-ink-900">İade başlatmak için</b>
          <p className="mt-1.5 text-[13px] text-ink-600">
            Sipariş numaranızla{' '}
            <a href={SITE.phoneHref} title={`${SITE.phoneDisplay} numarasını ara`} className="font-semibold text-brand-600 hover:underline">
              {SITE.phoneDisplay}
            </a>
            ,{' '}
            <a href={SITE.whatsappHref} title={`WhatsApp'tan ${SITE.phoneDisplay} numarasına yazın`}
              target="_blank"
              rel={DIS_BAGLANTI_REL}
              className="font-semibold text-brand-600 hover:underline"
            >
              WhatsApp
            </a>{' '}
            ya da{' '}
            <a href={SITE.emailHref} title={`${SITE.email} adresine e-posta gönder`} className="font-semibold text-brand-600 hover:underline">
              {SITE.email}
            </a>{' '}
            üzerinden ulaşın.
          </p>
        </Card>
      </PageBody>
    </>
  )
}

function Ozet({ baslik, deger, not }: { baslik: string; deger: string; not: string }) {
  return (
    <Card className="p-5">
      <span className="text-[11.5px] font-semibold tracking-wider text-ink-400 uppercase">
        {baslik}
      </span>
      <b className="mt-1.5 block text-[20px] font-bold tracking-tight text-ink-900">{deger}</b>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-600">{not}</p>
    </Card>
  )
}
