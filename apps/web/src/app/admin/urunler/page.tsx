import Link from 'next/link'
import { listAdminProducts } from '@/server/admin/queries'
import { DataTable, PageHeader, StatusPill, Td } from '@/components/admin/shell'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Ürünler' }

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const sp = await searchParams
  const search = sp.ara?.trim() || null
  const products = await listAdminProducts(search)

  return (
    <>
      <PageHeader
        eyebrow="Katalog"
        title="Ürünler"
        description="Ürünler içe aktarma ile yönetilir. Buradan mevcut kayıtları, uyumluluk ve OEM sayılarını görebilirsiniz."
        actions={
          <form className="flex gap-2">
            <input
              name="ara"
              defaultValue={search ?? ''}
              placeholder="SKU, ad veya ürün kodu"
              className="h-10 w-[260px] rounded-md border border-ink-200 px-3 text-[13px] outline-none focus:border-brand-600"
              data-testid="product-search"
            />
            <button className="h-10 rounded-md bg-brand-700 px-4 text-[13px] font-semibold text-white">
              Ara
            </button>
          </form>
        }
      />

      <DataTable
        columns={[
          { label: 'SKU' },
          { label: 'Ürün' },
          { label: 'Marka' },
          { label: 'Kategori' },
          { label: 'Durum' },
          { label: 'Fiyat', align: 'right' },
          { label: 'Stok', align: 'right' },
          { label: 'Uyumluluk', align: 'right' },
          { label: 'OEM', align: 'right' },
        ]}
        empty={search ? `"${search}" için sonuç yok.` : 'Ürün yok. Import ile ekleyin.'}
      >
        {products.map((p) => (
          <tr key={p.id} className="border-b border-ink-50 last:border-0" data-testid="admin-product-row">
            <Td mono>{p.sku}</Td>
            <Td>
              <Link href={`/urun/${p.slug}`} prefetch={false} className="font-medium text-brand-600 hover:underline">
                {p.name}
              </Link>
              {p.productCode ? <span className="ocm-code ml-2 text-[11px]">{p.productCode}</span> : null}
            </Td>
            <Td>{p.brandName}</Td>
            <Td className="text-ink-500">{p.categoryName}</Td>
            <Td><StatusPill status={p.status} /></Td>
            <Td align="right" mono>{p.price ? `${p.price.toLocaleString('tr-TR')} ₺` : '—'}</Td>
            <Td align="right" mono className={p.stock === 0 ? 'text-ink-400' : undefined}>{p.stock}</Td>
            <Td align="right" mono>{p.compatCount}</Td>
            <Td align="right" mono>{p.refCount}</Td>
          </tr>
        ))}
      </DataTable>
    </>
  )
}
