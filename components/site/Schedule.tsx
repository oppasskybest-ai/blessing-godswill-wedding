import Botanical from '@/components/site/Botanical'
import Reveal from '@/components/site/Reveal'
import { EVENT, SCHEDULE, SHOW_AFTERPARTY } from '@/lib/config/site'

export default function Schedule() {
  const items = SCHEDULE.filter((s) => SHOW_AFTERPARTY || !s.optional)
  return (
    <section id="schedule" className="relative overflow-hidden bg-cream px-4 py-20 text-forest sm:px-6">
      <Botanical className="pointer-events-none absolute -left-8 bottom-4 w-80 text-sage" />
      <Botanical flip className="pointer-events-none absolute -right-8 top-4 hidden w-96 text-sage sm:block" />

      <div className="relative mx-auto grid max-w-5xl gap-12 md:grid-cols-2 md:items-center">
        <Reveal>
          <h2 className="heading text-5xl sm:text-7xl">
            Schedule
            <span className="script mx-2 text-4xl sm:text-5xl">of</span>
            Events
          </h2>
          <p className="label mt-6 text-lg">{EVENT.dateLabel}</p>
        </Reveal>

        <Reveal delay={120}>
          <ol className="border-t-2 border-forest">
            {items.map((s) => (
              <li key={s.label} className="flex items-baseline gap-6 border-b-2 border-forest py-5">
                <time className="label w-24 shrink-0 text-base tabular-nums">{s.time}</time>
                <span className="label text-base">{s.label}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
