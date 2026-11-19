import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { usernameToEmail } from '@/lib/auth/username'
import { issueRecoveryCode } from '@/lib/auth/recovery'
import { normalizePhone, normalizeUsername, validateRegistration, type RegisterInput } from '@/lib/config/validation'

const clip = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: real guests never see or fill this field.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const input: RegisterInput = {
    fullName: clip(body.fullName, 100),
    phone: clip(body.phone, 20),
    username: clip(body.username, 30),
    password: typeof body.password === 'string' ? body.password.slice(0, 72) : '',
    gender: body.gender === 'male' || body.gender === 'female' ? body.gender : '',
    address: clip(body.address, 300),
    email: clip(body.email, 200),
    pickupId: clip(body.pickupId, 64),
  }

  const problem = validateRegistration(input)
  if (problem) return NextResponse.json({ error: problem }, { status: 400 })

  const username = normalizeUsername(input.username)
  const admin = getSupabaseAdmin()

  const { data: taken } = await admin.from('profiles').select('id').eq('username', username).maybeSingle()
  if (taken) return NextResponse.json({ error: 'That username is already taken. Please choose another.' }, { status: 409 })

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: usernameToEmail(username),
    password: input.password,
    email_confirm: true,
    user_metadata: { username },
  })
  if (createError || !created.user) {
    const exists = /already|registered|exists/i.test(createError?.message ?? '')
    return NextResponse.json(
      { error: exists ? 'That username is already taken. Please choose another.' : 'Could not create your account. Please try again.' },
      { status: exists ? 409 : 500 }
    )
  }

  const userId = created.user.id
  const { error: profileError } = await admin.from('profiles').insert({
    id: userId,
    username,
    full_name: input.fullName,
    phone: normalizePhone(input.phone),
    gender: input.gender || null,
    address: input.address || null,
    email: input.email || null,
  })
  if (profileError) {
    await admin.auth.admin.deleteUser(userId) // roll back so the username is not stuck
    return NextResponse.json({ error: 'Could not save your details. Please try again.' }, { status: 500 })
  }

  // Optional bus request. A failure here must not undo a successful registration.
  let busRequested = false
  if (input.pickupId) {
    const { data: pickup } = await admin.from('pickup_points').select('id').eq('id', input.pickupId).eq('active', true).maybeSingle()
    if (pickup) {
      const { error } = await admin.from('bus_requests').insert({ user_id: userId, pickup_id: pickup.id, status: 'pending' })
      busRequested = !error
    }
  }

  // Recovery code lets the guest reset a forgotten password later (shown once on screen).
  // If this fails the guest can create one from My account, so registration still succeeds.
  let recoveryCode: string | null = null
  try {
    recoveryCode = await issueRecoveryCode(userId)
  } catch {
    recoveryCode = null
  }

  return NextResponse.json({ ok: true, busRequested, recoveryCode })
}
