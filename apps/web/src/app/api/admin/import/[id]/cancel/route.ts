import { NextResponse, type NextRequest } from 'next/server'
import { db, cancelImportJob } from '@ocm/db'
import { getAdminSession } from '@/server/admin/auth'

export async function POST(_request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  const { id } = await ctx.params
  try {
    await cancelImportJob(db, Number(id))
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }
}
