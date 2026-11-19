'use client'

import { useEffect, useState } from 'react'
import MapPreview from '@/components/admin/MapPreview'
import Button from '@/components/ui/Button'
import { TextField } from '@/components/ui/Field'
import { adminPost } from '@/lib/adminApi'
import { useAuth } from '@/lib/auth/AuthProvider'
import { defaultSettings, fetchSettings, type SiteSettings } from '@/lib/data/settings'
import { extractUrl } from '@/lib/maps'
import { getSupabase } from '@/lib/supabase/client'

/** The real event venue (name, area, map pin) and the general contact shown in the footer. */
export default function VenueTab() {
  const { session } = useAuth()
  const [s, setS] = useState<SiteSettings>(defaultSettings())
  const [mapsText, setMapsText] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetchSettings(getSupabase()).then((v) => {
      setS(v)
      setMapsText(v.venue_maps_url ?? '')
      setLoaded(true)
    })
  }, [])

  async function save() {
    setSaving(true)
    setMessage('')
    const error = await adminPost('/api/admin/save', session?.access_token, {
      kind: 'settings',
      ...s,
      venue_maps_url: extractUrl(mapsText),
    })
    setMessage(error ? `Could not save: ${error}` : 'Saved. The public page updates within about a minute.')
    setSaving(false)
  }

  if (!loaded) return <p className="text-cream/70">Loading…</p>

  return (
    <div className="space-y-6">
      <p className="text-cream/80">
        This is the real event location. The &ldquo;Click to get directions&rdquo; button on the home page opens the map link below.
      </p>
      {message && (
        <p role="status" className="rounded-xl border border-aqua/50 bg-aqua/10 px-4 py-3 text-aqua">
          {message}
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-2xl border border-cream/20 p-6">
          <h2 className="label text-lg text-cream">Venue</h2>
          <TextField label="Venue name" value={s.venue_name} onChange={(e) => setS({ ...s, venue_name: e.target.value })} />
          <TextField label="Area / town" value={s.venue_area} onChange={(e) => setS({ ...s, venue_area: e.target.value })} />
          <TextField
            label="Google Maps link"
            optional
            hint="Paste the Google Maps link (or the iframe code from Share > Embed a map). Leave empty to search by name and area."
            value={mapsText}
            onChange={(e) => setMapsText(e.target.value)}
          />
          <h2 className="label pt-2 text-lg text-cream">General contact (footer)</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Contact person" value={s.contact_name} onChange={(e) => setS({ ...s, contact_name: e.target.value })} />
            <TextField label="Contact phone" type="tel" value={s.contact_phone} onChange={(e) => setS({ ...s, contact_phone: e.target.value })} />
          </div>
          <Button disabled={saving} onClick={save}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </section>
        <section className="space-y-3">
          <h2 className="label text-lg text-cream">Map preview</h2>
          <MapPreview link={mapsText} fallbackQuery={`${s.venue_name}, ${s.venue_area}`} title="Event venue" />
        </section>
      </div>
    </div>
  )
}
