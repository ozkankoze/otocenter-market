import { NextResponse, type NextRequest } from 'next/server'
import { db, siparisDurumu } from '@ocm/db'

export const dynamic = 'force-dynamic'

/**
 * Sonuç sayfasının yokladığı uç. YALNIZCA durum döner — ad, adres, tutar yok.
 * Sipariş numarası tahmin edilse bile kişisel veri sızmaz.
 */
export async function GET(request: NextRequest) {
  const no = request.nextUrl.searchParams.get('siparis') ?? ''
  if (!/^[A-Z0-9]{6,32}$/.test(no)) {
    return NextResponse.json({ durum: null }, { status: 400 })
  }
  const status = await siparisDurumu(db, no)
  const durum =
    status === null
      ? null
      : status === 'PENDING_PAYMENT'
        ? 'BEKLIYOR'
        : status === 'PAYMENT_FAILED' || status === 'CANCELLED'
          ? 'BASARISIZ'
          : 'ODENDI'
  return NextResponse.json({ durum }, { headers: { 'Cache-Control': 'no-store' } })
}
