'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'

const LINKS = [
  { href: '/#journey', label: 'Our Journey' },
  { href: '/#wedding', label: 'The Wedding' },
  { href: '/#takeoff', label: 'Takeoff Points' },
  { href: '/#schedule', label: 'Schedule' },
  { href: '/#faq', label: 'FAQs' },
  { href: '/photos', label: 'Event Photos' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { session, isAdmin, signOut, loading } = useAuth()
  const close = () => setOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-cream/15 bg-forest/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6" aria-label="Main">
        <Link href="/" onClick={close} className="heading text-xl text-cream">
          B <span className="script text-2xl normal-case text-sage">&amp;</span> G
        </Link>

        <button
          type="button"
          className="label min-h-11 rounded-full border border-cream/40 px-4 lg:hidden"
          aria-expanded={open}
          aria-controls="main-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>

        <div
          id="main-menu"
          className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-1 border-b border-cream/15 bg-forest px-4 pb-4 pt-2 lg:static lg:flex lg:flex-row lg:items-center lg:gap-6 lg:border-0 lg:bg-transparent lg:p-0`}
        >
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={close} className="label py-2 text-cream/80 hover:text-cream lg:py-0">
              {l.label}
            </Link>
          ))}

          <div className="mt-2 flex flex-wrap items-center gap-3 lg:mt-0">
            {loading ? null : session ? (
              <>
                {isAdmin && (
                  <Link href="/admin" onClick={close} className="label rounded-full border border-aqua px-4 py-2 text-aqua">
                    Admin
                  </Link>
                )}
                <Link href="/account" onClick={close} className="label rounded-full bg-cream px-4 py-2 text-forest">
                  My account
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    close()
                    signOut()
                  }}
                  className="label py-2 text-cream/70 hover:text-cream"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={close} className="label py-2 text-cream/80 hover:text-cream">
                  Log in
                </Link>
                <Link href="/register" onClick={close} className="label rounded-full bg-cream px-4 py-2 text-forest">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
