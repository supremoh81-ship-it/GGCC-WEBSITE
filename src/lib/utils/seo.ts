import type { Metadata } from 'next'

interface SeoProps {
  title: string
  description?: string
  image?: string
  noIndex?: boolean
  path?: string
}

export function buildMetadata({ title, description, image, noIndex, path }: SeoProps): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ggcc.church'
  const url = `${siteUrl}${path ?? ''}`
  const ogImage = image ?? '/images/og-image.jpg'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
    alternates: { canonical: url },
  }
}
