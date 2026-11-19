import type { SupabaseClient } from '@supabase/supabase-js'
import { PICKUPS_FALLBACK } from '@/lib/config/site'
import type { PickupPoint } from '@/lib/types'

export type PickupWithSeats = PickupPoint & { seatsTaken: number }

/** Loads the active pickup points plus how many seats are approved. Works with the anon key. */
export async function fetchPickups(supabase: SupabaseClient): Promise<PickupWithSeats[]> {
  const [{ data: points, error }, { data: counts }] = await Promise.all([
    supabase.from('pickup_points').select('*').eq('active', true).order('sort_order'),
    supabase.rpc('pickup_seat_counts'),
  ])
  if (error || !points) throw error ?? new Error('No pickup points')
  const taken = new Map<string, number>((counts ?? []).map((c: { pickup_id: string; approved: number }) => [c.pickup_id, Number(c.approved)]))
  return (points as PickupPoint[]).map((p) => ({ ...p, seatsTaken: taken.get(p.id) ?? 0 }))
}

/** Static copy used when the database is not connected yet (local preview). */
export function fallbackPickups(): PickupWithSeats[] {
  return PICKUPS_FALLBACK.map((p, i) => ({
    id: p.slug,
    slug: p.slug,
    name: p.name,
    address: p.address,
    pickup_time: p.pickup_time,
    capacity: p.capacity,
    maps_url: null,
    sort_order: i,
    active: true,
    seatsTaken: 0,
  }))
}

/** Google Maps link for a pickup: the saved pin if there is one, otherwise a search of its address. */
export function pickupMapsUrl(p: Pick<PickupPoint, 'maps_url' | 'name' | 'address'>): string {
  if (p.maps_url) return p.maps_url
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.address}, ${p.name}, Akwa Ibom, Nigeria`)}`
}
