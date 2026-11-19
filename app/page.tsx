import { InviteBand, QuoteBand, SaveTheDateBand } from '@/components/site/Bands'
import Faq from '@/components/site/Faq'
import Footer from '@/components/site/Footer'
import Hero from '@/components/site/Hero'
import Journey from '@/components/site/Journey'
import Pickups from '@/components/site/Pickups'
import Schedule from '@/components/site/Schedule'
import Wedding from '@/components/site/Wedding'

// Re-fetch pickup seat availability at most once a minute.
export const revalidate = 60

/**
 * Order matters: each "sheet" section slides over the bottom of the one above it,
 * and the full-width photo bands (QuoteBand, SaveTheDateBand, InviteBand) sit between them.
 */
export default function HomePage() {
  return (
    <main>
      <Hero />
      <Journey />
      <QuoteBand />
      <Wedding />
      <Pickups />
      <Schedule />
      <SaveTheDateBand />
      <Faq />
      <InviteBand />
      <Footer />
    </main>
  )
}
