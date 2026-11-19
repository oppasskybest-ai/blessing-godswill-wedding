import { ImageResponse } from 'next/og'

// Link preview shown when the site is shared on WhatsApp, Facebook, etc.
export const alt = 'Blessing & Godswill, traditional marriage, 23 December 2026'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#3d513c',
          color: '#f3dbb9',
          fontFamily: 'Georgia, serif',
          border: '14px solid #f3dbb9',
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 8, textTransform: 'uppercase', opacity: 0.85 }}>
          Traditional Marriage
        </div>
        <div style={{ fontSize: 108, marginTop: 24, textTransform: 'uppercase', letterSpacing: 4 }}>Blessing</div>
        <div style={{ fontSize: 52, fontStyle: 'italic', color: '#afaf9b' }}>and</div>
        <div style={{ fontSize: 108, textTransform: 'uppercase', letterSpacing: 4 }}>Godswill</div>
        <div style={{ fontSize: 30, letterSpacing: 6, marginTop: 28, textTransform: 'uppercase' }}>
          December 23, 2026 · Odoro Aku, Uquo
        </div>
      </div>
    ),
    size
  )
}
