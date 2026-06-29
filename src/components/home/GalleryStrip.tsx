import Link from 'next/link'
import Image from 'next/image'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/prisma'

const STRIP_COUNT = 10

function cldFit(url: string, size: number) {
  return url.replace('/upload/', `/upload/c_limit,w_${size},h_${size},q_auto,f_auto/`)
}

export async function GalleryStrip() {
  const records = await prisma.galleryPhoto.findMany({
    where: { album: { isPublic: true } },
    include: { album: true },
    orderBy: { createdAt: 'desc' },
    take: STRIP_COUNT,
  })

  if (records.length === 0) return null

  const photos = records.map((p) => ({
    id: p.id,
    src: cldFit(p.url, 700),
    href: `/gallery?category=${p.album.slug}`,
    alt: p.caption ?? p.album.title,
  }))

  return (
    <section className="section-padding-sm bg-brand-navy overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl mb-8">
        <FadeInUp className="flex items-center justify-between">
          <div>
            <span className="section-label mb-3 inline-flex">Gallery</span>
            <h2 className="text-display-sm font-display text-white">
              Life at{' '}
              <GoldShimmer>GGCC</GoldShimmer>
            </h2>
          </div>
          <Link href="/gallery" className="btn-outline-gold shrink-0">
            View Gallery
            <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeInUp>
      </div>

      {/* Horizontal scroll strip */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
        {photos.map((photo) => (
          <Link
            key={photo.id}
            href={photo.href}
            className="flex-none relative rounded-2xl overflow-hidden w-80 h-64 sm:w-96 sm:h-72 bg-white/5 group"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 320px, 384px"
              className="object-contain transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-brand-navy/10 group-hover:bg-brand-navy/0 transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  )
}
