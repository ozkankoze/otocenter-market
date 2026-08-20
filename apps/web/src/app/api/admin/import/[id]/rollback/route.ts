import { NextResponse, type NextRequest } from 'next/server'
import { db, rollbackImport } from '@ocm/db'
import { getAdminSession } from '@/server/admin/auth'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function POST(_request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  const { id } = await ctx.params

  try {
    const result = await rollbackImport(db, Number(id), { userId: session.id })
    return NextResponse.json({ result })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }
}
