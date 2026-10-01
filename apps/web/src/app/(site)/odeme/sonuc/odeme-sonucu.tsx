'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSepet } from '@/features/sepet/use-sepet'

type Durum = 'BEKLIYOR' | 'ODENDI' | 'BASARISIZ' | 'BULUNAMADI' | 'ZAMAN_ASIMI'

/** PayTR bildirimi genelde saniyeler içinde gelir; 60 sn sonra yoklamayı bırakırız. */
const YOKLAMA_ARALIGI_MS = 2000
const YOKLAMA_SURESI_MS = 60_000
/**
 * "Başarısız" geldikten sonra da bir süre yoklamaya devam edilir: PayTR
 * nadiren önce başarısız, sonra başarılı bildirim gönderebilir (sistem bunu
 * ödendi olarak işler). Müşteri bu sırada "tekrar dene"ye basıp ikinci kez
 * ödemesin diye ekran kendiliğinden güncellenir.
 */
const BASARISIZ_SONRASI_YOKLAMA_MS = 30_000

/**
 * ÖDEME SONUCU
 *
 * PayTR müşteriyi buraya `?siparis=...` ile yönlendirir, başarısızsa ayrıca
 * `&durum=basarisiz` ekler. Bu parametrelere GÜVENİLMEZ: adres elle de
 * yazılabilir. Gösterilen durum her zaman sunucudan, PayTR'ın imzalı
 * bildirimiyle güncellenen sipariş kaydından okunur.
 */
