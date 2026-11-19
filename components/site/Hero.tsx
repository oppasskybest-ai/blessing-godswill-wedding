'use client'

import { useEffect, useRef, useState } from 'react'
import Botanical from '@/components/site/Botanical'
import Countdown from '@/components/site/Countdown'
import Button from '@/components/ui/Button'
import Photo from '@/components/ui/Photo'
import { IMG } from '@/lib/config/images'
import { EVENT, REGISTRATION_DEADLINE } from '@/lib/config/site'

const SLIDE_MS = 6500

/**
 * Full-screen opening: photos crossfade with a slow zoom, the names rise in line by line,
 * and an arch portrait floats on the right. Slide images are hero-slide-1..3.jpg.
 */
export default function Hero({ venueArea }: { venueArea: string }) {
  const slides = IMG.heroSlides
  const [active, setActive] = useState(0)
  const [previous, setPrevious] = useState<number | null>(null)
  const [ready, setReady] = useState(false)
  const current = useRef(0)

  useEffect(() => {
    setReady(true) // plays the entrance animation after the first paint
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      const next = (current.current + 1) % slides.length
      setPrevious(current.current)
      current.current = next
      setActive(next)
    }, SLIDE_MS)
    return () => clearInterval(id)
  }, [slides.length])

  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-forest-deep">
      {/* Background slideshow */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {slides.map((s, i) => (
          <div
            key={s.src}
            className={`absolute inset-0 transition-opacity duration-[1800ms] ease-in-out ${i === active ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className={`absolute inset-0 ${i === active || i === previous ? 'kenburns' : ''}`}>
              <Photo slot={s} priority={i === 0} decorative />
            </div>
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/75 via-forest/55 to-forest-deep/95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_40%,transparent_0%,rgb(46_63_45/0.55)_100%)]" />
      </div>

      <Botanical variant="branch" className="absolute -right-10 top-16 hidden w-[24rem] text-sage/35 md:block lg:w-[36rem] lg:text-sage/45" />

      <div
        className={`mx-auto grid min-h-[100svh] max-w-7xl items-center gap-10 px-5 pb-28 pt-32 sm:px-8 lg:grid-cols-[1.35fr_1fr] ${ready ? 'in' : ''}`}
      >
        <div>
          <p className="label fade-in text-sage" style={{ transitionDelay: '200ms' }}>
            Traditional marriage
          </p>

          <h1 className="mt-5">
            <span className="line-mask">
              <span className="line-inner heading block text-[clamp(2.6rem,12vw,7.5rem)] text-cream" style={{ transitionDelay: '350ms' }}>
                Blessing
              </span>
            </span>
            <span className="line-mask">
              <span className="line-inner script block pl-2 text-[clamp(2.4rem,6vw,4.2rem)] text-sage" style={{ transitionDelay: '500ms' }}>
                and
              </span>
            </span>
            <span className="line-mask">
              <span className="line-inner heading block text-[clamp(2.6rem,12vw,7.5rem)] text-cream sm:pl-14" style={{ transitionDelay: '650ms' }}>
                Godswill
              </span>
            </span>
          </h1>

          <p className="label fade-in mt-8 text-cream/90" style={{ transitionDelay: '900ms' }}>
            are celebrating their traditional marriage on
          </p>

          <div className="fade-in mt-5 flex flex-col gap-3 sm:flex-row sm:gap-8" style={{ transitionDelay: '1000ms' }}>
            <p className="label border-cream/40 text-lg text-cream sm:border-r sm:pr-8">{EVENT.dateShort}</p>
            <p className="label text-lg text-cream">{venueArea}</p>
          </div>

          <div className="fade-in mt-10" style={{ transitionDelay: '1150ms' }}>
            <Countdown />
          </div>

          <div className="fade-in mt-10 flex flex-wrap gap-3" style={{ transitionDelay: '1300ms' }}>
            <Button href="/register">Register to attend</Button>
            <Button href="/#wedding" variant="outline">
              Venue &amp; directions
            </Button>
          </div>
          {REGISTRATION_DEADLINE && (
            <p className="label fade-in mt-4 text-sage" style={{ transitionDelay: '1400ms' }}>
              Please register by {REGISTRATION_DEADLINE}
            </p>
          )}
        </div>

        {/* Floating arch portrait (hero-arch-portrait.jpg) */}
        <div className="fade-in hidden justify-self-center lg:block" style={{ transitionDelay: '800ms' }}>
          <div className="float">
            <div className="relative aspect-[3/4.2] w-[min(26vw,22rem)] rounded-t-full rounded-b-[2rem] border border-cream/60 p-2.5">
              <div className="relative h-full w-full overflow-hidden rounded-t-full rounded-b-[1.4rem]">
                <Photo slot={IMG.heroArch} sizes="26vw" priority />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        style={{ bottom: 'calc(var(--sheet) + 1rem)' }}
      >
        <span className="label text-[0.6rem] text-cream/70">Scroll</span>
        <span className="scrollcue block h-10 w-px bg-cream/80" />
      </div>
    </section>
  )
}
