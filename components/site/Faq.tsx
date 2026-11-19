'use client'

import { useState } from 'react'
import ParallaxBg from '@/components/site/ParallaxBg'
import Reveal from '@/components/site/Reveal'
import { IMG } from '@/lib/config/images'
import { FAQS } from '@/lib/config/site'

/** Accordion: the answer height animates smoothly (grid-template-rows 0fr -> 1fr). One open at a time. */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="sheet section-pad overflow-hidden bg-forest text-cream">
      {/* bg-faq.jpg under a heavy overlay */}
      <ParallaxBg slot={IMG.bgFaq} strength={0.1} overlay="bg-forest/90" className="absolute inset-0" />

      <div className="relative mx-auto max-w-3xl px-5">
        <Reveal>
          <p className="script text-center text-5xl text-sage sm:text-6xl">Good to know</p>
          <h2 className="heading -mt-1 text-center text-5xl sm:text-8xl">FAQs</h2>
        </Reveal>

        <div className="mt-12 space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <Reveal key={f.q} delay={i * 70}>
                <div className={`glass-dark rounded-2xl transition-colors duration-500 ${isOpen ? 'border-cream/60' : ''}`}>
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="label flex min-h-14 w-full cursor-pointer items-center justify-between gap-4 px-6 py-4 text-left text-base text-cream"
                    >
                      {f.q}
                      <span aria-hidden="true" className={`text-2xl leading-none transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`}>
                        +
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-a-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-lg text-cream/85">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
