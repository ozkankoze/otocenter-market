'use client'

import * as React from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { AlertTriangle, Lock, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useFiyatliSepet } from '@/features/sepet/use-fiyatli-sepet'
import { kurusYaz } from '@/features/sepet/use-sepet'
import { sorunMetni } from '@/features/sepet/types'
import { ILLER_ALFABETIK } from '@/features/odeme/iller'
import {
  alanHatalari,
  odemeFormuSemasi,
  type AlanHatalari,
  type OdemeFormu,
} from '@/features/odeme/form-sema'
import { cn } from '@/lib/utils'
import { SON_SIPARIS_ANAHTARI } from '@/features/odeme/sabitler'
import { OnBilgilendirme } from './on-bilgilendirme'

const PAYTR_IFRAME = 'https://www.paytr.com/odeme/guvenli/'

const BOS_FORM: OdemeFormu = {
  adSoyad: '',
  email: '',
  telefon: '',
  il: '' as OdemeFormu['il'],
  ilce: '',
  adres: '',
  postaKodu: '',
  faturaTuru: 'BIREYSEL',
  unvan: '',
  vergiDairesi: '',
  vergiNo: '',
  faturaAdresiFarkli: false,
  faturaAdresi: '',
  sozlesmeOnay: false as unknown as true,
}

/** Hata alan sırası — gönderimde ilk hatalı alana odaklanmak için. */
const ALAN_SIRASI: Array<keyof OdemeFormu> = [
  'adSoyad', 'email', 'telefon', 'il', 'ilce', 'adres', 'postaKodu',
  'unvan', 'vergiDairesi', 'vergiNo', 'faturaAdresi', 'sozlesmeOnay',
]

type Adim = { tur: 'form' } | { tur: 'iframe'; token: string; siparisNo: string }

