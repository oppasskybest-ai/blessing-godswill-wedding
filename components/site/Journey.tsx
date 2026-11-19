import Botanical from '@/components/site/Botanical'
import GalleryMarquee from '@/components/site/GalleryMarquee'
import Reveal from '@/components/site/Reveal'
import Photo from '@/components/ui/Photo'
import { IMG } from '@/lib/config/images'

const MILESTONES = [
  { year: '2018', title: 'We met', text: 'At the University of Uyo main gate: “I am not Joy, I am Blessing.”' },
  { year: '2024', title: 'Dreams in motion', text: 'She believed in his dreams, and together they brought them to life.' },
  { year: '2026', title: 'Our traditional marriage', text: 'A celebration of love, belief, commitment, and steadfastness.' },
]

// Slightly different heights make the three arches feel staggered, not stamped out.
const ARCH_RATIOS = ['aspect-[3/4.3]', 'aspect-[3/5]', 'aspect-[3/4.3]']

export default function Journey() {
  const gallery = IMG.journeyGallery
  return (
    <section id="journey" className="sheet section-pad overflow-hidden bg-cream text-forest">
      <Botanical variant="corner" className="absolute -left-20 top-16 hidden w-80 text-sage/60 md:block" />
      <Botanical variant="corner" flip className="absolute -right-24 top-[38%] hidden w-80 text-sage/50 lg:block" />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="text-center">
          <Reveal>
            <p className="script text-6xl text-sage sm:text-8xl">Together</p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="heading -mt-3 text-5xl sm:-mt-6 sm:text-8xl">Our Journey</h2>
          </Reveal>
        </div>

        <Reveal className="mx-auto mt-10 max-w-2xl space-y-6 text-center text-lg text-forest/90">
          <p>
            Our story began in 2018 at the University of Uyo main gate, where Mr. Godswill mistook Miss Blessing for her
            twin sister, Joy. With a beautiful smile, she said, “I am not Joy, I am Blessing.”
            <br />
            And she truly has been a blessing ever since.
          </p>
          <p>
            In 2024, she believed in his dreams and they worked together to bring them to life. Today is a dream come
            true: a celebration of love, belief, commitment, and steadfastness.
          </p>
        </Reveal>

        {/* Milestones */}
        <ol className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-6">
          {MILESTONES.map((m, i) => (
            <li key={m.year}>
              <Reveal delay={i * 130}>
                <div className="border-t border-forest/40 pt-5">
                  <p className="heading text-6xl text-forest/90 sm:text-7xl">{m.year}</p>
                  <p className="label mt-3 text-forest">{m.title}</p>
                  <p className="mt-2 text-forest/80">{m.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* Arch portraits: journey-portrait-couple / groom / bride */}
        <div className="mt-20 grid grid-cols-3 items-end gap-3 sm:gap-8">
          {IMG.journeyPortraits.map((p, i) => (
            <Reveal key={p.src} variant="clip" delay={i * 180}>
              <div className="group rounded-t-full rounded-b-[2.4rem] border border-forest/40 p-1.5 sm:p-2.5">
                <div className={`relative ${ARCH_RATIOS[i]} overflow-hidden rounded-t-full rounded-b-[1.8rem]`}>
                  <Photo slot={p} sizes="(min-width: 1024px) 30vw, 33vw" className="transition-transform duration-[1600ms] ease-out group-hover:scale-110" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Two rows of photos gliding in opposite directions: journey-gallery-01..16 */}
      <div className="relative mt-24 space-y-5" role="region" aria-label="Photo gallery">
        <GalleryMarquee items={gallery.slice(0, 8)} seconds={75} />
        <GalleryMarquee items={gallery.slice(8, 16)} seconds={85} reverse offset={2} />
      </div>
    </section>
  )
}
