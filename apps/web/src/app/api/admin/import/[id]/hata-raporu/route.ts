import { NextResponse, type NextRequest } from 'next/server'
import * as XLSX from 'xlsx'
import { db } from '@ocm/db'
import { getAdminSession } from '@/server/admin/auth'

export const runtime = 'nodejs'

/**
 * HATA RAPORU (04-CSV-IMPORT-FORMATI.md §8)
 * Orijinal sütunlar korunur, sona 3 sütun eklenir:
 *   _satir_no · _durum · _mesaj
 * Kullanıcı düzeltip aynı dosyayı yeniden yükleyebilir.
 */
export async function GET(_request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id } = await ctx.params
  const jobId = Number(id)

  const job = await db
    .selectFrom('import_job')
    .select(['file_name'])
    .where('id', '=', jobId)
    .executeTakeFirst()
  if (!job) return NextResponse.json({ error: 'Import bulunamadı' }, { status: 404 })

  const rows = await db
    .selectFrom('import_staging_row')
    .select(['sheet', 'row_no', 'status', 'raw', 'messages'])
    .where('import_job_id', '=', jobId)
    .where('status', 'in', ['ERROR', 'WARNING', 'SKIPPED'])
    .orderBy(['sheet', 'row_no'])
    .execute()

  const STATUS_TR: Record<string, string> = {
    ERROR: 'HATA',
    WARNING: 'UYARI',
    SKIPPED: 'ATLANDI',
  }

  const wb = XLSX.utils.book_new()
  const bySheet = new Map<string, typeof rows>()
  for (const r of rows) {
    const list = bySheet.get(r.sheet) ?? []
    list.push(r)
    bySheet.set(r.sheet, list)
  }

  if (!bySheet.size) {
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([['Bu import için hatalı veya uyarılı satır yok.']]),
      'SORUN_YOK',
    )
  }

  for (const [sheet, list] of bySheet) {
    const headers = [...new Set(list.flatMap((r) => Object.keys((r.raw ?? {}) as unknown as object)))]
    const aoa: Array<Array<string | number>> = [[...headers, '_satir_no', '_durum', '_mesaj']]

    for (const r of list) {
      const raw = (r.raw ?? {}) as unknown as Record<string, string>
      const messages = (r.messages ?? []) as unknown as Array<{ message: string; code: string }>
      aoa.push([
        ...headers.map((h) => raw[h] ?? ''),
        r.row_no,
        STATUS_TR[r.status] ?? r.status,
        messages.map((m) => `${m.code}: ${m.message}`).join(' | '),
      ])
    }

    const ws = XLSX.utils.aoa_to_sheet(aoa)
    ws['!cols'] = [...headers.map(() => ({ wch: 18 })), { wch: 10 }, { wch: 10 }, { wch: 80 }]
    XLSX.utils.book_append_sheet(wb, ws, sheet)
  }

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
  const name = job.file_name.replace(/\.[^.]+$/, '')

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(name)}-hata-raporu.xlsx"`,
      'Cache-Control': 'no-store',
    },
  })
}
