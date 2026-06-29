import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { SignatureHalo } from '@/components/motion/SignatureHalo'
import { GalleryGrid } from '@/components/gallery/GalleryGrid'
import { GALLERY_CATEGORIES, getCategory } from '@/lib/data/gallery-categories'
import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/utils/cn'

const RECENT_COUNT = 8

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Moments from Grace for Greatness Christian Centre: services, conferences, mission trips, and community events.',
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const activeSlug = searchParams.category && getCategory(searchParams.category) ? searchParams.category : 'all'

  const [photoRecords, recentRecords] = await Promise.all([
    prisma.galleryPhoto.findMany({
      where:
        activeSlug === 'all'
          ? { album: { isPublic: true } }
          : { album: { slug: activeSlug, isPublic: true } },
      include: { album: true },
      orderBy: { createdAt: 'desc' },
      take: 120,
    }),
    prisma.galleryPhoto.findMany({
      where: { album: { isPublic: true } },
      include: { album: true },
      orderBy: { createdAt: 'desc' },
      take: RECENT_COUNT,
    }),
  ])

  const toPhotoItem = (p: (typeof photoRecords)[number]) => ({
    id: p.id,
    url: p.url,
    thumbnailUrl: p.thumbnailUrl,
    caption: p.caption,
    createdAt: p.createdAt.toISOString(),
    categoryTitle: p.album.title,
  })

  const photos = photoRecords.map(toPhotoItem)
  const recentPhotos = recentRecords.map(toPhotoItem)

  return (
    <div className="min-h-screen bg-brand-navy pt-24">

      {/* Hero */}
      <section className="section-padding-sm bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-30 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60">
          <SignatureHalo size={480} />
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative">
          <FadeInUp className="text-center">
            <span className="section-label mb-4 inline-flex justify-center">Gallery</span>
            <h1 className="text-display-lg font-display text-white mb-4">
              Moments of <GoldShimmer>Grace</GoldShimmer>
            </h1>
            <p className="text-body-lg text-text-muted max-w-xl mx-auto">
              A look into the life of our church: worship, fellowship, outreach, and the
              moments that shape our journey together.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Recently Added */}
      {recentPhotos.length > 0 && (
        <section className="section-padding-sm bg-brand-navy border-b border-white/8 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-regal" />
          <div className="container mx-auto px-4 max-w-7xl">
            <FadeInUp className="flex items-center gap-2.5 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-teal" />
              </span>
              <h2 className="font-display font-bold text-white text-lg">Recently Added</h2>
            </FadeInUp>
            <GalleryGrid photos={recentPhotos} />
          </div>
        </section>
      )}

      {/* Category tabs */}
      <section className="sticky top-16 z-20 bg-brand-navy/95 backdrop-blur-md border-b border-white/8">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex gap-2 overflow-x-auto py-4 [&::-webkit-scrollbar]:hidden">
            <Link
              href="/gallery"
              className={cn(
                'shrink-0 text-sm font-medium rounded-full px-4 py-2 border transition-all duration-200 whitespace-nowrap',
                activeSlug === 'all'
                  ? 'bg-brand-gold text-brand-navy border-brand-gold'
                  : 'text-text-muted border-white/12 hover:text-white hover:border-white/25'
              )}
            >
              All
            </Link>
            {GALLERY_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/gallery?category=${category.slug}`}
                className={cn(
                  'shrink-0 text-sm font-medium rounded-full px-4 py-2 border transition-all duration-200 whitespace-nowrap',
                  activeSlug === category.slug
                    ? 'bg-brand-gold text-brand-navy border-brand-gold'
                    : 'text-text-muted border-white/12 hover:text-white hover:border-white/25'
                )}
              >
                {category.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-7xl">
          <FadeInUp className="mb-6">
            <h2 className="font-display font-bold text-white text-lg">
              {activeSlug === 'all' ? 'All Photos' : getCategory(activeSlug)?.title}
            </h2>
          </FadeInUp>
          <GalleryGrid photos={photos} />
        </div>
      </section>

    </div>
  )
}
