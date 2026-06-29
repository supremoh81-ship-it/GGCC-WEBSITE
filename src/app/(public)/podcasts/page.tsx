import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { SignatureHalo } from '@/components/motion/SignatureHalo'
import { Badge } from '@/components/ui/Badge'
import { Play, Clock, Headphones, Mic } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const accentVariants = ['gold', 'teal', 'magenta', 'gold'] as const

export const metadata: Metadata = {
  title: 'Podcasts',
  description: 'Listen to GGCC podcasts, devotionals, and teaching series. Available on all major platforms.',
}

const shows = [
  {
    slug: 'daily-grace',
    title: 'Daily Grace',
    description: 'Short daily devotionals to start your morning anchored in the Word.',
    episodeCount: 342,
    coverUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80',
    category: 'Devotional',
    latestEpisode: 'Walking in Daily Grace - Episode 342',
    duration: '12 min',
  },
  {
    slug: 'deep-waters',
    title: 'Deep Waters',
    description: 'In-depth theological explorations for believers who hunger for more.',
    episodeCount: 87,
    coverUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=400&q=80',
    category: 'Teaching',
    latestEpisode: 'The Mystery of Sanctification',
    duration: '48 min',
  },
  {
    slug: 'kingdom-conversations',
    title: 'Kingdom Conversations',
    description: 'Interviews with global leaders, missionaries, and change-makers.',
    episodeCount: 64,
    coverUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    category: 'Interview',
    latestEpisode: 'Church Planting in the Arabian Peninsula',
    duration: '55 min',
  },
  {
    slug: 'faith-and-family',
    title: 'Faith & Family',
    description: 'Practical wisdom for raising godly families and building strong homes.',
    episodeCount: 128,
    coverUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
    category: 'Lifestyle',
    latestEpisode: 'Passing Faith to the Next Generation',
    duration: '38 min',
  },
]

export default function PodcastsPage() {
  return (
    <div className="min-h-screen bg-brand-navy pt-24">
      <section className="section-padding-sm bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-30 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60">
          <SignatureHalo size={480} />
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative">
          <FadeInUp className="text-center">
            <span className="section-label mb-4 inline-flex justify-center">Podcast Hub</span>
            <h1 className="text-display-lg font-display text-white mb-4">
              Listen. Learn. <GoldShimmer>Grow.</GoldShimmer>
            </h1>
            <p className="text-body-lg text-text-muted max-w-xl mx-auto">
              Faith content for every season of life. Available wherever you listen to podcasts.
            </p>
          </FadeInUp>

          {/* Platform badges */}
          <FadeInUp delay={0.3} className="flex flex-wrap gap-3 justify-center mt-8">
            {['Spotify', 'Apple Podcasts', 'Google Podcasts', 'Amazon Music'].map((p) => (
              <span key={p} className="glass-card px-4 py-2 rounded-full text-xs text-white/70 border border-white/15">
                {p}
              </span>
            ))}
          </FadeInUp>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-7xl">
          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shows.map((show, i) => {
              const accent = accentVariants[i % accentVariants.length]
              return (
                <StaggerItem key={show.slug}>
                  <Link href={`/podcasts/${show.slug}`} className="block group">
                    <div className="glass-card rounded-2xl overflow-hidden glass-card-interactive relative">
                      {i === 0 && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-regal z-10" />}
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={show.coverUrl}
                          alt={show.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-overlay opacity-60" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div
                            className={cn(
                              'w-14 h-14 rounded-full flex items-center justify-center',
                              accent === 'teal'
                                ? 'bg-brand-teal/90 shadow-teal'
                                : accent === 'magenta'
                                  ? 'bg-brand-magenta/90 shadow-magenta'
                                  : 'bg-brand-gold/90 shadow-gold'
                            )}
                          >
                            <Play className="h-5 w-5 text-brand-navy fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="p-5">
                        <Badge variant={accent} className="mb-3 text-[10px]">{show.category}</Badge>
                        <h3 className="font-display font-bold text-white text-base mb-1.5 group-hover:text-brand-gold transition-colors">
                          {show.title}
                        </h3>
                        <p className="text-xs text-text-muted mb-3 line-clamp-2">{show.description}</p>

                        <div className="flex items-center justify-between text-xs text-text-muted">
                          <span className="flex items-center gap-1">
                            <Headphones className="h-3 w-3" />
                            {show.episodeCount} episodes
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {show.duration} avg
                          </span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/8">
                          <div className="text-[10px] text-text-muted">Latest:</div>
                          <div className="text-xs text-white/70 mt-0.5 line-clamp-1">{show.latestEpisode}</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
              )
            })}
          </StaggerChildren>
        </div>
      </section>
    </div>
  )
}
