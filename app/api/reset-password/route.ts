import { NextResponse } from 'next/server'
import { issueRecoveryCode, verifyRecoveryCode } from '@/lib/auth/recovery'
import { normalizeUsername } from '@/lib/config/validation'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

/**
 * Self-service password reset for guests who forgot their password.
 * Needs the username plus the recovery code shown at registration (no email or SMS involved).
 * The code is single-use: a fresh one is issued in the response.
 */
export async function POST(req: Request) {
  let body: { username?: unknown; recoveryCode?: unknown; newPassword?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const username = typeof body.username === 'string' ? normalizeUsername(body.username).slice(0, 30) : ''
  const code = typeof body.recoveryCode === 'string' ? body.recoveryCode.slice(0, 40) : ''
  const newPassword = typeof body.newPassword === 'string' ? body.newPassword : ''

  if (!username || !code) return NextResponse.json({ error: 'Enter your username and recovery code.' }, { status: 400 })
  if (newPassword.length < 6 || newPassword.length > 72) {
    return NextResponse.json({ error: 'Password must be 6 to 72 characters.' }, { status: 400 })
  }

  const result = await verifyRecoveryCode(username, code)
  if (!result.ok) {
    return NextResponse.json(
      {
        error:
          result.reason === 'locked'
            ? 'Too many wrong tries. Please wait 15 minutes, or message the couple to reset it for you.'
            : 'That username and recovery code do not match.',
      },
      { status: result.reason === 'locked' ? 429 : 400 }
    )
  }

  const { error } = await getSupabaseAdmin().auth.admin.updateUserById(result.userId, { password: newPassword })
  if (error) return NextResponse.json({ error: 'Could not reset the password. Please try again.' }, { status: 500 })

  const newCode = await issueRecoveryCode(result.userId) // old code is now void
  return NextResponse.json({ ok: true, recoveryCode: newCode })
}
