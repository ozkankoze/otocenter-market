import Link from 'next/link'
import { getDashboardStats } from '@/server/admin/queries'
import { DataTable, PageHeader, StatTile, StatusPill, Td } from '@/components/admin/shell'
import { formatDateTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Dashboard' }

export default async function AdminDashboard() {
  const s = await getDashboardStats()
  const shown = s.verified + s.sourced
  const notShown = s.conflicted + s.incompatible

  return (
    <>
      <PageHeader
        eyebrow="Genel bakış"
        title="Dashboard"
        description="Katalog, araç ağacı ve uyumluluk verisinin güncel durumu."
        actions={
          <Link
            href="/admin/importlar/yeni"
            prefetch={false}
            className="inline-flex h-10 items-center rounded-md bg-brand-700 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Yeni import
          </Link>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
        <StatTile label="Ürün" value={s.products} hint={`${s.activeProducts} aktif`} />
        <StatTile label="Kategori" value={s.categories} />
        <StatTile label="Ürün markası" value={s.productBrands} />
        <StatTile label="Araç markası" value={s.vehicleBrands} hint={`${s.models} model`} />
        <StatTile label="Motor" value={s.engines} />
        <StatTile label="OEM / çapraz kod" value={s.references} />
      </div>

      <h2 className="mt-7 mb-3 text-[13px] font-bold tracking-wider text-ink-600 uppercase">
        Uyumluluk verisi
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatTile label="İddia (assertion)" value={s.assertions} hint="kaynakların söyledikleri" />
        <StatTile label="Çözümlenmiş kayıt" value={s.compatibility} hint="sitenin okuduğu" />
        <StatTile label="Doğrulandı" value={s.verified} tone="good" hint="VERIFIED" />
        <StatTile label="Kaynaklı" value={s.sourced} tone="good" hint="SOURCED" />
        <StatTile label="Çakışma" value={s.conflicted} tone={s.conflicted ? 'warn' : 'default'} hint="CONFLICTED" />
        <StatTile label="Uyumsuz" value={s.incompatible} tone={s.incompatible ? 'bad' : 'default'} hint="INCOMPATIBLE" />
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-lg border border-accent-100 bg-accent-100/40 px-4 py-3.5">
          <b className="block text-[13px] font-semibold text-accent-700">
            {shown.toLocaleString('tr-TR')} kayıt müşteriye &quot;Aracınıza uygun ✓&quot; gösterilebilir
          </b>
          <p className="mt-1 text-[12.5px] text-ink-600">
            Yalnızca VERIFIED ve SOURCED kayıtlar yeşil rozet alır.
          </p>
        </div>
        <div className="rounded-lg border border-ink-200 bg-white px-4 py-3.5">
          <b className="block text-[13px] font-semibold text-ink-800">
            {notShown.toLocaleString('tr-TR')} kayıt uygun olarak GÖSTERİLMEZ
          </b>
          <p className="mt-1 text-[12.5px] text-ink-600">
            Çakışmalı ve uyumsuz kayıtlar müşteriye asla uyumlu gösterilmez.
            {s.openConflicts > 0 ? (
              <>
                {' '}
                <Link href="/admin/cakismalar" prefetch={false} className="font-semibold text-brand-600 hover:underline">
                  {s.openConflicts} açık çakışma bekliyor →
                </Link>
              </>
            ) : null}
          </p>
        </div>
      </div>

      <h2 className="mt-7 mb-3 text-[13px] font-bold tracking-wider text-ink-600 uppercase">
        Son importlar
      </h2>
      <DataTable
        columns={[
          { label: '#' },
          { label: 'Dosya' },
          { label: 'Kaynak' },
          { label: 'Durum' },
          { label: 'Satır', align: 'right' },
          { label: 'Hatalı', align: 'right' },
          { label: 'Tarih', align: 'right' },
        ]}
        empty="Henüz import yapılmadı."
      >
        {s.lastImports.map((i) => (
          <tr key={i.id} className="border-b border-ink-50 last:border-0">
            <Td mono>#{i.id}</Td>
            <Td>
              <Link href={`/admin/importlar/${i.id}`} prefetch={false} className="font-medium text-brand-600 hover:underline">
                {i.fileName}
              </Link>
            </Td>
            <Td mono>{i.sourceCode}</Td>
            <Td>
              <StatusPill status={i.status} />
            </Td>
            <Td align="right" mono>
              {(i.totals.total ?? 0).toLocaleString('tr-TR')}
            </Td>
            <Td align="right" mono className={i.totals.error ? 'text-danger' : undefined}>
              {(i.totals.error ?? 0).toLocaleString('tr-TR')}
            </Td>
            <Td align="right" mono>
              {formatDateTime(i.createdAt)}
            </Td>
          </tr>
        ))}
      </DataTable>
    </>
  )
}
