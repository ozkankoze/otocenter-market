import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { db } from '@ocm/db'
import { AdminSidebar } from '@/components/admin/shell'
import { getAdminSession } from '@/server/admin/auth'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: { default: 'Yönetim · Oto Center Market', template: '%s · Yönetim' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const pathname = h.get('x-pathname') ?? h.get('x-invoke-path') ?? '/admin'

  // Giriş sayfası kabuğun dışındadır
  if (pathname.startsWith('/admin/giris')) return <>{children}</>

  const session = await getAdminSession()
  if (!session) redirect('/admin/giris')

  const conflicts = await db
    .selectFrom('data_conflict')
    .select(({ fn }) => fn.countAll<string>().as('n'))
    .where('status', '=', 'OPEN')
    .executeTakeFirst()

  return (
    <div className="flex min-h-screen bg-[#F6F8FB]">
      <AdminSidebar active={pathname} openConflicts={Number(conflicts?.n ?? 0)} />

      <div className="min-w-0 flex-1">
        <header className="flex h-14 items-center gap-4 border-b border-ink-100 bg-white px-5">
          <Link
            href="/"
            prefetch={false}
            className="text-[12.5px] font-medium text-ink-600 transition-colors hover:text-brand-600"
          >
            ← Siteye dön
          </Link>
          <span className="ml-auto text-[12.5px] text-ink-600">
            {session.name}
            <span className="ml-2 text-ink-400">{session.email}</span>
          </span>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="rounded-sm border border-ink-200 px-2.5 py-1 text-[12px] font-medium text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-600"
            >
              Çıkış
            </button>
          </form>
        </header>

        <main className="p-5 xl:p-7" data-testid="admin-main">
          {children}
        </main>
      </div>
    </div>
  )
}
