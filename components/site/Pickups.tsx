import Reveal from '@/components/site/Reveal'
import Button from '@/components/ui/Button'
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
    <section id="takeoff" className="bg-aqua px-4 pb-20 pt-4 text-forest sm:px-6">
      <div className="mx-auto max-w-6xl border-t border-forest/30 pt-16">
        <Reveal>
          <h2 className="heading text-5xl sm:text-7xl">Takeoff Points</h2>
          <p className="mt-4 max-w-2xl text-lg">
            Pick the point nearest to you when you register. Seats are limited, so each request is approved by the
            couple. Once you are approved, the contact person and phone number for your point appear on your account page.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {pickups.map((p, i) => {
            const full = p.seatsTaken >= p.capacity
            return (
              <Reveal key={p.id} delay={i * 80}>
                <article className="h-full rounded-3xl border border-forest/40 bg-cream-soft/50 p-7">
                  <h3 className="label text-lg">{p.name}</h3>
                  <p className="mt-3 text-lg">{p.address}</p>
                  <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-1 text-sm">
                    <div className="flex gap-2">
                      <dt className="text-forest/60">Pickup time</dt>
                      <dd>{p.pickup_time}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="text-forest/60">Seats</dt>
                      <dd>{full ? 'Full' : 'Available'}</dd>
                    </div>
                  </dl>
                  <div className="mt-5">
                    <Button href={pickupMapsUrl(p)} variant="dark">
                      View on map
                    </Button>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Button href="/register" variant="dark">
            Register &amp; request a seat
          </Button>
        </div>
      </div>
    </section>
  )
}
