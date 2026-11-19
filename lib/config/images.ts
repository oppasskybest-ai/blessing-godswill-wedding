/**
 * Every picture on the site, by role.
 *
 * To swap a placeholder for a real photo: keep the file name, overwrite the file in /public/images/.
 * The full list (with recommended sizes) is in public/images/README.md.
 *
 * `position` is the CSS object-position used when a photo is cropped to fit its shape:
 * '50% 25%' means "centre horizontally, look a quarter of the way down". Lower the second number
 * to show more of the top of the photo (heads), raise it to show more of the bottom.
 */
export type ImageSlot = { src: string; alt: string; position: string }

const slot = (file: string, alt: string, position = '50% 28%'): ImageSlot => ({
  src: `/images/${file}`,
  alt,
  position,
})

const pad = (n: number) => String(n).padStart(2, '0')

export const IMG = {
  // Home hero (full-screen slideshow + floating arch portrait)
  heroSlides: [
    slot('hero-slide-1.jpg', 'Blessing and Godswill in traditional attire', '50% 22%'),
    slot('hero-slide-2.jpg', 'Blessing and Godswill smiling together', '50% 22%'),
    slot('hero-slide-3.jpg', 'Blessing and Godswill, wedding portrait', '50% 22%'),
  ],
  heroArch: slot('hero-arch-portrait.jpg', 'Blessing and Godswill', '50% 20%'),

  // Our Journey
  journeyPortraits: [
    slot('journey-portrait-couple.jpg', 'Blessing and Godswill together', '50% 22%'),
    slot('journey-portrait-groom.jpg', 'Godswill', '50% 20%'),
    slot('journey-portrait-bride.jpg', 'Blessing', '50% 20%'),
  ],
  journeyGallery: Array.from({ length: 16 }, (_, i) =>
    slot(`journey-gallery-${pad(i + 1)}.jpg`, `Blessing and Godswill, photo ${i + 1}`, '50% 25%')
  ),

  // Full-width scrolling photo bands
  bands: [
    slot('band-1-quote.jpg', '', '50% 30%'),
    slot('band-2-savethedate.jpg', '', '50% 30%'),
    slot('band-3-cta.jpg', '', '50% 30%'),
  ],

  // The Wedding
  wedding: {
    venue: slot('wedding-venue.jpg', 'The wedding venue', '50% 40%'),
    transport: slot('wedding-transport.jpg', 'Bus transport for guests', '50% 40%'),
    attire: slot('wedding-attire.jpg', 'Guests in traditional attire', '50% 30%'),
  },
  attireInspo: [1, 2, 3, 4].map((n) => slot(`attire-inspo-${n}.jpg`, `Attire inspiration ${n}`, '50% 25%')),

  // Section backgrounds (decorative, always under an overlay)
  bgTakeoff: slot('bg-takeoff.jpg', '', '50% 35%'),
  bgSchedule: slot('bg-schedule.jpg', '', '50% 35%'),
  bgFaq: slot('bg-faq.jpg', '', '50% 35%'),
  bgFooter: slot('bg-footer.jpg', '', '50% 30%'),

  // Other pages
  photosHeader: slot('page-photos-header.jpg', '', '50% 30%'),
  registerSide: slot('page-register-side.jpg', 'Blessing and Godswill', '50% 20%'),
  loginSide: slot('page-login-side.jpg', 'Blessing and Godswill', '50% 20%'),
}
