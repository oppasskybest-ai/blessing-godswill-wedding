import Botanical from '@/components/site/Botanical'
import Countdown from '@/components/site/Countdown'
import Button from '@/components/ui/Button'
import { EVENT, REGISTRATION_DEADLINE } from '@/lib/config/site'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-forest px-4 pb-20 pt-14 sm:px-6 sm:pt-20">
      <Botanical className="pointer-events-none absolute -right-10 top-6 hidden w-[28rem] text-sage/70 sm:block" />

      <div className="relative mx-auto max-w-5xl">
        <p className="label text-sage">Traditional marriage</p>

        <h1 className="mt-4">
          <span className="heading block text-[clamp(3.5rem,13vw,9rem)] text-cream">Blessing</span>
          <span className="script -mt-1 ml-2 block text-[clamp(2.5rem,7vw,4.5rem)] text-sage">and</span>
          <span className="heading block text-[clamp(3.5rem,13vw,9rem)] text-cream sm:ml-16">Godswill</span>
        </h1>

        <p className="label mt-8 text-cream/90">are celebrating their traditional marriage on</p>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-8">
          <p className="label border-cream/40 text-lg text-cream sm:border-r sm:pr-8">{EVENT.dateShort}</p>
          <p className="label text-lg text-cream">
            {EVENT.venueArea.split(', ').slice(0, 2).join(', ')}
            <br />
            {EVENT.venueArea.split(', ').slice(2).join(', ')}
          </p>
        </div>

        <div className="mt-12">
          <Countdown />
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button href="/register">Register to attend</Button>
          <Button href="/#wedding" variant="outline">
            Venue &amp; directions
          </Button>
        </div>
        {REGISTRATION_DEADLINE && (
          <p className="label mt-4 text-sage">Please register by {REGISTRATION_DEADLINE}</p>
        )}
      </div>
    </section>
  )
}
