import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE } from '@/server/admin/auth'

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/admin/giris', request.url), 303)
  response.cookies.delete(ADMIN_COOKIE)
  return response
}
