'use client'

import { useRef } from 'react'
import Reveal from '@/components/site/Reveal'
import { useElementProgress } from '@/lib/hooks/useElementProgress'

/**
 * Vertical timeline. The dark line fills as you scroll past it, and each time slot slides in
 * from alternating sides. On phones everything sits on one side of the line.
 */
export default function ScheduleTimeline({ items }: { items: { time: string; label: string }[] }) {
  const ref = useRef<HTMLOListElement>(null)
  const progress = useElementProgress(ref)

  return (
    <div className="relative mt-16">
      {/* track + progress line */}
      <div aria-hidden="true" className="absolute bottom-0 left-5 top-0 w-px bg-forest/20 md:left-1/2" />
      <div
        aria-hidden="true"
        className="absolute left-5 top-0 w-px bg-forest md:left-1/2"
        style={{ height: `${progress * 100}%` }}
      />

      <ol ref={ref}>
        {items.map((item, i) => {
          const passed = progress >= (i + 0.35) / items.length
          const right = i % 2 === 1
          return (
            <li key={item.label} className="relative mb-12 pl-14 last:mb-0 md:mb-16 md:grid md:grid-cols-2 md:gap-24 md:pl-0">
              <span
                aria-hidden="true"
                className={`absolute left-5 top-4 size-4 -translate-x-1/2 rounded-full border-2 border-forest transition-colors duration-500 md:left-1/2 ${passed ? 'bg-forest' : 'bg-cream'}`}
              />
              <Reveal variant={right ? 'right' : 'left'} className={right ? 'md:col-start-2' : 'md:col-start-1 md:text-right'}>
                <time className="heading block text-4xl sm:text-6xl">{item.time}</time>
                <p className="label mt-2 text-base">{item.label}</p>
              </Reveal>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
