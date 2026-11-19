import Botanical from '@/components/site/Botanical'
import Reveal from '@/components/site/Reveal'
import ScheduleTimeline from '@/components/site/ScheduleTimeline'
import Photo from '@/components/ui/Photo'
import { IMG } from '@/lib/config/images'
import { EVENT, SCHEDULE, SHOW_AFTERPARTY } from '@/lib/config/site'

export default function Schedule() {
  const items = SCHEDULE.filter((s) => SHOW_AFTERPARTY || !s.optional)
  return (
    <section id="schedule" className="sheet section-pad overflow-hidden bg-cream text-forest">
      {/* very faint photo texture (bg-schedule.jpg) */}
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.1] mix-blend-multiply">
        <Photo slot={IMG.bgSchedule} decorative />
      </div>
      <Botanical variant="corner" className="absolute -left-16 top-24 hidden w-72 text-sage/70 md:block" />
      <Botanical variant="corner" flip className="absolute -right-16 bottom-32 hidden w-72 text-sage/70 md:block" />

      <div className="relative mx-auto max-w-4xl px-5">
        {/* Stacked on purpose: the heading never shares a row with the timeline, so nothing can overlap. */}
        <Reveal className="text-center">
          <h2 className="heading text-5xl sm:text-8xl">Schedule</h2>
          <p className="script -mt-1 text-5xl text-forest/80 sm:text-7xl">of Events</p>
          <p className="label mt-5 text-lg">{EVENT.dateLabel}</p>
        </Reveal>

        <ScheduleTimeline items={items} />
      </div>
    </section>
  )
}
