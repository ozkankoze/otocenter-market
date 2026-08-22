import type { Metadata } from 'next'
import Link from 'next/link'
import { PageBody, PageHero, Prose, EksikKunyeUyarisi } from '@/components/layout/page-shell'
import { SITE } from '@/lib/site'
import type { Crumb } from '@/components/ui/breadcrumb'

export const metadata: Metadata = {
  title: 'Mesafeli Satış Sözleşmesi',
  description:
    'Oto Center Market üzerinden verilen siparişlerde geçerli mesafeli satış sözleşmesi: teslimat, cayma hakkı, iade ve uyuşmazlık çözümü.',
  alternates: { canonical: '/mesafeli-satis-sozlesmesi' },
}

export default function DistanceSalesPage() {
  const crumbs: Crumb[] = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Mesafeli Satış Sözleşmesi' },
  ]

  return (
    <>
      <PageHero
        eyebrow="Hukuki"
        title="Mesafeli Satış Sözleşmesi"
        description="6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca düzenlenmiştir."
        crumbs={crumbs}
      />

      <PageBody>
        <Prose>
          <h2>Madde 1 — Taraflar</h2>
          <h3>1.1. Satıcı</h3>
          <p>
            <strong>Unvan:</strong> {SITE.name}
            <br />
            <strong>Adres:</strong> {SITE.address}
            <br />
            <strong>Telefon:</strong> {SITE.phoneDisplay}
            <br />
            <strong>E-posta:</strong> {SITE.email}
          </p>
          <h3>1.2. Alıcı</h3>
          <p>
            Sipariş sırasında bildirilen ad soyad, teslimat adresi, telefon ve e-posta bilgilerine
            sahip kişidir. Bu bilgiler sipariş özetinde ve faturada yer alır.
          </p>

          <h2>Madde 2 — Konu</h2>
          <p>
            Bu sözleşme, Alıcı’nın Satıcı’ya ait web sitesi üzerinden elektronik ortamda sipariş
            verdiği ürünlerin satışı ve teslimi ile tarafların hak ve yükümlülüklerini düzenler.
          </p>

          <h2>Madde 3 — Sözleşme konusu ürün ve ödeme</h2>
          <p>
            Ürünün türü, adedi, KDV dâhil satış fiyatı ve varsa kargo bedeli, sipariş
            tamamlanmadan önce sipariş özeti ekranında gösterilir ve sipariş onay bildirimiyle
            Alıcı’ya iletilir. Listelenen fiyatlar aksi belirtilmedikçe <strong>KDV dâhildir</strong>.
          </p>
          <p>
            Ödeme, 3D Secure destekli sanal POS üzerinden kredi kartı ile ya da havale/EFT ile
            yapılabilir. Havale ile ödemede sipariş, ödemenin Satıcı hesabına geçtiği tarihte
            işleme alınır.
          </p>

          <h2>Madde 4 — Teslimat</h2>
          <ul>
            <li>
              Ürün, Alıcı’nın sipariş sırasında bildirdiği adrese kargo firması aracılığıyla teslim
              edilir.
            </li>
            <li>
              Stokta bulunan ve saat 16:00’a kadar verilen siparişler aynı gün kargoya teslim
              edilir. Kargo süreleri kargo firmasının hizmet ağına bağlıdır.
            </li>
            <li>
              Sepet tutarı 500 ₺ ve üzerindeki siparişlerde kargo bedeli alınmaz; altındaki
              siparişlerde bedel sipariş özetinde gösterilir.
            </li>
            <li>
              Teslimat süresi, yasal azami süre olan <strong>30 günü</strong> aşamaz. Bu sürede
              teslim edilemezse Alıcı sözleşmeyi feshedebilir.
            </li>
            <li>
              Alıcı, teslim sırasında paketi kontrol etmekle yükümlüdür. Hasarlı pakette kargo
              görevlisine tutanak tutturulmalı ve ürün teslim alınmamalıdır.
            </li>
          </ul>
          <p>
            Ayrıntılar için <Link href="/kargo-teslimat">kargo &amp; teslimat sayfası</Link>.
          </p>

          <h2>Madde 5 — Cayma hakkı</h2>
          <p>
            Alıcı, ürünü teslim aldığı tarihten itibaren <strong>14 (on dört) gün</strong> içinde
            hiçbir gerekçe göstermeden ve cezai şart ödemeden sözleşmeden cayabilir. Cayma bildirimi
            yukarıdaki iletişim kanallarından Satıcı’ya iletilir.
          </p>
          <p>
            Cayma hakkının kullanılması hâlinde ürünün, faturası ve orijinal ambalajıyla birlikte
            eksiksiz olarak iade edilmesi gerekir. Satıcı, ürünü teslim aldığı tarihten itibaren
            <strong> 14 gün içinde</strong> toplam bedeli Alıcı’ya iade eder; iade, ödemenin
            yapıldığı yöntemle gerçekleştirilir.
          </p>

          <h2>Madde 6 — Cayma hakkının kullanılamayacağı hâller</h2>
          <p>
            Mesafeli Sözleşmeler Yönetmeliği md. 15 uyarınca aşağıdaki ürünlerde cayma hakkı
            kullanılamaz:
          </p>
          <ul>
            <li>
              <strong>Araca takılmış / kullanılmış ürünler.</strong> Takılıp sökülen bir filtre
              yeniden satılabilir durumda değildir.
            </li>
            <li>
              <strong>Ambalajı açılmış sıvı ürünler</strong> (motor yağı, antifriz, fren hidroliği,
              AdBlue) — sağlık ve hijyen gerekçesiyle.
            </li>
            <li>Alıcı’nın talebi üzerine özel olarak tedarik edilen, kişiye özel ürünler.</li>
          </ul>
          <p>
            Ambalajı açılmamış ve takılmamış ürünlerde cayma hakkı tam olarak geçerlidir.
          </p>

          <h2>Madde 7 — Ayıplı ürün ve yanlış gönderim</h2>
          <p>
            Ürünün ayıplı çıkması ya da siparişten farklı bir ürün gönderilmesi hâlinde tüm kargo ve
            değişim masrafı Satıcı’ya aittir; bu durumda 14 günlük süre şartı aranmaz. Süreç için{' '}
            <Link href="/iade-degisim">iade &amp; değişim sayfasına</Link> bakınız.
          </p>

          <h2>Madde 8 — Uyumluluk bilgisi</h2>
          <p>
            Sitedeki araç uyumluluğu bilgisi motor kodu seviyesinde tutulur ve doğrulanmamış
            eşleşmeler ürün sayfasında açıkça belirtilir. Alıcı, sipariş öncesinde uyumluluktan emin
            olmak için Satıcı’dan şasi (VIN) numarasıyla doğrulama talep edebilir. Doğrulanmamış
            olduğu açıkça belirtilen bir eşleşmeye rağmen sipariş verilmesi hâlinde ürün, cayma
            hakkı kapsamında iade edilebilir.
          </p>

          <h2>Madde 9 — Kişisel verilerin korunması</h2>
          <p>
            Alıcı’nın kişisel verileri <Link href="/kvkk">KVKK Aydınlatma Metni</Link> ve{' '}
            <Link href="/gizlilik-politikasi">Gizlilik Politikası</Link> kapsamında işlenir. Kredi
            kartı bilgileri Satıcı tarafından saklanmaz.
          </p>

          <h2>Madde 10 — Uyuşmazlık çözümü</h2>
          <p>
            Bu sözleşmeden doğan uyuşmazlıklarda, Ticaret Bakanlığı’nca her yıl belirlenen parasal
            sınırlar çerçevesinde Alıcı’nın yerleşim yerindeki{' '}
            <strong>Tüketici Hakem Heyetleri</strong> ve <strong>Tüketici Mahkemeleri</strong>{' '}
            yetkilidir.
          </p>

          <h2>Madde 11 — Yürürlük</h2>
          <p>
            Alıcı, siparişi onayladığında bu sözleşmenin tüm koşullarını okuduğunu ve kabul ettiğini
            beyan etmiş sayılır. Sözleşme, siparişin onaylanmasıyla yürürlüğe girer.
          </p>
        </Prose>

        <EksikKunyeUyarisi />
      </PageBody>
    </>
  )
}
