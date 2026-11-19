import type { ReactNode } from 'react'
import ParallaxBg from '@/components/site/ParallaxBg'
import type { ImageSlot } from '@/lib/config/images'

/** Full-width photo that scrolls slower than the page, with centred text on top. */
export default function PhotoBand({ slot, children }: { slot: ImageSlot; children: ReactNode }) {
  return (
    <ParallaxBg
      slot={slot}
      strength={0.22}
      overlay="bg-gradient-to-b from-forest-deep/60 via-forest/35 to-forest-deep/75"
      className="relative h-[75svh] min-h-[460px]"
    >
      {/* extra bottom padding: the next section slides over the last few rem of the band */}
      <div className="flex h-full flex-col items-center justify-center px-6 pb-[var(--sheet)] text-center">{children}</div>
    </ParallaxBg>
  )
}
