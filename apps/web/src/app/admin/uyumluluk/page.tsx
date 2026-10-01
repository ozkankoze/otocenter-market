import Link from 'next/link'
import { requireAdmin } from '@/server/admin/auth'
import { compatibilityStatusCounts, listCompatibility } from '@/server/admin/queries'
import { DataTable, PageHeader, StatTile, StatusPill, Td } from '@/components/admin/shell'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Uyumluluk' }

const FILTERS = [
  { key: '', label: 'Tümü' },
  { key: 'VERIFIED', label: 'Doğrulandı' },
  { key: 'SOURCED', label: 'Kaynaklı' },
  { key: 'CONFLICTED', label: 'Çakışma' },
  { key: 'INCOMPATIBLE', label: 'Uyumsuz' },
]

export default async function AdminCompatibilityPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  await requireAdmin()
  const sp = await searchParams
  const status = sp.durum && sp.durum !== '' ? sp.durum : null
  const [rows, counts] = await Promise.all([listCompatibility(status), compatibilityStatusCounts()])
  const shown = (counts.VERIFIED ?? 0) + (counts.SOURCED ?? 0)

  return (
    <>
      <PageHeader
        eyebrow="Uyumluluk"
        title="Çözümlenmiş uyumluluk"
        description="Sitenin okuduğu tek doğruluk. Kaynakların iddiaları çözümleme motorundan geçtikten sonra bu tabloya düşer."
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatTile label="Doğrulandı" value={counts.VERIFIED ?? 0} tone="good" hint="MANUAL karar" />
        <StatTile label="Kaynaklı" value={counts.SOURCED ?? 0} tone="good" hint="kaynaklar hemfikir" />
        <StatTile label="Çakışma" value={counts.CONFLICTED ?? 0} tone={counts.CONFLICTED ? 'warn' : 'default'} hint="kaynaklar çelişiyor" />
        <StatTile label="Uyumsuz" value={counts.INCOMPATIBLE ?? 0} tone={counts.INCOMPATIBLE ? 'bad' : 'default'} />
        <StatTile label="Yeşil rozet alabilir" value={shown} tone="good" hint="yalnızca VERIFIED + SOURCED" />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key ? `/admin/uyumluluk?durum=${f.key}` : '/admin/uyumluluk'}
            prefetch={false}
            className={cn(
              'inline-flex h-8 items-center rounded-sm border px-3 text-[12.5px] font-medium transition-colors',
              (status ?? '') === f.key
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300',
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <DataTable
        columns={[
          { label: 'SKU' },
          { label: 'Ürün' },
          { label: 'Araç' },
          { label: 'Motor' },
          { label: 'Yıl' },
          { label: 'Durum' },
          { label: 'Kaynak' },
          { label: 'Kısıt' },
        ]}
        empty="Kayıt yok."
      >
        {rows.map((r, i) => (
          <tr key={`${r.product_id}-${r.engine_id}-${i}`} className="border-b border-ink-50 last:border-0" data-testid="compat-row">
            <Td mono>{r.sku}</Td>
            <Td>
              <span className="font-medium text-ink-900">{r.brand}</span>{' '}
              <span className="text-ink-600">{r.product_name}</span>
            </Td>
            <Td>{r.vehicle_brand} {r.model}</Td>
            <Td className="text-ink-600">{r.engine}</Td>
            <Td mono className="text-[11.5px]">{r.years ?? '—'}</Td>
            <Td><StatusPill status={r.status} /></Td>
            <Td mono className="text-[11.5px]">{r.source_code ?? '—'}</Td>
            <Td className="text-[12px] text-ink-500">{r.restriction ?? '—'}</Td>
          </tr>
        ))}
      </DataTable>

      <p className="mt-4 max-w-[760px] text-[12.5px] leading-relaxed text-ink-500">
        <b className="font-semibold text-ink-700">Kural:</b> yalnızca <b>VERIFIED</b> ve <b>SOURCED</b>{' '}
        kayıtlar müşteriye &quot;Aracınıza uygun ✓&quot; gösterilir. <b>CONFLICTED</b> kayıtlar ve
        hiç kaydı olmayan ürün–motor çiftleri gri &quot;Uyumluluk teyit edilmedi&quot; olarak görünür.
      </p>
    </>
  )
}
