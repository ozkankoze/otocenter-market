import Link from 'next/link'
import { listImports } from '@/server/admin/queries'
import { DataTable, PageHeader, StatusPill, Td } from '@/components/admin/shell'
import { formatDateTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Importlar' }

export default async function ImportListPage() {
  const imports = await listImports()

  return (
    <>
      <PageHeader
        eyebrow="Veri"
        title="Import geçmişi"
        description="Her içe aktarma işlemi kaydedilir ve geri alınabilir. Hangi verinin hangi import'tan geldiği izlenebilir."
        actions={
          <>
            {/* Dosya indirme uç noktası; Link ile sarılmamalı */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/api/admin/import/sablon"
              className="inline-flex h-10 items-center rounded-md border border-ink-200 bg-white px-4 text-[13px] font-medium text-ink-800 transition-colors hover:border-brand-300"
            >
              Şablonu indir
            </a>
            <Link
              href="/admin/importlar/yeni"
              prefetch={false}
              className="inline-flex h-10 items-center rounded-md bg-brand-700 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-brand-800"
              data-testid="new-import"
            >
              Yeni import
            </Link>
          </>
        }
      />

      <DataTable
        columns={[
          { label: 'ID', width: '70px' },
          { label: 'Dosya' },
          { label: 'Kaynak' },
          { label: 'Kullanıcı' },
          { label: 'Durum' },
          { label: 'Toplam', align: 'right' },
          { label: 'Başarılı', align: 'right' },
          { label: 'Hatalı', align: 'right' },
          { label: 'Yeni', align: 'right' },
          { label: 'Güncel.', align: 'right' },
          { label: 'Çakışma', align: 'right' },
          { label: 'Tarih', align: 'right' },
        ]}
        empty="Henüz import yapılmadı. 'Yeni import' ile başlayın."
      >
        {imports.map((i) => {
          const t = i.totals
          const success = (t.valid ?? 0) + (t.warning ?? 0)
          return (
            <tr key={i.id} className="border-b border-ink-50 last:border-0" data-testid="import-row">
              <Td mono>#{i.id}</Td>
              <Td>
                <Link
                  href={`/admin/importlar/${i.id}`}
                  prefetch={false}
                  className="font-medium text-brand-600 hover:underline"
                >
                  {i.fileName}
                </Link>
                <span className="ml-2 text-[11px] text-ink-400">
                  {(i.fileSize / 1024).toFixed(0)} KB
                </span>
              </Td>
              <Td mono>{i.sourceCode}</Td>
              <Td>{i.userName ?? '—'}</Td>
              <Td>
                <StatusPill status={i.status} />
              </Td>
              <Td align="right" mono>
                {(t.total ?? 0).toLocaleString('tr-TR')}
              </Td>
              <Td align="right" mono className="text-accent-700">
                {success.toLocaleString('tr-TR')}
              </Td>
              <Td align="right" mono className={t.error ? 'text-danger' : undefined}>
                {(t.error ?? 0).toLocaleString('tr-TR')}
              </Td>
              <Td align="right" mono>
                {(t.created ?? 0).toLocaleString('tr-TR')}
              </Td>
              <Td align="right" mono>
                {(t.updated ?? 0).toLocaleString('tr-TR')}
              </Td>
              <Td align="right" mono className={t.conflictRisk ? 'text-warning' : undefined}>
                {(t.conflictRisk ?? 0).toLocaleString('tr-TR')}
              </Td>
              <Td align="right" mono>
                {formatDateTime(i.createdAt)}
              </Td>
            </tr>
          )
        })}
      </DataTable>
    </>
  )
}
