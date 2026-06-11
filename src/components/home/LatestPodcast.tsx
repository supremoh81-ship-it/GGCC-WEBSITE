import { prisma } from '@/lib/prisma'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { Headphones, Clock, Play, ArrowRight, Rss } from 'lucide-react'
import Link from 'next/link'

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const h = Math.floor(m / 60)
  if (h > 0) return `${h}h ${m % 60}m`
  return `${m}m`
}

export async function LatestPodcast() {
  const episode = await prisma.podcastEpisode.findFirst({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    include: {
      show: { select: { title: true, slug: true, artworkUrl: true } },
    },
  }).catch(() => null)

  if (!episode) return null

  return (
    <section className="py-24 bg-brand-navy relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Episode card */}
          <FadeInUp>
            <div className="relative">
              <div className="glass-card rounded-2xl p-8 border border-brand-gold/20">
                {/* Show artwork */}
                <div className="flex items-start gap-5 mb-6">
                  <div className="relative flex-shrink-0">
                    {episode.show.artworkUrl ? (
                      <img
                        src={episode.show.artworkUrl}
                        alt={episode.show.title}
                        className="w-24 h-24 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                        <Headphones className="h-10 w-10 text-brand-gold" />
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center shadow-lg">
                      <Play className="h-4 w-4 text-brand-navy fill-brand-navy ml-0.5" />
                    </div>
                  </div>
                  <div>
                    <p className="text-brand-gold text-xs font-medium uppercase tracking-widest mb-1">
                      {episode.show.title}
                    </p>
                    <h3 className="text-white font-display font-bold text-xl leading-snug line-clamp-2">
                      {episode.title}
                    </h3>
                    {episode.duration && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <Clock className="h-3.5 w-3.5 text-text-muted" />
                        <span className="text-xs text-text-muted">{formatDuration(episode.duration)}</span>
                        {episode.episodeNo && (
                          <span className="text-xs text-text-muted">· Episode {episode.episodeNo}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {episode.description && (
                  <p className="text-text-muted text-sm leading-relaxed line-clamp-3 mb-6">
                    {episode.description}
                  </p>
                )}

                {/* Fake waveform */}
                <div className="flex items-center gap-0.5 h-8 mb-6">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-brand-gold/30 rounded-full"
                      style={{ height: `${20 + Math.sin(i * 0.8) * 15 + Math.random() * 10}%` }}
                    />
                  ))}
                </div>

                <Link
                  href={`/podcasts/${episode.show.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand-gold text-brand-navy font-bold text-sm hover:bg-brand-gold-light transition-colors"
                >
                  <Play className="h-4 w-4 fill-brand-navy" />
                  Listen Now
                </Link>
              </div>
            </div>
          </FadeInUp>

          {/* Text */}
          <FadeInUp delay={0.15}>
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Rss className="h-4 w-4 text-brand-gold" />
                  <p className="text-brand-gold text-sm font-medium uppercase tracking-widest">Latest Episode</p>
                </div>
                <h2 className="text-4xl font-display font-bold text-white leading-tight">
                  Faith That Speaks, Wherever You Are
                </h2>
                <p className="text-text-muted mt-4 leading-relaxed">
                  Our podcast brings the teaching, worship, and community of GGCC directly to you. Subscribe and never miss a word that was meant for your season.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Available on', value: 'Spotify & Apple' },
                  { label: 'New episodes', value: 'Every week' },
                ].map(({ label, value }) => (
                  <div key={label} className="p-4 rounded-xl bg-white/3 border border-white/8">
                    <div className="text-xs text-text-muted mb-1">{label}</div>
                    <div className="text-white font-semibold text-sm">{value}</div>
                  </div>
                ))}
              </div>

              <Link
                href="/podcasts"
                className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-light text-sm font-medium transition-colors"
              >
                Browse all episodes
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  )
}
