/**
 * ════════════════════════════════════════════════════════════════════════════
 *  PayTR iFrame API — saf yardımcılar (ağ çağrısı yok, veritabanı yok)
 * ════════════════════════════════════════════════════════════════════════════
 *
 *  Kaynak: https://dev.paytr.com/iframe-api/iframe-api-1-adim
 *          https://dev.paytr.com/iframe-api/iframe-api-2-adim
 *
 *  İKİ İMZA VAR, İKİSİ DE HMAC-SHA256 + base64, ANAHTAR merchant_key:
 *
 *    1) Token isteği (bizden PayTR'a):
 *         hash_str = merchant_id + user_ip + merchant_oid + email
 *                  + payment_amount + user_basket + no_installment
 *                  + max_installment + currency + test_mode
 *         paytr_token = base64( HMAC(merchant_key, hash_str + merchant_salt) )
 *
 *    2) Bildirim doğrulaması (PayTR'dan bize):
 *         hash = base64( HMAC(merchant_key, merchant_oid + merchant_salt
 *                                            + status + total_amount) )
 *
 *  Sıra ve birleştirme PayTR'ın örnek koduyla BİREBİR aynıdır; tek karakterlik
 *  sapma "geçersiz token" ya da "sahte bildirim" demektir. Testler bu iki
 *  fonksiyonu bağımsız bir uygulamayla (Python hmac) üretilmiş değerlere
 *  karşı doğrular.
 *
 *  GÜVENLİK
 *  · merchant_key ve merchant_salt yalnızca sunucuda, ortam değişkeninden okunur.
 *    Bu dosyadaki hiçbir fonksiyon onları loglamaz ya da döndürmez.
 *  · Bildirim hash'i SABİT ZAMANLI karşılaştırılır (timingSafeEqual) — normal
 *    `===` karşılaştırması, yanıt süresinden hash'in tahmin edilmesine izin verir.
 * ════════════════════════════════════════════════════════════════════════════
 */
import { createHmac, randomInt, timingSafeEqual } from 'node:crypto'

export const PAYTR_TOKEN_URL = 'https://www.paytr.com/odeme/api/get-token'
export const PAYTR_IFRAME_URL = 'https://www.paytr.com/odeme/guvenli/'

export type PaytrAyarlari = {
  merchantId: string
  merchantKey: string
  merchantSalt: string
  /** true → PayTR test modu; kart çekilmez. */
  testMode: boolean
}

/** Sepetin tek satırı: [ürün adı, birim fiyat "18.00", adet] */
export type PaytrSepetSatiri = [string, string, number]

// ─────────────────────────────── Tutarlar ─────────────────────────────────

/**
 * KDV hariç fiyattan KDV dahil birim fiyatı KURUŞ olarak üretir.
 *
 * Sitede gösterilen fiyatla (`grossPrice` → `Math.round(net * (1+kdv) * 100) / 100`)
 * AYNI tam sayıyı verir. Gösterilen fiyat ile tahsil edilen fiyat arasında
 * kuruş farkı olamaz; testte bütün katalog için ayrıca kontrol edilir.
 */
export function brutKurus(netFiyat: number, kdvOrani: number): number {
  return Math.round(netFiyat * (1 + kdvOrani / 100) * 100)
}

/** 16054 → "160.54" — PayTR sepetindeki birim fiyat biçimi (nokta, iki hane). */
export function kurusToPaytrFiyat(kurus: number): string {
  if (!Number.isInteger(kurus) || kurus < 0) throw new Error(`Geçersiz kuruş: ${kurus}`)
  const tl = Math.floor(kurus / 100)
  const kr = kurus % 100
  return `${tl}.${String(kr).padStart(2, '0')}`
}

// ─────────────────────────────── Sepet ────────────────────────────────────

/**
 * PayTR `user_basket`: JSON dizisinin base64'ü.
 *
 * Ürün adı 100 karaktere kırpılır (PayTR ödeme ekranında gösterilir, uzun ad
 * gereksiz). Fiyat ve adet sipariş satırından gelir; burada hesap yapılmaz.
 */
export function sepetKodla(satirlar: PaytrSepetSatiri[]): string {
  const temiz = satirlar.map(
    ([ad, fiyat, adet]) => [ad.slice(0, 100), fiyat, adet] as PaytrSepetSatiri,
  )
  return Buffer.from(JSON.stringify(temiz), 'utf8').toString('base64')
}

// ─────────────────────────────── İmzalar ──────────────────────────────────

