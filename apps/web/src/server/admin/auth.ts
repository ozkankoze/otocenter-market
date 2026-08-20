import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { db } from '@ocm/db'

/**
 * Admin oturumu — bilinçli olarak MİNİMUM.
 *
 * Sprint 4 kapsamı import pipeline'ıdır; tam kullanıcı/rol yönetimi
 * (davet, şifre sıfırlama, yetki matrisi) sonraki sprintlere bırakıldı.
 * Buradaki amaç panelin açıkta olmaması ve import geçmişinde "kim yaptı"
 * izinin tutulabilmesidir.
 *
 * Oturum, HMAC ile imzalanmış httpOnly bir çerezde saklanır.
 */
const COOKIE = 'ocm.admin'
const MAX_AGE = 60 * 60 * 12

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? 'ocm-gelistirme-anahtari'
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function makeSessionValue(email: string): string {
  const payload = `${email}|${Date.now()}`
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`
}

export function verifySessionValue(value: string): { email: string } | null {
  const dot = value.lastIndexOf('.')
  if (dot < 0) return null
  const encoded = value.slice(0, dot)
  const signature = value.slice(dot + 1)
  const payload = Buffer.from(encoded, 'base64url').toString('utf8')

  const expected = sign(payload)
  if (expected.length !== signature.length) return null
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null

  const [email, issued] = payload.split('|')
  if (!email || !issued) return null
  if (Date.now() - Number(issued) > MAX_AGE * 1000) return null
  return { email }
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? 'otocenter'
  if (input.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(input), Buffer.from(expected))
}

export const ADMIN_COOKIE = COOKIE
export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true as const,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: MAX_AGE,
}

export type AdminSession = { id: number; email: string; name: string }

/** Geçerli oturumu döner; yoksa null. Panelin her sayfası bunu çağırır. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies()
  const raw = store.get(COOKIE)?.value
  if (!raw) return null
  const verified = verifySessionValue(raw)
  if (!verified) return null

  const user = await db
    .selectFrom('admin_user')
    .select(['id', 'email', 'name'])
    .where('email', '=', verified.email)
    .where('is_active', '=', true)
    .executeTakeFirst()
  return user ?? null
}

/** Giriş sırasında kullanıcıyı bulur ya da ilk kez oluşturur. */
export async function ensureAdminUser(email: string): Promise<AdminSession> {
  const existing = await db
    .selectFrom('admin_user')
    .select(['id', 'email', 'name'])
    .where('email', '=', email)
    .executeTakeFirst()
  if (existing) return existing

  return db
    .insertInto('admin_user')
    .values({ email, name: email.split('@')[0] ?? 'Yönetici', role: 'ADMIN' })
    .returning(['id', 'email', 'name'])
    .executeTakeFirstOrThrow()
}
