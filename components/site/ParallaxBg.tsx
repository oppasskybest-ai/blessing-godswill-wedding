'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Photo from '@/components/ui/Photo'
import type { ImageSlot } from '@/lib/config/images'

/**
 * A photo that drifts slower than the page as you scroll (parallax), with an optional colour overlay
 * and content on top. The caller sets size and position through `className`, e.g.
 *   className="relative h-[70svh]"   or   className="absolute inset-0"
 */
export default function ParallaxBg({
  slot,
  strength = 0.18,
  overlay = '',
  className = '',
  sizes = '100vw',
  priority = false,
  children,
}: {
  slot: ImageSlot
  /** How far the photo travels, as a fraction of the box height (0.1 gentle, 0.3 strong). */
  strength?: number
  overlay?: string
  className?: string
  sizes?: string
  priority?: boolean
  children?: ReactNode
}) {
  const box = useRef<HTMLDivElement>(null)
  const layer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = box.current
    const moving = layer.current
    if (!el || !moving) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let visible = false

    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // +1 when the box is far below the middle of the screen, -1 when far above.
      const p = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2)
      moving.style.transform = `translate3d(0, ${(-p * strength * rect.height).toFixed(1)}px, 0)`
    }
    const onScroll = () => {
      if (visible && !raf) raf = requestAnimationFrame(update)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) onScroll()
      },
      { rootMargin: '25% 0px' }
    )
    observer.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [strength])

  return (
    <div ref={box} className={`isolate overflow-hidden ${className}`}>
      {/* Taller than the box so it never shows an edge while it moves. */}
      <div
        ref={layer}
        className="absolute inset-x-0 will-change-transform"
        style={{ top: `${-strength * 100}%`, bottom: `${-strength * 100}%` }}
      >
        <Photo slot={slot} sizes={sizes} priority={priority} decorative />
      </div>
      {overlay && <div className={`absolute inset-0 ${overlay}`} />}
      {children && <div className="relative z-10 h-full">{children}</div>}
    </div>
  )
}
