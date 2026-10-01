import Link from 'next/link'
import { requireAdmin } from '@/server/admin/auth'
import { db, siparisListesi, siparisSayaclari, type SiparisFiltresi } from '@ocm/db'
import { DataTable, PageHeader, StatTile, Td } from '@/components/admin/shell'
import { formatDateTime, cn } from '@/lib/utils'
import { SiparisEtiketi, kurus } from './siparis-etiketi'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Siparişler' }

const SEKMELER: Array<{ filtre: SiparisFiltresi; etiket: string }> = [
  { filtre: 'HAZIRLANACAK', etiket: 'Hazırlanacak' },
  { filtre: 'KARGODA', etiket: 'Kargoda' },
  { filtre: 'SORUNLU', etiket: 'Dikkat gerektiren' },
  { filtre: 'ODEME_BEKLEYEN', etiket: 'Ödeme bekleyen' },
  { filtre: 'KAPANAN', etiket: 'Kapanan' },
  { filtre: 'TUMU', etiket: 'Tümü' },
]

export default async function AdminSiparislerSayfasi({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  await requireAdmin()
  const sp = await searchParams
  const filtre = (SEKMELER.find((s) => s.filtre === sp.filtre)?.filtre ?? 'HAZIRLANACAK') as SiparisFiltresi
  const ara = sp.ara?.trim() || null
  const [liste, sayac] = await Promise.all([
    siparisListesi(db, { filtre: ara ? 'TUMU' : filtre, ara }),
    siparisSayaclari(db),
  ])

  return (
    <>
      <PageHeader
        eyebrow="Satış"
        title="Siparişler"
        description="Ödeme durumu yalnızca PayTR bildirimiyle değişir. Kargo ve teslim bilgisini buradan girersiniz; iadeyi PayTR panelinden yapıp burada işaretlersiniz."
        actions={
          <form className="flex gap-2">
            <input
              name="ara"
              defaultValue={ara ?? ''}
              placeholder="Sipariş no, ad, e-posta, telefon"
              className="h-10 w-[280px] rounded-md border border-ink-200 px-3 text-[13px] outline-none focus:border-brand-600"
            />
            <button className="h-10 rounded-md bg-brand-700 px-4 text-[13px] font-semibold text-white">Ara</button>
          </form>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Hazırlanacak" value={sayac.hazirlanacak} tone={sayac.hazirlanacak > 0 ? 'warn' : 'default'} hint="Ödendi, kargoya verilmedi" />
        <StatTile label="Kargoda" value={sayac.kargoda} />
        <StatTile label="Dikkat gerektiren" value={sayac.sorunlu} tone={sayac.sorunlu > 0 ? 'bad' : 'default'} hint="Stok yetersiz, ödeme hatası, tutar uyuşmazlığı" />
        <StatTile label="Ödeme bekleyen" value={sayac.odemeBekleyen} hint="Ödeme ekranında bırakılmış olabilir" />
      </div>

      {!ara ? (
        <nav className="mb-4 flex flex-wrap gap-1.5" aria-label="Sipariş filtreleri">
          {SEKMELER.map((s) => (
            <Link
              key={s.filtre}
              href={`/admin/siparisler?filtre=${s.filtre}`}
              prefetch={false}
              className={cn(
                'rounded-md border px-3 py-1.5 text-[12.5px] font-semibold',
                s.filtre === filtre
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300',
              )}
            >
              {s.etiket}
            </Link>
          ))}
        </nav>
      ) : null}

      <DataTable
        columns={[
          { label: 'Sipariş' },
          { label: 'Tarih' },
          { label: 'Müşteri' },
          { label: 'Adet', align: 'right' },
          { label: 'Tutar', align: 'right' },
          { label: 'Kargo' },
          { label: 'Durum' },
        ]}
        empty={ara ? `"${ara}" için sipariş yok.` : 'Bu filtrede sipariş yok.'}
      >
        {liste.map((o) => (
          <tr key={o.order_no} className="border-b border-ink-50 last:border-0" data-testid="admin-siparis-satiri">
            <Td mono>
              <Link href={`/admin/siparisler/${o.order_no}`} prefetch={false} className="font-semibold text-brand-600 hover:underline">
                {o.order_no}
              </Link>
            </Td>
            <Td>{formatDateTime(o.created_at)}</Td>
            <Td>
              <span className="block font-medium text-ink-900">{o.full_name}</span>
              <span className="text-[12px] text-ink-500">{o.ship_city} · {o.phone}</span>
            </Td>
            <Td align="right">{o.adet}</Td>
            <Td align="right">
              <b className="font-semibold text-ink-900">{kurus(o.total_kurus)}</b>
              {o.paid_total_kurus && o.paid_total_kurus !== o.total_kurus ? (
                <span className="block text-[11.5px] text-ink-500">çekilen {kurus(o.paid_total_kurus)}</span>
              ) : null}
            </Td>
            <Td>{o.shipping_payer === 'SATICI' ? 'Ücretsiz' : 'Alıcı öder'}</Td>
            <Td>
              <span className="flex flex-wrap items-center gap-1.5">
                <SiparisEtiketi durum={o.status} />
                {o.test_mode ? <span className="rounded-sm bg-[#FDF3E2] px-1.5 py-0.5 text-[10.5px] font-bold text-warning">TEST</span> : null}
                {o.stock_shortage ? <span className="rounded-sm bg-[#FBEAE8] px-1.5 py-0.5 text-[10.5px] font-bold text-danger">STOK</span> : null}
              </span>
            </Td>
          </tr>
        ))}
      </DataTable>
    </>
  )
}