export function OdemeSonucu() {
  const params = useSearchParams()
  const siparisNo = (params.get('siparis') ?? '').toUpperCase()
  const { temizle } = useSepet()
  const [durum, setDurum] = React.useState<Durum>('BEKLIYOR')
  const temizlendi = React.useRef(false)

  // PayTR sonucu iFrame'in İÇİNDE açarsa sayfayı üst pencereye taşı;
  // aksi hâlde ödeme sayfasının içinde iç içe bir site görünür.
  React.useEffect(() => {
    if (window.top && window.top !== window.self) {
      window.top.location.href = window.location.href
    }
  }, [])

  React.useEffect(() => {
    if (!/^[A-Z0-9]{6,32}$/.test(siparisNo)) {
      setDurum('BULUNAMADI')
      return
    }
    let iptal = false
    const baslangic = Date.now()
    let zamanlayici: ReturnType<typeof setTimeout>

    let basarisizZamani: number | null = null
    const sor = async () => {
      try {
        const r = await fetch(`/api/odeme/durum?siparis=${siparisNo}`, { cache: 'no-store' })
        const v = (await r.json()) as { durum: 'BEKLIYOR' | 'ODENDI' | 'BASARISIZ' | null }
        if (iptal) return
        if (v.durum === null) return setDurum('BULUNAMADI')
        if (v.durum === 'ODENDI') return setDurum('ODENDI')
        if (v.durum === 'BASARISIZ') {
          setDurum('BASARISIZ')
          basarisizZamani ??= Date.now()
          if (Date.now() - basarisizZamani > BASARISIZ_SONRASI_YOKLAMA_MS) return
        }
      } catch {
        // ağ hatası: yoklamaya devam
      }
      if (iptal) return
      if (basarisizZamani === null && Date.now() - baslangic > YOKLAMA_SURESI_MS) {
        return setDurum('ZAMAN_ASIMI')
      }
      zamanlayici = setTimeout(sor, YOKLAMA_ARALIGI_MS)
    }
    sor()
    return () => {
      iptal = true
      clearTimeout(zamanlayici)
    }
  }, [siparisNo])

  // Sepet YALNIZCA ödeme sunucuda doğrulandığında boşaltılır.
  React.useEffect(() => {
    if (durum === 'ODENDI' && !temizlendi.current) {
      temizlendi.current = true
      temizle()
    }
  }, [durum, temizle])

  // E-posta adres çubuğuna YAZILMAZ (tarayıcı geçmişi, sunucu günlükleri).
  // Takip sayfası onu bu sekmenin oturum deposundan kendisi okur.
  const takipLinki = `/siparis-takip?siparis=${siparisNo}`

  return (
    <Card className="mx-auto max-w-[560px] px-6 py-10 text-center" aria-live="polite">
      {durum === 'BEKLIYOR' ? (
        <>
          <Clock size={44} className="mx-auto animate-pulse text-brand-600" aria-hidden="true" />
          <h1 className="mt-4 text-[22px] font-bold text-ink-900">Ödemeniz doğrulanıyor</h1>
          <p className="mt-2 text-sm text-ink-600">
            Bankanızdan gelen sonucu bekliyoruz. Bu genellikle birkaç saniye sürer, lütfen sayfayı
            kapatmayın.
          </p>
        </>
      ) : durum === 'ODENDI' ? (
        <>
          <CheckCircle2 size={48} className="mx-auto text-accent-700" aria-hidden="true" />
          <h1 className="mt-4 text-[22px] font-bold text-ink-900">Siparişiniz alındı</h1>
          <p className="mt-2 text-sm text-ink-600">
            Ödemeniz onaylandı. Sipariş numaranız:
          </p>
          <p className="mt-2 font-mono text-[20px] font-bold tracking-wide text-ink-900" data-testid="sonuc-siparis-no">
            {siparisNo}
          </p>
          <p className="mt-3 text-[13px] text-ink-600">
            Bu numarayı not edin; sipariş durumunu numara ve e-posta adresinizle takip edebilirsiniz.
            Stoktaki ürünler, ödemesi 16:00’ya kadar tamamlanan siparişlerde aynı gün kargoya verilir.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href={takipLinki} title="Sipariş durumunu görüntüle">Siparişimi görüntüle</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/" title="Ana sayfaya dön">Alışverişe devam et</Link>
            </Button>
          </div>
        </>
      ) : durum === 'BASARISIZ' ? (
        <>
          <XCircle size={48} className="mx-auto text-danger" aria-hidden="true" />
          <h1 className="mt-4 text-[22px] font-bold text-ink-900">Ödeme tamamlanamadı</h1>
          <p className="mt-2 text-sm text-ink-600">
            Bankanız işlemi onaylamadı ya da ödeme ekranı kapatıldı. Kart bilgilerinizi kontrol edip
            tekrar deneyebilir ya da başka bir kart kullanabilirsiniz; sepetiniz korunuyor.
          </p>
          <p className="mt-2 text-[12.5px] text-ink-600">
            Kartınızdan çekim yapıldığını görüyorsanız tekrar ödemeden önce bize ulaşın — sipariş no:{' '}
            <b className="font-mono">{siparisNo}</b>.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/odeme" title="Ödemeyi tekrar dene">Tekrar dene</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/iletisim" title="Bizimle iletişime geçin">Yardım al</Link>
            </Button>
          </div>
        </>
      ) : durum === 'ZAMAN_ASIMI' ? (
        <>
          <Clock size={44} className="mx-auto text-warning" aria-hidden="true" />
          <h1 className="mt-4 text-[22px] font-bold text-ink-900">Sonuç henüz gelmedi</h1>
          <p className="mt-2 text-sm text-ink-600">
            Bankadan gelen onay gecikiyor. Kartınızdan çekim yapıldıysa siparişiniz otomatik olarak
            onaylanır. Birkaç dakika sonra sipariş numaranız <b className="font-mono">{siparisNo}</b> ile
            kontrol edebilir ya da bize ulaşabilirsiniz. Lütfen tekrar ödeme yapmayın.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href={takipLinki} title="Sipariş durumunu kontrol et">Siparişi kontrol et</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/iletisim" title="Bizimle iletişime geçin">Bize ulaşın</Link>
            </Button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-[22px] font-bold text-ink-900">Sipariş bulunamadı</h1>
          <p className="mt-2 text-sm text-ink-600">
            Bu adreste geçerli bir sipariş numarası yok. Siparişinizi takip sayfasından sorgulayabilirsiniz.
          </p>
          <Button asChild className="mt-6">
            <Link href="/siparis-takip" title="Sipariş takip sayfasına git">Sipariş takip</Link>
          </Button>
        </>
      )}
    </Card>
  )
}
