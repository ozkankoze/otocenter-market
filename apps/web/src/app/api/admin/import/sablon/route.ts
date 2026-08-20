import { NextResponse } from 'next/server'
import { buildTemplateWorkbook } from '@ocm/db'
import { getAdminSession } from '@/server/admin/auth'

export const runtime = 'nodejs'

/** İndirilebilir XLSX şablonu — sütun tanımlarından üretilir. */
export async function GET() {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const buffer = buildTemplateWorkbook()
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="oto-center-market-import-sablonu.xlsx"',
      'Cache-Control': 'no-store',
    },
  })
}
