import type { Metadata } from 'next'
import Link from 'next/link'
import { PageBody, PageHero, Prose, EksikKunyeUyarisi } from '@/components/layout/page-shell'
import { SITE } from '@/lib/site'
import type { Crumb } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni',
  description:
    '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinizin hangi amaçla işlendiği, kimlere aktarıldığı ve haklarınız.',
  alternates: { canonical: '/kvkk' },
}

export default function KvkkPage() {
  const crumbs: Crumb[] = [{ label: 'Ana Sayfa', href: '/' }, { label: 'KVKK' }]

  return (
    <>
      <PageHero
        eyebrow="Hukuki"
        title="KVKK Aydınlatma Metni"
        description="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında hazırlanmıştır."
        crumbs={crumbs}
      />

      <PageBody>
        <Prose>
          <h2>1. Veri sorumlusu</h2>
          <p>
            {SITE.name} olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca veri
            sorumlusu sıfatıyla hareket ediyoruz.
          </p>
          <p>
            <strong>Adres:</strong> {SITE.address}
            <br />
            <strong>Telefon:</strong> {SITE.phoneDisplay}
            <br />
            <strong>E-posta:</strong> {SITE.email}
          </p>

          <h2>2. Hangi kişisel verileri işliyoruz?</h2>
          <ul>
            <li>
              <strong>Kimlik ve iletişim bilgileri:</strong> ad soyad, telefon numarası, e-posta
              adresi, teslimat ve fatura adresi.
            </li>
            <li>
              <strong>Müşteri işlem bilgileri:</strong> sipariş içeriği, sipariş numarası, iade ve
              değişim talepleri, tarafımıza ilettiğiniz yazışmalar.
            </li>
            <li>
              <strong>Araç bilgileri:</strong> parça uyumluluğu doğrulaması için tarafımıza
              ilettiğiniz marka, model, motor ve — talep etmeniz hâlinde — şasi (VIN) numarası.
            </li>
            <li>
              <strong>İşlem güvenliği bilgileri:</strong> IP adresi, tarayıcı ve cihaz bilgisi,
              site içi gezinme kayıtları.
            </li>
          </ul>
          <p>
            <strong>Kredi kartı bilgileriniz tarafımızca saklanmaz.</strong> Ödeme işlemleri, banka
            veya ödeme kuruluşunun sanal POS altyapısı üzerinden yürütülür; kart verisi doğrudan
            ilgili kuruluşa iletilir.
          </p>

          <h2>3. İşleme amaçlarımız</h2>
          <ul>
            <li>Siparişin alınması, hazırlanması, kargolanması ve teslim edilmesi,</li>
            <li>Faturalandırma ve muhasebe kayıtlarının tutulması,</li>
            <li>Parça uyumluluğunun doğrulanması ve teknik destek verilmesi,</li>
            <li>İade, değişim ve garanti süreçlerinin yürütülmesi,</li>
            <li>Talebiniz hâlinde kampanya ve duyuruların iletilmesi,</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi ve hukuki taleplere yanıt verilmesi.</li>
          </ul>

          <h2>4. Hukuki sebepler</h2>
          <p>Kişisel verileriniz KVKK md. 5 kapsamında şu sebeplerle işlenir:</p>
          <ul>
            <li>Sözleşmenin kurulması ve ifası için gerekli olması (sipariş süreci),</li>
            <li>Hukuki yükümlülüğün yerine getirilmesi (fatura, muhasebe, saklama süreleri),</li>
            <li>Meşru menfaat (dolandırıcılığın önlenmesi, hizmet kalitesinin ölçülmesi),</li>
            <li>
              Açık rızanız (pazarlama iletişimi ve zorunlu olmayan çerezler — dilediğiniz an geri
              alabilirsiniz).
            </li>
          </ul>

          <h2>5. Kimlere aktarılıyor?</h2>
          <p>
            Verileriniz yalnızca hizmetin verilebilmesi için zorunlu olduğu ölçüde aktarılır:
          </p>
          <ul>
            <li>
              <strong>Kargo firmaları</strong> — teslimat için ad, adres ve telefon bilgisi,
            </li>
            <li>
              <strong>Banka / ödeme kuruluşu</strong> — ödemenin alınması için,
            </li>
            <li>
              <strong>Mali müşavir ve muhasebe hizmeti</strong> — fatura ve yasal kayıtlar için,
            </li>
            <li>
              <strong>Yetkili kamu kurumları</strong> — yalnızca mevzuatın zorunlu kıldığı hâllerde.
            </li>
          </ul>
          <p>Kişisel verileriniz pazarlama amacıyla üçüncü kişilere satılmaz.</p>

          <h2>6. Saklama süresi</h2>
          <p>
            Veriler, işleme amacının gerektirdiği süre boyunca ve mevzuatın öngördüğü zamanaşımı /
            saklama süreleri (ör. ticari defter ve fatura kayıtları için 10 yıl) boyunca saklanır.
            Süre dolduğunda silinir, yok edilir veya anonim hâle getirilir.
          </p>

          <h2>7. Haklarınız (KVKK md. 11)</h2>
          <ul>
            <li>Kişisel verinizin işlenip işlenmediğini öğrenme,</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
            <li>Yurt içinde veya dışında aktarıldığı üçüncü kişileri bilme,</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
            <li>Şartları oluşmuşsa silinmesini veya yok edilmesini isteme,</li>
            <li>Bu işlemlerin aktarım yapılan üçüncü kişilere bildirilmesini isteme,</li>
            <li>Otomatik sistemlerle analiz sonucu aleyhinize bir sonuç doğmasına itiraz etme,</li>
            <li>Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li>
          </ul>

          <h2>8. Başvuru</h2>
          <p>
            Haklarınızı kullanmak için taleplerinizi{' '}
            <a href={SITE.emailHref} title={`${SITE.email} adresine e-posta gönder`}>
              {SITE.email}
            </a> adresine e-posta ile ya da yukarıdaki adrese
            yazılı olarak iletebilirsiniz. Başvurunuz en geç <strong>30 gün</strong> içinde
            sonuçlandırılır. Kimliğinizi doğrulayamadığımız başvurular, veri güvenliği gereği
            yanıtlanamaz.
          </p>

          <h2>9. İlgili diğer metinler</h2>
          <p>
            <Link href="/gizlilik-politikasi" title="Gizlilik Politikası metnini oku">Gizlilik Politikası</Link> ·{' '}
            <Link href="/cerez-politikasi" title="Çerez Politikası metnini oku">Çerez Politikası</Link> ·{' '}
            <Link href="/mesafeli-satis-sozlesmesi" title="Mesafeli Satış Sözleşmesi metnini oku">Mesafeli Satış Sözleşmesi</Link>
          </p>
        </Prose>

        <EksikKunyeUyarisi />
      </PageBody>
    </>
  )
}
