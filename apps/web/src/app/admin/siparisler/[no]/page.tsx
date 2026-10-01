import Link from 'next/link'
import { requireAdmin } from '@/server/admin/auth'
import { notFound } from 'next/navigation'
import { db, ELLE_GECISLER, siparisDetay } from '@ocm/db'
import { PageHeader } from '@/components/admin/shell'
import { formatDateTime } from '@/lib/utils'
import { SiparisEtiketi, kurus } from '../siparis-etiketi'
import { durumDegistir, kargoyaVer, notEkle } from '../islemler'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Sipariş' }

const HATA_METNI: Record<string, string> = {
  kargo: 'Kargoya verildi işaretlemek için kargo firması ve takip numarası gerekli.',
  gecis: 'Bu sipariş mevcut durumundan istenen duruma alınamaz.',
  yok: 'Sipariş bulunamadı.',
  genel: 'İşlem yapılamadı.',
}

const SONUC_ACIKLAMA: Record<string, string> = {
  PAID: 'Ödendi',
  PAID_AFTER_FAIL: 'Ödendi (önceki başarısızlıktan sonra)',
  FAILED: 'Başarısız',
  DUPLICATE: 'Tekrar (işlem yapılmadı)',
  BAD_HASH: 'İMZA GEÇERSİZ — reddedildi',
  AMOUNT_MISMATCH: 'TUTAR UYUŞMAZLIĞI — ödendi sayılmadı',
  UNKNOWN_ORDER: 'Bilinmeyen sipariş',
  MISSING_FIELDS: 'Eksik alan',
  MODE_MISMATCH: 'TEST/CANLI MOD UYUŞMAZLIĞI — ödendi sayılmadı',
}

