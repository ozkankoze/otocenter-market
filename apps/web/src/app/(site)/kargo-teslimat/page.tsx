import type { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { PageBody, PageHero, Prose } from '@/components/layout/page-shell'
import { DIS_BAGLANTI_REL, SITE } from '@/lib/site'
import type { Crumb } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Kargo & Teslimat',
  description:
    'Oto Center Market kargo ve teslimat koşulları: 500 ₺ üzeri ücretsiz kargo, 16:00’ya kadar verilen stoklu siparişlerde aynı gün sevkiyat.',
  alternates: { canonical: '/kargo-teslimat' },
}

export default function ShippingPage() {
  const crumbs: Crumb[] = [{ label: 'Ana Sayfa', href: '/' }, { label: 'Kargo & Teslimat' }]

  return (
    <>
      <PageHero
        eyebrow="Müşteri hizmetleri"
        title="Kargo & Teslimat"
        description="Siparişinizin ne zaman çıkacağını ve elinize ne zaman ulaşacağını baştan bilmenizi istiyoruz."
        crumbs={crumbs}
      />

      <PageBody>
        <div className="grid gap-4 md:grid-cols-3">
          <Ozet baslik="Ücretsiz kargo sınırı" deger="500 ₺" not="500 ₺ ve üzeri siparişlerde kargo bizden; altı alıcı ödemeli." />
          <Ozet baslik="Aynı gün kargo saati" deger="16:00" not="Bu saate kadar verilen ve stokta olan siparişler aynı gün çıkar." />
          <Ozet baslik="Hazırlık süresi" deger="Stoklu ürünlerde aynı gün" not="Tedarik gereken ürünlerde süre ürün sayfasında yazar." />
        </div>

        <div className="mt-10">
          <Prose>
            <h2>Sipariş ne zaman kargoya verilir?</h2>
            <p>
              Stokta bulunan ürünlerde, saat 16:00’ya kadar verilen ve ödemesi tamamlanmış
              siparişler <strong>aynı gün</strong> kargoya teslim edilir. Bu saatten sonra verilen
              siparişler ertesi iş günü çıkar. Hafta sonu ve resmî tatillerde kargo firmaları
              çalışmadığı için sevkiyat ilk iş gününde yapılır.
            </p>

            <h2>Stokta olmayan ürünler</h2>
            <p>
              Bir ürün stokta yoksa ürün sayfasında tedarik süresi gösterilir. Siparişinizde hem
              stoklu hem tedarik gerektiren ürün varsa, isterseniz stoklu kalemleri önce
              gönderebiliriz; bunun için sipariş sonrası bize bildirmeniz yeterli.
            </p>
            <p>
              “Gelince göndeririz” diyerek süreci açık bırakmayız. Tedarik süresi uzarsa sizi
              bilgilendirir, dilerseniz siparişi iptal ederiz.
            </p>

            <h2>Kargo ücreti</h2>
            <p>
              Sepet tutarı <strong>500 ₺ ve üzerindeyse kargo ücretsizdir</strong>; bedeli biz
              öderiz. Bu tutarın altındaki siparişler <strong>alıcı ödemeli</strong> gönderilir: kargo bedeli teslimat sırasında kargo firmasına ödenir, sitede tahsil edilmez. Hangi durumun geçerli olduğu ödeme adımındaki sipariş
              özetinde, siz onaylamadan önce yazar.
            </p>

            <h2>Teslimat süresi</h2>
            <p>
              Kargoya verildikten sonraki teslim süresi kargo firmasının hizmet ağına ve teslimat
              adresine bağlıdır. Büyükşehirlerde genellikle 1–2 iş günü, diğer illerde 2–4 iş günü
              sürer. Bu süreler kargo firmasının taahhüdüdür; olağanüstü hava koşulları ve resmî
              tatillerde uzayabilir.
            </p>

            <h2>Teslim alırken nelere dikkat etmeli?</h2>
            <ul>
              <li>Paketi kargo görevlisinin yanında kontrol edin.</li>
              <li>
                Pakette ezilme, yırtılma ya da ıslanma varsa <strong>tutanak tutturun</strong> ve
                teslim almayın.
              </li>
              <li>
                Hasarlı teslimatı tutanaksız kabul ederseniz kargo firmasına karşı hak talebi
                zorlaşır.
              </li>
              <li>
                Ürün kutusunun içinde eksik ya da yanlış parça varsa teslimattan sonra en kısa
                sürede bize bildirin.
              </li>
            </ul>

            <h2>Yanlış parça gelirse</h2>
            <p>
              Bizim kaynaklı bir eşleştirme hatasında kargo bedeli bize aittir; değişimi biz
              üstleniriz. Ayrıntılar <Link href="/iade-degisim" title="İade & Değişim sayfasına git">iade &amp; değişim sayfasında</Link>.
            </p>
          </Prose>
        </div>

        <Card className="mt-10 p-6">
          <b className="block text-sm font-semibold text-ink-900">Siparişinizle ilgili soru mu var?</b>
          <p className="mt-1.5 text-[13px] text-ink-600">
            {SITE.workingHours} arasında{' '}
            <a href={SITE.phoneHref} title={`${SITE.phoneDisplay} numarasını ara`} className="font-semibold text-brand-600 hover:underline">
              {SITE.phoneDisplay}
            </a>{' '}
            numarasından ya da{' '}
            <a href={SITE.whatsappHref} title={`WhatsApp'tan ${SITE.phoneDisplay} numarasına yazın`}
              target="_blank"
              rel={DIS_BAGLANTI_REL}
              className="font-semibold text-brand-600 hover:underline"
            >
              WhatsApp
            </a>{' '}
            üzerinden ulaşabilirsiniz.
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
