'use client'

import Button from '@/components/ui/Button'
import { EVENT, SITE } from '@/lib/config/site'

function icsStamp(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/** Downloads an .ics file that opens in Apple, Google and Outlook calendars. No server needed. */
export default function AddToCalendar({ variant = 'outline' }: { variant?: 'outline' | 'dark' | 'solid' }) {
  function download() {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Blessing and Godswill//Wedding//EN',
      'BEGIN:VEVENT',
      `UID:blessing-godswill-2026-12-23@${new URL(SITE.url).hostname}`,
      `DTSTAMP:${icsStamp(new Date().toISOString())}`,
      `DTSTART:${icsStamp(EVENT.startISO)}`,
      `DTEND:${icsStamp(EVENT.endISO)}`,
      "SUMMARY:Blessing & Godswill's Traditional Marriage",
      `LOCATION:${EVENT.venueName}\\, ${EVENT.venueArea}`,
      'DESCRIPTION:Arrivals from 12:00 PM. Marriage ceremony at 1:00 PM.',
      'END:VEVENT',
      'END:VCALENDAR',
    ]
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'blessing-godswill-wedding.ics'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button variant={variant} onClick={download}>
      Add to calendar
    </Button>
  )
}
