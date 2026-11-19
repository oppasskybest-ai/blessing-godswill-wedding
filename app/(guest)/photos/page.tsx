import Image from 'next/image'
import type { Metadata } from 'next'
import PageShell from '@/components/site/PageShell'
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
    <PageShell title="Event Photos" intro="Pictures from the day. They are added after the ceremony, so check back within about 24 hours." wide>
      {photos.length === 0 ? (
        <div className="rounded-2xl border border-cream/20 p-10 text-center">
          <p className="heading text-3xl text-cream">Coming soon</p>
          <p className="mt-3 text-cream/75">No photos yet. They will appear here after the wedding.</p>
        </div>
      ) : (
        <ul className="columns-2 gap-3 sm:columns-3 lg:columns-4">
          {photos.map((p) => (
            <li key={p.id} className="mb-3 break-inside-avoid">
              <a href={photoUrl(p.path)} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-xl">
                <Image
                  src={photoUrl(p.path)}
                  alt={p.caption || 'Photo from the wedding'}
                  width={600}
                  height={800}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  loading="lazy"
                  className="h-auto w-full object-cover"
                />
              </a>
              {p.caption && <p className="mt-1 text-sm text-cream/70">{p.caption}</p>}
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  )
}
