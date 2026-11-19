import Hero from '@/components/site/Hero'
import Journey from '@/components/site/Journey'
import Wedding from '@/components/site/Wedding'
import Schedule from '@/components/site/Schedule'
import Pickups from '@/components/site/Pickups'
import Faq from '@/components/site/Faq'
import Footer from '@/components/site/Footer'

// Re-fetch pickup seat availability at most once a minute.
export const revalidate = 60

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Journey />
      <Wedding />
      <Pickups />
      <Schedule />
      <Faq />
      <Footer />
    </main>
  )
}
