import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { resolveSelectionByEngineId } from '@/server/vehicle-queries'
import { VEHICLE_COOKIE } from '@/features/vehicle/types'
import { VEHICLE_COOKIE_OPTIONS } from '@/features/vehicle/cookie'

const bodySchema = z.object({ engineId: z.coerce.number().int().positive() })

/** Aracı seç — motor kimliği sunucuda doğrulanır, sonra cookie'ye yazılır. */
export async function POST(request: NextRequest) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek gövdesi.' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Geçersiz motor kimliği.' }, { status: 400 })
  }

  const selection = await resolveSelectionByEngineId(parsed.data.engineId)
  if (!selection) {
    return NextResponse.json({ error: 'Motor bulunamadı.' }, { status: 404 })
  }

  const response = NextResponse.json({ selection })
  response.cookies.set(
    VEHICLE_COOKIE,
    encodeURIComponent(JSON.stringify(selection)),
    VEHICLE_COOKIE_OPTIONS,
  )
  return response
}

/** Araç seçimini temizle. */
export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(VEHICLE_COOKIE, '', { ...VEHICLE_COOKIE_OPTIONS, maxAge: 0 })
  return response
}
