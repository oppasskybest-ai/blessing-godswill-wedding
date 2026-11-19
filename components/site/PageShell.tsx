import type { ReactNode } from 'react'

/** Shared frame for the guest pages (register, login, account, photos). */
export default function PageShell({
  title,
  intro,
  wide = false,
  children,
}: {
  title: string
  intro?: string
  wide?: boolean
  children: ReactNode
}) {
  return (
    <main className="min-h-[calc(100vh-4rem)] px-4 pb-24 pt-14 sm:px-6">
      <div className={`mx-auto ${wide ? 'max-w-6xl' : 'max-w-xl'}`}>
        <h1 className="heading text-4xl text-cream sm:text-6xl">{title}</h1>
        {intro && <p className="mt-4 text-lg text-cream/80">{intro}</p>}
        <div className="mt-10">{children}</div>
      </div>
    </main>
  )
}
