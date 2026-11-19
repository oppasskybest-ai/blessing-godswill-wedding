import { createHash, timingSafeEqual } from 'node:crypto'
import { NextResponse } from 'next/server'
import { getSupabaseAdmin, getUserId } from '@/lib/supabase/admin'

/**
 * One-time "first admin" claim. It only works while NO admin exists AND the server has an
 * ADMIN_SETUP_CODE environment variable. After the first admin exists it switches itself off;
 * from then on admins are made from Admin -> Guests.
 */
async function noAdminYet(): Promise<boolean> {
  const { count, error } = await getSupabaseAdmin().from('profiles').select('id', { count: 'exact', head: true }).eq('is_admin', true)
  return !error && (count ?? 0) === 0
}

const digest = (s: string) => createHash('sha256').update(s).digest()

export async function GET() {
  const available = Boolean(process.env.ADMIN_SETUP_CODE) && (await noAdminYet())
  return NextResponse.json({ available })
}

export async function POST(req: Request) {
  const expected = process.env.ADMIN_SETUP_CODE
  if (!expected || !(await noAdminYet())) return NextResponse.json({ error: 'Not available.' }, { status: 403 })
  const userId = await getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Log in first.' }, { status: 401 })

  let code = ''
  try {
    const body = await req.json()
    code = typeof body.code === 'string' ? body.code : ''
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }
  if (!timingSafeEqual(digest(code), digest(expected))) {
    await new Promise((r) => setTimeout(r, 1000)) // slows guessing
    return NextResponse.json({ error: 'That setup code is not right.' }, { status: 403 })
  }
  const { error } = await getSupabaseAdmin().from('profiles').update({ is_admin: true }).eq('id', userId)
  if (error) return NextResponse.json({ error: 'Could not make you admin.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
