/** Shared by the register form (client) and /api/register (server). */

export const USERNAME_RE = /^[a-z0-9._-]{3,30}$/

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase()
}

/** Keep a leading "+" and digits only. "0803 123 4567" -> "08031234567". */
export function normalizePhone(value: string): string {
  const trimmed = value.trim()
  const plus = trimmed.startsWith('+') ? '+' : ''
  return plus + trimmed.replace(/\D/g, '')
}

export function isValidPhone(value: string): boolean {
  return /^\+?[0-9]{7,15}$/.test(value)
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export type RegisterInput = {
  fullName: string
  phone: string
  username: string
  password: string
  gender?: 'male' | 'female' | ''
  address?: string
  email?: string
  pickupId?: string
}

/** Returns an error message, or null when valid. Only name, phone, username, password are required. */
export function validateRegistration(input: RegisterInput): string | null {
  if (input.fullName.trim().length < 2) return 'Please enter your full name.'
  if (!isValidPhone(normalizePhone(input.phone))) return 'Please enter a valid phone number.'
  if (!USERNAME_RE.test(normalizeUsername(input.username)))
    return 'Username must be 3 to 30 characters: letters, numbers, dot, dash or underscore.'
  if (input.password.length < 6) return 'Password must be at least 6 characters.'
  if (input.email && input.email.trim() && !isValidEmail(input.email.trim()))
    return 'That email address does not look right. You can also leave it empty.'
  return null
}
