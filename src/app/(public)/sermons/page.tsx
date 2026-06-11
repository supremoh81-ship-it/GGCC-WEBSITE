import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Badge } from '@/components/ui/Badge'
import { Play, Clock, Download, Search, Filter, MicVocal } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sermons',
  description:
    'Browse our full library of sermons, series, and speaker messages. Video, audio, and downloadable notes available.',
}

const sermons = [
  {
    slug: 'the-faith-that-moves-mountains',
    title: 'The Faith That Moves Mountains',
    speaker: 'Dr. Emmanuel Grace',
    series: 'Foundations of Faith',
    date: 'June 8, 2025',
    duration: '52:14',
    type: 'VIDEO',
    thumbnail: 'https://images.unsplash.com/photo-1545987796-200677ee1011?w=600&q=80',
    scripture: 'Matthew 17:20',
  },
  {
    slug: 'walking-in-divine-purpose',
    title: 'Walking in Divine Purpose',
    speaker: 'Pastor Sarah Mitchell',
    series: 'Purpose Driven Life',
    date: 'June 1, 2025',
    duration: '44:30',
    type: 'VIDEO',
    thumbnail: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=600&q=80',
    scripture: 'Jeremiah 29:11',
  },
  {
    slug: 'the-power-of-praise',
    title: 'The Power of Praise in Battle',
    speaker: 'Dr. Emmanuel Grace',
    series: 'Warfare & Worship',
    date: 'May 25, 2025',
    duration: '58:47',
    type: 'VIDEO',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    scripture: '2 Chronicles 20:22',
  },
  {
    slug: 'grace-greater-than-sin',
    title: 'Grace Greater Than All My Sin',
    speaker: 'Bishop Thomas Adeyemi',
    series: 'The Finished Work',
    date: 'May 18, 2025',
    duration: '61:22',
    type: 'AUDIO',
    thumbnail: 'https://images.unsplash.com/photo-1537119042441-93a37c6b7a68?w=600&q=80',
    scripture: 'Romans 5:20',
  },
  {
    slug: 'identity-in-christ',
    title: 'Rooted in Identity: Who You Are in Christ',
    speaker: 'Dr. Emmanuel Grace',
    series: 'Foundations of Faith',
    date: 'May 11, 2025',
    duration: '49:55',
    type: 'VIDEO',
    thumbnail: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600&q=80',
    scripture: 'Ephesians 1:3-14',
  },
  {
    slug: 'holy-spirit-the-helper',
    title: 'The Holy Spirit: Your Constant Helper',
    speaker: 'Pastor Sarah Mitchell',
    series: 'Spirit-led Living',
    date: 'May 4, 2025',
    duration: '53:18',
    type: 'VIDEO',
    thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    scripture: 'John 14:16-17',
  },
]

export default function SermonsPage() {
  return (
    <div className="min-h-screen bg-brand-navy pt-24">
      {/* Header */}
      <section className="section-padding-sm bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-30 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative">
          <FadeInUp className="text-center">
            <span className="section-label mb-4 inline-flex justify-center">Sermon Library</span>
            <h1 className="text-display-lg font-display text-white mb-4">
              Messages That{' '}
              <GoldShimmer>Transform</GoldShimmer>
            </h1>
            <p className="text-body-lg text-text-muted max-w-xl mx-auto">
              Discover sermons, series, and teachings that will deepen your faith and ignite your purpose.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 z-10 bg-brand-navy/95 backdrop-blur-xl border-b border-white/8">
        <div className="container mx-auto px-4 max-w-7xl py-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="search"
              placeholder="Search sermons..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-white/10 bg-white/5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold/40 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {['All', 'Video', 'Audio', 'Notes'].map((f) => (
              <button
                key={f}
                className="px-4 py-2 rounded-full text-sm text-text-muted hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/15"
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sermons grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-7xl">
          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sermons.map((sermon) => (
              <StaggerItem key={sermon.slug}>
                <Link href={`/sermons/${sermon.slug}`} className="block group">
                  <div className="glass-card rounded-2xl overflow-hidden glass-card-interactive">
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={sermon.thumbnail}
                        alt={sermon.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-brand-navy/30 group-hover:bg-brand-navy/10 transition-colors" />

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 rounded-full bg-brand-gold/90 flex items-center justify-center shadow-gold">
                          <Play className="h-5 w-5 text-brand-navy fill-current ml-0.5" />
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="absolute bottom-2.5 right-2.5 glass-card rounded-full px-2.5 py-1 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-brand-gold" />
                        <span className="text-xs text-white font-medium">{sermon.duration}</span>
                      </div>

                      {/* Type badge */}
                      <div className="absolute top-2.5 left-2.5">
                        <Badge variant={sermon.type === 'AUDIO' ? 'blue' : 'gold'}>
                          {sermon.type}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="text-xs text-brand-gold font-medium mb-2">{sermon.series}</div>
                      <h3 className="font-display font-semibold text-white text-base mb-2 group-hover:text-brand-gold transition-colors line-clamp-2">
                        {sermon.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-text-muted mb-3">
                        <MicVocal className="h-3 w-3" />
                        {sermon.speaker} &bull; {sermon.date}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-muted italic">{sermon.scripture}</span>
                        <button className="text-text-muted hover:text-brand-gold transition-colors">
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* Load more */}
          <FadeInUp className="text-center mt-12">
            <button className="btn-outline-gold">
              Load More Sermons
            </button>
          </FadeInUp>
        </div>
      </section>
    </div>
  )
}
