import { redirect } from 'next/navigation'
import { adminYapilandirildi, getAdminSession } from '@/server/admin/auth'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Giriş' }

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const session = await getAdminSession()
  if (session) redirect('/admin')
  const sp = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FB] px-4">
      <div className="w-full max-w-[380px] rounded-lg border border-ink-100 bg-white p-7">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-700 text-[12px] font-bold text-white">
            OC
          </span>
          <div>
            <b className="block text-[15px] font-bold tracking-tight text-ink-900">
              Oto Center Market
            </b>
            <span className="text-[12px] text-ink-500">Yönetim paneli</span>
          </div>
        </div>

        {!adminYapilandirildi() ? (
          <p className="mb-4 rounded-md border border-[#F3D4CF] bg-[#FDF1EF] px-3 py-2 text-[12.5px] text-danger">
            Panel kapalı: sunucuda ADMIN_PASSWORD (en az 10 karakter) ve ADMIN_SESSION_SECRET
            (en az 32 karakter) tanımlanmalı.
          </p>
        ) : null}

        {sp.hata ? (
          <p className="mb-4 rounded-md border border-[#F3D4CF] bg-[#FDF1EF] px-3 py-2 text-[12.5px] text-danger">
            E-posta veya parola hatalı.
          </p>
        ) : null}

        <form action="/api/admin/login" method="post" className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-[12px] font-semibold text-ink-800">E-posta</span>
            <input
              type="email"
              name="email"
              required
              defaultValue="admin@otocentermarket.com"
              className="h-10 w-full rounded-md border border-ink-200 px-3 text-[13.5px] outline-none focus:border-brand-600"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[12px] font-semibold text-ink-800">Parola</span>
            <input
              type="password"
              name="password"
              required
              className="h-10 w-full rounded-md border border-ink-200 px-3 text-[13.5px] outline-none focus:border-brand-600"
            />
          </label>
          <button
            type="submit"
            className="h-10 w-full rounded-md bg-brand-700 text-[13.5px] font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Giriş yap
          </button>
        </form>

        <p className="mt-5 border-t border-ink-50 pt-4 text-[11.5px] leading-relaxed text-ink-400">
          Bu sprintte oturum yönetimi bilinçli olarak minimum tutuldu: parola
          <span className="ocm-code mx-1">ADMIN_PASSWORD</span>
          ortam değişkeninden okunur. Rol/yetki matrisi sonraki sprintte.
        </p>
      </div>
    </div>
  )
}
