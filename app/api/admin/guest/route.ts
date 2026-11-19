import { NextResponse } from 'next/server'
import { getSupabaseAdmin, requireAdmin } from '@/lib/supabase/admin'

/**
 * Admin-only actions that need the service role:
 *   { action: 'reset-password', userId, password }   (guests have no email recovery)
 *   { action: 'set-admin', userId, isAdmin }          (make / remove an admin; not yourself)
 *   { action: 'delete', userId }                     (removes the login AND, via cascade, their data)
 */
export async function POST(req: Request) {
  const adminId = await requireAdmin(req)
  if (!adminId) return NextResponse.json({ error: 'Not allowed.' }, { status: 403 })

  let body: { action?: string; userId?: string; password?: string; isAdmin?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const userId = typeof body.userId === 'string' ? body.userId : ''
  if (!userId) return NextResponse.json({ error: 'Missing guest.' }, { status: 400 })

  const admin = getSupabaseAdmin()

  if (body.action === 'reset-password') {
    const password = typeof body.password === 'string' ? body.password : ''
    if (password.length < 6 || password.length > 72) {
      return NextResponse.json({ error: 'Password must be 6 to 72 characters.' }, { status: 400 })
    }
    const { error } = await admin.auth.admin.updateUserById(userId, { password })
    if (error) return NextResponse.json({ error: 'Could not reset the password.' }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'set-admin') {
    if (userId === adminId) return NextResponse.json({ error: 'You cannot change your own admin access.' }, { status: 400 })
    const { error } = await admin.from('profiles').update({ is_admin: body.isAdmin === true }).eq('id', userId)
    if (error) return NextResponse.json({ error: 'Could not change admin access.' }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (body.action === 'delete') {
    if (userId === adminId) return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 })
    const { error } = await admin.auth.admin.deleteUser(userId)
    if (error) return NextResponse.json({ error: 'Could not delete the guest.' }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
}
