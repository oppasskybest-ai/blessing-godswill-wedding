'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import NotConfigured from '@/components/site/NotConfigured'
import PageShell from '@/components/site/PageShell'
import RecoveryCodeBox from '@/components/site/RecoveryCodeBox'
import Button from '@/components/ui/Button'
import { IMG } from '@/lib/config/images'
import { TextField } from '@/components/ui/Field'
import { isSupabaseConfigured } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [newCode, setNewCode] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setBusy(true)
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, recoveryCode: code, newPassword: password }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setNewCode(data.recoveryCode)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
    setBusy(false)
  }

  if (newCode) {
    return (
      <PageShell title="Password changed" intro="You can log in with your new password now. Your old recovery code no longer works, so keep this new one.">
        <RecoveryCodeBox code={newCode} doneLabel="Go to log in" onDone={() => router.replace('/login')} />
      </PageShell>
    )
  }

  return (
    <PageShell title="Reset password" image={IMG.loginSide} intro="Enter your username and the recovery code you were given when you registered.">
      {!isSupabaseConfigured ? (
        <NotConfigured />
      ) : (
        <form onSubmit={onSubmit} className="space-y-6">
          <TextField label="Username" required autoComplete="username" autoCapitalize="none" value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField
            label="Recovery code"
            required
            autoComplete="off"
            autoCapitalize="characters"
            placeholder="XXXX-XXXX-XXXX"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <TextField
            label="New password"
            required
            type="password"
            autoComplete="new-password"
            hint="At least 6 characters."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p role="alert" className="rounded-xl border border-burgundy/60 bg-burgundy/30 px-4 py-3 text-cream">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={busy}>
              {busy ? 'Checking…' : 'Set new password'}
            </Button>
            <Link href="/login" className="label text-cream/70 underline underline-offset-4">
              Back to log in
            </Link>
          </div>
          <p className="text-sm text-cream/60">No code? Message the couple and they can reset your password for you.</p>
        </form>
      )}
    </PageShell>
  )
}
