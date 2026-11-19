import Image from 'next/image'
import type { ImageSlot } from '@/lib/config/images'

/**
 * Fills its (positioned) parent with a photo from lib/config/images.ts.
 * The parent must be `relative` (or absolute) and have a size.
 */
export default function Photo({
  slot,
  sizes = '100vw',
  priority = false,
  decorative = false,
  className = '',
}: {
  slot: ImageSlot
  sizes?: string
  priority?: boolean
  /** Background images carry no meaning for screen readers. */
  decorative?: boolean
  className?: string
}) {
  return (
    <Image
      src={slot.src}
      alt={decorative ? '' : slot.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
      style={{ objectPosition: slot.position }}
    />
  )
}
