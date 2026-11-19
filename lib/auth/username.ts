import { normalizeUsername } from '@/lib/config/validation'

/**
 * Supabase Auth needs an email. Guests only need a username, so we derive a
 * private stand-in email. It is never used to send mail (no confirmation, no
 * recovery links; admins reset passwords from the dashboard).
 */
const GUEST_EMAIL_DOMAIN = process.env.NEXT_PUBLIC_GUEST_EMAIL_DOMAIN || 'guests.example.com'

export function usernameToEmail(username: string): string {
  return `${normalizeUsername(username)}@${GUEST_EMAIL_DOMAIN}`
}
