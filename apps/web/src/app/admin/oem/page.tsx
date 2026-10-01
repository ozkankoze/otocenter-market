import { listReferences } from '@/server/admin/queries'
import { requireAdmin } from '@/server/admin/auth'
import { DataTable, PageHeader, Td } from '@/components/admin/shell'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'OEM Numaraları' }

const TYPE_LABELS: Record<string, string> = {
  OEM: 'OEM numarası',
  CROSS_EQUIVALENT: 'Muadil',
  CROSS_REPLACES: 'Yerine geçtiği kod',
  CROSS_REPLACED_BY: 'Yerine geçen kod',
}

export default async function AdminReferencesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  await requireAdmin()
  const sp = await searchParams
  const search = sp.ara?.trim() || null
  const rows = await listReferences(search)

  return (
    <>
      <PageHeader
        eyebrow="Katalog"
        title="OEM & çapraz kodlar"
        description="Numara orijinal yazımıyla saklanır; arama normalize edilmiş hali üzerinden yapılır. Aynı numaranın birden çok ürüne bağlı olması muadillerde normaldir."
        actions={
          <form className="flex gap-2">
            <input
              name="ara"
              defaultValue={search ?? ''}
              placeholder="Numara veya SKU"
              className="h-10 w-[240px] rounded-md border border-ink-200 px-3 text-[13px] outline-none focus:border-brand-600"
            />
            <button className="h-10 rounded-md bg-brand-700 px-4 text-[13px] font-semibold text-white">Ara</button>
          </form>
        }
      />
      <DataTable
        columns={[
          { label: 'Numara' },
          { label: 'Normalize' },
          { label: 'Tip' },
          { label: 'Marka' },
          { label: 'Ürün' },
          { label: 'Bağlı ürün', align: 'right' },
        ]}
        empty="Kayıt yok."
      >
        {rows.map((r) => (
          <tr key={r.id} className="border-b border-ink-50 last:border-0" data-testid="oem-row">
            <Td mono className="text-[12.5px] text-ink-900">{r.number}</Td>
            <Td mono className="text-[11.5px] text-ink-400">{r.normalized}</Td>
            <Td className="text-ink-600">{TYPE_LABELS[r.type] ?? r.type}</Td>
            <Td>{r.brand_name ?? '—'}</Td>
            <Td>
              <span className="ocm-code text-[11.5px]">{r.sku}</span>{' '}
              <span className="text-ink-600">{r.product_name}</span>
            </Td>
            <Td align="right" mono className={r.owners > 1 ? 'text-warning' : undefined}>{r.owners}</Td>
          </tr>
        ))}
      </DataTable>
    </>
  )
}
