import type { Metadata } from 'next'
import { Inter, Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { PersistentPlayer } from '@/components/media/PersistentPlayer'
import { Toaster } from 'sonner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  style: ['italic', 'normal'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ggcc.church'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | Grace for Greatness Christian Centre',
    default: 'Grace for Greatness Christian Centre (GGCC)',
  },
  description:
    'Grace for Greatness Christian Centre — a global church community rooted in faith, serving the world with love, purpose, and the transforming power of the Gospel.',
  keywords: [
    'GGCC',
    'Grace for Greatness Christian Centre',
    'church',
    'sermons',
    'worship',
    'prayer',
    'community',
    'global ministry',
  ],
  authors: [{ name: 'GGCC' }],
  creator: 'GGCC',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Grace for Greatness Christian Centre',
    title: 'Grace for Greatness Christian Centre (GGCC)',
    description:
      'A global church community rooted in faith, serving the world with love, purpose, and the transforming power of the Gospel.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GGCC — Grace for Greatness Christian Centre',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Grace for Greatness Christian Centre (GGCC)',
    description:
      'A global church community rooted in faith, serving the world with love, purpose, and the transforming power of the Gospel.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} ${cormorant.variable}`}>
      <body className="font-body bg-brand-navy text-white antialiased">
        <Providers>
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
          <PersistentPlayer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'rgba(28, 20, 34, 0.95)',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                color: 'white',
                backdropFilter: 'blur(12px)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
