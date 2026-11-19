'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'
import PageShell from '@/components/site/PageShell'
import NotConfigured from '@/components/site/NotConfigured'
import RecoveryCodeBox from '@/components/site/RecoveryCodeBox'
import Button from '@/components/ui/Button'
import { IMG } from '@/lib/config/images'
import { SelectField, TextAreaField, TextField } from '@/components/ui/Field'
import { useAuth } from '@/lib/auth/AuthProvider'
import { REGISTRATION_DEADLINE } from '@/lib/config/site'
import { validateRegistration } from '@/lib/config/validation'
import { fetchPickups, type PickupWithSeats } from '@/lib/data/pickups'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const { signIn, session, loading } = useAuth()

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    username: '',
    password: '',
    gender: '',
    address: '',
    email: '',
    website: '', // honeypot, must stay empty
  })
  const [wantsBus, setWantsBus] = useState(false)
  const [pickupId, setPickupId] = useState('')
  const [pickups, setPickups] = useState<PickupWithSeats[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null)

  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [key]: e.target.value }))

  useEffect(() => {
    if (!isSupabaseConfigured) return
    fetchPickups(getSupabase()).then(setPickups).catch(() => setPickups([]))
  }, [])

  // Already logged in? Go to the account page. Skipped while we are showing the new recovery code.
  useEffect(() => {
    if (!loading && session && !registered) router.replace('/account')
  }, [loading, session, registered, router])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const problem = validateRegistration({ ...form, gender: form.gender as 'male' | 'female' | '' })
    if (problem) return setError(problem)
    if (wantsBus && !pickupId) return setError('Please choose a takeoff point, or untick the bus option.')

    setBusy(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, pickupId: wantsBus ? pickupId : '' }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setRegistered(true)
      setRecoveryCode(data.recoveryCode ?? null)
      await signIn(form.username, form.password)
      if (!data.recoveryCode) router.replace('/account')
      setBusy(false)
    } catch (err) {
      setRegistered(false)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setBusy(false)
    }
  }

  if (registered && recoveryCode) {
    return (
      <PageShell title="You are registered" intro="One last thing before you continue.">
        <RecoveryCodeBox code={recoveryCode} onDone={() => router.replace('/account')} />
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Register"
      image={IMG.registerSide}
      intro={`Everyone who plans to attend should register, so we can count you in${REGISTRATION_DEADLINE ? ` (please do so by ${REGISTRATION_DEADLINE})` : ''}. Only your name and phone number are required.`}
    >
      {!isSupabaseConfigured ? (
        <NotConfigured />
      ) : (
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
          <TextField label="Full name" required autoComplete="name" value={form.fullName} onChange={set('fullName')} />
          <TextField
            label="Phone number"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0803 123 4567"
            value={form.phone}
            onChange={set('phone')}
          />

          <fieldset className="space-y-6 rounded-2xl border border-cream/20 p-5">
            <legend className="label px-2 text-cream/80">Your login</legend>
            <TextField
              label="Choose a username"
              required
              autoComplete="username"
              autoCapitalize="none"
              hint="Letters, numbers, dot, dash or underscore. You will use this to log back in."
              value={form.username}
              onChange={set('username')}
            />
            <TextField
              label="Choose a password"
              required
              type="password"
              autoComplete="new-password"
              hint="At least 6 characters. No code (OTP) is needed to log in."
              value={form.password}
              onChange={set('password')}
            />
          </fieldset>

          <SelectField label="Gender" optional value={form.gender} onChange={set('gender')}>
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </SelectField>
          <TextAreaField
            label="Where are you coming from?"
            optional
            hint="Your home address or area. It helps when deciding bus seats."
            autoComplete="street-address"
            value={form.address}
            onChange={set('address')}
          />
          <TextField label="Email" optional type="email" autoComplete="email" value={form.email} onChange={set('email')} />

          {/* Honeypot: hidden from people, tempting to bots. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>
              Website
              <input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
            </label>
          </div>

          <fieldset className="rounded-2xl border border-cream/20 p-5">
            <legend className="label px-2 text-cream/80">Bus</legend>
            <label className="flex min-h-11 cursor-pointer items-center gap-3">
              <input type="checkbox" className="size-5 accent-cream" checked={wantsBus} onChange={(e) => setWantsBus(e.target.checked)} />
              <span>I would like a seat on the bus</span>
            </label>

            {wantsBus && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-cream/70">
                  Seats are limited. Your request will show as pending until the couple approves it.
                </p>
                {pickups.length === 0 && <p className="text-sm text-aqua">Takeoff points could not be loaded. Please try again shortly.</p>}
                {pickups.map((p) => {
                  const full = p.seatsTaken >= p.capacity
                  return (
                    <label
                      key={p.id}
                      className={`flex min-h-11 items-start gap-3 rounded-xl border p-3 ${
                        full ? 'cursor-not-allowed border-cream/10 opacity-50' : 'cursor-pointer border-cream/30 has-[:checked]:border-cream has-[:checked]:bg-cream/10'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pickup"
                        className="mt-1.5 size-4 accent-cream"
                        disabled={full}
                        checked={pickupId === p.id}
                        onChange={() => setPickupId(p.id)}
                      />
                      <span>
                        <span className="label block text-cream">{p.name}</span>
                        <span className="text-sm text-cream/75">
                          {p.address}
                          {full && ' (full)'}
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
            )}
          </fieldset>

          {error && (
            <p role="alert" className="rounded-xl border border-burgundy/60 bg-burgundy/30 px-4 py-3 text-cream">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={busy}>
              {busy ? 'Registering…' : 'Complete registration'}
            </Button>
            <Link href="/login" className="label text-cream/70 underline underline-offset-4">
              I already have an account
            </Link>
          </div>
        </form>
      )}
    </PageShell>
  )
}
