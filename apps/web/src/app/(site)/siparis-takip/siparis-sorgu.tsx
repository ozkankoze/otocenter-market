'use client'

import * as React from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { kurusYaz } from '@/features/sepet/use-sepet'
import { formatDateTime } from '@/lib/utils'
import { SON_SIPARIS_ANAHTARI } from '@/features/odeme/sabitler'

type Siparis = {
  order_no: string
  status: string
  full_name: string
  ship_city: string
  ship_district: string
  total_kurus: number
  paid_total_kurus: number | null
  installment_count: number | null
  shipping_payer: 'SATICI' | 'ALICI'
  cargo_company: string | null
  tracking_no: string | null
  created_at: string
  paid_at: string | null
  shipped_at: string | null
  test_mode: boolean
  kalemler: Array<{
    product_title: string
    product_slug: string | null
    quantity: number
    unit_price_kurus: number
    line_total_kurus: number
  }>
}

const DURUM_ETIKETI: Record<string, { metin: string; ton: string }> = {
  PENDING_PAYMENT: { metin: 'Ödeme bekleniyor', ton: 'bg-warning/12 text-ink-800' },
  PAID: { metin: 'Hazırlanıyor', ton: 'bg-brand-50 text-brand-700' },
  PAYMENT_FAILED: { metin: 'Ödeme tamamlanmadı', ton: 'bg-danger/10 text-danger' },
  SHIPPED: { metin: 'Kargoya verildi', ton: 'bg-accent-100 text-accent-700' },
  DELIVERED: { metin: 'Teslim edildi', ton: 'bg-accent-100 text-accent-700' },
  CANCELLED: { metin: 'İptal edildi', ton: 'bg-ink-100 text-ink-700' },
  REFUNDED: { metin: 'İade edildi', ton: 'bg-ink-100 text-ink-700' },
}

export function SiparisSorgu({ ilkNo, ilkEmail }: { ilkNo: string; ilkEmail: string }) {
  const [no, setNo] = React.useState(ilkNo)
  const [email, setEmail] = React.useState(ilkEmail)
  const [sonuc, setSonuc] = React.useState<{ tur: 'yok' } | { tur: 'bulundu'; s: Siparis } | null>(null)
  const [yukleniyor, setYukleniyor] = React.useState(false)

  const sorgula = React.useCallback(async (n: string, e: string) => {
    if (!n.trim() || !e.trim()) return
    setYukleniyor(true)
    try {
      const r = await fetch('/api/siparis/sorgula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siparisNo: n, email: e }),
      })
      const v = (await r.json()) as { siparis: Siparis | null }
      setSonuc(v.siparis ? { tur: 'bulundu', s: v.siparis } : { tur: 'yok' })
    } catch {
      setSonuc({ tur: 'yok' })
    } finally {
      setYukleniyor(false)
    }
  }, [])

  // Sonuç sayfasından gelindiyse: e-posta adres çubuğunda değil, bu sekmenin
  // oturum deposunda (ödeme sırasında yazıldı). Numara eşleşirse doğrudan sorgula.
  React.useEffect(() => {
    let e = ilkEmail
    if (ilkNo && !e) {
      try {
        const k = JSON.parse(window.sessionStorage.getItem(SON_SIPARIS_ANAHTARI) ?? 'null') as {
          no?: string
          email?: string
        } | null
        if (k?.no && k.no === ilkNo.toUpperCase() && k.email) e = k.email
      } catch {
        // depolama kapalı — kullanıcı e-postayı kendisi yazar
      }
      if (e) setEmail(e)
    }
    if (ilkNo && e) sorgula(ilkNo, e)
  }, [ilkNo, ilkEmail, sorgula])

  return (
    <Card className="mb-10 p-5 md:p-6">
      <h2 className="text-[17px] font-semibold text-ink-900">Siparişinizi sorgulayın</h2>
      <form
        className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        onSubmit={(e) => {
          e.preventDefault()
          sorgula(no, email)
        }}
      >
        <div>
          <label htmlFor="takip-no" className="mb-1.5 block text-[13px] font-semibold text-ink-800">
            Sipariş numarası
          </label>
          <Input id="takip-no" value={no} onChange={(e) => setNo(e.target.value)} placeholder="OCM…"
            autoComplete="off" className="font-mono uppercase" required />
        </div>
        <div>
          <label htmlFor="takip-email" className="mb-1.5 block text-[13px] font-semibold text-ink-800">
            E-posta
          </label>
          <Input id="takip-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            autoComplete="email" required />
        </div>
        <Button type="submit" disabled={yukleniyor}>
          <Search size={16} aria-hidden="true" /> {yukleniyor ? 'Sorgulanıyor…' : 'Sorgula'}
        </Button>
      </form>

      <div aria-live="polite">
        {sonuc?.tur === 'yok' ? (
          <p className="mt-4 rounded-md bg-ink-25 p-3.5 text-[13.5px] text-ink-700" data-testid="takip-bulunamadi">
            Bu sipariş numarası ve e-posta ile eşleşen bir sipariş bulunamadı. Numarayı ve sipariş
            sırasında yazdığınız e-postayı kontrol edin.
          </p>
        ) : sonuc?.tur === 'bulundu' ? (
          <SiparisDetayi s={sonuc.s} />
        ) : null}
      </div>
    </Card>
  )
}

