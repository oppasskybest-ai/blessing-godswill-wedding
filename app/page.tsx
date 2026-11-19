import { InviteBand, QuoteBand, SaveTheDateBand } from '@/components/site/Bands'
import Faq from '@/components/site/Faq'
import Footer from '@/components/site/Footer'
import Hero from '@/components/site/Hero'
import Journey from '@/components/site/Journey'
import Pickups from '@/components/site/Pickups'
import Schedule from '@/components/site/Schedule'
import Wedding from '@/components/site/Wedding'
import { fetchSettings } from '@/lib/data/settings'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

// Re-fetch pickup seat availability at most once a minute.
export const revalidate = 60

/**
 * Order matters: each "sheet" section slides over the bottom of the one above it,
 * and the full-width photo bands (QuoteBand, SaveTheDateBand, InviteBand) sit between them.
 */
export default async function HomePage() {
  // Venue + footer contact are editable in Admin -> Venue; falls back to lib/config/site.ts.
  const settings = await fetchSettings(isSupabaseConfigured ? getSupabase() : null)
  return (
    <main>
      <Hero venueArea={settings.venue_area} />
      <Journey />
      <QuoteBand />
      <Wedding settings={settings} />
      <Pickups />
      <Schedule />
      <SaveTheDateBand venueArea={settings.venue_area} />
      <Faq />
      <InviteBand />
      <Footer settings={settings} />
    </main>
  )
}
