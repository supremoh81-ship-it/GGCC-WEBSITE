import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ggcc.church'

  const staticRoutes = [
    '',
    '/about',
    '/sermons',
    '/podcasts',
    '/prayer',
    '/prayer/wall',
    '/events',
    '/ministries',
    '/give',
    '/testimonies',
    '/gallery',
    '/global-impact',
    '/login',
    '/register',
  ]

  return staticRoutes.map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : 'weekly',
    priority: path === '' ? 1 : 0.8,
  }))
}
