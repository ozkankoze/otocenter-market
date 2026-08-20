import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { getVehicleEngines } from '@/server/vehicle-queries'
import { catalogCacheHeaders } from '@/lib/http'

const querySchema = z.object({ modelId: z.coerce.number().int().positive() })

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    modelId: request.nextUrl.searchParams.get('modelId'),
  })
  if (!parsed.success) {
    return NextResponse.json({ error: 'Geçersiz model.' }, { status: 400 })
  }

  const engines = await getVehicleEngines(parsed.data.modelId)
  return NextResponse.json({ engines }, { headers: catalogCacheHeaders(600) })
}
