import type { Metadata, Viewport } from 'next'
import { Bodoni_Moda, Jost, Pinyon_Script } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/lib/auth/AuthProvider'
import { SITE } from '@/lib/config/site'
import Navbar from '@/components/site/Navbar'
import ScrollProgress from '@/components/site/ScrollProgress'

const bodoni = Bodoni_Moda({ subsets: ['latin'], variable: '--font-bodoni', display: 'swap' })
const pinyon = Pinyon_Script({ subsets: ['latin'], weight: '400', variable: '--font-pinyon', display: 'swap' })
const jost = Jost({ subsets: ['latin'], variable: '--font-jost', display: 'swap' })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3d513c',
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s | ${SITE.coupleShort}` },
  description: SITE.description,
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.coupleShort,
    type: 'website',
    locale: 'en_NG',
  },
  twitter: { card: 'summary_large_image', title: SITE.title, description: SITE.description },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${bodoni.variable} ${pinyon.variable} ${jost.variable}`}>
      <body>
        <ScrollProgress />
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
