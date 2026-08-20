import 'server-only'
import { cookies } from 'next/headers'
import { VEHICLE_COOKIE, type VehicleSelection } from './types'

/**
 * Seçili araç cookie'de saklanır (localStorage değil):
 * böylece ilk sunucu render'ında da doğru içerik üretilir ve
 * araç bağlamı sayfa yenilemede kaybolmaz.
 */
export async function readSelectedVehicle(): Promise<VehicleSelection | null> {
  const store = await cookies()
  const raw = store.get(VEHICLE_COOKIE)?.value
  if (!raw) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as VehicleSelection
    if (typeof parsed?.engineId !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

export const VEHICLE_COOKIE_OPTIONS = {
  httpOnly: false as const,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 365,
}
