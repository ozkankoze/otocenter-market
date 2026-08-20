import { NextResponse } from 'next/server'
import { getVehicleTypes } from '@/server/vehicle-queries'
import { catalogCacheHeaders } from '@/lib/http'

export async function GET() {
  const types = await getVehicleTypes()
  return NextResponse.json({ types }, { headers: catalogCacheHeaders(3600) })
}