export function OdemeAkisi({ odemeAcik, testModu }: { odemeAcik: boolean; testModu: boolean }) {
  const { durum, kalemler } = useFiyatliSepet()
  const [form, setForm] = React.useState<OdemeFormu>(BOS_FORM)
  const [hatalar, setHatalar] = React.useState<AlanHatalari>({})
  const [gonderiliyor, setGonderiliyor] = React.useState(false)
  const [genelHata, setGenelHata] = React.useState<React.ReactNode>(null)
  const [adim, setAdim] = React.useState<Adim>({ tur: 'form' })

  const ayarla = <K extends keyof OdemeFormu>(alan: K, deger: OdemeFormu[K]) => {
    setForm((f) => ({ ...f, [alan]: deger }))
    if (hatalar[alan]) setHatalar((h) => ({ ...h, [alan]: undefined }))
  }

  if (adim.tur === 'iframe') return <OdemeCercevesi token={adim.token} siparisNo={adim.siparisNo} />

  if (!odemeAcik) {
    return (
      <Card className="mt-6 p-6 text-sm text-ink-700" role="alert">
        Online ödeme şu an geçici olarak kapalı. Siparişinizi telefon veya WhatsApp üzerinden
        tamamlayabilirsiniz —{' '}
        <Link href="/iletisim" title="İletişim sayfasına git" className="font-semibold text-brand-600 underline">
          iletişim bilgileri
        </Link>
        .
      </Card>
    )
  }

  if (durum.tur === 'hazirlaniyor') {
    return (
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_400px]" aria-busy="true">
        <Skeleton className="h-[520px]" />
        {/* Mobilde tek sütun: ikinci iskelet alanı gereksiz uzatmasın */}
        <Skeleton className="hidden h-[380px] lg:block" />
      </div>
    )
  }
  if (durum.tur === 'bos') {
    return (
      <Card className="mt-6 p-6 text-sm text-ink-700">
        Sepetiniz boş.{' '}
        <Link href="/filtreler" title="Filtre kategorilerine göz at" className="font-semibold text-brand-600 underline">
          Alışverişe başlayın
        </Link>
        .
      </Card>
    )
  }
  if (durum.tur === 'hata') {
    return (
      <Card className="mt-6 p-6 text-sm text-ink-700" role="alert">
        Sepet yüklenemedi. Sayfayı yenileyip tekrar deneyin.
      </Card>
    )
  }

  const sepet = durum.veri
  if (sepet.sorunlar.length > 0 || sepet.satirlar.length === 0) {
    return (
      <Card className="mt-6 p-6 text-sm text-ink-700" role="alert">
        <p className="font-semibold text-ink-900">Sepetinizde düzeltilmesi gereken ürünler var:</p>
        <ul className="mt-2 list-disc pl-5">
          {sepet.sorunlar.map((s) => (
            <li key={s.variantId}>{sorunMetni(s)}</li>
          ))}
        </ul>
        <Button asChild className="mt-4">
          <Link href="/sepet" title="Sepete dön">
            Sepete dön
          </Link>
        </Button>
      </Card>
    )
  }

  const teslimatAdresi = [form.adres, form.ilce, form.il].filter((x) => x && String(x).trim()).join(', ')

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault()
    setGenelHata(null)
    const p = odemeFormuSemasi.safeParse(form)
    if (!p.success) {
      const h = alanHatalari(p.error)
      setHatalar(h)
      const ilk = ALAN_SIRASI.find((a) => h[a])
      if (ilk) document.getElementById(`odeme-${ilk}`)?.focus()
      return
    }
    setGonderiliyor(true)
    try {
      const r = await fetch('/api/odeme/baslat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, kalemler }),
      })
      const veri = (await r.json().catch(() => ({}))) as {
        token?: string
        siparisNo?: string
        hata?: string
        ayrinti?: string
        alanHatalari?: AlanHatalari
      }
      if (r.ok && veri.token && veri.siparisNo) {
        try {
          window.sessionStorage.setItem(
            SON_SIPARIS_ANAHTARI,
            JSON.stringify({ no: veri.siparisNo, email: form.email.trim() }),
          )
        } catch {
          // depolama kapalıysa sonuç sayfası yalnızca durumu gösterir
        }
        setAdim({ tur: 'iframe', token: veri.token, siparisNo: veri.siparisNo })
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      if (veri.hata === 'FORM' && veri.alanHatalari) {
        setHatalar(veri.alanHatalari)
      } else if (veri.hata === 'SEPET_SORUNU' || veri.hata === 'BOS_SEPET') {
        setGenelHata(
          <>
            Siz bu sayfadayken sepetinizdeki bir ürünün stoğu ya da durumu değişti.{' '}
            <Link href="/sepet" title="Sepete dön" className="font-semibold underline">
              Sepeti kontrol edin
            </Link>
            .
          </>,
        )
      } else if (veri.hata === 'COK_FAZLA_DENEME') {
        setGenelHata('Kısa sürede çok fazla ödeme denemesi yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.')
      } else if (veri.hata === 'ODEME_KAPALI') {
        setGenelHata('Online ödeme şu an geçici olarak kapalı. Lütfen bizimle iletişime geçin.')
      } else {
        setGenelHata(
          <>
            Ödeme ekranı açılamadı. Lütfen tekrar deneyin; sorun sürerse bizimle iletişime geçin.
            {veri.ayrinti ? (
              <span className="mt-1 block font-mono text-[11.5px] text-ink-600">
                Test modu ayrıntısı: {veri.ayrinti}
              </span>
            ) : null}
          </>,
        )
      }
    } catch {
      setGenelHata('Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.')
    } finally {
      setGonderiliyor(false)
    }
  }

  return (
    <form onSubmit={gonder} noValidate className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_400px]">
      <div className="min-w-0 space-y-5">
        {testModu ? (
          <p className="rounded-md border border-warning/40 bg-warning/10 px-4 py-2.5 text-[13px] font-medium text-ink-800">
            TEST MODU — kartınızdan para çekilmez. PayTR test kartlarıyla deneyin.
          </p>
        ) : null}

        <Bolum baslik="İletişim bilgileri">
          <div className="grid gap-4 sm:grid-cols-2">
            <Alan ad="adSoyad" etiket="Ad soyad" hata={hatalar.adSoyad} className="sm:col-span-2">
              <Input id="odeme-adSoyad" autoComplete="name" value={form.adSoyad} maxLength={60}
                onChange={(e) => ayarla('adSoyad', e.target.value)} {...hataOzellikleri('adSoyad', hatalar)} />
            </Alan>
            <Alan ad="email" etiket="E-posta" hata={hatalar.email} ipucu="Sipariş bilgileri bu adrese bağlanır.">
              <Input id="odeme-email" type="email" inputMode="email" autoComplete="email" value={form.email}
                maxLength={100} onChange={(e) => ayarla('email', e.target.value)} {...hataOzellikleri('email', hatalar)} />
            </Alan>
            <Alan ad="telefon" etiket="Cep telefonu" hata={hatalar.telefon}>
              <Input id="odeme-telefon" type="tel" inputMode="tel" autoComplete="tel" placeholder="05XX XXX XX XX"
                value={form.telefon} maxLength={20} onChange={(e) => ayarla('telefon', e.target.value)}
                {...hataOzellikleri('telefon', hatalar)} />
            </Alan>
          </div>
        </Bolum>

        <Bolum baslik="Teslimat adresi">
          <div className="grid gap-4 sm:grid-cols-2">
            <Alan ad="il" etiket="İl" hata={hatalar.il}>
              <Select id="odeme-il" autoComplete="address-level1" value={form.il}
                onChange={(e) => ayarla('il', e.target.value as OdemeFormu['il'])} {...hataOzellikleri('il', hatalar)}>
                <option value="">Seçiniz</option>
                {ILLER_ALFABETIK.map((il) => (
                  <option key={il} value={il}>{il}</option>
                ))}
              </Select>
            </Alan>
            <Alan ad="ilce" etiket="İlçe" hata={hatalar.ilce}>
              <Input id="odeme-ilce" autoComplete="address-level2" value={form.ilce} maxLength={60}
                onChange={(e) => ayarla('ilce', e.target.value)} {...hataOzellikleri('ilce', hatalar)} />
            </Alan>
            <Alan ad="adres" etiket="Açık adres" hata={hatalar.adres} className="sm:col-span-2"
              ipucu="Mahalle, cadde/sokak, bina ve daire no.">
              <textarea id="odeme-adres" autoComplete="street-address" rows={3} maxLength={300} value={form.adres}
                onChange={(e) => ayarla('adres', e.target.value)}
                {...hataOzellikleri('adres', hatalar, metinKutusu)} />
            </Alan>
            <Alan ad="postaKodu" etiket="Posta kodu (isteğe bağlı)" hata={hatalar.postaKodu}>
              <Input id="odeme-postaKodu" inputMode="numeric" autoComplete="postal-code" maxLength={5}
                value={form.postaKodu ?? ''} onChange={(e) => ayarla('postaKodu', e.target.value)}
                {...hataOzellikleri('postaKodu', hatalar)} />
            </Alan>
          </div>
        </Bolum>

        <Bolum baslik="Fatura bilgileri">
          <fieldset>
            <legend className="sr-only">Fatura türü</legend>
            <div className="flex flex-wrap gap-2">
              {(['BIREYSEL', 'KURUMSAL'] as const).map((t) => (
                <label key={t} className={cn(
                  'inline-flex cursor-pointer items-center gap-2 rounded-md border px-3.5 py-2 text-[13.5px] font-medium',
                  form.faturaTuru === t ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-ink-200 text-ink-700',
                )}>
                  <input type="radio" name="faturaTuru" value={t} checked={form.faturaTuru === t}
                    onChange={() => ayarla('faturaTuru', t)} className="accent-brand-600" />
                  {t === 'BIREYSEL' ? 'Bireysel' : 'Kurumsal (şirket adına)'}
                </label>
              ))}
            </div>
          </fieldset>

          {form.faturaTuru === 'KURUMSAL' ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Alan ad="unvan" etiket="Şirket unvanı" hata={hatalar.unvan} className="sm:col-span-2">
                <Input id="odeme-unvan" autoComplete="organization" maxLength={160} value={form.unvan ?? ''}
                  onChange={(e) => ayarla('unvan', e.target.value)} {...hataOzellikleri('unvan', hatalar)} />
              </Alan>
              <Alan ad="vergiDairesi" etiket="Vergi dairesi" hata={hatalar.vergiDairesi}>
                <Input id="odeme-vergiDairesi" maxLength={60} value={form.vergiDairesi ?? ''}
                  onChange={(e) => ayarla('vergiDairesi', e.target.value)} {...hataOzellikleri('vergiDairesi', hatalar)} />
              </Alan>
              <Alan ad="vergiNo" etiket="Vergi no / TC kimlik no" hata={hatalar.vergiNo}>
                <Input id="odeme-vergiNo" inputMode="numeric" maxLength={11} value={form.vergiNo ?? ''}
                  onChange={(e) => ayarla('vergiNo', e.target.value.replace(/\D/g, ''))}
                  {...hataOzellikleri('vergiNo', hatalar)} />
              </Alan>
            </div>
          ) : null}

          <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-[13.5px] text-ink-700">
            <input type="checkbox" checked={form.faturaAdresiFarkli}
              onChange={(e) => ayarla('faturaAdresiFarkli', e.target.checked)} className="h-4 w-4 accent-brand-600" />
            Fatura adresim teslimat adresinden farklı
          </label>
          {form.faturaAdresiFarkli ? (
            <Alan ad="faturaAdresi" etiket="Fatura adresi" hata={hatalar.faturaAdresi} className="mt-3">
              <textarea id="odeme-faturaAdresi" rows={3} maxLength={300} value={form.faturaAdresi ?? ''}
                onChange={(e) => ayarla('faturaAdresi', e.target.value)}
                {...hataOzellikleri('faturaAdresi', hatalar, metinKutusu)} />
            </Alan>
          ) : null}
        </Bolum>
      </div>

      <div className="min-w-0 space-y-4 lg:sticky lg:top-24">
        <Card className="p-5">
          <h2 className="text-[15px] font-semibold text-ink-900">Sipariş özeti</h2>
          <ul className="mt-3.5 space-y-2.5 text-[13px]">
            {sepet.satirlar.map((s) => (
              <li key={s.variantId} className="flex justify-between gap-3">
                <span className="min-w-0 text-ink-700">
                  <span className="line-clamp-2">{s.baslik}</span>
                  <span className="text-ink-600">{s.adet} adet</span>
                </span>
                <b className="shrink-0 font-semibold text-ink-900">{kurusYaz(s.satirKurus)}</b>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-ink-100 pt-4 text-[13.5px]">
            <div className="flex justify-between">
              <dt className="text-ink-600">Kargo</dt>
              <dd className="font-medium text-ink-900">
                {sepet.kargoOdeyen === 'SATICI' ? (
                  <span className="text-accent-700">Ücretsiz</span>
                ) : (
                  'Alıcı ödemeli'
                )}
              </dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="font-semibold text-ink-900">Ödenecek tutar</dt>
              <dd className="text-[22px] font-bold tracking-tight text-ink-900" data-testid="odeme-toplam">
                {kurusYaz(sepet.araToplamKurus)}
              </dd>
            </div>
          </dl>
          {sepet.kargoOdeyen === 'ALICI' ? (
            <p className="mt-2 text-[12px] text-ink-600">
              Kargo ücreti bu tutara dahil değildir; teslimatta kargo firmasına ödenir.
            </p>
          ) : null}
          <p className="mt-2 text-[12px] text-ink-600">
            Taksit seçenekleri bir sonraki adımda, kart bilgilerini girerken gösterilir. Taksitli ödemede
            vade farkı uygulanabilir.
          </p>
        </Card>

        <Card className="p-5">
          <h2 className="text-[14px] font-semibold text-ink-900">Ön bilgilendirme formu</h2>
          <div className="mt-3 max-h-64 overflow-y-auto rounded-md border border-ink-100 bg-ink-25 p-3.5"
            tabIndex={0} aria-label="Ön bilgilendirme formu metni">
            <OnBilgilendirme sepet={sepet}
              alici={{ adSoyad: form.adSoyad, adres: teslimatAdresi, telefon: form.telefon, email: form.email }} />
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-[13px] leading-relaxed text-ink-700">
            <input id="odeme-sozlesmeOnay" type="checkbox" checked={form.sozlesmeOnay === true}
              onChange={(e) => ayarla('sozlesmeOnay', e.target.checked as true)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
              aria-invalid={hatalar.sozlesmeOnay ? true : undefined}
              aria-describedby={hatalar.sozlesmeOnay ? 'odeme-sozlesmeOnay-hata' : undefined} />
            <span>
              Ön bilgilendirme formunu ve{' '}
              <Link href="/mesafeli-satis-sozlesmesi" target="_blank" title="Mesafeli Satış Sözleşmesi metnini yeni sekmede aç"
                className="font-semibold text-brand-600 underline">Mesafeli Satış Sözleşmesi</Link>
              ’ni okudum, kabul ediyorum. Kişisel verilerimin{' '}
              <Link href="/kvkk" target="_blank" title="KVKK Aydınlatma Metni'ni yeni sekmede aç"
                className="font-semibold text-brand-600 underline">KVKK Aydınlatma Metni</Link>{' '}
              kapsamında işleneceğini biliyorum.
            </span>
          </label>
          {hatalar.sozlesmeOnay ? (
            <p id="odeme-sozlesmeOnay-hata" className="mt-1.5 text-[12.5px] font-medium text-danger">
              {hatalar.sozlesmeOnay}
            </p>
          ) : null}

          {genelHata ? (
            <div role="alert" className="mt-4 flex gap-2 rounded-md border border-danger/30 bg-danger/5 p-3 text-[13px] text-ink-800">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
              <div>{genelHata}</div>
            </div>
          ) : null}

          <Button type="submit" block size="lg" className="mt-4" disabled={gonderiliyor} data-testid="odeme-gonder">
            <Lock size={16} aria-hidden="true" />
            {gonderiliyor ? 'Ödeme ekranı hazırlanıyor…' : 'Siparişi onayla ve öde'}
          </Button>
          <p className="mt-2.5 text-center text-[11.5px] leading-relaxed text-ink-600">
            Bu düğmeyle ödeme yükümlülüğü altına girersiniz. Kart bilgilerinizi bir sonraki adımda
            PayTR’ın güvenli ödeme ekranına gireceksiniz; kart bilgileri bize ulaşmaz.
          </p>
        </Card>
      </div>
    </form>
  )
}

// ─────────────────────────────── PayTR iFrame ─────────────────────────────

function OdemeCercevesi({ token, siparisNo }: { token: string; siparisNo: string }) {
  const boyutla = () => {
    const w = window as unknown as { iFrameResize?: (o: object, s: string) => void }
    w.iFrameResize?.({}, '#paytriframe')
  }
  return (
    <div className="mx-auto mt-6 max-w-[720px]">
      <Card className="mb-4 flex flex-wrap items-center justify-between gap-3 p-4 text-[13px]">
        <span className="inline-flex items-center gap-2 font-medium text-ink-800">
          <ShieldCheck size={17} className="text-accent-700" aria-hidden="true" />
          Güvenli ödeme — PayTR
        </span>
        <span className="text-ink-600">
          Sipariş no: <b className="font-mono font-semibold text-ink-900">{siparisNo}</b>
        </span>
      </Card>
      <Script src="https://www.paytr.com/js/iframeResizer.min.js" strategy="afterInteractive" onLoad={boyutla} />
      <iframe
        src={`${PAYTR_IFRAME}${encodeURIComponent(token)}`}
        id="paytriframe"
        title="PayTR güvenli ödeme ekranı"
        className="min-h-[640px] w-full rounded-lg border border-ink-100 bg-white"
        onLoad={boyutla}
      />
      <p className="mt-3 text-center text-[12px] text-ink-600">
        Ödeme tamamlanınca sipariş sonucu sayfasına yönlendirileceksiniz. Sayfadan ayrılırsanız
        sepetiniz korunur.
      </p>
    </div>
  )
}

// ─────────────────────────────── Form parçaları ───────────────────────────

const metinKutusu = cn(
  'w-full rounded-md border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900',
  'focus:border-brand-600 focus:ring-3 focus:ring-brand-600/12 focus:outline-none',
  'aria-[invalid=true]:border-danger',
)

/** Hatalı alan: ekran okuyucu hatayı alanla birlikte okur, kenarlık kırmızı olur. */
function hataOzellikleri(alan: keyof OdemeFormu, h: AlanHatalari, temelSinif?: string) {
  return {
    className: cn(temelSinif, h[alan] && 'border-danger focus:border-danger focus:ring-danger/15'),
    ...(h[alan] ? { 'aria-invalid': true as const, 'aria-describedby': `odeme-${alan}-hata` } : {}),
  }
}

function Bolum({ baslik, children }: { baslik: string; children: React.ReactNode }) {
  return (
    <Card className="p-5 md:p-6">
      <h2 className="mb-4 text-[16px] font-semibold text-ink-900">{baslik}</h2>
      {children}
    </Card>
  )
}

function Alan({
  ad,
  etiket,
  hata,
  ipucu,
  className,
  children,
}: {
  ad: keyof OdemeFormu
  etiket: string
  hata?: string
  ipucu?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={`odeme-${ad}`} className="mb-1.5 block text-[13px] font-semibold text-ink-800">
        {etiket}
      </label>
      {children}
      {hata ? (
        <p id={`odeme-${ad}-hata`} className="mt-1.5 text-[12.5px] font-medium text-danger">
          {hata}
        </p>
      ) : ipucu ? (
        <p className="mt-1.5 text-[12px] text-ink-600">{ipucu}</p>
      ) : null}
    </div>
  )
}
