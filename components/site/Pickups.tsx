import Botanical from '@/components/site/Botanical'
import ParallaxBg from '@/components/site/ParallaxBg'
import Reveal from '@/components/site/Reveal'
import Button from '@/components/ui/Button'
import { IMG } from '@/lib/config/images'
import { fallbackPickups, fetchPickups, pickupMapsUrl, type PickupWithSeats } from '@/lib/data/pickups'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'

async function load(): Promise<PickupWithSeats[]> {
  if (!isSupabaseConfigured) return fallbackPickups()
  try {
    return await fetchPickups(getSupabase())
  } catch {
    return fallbackPickups()
  }
}

/** Public takeoff-point list. Phone numbers are NOT here; guests see them only after approval. */
export default async function Pickups() {
  const pickups = await load()

  return (
    <section id="takeoff" className="sheet section-pad overflow-hidden bg-forest-deep text-cream">
      {/* Photo background (bg-takeoff.jpg) under a dark overlay */}
      <ParallaxBg slot={IMG.bgTakeoff} strength={0.12} overlay="bg-forest-deep/80" className="absolute inset-0" />
      <Botanical variant="rose" className="absolute -left-10 top-12 hidden w-60 text-cream/15 lg:block" />
      <Botanical variant="rose" flip className="absolute -right-8 bottom-24 hidden w-56 text-cream/15 lg:block" />

      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="script text-5xl text-sage sm:text-7xl">Ride with us</p>
          <h2 className="heading -mt-2 text-5xl sm:text-8xl">Takeoff Points</h2>
          <p className="mt-6 max-w-2xl text-lg text-cream/85">
            Pick the point nearest to you when you register. Seats are limited, so each request is approved by the
            couple. Once you are approved, the contact person and phone number for your point appear on your account page.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {pickups.map((p, i) => {
            const full = p.seatsTaken >= p.capacity
            return (
              <Reveal key={p.id} delay={i * 100} className="h-full">
                <article className="glass-dark group flex h-full flex-col rounded-[2rem] p-7 transition-all duration-500 hover:-translate-y-2 hover:border-cream/60 hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
                  <div className="flex items-start justify-between gap-4">
                    <span className="heading text-5xl text-cream/35 transition-colors duration-500 group-hover:text-cream/70">{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className={`label rounded-full border px-3 py-1 text-[0.65rem] ${full ? 'border-burgundy/70 bg-burgundy/30 text-cream' : 'border-emerald-300/70 text-emerald-200'}`}
                    >
                      {full ? 'Full' : 'Seats available'}
                    </span>
                  </div>
                  <h3 className="label mt-4 text-lg text-cream">{p.name}</h3>
                  <p className="mt-2 text-lg text-cream/90">{p.address}</p>
                  <p className="mt-3 text-sm text-cream/70">
                    Pickup time: <span className="text-cream">{p.pickup_time}</span>
                  </p>
                  <div className="mt-auto pt-6">
                    <Button href={pickupMapsUrl(p)} variant="outline">
                      View on map
                    </Button>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-14 text-center">
          <Button href="/register">Register &amp; request a seat</Button>
        </Reveal>
      </div>
    </section>
  )
}
