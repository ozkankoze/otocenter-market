import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { db, siparisSorgula } from '@ocm/db'

export const dynamic = 'force-dynamic'

const govde = z.object({
  siparisNo: z.string().trim().min(6).max(40),
  email: z.string().trim().min(3).max(100),
})

/**
 * Sipariş takip — sipariş numarası VE e-posta birlikte eşleşmeli.
 * Yalnızca numara ile sorgu yapılamaz; eşleşme yoksa "bulunamadı" der,
 * hangisinin yanlış olduğunu söylemez.
 */
export async function POST(request: NextRequest) {
  let veri: unknown
  try {
    veri = await request.json()
  } catch {
    return NextResponse.json({ siparis: null }, { status: 400 })
  }
  const p = govde.safeParse(veri)
  if (!p.success) return NextResponse.json({ siparis: null }, { status: 400 })
  const siparis = await siparisSorgula(db, p.data.siparisNo, p.data.email)
  return NextResponse.json({ siparis }, { headers: { 'Cache-Control': 'no-store' } })
}
