import AddToCalendar from '@/components/site/AddToCalendar'
import Botanical from '@/components/site/Botanical'
import Reveal from '@/components/site/Reveal'
import Button from '@/components/ui/Button'
import Photo from '@/components/ui/Photo'
import { IMG } from '@/lib/config/images'
import { COLOR_SWATCHES } from '@/lib/config/site'
import { venueMapsUrl, type SiteSettings } from '@/lib/data/settings'

const CARD =
  'glass-light group flex h-full flex-col overflow-hidden rounded-[2rem] shadow-[0_30px_60px_-30px_rgba(46,63,45,0.5)] transition-transform duration-500 hover:-translate-y-2'

function CardImage({ slot }: { slot: (typeof IMG)['wedding']['venue'] }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden">
      <Photo slot={slot} sizes="(min-width: 768px) 33vw, 100vw" className="transition-transform duration-[1600ms] ease-out group-hover:scale-110" />
    </div>
  )
}

export default function Wedding({ settings }: { settings: SiteSettings }) {
  return (
    <section id="wedding" className="sheet section-pad overflow-hidden bg-aqua text-forest">
      <Botanical variant="rose" className="absolute -right-10 top-10 hidden w-64 text-forest/20 lg:block" />

      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal>
          <h2 className="heading text-center text-5xl sm:text-8xl">The Wedding</h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal className="h-full">
            <article className={CARD}>
              <CardImage slot={IMG.wedding.venue} />
              <div className="flex flex-1 flex-col p-7">
                <h3 className="label text-base">The venue</h3>
                <p className="mt-4 text-lg">
                  We&rsquo;re celebrating at {settings.venue_name}, {settings.venue_area}.
                </p>
                <p className="mt-2 text-sm text-forest/70">The ceremony is outdoors.</p>
                <div className="mt-auto flex flex-wrap gap-3 pt-6">
                  {/* Opens Google Maps, or whichever maps app the guest's phone uses. */}
                  <Button href={venueMapsUrl(settings)} variant="dark">
                    Click to get directions
                  </Button>
                  <AddToCalendar variant="dark" venue={`${settings.venue_name}, ${settings.venue_area}`} />
                </div>
              </div>
            </article>
          </Reveal>

          <Reveal delay={120} className="h-full">
            <article className={CARD}>
              <CardImage slot={IMG.wedding.transport} />
              <div className="flex flex-1 flex-col p-7">
                <h3 className="label text-base">Means of transportation</h3>
                <p className="mt-4 text-lg">Buses will be made available for all invited guests from designated takeoff points.</p>
                <p className="mt-2 text-sm text-forest/70">
                  Seats are limited. Register, pick your nearest takeoff point and wait for approval.
                </p>
                <div className="mt-auto pt-6">
                  <Button href="/#takeoff" variant="dark">
                    See takeoff points
                  </Button>
                </div>
              </div>
            </article>
          </Reveal>

          <Reveal delay={240} className="h-full sm:col-span-2 lg:col-span-1">
            <article className={CARD}>
              <CardImage slot={IMG.wedding.attire} />
              <div className="flex flex-1 flex-col p-7">
                <h3 className="label text-base">Attire</h3>
                <p className="mt-4 text-lg">
                  Please come in a touch of aquamarine blue, emerald green, burgundy and peach, smart casual or traditional
                  attire, as our marriage will be held outdoors.
                </p>
                <ul className="mt-auto flex flex-wrap gap-4 pt-6" aria-label="Colour palette">
                  {COLOR_SWATCHES.map((c) => (
                    <li key={c.hex} className="flex flex-col items-center gap-2 text-center">
                      <span className="block size-11 rounded-full border border-forest/40" style={{ background: c.hex }} role="img" aria-label={c.name} />
                      <span className="text-xs">{c.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        </div>

        {/* Attire inspiration: attire-inspo-1..4 */}
        <div className="mt-20">
          <Reveal>
            <p className="script text-center text-5xl text-forest/70 sm:text-6xl">Colour inspiration</p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {IMG.attireInspo.map((p, i) => (
              <Reveal key={p.src} variant="clip" delay={i * 120}>
                <figure className="group relative aspect-[3/4] overflow-hidden rounded-t-full rounded-b-3xl border border-forest/40">
                  <Photo slot={p} sizes="(min-width: 640px) 22vw, 45vw" className="transition-transform duration-[1600ms] ease-out group-hover:scale-110" />
                  <figcaption className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
                    <span className="size-4 rounded-full border border-cream/80" style={{ background: COLOR_SWATCHES[i]?.hex }} />
                    <span className="label rounded-full bg-forest-deep/70 px-3 py-1 text-[0.6rem] text-cream">{COLOR_SWATCHES[i]?.name}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
