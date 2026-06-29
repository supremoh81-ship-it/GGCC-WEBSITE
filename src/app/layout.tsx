import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
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

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ggcc.church'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | GGCC Church',
    default: 'GGCC | Greater Grace Christian Center',
  },
  description:
    'Greater Grace Christian Center — a global church community rooted in faith, serving the world with love, purpose, and the transforming power of the Gospel.',
  keywords: [
    'GGCC',
    'Greater Grace Christian Center',
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
    siteName: 'GGCC',
    title: 'GGCC | Greater Grace Christian Center',
    description:
      'A global church community rooted in faith, serving the world with love, purpose, and the transforming power of the Gospel.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GGCC — Greater Grace Christian Center',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GGCC | Greater Grace Christian Center',
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
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
                background: 'rgba(15, 35, 71, 0.95)',
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
