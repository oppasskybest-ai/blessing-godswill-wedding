'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { TextField } from '@/components/ui/Field'
import { adminPost } from '@/lib/adminApi'
import { useAuth } from '@/lib/auth/AuthProvider'

/** Shown only while no admin exists and the server has ADMIN_SETUP_CODE set. */
export default function ClaimAdmin() {
  const { session } = useAuth()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const err = await adminPost('/api/admin/claim', session?.access_token, { code })
    if (err) {
      setError(err)
      setBusy(false)
    } else {
      window.location.reload() // reload so the new admin rights are picked up
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <p className="text-cream/80">There is no admin yet. Enter the setup code from your server settings to make this account the first admin.</p>
      <TextField label="Setup code" type="password" autoComplete="off" required value={code} onChange={(e) => setCode(e.target.value)} />
      {error && <p role="alert" className="text-aqua">{error}</p>}
      <Button type="submit" disabled={busy || !code}>
        {busy ? 'Checking…' : 'Become admin'}
      </Button>
    </form>
  )
}
