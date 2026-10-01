import Link from 'next/link'
import { requireAdmin } from '@/server/admin/auth'
import { notFound } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { getImportDetail } from '@/server/admin/queries'
import { DataTable, PageHeader, StatTile, StatusPill, Td } from '@/components/admin/shell'
import { RollbackButton } from '@/components/admin/rollback-button'
import { formatDateTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Import detayı' }

const SHEET_LABELS: Record<string, string> = {
  CATEGORY: 'Kategoriler',
  VEHICLE: 'Araç Ağacı',
  PRODUCT: 'Ürünler',
  PRICE_STOCK: 'Fiyat & Stok',
  REFERENCE: 'OEM & Çapraz Kodlar',
  COMPATIBILITY: 'Uyumluluk',
}

const ENTITY_LABELS: Record<string, string> = {
  category: 'Kategori',
  category_attribute: 'Kategori özelliği',
  product: 'Ürün',
  product_brand: 'Ürün markası',
  product_variant: 'Varyant',
  price: 'Fiyat',
  stock: 'Stok',
  product_reference: 'OEM / çapraz kod',
  compatibility_assertion: 'Uyumluluk iddiası',
  vehicle_brand: 'Araç markası',
  vehicle_model: 'Model',
  vehicle_generation: 'Nesil',
  vehicle_engine: 'Motor',
}

export default async function ImportDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | undefined>>
}) {
  await requireAdmin()
  const { id } = await params
  const sp = await searchParams
  const detail = await getImportDetail(Number(id))
  if (!detail) notFound()

  const { job, sheets, problemRows, changeSummary, rollback } = detail
  const t = job.totals
  const applied = sheets.reduce((a, s) => a + s.applied, 0)

  return (
    <>
      <PageHeader
        eyebrow={`Import #${job.id}`}
        title={job.fileName}
        description={`${job.sourceName} (${job.sourceCode}) · ${job.userName ?? 'bilinmiyor'} · ${formatDateTime(job.createdAt)}`}
        actions={
          <>
            <Link
              href="/admin/importlar"
              prefetch={false}
              className="inline-flex h-10 items-center rounded-md border border-ink-200 bg-white px-4 text-[13px] font-medium text-ink-800 transition-colors hover:border-brand-300"
            >
              Geçmişe dön
            </Link>
            {(t.error ?? 0) > 0 || (t.duplicate ?? 0) > 0 ? (
              <a
                href={`/api/admin/import/${job.id}/hata-raporu`}
                className="inline-flex h-10 items-center rounded-md border border-ink-200 bg-white px-4 text-[13px] font-medium text-ink-800 transition-colors hover:border-brand-300"
              >
                Hata raporu (Excel)
              </a>
            ) : null}
            {job.status === 'COMPLETED' ? <RollbackButton jobId={job.id} /> : null}
          </>
        }
      />

      {sp.sonuc && job.status === 'COMPLETED' ? (
        <div
          className="mb-5 flex items-start gap-3 rounded-lg border border-[#BFE5D1] bg-accent-100 px-4 py-3"
          data-testid="import-success"
        >
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent-700" aria-hidden="true" />
          <div className="text-[13px] text-ink-800">
            <b className="font-semibold text-accent-700">Import uygulandı.</b>{' '}
            {applied.toLocaleString('tr-TR')} satır işlendi, {(t.error ?? 0).toLocaleString('tr-TR')} hatalı
            satır atlandı. Uyumluluk çözümlemesi yeniden çalıştırıldı.
          </div>
        </div>
      ) : null}

      {rollback ? (
        <div
          className="mb-5 rounded-lg border border-[#F1DFBE] bg-[#FDF9F0] px-4 py-3 text-[13px] text-ink-700"
          data-testid="rollback-summary"
        >
          <b className="block text-[13.5px] font-semibold text-ink-900">Bu import geri alındı</b>
          <p className="mt-1">
            {rollback.reverted.toLocaleString('tr-TR')} kayıt geri alındı ·{' '}
            <b className="font-semibold">
              {rollback.skipped.toLocaleString('tr-TR')} kayıt güvenlik gereği atlandı
            </b>
          </p>
          {rollback.skippedDetails.length ? (
            <ul className="mt-2 list-inside list-disc space-y-0.5 text-[12px] text-ink-600">
              {rollback.skippedDetails.slice(0, 6).map((d, i) => (
                <li key={i}>
                  <span className="ocm-code text-[11px]">
                    {d.entityType}#{d.entityId}
                  </span>{' '}
                  — {d.reason}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {job.errorMessage ? (
        <div className="mb-5 rounded-lg border border-[#F3D4CF] bg-[#FDF1EF] px-4 py-3 text-[13px] text-danger">
          {job.errorMessage}
        </div>
      ) : null}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <StatusPill status={job.status} />
        {job.committedAt ? (
          <span className="text-[12.5px] text-ink-500">
            Uygulandı: {formatDateTime(job.committedAt)}
          </span>
        ) : null}
        {job.rolledBackAt ? (
          <span className="text-[12.5px] text-warning">
            Geri alındı: {formatDateTime(job.rolledBackAt)}
          </span>
        ) : null}
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
        <StatTile label="Toplam satır" value={t.total ?? 0} />
        <StatTile label="Geçerli" value={t.valid ?? 0} tone="good" />
        <StatTile label="Uyarılı" value={t.warning ?? 0} tone={t.warning ? 'warn' : 'default'} />
        <StatTile label="Hatalı" value={t.error ?? 0} tone={t.error ? 'bad' : 'default'} />
        <StatTile label="Duplicate" value={t.duplicate ?? 0} />
        <StatTile label="Yeni" value={t.created ?? 0} />
        <StatTile label="Güncellenen" value={t.updated ?? 0} />
        <StatTile label="Çakışma riski" value={t.conflictRisk ?? 0} tone={t.conflictRisk ? 'warn' : 'default'} />
      </div>

      <h2 className="mb-3 text-[13px] font-bold tracking-wider text-ink-600 uppercase">Sayfa özeti</h2>
      <div className="mb-7">
        <DataTable
          columns={[
            { label: 'Sayfa' },
            { label: 'Toplam', align: 'right' },
            { label: 'Geçerli', align: 'right' },
            { label: 'Uyarı', align: 'right' },
            { label: 'Hata', align: 'right' },
            { label: 'Atlandı', align: 'right' },
            { label: 'Uygulandı', align: 'right' },
          ]}
        >
          {sheets.map((s) => (
            <tr key={s.sheet} className="border-b border-ink-50 last:border-0">
              <Td className="font-medium text-ink-900">{SHEET_LABELS[s.sheet] ?? s.sheet}</Td>
              <Td align="right" mono>{s.total}</Td>
              <Td align="right" mono className="text-accent-700">{s.valid}</Td>
              <Td align="right" mono className={s.warning ? 'text-warning' : undefined}>{s.warning}</Td>
              <Td align="right" mono className={s.error ? 'text-danger' : undefined}>{s.error}</Td>
              <Td align="right" mono>{s.skipped}</Td>
              <Td align="right" mono className="text-accent-700">{s.applied}</Td>
            </tr>
          ))}
        </DataTable>
      </div>

      {changeSummary.length ? (
        <>
          <h2 className="mb-3 text-[13px] font-bold tracking-wider text-ink-600 uppercase">
            Yazılan kayıtlar (geri alma defteri)
          </h2>
          <div className="mb-7">
            <DataTable
              columns={[
                { label: 'Kayıt tipi' },
                { label: 'Eklenen', align: 'right' },
                { label: 'Güncellenen', align: 'right' },
                { label: 'Geri alınan', align: 'right' },
                { label: 'Atlanan', align: 'right' },
              ]}
            >
              {changeSummary.map((c) => (
                <tr key={c.entityType} className="border-b border-ink-50 last:border-0">
                  <Td className="font-medium text-ink-900">
                    {ENTITY_LABELS[c.entityType] ?? c.entityType}
                    <span className="ocm-code ml-2 text-[11px] text-ink-400">{c.entityType}</span>
                  </Td>
                  <Td align="right" mono>{c.inserts}</Td>
                  <Td align="right" mono>{c.updates}</Td>
                  <Td align="right" mono className={c.reverted ? 'text-warning' : undefined}>{c.reverted}</Td>
                  <Td align="right" mono className={c.skipped ? 'text-ink-500' : undefined}>{c.skipped}</Td>
                </tr>
              ))}
            </DataTable>
          </div>
        </>
      ) : null}

      {problemRows.length ? (
        <>
          <h2 className="mb-3 text-[13px] font-bold tracking-wider text-ink-600 uppercase">
            Sorunlu satırlar
            <span className="ml-2 text-[11px] font-normal normal-case text-ink-400">
              ilk {problemRows.length} kayıt
            </span>
          </h2>
          <DataTable
            columns={[
              { label: 'Sayfa', width: '120px' },
              { label: 'Satır', width: '70px', align: 'right' },
              { label: 'Durum', width: '90px' },
              { label: 'Kod', width: '190px' },
              { label: 'Mesaj' },
            ]}
          >
            {problemRows.map((p, i) => (
              <tr key={`${p.sheet}-${p.rowNo}-${i}`} className="border-b border-ink-50 last:border-0">
                <Td className="text-ink-500">{SHEET_LABELS[p.sheet] ?? p.sheet}</Td>
                <Td align="right" mono>{p.rowNo}</Td>
                <Td>
                  <StatusPill status={p.status} />
                </Td>
                <Td mono className="text-[11px] text-ink-500">
                  {p.messages[0]?.code ?? '—'}
                </Td>
                <Td className={p.status === 'ERROR' ? 'text-danger' : 'text-ink-700'}>
                  {p.messages.map((m) => m.message).join(' · ')}
                </Td>
              </tr>
            ))}
          </DataTable>
        </>
      ) : null}
    </>
  )
}
