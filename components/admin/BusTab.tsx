'use client'

import { useCallback, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { getSupabase } from '@/lib/supabase/client'
import type { BusRequest, PickupPoint, Profile } from '@/lib/types'

type Row = BusRequest & { profiles: Pick<Profile, 'full_name' | 'phone' | 'address' | 'gender'> | null }

/** Approval queue plus seats used vs capacity for every bus. */
export default function BusTab() {
  const [rows, setRows] = useState<Row[]>([])
  const [pickups, setPickups] = useState<PickupPoint[]>([])
  const [filter, setFilter] = useState<'pending' | 'approved' | 'declined' | 'all'>('pending')
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState('')

  const load = useCallback(async () => {
    const sb = getSupabase()
    const [r, p] = await Promise.all([
      sb.from('bus_requests').select('*, profiles(full_name, phone, address, gender)').order('created_at'),
      sb.from('pickup_points').select('*').order('sort_order'),
    ])
    if (r.error || p.error) return setError('Could not load requests.')
    setRows((r.data as unknown as Row[]) ?? [])
    setPickups((p.data as PickupPoint[]) ?? [])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function decide(id: string, status: 'approved' | 'declined' | 'pending') {
    setBusyId(id)
    setError('')
    // The database function refuses to approve past a bus's capacity.
    const { error: err } = await getSupabase().rpc('set_bus_request_status', { request_id: id, new_status: status })
    if (err) setError(err.message)
    await load()
    setBusyId('')
  }

  const approvedCount = (pickupId: string) => rows.filter((r) => r.pickup_id === pickupId && r.status === 'approved').length
  const pickupName = (id: string) => pickups.find((p) => p.id === id)?.name ?? 'Unknown'
  const shown = rows.filter((r) => filter === 'all' || r.status === filter)

  return (
    <div className="space-y-10">
      <section aria-label="Seats per bus" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pickups.map((p) => {
          const used = approvedCount(p.id)
          const pending = rows.filter((r) => r.pickup_id === p.id && r.status === 'pending').length
          return (
            <div key={p.id} className="rounded-2xl border border-cream/20 p-5">
              <p className="label text-cream">{p.name}</p>
              <p className="heading mt-2 text-4xl">
                {used}
                <span className="text-xl text-cream/60"> / {p.capacity}</span>
              </p>
              <p className="text-sm text-cream/70">approved seats · {pending} pending</p>
            </div>
          )
        })}
      </section>

      {error && (
        <p role="alert" className="rounded-xl border border-burgundy/60 bg-burgundy/30 px-4 py-3">
          {error}
        </p>
      )}

      <section>
        <div className="mb-4 flex flex-wrap gap-2">
          {(['pending', 'approved', 'declined', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`label min-h-11 cursor-pointer rounded-full border px-4 text-xs ${filter === f ? 'border-aqua text-aqua' : 'border-cream/30 text-cream/70'}`}
            >
              {f} ({f === 'all' ? rows.length : rows.filter((r) => r.status === f).length})
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="text-cream/70">Nothing here.</p>
        ) : (
          <ul className="space-y-3">
            {shown.map((r) => (
              <li key={r.id} className="rounded-2xl border border-cream/20 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="label text-base text-cream">{r.profiles?.full_name ?? 'Unknown guest'}</p>
                    <p className="text-sm text-cream/80">
                      {r.profiles?.phone && (
                        <a href={`tel:${r.profiles.phone}`} className="underline underline-offset-4">
                          {r.profiles.phone}
                        </a>
                      )}
                      {r.profiles?.gender && ` · ${r.profiles.gender}`}
                    </p>
                    <p className="mt-1 text-sm text-cream/70">Coming from: {r.profiles?.address || 'not given'}</p>
                    <p className="mt-1 text-sm">
                      Wants: <strong>{pickupName(r.pickup_id)}</strong> · status: <strong>{r.status}</strong>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {r.status !== 'approved' && (
                      <Button disabled={busyId === r.id} onClick={() => decide(r.id, 'approved')}>
                        Approve
                      </Button>
                    )}
                    {r.status !== 'declined' && (
                      <Button variant="outline" disabled={busyId === r.id} onClick={() => decide(r.id, 'declined')}>
                        Decline
                      </Button>
                    )}
                    {r.status !== 'pending' && (
                      <Button variant="outline" disabled={busyId === r.id} onClick={() => decide(r.id, 'pending')}>
                        Back to pending
                      </Button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
