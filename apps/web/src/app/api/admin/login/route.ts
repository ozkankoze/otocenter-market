import { NextResponse, type NextRequest } from 'next/server'
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_OPTIONS,
  checkPassword,
  ensureAdminUser,
  makeSessionValue,
} from '@/server/admin/auth'

export async function POST(request: NextRequest) {
  const form = await request.formData()
  const email = String(form.get('email') ?? '').trim().toLowerCase()
  const password = String(form.get('password') ?? '')

  if (!email || !checkPassword(password)) {
    return NextResponse.redirect(new URL('/admin/giris?hata=1', request.url), 303)
  }

  const user = await ensureAdminUser(email)
  const response = NextResponse.redirect(new URL('/admin', request.url), 303)
  response.cookies.set(ADMIN_COOKIE, makeSessionValue(user.email), ADMIN_COOKIE_OPTIONS)
  return response
}
