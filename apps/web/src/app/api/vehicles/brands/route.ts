import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { getVehicleBrands } from '@/server/vehicle-queries'
import { catalogCacheHeaders } from '@/lib/http'

const querySchema = z.object({ typeId: z.coerce.number().int().positive() })

export async function GET(request: NextRequest) {
  const parsed = querySchema.safeParse({
    typeId: request.nextUrl.searchParams.get('typeId'),
  })
  if (!parsed.success) {
    return NextResponse.json({ error: 'Geçersiz araç tipi.' }, { status: 400 })
  }

  const brands = await getVehicleBrands(parsed.data.typeId)
  return NextResponse.json(
    { brands, popular: brands.filter((b) => b.isPopular) },
    { headers: catalogCacheHeaders(600) },
  )
}
