'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { X, ChevronLeft, ChevronRight, Camera, Download } from 'lucide-react'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'

export interface GalleryPhotoItem {
  id: string
  url: string
  thumbnailUrl: string | null
  caption: string | null
  createdAt: string
  categoryTitle: string
}

function cldDownloadUrl(url: string) {
  return url.replace('/upload/', '/upload/fl_attachment/')
}

function cldFit(url: string, size: number) {
  return url.replace('/upload/', `/upload/c_limit,w_${size},h_${size},q_auto,f_auto/`)
}

export function GalleryGrid({ photos }: { photos: GalleryPhotoItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    if (openIndex === null) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenIndex(null)
      if (e.key === 'ArrowRight') setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length))
      if (e.key === 'ArrowLeft') setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length))
    }
    window.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [openIndex, photos.length])

  if (photos.length === 0) {
    return (
      <div className="text-center py-24 glass-card rounded-2xl">
        <Camera className="h-10 w-10 text-text-muted mx-auto mb-3 opacity-30" />
        <p className="text-text-muted">No photos in this category yet. Check back soon.</p>
      </div>
    )
  }

  const active = openIndex !== null ? photos[openIndex] : null

  return (
    <>
      <StaggerChildren className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, i) => (
          <StaggerItem key={photo.id}>
            <button
              onClick={() => setOpenIndex(i)}
              className="relative aspect-square w-full rounded-2xl overflow-hidden group bg-white/5 border border-white/8 hover:border-brand-gold/30 transition-all duration-300"
            >
              <Image
                src={cldFit(photo.url, 600)}
                alt={photo.caption ?? photo.categoryTitle}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-[11px] font-semibold text-brand-gold uppercase tracking-wider">
                  {photo.categoryTitle}
                </p>
                <p className="text-xs text-white/80">{format(new Date(photo.createdAt), 'MMM d, yyyy')}</p>
              </div>
            </button>
          </StaggerItem>
        ))}
      </StaggerChildren>

      {active && (
        <div className="fixed inset-0 z-[100] bg-brand-navy/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-10">
          <div className="absolute top-5 right-5 flex items-center gap-3">
            <a
              href={cldDownloadUrl(active.url)}
              download
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-gold/20 hover:text-brand-gold flex items-center justify-center text-white transition-colors"
              aria-label="Download photo"
            >
              <Download className="h-4 w-4" />
            </a>
            <button
              onClick={() => setOpenIndex(null)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={() => setOpenIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length))}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="max-w-4xl w-full flex flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.url}
              alt={active.caption ?? active.categoryTitle}
              className="max-h-[75vh] w-auto rounded-2xl shadow-2xl object-contain"
            />
            <div className="text-center">
              <p className="text-brand-gold text-sm font-semibold uppercase tracking-wider">
                {active.categoryTitle}
              </p>
              <p className="text-text-muted text-xs mt-0.5">
                {format(new Date(active.createdAt), 'MMMM d, yyyy')}
              </p>
            </div>
          </div>

          <button
            onClick={() => setOpenIndex((i) => (i === null ? null : (i + 1) % photos.length))}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  )
}
