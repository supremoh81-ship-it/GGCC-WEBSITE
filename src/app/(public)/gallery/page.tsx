'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { X, ZoomIn } from 'lucide-react'

const albums = [
  { id: 'worship', label: 'Worship Nights' },
  { id: 'missions', label: 'Missions Trips' },
  { id: 'community', label: 'Community Events' },
  { id: 'youth', label: 'Youth & Young Adults' },
]

const photos = [
  { id: '1', src: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80', album: 'worship', caption: 'Sunday Worship Night' },
  { id: '2', src: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80', album: 'worship', caption: 'Annual Praise Night 2024' },
  { id: '3', src: 'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=800&q=80', album: 'missions', caption: 'Ghana Medical Mission' },
  { id: '4', src: 'https://images.unsplash.com/photo-1556484687-30636164638b?w=800&q=80', album: 'missions', caption: 'Lagos Outreach' },
  { id: '5', src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80', album: 'community', caption: 'Family Conference 2024' },
  { id: '6', src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80', album: 'community', caption: 'Community Barbecue' },
  { id: '7', src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80', album: 'youth', caption: 'Youth Conference 2024' },
  { id: '8', src: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80', album: 'youth', caption: 'Young Adults Retreat' },
  { id: '9', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', album: 'worship', caption: 'Prayer and Worship Marathon' },
  { id: '10', src: 'https://images.unsplash.com/photo-1574634534894-89d7576c8259?w=800&q=80', album: 'community', caption: 'Annual Church Picnic' },
  { id: '11', src: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=80', album: 'missions', caption: 'Water Project - East Africa' },
  { id: '12', src: 'https://images.unsplash.com/photo-1560439514-4e9645039924?w=800&q=80', album: 'youth', caption: 'Leadership Training' },
]

export default function GalleryPage() {
  const [activeAlbum, setActiveAlbum] = useState<string>('all')
  const [lightboxPhoto, setLightboxPhoto] = useState<(typeof photos)[0] | null>(null)

  const filtered = activeAlbum === 'all' ? photos : photos.filter((p) => p.album === activeAlbum)

  return (
    <div className="min-h-screen bg-brand-navy pt-24">
      {/* Page header */}
      <section className="section-padding-sm bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-grid opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative">
          <FadeInUp className="text-center">
            <span className="section-label mb-4 inline-flex justify-center">Gallery</span>
            <h1 className="text-display-lg font-display text-white mb-4">
              Moments of <GoldShimmer>Grace</GoldShimmer>
            </h1>
            <p className="text-body-lg text-text-muted max-w-xl mx-auto">
              A glimpse into the life of our community. Every image is a story of faith lived out loud.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Album filter */}
      <section className="py-8 bg-brand-navy border-b border-white/8 sticky top-16 z-10 backdrop-blur-xl">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setActiveAlbum('all')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeAlbum === 'all'
                  ? 'bg-brand-gold text-brand-navy'
                  : 'glass-card text-text-muted hover:text-white'
              }`}
            >
              All
            </button>
            {albums.map((a) => (
              <button
                key={a.id}
                onClick={() => setActiveAlbum(a.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeAlbum === a.id
                    ? 'bg-brand-gold text-brand-navy'
                    : 'glass-card text-text-muted hover:text-white'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Photo grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((photo) => (
                <motion.div
                  key={photo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group cursor-pointer aspect-square rounded-xl overflow-hidden"
                  onClick={() => setLightboxPhoto(photo)}
                >
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/50 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="h-7 w-7 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-brand-navy/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xs text-white font-medium">{photo.caption}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full aspect-[4/3] rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightboxPhoto.src}
                alt={lightboxPhoto.caption}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white font-medium">{lightboxPhoto.caption}</p>
              </div>
              <button
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                onClick={() => setLightboxPhoto(null)}
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
