import { listAdminCategories } from '@/server/admin/queries'
import { DataTable, PageHeader, Td } from '@/components/admin/shell'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Kategoriler' }

export default async function AdminCategoriesPage() {
  const categories = await listAdminCategories()

  return (
    <>
      <PageHeader
        eyebrow="Katalog"
        title="Kategoriler"
        description="Kategori ağacı ve her kategorinin teknik özellik (facet) tanımları. Yeni teknik özellik eklemek kod değişikliği gerektirmez."
      />
      <DataTable
        columns={[
          { label: 'Kod' },
          { label: 'Ad' },
          { label: 'Üst kategori' },
          { label: 'Yol' },
          { label: 'Ürün', align: 'right' },
          { label: 'Teknik özellik', align: 'right' },
        ]}
        empty="Kategori yok."
      >
        {categories.map((c) => (
          <tr key={c.id} className="border-b border-ink-50 last:border-0">
            <Td mono>{c.code}</Td>
            <Td className="font-medium text-ink-900">
              <span style={{ paddingLeft: `${c.depth * 14}px` }}>{c.name}</span>
            </Td>
            <Td className="text-ink-500">{c.parent_name ?? '—'}</Td>
            <Td mono className="text-[11px] text-ink-400">{c.path}</Td>
            <Td align="right" mono>{c.productCount}</Td>
            <Td align="right" mono>{c.attrCount}</Td>
          </tr>
        ))}
      </DataTable>
    </>
  )
}
