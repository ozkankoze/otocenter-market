import { NextResponse, type NextRequest } from 'next/server'
import { db, commitImport } from '@ocm/db'
import { getAdminSession } from '@/server/admin/auth'

export const runtime = 'nodejs'
export const maxDuration = 300

export async function POST(_request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })
  const { id } = await ctx.params

  try {
    const result = await commitImport(db, Number(id))
    return NextResponse.json({ result })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }
}
