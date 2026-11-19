import { NextResponse } from 'next/server'
import { issueRecoveryCode } from '@/lib/auth/recovery'
import { getUserId } from '@/lib/supabase/admin'

/** A signed-in guest asks for a (new) recovery code, e.g. they lost the old one. Replaces the previous code. */
export async function POST(req: Request) {
  const userId = await getUserId(req)
  if (!userId) return NextResponse.json({ error: 'Please log in first.' }, { status: 401 })
  try {
    return NextResponse.json({ recoveryCode: await issueRecoveryCode(userId) })
  } catch {
    return NextResponse.json({ error: 'Could not create a recovery code.' }, { status: 500 })
  }
}
