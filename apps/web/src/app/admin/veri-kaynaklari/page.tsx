import { listDataSources } from '@/server/admin/queries'
import { DataTable, PageHeader, Td } from '@/components/admin/shell'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Veri Kaynakları' }

const KIND_LABELS: Record<string, string> = {
  MANUAL: 'Elle giriş',
  CATALOG: 'Katalog servisi',
  MANUFACTURER: 'Üretici',
  SUPPLIER: 'Tedarikçi',
  CSV: 'CSV / Excel',
  DERIVED: 'Türetilmiş',
}

export default async function AdminSourcesPage() {
  const sources = await listDataSources()

  return (
    <>
      <PageHeader
        eyebrow="Veri"
        title="Veri kaynakları"
        description="Her uyumluluk iddiasının bir sahibi vardır. Kaynaklar çeliştiğinde çözümleme motoru güven seviyesine bakar; MANUAL kaynak her zaman kazanır."
      />
      <DataTable
        columns={[
          { label: 'Kod' },
          { label: 'Ad' },
          { label: 'Tür' },
          { label: 'Güven seviyesi', align: 'right' },
          { label: 'Aktif iddia', align: 'right' },
          { label: 'Durum' },
        ]}
        empty="Veri kaynağı yok."
      >
        {sources.map((s) => (
          <tr key={s.id} className="border-b border-ink-50 last:border-0" data-testid="source-row">
            <Td mono>{s.code}</Td>
            <Td className="font-medium text-ink-900">{s.name}</Td>
            <Td className="text-ink-500">{KIND_LABELS[s.kind] ?? s.kind}</Td>
            <Td align="right">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-1.5 w-[70px] overflow-hidden rounded-full bg-ink-100">
                  <span
                    className="block h-full rounded-full bg-brand-600"
                    style={{ width: `${s.trust_level}%` }}
                  />
                </span>
                <b className="ocm-code text-[12px] text-ink-900">{s.trust_level}</b>
              </span>
            </Td>
            <Td align="right" mono>{s.assertionCount.toLocaleString('tr-TR')}</Td>
            <Td>{s.is_active ? 'Aktif' : 'Pasif'}</Td>
          </tr>
        ))}
      </DataTable>
    </>
  )
}
