'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import PageShell from '@/components/site/PageShell'
import RecoveryCodeBox from '@/components/site/RecoveryCodeBox'
import Button from '@/components/ui/Button'
import { useAuth } from '@/lib/auth/AuthProvider'
import { fetchPickups, pickupMapsUrl, type PickupWithSeats } from '@/lib/data/pickups'
import { getSupabase } from '@/lib/supabase/client'
import type { BusRequest, PickupContact } from '@/lib/types'

export default function AccountPage() {
  const router = useRouter()
  const { session, profile, loading } = useAuth()

  const [request, setRequest] = useState<BusRequest | null>(null)
  const [pickups, setPickups] = useState<PickupWithSeats[]>([])
  const [contact, setContact] = useState<PickupContact | null>(null)
  const [choice, setChoice] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const [newCode, setNewCode] = useState<string | null>(null)
  const [codeError, setCodeError] = useState('')

  const userId = session?.user.id

  async function createRecoveryCode() {
    setCodeError('')
    setBusy(true)
    try {
      const res = await fetch('/api/recovery', {
        method: 'POST',
        headers: { Authorization: `Bearer ${session?.access_token}` },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Could not create a recovery code.')
      setNewCode(data.recoveryCode)
    } catch (err) {
      setCodeError(err instanceof Error ? err.message : 'Could not create a recovery code.')
    }
    setBusy(false)
  }

  const load = useCallback(async () => {
    if (!userId) return
    const supabase = getSupabase()
    try {
      const [{ data: req }, list] = await Promise.all([
        supabase.from('bus_requests').select('*').eq('user_id', userId).maybeSingle(),
        fetchPickups(supabase),
      ])
      setRequest((req as BusRequest) ?? null)
      setPickups(list)
      // Row-level security only returns this row once the request is APPROVED.
      if (req?.status === 'approved') {
        const { data } = await supabase.from('pickup_contacts').select('*').eq('pickup_id', req.pickup_id).maybeSingle()
        setContact((data as PickupContact) ?? null)
      } else {
        setContact(null)
      }
    } catch {
      setError('Could not load your bus details. Please refresh.')
    }
    setReady(true)
  }, [userId])

  useEffect(() => {
    if (!loading && !session) router.replace('/login?next=/account')
  }, [loading, session, router])

  useEffect(() => {
    load()
  }, [load])

  async function run(action: () => PromiseLike<{ error: { message: string } | null }>) {
    setBusy(true)
    setError('')
    const { error: err } = await action()
    if (err) setError('That did not work. Please try again.')
    await load()
    setBusy(false)
  }

  const supabase = () => getSupabase()
  const pickupOf = (id?: string) => pickups.find((p) => p.id === id)
  const current = pickupOf(request?.pickup_id)

  if (loading || !session || !profile) {
    return (
      <PageShell title="My account">
        <p className="text-cream/70">Loading…</p>
      </PageShell>
    )
  }

  const available = pickups.filter((p) => p.seatsTaken < p.capacity || p.id === request?.pickup_id)

  return (
    <PageShell title={`Welcome, ${profile.full_name.split(' ')[0]}`} intro="You are registered. Here are your details and your bus status.">
      <section className="rounded-2xl border border-cream/20 p-6">
        <h2 className="label text-cream/80">Your details</h2>
        <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-[10rem_1fr]">
          <Row k="Name" v={profile.full_name} />
          <Row k="Phone" v={profile.phone} />
          <Row k="Username" v={profile.username} />
          {profile.gender && <Row k="Gender" v={profile.gender === 'male' ? 'Male' : 'Female'} />}
          {profile.address && <Row k="Coming from" v={profile.address} />}
          {profile.email && <Row k="Email" v={profile.email} />}
        </dl>
      </section>

      <section className="mt-8 rounded-2xl border border-cream/20 p-6">
        <h2 className="label text-cream/80">Bus</h2>

        {!ready ? (
          <p className="mt-4 text-cream/70">Loading…</p>
        ) : (
          <>
            {!request && (
              <p className="mt-4 text-cream/85">You have not asked for a bus seat. You can still attend on your own.</p>
            )}

            {request?.status === 'pending' && current && (
              <div className="mt-4 space-y-2">
                <StatusPill tone="wait">Pending approval to join the bus</StatusPill>
                <p className="text-cream/85">
                  You asked for the <strong>{current.name}</strong> takeoff point ({current.address}). The couple will
                  confirm soon. Your pickup contact appears here once approved.
                </p>
              </div>
            )}

            {request?.status === 'declined' && (
              <div className="mt-4 space-y-2">
                <StatusPill tone="no">Seat not available</StatusPill>
                <p className="text-cream/85">
                  Sorry, we could not give you a seat at that takeoff point.
                  {request.admin_note ? ` ${request.admin_note}` : ' You can ask for a different one below.'}
                </p>
              </div>
            )}

            {request?.status === 'approved' && current && (
              <div className="mt-4 space-y-4">
                <StatusPill tone="ok">Approved. Your seat is confirmed</StatusPill>
                <div>
                  <p className="label text-cream">{current.name}</p>
                  <p className="text-cream/85">{current.address}</p>
                  <p className="text-sm text-cream/70">Pickup time: {current.pickup_time}</p>
                </div>
                <div className="rounded-xl bg-cream p-4 text-forest">
                  <p className="label text-xs text-forest/70">Bus contact, call if you are late or cannot find the point</p>
                  {/* TODO(owner): real names and numbers come from the pickup_contacts table (admin -> Pickups). */}
                  <p className="mt-1 text-lg">{contact?.contact_name || 'Contact to be announced'}</p>
                  {contact?.phone && (
                    <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="heading text-2xl underline underline-offset-4">
                      {contact.phone}
                    </a>
                  )}
                </div>
                <Button href={pickupMapsUrl(current)} variant="outline">
                  Directions to takeoff point
                </Button>
              </div>
            )}

            {/* Request / change / withdraw */}
            {(!request || request.status === 'declined' || request.status === 'pending') && (
              <div className="mt-6 space-y-3 border-t border-cream/15 pt-6">
                <label className="label block text-cream/80" htmlFor="pickup-choice">
                  {!request ? 'Request a seat' : request.status === 'pending' ? 'Change takeoff point' : 'Ask for a different takeoff point'}
                </label>
                <select
                  id="pickup-choice"
                  value={choice}
                  onChange={(e) => setChoice(e.target.value)}
                  className="w-full rounded-xl border border-cream/30 bg-forest-deep/60 px-4 py-3 text-base text-cream"
                >
                  <option value="">Choose a takeoff point…</option>
                  {available.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}, {p.address}
                    </option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-3">
                  <Button
                    disabled={!choice || busy}
                    onClick={() =>
                      run(async () => {
                        if (request?.status === 'pending') {
                          return supabase().from('bus_requests').update({ pickup_id: choice }).eq('id', request.id)
                        }
                        if (request) {
                          const del = await supabase().from('bus_requests').delete().eq('id', request.id)
                          if (del.error) return del
                        }
                        return supabase().from('bus_requests').insert({ user_id: userId, pickup_id: choice })
                      }).then(() => setChoice(''))
                    }
                  >
                    {!request || request.status === 'declined' ? 'Request seat' : 'Save change'}
                  </Button>
                  {request && (
                    <Button
                      variant="outline"
                      disabled={busy}
                      onClick={() => run(async () => supabase().from('bus_requests').delete().eq('id', request.id))}
                    >
                      Withdraw request
                    </Button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {error && (
          <p role="alert" className="mt-4 rounded-xl border border-burgundy/60 bg-burgundy/30 px-4 py-3">
            {error}
          </p>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-cream/20 p-6">
        <h2 className="label text-cream/80">Forgot-password protection</h2>
        {newCode ? (
          <div className="mt-4">
            <RecoveryCodeBox code={newCode} doneLabel="Done" onDone={() => setNewCode(null)} />
          </div>
        ) : (
          <>
            <p className="mt-4 text-cream/85">
              Lost your recovery code, or never saw one? Create a new one. The old code stops working.
            </p>
            <div className="mt-4">
              <Button variant="outline" disabled={busy} onClick={createRecoveryCode}>
                Create a new recovery code
              </Button>
            </div>
            {codeError && (
              <p role="alert" className="mt-4 rounded-xl border border-burgundy/60 bg-burgundy/30 px-4 py-3">
                {codeError}
              </p>
            )}
          </>
        )}
      </section>
    </PageShell>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-cream/60">{k}</dt>
      <dd className="break-words">{v}</dd>
    </>
  )
}

function StatusPill({ tone, children }: { tone: 'wait' | 'ok' | 'no'; children: React.ReactNode }) {
  const styles = {
    wait: 'border-aqua text-aqua',
    ok: 'border-emerald-300 text-emerald-200',
    no: 'border-burgundy/70 text-cream bg-burgundy/30',
  }[tone]
  return <span className={`label inline-block rounded-full border px-4 py-1.5 ${styles}`}>{children}</span>
}
