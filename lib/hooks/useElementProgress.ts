'use client'

import { useEffect, useState, type RefObject } from 'react'

/**
 * 0 -> 1 as an element scrolls through the middle of the screen.
 * 0 when its top is at 80% of the viewport height, 1 when its bottom reaches 50%.
 */
export function useElementProgress(ref: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0

    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.8
      const end = vh * 0.5
      const raw = (start - rect.top) / (rect.height + start - end)
      const next = reduce ? 1 : Math.min(1, Math.max(0, raw))
      setProgress((prev) => (Math.abs(prev - next) < 0.003 ? prev : next))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [ref])

  return progress
}
