import Reveal from '@/components/site/Reveal'
import { FAQS } from '@/lib/config/site'

export default function Faq() {
  return (
    <section id="faq" className="bg-forest px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <h2 className="heading text-center text-5xl text-cream sm:text-7xl">FAQs</h2>
        </Reveal>

        <div className="mt-12 divide-y divide-cream/20 border-y border-cream/20">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="label flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-base text-cream">
                {f.q}
                <span aria-hidden className="text-2xl leading-none transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-lg text-cream/85">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
