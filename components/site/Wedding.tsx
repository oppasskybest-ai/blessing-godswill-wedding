import Reveal from '@/components/site/Reveal'
import AddToCalendar from '@/components/site/AddToCalendar'
import Button from '@/components/ui/Button'
import { COLOR_SWATCHES, EVENT, VENUE_MAPS_URL } from '@/lib/config/site'

export default function Wedding() {
  return (
    <section id="wedding" className="bg-aqua px-4 py-20 text-forest sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="heading text-center text-5xl sm:text-7xl">The Wedding</h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <Reveal>
            <article className="h-full rounded-3xl border border-forest/40 bg-cream-soft/50 p-7">
              <h3 className="label text-base">The venue</h3>
              <p className="mt-4 text-lg">
                We&rsquo;re celebrating at {EVENT.venueName}, {EVENT.venueArea}.
              </p>
              <p className="mt-2 text-sm text-forest/70">The ceremony is outdoors.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {/* Opens Google Maps, or whichever maps app the guest's phone uses. */}
                <Button href={VENUE_MAPS_URL} variant="dark">
                  Click to get directions
                </Button>
                <AddToCalendar variant="dark" />
              </div>
            </article>
          </Reveal>

          <Reveal delay={100}>
            <article className="h-full rounded-3xl border border-forest/40 bg-cream-soft/50 p-7">
              <h3 className="label text-base">Means of transportation</h3>
              <p className="mt-4 text-lg">
                Buses will be made available for all invited guests from designated takeoff points.
              </p>
              <p className="mt-2 text-sm text-forest/70">
                Seats are limited. Register, pick your nearest takeoff point and wait for approval.
              </p>
              <div className="mt-6">
                <Button href="/#takeoff" variant="dark">
                  See takeoff points
                </Button>
              </div>
            </article>
          </Reveal>

          <Reveal delay={200}>
            <article className="h-full rounded-3xl border border-forest/40 bg-cream-soft/50 p-7">
              <h3 className="label text-base">Attire</h3>
              <p className="mt-4 text-lg">
                Please come in a touch of aquamarine blue, emerald green, burgundy and peach, smart casual or traditional
                attire, as our marriage will be held outdoors.
              </p>
              <ul className="mt-6 flex flex-wrap gap-4" aria-label="Colour palette">
                {COLOR_SWATCHES.map((c) => (
                  <li key={c.hex} className="flex flex-col items-center gap-2 text-center">
                    <span
                      className="block size-12 rounded-full border border-forest/40"
                      style={{ background: c.hex }}
                      role="img"
                      aria-label={c.name}
                    />
                    <span className="text-xs">{c.name}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
