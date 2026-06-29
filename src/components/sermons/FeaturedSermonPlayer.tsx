'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play, Clock } from 'lucide-react'
import { VideoEmbed } from '@/components/sermons/VideoEmbed'

export function FeaturedSermonPlayer({
  videoUrl,
  thumbnailUrl,
  title,
  duration,
}: {
  videoUrl: string | null
  thumbnailUrl: string | null
  title: string
  duration?: string
}) {
  const [playing, setPlaying] = useState(false)

  if (playing && videoUrl) {
    return (
      <div className="relative aspect-video lg:aspect-auto lg:min-h-[400px] bg-black">
        <VideoEmbed url={videoUrl} title={title} className="absolute inset-0 w-full h-full" />
      </div>
    )
  }

  return (
    <div className="relative aspect-video lg:aspect-auto lg:min-h-[400px] group">
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-[#0d1e3a] to-brand-blue" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-blue/50" />

      {videoUrl && (
        <button
          onClick={() => setPlaying(true)}
          className="absolute inset-0 flex items-center justify-center"
          aria-label={`Play ${title}`}
        >
          <div className="w-20 h-20 rounded-full bg-brand-gold/90 backdrop-blur-sm flex items-center justify-center shadow-gold hover:scale-110 hover:bg-brand-gold transition-all duration-300">
            <Play className="h-8 w-8 text-brand-navy fill-current ml-1.5" />
          </div>
        </button>
      )}

      {duration && (
        <div className="absolute bottom-4 right-4 glass-card rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-brand-gold" />
          <span className="text-xs text-white font-medium">{duration}</span>
        </div>
      )}
    </div>
  )
}
