import 'server-only'
import { randomBytes, randomInt, scrypt as scryptCb, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

const scrypt = promisify(scryptCb) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>

// No 0/O, 1/I/L so a code read off a screenshot or paper is hard to mistype.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const MAX_FAILS = 5
const LOCK_MINUTES = 15

/** e.g. "K7M2-QX9D-4HTB" (12 characters, about 59 bits: not guessable online, especially with the lockout). */
export function generateRecoveryCode(): string {
  const chars = Array.from({ length: 12 }, () => ALPHABET[randomInt(ALPHABET.length)])
  return [chars.slice(0, 4), chars.slice(4, 8), chars.slice(8, 12)].map((g) => g.join('')).join('-')
}

/** Accepts "k7m2 qx9d-4htb" and similar. */
export function normalizeRecoveryCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

async function hashCode(normalized: string): Promise<string> {
  const salt = randomBytes(16)
  const hash = await scrypt(normalized, salt, 32)
  return `${salt.toString('hex')}:${hash.toString('hex')}`
}

async function matches(normalized: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(':')
  if (!saltHex || !hashHex) return false
  const expected = Buffer.from(hashHex, 'hex')
  const actual = await scrypt(normalized, Buffer.from(saltHex, 'hex'), expected.length)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

/** Creates (or replaces) a guest's recovery code and returns the plain code. Show it once, never store it. */
export async function issueRecoveryCode(userId: string): Promise<string> {
  const code = generateRecoveryCode()
  const { error } = await getSupabaseAdmin()
    .from('recovery_codes')
    .upsert({
      user_id: userId,
      code_hash: await hashCode(normalizeRecoveryCode(code)),
      failed_attempts: 0,
      locked_until: null,
      created_at: new Date().toISOString(),
    })
  if (error) throw new Error('Could not save recovery code')
  return code
}

export type VerifyResult = { ok: true; userId: string } | { ok: false; reason: 'invalid' | 'locked' }

/**
 * Checks username + recovery code. Wrong username and wrong code give the same 'invalid' answer so
 * the form cannot be used to discover which usernames exist. Five wrong tries lock the account for 15 minutes.
 */
export async function verifyRecoveryCode(username: string, code: string): Promise<VerifyResult> {
  const admin = getSupabaseAdmin()
  const { data: profile } = await admin.from('profiles').select('id').eq('username', username).maybeSingle()
  if (!profile) return { ok: false, reason: 'invalid' }

  const { data: row } = await admin.from('recovery_codes').select('*').eq('user_id', profile.id).maybeSingle()
  if (!row) return { ok: false, reason: 'invalid' } // no code issued yet (guest must ask the couple)

  if (row.locked_until && new Date(row.locked_until).getTime() > Date.now()) return { ok: false, reason: 'locked' }

  if (await matches(normalizeRecoveryCode(code), row.code_hash)) {
    return { ok: true, userId: profile.id }
  }

  const fails = (row.failed_attempts ?? 0) + 1
  const lock = fails >= MAX_FAILS
  await admin
    .from('recovery_codes')
    .update({
      failed_attempts: lock ? 0 : fails,
      locked_until: lock ? new Date(Date.now() + LOCK_MINUTES * 60_000).toISOString() : null,
    })
    .eq('user_id', profile.id)
  return { ok: false, reason: lock ? 'locked' : 'invalid' }
}
