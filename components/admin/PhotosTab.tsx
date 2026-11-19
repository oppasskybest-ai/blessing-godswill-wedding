'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { photoUrl } from '@/lib/data/photos'
import { getSupabase } from '@/lib/supabase/client'
import type { EventPhoto } from '@/lib/types'

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB per photo (same limit as richards-site upload route)
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

/** Upload event photos in bulk straight to Supabase Storage. Only admins pass the storage policy. */
export default function PhotosTab() {
  const { profile } = useAuth()
  const [photos, setPhotos] = useState<EventPhoto[]>([])
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const { data } = await getSupabase().from('event_photos').select('*').order('created_at', { ascending: false })
    setPhotos((data as EventPhoto[]) ?? [])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function upload(files: FileList | null) {
    if (!files?.length) return
    setBusy(true)
    const sb = getSupabase()
    let done = 0
    const problems: string[] = []

    for (const file of Array.from(files)) {
      setStatus(`Uploading ${done + 1} of ${files.length}…`)
      if (!ALLOWED.includes(file.type)) {
        problems.push(`${file.name}: only JPG, PNG or WebP`)
        continue
      }
      if (file.size > MAX_BYTES) {
        problems.push(`${file.name}: larger than 10 MB`)
        continue
      }
      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const up = await sb.storage.from('event-photos').upload(path, file, { contentType: file.type })
      if (up.error) {
        problems.push(`${file.name}: upload failed`)
        continue
      }
      const ins = await sb.from('event_photos').insert({ path, uploaded_by: profile?.id })
      if (ins.error) {
        await sb.storage.from('event-photos').remove([path])
        problems.push(`${file.name}: could not be saved`)
        continue
      }
      done++
    }

    setStatus(`${done} uploaded.${problems.length ? ` Skipped: ${problems.join('; ')}` : ''}`)
    if (input.current) input.current.value = ''
    setBusy(false)
    load()
  }

  async function remove(p: EventPhoto) {
    if (!window.confirm('Delete this photo?')) return
    const sb = getSupabase()
    await sb.storage.from('event-photos').remove([p.path])
    await sb.from('event_photos').delete().eq('id', p.id)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-dashed border-cream/40 p-6">
        <label className="label block text-cream" htmlFor="photo-input">
          Add event photos
        </label>
        <p className="mt-1 text-sm text-cream/70">JPG, PNG or WebP, up to 10 MB each. You can pick many at once.</p>
        <input
          ref={input}
          id="photo-input"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={busy}
          onChange={(e) => upload(e.target.files)}
          className="mt-4 block w-full text-cream file:mr-4 file:min-h-11 file:cursor-pointer file:rounded-full file:border-0 file:bg-cream file:px-5 file:text-forest"
        />
        {status && (
          <p role="status" className="mt-3 text-aqua">
            {status}
          </p>
        )}
      </div>

      <p className="text-cream/70">{photos.length} photos published.</p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {photos.map((p) => (
          <li key={p.id} className="group relative aspect-square overflow-hidden rounded-xl bg-forest-deep">
            <Image src={photoUrl(p.path)} alt="" fill sizes="(min-width: 1024px) 16vw, 25vw" className="object-cover" />
            <button
              onClick={() => remove(p)}
              className="label absolute bottom-2 right-2 min-h-9 cursor-pointer rounded-full bg-forest/90 px-3 text-xs"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
