import Link from 'next/link'
import Image from 'next/image'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { ArrowRight } from 'lucide-react'

const photos = [
  'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&q=80',
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
  'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&q=80',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=80',
  'https://images.unsplash.com/photo-1545987796-200677ee1011?w=400&q=80',
]

export function GalleryStrip() {
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
        {photos.map((src, i) => (
          <Link
            key={i}
            href="/gallery"
            className="flex-none relative rounded-2xl overflow-hidden w-64 h-48 group"
          >
            <Image
              src={src}
              alt={`GGCC community photo ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-brand-navy/20 group-hover:bg-brand-navy/5 transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  )
}
