import type { Metadata } from 'next'
import Script from 'next/script'
import { prisma } from '@/lib/prisma'
import { GALLERY_CATEGORIES } from '@/lib/data/gallery-categories'
import { GalleryCategorySection } from '@/components/admin/GalleryCategorySection'

export const metadata: Metadata = { title: 'Gallery | Admin' }

export default async function AdminGalleryPage() {
  const albums = await prisma.galleryAlbum.findMany({
    where: { slug: { in: GALLERY_CATEGORIES.map((c) => c.slug) } },
    include: {
      photos: { orderBy: { createdAt: 'desc' } },
    },
  })

  const totalPhotos = albums.reduce((sum, a) => sum + a.photos.length, 0)

  return (
    <div className="space-y-6">
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />

      <div>
        <h1 className="text-xl font-display font-bold text-white">Gallery</h1>
        <p className="text-sm text-text-muted mt-0.5">
          {totalPhotos} photo{totalPhotos !== 1 ? 's' : ''} across {GALLERY_CATEGORIES.length} categories
        </p>
      </div>

      <div className="space-y-6">
        {GALLERY_CATEGORIES.map((category) => {
          const album = albums.find((a) => a.slug === category.slug)
          const photos = (album?.photos ?? []).map((p) => ({
            id: p.id,
            url: p.url,
            thumbnailUrl: p.thumbnailUrl,
            caption: p.caption,
            createdAt: p.createdAt.toISOString(),
          }))

          return (
            <GalleryCategorySection
              key={category.slug}
              slug={category.slug}
              title={category.title}
              description={category.description}
              initialPhotos={photos}
            />
          )
        })}
      </div>
    </div>
  )
}
