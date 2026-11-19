/**
 * Single place for the wedding's public content.
 *
 * Search for "TODO(owner)" across the project to find every placeholder that
 * still needs real information from the owner (map pin, phone numbers, times).
 */

export const SITE = {
  coupleShort: 'Blessing & Godswill',
  bride: 'Blessing',
  groom: 'Godswill',
  title: 'Blessing & Godswill | Traditional Marriage, 23 December 2026',
  description:
    'Blessing and Godswill are celebrating their traditional marriage on 23 December 2026 at Odoro Aku, Uquo, Esit Eket LGA. Register to attend and join the bus.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
}

/** Ceremony starts 1:00 PM West Africa Time (UTC+1). */
export const EVENT = {
  dateLabel: 'December 23, 2026',
  dateShort: 'Dec. 23, 2026',
  startISO: '2026-12-23T13:00:00+01:00',
  endISO: '2026-12-23T18:00:00+01:00',
  venueName: "Late Elder Okon Jeremiah's compound",
  venueArea: 'Odoro Aku, Uquo, Esit Eket LGA',
}

/**
 * TODO(owner): replace with the exact Google Maps pin for the compound.
 * Until then this is a Google Maps *search* link, which already opens Maps (or
 * inDrive / any maps app) near Odoro Aku, Uquo. To get the exact link: open the
 * venue in Google Maps -> Share -> Copy link, then paste it below.
 */
export const VENUE_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Odoro+Aku+Uquo+Esit+Eket+Akwa+Ibom'

/** Shown wherever a real phone number is still missing. */
export const PLACEHOLDER_PHONE = '+234 000 000 0000'
/** TODO(owner): general contact for questions (shown in the footer). */
export const GENERAL_CONTACT = {
  name: 'Contact person (to be added)',
  phone: PLACEHOLDER_PHONE,
}

/** TODO(owner): RSVP / registration deadline, e.g. 'December 10, 2026'. Leave '' to hide. */
export const REGISTRATION_DEADLINE = ''

export const COLOR_SWATCHES = [
  { name: 'Aquamarine blue', hex: '#b1d4e0' },
  { name: 'Emerald green', hex: '#1f7a5c' },
  { name: 'Burgundy', hex: '#7a1f35' },
  { name: 'Peach', hex: '#f4b99a' },
]

export const SCHEDULE = [
  { time: '12:00 PM', label: 'Arrivals' },
  { time: '1:00 PM', label: 'Marriage Ceremony' },
  { time: '5:30 PM', label: 'Departure' },
  // The owner says the afterparty is for show only. Flip SHOW_AFTERPARTY to hide it.
  { time: '8:00 PM', label: 'Afterparty', optional: true },
]
export const SHOW_AFTERPARTY = true

export const FAQS = [
  {
    q: 'Is the venue wheelchair-accessible?',
    a: 'Yes, our venue is accessible by wheelchair. If you or any member of your party needs one, you may request one at the lobby.',
  },
  {
    q: 'What of security and safety of life?',
    // TODO(owner): say what is actually in place (security personnel, controlled entry, etc.).
    a: 'The safety of our guests is our utmost priority. We have taken all the necessary measures to ensure the safety of our guests before, during and after the ceremony.',
  },
  {
    q: 'Can we bring our phones out during the ceremony?',
    a: "Yes, you can use your phones during the ceremony. However, we've hired professional photographers and videographers to record our union. We encourage guests to record as many memories as they can!",
  },
  {
    q: 'How do I join the bus?',
    a: 'Register on this site, then choose your nearest takeoff point. Seats are limited, so each request is approved by the couple. Once approved, you will see the contact person and phone number for your takeoff point on your account page.',
  },
  {
    q: 'Where can I see the event photos?',
    a: 'Check the Event Photos page on this site after the ceremony. Pictures will be uploaded within about 24 hours.',
  },
]

export type PickupSeed = {
  slug: string
  name: string
  address: string
  pickup_time: string
  capacity: number
}

/**
 * Fallback copy of the four takeoff points, shown only if the database is not
 * connected yet. The database (supabase/seed.sql) is the source of truth.
 * TODO(owner): pickup times and capacity per bus.
 */
export const PICKUPS_FALLBACK: PickupSeed[] = [
  { slug: 'ini', name: 'Ini LGA', address: 'Mentors House, opp. Sec. Comm. Sch.', pickup_time: 'TBA', capacity: 36 },
  { slug: 'ikot-ekpene', name: 'Ikot Ekpene', address: 'St. Vincent Plaza, by Uyo Rd, Ibiakpan Junction', pickup_time: 'TBA', capacity: 36 },
  { slug: 'ikono', name: 'Ikono', address: 'Tarbas Junction, cenotaph', pickup_time: 'TBA', capacity: 36 },
  { slug: 'uyo', name: 'Uyo', address: 'Ekom Iman Junction', pickup_time: 'TBA', capacity: 36 },
]

/**
 * Portrait photos for the Journey section. Drop the real files into
 * /public/images/ and set `src` (e.g. '/images/couple.jpg'). With src = null a
 * monogram placeholder is shown.
 * TODO(owner): add the three portraits from the Canva design.
 */
export const PORTRAITS: { src: string | null; alt: string; initials: string }[] = [
  { src: null, alt: 'Blessing and Godswill together', initials: 'B & G' },
  { src: null, alt: 'Godswill', initials: 'G' },
  { src: null, alt: 'Blessing', initials: 'B' },
]
