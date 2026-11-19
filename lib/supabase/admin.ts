import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role client. Bypasses row-level security, so it must only be used in
 * server code (API routes) after the caller has been verified.
 */
export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL missing.')
  return createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
}

/** Reads the Bearer token and returns the signed-in user's id, or null. */
export async function getUserId(request: Request): Promise<string | null> {
  const header = request.headers.get('authorization')
  if (!header?.startsWith('Bearer ')) return null
  const { data, error } = await getSupabaseAdmin().auth.getUser(header.slice(7))
  return error || !data.user ? null : data.user.id
}

/** Returns the user id only if that user is an admin. */
export async function requireAdmin(request: Request): Promise<string | null> {
  const userId = await getUserId(request)
  if (!userId) return null
  const { data: profile } = await getSupabaseAdmin().from('profiles').select('is_admin').eq('id', userId).single()
  return profile?.is_admin ? userId : null
}
