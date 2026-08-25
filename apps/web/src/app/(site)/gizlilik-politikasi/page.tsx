import type { Metadata } from 'next'
import Link from 'next/link'
import { PageBody, PageHero, Prose, EksikKunyeUyarisi } from '@/components/layout/page-shell'
import { SITE } from '@/lib/site'
import type { Crumb } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası',
  description:
    'Oto Center Market’te hangi bilgilerin toplandığı, nasıl kullanıldığı, kimlerle paylaşıldığı ve verilerinizi nasıl koruduğumuz.',
  alternates: { canonical: '/gizlilik-politikasi' },
}

export default function PrivacyPage() {
  const crumbs: Crumb[] = [{ label: 'Ana Sayfa', href: '/' }, { label: 'Gizlilik Politikası' }]

  return (
    <>
      <PageHero
        eyebrow="Hukuki"
        title="Gizlilik Politikası"
        description="Bu politika, siteyi kullandığınızda hangi bilgilerin toplandığını ve bunlarla ne yapıldığını açıklar."
        crumbs={crumbs}
      />

      <PageBody>
        <Prose>
          <h2>1. Kapsam</h2>
          <p>
            Bu politika {SITE.name} tarafından işletilen web sitesi için geçerlidir. Kişisel
            verilerin işlenmesine ilişkin yasal aydınlatma ayrıca{' '}
            <Link href="/kvkk" title="KVKK Aydınlatma Metni metnini oku">KVKK Aydınlatma Metni</Link> içinde yer alır; çerezler için{' '}
            <Link href="/cerez-politikasi" title="Çerez Politikası metnini oku">Çerez Politikası</Link> geçerlidir.
          </p>

          <h2>2. Hangi bilgileri topluyoruz?</h2>
          <h3>Sizin verdiğiniz bilgiler</h3>
          <ul>
            <li>Sipariş sırasında: ad soyad, telefon, e-posta, teslimat ve fatura adresi.</li>
            <li>
              Destek talebinde: aracınızın marka/model/motor bilgisi ve — siz iletirseniz — şasi
              (VIN) numarası.
            </li>
            <li>Bize yazdığınız mesajların içeriği.</li>
          </ul>

          <h3>Otomatik toplanan bilgiler</h3>
          <ul>
            <li>IP adresi, tarayıcı ve işletim sistemi bilgisi,</li>
            <li>Ziyaret ettiğiniz sayfalar ve site içi gezinme hareketleri,</li>
            <li>
              Seçtiğiniz aracı hatırlamak için tarayıcınızda tutulan tercih bilgisi (zorunlu çerez).
            </li>
          </ul>

          <h2>3. Ödeme bilgileri</h2>
          <p>
            <strong>Kredi kartı bilgileriniz sunucularımızda saklanmaz ve tarafımızca görülmez.</strong>{' '}
            Ödeme, banka veya ödeme kuruluşunun 3D Secure destekli sanal POS altyapısı üzerinden
            alınır; kart verisi doğrudan ilgili kuruluşa iletilir. Bize yalnızca ödemenin başarılı
            olup olmadığı bilgisi döner.
          </p>

          <h2>4. Bilgileri ne için kullanıyoruz?</h2>
          <ul>
            <li>Siparişinizi hazırlamak, göndermek ve faturalandırmak,</li>
            <li>Parça uyumluluğunu doğrulamak ve teknik destek vermek,</li>
            <li>İade, değişim ve garanti taleplerini yürütmek,</li>
            <li>Site güvenliğini sağlamak ve kötüye kullanımı önlemek,</li>
            <li>Yalnızca izin verdiyseniz kampanya duyurusu göndermek.</li>
          </ul>
          <p>
            Bilgilerinizi <strong>satmıyoruz</strong> ve reklam amacıyla üçüncü kişilerle
            paylaşmıyoruz.
          </p>

          <h2>5. Kimlerle paylaşıyoruz?</h2>
          <p>
            Yalnızca hizmetin verilebilmesi için zorunlu olan taraflarla ve zorunlu olduğu ölçüde:
            kargo firması (teslimat için ad, adres, telefon), banka/ödeme kuruluşu (ödeme için),
            mali müşavir (yasal kayıtlar için) ve mevzuatın zorunlu kıldığı hâllerde yetkili kamu
            kurumları.
          </p>

          <h2>6. Veri güvenliği</h2>
          <ul>
            <li>Site trafiği HTTPS ile şifrelenir.</li>
            <li>Yönetim paneline erişim parola ile korunur ve yetkilendirilmiş kişilerle sınırlıdır.</li>
            <li>Ödeme verisi hiçbir aşamada sistemimize düşmez.</li>
            <li>Veritabanı erişimi kısıtlıdır ve yalnızca gerekli işlemler için kullanılır.</li>
          </ul>
          <p>
            Hiçbir sistem yüzde yüz güvenli değildir; buna rağmen bir güvenlik ihlali yaşanırsa,
            mevzuatın öngördüğü sürelerde sizi ve Kişisel Verileri Koruma Kurulu’nu bilgilendiririz.
          </p>

          <h2>7. Saklama süresi</h2>
          <p>
            Verilerinizi işleme amacı sürdüğü ve mevzuatın öngördüğü saklama süreleri boyunca
            tutarız. Süre dolduğunda silinir, yok edilir veya anonim hâle getirilir.
          </p>

          <h2>8. Haklarınız</h2>
          <p>
            Verilerinize erişme, düzeltme, silme ve işlemeye itiraz etme haklarınız vardır.
            Ayrıntılar ve başvuru yolu <Link href="/kvkk" title="KVKK Aydınlatma Metni metnini oku">KVKK Aydınlatma Metni</Link> içinde yer
            alır. Talepleriniz için <a href={SITE.emailHref} title={`${SITE.email} adresine e-posta gönder`}>{SITE.email}</a>.
          </p>

          <h2>9. Çocukların gizliliği</h2>
          <p>
            Site 18 yaşından küçüklere yönelik değildir ve bilerek çocuklardan kişisel veri
            toplamayız.
          </p>

          <h2>10. Değişiklikler</h2>
          <p>
            Bu politika zaman zaman güncellenebilir. Esaslı bir değişiklik olduğunda site üzerinden
            duyururuz. Sorularınız için{' '}
            <Link href="/iletisim" title="İletişim sayfasına git">iletişim sayfamızdan</Link> bize ulaşabilirsiniz.
          </p>
        </Prose>

        <EksikKunyeUyarisi />
      </PageBody>
    </>
  )
}