function hmacBase64(anahtar: string, veri: string): string {
  return createHmac('sha256', anahtar).update(veri, 'utf8').digest('base64')
}

export type TokenGirdisi = {
  userIp: string
  merchantOid: string
  email: string
  /** Kuruş, tam sayı (PayTR: tutar × 100). */
  paymentAmount: number
  /** `sepetKodla` çıktısı. */
  userBasket: string
  noInstallment: 0 | 1
  /** 0 = PayTR'ın izin verdiği en yüksek taksit; 2–12 = üst sınır. */
  maxInstallment: number
  currency: 'TL'
}

/** PayTR `paytr_token` alanı. Sıra PayTR örneğiyle birebir aynıdır. */
export function paytrTokenUret(ayar: PaytrAyarlari, g: TokenGirdisi): string {
  const hashStr =
    ayar.merchantId +
    g.userIp +
    g.merchantOid +
    g.email +
    String(g.paymentAmount) +
    g.userBasket +
    String(g.noInstallment) +
    String(g.maxInstallment) +
    g.currency +
    (ayar.testMode ? '1' : '0')
  return hmacBase64(ayar.merchantKey, hashStr + ayar.merchantSalt)
}

/** PayTR'ın bildirim için beklediği hash. Doğrulama için `bildirimHashGecerli` kullanın. */
export function bildirimHashUret(
  ayar: Pick<PaytrAyarlari, 'merchantKey' | 'merchantSalt'>,
  merchantOid: string,
  status: string,
  totalAmount: string,
): string {
  return hmacBase64(ayar.merchantKey, merchantOid + ayar.merchantSalt + status + totalAmount)
}

/**
 * Bildirimdeki `hash` gerçekten PayTR'dan mı geliyor?
 *
 * Değerler POST'tan geldikleri gibi, DİZE olarak kullanılır — `total_amount`
 * sayıya çevrilip geri yazılırsa ("0100" → "100") imza tutmaz.
 */
export function bildirimHashGecerli(
  ayar: Pick<PaytrAyarlari, 'merchantKey' | 'merchantSalt'>,
  alanlar: { merchant_oid: string; status: string; total_amount: string; hash: string },
): boolean {
  const beklenen = Buffer.from(
    bildirimHashUret(ayar, alanlar.merchant_oid, alanlar.status, alanlar.total_amount),
    'utf8',
  )
  const gelen = Buffer.from(alanlar.hash ?? '', 'utf8')
  // timingSafeEqual farklı uzunlukta hata fırlatır; uzunluk zaten bilgi sızdırmaz.
  if (beklenen.length !== gelen.length) return false
  return timingSafeEqual(beklenen, gelen)
}

// ─────────────────────────────── Sipariş no ───────────────────────────────

/**
 * Crockford base32'den I, L, O, U çıkarılmış alfabe: telefonda sipariş no
 * okunurken 1/I, 0/O karışmasın.
 */
const ALFABE = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

/**
 * "OCM" + YYMMDD (İstanbul saati) + 6 rastgele karakter → OCM2610017K3P9Q
 *
 * PayTR `merchant_oid` yalnızca harf ve rakam kabul ettiği için tire yok.
 * 32^6 ≈ 1 milyar olasılık / gün; veritabanındaki UNIQUE kısıtı son güvence.
 */
export function siparisNoUret(simdi: Date = new Date()): string {
  const parcalar = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Istanbul',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(simdi)
  const al = (t: string) => parcalar.find((p) => p.type === t)?.value ?? '00'
  let rastgele = ''
  for (let i = 0; i < 6; i++) rastgele += ALFABE[randomInt(ALFABE.length)]
  return `OCM${al('year')}${al('month')}${al('day')}${rastgele}`
}

// ─────────────────────────────── IP ───────────────────────────────────────

/**
 * Müşterinin gerçek IP'si. PayTR bunu token imzasına katıyor.
 *
 * Vercel, istemci IP'sini `x-forwarded-for` başlığının İLK değerine yazar
 * ve bu başlığı istemcinin göndermesine izin vermez (üzerine yazar). Başka bir
 * barındırmada bu varsayım geçerli olmayabilir.
 */
export function istemciIp(basliklar: { get(ad: string): string | null }): string | null {
  const xff = basliklar.get('x-forwarded-for')
  const ilk = xff?.split(',')[0]?.trim()
  if (ilk) return ilk.slice(0, 39)
  const gercek = basliklar.get('x-real-ip')?.trim()
  return gercek ? gercek.slice(0, 39) : null
}