export default async function AdminSiparisDetay({
  params,
  searchParams,
}: {
  params: Promise<{ no: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  await requireAdmin()
  const { no } = await params
  const sp = await searchParams
  const d = await siparisDetay(db, no.toUpperCase())
  if (!d) notFound()
  const { siparis: s, kalemler, bildirimler } = d
  const gecisler = ELLE_GECISLER[s.status]

  return (
    <>
      <PageHeader
        eyebrow="Sipariş"
        title={s.order_no}
        description={`${formatDateTime(s.created_at)} · ${s.full_name}`}
        actions={
          <Link href="/admin/siparisler" prefetch={false} className="h-10 rounded-md border border-ink-200 bg-white px-4 text-[13px] leading-10 font-semibold text-ink-700">
            ← Siparişler
          </Link>
        }
      />

      {sp.hata && HATA_METNI[sp.hata] ? (
        <p className="mb-4 rounded-md border border-[#F3D4CF] bg-[#FDF1EF] px-3.5 py-2.5 text-[13px] text-danger" role="alert">
          {HATA_METNI[sp.hata]}
        </p>
      ) : null}

      {s.stock_shortage ? (
        <p className="mb-4 rounded-md border border-[#F3D4CF] bg-[#FDF1EF] px-3.5 py-2.5 text-[13px] text-danger">
          <b>Stok yetersiz:</b> ödeme alındığı anda en az bir üründe stok sipariş adedinden azdı. Müşteriyle
          görüşüp tedarik süresini bildirin ya da iade edin.
        </p>
      ) : null}
      {s.test_mode ? (
        <p className="mb-4 rounded-md border border-[#F5DFB8] bg-[#FDF8EE] px-3.5 py-2.5 text-[13px] text-warning">
          <b>TEST siparişi:</b> PayTR test modunda ödendi; karttan para çekilmedi. Göndermeyin.
        </p>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <Kutu baslik="Ürünler">
            <table className="w-full text-[13px]">
              <tbody>
                {kalemler.map((k) => (
                  <tr key={k.id} className="border-b border-ink-50 last:border-0">
                    <td className="py-2 pr-3">
                      {k.product_slug ? (
                        <Link href={`/urun/${k.product_slug}`} prefetch={false} className="font-medium text-brand-600 hover:underline">
                          {k.product_title}
                        </Link>
                      ) : (
                        k.product_title
                      )}
                      <span className="ocm-code ml-2 text-[11px]">{k.sku}</span>
                    </td>
                    <td className="py-2 pr-3 text-right whitespace-nowrap">{k.quantity} × {kurus(k.unit_price_kurus)}</td>
                    <td className="py-2 text-right font-semibold whitespace-nowrap text-ink-900">{kurus(k.line_total_kurus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className="mt-3 space-y-1.5 border-t border-ink-100 pt-3 text-[13px]">
              <Satir e="Sipariş tutarı (PayTR'a gönderilen)" d={kurus(s.total_kurus)} kalin />
              <Satir e="Karttan çekilen" d={kurus(s.paid_total_kurus)} />
              <Satir e="Taksit" d={s.installment_count ? `${s.installment_count} taksit` : s.paid_at ? 'Tek çekim' : '—'} />
              <Satir e="Kargo" d={s.shipping_payer === 'SATICI' ? 'Ücretsiz (satıcı öder)' : 'ALICI ÖDEMELİ gönderin'} kalin={s.shipping_payer === 'ALICI'} />
            </dl>
          </Kutu>

          <Kutu baslik="PayTR bildirimleri">
            {bildirimler.length === 0 ? (
              <p className="text-[13px] text-ink-500">Henüz bildirim gelmedi.</p>
            ) : (
              <ul className="space-y-1.5 text-[12.5px]">
                {bildirimler.map((b, i) => (
                  <li key={i} className="flex flex-wrap justify-between gap-2">
                    <span className={b.hash_valid ? 'text-ink-700' : 'font-semibold text-danger'}>
                      {SONUC_ACIKLAMA[b.outcome] ?? b.outcome} · {b.status ?? '—'} · {kurus(b.total_amount)}
                    </span>
                    <span className="text-ink-500">{formatDateTime(b.received_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Kutu>

          <Kutu baslik="Notlar ve işlem geçmişi">
            {s.admin_note ? (
              <pre className="mb-3 font-sans text-[12.5px] leading-relaxed whitespace-pre-wrap text-ink-700">{s.admin_note}</pre>
            ) : (
              <p className="mb-3 text-[13px] text-ink-500">Not yok.</p>
            )}
            <form action={notEkle} className="flex gap-2">
              <input type="hidden" name="no" value={s.order_no} />
              <input name="not" maxLength={400} placeholder="Not ekle (müşteriyle görüşme, tedarik bilgisi…)" className="h-9 flex-1 rounded-md border border-ink-200 px-3 text-[13px] outline-none focus:border-brand-600" />
              <button className="h-9 rounded-md border border-ink-200 px-3 text-[12.5px] font-semibold text-ink-700">Ekle</button>
            </form>
          </Kutu>
        </div>

        <div className="space-y-5">
          <Kutu baslik="Durum">
            <div className="flex flex-wrap items-center gap-2">
              <SiparisEtiketi durum={s.status} />
              {s.paid_at ? <span className="text-[12px] text-ink-500">ödendi {formatDateTime(s.paid_at)}</span> : null}
            </div>
            {s.failed_reason_msg ? (
              <p className="mt-2 text-[12.5px] text-danger">PayTR: {s.failed_reason_msg} ({s.failed_reason_code})</p>
            ) : null}
            {s.tracking_no ? (
              <p className="mt-2 text-[13px]">{s.cargo_company} · <b className="font-mono">{s.tracking_no}</b></p>
            ) : null}

            {gecisler.includes('SHIPPED') ? (
              <form action={kargoyaVer} className="mt-4 space-y-2 border-t border-ink-100 pt-4">
                <input type="hidden" name="no" value={s.order_no} />
                <b className="block text-[12.5px] font-semibold text-ink-800">Kargoya verildi olarak işaretle</b>
                <input name="kargoFirmasi" required maxLength={40} placeholder="Kargo firması" className="h-9 w-full rounded-md border border-ink-200 px-3 text-[13px] outline-none focus:border-brand-600" />
                <input name="takipNo" required maxLength={60} placeholder="Takip numarası" className="h-9 w-full rounded-md border border-ink-200 px-3 font-mono text-[13px] outline-none focus:border-brand-600" />
                <button className="h-9 w-full rounded-md bg-brand-700 text-[13px] font-semibold text-white">Kargoya verildi</button>
              </form>
            ) : null}

            <div className="mt-3 flex flex-wrap gap-2">
              {gecisler.includes('DELIVERED') ? <DurumDugmesi no={s.order_no} yeni="DELIVERED" etiket="Teslim edildi" /> : null}
              {gecisler.includes('CANCELLED') ? <DurumDugmesi no={s.order_no} yeni="CANCELLED" etiket="İptal et" /> : null}
              {gecisler.includes('REFUNDED') ? <DurumDugmesi no={s.order_no} yeni="REFUNDED" etiket="İade edildi olarak işaretle" uyari /> : null}
            </div>
            {gecisler.includes('REFUNDED') ? (
              <p className="mt-2 text-[11.5px] text-ink-500">
                İade parasını PayTR mağaza panelinden gönderin; bu düğme yalnızca kaydı günceller.
              </p>
            ) : null}
          </Kutu>

          <Kutu baslik="Müşteri ve teslimat">
            <dl className="space-y-1.5 text-[13px]">
              <Satir e="Ad soyad" d={s.full_name} />
              <Satir e="Telefon" d={s.phone} />
              <Satir e="E-posta" d={s.email} />
              <Satir e="Adres" d={`${s.ship_address}, ${s.ship_district} / ${s.ship_city}${s.ship_postal_code ? ` ${s.ship_postal_code}` : ''}`} />
            </dl>
          </Kutu>

          <Kutu baslik="Fatura">
            <dl className="space-y-1.5 text-[13px]">
              <Satir e="Tür" d={s.invoice_type === 'KURUMSAL' ? 'Kurumsal' : 'Bireysel'} />
              {s.invoice_type === 'KURUMSAL' ? (
                <>
                  <Satir e="Unvan" d={s.invoice_name ?? '—'} />
                  <Satir e="Vergi dairesi / no" d={`${s.invoice_tax_office ?? '—'} / ${s.invoice_tax_no ?? '—'}`} />
                </>
              ) : null}
              <Satir e="Fatura adresi" d={s.invoice_address ?? 'Teslimat adresiyle aynı'} />
            </dl>
          </Kutu>

          <Kutu baslik="Yasal kayıt">
            <dl className="space-y-1.5 text-[12.5px]">
              <Satir e="Sözleşme sürümü" d={s.terms_version} />
              <Satir e="Onay zamanı" d={formatDateTime(s.terms_accepted_at)} />
              <Satir e="IP" d={s.customer_ip} />
            </dl>
          </Kutu>
        </div>
      </div>
    </>
  )
}

function DurumDugmesi({ no, yeni, etiket, uyari }: { no: string; yeni: string; etiket: string; uyari?: boolean }) {
  return (
    <form action={durumDegistir}>
      <input type="hidden" name="no" value={no} />
      <input type="hidden" name="yeni" value={yeni} />
      <button className={uyari ? 'h-9 rounded-md border border-[#F5DFB8] bg-[#FDF8EE] px-3 text-[12.5px] font-semibold text-warning' : 'h-9 rounded-md border border-ink-200 bg-white px-3 text-[12.5px] font-semibold text-ink-700'}>
        {etiket}
      </button>
    </form>
  )
}

function Kutu({ baslik, children }: { baslik: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-ink-100 bg-white p-4">
      <h2 className="mb-3 text-[11px] font-bold tracking-wider text-ink-500 uppercase">{baslik}</h2>
      {children}
    </section>
  )
}

function Satir({ e, d, kalin }: { e: string; d: string; kalin?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-ink-500">{e}</dt>
      <dd className={kalin ? 'text-right font-semibold text-ink-900' : 'text-right text-ink-800'}>{d}</dd>
    </div>
  )
}
