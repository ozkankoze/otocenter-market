import 'server-only'
import type { PaytrAyarlari } from '@ocm/db'

/**
 * PayTR mağaza bilgileri — YALNIZCA ortam değişkeninden okunur.
 *
 * Vercel → Project → Settings → Environment Variables:
 *   PAYTR_MERCHANT_ID    Mağaza no
 *   PAYTR_MERCHANT_KEY   Mağaza parolası (gizli)
 *   PAYTR_MERCHANT_SALT  Mağaza gizli anahtarı (gizli)
 *   PAYTR_TEST_MODE      "1" → TEST, "0" → CANLI. Canlı ortamda (production)
 *                        bu ikisinden biri DEĞİLSE ödeme kapalı kalır.
 *   NEXT_PUBLIC_SITE_URL Canlıda zorunlu (PayTR dönüş adresleri buradan).
 *
 * Anahtarlardan biri eksikse `null` döner ve ödeme sayfası "ödeme geçici olarak
 * kapalı" der — yarım yapılandırmayla ödeme denemesi yapılmaz.
 */
export function paytrAyarlari(): PaytrAyarlari | null {
  const merchantId = process.env.PAYTR_MERCHANT_ID?.trim()
  const merchantKey = process.env.PAYTR_MERCHANT_KEY?.trim()
  const merchantSalt = process.env.PAYTR_MERCHANT_SALT?.trim()
  if (!merchantId || !merchantKey || !merchantSalt) return null

  const mod = process.env.PAYTR_TEST_MODE?.trim()
  if (process.env.NODE_ENV === 'production') {
    // Canlıda mod AÇIKÇA seçilmeli. Tanımsız bırakılınca site test modunda
    // açılırsa, PayTR'ın herkese açık test kartlarıyla "ödenmiş" siparişler
    // oluşabilirdi. Ödeme dönüş adresleri için site adresi de şart.
    if (mod !== '0' && mod !== '1') return null
    if (!process.env.NEXT_PUBLIC_SITE_URL?.trim()) return null
  }
  return { merchantId, merchantKey, merchantSalt, testMode: mod !== '0' }
}

/** Mesafeli satış sözleşmesi + ön bilgilendirme formu sürümü. Metin değişirse artırın. */
export const SOZLESME_SURUMU = '2026-10-01'

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '')
}
