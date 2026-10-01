import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
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

/**
 * CANLIDA VARSAYILAN PAROLA YOK.
 *
 * Önceden `ADMIN_PASSWORD` tanımlı değilse parola "otocenter", oturum imza
 * anahtarı da koddaki sabit bir metindi — yani kaynağı gören herkes panele
 * girebilir ve geçerli oturum çerezi üretebilirdi. Panel artık müşteri adı,
 * adresi ve telefonunu (siparişler) gösterdiği için bu KVKK açısından kabul
 * edilemez.
 *
 * Üretimde iki değişken de tanımlı ve yeterince uzun değilse panel KAPALI
 * kalır (giriş reddedilir, mevcut çerezler geçersiz sayılır). Yerel geliştirmede
 * eski varsayılanlar çalışmaya devam eder.
 */
const URETIM = process.env.NODE_ENV === 'production'

export function adminYapilandirildi(): boolean {
  if (!URETIM) return true
  const parola = process.env.ADMIN_PASSWORD ?? ''
  const anahtar = process.env.ADMIN_SESSION_SECRET ?? ''
  return parola.length >= 10 && anahtar.length >= 32
}

function secret(): string | null {
  if (URETIM) return adminYapilandirildi() ? process.env.ADMIN_SESSION_SECRET! : null
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? 'ocm-gelistirme-anahtari'
}

function sign(payload: string): string | null {
  const anahtar = secret()
  if (!anahtar) return null
  return createHmac('sha256', anahtar).update(payload).digest('base64url')
}

export function makeSessionValue(email: string): string {
  const payload = `${email}|${Date.now()}`
  const imza = sign(payload)
  if (!imza) throw new Error('Yönetim paneli yapılandırılmamış: ADMIN_SESSION_SECRET eksik.')
  return `${Buffer.from(payload).toString('base64url')}.${imza}`
}

export function verifySessionValue(value: string): { email: string } | null {
  const dot = value.lastIndexOf('.')
  if (dot < 0) return null
  const encoded = value.slice(0, dot)
  const signature = value.slice(dot + 1)
  const payload = Buffer.from(encoded, 'base64url').toString('utf8')

  const expected = sign(payload)
  if (!expected) return null
  if (expected.length !== signature.length) return null
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null

  const [email, issued] = payload.split('|')
  if (!email || !issued) return null
  if (Date.now() - Number(issued) > MAX_AGE * 1000) return null
  return { email }
}

export function checkPassword(input: string): boolean {
  if (!adminYapilandirildi()) return false
  const expected = Buffer.from(process.env.ADMIN_PASSWORD ?? 'otocenter', 'utf8')
  const girilen = Buffer.from(input, 'utf8')
  // Karakter değil BAYT uzunluğu karşılaştırılır: Türkçe karakterli parolada
  // uzunluklar farklı çıkar ve timingSafeEqual istisna fırlatırdı (500).
  if (girilen.length !== expected.length) return false
  return timingSafeEqual(girilen, expected)
}

export const ADMIN_COOKIE = COOKIE
export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true as const,
  sameSite: 'lax' as const,
  // Canlıda çerez yalnızca HTTPS üzerinden gider.
  secure: process.env.NODE_ENV === 'production',
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

/**
 * Panel sayfalarının İLK satırı bu olmalı.
 *
 * Oturum kontrolü yalnızca `app/admin/layout.tsx` içindeyken, Next.js'in
 * istemci tarafı gezinme isteği (`RSC: 1` + `Next-Router-State-Tree` başlığı
 * "yerleşim zaten bende" diyen) yerleşimi atlayıp sayfayı doğrudan alabiliyordu
 * — çerez olmadan müşteri adı, telefonu ve adresi dönüyordu (doğrulandı).
 * Next.js yalnızca değişen bölümü işlediği için yerleşimdeki kontrol bir
 * güvenlik sınırı DEĞİLDİR. Her sayfa kendini korur.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const oturum = await getAdminSession()
  if (!oturum) redirect('/admin/giris')
  return oturum
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
