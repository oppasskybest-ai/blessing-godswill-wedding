import Image from 'next/image'
import type { Metadata } from 'next'
import ParallaxBg from '@/components/site/ParallaxBg'
import Reveal from '@/components/site/Reveal'
import { IMG } from '@/lib/config/images'
import { photoUrl } from '@/lib/data/photos'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase/client'
import type { EventPhoto } from '@/lib/types'

export const metadata: Metadata = { title: 'Event Photos' }
export const revalidate = 60

async function loadPhotos(): Promise<EventPhoto[]> {
  if (!isSupabaseConfigured) return []
  const { data } = await getSupabase().from('event_photos').select('*').order('created_at', { ascending: false })
  return (data as EventPhoto[]) ?? []
}

export default async function PhotosPage() {
  const photos = await loadPhotos()

  return (
    <main>
      {/* Banner: page-photos-header.jpg */}
      <ParallaxBg
        slot={IMG.photosHeader}
        strength={0.2}
        overlay="bg-gradient-to-b from-forest-deep/70 via-forest/45 to-forest/95"
        className="relative h-[52svh] min-h-[340px]"
        priority
      >
        <div className="flex h-full flex-col items-center justify-center px-6 pt-16 text-center">
          <p className="script text-5xl text-cream sm:text-7xl">Moments from</p>
          <h1 className="heading text-4xl text-cream sm:text-7xl">Our Day</h1>
          <p className="mt-4 max-w-xl text-cream/85">Pictures from the wedding. They are added after the ceremony, so check back within about 24 hours.</p>
        </div>
      </ParallaxBg>

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-14 sm:px-6">
        {photos.length === 0 ? (
          <div className="glass-dark rounded-3xl p-12 text-center">
            <p className="heading text-3xl text-cream">Coming soon</p>
            <p className="mt-3 text-cream/75">No photos yet. They will appear here after the wedding.</p>
          </div>
        ) : (
          <ul className="columns-2 gap-3 sm:columns-3 lg:columns-4">
            {photos.map((p, i) => (
              <li key={p.id} className="mb-3 break-inside-avoid">
                <Reveal variant="scale" delay={(i % 4) * 80}>
                  <a href={photoUrl(p.path)} target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-2xl">
                    <Image
                      src={photoUrl(p.path)}
                      alt={p.caption || 'Photo from the wedding'}
                      width={600}
                      height={800}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      loading="lazy"
                      className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </a>
                  {p.caption && <p className="mt-1 text-sm text-cream/70">{p.caption}</p>}
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
