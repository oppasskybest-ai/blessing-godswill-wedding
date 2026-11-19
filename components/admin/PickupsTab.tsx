'use client'

import { useCallback, useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { TextField } from '@/components/ui/Field'
import { getSupabase } from '@/lib/supabase/client'
import type { PickupContact, PickupPoint } from '@/lib/types'

type Draft = PickupPoint & { contact_name: string; contact_phone: string }

/** Edit time, capacity, map pin, contact person and phone for each takeoff point. */
export default function PickupsTab() {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [message, setMessage] = useState('')
  const [savingId, setSavingId] = useState('')

  const load = useCallback(async () => {
    const sb = getSupabase()
    const [p, c] = await Promise.all([sb.from('pickup_points').select('*').order('sort_order'), sb.from('pickup_contacts').select('*')])
    const contacts = new Map(((c.data as PickupContact[]) ?? []).map((x) => [x.pickup_id, x]))
    setDrafts(
      ((p.data as PickupPoint[]) ?? []).map((pt) => ({
        ...pt,
        contact_name: contacts.get(pt.id)?.contact_name ?? '',
        contact_phone: contacts.get(pt.id)?.phone ?? '',
      }))
    )
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const patch = (id: string, change: Partial<Draft>) => setDrafts((ds) => ds.map((d) => (d.id === id ? { ...d, ...change } : d)))

  async function save(d: Draft) {
    setSavingId(d.id)
    setMessage('')
    const sb = getSupabase()
    const a = await sb
      .from('pickup_points')
      .update({ pickup_time: d.pickup_time, capacity: d.capacity, maps_url: d.maps_url || null, address: d.address, name: d.name })
      .eq('id', d.id)
    const b = await sb.from('pickup_contacts').upsert({ pickup_id: d.id, contact_name: d.contact_name, phone: d.contact_phone })
    setMessage(a.error || b.error ? `Could not save ${d.name}.` : `${d.name} saved.`)
    setSavingId('')
  }

  return (
    <div className="space-y-6">
      <p className="text-cream/80">
        Contact names and phone numbers are shown to a guest only after their seat is approved for that takeoff point.
      </p>
      {message && (
        <p role="status" className="rounded-xl border border-aqua/50 bg-aqua/10 px-4 py-3 text-aqua">
          {message}
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        {drafts.map((d) => (
          <section key={d.id} className="space-y-4 rounded-2xl border border-cream/20 p-6">
            <h2 className="label text-lg text-cream">{d.name}</h2>
            <TextField label="Address" value={d.address} onChange={(e) => patch(d.id, { address: e.target.value })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Pickup time" value={d.pickup_time} onChange={(e) => patch(d.id, { pickup_time: e.target.value })} />
              <TextField
                label="Seats (capacity)"
                type="number"
                min={0}
                value={String(d.capacity)}
                onChange={(e) => patch(d.id, { capacity: Math.max(0, Number(e.target.value) || 0) })}
              />
            </div>
            <TextField
              label="Google Maps link"
              optional
              hint="Leave empty to search by the address."
              value={d.maps_url ?? ''}
              onChange={(e) => patch(d.id, { maps_url: e.target.value })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Contact person" value={d.contact_name} onChange={(e) => patch(d.id, { contact_name: e.target.value })} />
              <TextField label="Contact phone" type="tel" value={d.contact_phone} onChange={(e) => patch(d.id, { contact_phone: e.target.value })} />
            </div>
            <Button disabled={savingId === d.id} onClick={() => save(d)}>
              {savingId === d.id ? 'Saving…' : 'Save'}
            </Button>
          </section>
        ))}
      </div>
    </div>
  )
}
