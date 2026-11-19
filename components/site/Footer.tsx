import Button from '@/components/ui/Button'
import Botanical from '@/components/site/Botanical'
import { EVENT, GENERAL_CONTACT, SITE } from '@/lib/config/site'

export default function Footer() {
  const shareText = encodeURIComponent(
    `You are invited to Blessing & Godswill's traditional marriage on ${EVENT.dateLabel}. Details and registration: ${SITE.url}`
  )
  return (
    <footer className="relative overflow-hidden border-t border-cream/20 bg-forest-deep px-4 py-16 text-center sm:px-6">
      <Botanical className="mx-auto mb-6 w-48 text-sage/70" />
      <p className="heading text-3xl text-cream sm:text-4xl">
        Blessing <span className="script text-4xl normal-case text-sage">and</span> Godswill
      </p>
      <p className="label mt-3 text-cream/80">{EVENT.dateLabel}</p>
      <p className="mt-1 text-cream/70">{EVENT.venueArea}</p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href={`https://wa.me/?text=${shareText}`} variant="outline">
          Share on WhatsApp
        </Button>
        <Button href="/register">Register</Button>
      </div>

      <p className="mt-10 text-sm text-cream/60">
        Questions? {GENERAL_CONTACT.name}:{' '}
        {/* TODO(owner): real general contact number (lib/config/site.ts) */}
        <a href={`tel:${GENERAL_CONTACT.phone.replace(/\s/g, '')}`} className="underline underline-offset-4">
          {GENERAL_CONTACT.phone}
        </a>
      </p>
    </footer>
  )
}
