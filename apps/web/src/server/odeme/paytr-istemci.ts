import 'server-only'
import {
  PAYTR_TOKEN_URL,
  paytrTokenUret,
  sepetKodla,
  type OlusanSiparis,
  type PaytrAyarlari,
} from '@ocm/db'
import { siteUrl } from './ayar'

export type TokenSonucu = { ok: true; token: string } | { ok: false; sebep: string }

/**
 * Yerel uçtan uca test için PayTR yerine sahte sunucu adresi.
 *
 * Üç koşulun HEPSİ gerekir: `OCM_E2E=1`, TEST modu ve adresin bu makinenin
 * kendisi (127.0.0.1 / localhost) olması. Biri yanlışlıkla canlıda tanımlansa
 * bile mağaza bilgileri ve müşteri verisi başka bir sunucuya gidemez.
 */
function tokenAdresi(ayar: PaytrAyarlari): string {
  const yerine = process.env.PAYTR_TOKEN_URL_E2E
  if (process.env.OCM_E2E === '1' && ayar.testMode && yerine) {
    try {
      const u = new URL(yerine)
      if (u.protocol === 'http:' && ['127.0.0.1', 'localhost'].includes(u.hostname)) return yerine
    } catch {
      // geçersiz adres → gerçek PayTR
    }
  }
  return PAYTR_TOKEN_URL
}

/**
 * PayTR'dan iFrame token'ı ister.
 *
 * Taksit: açık, üst sınır PayTR'ın izin verdiği en yüksek değer
 * (`max_installment = 0`). Vade farkının müşteriye yansıtılması PayTR
 * MAĞAZA PANELİNDEN ayarlanır; bu istekte bir parametresi yok.
 */
export async function paytrTokenAl(
  ayar: PaytrAyarlari,
  siparis: OlusanSiparis,
  userIp: string,
): Promise<TokenSonucu> {
  const userBasket = sepetKodla(siparis.paytrSepeti)
  const noInstallment = 0 as const
  const maxInstallment = 0
  const currency = 'TL' as const

  const paytrToken = paytrTokenUret(ayar, {
    userIp,
    merchantOid: siparis.orderNo,
    email: siparis.email,
    paymentAmount: siparis.totalKurus,
    userBasket,
    noInstallment,
    maxInstallment,
    currency,
  })

  const donus = `${siteUrl()}/odeme/sonuc?siparis=${siparis.orderNo}`
  const govde = new URLSearchParams({
    merchant_id: ayar.merchantId,
    user_ip: userIp,
    merchant_oid: siparis.orderNo,
    email: siparis.email,
    payment_amount: String(siparis.totalKurus),
    paytr_token: paytrToken,
    user_basket: userBasket,
    debug_on: ayar.testMode ? '1' : '0',
    no_installment: String(noInstallment),
    max_installment: String(maxInstallment),
    user_name: siparis.adSoyad,
    user_address: siparis.adres,
    user_phone: siparis.telefon,
    merchant_ok_url: donus,
    merchant_fail_url: `${donus}&durum=basarisiz`,
    timeout_limit: '30',
    currency,
    test_mode: ayar.testMode ? '1' : '0',
    lang: 'tr',
  })

  let yanit: Response
  try {
    yanit = await fetch(tokenAdresi(ayar), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: govde,
      signal: AbortSignal.timeout(15_000),
      cache: 'no-store',
    })
  } catch (e) {
    return { ok: false, sebep: `PayTR'a ulaşılamadı: ${(e as Error).message}` }
  }

  let veri: { status?: string; token?: string; reason?: string }
  try {
    veri = (await yanit.json()) as typeof veri
  } catch {
    return { ok: false, sebep: `PayTR beklenmeyen yanıt verdi (HTTP ${yanit.status}).` }
  }
  if (veri.status === 'success' && typeof veri.token === 'string' && veri.token) {
    return { ok: true, token: veri.token }
  }
  return { ok: false, sebep: veri.reason ?? `PayTR token vermedi (HTTP ${yanit.status}).` }
}
