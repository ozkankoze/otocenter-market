import { NextResponse, type NextRequest } from 'next/server'
import { db, createImportJob, ImportParseError } from '@ocm/db'
import { getAdminSession } from '@/server/admin/auth'

export const runtime = 'nodejs'
export const maxDuration = 300

/** UPLOAD → PARSE → STAGING → VALIDATE. Production tablolarına YAZMAZ. */
export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const form = await request.formData()
  const file = form.get('dosya')
  const sourceId = Number(form.get('kaynak'))

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Dosya seçilmedi.' }, { status: 400 })
  }
  if (!Number.isFinite(sourceId)) {
    return NextResponse.json({ error: 'Veri kaynağı seçilmedi.' }, { status: 400 })
  }
  if (file.size > 100 * 1024 * 1024) {
    return NextResponse.json({ error: 'Dosya 100 MB sınırını aşıyor.' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    const preview = await createImportJob(db, {
      fileName: file.name,
      buffer,
      sourceId,
      userId: session.id,
    })
    return NextResponse.json({ preview })
  } catch (err) {
    const message =
      err instanceof ImportParseError ? err.message : `İçe aktarma başarısız: ${(err as Error).message}`
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
