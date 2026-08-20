import { listVehicleTree } from '@/server/admin/queries'
import { DataTable, PageHeader, Td } from '@/components/admin/shell'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Araç Ağacı' }

export default async function AdminVehicleTreePage() {
  const rows = await listVehicleTree()

  return (
    <>
      <PageHeader
        eyebrow="Uyumluluk"
        title="Araç ağacı"
        description="Marka → model → motor. Motor kodu, uyumluluk eşleştirmesinin en güvenilir anahtarıdır; kodsuz motorlar yalnızca ada göre eşleşir."
      />
      <DataTable
        columns={[
          { label: 'Marka' },
          { label: 'Model' },
          { label: 'Motor' },
          { label: 'Motor kodu' },
          { label: 'Yakıt' },
          { label: 'HP', align: 'right' },
          { label: 'Uyumlu ürün', align: 'right' },
        ]}
        empty="Araç ağacı boş. ARAC_AGACI sayfasıyla import edin."
      >
        {rows.map((r) => (
          <tr key={r.engine_id} className="border-b border-ink-50 last:border-0" data-testid="vehicle-row">
            <Td className="font-medium text-ink-900">{r.brand}</Td>
            <Td>
              {r.model}
              {r.model_years ? <span className="ocm-code ml-2 text-[11px]">{r.model_years}</span> : null}
            </Td>
            <Td>{r.engine}</Td>
            <Td mono className={r.engine_codes?.length ? undefined : 'text-warning'}>
              {r.engine_codes?.length ? r.engine_codes.join(' · ') : 'kod yok'}
            </Td>
            <Td className="text-ink-500">{r.fuel}</Td>
            <Td align="right" mono>{r.hp ?? '—'}</Td>
            <Td align="right" mono>{r.compatCount}</Td>
          </tr>
        ))}
      </DataTable>
    </>
  )
}
