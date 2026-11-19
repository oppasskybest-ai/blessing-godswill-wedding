import type { CSSProperties } from 'react'
import Photo from '@/components/ui/Photo'
import type { ImageSlot } from '@/lib/config/images'

// Alternating frame shapes so a row never looks like a plain strip of rectangles.
const SHAPES = [
  'h-72 w-52 rounded-t-full rounded-b-3xl', // tall arch
  'h-64 w-72 rounded-3xl', // wide rounded
  'h-80 w-56 rounded-full', // tall oval
  'h-60 w-60 rounded-[2.5rem]', // soft square
  'h-72 w-60 rounded-t-3xl rounded-b-full', // upside-down arch
]

/**
 * One row of photos that glides sideways forever. The list is shown twice so the loop is seamless;
 * the second copy is hidden from screen readers. Hovering pauses it.
 */
export default function GalleryMarquee({
  items,
  reverse = false,
  seconds = 70,
  offset = 0,
}: {
  items: ImageSlot[]
  reverse?: boolean
  seconds?: number
  /** Shifts which shape each photo gets, so two rows do not match. */
  offset?: number
}) {
  const loop = [...items, ...items]
  return (
    <div className={`marquee overflow-hidden ${reverse ? 'marquee-reverse' : ''}`}>
      <ul className="marquee-track" style={{ '--dur': `${seconds}s` } as CSSProperties}>
        {loop.map((slot, i) => (
          <li
            key={`${slot.src}-${i}`}
            aria-hidden={i >= items.length}
            className={`group relative mr-5 shrink-0 overflow-hidden border border-forest/40 shadow-[0_24px_40px_-24px_rgba(46,63,45,0.6)] ${SHAPES[(i + offset) % SHAPES.length]}`}
          >
            <Photo
              slot={slot}
              sizes="300px"
              className="transition-transform duration-[1400ms] ease-out group-hover:scale-110"
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
