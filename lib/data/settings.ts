import type { SupabaseClient } from '@supabase/supabase-js'
import { EVENT, GENERAL_CONTACT, VENUE_MAPS_URL } from '@/lib/config/site'

export type SiteSettings = {
  venue_name: string
  venue_area: string
  venue_maps_url: string | null
  contact_name: string
  contact_phone: string
}

/** Used until the database row exists (or when Supabase is not connected yet). */
export function defaultSettings(): SiteSettings {
  return {
    venue_name: EVENT.venueName,
    venue_area: EVENT.venueArea,
    venue_maps_url: null,
    contact_name: GENERAL_CONTACT.name,
    contact_phone: GENERAL_CONTACT.phone,
  }
}

/** Public read (anon key). Falls back to the defaults on any problem, so the page never breaks. */
export async function fetchSettings(supabase: SupabaseClient | null): Promise<SiteSettings> {
  const base = defaultSettings()
  if (!supabase) return base
  try {
    const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
    if (!data) return base
    return {
      venue_name: data.venue_name || base.venue_name,
      venue_area: data.venue_area || base.venue_area,
      venue_maps_url: data.venue_maps_url || null,
      contact_name: data.contact_name || base.contact_name,
      contact_phone: data.contact_phone || base.contact_phone,
    }
  } catch {
    return base
  }
}

/** The saved pin, or a Google Maps search for the venue until a pin is saved. */
export function venueMapsUrl(s: SiteSettings): string {
  if (s.venue_maps_url) return s.venue_maps_url
  return s.venue_area === EVENT.venueArea
    ? VENUE_MAPS_URL
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.venue_name}, ${s.venue_area}`)}`
}
