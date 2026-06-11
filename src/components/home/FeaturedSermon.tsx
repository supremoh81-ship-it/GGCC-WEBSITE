import Link from 'next/link'
import Image from 'next/image'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Play, Clock, Download, BookOpen, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export function FeaturedSermon() {
  const sermon = {
    title: 'The Faith That Moves Mountains',
    series: 'Foundations of Faith',
    speaker: 'Dr. Emmanuel Grace',
    duration: '52:14',
    thumbnail: 'https://images.unsplash.com/photo-1545987796-200677ee1011?w=900&q=80',
    date: 'June 8, 2025',
    scripture: 'Matthew 17:20',
    description:
      'In this powerful message, we explore what it truly means to trust God beyond what our natural senses can perceive. Faith is not the absence of doubt but the decision to act despite it.',
  }

  return (
    <section className="section-padding bg-brand-blue relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl">
        <FadeInUp className="text-center mb-12">
          <span className="section-label mb-4 inline-flex justify-center">Featured Message</span>
          <h2 className="text-display-md font-display text-white">
            This Week&apos;s{' '}
            <GoldShimmer>Sermon</GoldShimmer>
          </h2>
        </FadeInUp>

        <FadeInUp>
          <div className="glass-card rounded-3xl overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Thumbnail */}
              <div className="relative aspect-video lg:aspect-auto lg:min-h-[400px] group">
                <Image
                  src={sermon.thumbnail}
                  alt={sermon.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-blue/50" />

                {/* Play button */}
                <Link
                  href="/sermons"
                  className="absolute inset-0 flex items-center justify-center"
                  aria-label={`Play ${sermon.title}`}
                >
                  <div className="w-20 h-20 rounded-full bg-brand-gold/90 backdrop-blur-sm flex items-center justify-center shadow-gold hover:scale-110 hover:bg-brand-gold transition-all duration-300">
                    <Play className="h-8 w-8 text-brand-navy fill-current ml-1.5" />
                  </div>
                </Link>

                {/* Duration badge */}
                <div className="absolute bottom-4 right-4 glass-card rounded-full px-3 py-1.5 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-brand-gold" />
                  <span className="text-xs text-white font-medium">{sermon.duration}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-5">
                  <Badge variant="gold">{sermon.series}</Badge>
                  <Badge variant="blue">{sermon.scripture}</Badge>
                </div>

                <h3 className="font-display font-bold text-2xl lg:text-3xl text-white mb-3">
                  {sermon.title}
                </h3>

                <p className="text-sm text-brand-gold font-medium mb-4">
                  {sermon.speaker} &bull; {sermon.date}
                </p>

                <p className="text-body text-text-muted mb-8 leading-relaxed">
                  {sermon.description}
                </p>

                <div className="flex flex-wrap gap-3">
                  <Link href="/sermons" className="btn-gold">
                    <Play className="h-4 w-4 fill-current" />
                    Watch Now
                  </Link>
                  <button className="btn-ghost">
                    <Download className="h-4 w-4" />
                    Notes
                  </button>
                  <Link href="/sermons" className="btn-ghost">
                    <BookOpen className="h-4 w-4" />
                    All Sermons
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}