function SiparisDetayi({ s }: { s: Siparis }) {
  const etiket = DURUM_ETIKETI[s.status] ?? { metin: s.status, ton: 'bg-ink-100 text-ink-700' }
  return (
    <div className="mt-5 border-t border-ink-100 pt-5" data-testid="takip-sonuc">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-ink-600">
          <b className="font-mono text-[15px] font-semibold text-ink-900">{s.order_no}</b> ·{' '}
          {formatDateTime(s.created_at)}
        </p>
        <span className={`rounded-sm px-2.5 py-1 text-[12.5px] font-semibold ${etiket.ton}`}>
          {etiket.metin}
        </span>
      </div>
      {s.tracking_no ? (
        <p className="mt-3 text-[13.5px] text-ink-700">
          Kargo: <b className="font-semibold">{s.cargo_company ?? '—'}</b> · Takip no:{' '}
          <b className="font-mono font-semibold">{s.tracking_no}</b>
        </p>
      ) : null}
      <ul className="mt-4 divide-y divide-ink-50 text-[13.5px]">
        {s.kalemler.map((k, i) => (
          <li key={i} className="flex justify-between gap-3 py-2">
            <span className="text-ink-700">
              {k.product_slug ? (
                <Link href={`/urun/${k.product_slug}`} title={`${k.product_title} — ürün detayına git`}
                  className="hover:text-brand-600">{k.product_title}</Link>
              ) : (
                k.product_title
              )}{' '}
              <span className="text-ink-600">× {k.quantity}</span>
            </span>
            <b className="shrink-0 font-semibold text-ink-900">{kurusYaz(k.line_total_kurus)}</b>
          </li>
        ))}
      </ul>
      <dl className="mt-3 space-y-1.5 border-t border-ink-100 pt-3 text-[13.5px]">
        <div className="flex justify-between">
          <dt className="text-ink-600">Sipariş tutarı</dt>
          <dd className="font-semibold text-ink-900">{kurusYaz(s.total_kurus)}</dd>
        </div>
        {s.paid_total_kurus && s.paid_total_kurus !== s.total_kurus ? (
          <div className="flex justify-between">
            <dt className="text-ink-600">
              Karttan çekilen{s.installment_count ? ` (${s.installment_count} taksit)` : ''}
            </dt>
            <dd className="font-semibold text-ink-900">{kurusYaz(s.paid_total_kurus)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-ink-600">Kargo</dt>
          <dd className="text-ink-900">{s.shipping_payer === 'SATICI' ? 'Ücretsiz' : 'Alıcı ödemeli'}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-600">Teslimat</dt>
          <dd className="text-ink-900">{s.ship_district} / {s.ship_city}</dd>
        </div>
      </dl>
    </div>
  )
}
