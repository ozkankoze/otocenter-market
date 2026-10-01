import { db, paytrBildirimiIsle } from '@ocm/db'
import { paytrAyarlari } from '@/server/odeme/ayar'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * PayTR BİLDİRİM URL'si — PayTR mağaza panelinde bu adres tanımlanmalı:
 *     https://otocentermarket.com/api/odeme/paytr-bildirim
 *
 * PayTR ödeme sonucunu buraya sunucudan sunucuya, form-urlencoded POST eder.
 * Bir siparişin ÖDENDİ olmasının TEK yolu budur. İmza (hash) doğrulanmadan
 * hiçbir şey değişmez; ayrıntılar ve tekrar bildirim kuralları `@ocm/db` →
 * `paytrBildirimiIsle` içinde, veritabanına karşı testli.
 *
 * Yanıt düz metin olmalı. "OK" dışındaki her yanıtta PayTR bir dakika sonra
 * tekrar dener.
 */
export async function POST(request: Request) {
  const ayar = paytrAyarlari()
  if (!ayar) {
    // Anahtarlar tanımlı değilken gelen bildirim kaybolmasın: OK dönülmez,
    // PayTR anahtarlar girildikten sonra tekrar dener.
    return metin('PAYTR_AYARLARI_EKSIK', 503)
  }

  // PayTR bildirimi birkaç yüz bayttır; büyük gövde kötüye kullanımdır.
  if (Number(request.headers.get('content-length') ?? 0) > 16 * 1024) {
    return metin('COK_BUYUK', 413)
  }

  let form: Record<string, string>
  try {
    const fd = await request.formData()
    form = {}
    for (const [k, v] of fd.entries()) {
      if (typeof v === 'string') form[k] = v.slice(0, 2000)
    }
  } catch {
    return metin('GECERSIZ_ISTEK', 400)
  }

  try {
    const sonuc = await paytrBildirimiIsle(db, ayar, form)
    if (sonuc.sonuc !== 'PAID' && sonuc.sonuc !== 'FAILED' && sonuc.sonuc !== 'DUPLICATE') {
      console.warn(`[odeme] bildirim: ${sonuc.sonuc} · ${form.merchant_oid ?? '-'}`)
    }
    return metin(sonuc.yanit, sonuc.httpStatus)
  } catch (e) {
    // Veritabanı hatası gibi geçici bir sorun: OK DÖNÜLMEZ → PayTR tekrar dener.
    console.error(`[odeme] bildirim işlenemedi · ${form.merchant_oid ?? '-'}`, e)
    return metin('GECICI_HATA', 500)
  }
}

function metin(govde: string, status: number) {
  return new Response(govde, {
    status,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}
