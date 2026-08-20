import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { getVehicleModels } from '@/server/vehicle-queries'
import { catalogCacheHeaders } from '@/lib/http'

const querySchema = z.object({ brandId: z.coerce.number().int().positive() })

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    brandId: request.nextUrl.searchParams.get('brandId'),
  })
  if (!parsed.success) {
    return NextResponse.json({ error: 'Geçersiz marka.' }, { status: 400 })
  }

  const models = await getVehicleModels(parsed.data.brandId)
  return NextResponse.json({ models }, { headers: catalogCacheHeaders(600) })
}
