'use client'

import { useEffect, useState } from 'react'
import { mapEmbedSrc } from '@/lib/maps'

/** Live preview of the pasted map link (updates a moment after typing stops). */
export default function MapPreview({ link, fallbackQuery, title }: { link: string; fallbackQuery: string; title: string }) {
  const [state, setState] = useState({ link, fallbackQuery })
  useEffect(() => {
    const id = setTimeout(() => setState({ link, fallbackQuery }), 600)
    return () => clearTimeout(id)
  }, [link, fallbackQuery])

  const { src, exact } = mapEmbedSrc(state.link, state.fallbackQuery)
  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-cream/25">
        <iframe
          title={`Map preview: ${title}`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-56 w-full border-0 bg-forest-deep"
        />
      </div>
      <p className="mt-2 text-xs text-cream/60">
        {exact
          ? 'Preview of the pasted pin.'
          : 'Preview is a search of the address. Short links (maps.app.goo.gl) cannot be previewed exactly, but guests who tap the button still go to your exact pin.'}
      </p>
    </div>
  )
}
