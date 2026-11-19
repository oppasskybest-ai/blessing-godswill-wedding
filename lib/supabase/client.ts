import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** False until .env.local is filled in. The public pages still render without it. */
export const isSupabaseConfigured = Boolean(url && anonKey)

let client: SupabaseClient | null = null

/** Browser-side client (anon key; every table is protected by row-level security). */
export function getSupabase(): SupabaseClient {
  if (!url || !anonKey) throw new Error('Supabase is not configured. Fill in .env.local.')
  if (!client) client = createClient(url, anonKey)
  return client
}
