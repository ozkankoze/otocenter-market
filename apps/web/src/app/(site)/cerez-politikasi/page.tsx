import type { Metadata } from 'next'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { PageBody, PageHero, Prose } from '@/components/layout/page-shell'
import { SITE } from '@/lib/site'
import type { Crumb } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Çerez Politikası',
  description:
    'Sitede hangi çerezlerin neden kullanıldığı, ne kadar süre saklandığı ve çerez tercihlerinizi nasıl yönetebileceğiniz.',
  alternates: { canonical: '/cerez-politikasi' },
}

/**
 * Tabloda YALNIZCA sitede gerçekten kullanılan çerezler yazılıdır.
 * Analitik ya da reklam çerezi bugün kullanılmıyor; "kullanmıyoruz" demek,
 * kullanılmayan bir çerezi listelemekten daha dürüst ve daha yararlı.
 */
const CEREZLER = [
  {
    ad: 'ocm.vehicle',
    tur: 'Zorunlu',
    amac: 'Seçtiğiniz aracı (marka, model, motor) hatırlar; her sayfada yeniden seçmek zorunda kalmazsınız.',
    sure: '1 yıl',
  },
  {
    ad: 'ocm.admin',
    tur: 'Zorunlu',
    amac: 'Yalnızca yönetim paneline giriş yapan yetkili kullanıcılar içindir. Normal ziyaretçilerde oluşmaz.',
    sure: 'Oturum süresi',
  },
]

export default function CookiePage() {
  const crumbs: Crumb[] = [{ label: 'Ana Sayfa', href: '/' }, { label: 'Çerez Politikası' }]

  return (
    <>
      <PageHero
        eyebrow="Hukuki"
        title="Çerez Politikası"
        description="Sitede kullanılan çerezlerin tamamı aşağıda listelenmiştir. Reklam ve takip çerezi kullanmıyoruz."
        crumbs={crumbs}
      />

      <PageBody>
        <Prose>
          <h2>1. Çerez nedir?</h2>
          <p>
            Çerez, bir web sitesini ziyaret ettiğinizde tarayıcınıza kaydedilen küçük bir metin
            dosyasıdır. Siteler bunları tercihlerinizi hatırlamak, oturumunuzu sürdürmek ya da
            kullanım istatistiği toplamak için kullanır.
          </p>

          <h2>2. Bu sitede hangi çerezler kullanılıyor?</h2>
          <p>
            Yalnızca sitenin çalışması için <strong>zorunlu</strong> çerezler kullanılıyor.
            Reklam, profilleme ya da üçüncü taraf takip çerezi <strong>kullanmıyoruz</strong>.
          </p>
        </Prose>

        <Card className="mt-5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-[13px]">
              <thead className="bg-ink-25 text-[11.5px] tracking-wider text-ink-600 uppercase">
                <tr>
                  <th className="px-4 py-3 font-semibold">Çerez</th>
                  <th className="px-4 py-3 font-semibold">Tür</th>
                  <th className="px-4 py-3 font-semibold">Amaç</th>
                  <th className="px-4 py-3 font-semibold">Süre</th>
                </tr>
              </thead>
              <tbody>
                {CEREZLER.map((c) => (
                  <tr key={c.ad} className="border-t border-ink-100 align-top">
                    <td className="ocm-code px-4 py-3 whitespace-nowrap">{c.ad}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex h-5 items-center rounded-sm bg-accent-100 px-2 text-[10.5px] font-semibold tracking-wide text-accent-700 uppercase">
                        {c.tur}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{c.amac}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-600">{c.sure}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Prose className="mt-8">
          <h2>3. Zorunlu çerezler neden reddedilemiyor?</h2>
          <p>
            Zorunlu çerezler sitenin temel işlevi için gereklidir ve kişisel profil oluşturmaz.
            Araç seçiminizi tutan çerez silinirse site çalışmaya devam eder; yalnızca aracınızı
            yeniden seçmeniz gerekir.
          </p>

          <h2>4. Çerezleri nasıl yönetirsiniz?</h2>
          <p>
            Tarayıcınızın ayarlarından çerezleri görüntüleyebilir, silebilir ya da engelleyebilirsiniz:
          </p>
          <ul>
            <li>
              <strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Üçüncü taraf çerezler
            </li>
            <li>
              <strong>Safari:</strong> Ayarlar → Gizlilik → Çerezleri yönet
            </li>
            <li>
              <strong>Firefox:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler ve Site Verileri
            </li>
            <li>
              <strong>Edge:</strong> Ayarlar → Çerezler ve site izinleri
            </li>
          </ul>
          <p>
            Tüm çerezleri engellerseniz araç seçimi gibi kolaylıklar çalışmaz; ürünleri görüntülemeye
            devam edebilirsiniz.
          </p>

          <h2>5. İleride analitik çerez eklenirse?</h2>
          <p>
            Analitik ya da pazarlama çerezi eklememiz hâlinde bu sayfa güncellenir ve bunlar için
            açık rızanız ayrıca alınır. Onay vermeden bu tür çerezler çalıştırılmaz.
          </p>

          <h2>6. İlgili metinler</h2>
          <p>
            <Link href="/kvkk" title="KVKK Aydınlatma Metni metnini oku">KVKK Aydınlatma Metni</Link> ·{' '}
            <Link href="/gizlilik-politikasi" title="Gizlilik Politikası metnini oku">Gizlilik Politikası</Link>
          </p>
          <p>
            Sorularınız için: <a href={SITE.emailHref} title={`${SITE.email} adresine e-posta gönder`}>{SITE.email}</a>
          </p>
        </Prose>
      </PageBody>
    </>
  )
}
