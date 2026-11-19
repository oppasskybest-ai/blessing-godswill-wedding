'use client'

import type { ReactNode } from 'react'
import { useInView } from '@/lib/hooks/useInView'

type Variant = 'up' | 'left' | 'right' | 'scale' | 'clip'

/** Animates its children in when they scroll into view. Motion styles live in app/globals.css. */
export default function Reveal({
  children,
  delay = 0,
  variant = 'up',
  className = '',
}: {
  children: ReactNode
  delay?: number
  variant?: Variant
  className?: string
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.12 })

  return (
    <div
      ref={ref}
      className={`reveal reveal-${variant} ${inView ? 'visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
