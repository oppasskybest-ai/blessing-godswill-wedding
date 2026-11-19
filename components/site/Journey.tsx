import Image from 'next/image'
import Reveal from '@/components/site/Reveal'
import { PORTRAITS } from '@/lib/config/site'

export default function Journey() {
  return (
    <section id="journey" className="bg-cream px-4 py-20 text-forest sm:px-6">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="grid grid-cols-3 gap-3 sm:gap-8">
            {PORTRAITS.map((p, i) => (
              <div
                key={i}
                className="arch relative aspect-[3/4.2] border border-forest/60 bg-forest/10"
                style={{ marginTop: i === 1 ? '1.5rem' : 0 }}
              >
                {p.src ? (
                  <Image src={p.src} alt={p.alt} fill sizes="(min-width: 640px) 30vw, 33vw" className="object-cover" />
                ) : (
                  <div role="img" aria-label={p.alt} className="heading flex h-full w-full items-center justify-center text-2xl text-forest/50 sm:text-4xl">
                    {p.initials}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="mx-auto mt-20 max-w-2xl text-center">
        <Reveal>
          <p className="script text-6xl text-sage sm:text-7xl" aria-hidden="true">
            Together
          </p>
          <h2 className="heading -mt-3 text-4xl text-forest sm:text-6xl">Our Journey</h2>
          <div className="mt-8 space-y-6 text-lg text-forest/90">
            <p>
              Our story began in 2018 at the University of Uyo main gate, where Mr. Godswill mistook Miss Blessing for
              her twin sister, Joy. With a beautiful smile, she said, “I am not Joy, I am Blessing.”
              <br />
              And she truly has been a blessing ever since.
            </p>
            <p>
              In 2024, she believed in his dreams and they worked together to bring them to life. Today is a dream come
              true: a celebration of love, belief, commitment, and steadfastness.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
