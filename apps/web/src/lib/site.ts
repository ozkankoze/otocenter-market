/**
 * SİTE KÜNYESİ — tek kaynak.
 *
 * Adres, telefon ve e-posta birden fazla yerde görünüyor (header, footer,
 * iletişim sayfası, hukuki metinler, WhatsApp butonu). Bunları tek yerde
 * tutmak, adres değiştiğinde bir dosyayı düzenlemeyi yeterli kılar.
 *
 * DİKKAT: burada YALNIZCA gerçekten bilinen bilgiler durur. Ticaret unvanı,
 * vergi dairesi, vergi numarası ve MERSİS numarası HENÜZ VERİLMEDİĞİ için
 * yazılmamıştır — hukuki metinlerde bunların yeri açıkça "eklenecek" olarak
 * işaretlenir, uydurulmaz.
 */
export const SITE = {
  name: 'Oto Center Market',
  /** Görünen adres — tek satır. */
  address: 'Esatpaşa Mahallesi, Bingök Sokak No:1 Daire:1 | Ataşehir/İstanbul',
  /** Adres satır satır (iletişim kartı, hukuki metin künyesi). */
  addressLines: ['Esatpaşa Mahallesi, Bingök Sokak No:1 Daire:1', 'Ataşehir / İstanbul'],
  district: 'Ataşehir',
  city: 'İstanbul',
  phoneDisplay: '0507 891 47 28',
  /** tel: bağlantısı için — uluslararası biçim. */
  phoneHref: 'tel:+905078914728',
  whatsappHref: 'https://wa.me/905078914728',
  email: 'info@otocentermarket.com',
  emailHref: 'mailto:info@otocentermarket.com',
  workingHours: 'Hafta içi 09:00 – 18:00',
} as const

/**
 * Dış bağlantıların `rel` değeri.
 *
 * SEO denetimi "Dofollow link: 2" uyarısı veriyordu — wa.me bağlantıları
 * (footer + sağ alttaki destek düğmesi) varsayılan olarak dofollow'du, yani
 * sayfanın link değerini WhatsApp'a akıtıyorduk. wa.me bizim alan adımız
 * değil ve indekslenmesini istediğimiz bir hedef de değil.
 *
 *   nofollow          → link değeri dışarı akmaz (denetimin istediği)
 *   noopener          → yeni sekme `window.opener` üzerinden bu sayfaya erişemez
 *   noreferrer        → referrer başlığı gönderilmez
 *
 * Sitedeki TÜM `target="_blank"` bağlantıları bunu kullanır; tek tek yazılırsa
 * biri unutulduğunda denetim yeniden kırmızıya döner.
 */
export const DIS_BAGLANTI_REL = 'noopener noreferrer nofollow'
