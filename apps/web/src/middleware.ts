import { NextResponse, type NextRequest } from 'next/server'

/**
 * Sunucu bileşenlerinde aktif yolu bilmek için `x-pathname` başlığı eklenir
 * (App Router bunu doğrudan sunmuyor). Admin kabuğu aktif menü öğesini
 * bu başlıktan okur.
 */
export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers)
  headers.set('x-pathname', request.nextUrl.pathname)
  return NextResponse.next({ request: { headers } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
