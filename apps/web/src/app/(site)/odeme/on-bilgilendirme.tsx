import Link from 'next/link'
import { SATICI } from '@/lib/site'
import { kurusYaz } from '@/features/sepet/use-sepet'
import type { SepetYaniti } from '@/features/sepet/types'

/**
 * ÖN BİLGİLENDİRME FORMU — Mesafeli Sözleşmeler Yönetmeliği md. 5
 *
 * Sözleşme kurulmadan ÖNCE, bu siparişin kendi bilgileriyle (ürünler, toplam
 * tutar, teslimat adresi, kargo bedelini kimin ödeyeceği) gösterilmesi
 * gerekiyor. Genel bir metne bağlantı vermek yetmez; bu yüzden formdaki
 * değerlerle canlı olarak doluyor.
 */
export function OnBilgilendirme({
  sepet,
  alici,
}: {
  sepet: SepetYaniti
  alici: { adSoyad: string; adres: string; telefon: string; email: string }
}) {
  const bos = (v: string) => v.trim() || '—'
  return (
    <div className="space-y-3.5 text-[12.5px] leading-relaxed text-ink-700">
      <section>
        <h3 className="font-semibold text-ink-900">1. Satıcı</h3>
        <p>
          {SATICI.unvan}
          <br />
          {SATICI.adres}
          <br />
          Vergi dairesi / no: {SATICI.vergiDairesi} / {SATICI.vergiNo} · MERSİS: {SATICI.mersisNo}
          <br />
          Telefon: {SATICI.telefon} · E-posta: {SATICI.eposta}
        </p>
      </section>
      <section>
        <h3 className="font-semibold text-ink-900">2. Alıcı</h3>
        <p>
          {bos(alici.adSoyad)} · {bos(alici.telefon)} · {bos(alici.email)}
          <br />
          Teslimat adresi: {bos(alici.adres)}
        </p>
      </section>
      <section>
        <h3 className="font-semibold text-ink-900">3. Ürünler ve fiyat</h3>
        <ul className="mt-1 space-y-0.5">
          {sepet.satirlar.map((s) => (
            <li key={s.variantId}>
              {s.baslik} — {s.adet} adet × {kurusYaz(s.birimKurus)} = {kurusYaz(s.satirKurus)}
            </li>
          ))}
        </ul>
        <p className="mt-1">
          Toplam (KDV dahil): <b className="font-semibold text-ink-900">{kurusYaz(sepet.araToplamKurus)}</b>
        </p>
      </section>
      <section>
        <h3 className="font-semibold text-ink-900">4. Kargo ve teslimat</h3>
        <p>
          {sepet.kargoOdeyen === 'SATICI'
            ? 'Sipariş tutarı 500 ₺ ve üzerinde olduğu için kargo bedeli Satıcı’ya aittir; Alıcı’dan kargo ücreti alınmaz.'
            : 'Sipariş tutarı 500 ₺’nin altında olduğu için gönderi ALICI ÖDEMELİ yapılır: kargo bedeli teslimat sırasında Alıcı tarafından kargo firmasına ödenir ve yukarıdaki toplam tutara dahil değildir.'}{' '}
          Stokta bulunan ürünler, ödemesi saat 16:00’ya kadar tamamlanan siparişlerde aynı gün kargoya
          verilir. Teslim süresi yasal azami süre olan 30 günü aşamaz.
        </p>
      </section>
      <section>
        <h3 className="font-semibold text-ink-900">5. Ödeme</h3>
        <p>
          Ödeme, PayTR güvenli ödeme altyapısı üzerinden kredi veya banka kartıyla yapılır. Taksitli
          ödemede bankanın uyguladığı vade farkı ödeme ekranında gösterilir ve Alıcı’ya aittir. Kart
          bilgileri Satıcı tarafından görülmez ve saklanmaz.
        </p>
      </section>
      <section>
        <h3 className="font-semibold text-ink-900">6. Cayma hakkı</h3>
        <p>
          Alıcı, ürünü teslim aldığı tarihten itibaren 14 gün içinde hiçbir gerekçe göstermeden ve
          cezai şart ödemeden sözleşmeden cayabilir. Cayma bildirimi Satıcı’nın yukarıdaki iletişim
          kanallarından yapılır. Araca takılmış/kullanılmış ürünlerde ve ambalajı açılmış sıvı
          ürünlerde (motor yağı, antifriz, fren hidroliği, AdBlue) cayma hakkı kullanılamaz. Satıcı,
          iade edilen ürünü teslim aldığı tarihten itibaren 14 gün içinde toplam bedeli ödemenin
          yapıldığı yöntemle iade eder.
        </p>
      </section>
      <section>
        <h3 className="font-semibold text-ink-900">7. Şikâyet ve uyuşmazlık</h3>
        <p>
          Şikâyetler Satıcı’nın iletişim kanallarına iletilebilir. Uyuşmazlıklarda, Ticaret
          Bakanlığı’nca belirlenen parasal sınırlar içinde Alıcı’nın yerleşim yerindeki Tüketici
          Hakem Heyeti veya Tüketici Mahkemesi yetkilidir.
        </p>
      </section>
      <p>
        Sözleşmenin tam metni:{' '}
        <Link
          href="/mesafeli-satis-sozlesmesi"
          target="_blank"
          title="Mesafeli Satış Sözleşmesi metnini yeni sekmede aç"
          className="font-semibold text-brand-600 underline"
        >
          Mesafeli Satış Sözleşmesi
        </Link>
        .
      </p>
    </div>
  )
}
