import { listAdminBrands } from '@/server/admin/queries'
import { requireAdmin } from '@/server/admin/auth'
import { DataTable, PageHeader, Td } from '@/components/admin/shell'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Markalar' }

export default async function AdminBrandsPage() {
  await requireAdmin()
  const brands = await listAdminBrands()

  return (
    <>
      <PageHeader
        eyebrow="Katalog"
        title="Ürün markaları"
        description="Import sırasında tanımsız bir marka gelirse otomatik oluşturulur ve önizlemede bildirilir."
      />
      <DataTable
        columns={[
          { label: 'Marka' },
          { label: 'Slug' },
          { label: 'Ülke' },
          { label: 'Öne çıkan' },
          { label: 'Durum' },
          { label: 'Ürün', align: 'right' },
        ]}
        empty="Marka yok."
      >
        {brands.map((b) => (
          <tr key={b.id} className="border-b border-ink-50 last:border-0">
            <Td className="font-medium text-ink-900">{b.name}</Td>
            <Td mono>{b.slug}</Td>
            <Td className="text-ink-500">{b.country ?? '—'}</Td>
            <Td>{b.is_featured ? 'Evet' : '—'}</Td>
            <Td>{b.is_active ? 'Aktif' : 'Pasif'}</Td>
            <Td align="right" mono>{b.productCount}</Td>
          </tr>
        ))}
      </DataTable>
    </>
  )
}
