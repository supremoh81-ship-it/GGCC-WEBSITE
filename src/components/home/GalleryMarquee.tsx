'use client'

import Link from 'next/link'
import Image from 'next/image'

interface Photo {
  id: string
  src: string
  href: string
  alt: string
}

export function GalleryMarquee({ photos }: { photos: Photo[] }) {
  // Duplicate to create the seamless infinite loop
  const doubled = [...photos, ...photos]

  return (
    <div className="marquee-wrapper">
      <div className="marquee-track">
        {doubled.map((photo, i) => (
          <Link
            key={`${photo.id}-${i}`}
            href={photo.href}
            className="relative flex-none rounded-2xl overflow-hidden mx-2 group"
            style={{ width: '320px', height: '240px' }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="320px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Hover overlay with gold shimmer at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-regal scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </Link>
        ))}
      </div>
    </div>
  )
}
