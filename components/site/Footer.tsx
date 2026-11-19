import Botanical from '@/components/site/Botanical'
import ParallaxBg from '@/components/site/ParallaxBg'
import Button from '@/components/ui/Button'
import { IMG } from '@/lib/config/images'
import { EVENT, SITE } from '@/lib/config/site'
import type { SiteSettings } from '@/lib/data/settings'

export default function Footer({ settings }: { settings: SiteSettings }) {
  const shareText = encodeURIComponent(
    `You are invited to Blessing & Godswill's traditional marriage on ${EVENT.dateLabel}. Details and registration: ${SITE.url}`
  )
  return (
    <footer className="sheet overflow-hidden bg-forest-deep px-5 pb-14 pt-24 text-center text-cream">
      {/* bg-footer.jpg under a dark overlay */}
      <ParallaxBg slot={IMG.bgFooter} strength={0.1} overlay="bg-forest-deep/88" className="absolute inset-0" />

      <div className="relative">
        <Botanical variant="rose" className="mx-auto mb-6 w-36 text-sage/70" sway={false} />
        <p className="heading text-3xl sm:text-5xl">
          Blessing <span className="script text-4xl normal-case text-sage sm:text-6xl">and</span> Godswill
        </p>
        <p className="label mt-4 text-cream/80">{EVENT.dateLabel}</p>
        <p className="mt-1 text-cream/70">{settings.venue_area}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href={`https://wa.me/?text=${shareText}`} variant="outline">
            Share on WhatsApp
          </Button>
          <Button href="/photos" variant="outline">
            Event photos
          </Button>
          <Button href="/register">Register</Button>
        </div>

        <p className="mt-10 text-sm text-cream/60">
          Questions? {settings.contact_name}:{' '}
          {/* Editable in Admin -> Venue */}
          <a href={`tel:${settings.contact_phone.replace(/\s/g, '')}`} className="underline underline-offset-4">
            {settings.contact_phone}
          </a>
        </p>

        <p className="mt-10 border-t border-cream/15 pt-6 text-xs text-cream/50">
          Created &amp; maintained by{' '}
          <a
            href="https://opeyemijohn.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Opeyemi John (opens his website)"
            className="label font-semibold text-cream/80 underline underline-offset-4 hover:text-cream"
          >
            OJ
          </a>
        </p>
      </div>
    </footer>
  )
}
