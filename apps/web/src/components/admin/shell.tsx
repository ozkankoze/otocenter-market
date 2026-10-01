import Link from 'next/link'
import { cn } from '@/lib/utils'

export const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', group: 'Genel' },
  { href: '/admin/siparisler', label: 'Siparişler', group: 'Satış' },
  { href: '/admin/urunler', label: 'Ürünler', group: 'Katalog' },
  { href: '/admin/kategoriler', label: 'Kategoriler', group: 'Katalog' },
  { href: '/admin/markalar', label: 'Markalar', group: 'Katalog' },
  { href: '/admin/oem', label: 'OEM Numaraları', group: 'Katalog' },
  { href: '/admin/arac-agaci', label: 'Araç Ağacı', group: 'Uyumluluk' },
  { href: '/admin/uyumluluk', label: 'Uyumluluk', group: 'Uyumluluk' },
  { href: '/admin/cakismalar', label: 'Veri Çakışmaları', group: 'Uyumluluk' },
  { href: '/admin/veri-kaynaklari', label: 'Veri Kaynakları', group: 'Veri' },
  { href: '/admin/importlar', label: 'Importlar', group: 'Veri' },
] as const

export function AdminSidebar({ active, openConflicts }: { active: string; openConflicts: number }) {
  const groups = [...new Set(ADMIN_NAV.map((n) => n.group))]

  return (
    <aside className="hidden w-[228px] shrink-0 border-r border-ink-100 bg-white lg:block">
      <div className="sticky top-0 flex h-14 items-center gap-2 border-b border-ink-100 px-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-700 text-[11px] font-bold text-white">
          OC
        </span>
        <span className="text-[13px] font-bold tracking-tight text-ink-900">
          Yönetim
          <span className="ml-1.5 rounded-sm bg-ink-50 px-1.5 py-0.5 text-[10px] font-semibold text-ink-500">
            ADMIN
          </span>
        </span>
      </div>

      <nav className="p-3">
        {groups.map((group) => (
          <div key={group} className="mb-4">
            <span className="mb-1.5 block px-2 text-[10px] font-bold tracking-wider text-ink-400 uppercase">
              {group}
            </span>
            <ul className="space-y-0.5">
              {ADMIN_NAV.filter((n) => n.group === group).map((item) => {
                const isActive =
                  item.href === '/admin' ? active === '/admin' : active.startsWith(item.href)
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      prefetch={false}
                      className={cn(
                        'flex items-center justify-between rounded-md px-2.5 py-1.5 text-[13px] transition-colors',
                        isActive
                          ? 'bg-brand-50 font-semibold text-brand-700'
                          : 'text-ink-700 hover:bg-ink-25 hover:text-brand-600',
                      )}
                    >
                      {item.label}
                      {item.href === '/admin/cakismalar' && openConflicts > 0 ? (
                        <span className="rounded-sm bg-[#FBEAE8] px-1.5 py-0.5 text-[10.5px] font-bold text-danger">
                          {openConflicts}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <span className="ocm-eyebrow">{eyebrow}</span> : null}
        <h1 className="mt-1.5 text-[22px] font-bold tracking-tight text-ink-900">{title}</h1>
        {description ? <p className="mt-1 max-w-[720px] text-[13.5px] text-ink-600">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  )
}

export function StatTile({
  label,
  value,
  hint,
  tone = 'default',
}: {
  label: string
  value: string | number
  hint?: string
  tone?: 'default' | 'good' | 'warn' | 'bad'
}) {
  const toneClass = {
    default: 'text-ink-900',
    good: 'text-accent-700',
    warn: 'text-warning',
    bad: 'text-danger',
  }[tone]

  return (
    <div className="rounded-lg border border-ink-100 bg-white px-4 py-3.5">
      <span className="block text-[11px] font-semibold tracking-wider text-ink-500 uppercase">
        {label}
      </span>
      <b className={cn('mt-1 block text-[24px] leading-tight font-bold tracking-tight', toneClass)}>
        {typeof value === 'number' ? value.toLocaleString('tr-TR') : value}
      </b>
      {hint ? <span className="mt-0.5 block text-[11.5px] text-ink-400">{hint}</span> : null}
    </div>
  )
}

export function DataTable({
  columns,
  children,
  empty,
}: {
  columns: Array<{ label: string; align?: 'left' | 'right' | 'center'; width?: string }>
  children: React.ReactNode
  empty?: string
}) {
  const hasRows = Array.isArray(children) ? children.length > 0 : Boolean(children)
  return (
    <div className="overflow-x-auto rounded-lg border border-ink-100 bg-white">
      <table className="w-full min-w-[720px] text-left text-[13px]">
        <thead>
          <tr className="border-b border-ink-100 bg-ink-25">
            {columns.map((c) => (
              <th
                key={c.label}
                style={c.width ? { width: c.width } : undefined}
                className={cn(
                  'px-4 py-2.5 text-[10.5px] font-bold tracking-wider text-ink-600 uppercase',
                  c.align === 'right' && 'text-right',
                  c.align === 'center' && 'text-center',
                )}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hasRows ? (
            children
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-[13px] text-ink-500">
                {empty ?? 'Kayıt yok.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function Td({
  children,
  align,
  mono,
  className,
}: {
  children: React.ReactNode
  align?: 'left' | 'right' | 'center'
  mono?: boolean
  className?: string
}) {
  return (
    <td
      className={cn(
        'px-4 py-2.5 text-ink-700',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        mono && 'ocm-code text-[12px]',
        className,
      )}
    >
      {children}
    </td>
  )
}

/** Uyumluluk durumu rozeti — arayüz kuralıyla birebir aynı renk sözlüğü. */
export function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    VERIFIED: { label: 'Doğrulandı', cls: 'bg-accent-100 text-accent-700' },
    SOURCED: { label: 'Kaynaklı', cls: 'bg-accent-100 text-accent-700' },
    CONFLICTED: { label: 'Çakışma', cls: 'bg-[#FDF3E2] text-warning' },
    INCOMPATIBLE: { label: 'Uyumsuz', cls: 'bg-[#FBEAE8] text-danger' },
    ACTIVE: { label: 'Aktif', cls: 'bg-accent-100 text-accent-700' },
    DRAFT: { label: 'Taslak', cls: 'bg-ink-50 text-ink-600' },
    ARCHIVED: { label: 'Arşiv', cls: 'bg-ink-50 text-ink-500' },
    COMPLETED: { label: 'Uygulandı', cls: 'bg-accent-100 text-accent-700' },
    VALIDATED: { label: 'Onay bekliyor', cls: 'bg-brand-50 text-brand-700' },
    PARSED: { label: 'Okundu', cls: 'bg-brand-50 text-brand-700' },
    UPLOADED: { label: 'Yüklendi', cls: 'bg-ink-50 text-ink-600' },
    COMMITTING: { label: 'Uygulanıyor', cls: 'bg-brand-50 text-brand-700' },
    FAILED: { label: 'Başarısız', cls: 'bg-[#FBEAE8] text-danger' },
    CANCELLED: { label: 'İptal', cls: 'bg-ink-50 text-ink-500' },
    ROLLED_BACK: { label: 'Geri alındı', cls: 'bg-[#FDF3E2] text-warning' },
    OPEN: { label: 'Açık', cls: 'bg-[#FDF3E2] text-warning' },
    RESOLVED: { label: 'Çözüldü', cls: 'bg-accent-100 text-accent-700' },
    IGNORED: { label: 'Yok sayıldı', cls: 'bg-ink-50 text-ink-500' },
    ERROR: { label: 'Hata', cls: 'bg-[#FBEAE8] text-danger' },
    WARNING: { label: 'Uyarı', cls: 'bg-[#FDF3E2] text-warning' },
    VALID: { label: 'Geçerli', cls: 'bg-accent-100 text-accent-700' },
    SKIPPED: { label: 'Atlandı', cls: 'bg-ink-50 text-ink-500' },
    APPLIED: { label: 'Uygulandı', cls: 'bg-accent-100 text-accent-700' },
  }
  const v = map[status] ?? { label: status, cls: 'bg-ink-50 text-ink-600' }
  return (
    <span
      className={cn('inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold', v.cls)}
      data-status={status}
    >
      {v.label}
    </span>
  )
}
