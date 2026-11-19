import PhotoBand from '@/components/site/PhotoBand'
import Reveal from '@/components/site/Reveal'
import Button from '@/components/ui/Button'
import { IMG } from '@/lib/config/images'
import { EVENT } from '@/lib/config/site'

/** Band 1: after Our Journey. */
export function QuoteBand() {
  return (
    <PhotoBand slot={IMG.bands[0]}>
      <Reveal variant="scale">
        <p className="script text-5xl text-cream sm:text-8xl">Love, belief,</p>
        <p className="heading mt-2 text-2xl text-cream sm:text-5xl">commitment &amp; steadfastness</p>
      </Reveal>
    </PhotoBand>
  )
}

/** Band 2: before the FAQs. */
export function SaveTheDateBand() {
  return (
    <PhotoBand slot={IMG.bands[1]}>
      <Reveal variant="scale">
        <p className="script text-5xl text-cream sm:text-8xl">Save the date</p>
        <p className="heading mt-3 text-4xl tracking-wider text-cream sm:text-7xl">23 · 12 · 2026</p>
        <p className="label mt-5 text-cream/90">{EVENT.venueArea}</p>
      </Reveal>
    </PhotoBand>
  )
}

/** Band 3: above the footer, with the main call to action. */
export function InviteBand() {
  return (
    <PhotoBand slot={IMG.bands[2]}>
      <Reveal variant="scale">
        <p className="label text-cream/90">You are invited</p>
        <p className="heading mt-3 text-4xl text-cream sm:text-7xl">Be part of our day</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/register">Register to attend</Button>
          <Button href="/#takeoff" variant="outline">
            Join the bus
          </Button>
        </div>
      </Reveal>
    </PhotoBand>
  )
}
