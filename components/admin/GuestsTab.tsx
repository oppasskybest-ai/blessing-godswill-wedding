'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/lib/auth/AuthProvider'
import { getSupabase } from '@/lib/supabase/client'
import type { BusRequest, PickupPoint, Profile } from '@/lib/types'

/** Spreadsheet-safe CSV cell (also blocks formulas like =HYPERLINK from guest-typed text). */
function csvCell(value: string | null | undefined): string {
  let v = value ?? ''
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`
  return `"${v.replace(/"/g, '""')}"`
}

export default function GuestsTab() {
  const { session } = useAuth()
  const [guests, setGuests] = useState<Profile[]>([])
  const [requests, setRequests] = useState<BusRequest[]>([])
  const [pickups, setPickups] = useState<PickupPoint[]>([])
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')

  const load = useCallback(async () => {
    const sb = getSupabase()
    const [g, r, p] = await Promise.all([
      sb.from('profiles').select('*').order('created_at', { ascending: false }),
      sb.from('bus_requests').select('*'),
      sb.from('pickup_points').select('*'),
    ])
    setGuests((g.data as Profile[]) ?? [])
    setRequests((r.data as BusRequest[]) ?? [])
    setPickups((p.data as PickupPoint[]) ?? [])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const busFor = (id: string) => {
    const r = requests.find((x) => x.user_id === id)
    if (!r) return ''
    return `${pickups.find((p) => p.id === r.pickup_id)?.name ?? '?'} (${r.status})`
  }

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return guests
    return guests.filter((g) => [g.full_name, g.phone, g.username, g.address ?? ''].some((v) => v.toLowerCase().includes(q)))
  }, [guests, query])

  function exportCsv() {
    const header = ['Name', 'Phone', 'Username', 'Gender', 'Coming from', 'Email', 'Bus', 'Registered']
    const lines = [header.map(csvCell).join(',')]
    for (const g of guests) {
      lines.push(
        [g.full_name, g.phone, g.username, g.gender, g.address, g.email, busFor(g.id), g.created_at.slice(0, 10)].map(csvCell).join(',')
      )
    }
    const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'wedding-guests.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function guestAction(action: 'reset-password' | 'delete', guest: Profile) {
    let password: string | undefined
    if (action === 'reset-password') {
      const entered = window.prompt(`New password for ${guest.full_name} (at least 6 characters):`)
      if (!entered) return
      password = entered
    } else if (!window.confirm(`Delete ${guest.full_name} and their bus request? This cannot be undone.`)) {
      return
    }
    const res = await fetch('/api/admin/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token}` },
      body: JSON.stringify({ action, userId: guest.id, password }),
    })
    const data = await res.json().catch(() => ({}))
    setMessage(res.ok ? (action === 'delete' ? 'Guest deleted.' : `Password reset for ${guest.full_name}.`) : data.error || 'Failed.')
    if (res.ok && action === 'delete') load()
  }

  const male = guests.filter((g) => g.gender === 'male').length
  const female = guests.filter((g) => g.gender === 'female').length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-cream/85">
          <strong className="heading text-3xl text-cream">{guests.length}</strong> registered
          <span className="text-cream/60"> · {male} male · {female} female</span>
        </p>
        <div className="flex flex-wrap gap-3">
          <input
            type="search"
            aria-label="Search guests"
            placeholder="Search name, phone, area…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="min-h-11 rounded-full border border-cream/30 bg-forest-deep/60 px-4 text-cream placeholder:text-cream/40"
          />
          <Button variant="outline" onClick={exportCsv}>
            Export CSV
          </Button>
        </div>
      </div>

      {message && (
        <p role="status" className="rounded-xl border border-aqua/50 bg-aqua/10 px-4 py-3 text-aqua">
          {message}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-cream/20">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="label bg-forest-deep text-xs text-cream/70">
            <tr>
              {['Name', 'Phone', 'Coming from', 'Bus', 'Registered', ''].map((h) => (
                <th key={h} scope="col" className="px-4 py-3 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((g) => (
              <tr key={g.id} className="border-t border-cream/10 align-top">
                <td className="px-4 py-3">
                  {g.full_name}
                  <span className="block text-xs text-cream/50">@{g.username}</span>
                </td>
                <td className="px-4 py-3">{g.phone}</td>
                <td className="px-4 py-3 text-cream/80">{g.address || '-'}</td>
                <td className="px-4 py-3">{busFor(g.id) || '-'}</td>
                <td className="px-4 py-3 text-cream/70">{g.created_at.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-3 text-xs">
                    <button className="cursor-pointer underline underline-offset-4" onClick={() => guestAction('reset-password', g)}>
                      Reset password
                    </button>
                    {!g.is_admin && (
                      <button className="cursor-pointer text-aqua underline underline-offset-4" onClick={() => guestAction('delete', g)}>
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-cream/60">
                  No guests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
