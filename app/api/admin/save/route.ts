import { NextResponse } from 'next/server'
import { getSupabaseAdmin, requireAdmin } from '@/lib/supabase/admin'

/**
 * Admin-only saves, done on the server so a database-policy hiccup can never silently
 * swallow an edit, and the real error is returned.
 *   { kind: 'pickup',   id, name, address, pickup_time, capacity, maps_url, contact_name, contact_phone }
 *   { kind: 'settings', venue_name, venue_area, venue_maps_url, contact_name, contact_phone }
 */
const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

function cleanUrl(v: unknown): string | null | undefined {
  const s = text(v, 2000)
  if (!s) return null
  return /^https?:\/\/\S+$/i.test(s) ? s : undefined // undefined = invalid
}

export async function POST(req: Request) {
  const adminId = await requireAdmin(req)
  if (!adminId) return NextResponse.json({ error: 'Not allowed.' }, { status: 403 })

  let b: Record<string, unknown>
  try {
    b = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const db = getSupabaseAdmin()

  if (b.kind === 'pickup') {
    const id = text(b.id, 64)
    const maps = cleanUrl(b.maps_url)
    const capacity = Number(b.capacity)
    if (!id) return NextResponse.json({ error: 'Missing takeoff point.' }, { status: 400 })
    if (maps === undefined) return NextResponse.json({ error: 'The map link must start with http:// or https://' }, { status: 400 })
    if (!Number.isInteger(capacity) || capacity < 0 || capacity > 10000) {
      return NextResponse.json({ error: 'Seats must be a whole number.' }, { status: 400 })
    }
    const name = text(b.name, 120)
    const address = text(b.address, 300)
    if (!name || !address) return NextResponse.json({ error: 'Name and address are required.' }, { status: 400 })

    const a = await db
      .from('pickup_points')
      .update({ name, address, pickup_time: text(b.pickup_time, 80) || 'TBA', capacity, maps_url: maps })
      .eq('id', id)
      .select('id')
    if (a.error) return NextResponse.json({ error: `Takeoff point: ${a.error.message}` }, { status: 500 })
    if (!a.data?.length) return NextResponse.json({ error: 'That takeoff point no longer exists.' }, { status: 404 })

    const c = await db
      .from('pickup_contacts')
      .upsert({ pickup_id: id, contact_name: text(b.contact_name, 120), phone: text(b.contact_phone, 40) }, { onConflict: 'pickup_id' })
    if (c.error) return NextResponse.json({ error: `Contact: ${c.error.message}` }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  if (b.kind === 'settings') {
    const maps = cleanUrl(b.venue_maps_url)
    if (maps === undefined) return NextResponse.json({ error: 'The map link must start with http:// or https://' }, { status: 400 })
    const venue_name = text(b.venue_name, 160)
    const venue_area = text(b.venue_area, 160)
    if (!venue_name || !venue_area) return NextResponse.json({ error: 'Venue name and area are required.' }, { status: 400 })
    const { error } = await db.from('site_settings').upsert(
      {
        id: 1,
        venue_name,
        venue_area,
        venue_maps_url: maps,
        contact_name: text(b.contact_name, 120),
        contact_phone: text(b.contact_phone, 40),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    if (error) {
      const hint = /site_settings/.test(error.message) ? ' Run supabase/update-02-venue-settings.sql in the Supabase SQL Editor first.' : ''
      return NextResponse.json({ error: `${error.message}.${hint}` }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'Unknown request.' }, { status: 400 })
}
