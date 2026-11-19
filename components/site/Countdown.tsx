'use client'

import { useEffect, useState } from 'react'
import { EVENT } from '@/lib/config/site'

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

export default function Countdown() {
  // Start as null so the server and first client render match (avoids a hydration mismatch).
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const target = new Date(EVENT.startISO).getTime()
  const done = now !== null && now >= target
  const t = parts(now === null ? 0 : target - now)

  if (done) {
    return <p className="heading text-3xl text-cream">Today is the day!</p>
  }

  const cells: [string, number][] = [
    ['Days', t.days],
    ['Hours', t.hours],
    ['Minutes', t.minutes],
    ['Seconds', t.seconds],
  ]

  return (
    <div role="timer" aria-label="Countdown to the ceremony" className="flex gap-2.5 sm:gap-4">
      {cells.map(([label, value]) => (
        <div key={label} className="glass-tile min-w-[4.2rem] rounded-2xl px-3 py-3 text-center sm:min-w-24 sm:px-4 sm:py-4">
          <div className="heading text-3xl tabular-nums text-cream sm:text-5xl">
            {now === null ? '--' : String(value).padStart(2, '0')}
          </div>
          <div className="label mt-1 text-[0.6rem] text-cream/70 sm:text-[0.65rem]">{label}</div>
        </div>
      ))}
    </div>
  )
}
