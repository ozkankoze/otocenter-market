/**
 * SİTE KÜNYESİ — tek kaynak.
 *
 * Adres, telefon ve e-posta birden fazla yerde görünüyor (header, footer,
 * iletişim sayfası, hukuki metinler, WhatsApp butonu). Bunları tek yerde
 * tutmak, adres değiştiğinde bir dosyayı düzenlemeyi yeterli kılar.
 *
 * DİKKAT: burada YALNIZCA belgeyle doğrulanmış bilgiler durur. Satıcı künyesi
 * (`SATICI`) şirketin vergi levhasından ve Türkiye Ticaret Sicili Gazetesi
 * kuruluş ilanından (24.07.2026, sayı 11629) alınmıştır.
 */
export const SITE = {
  name: 'Oto Center Market',
  /** Görünen adres — tek satır. */
  address: 'Esatpaşa Mahallesi, Bingöl Sokak No:1 Daire:1 | Ataşehir/İstanbul',
  /** Adres satır satır (iletişim kartı, hukuki metin künyesi). */
  addressLines: ['Esatpaşa Mahallesi, Bingöl Sokak No:1 Daire:1', 'Ataşehir / İstanbul'],
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

/**
 * SATICI KÜNYESİ — mesafeli satış sözleşmesi, ön bilgilendirme formu ve
 * hukuki sayfalar buradan okur.
 *
 * Kaynak belgeler:
 *   · Vergi levhası (GİB): unvan, vergi dairesi, VKN, işyeri adresi
 *   · TTSG 24.07.2026 / 11629, ilan sıra no 158500: MERSİS, ticaret sicil no
 *
 * Adres, resmî belgelerde yazıldığı biçimiyle tutulur (daire no belgelerde yok).
 * Sitede görünen iletişim adresi (`SITE.address`) bundan ayrıdır.
 */
export const SATICI = {
  unvan: 'NFS AUTO MOTOR SANAYİ VE TİCARET LİMİTED ŞİRKETİ',
  adres: 'Esatpaşa Mah. Bingöl Sk. No: 1 Ataşehir / İstanbul',
  vergiDairesi: 'Ümraniye',
  vergiNo: '6312116194',
  mersisNo: '0631211619400001',
  ticaretSicil: 'İstanbul Ticaret Sicili Müdürlüğü, sicil no 1151509',
  telefon: SITE.phoneDisplay,
  eposta: SITE.email,
} as const
