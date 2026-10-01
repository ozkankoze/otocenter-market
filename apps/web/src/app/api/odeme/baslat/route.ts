import { NextResponse, type NextRequest } from 'next/server'
import {
  db,
  emailSonSiparisSayisi,
  ipSonSiparisSayisi,
  istemciIp,
  siparisNotuEkle,
  siparisOlustur,
} from '@ocm/db'
import { alanHatalari, baslatIstegi, odemeFormuSemasi } from '@/features/odeme/form-sema'
import { paytrAyarlari, SOZLESME_SURUMU } from '@/server/odeme/ayar'
import { paytrTokenAl } from '@/server/odeme/paytr-istemci'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Kötüye kullanım sınırları (10 dakikada). IP sınırı geniş tutuldu: mobil
 * operatörler çok sayıda müşteriyi aynı IP'nin arkasına koyuyor. Asıl sınır
 * e-posta başına.
 */
const IP_SINIRI = 30
const EPOSTA_SINIRI = 6
/** İstek gövdesi üst sınırı — 50 kalemlik sepet + form bunun çok altında. */
const GOVDE_SINIRI = 32 * 1024

/**
 * ÖDEMEYİ BAŞLAT
 *   1. Form ve sepet doğrulanır (tarayıcıdakiyle aynı şema).
 *   2. Sepet VERİTABANINDAN yeniden fiyatlanır, sipariş PENDING_PAYMENT yazılır.
 *   3. PayTR'dan iFrame token'ı alınır ve tarayıcıya döner.
 *
 * Bu uç nokta hiçbir zaman "ödendi" demez. Ödeme sonucu yalnızca PayTR'ın
 * sunucudan sunucuya bildirimiyle (`/api/odeme/paytr-bildirim`) kayda geçer.
 */
export async function POST(request: NextRequest) {
  const ayar = paytrAyarlari()
  if (!ayar) {
    return NextResponse.json({ hata: 'ODEME_KAPALI' }, { status: 503 })
  }

  if (Number(request.headers.get('content-length') ?? 0) > GOVDE_SINIRI) {
    return NextResponse.json({ hata: 'GECERSIZ_ISTEK' }, { status: 413 })
  }
  let ham: unknown
  try {
    const metin = await request.text()
    if (metin.length > GOVDE_SINIRI) throw new Error('büyük')
    ham = JSON.parse(metin)
  } catch {
    return NextResponse.json({ hata: 'GECERSIZ_ISTEK' }, { status: 400 })
  }
  const istek = baslatIstegi.safeParse(ham)
  if (!istek.success) return NextResponse.json({ hata: 'GECERSIZ_SEPET' }, { status: 400 })
  const form = odemeFormuSemasi.safeParse(istek.data.form)
  if (!form.success) {
    return NextResponse.json(
      { hata: 'FORM', alanHatalari: alanHatalari(form.error) },
      { status: 422 },
    )
  }

  // Vercel her istekte x-forwarded-for yazar. Canlıda IP yoksa bir şeyler
  // yanlış demektir: tüm müşterileri tek bir sahte IP'de toplamak yerine reddet.
  const ip =
    istemciIp(request.headers) ?? (process.env.NODE_ENV === 'production' ? null : '127.0.0.1')
  if (!ip) return NextResponse.json({ hata: 'GECERSIZ_ISTEK' }, { status: 400 })

  const f = form.data
  const [ipSayisi, epostaSayisi] = await Promise.all([
    ipSonSiparisSayisi(db, ip, 10),
    emailSonSiparisSayisi(db, f.email, 10),
  ])
  if (ipSayisi >= IP_SINIRI || epostaSayisi >= EPOSTA_SINIRI) {
    return NextResponse.json({ hata: 'COK_FAZLA_DENEME' }, { status: 429 })
  }

  const sonuc = await siparisOlustur(db, {
    kalemler: istek.data.kalemler,
    musteri: { adSoyad: f.adSoyad, email: f.email, telefon: f.telefon },
    teslimat: { il: f.il, ilce: f.ilce, adres: f.adres, postaKodu: f.postaKodu || null },
    fatura:
      f.faturaTuru === 'KURUMSAL'
        ? {
            tur: 'KURUMSAL',
            unvan: f.unvan!,
            vergiDairesi: f.vergiDairesi!,
            vergiNo: f.vergiNo!,
            adres: f.faturaAdresiFarkli ? f.faturaAdresi : null,
          }
        : { tur: 'BIREYSEL', adres: f.faturaAdresiFarkli ? f.faturaAdresi : null },
    ip,
    sozlesmeSurumu: SOZLESME_SURUMU,
    testModu: ayar.testMode,
  })

  if (!sonuc.ok) {
    return NextResponse.json(
      { hata: sonuc.bos ? 'BOS_SEPET' : 'SEPET_SORUNU', sorunlar: sonuc.sorunlar },
      { status: 409 },
    )
  }

  const token = await paytrTokenAl(ayar, sonuc.siparis, ip)
  if (!token.ok) {
    // Sebep PayTR'dan gelir ("geçersiz mağaza", "hash hatalı" ...). Müşteriye
    // gösterilmez; siparişe not düşülür ve sunucu loguna yazılır.
    console.error(`[odeme] token alınamadı · ${sonuc.siparis.orderNo} · ${token.sebep}`)
    await siparisNotuEkle(db, sonuc.siparis.orderNo, `PayTR token alınamadı: ${token.sebep}`)
    return NextResponse.json(
      {
        hata: 'PAYTR',
        // Test modunda sebep gösterilir: kurulum hatası hemen fark edilsin.
        ...(ayar.testMode ? { ayrinti: token.sebep } : {}),
      },
      { status: 502 },
    )
  }

  return NextResponse.json(
    { token: token.token, siparisNo: sonuc.siparis.orderNo, testModu: ayar.testMode },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
