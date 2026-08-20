import { listConflicts } from '@/server/admin/queries'
import { DataTable, PageHeader, StatusPill, Td } from '@/components/admin/shell'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Veri Çakışmaları' }

export default async function AdminConflictsPage() {
  const conflicts = await listConflicts()
  const open = conflicts.filter((c) => c.status === 'OPEN')

  return (
    <>
      <PageHeader
        eyebrow="Uyumluluk"
        title="Veri çakışmaları"
        description="İki kaynak aynı ürün–motor için farklı şey söylediğinde kayıt buraya düşer. Karar verilene kadar müşteriye uyumlu gösterilmez."
      />

      <div className="mb-5 rounded-lg border border-[#F1DFBE] bg-[#FDF9F0] px-4 py-3 text-[13px] text-ink-700">
        <b className="font-semibold text-ink-900">{open.length} açık çakışma</b> — bu kayıtlar
        arayüzde gri <b>&quot;Uyumluluk teyit edilmedi&quot;</b> olarak görünüyor ve
        <b> asla yeşil rozet almıyor</b>. Elle karar verildiğinde (MANUAL kaynak) kayıt
        VERIFIED olur ve kuyruktan düşer.
      </div>

      <DataTable
        columns={[
          { label: '#', width: '60px' },
          { label: 'Ürün' },
          { label: 'Araç / motor' },
          { label: 'Çelişen kaynaklar' },
          { label: 'Şu anki durum' },
          { label: 'Önem' },
          { label: 'Kuyruk' },
        ]}
        empty="Açık çakışma yok. Kaynaklar hemfikir."
      >
        {conflicts.map((c) => {
          const candidates = (c.candidates ?? []) as Array<Record<string, unknown>>
          return (
            <tr key={c.id} className="border-b border-ink-50 last:border-0" data-testid="conflict-row">
              <Td mono>#{c.id}</Td>
              <Td>
                <span className="ocm-code text-[11.5px]">{c.sku ?? '—'}</span>{' '}
                <span className="text-ink-700">{c.product_name ?? ''}</span>
              </Td>
              <Td>
                {c.vehicle_brand} {c.model}
                <span className="ml-1.5 text-ink-500">{c.engine}</span>
              </Td>
              <Td>
                <div className="flex flex-wrap gap-1.5">
                  {candidates.map((cand, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 rounded-sm bg-ink-50 px-2 py-0.5 text-[11.5px] text-ink-700"
                    >
                      <b className="font-semibold">{String(cand.sourceCode ?? cand.source_code ?? '?')}</b>
                      <span className="text-ink-400">
                        {String(cand.value ?? cand.assertionType ?? cand.assertion_type ?? '')}
                      </span>
                    </span>
                  ))}
                </div>
              </Td>
              <Td>{c.compat_status ? <StatusPill status={c.compat_status} /> : '—'}</Td>
              <Td className="text-ink-500">{c.severity}</Td>
              <Td><StatusPill status={c.status} /></Td>
            </tr>
          )
        })}
      </DataTable>
    </>
  )
}
