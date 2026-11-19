'use client'

import { useInView } from '@/lib/hooks/useInView'

/**
 * Hand-inked style flowers and leaves. The art is in /public/botanical/*.svg (original drawings,
 * made for this project). It draws itself in from left to right when it scrolls into view, then
 * sways very gently. Colour it with a text colour class, e.g. className="text-sage/60".
 *
 *   branch: long flowering branch (1000 x 560)
 *   corner: two stems that grow out of a corner (1 x 1)
 *   rose:   a single rose bloom with leaves (500 x 540)
 */
const ASPECT = { branch: '1000 / 560', corner: '1 / 1', rose: '500 / 540' } as const

export default function Botanical({
  variant = 'branch',
  className = '',
  flip = false,
  sway = true,
}: {
  variant?: keyof typeof ASPECT
  className?: string
  /** Mirror left-right so two copies do not look identical. */
  flip?: boolean
  sway?: boolean
}) {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.1 })
  const mask = `url(/botanical/${variant}.svg)`

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none block ${className}`}
      style={{ aspectRatio: ASPECT[variant], transform: flip ? 'scaleX(-1)' : undefined }}
    >
      <span
        className={`botanical ${sway ? 'botanical-sway' : ''} ${inView ? 'botanical-in' : ''}`}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      />
    </span>
  )
}
