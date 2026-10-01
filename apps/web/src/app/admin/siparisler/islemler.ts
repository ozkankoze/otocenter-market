'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { db, siparisDurumGuncelle, siparisNotuEkle } from '@ocm/db'
import { getAdminSession } from '@/server/admin/auth'

/**
 * Panel işlemleri. Her biri oturumu KENDİSİ kontrol eder — sunucu işlemleri
 * doğrudan POST ile de çağrılabildiği için yalnızca sayfanın korunması yetmez.
 */
async function oturum() {
  const s = await getAdminSession()
  if (!s) redirect('/admin/giris')
  return s
}

/**
 * Hata sayfaya KOD olarak taşınır, metin olarak değil: `?hata=<serbest metin>`
 * dışarıdan hazırlanmış bir bağlantıyla panelde sahte uyarı göstermeye izin
 * veriyordu. Kodun metni sayfada sabit bir sözlükten gelir.
 */
function geri(no: string, hata?: string): never {
  revalidatePath(`/admin/siparisler/${no}`)
  revalidatePath('/admin/siparisler')
  const kod = hata
    ? /kargo firması/i.test(hata)
      ? 'kargo'
      : /bulunamadı/i.test(hata)
        ? 'yok'
        : /yapılamaz|Geçersiz durum/i.test(hata)
          ? 'gecis'
          : 'genel'
    : null
  redirect(`/admin/siparisler/${no}${kod ? `?hata=${kod}` : ''}`)
}

function siparisNo(fd: FormData): string {
  return String(fd.get('no') ?? '').replace(/[^A-Z0-9]/g, '').slice(0, 32)
}

export async function kargoyaVer(fd: FormData) {
  const s = await oturum()
  const no = siparisNo(fd)
  const r = await siparisDurumGuncelle(
    db,
    no,
    {
      yeni: 'SHIPPED',
      kargoFirmasi: String(fd.get('kargoFirmasi') ?? ''),
      takipNo: String(fd.get('takipNo') ?? ''),
    },
    s.email,
  )
  geri(no, r.ok ? undefined : r.sebep)
}

export async function durumDegistir(fd: FormData) {
  const s = await oturum()
  const no = siparisNo(fd)
  const yeni = String(fd.get('yeni') ?? '')
  if (yeni !== 'DELIVERED' && yeni !== 'CANCELLED' && yeni !== 'REFUNDED') geri(no, 'Geçersiz durum.')
  const r = await siparisDurumGuncelle(db, no, { yeni }, s.email)
  geri(no, r.ok ? undefined : r.sebep)
}

export async function notEkle(fd: FormData) {
  const s = await oturum()
  const no = siparisNo(fd)
  const not = String(fd.get('not') ?? '').trim()
  if (not) await siparisNotuEkle(db, no, `${s.email}: ${not}`)
  geri(no)
}
