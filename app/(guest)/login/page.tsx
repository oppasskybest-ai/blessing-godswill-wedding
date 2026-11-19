'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type FormEvent } from 'react'
import PageShell from '@/components/site/PageShell'
import NotConfigured from '@/components/site/NotConfigured'
import Button from '@/components/ui/Button'
import { IMG } from '@/lib/config/images'
import { TextField } from '@/components/ui/Field'
import { useAuth } from '@/lib/auth/AuthProvider'
import { isSupabaseConfigured } from '@/lib/supabase/client'

/** Only follow same-site paths, so a crafted ?next= link cannot send guests elsewhere. */
function safeNext(): string {
  if (typeof window === 'undefined') return '/account'
  const next = new URLSearchParams(window.location.search).get('next')
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/account'
}

export default function LoginPage() {
  const router = useRouter()
  const { signIn, session, loading } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!loading && session) router.replace(safeNext())
  }, [loading, session, router])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signIn(username, password)
      router.replace(safeNext())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not log in.')
      setBusy(false)
    }
  }

  return (
    <PageShell title="Log in" image={IMG.loginSide} intro="Use the username and password you chose when you registered. No code is needed.">
      {!isSupabaseConfigured ? (
        <NotConfigured />
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          <TextField label="Username" required autoComplete="username" autoCapitalize="none" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField label="Password" required type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />

          {error && (
            <p role="alert" className="rounded-xl border border-burgundy/60 bg-burgundy/30 px-4 py-3 text-cream">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={busy}>
              {busy ? 'Logging in…' : 'Log in'}
            </Button>
            <Link href="/register" className="label text-cream/70 underline underline-offset-4">
              Register instead
            </Link>
          </div>
          <p className="text-sm text-cream/70">
            Forgot your password?{' '}
            <Link href="/reset-password" className="underline underline-offset-4">
              Reset it with your recovery code
            </Link>
            . Lost the code too? Message the couple and they can reset it for you.
          </p>
        </form>
      )}
    </PageShell>
  )
}
