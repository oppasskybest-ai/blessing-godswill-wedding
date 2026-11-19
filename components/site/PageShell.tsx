import type { ReactNode } from 'react'
import Botanical from '@/components/site/Botanical'
import Photo from '@/components/ui/Photo'
import type { ImageSlot } from '@/lib/config/images'

/**
 * Shared frame for the guest pages (register, login, account, photos, admin).
 * Pass `image` to show a tall arch photo beside the content on large screens.
 */
export default function PageShell({
  title,
  intro,
  wide = false,
  image,
  children,
}: {
  title: string
  intro?: string
  wide?: boolean
  image?: ImageSlot
  children: ReactNode
}) {
  const heading = (
    <>
      <h1 className="heading text-4xl text-cream sm:text-6xl">{title}</h1>
      {intro && <p className="mt-4 text-lg text-cream/80">{intro}</p>}
      <div className="mt-10">{children}</div>
    </>
  )

  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-24 pt-28 sm:px-6">
      <Botanical variant="corner" className="absolute -left-24 bottom-0 hidden w-80 text-sage/25 lg:block" />

      {image ? (
        <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:justify-between">
          <div>{heading}</div>
          <aside className="hidden lg:block">
            <div className="sticky top-28 mx-auto w-full max-w-md rounded-t-full rounded-b-[2.5rem] border border-cream/40 p-3">
              <div className="relative aspect-[3/4.4] overflow-hidden rounded-t-full rounded-b-[2rem]">
                <Photo slot={image} sizes="30vw" priority />
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <div className={`relative mx-auto ${wide ? 'max-w-6xl' : 'max-w-xl'}`}>{heading}</div>
      )}
    </main>
  )
}
