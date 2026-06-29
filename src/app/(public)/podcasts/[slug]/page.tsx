import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Play, Clock, Headphones, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const show = await prisma.podcastShow.findUnique({ where: { slug: params.slug } })
  if (!show) return { title: 'Show Not Found' }
  return {
    title: `${show.title} | GGCC Podcasts`,
    description: show.description ?? undefined,
  }
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  if (m < 60) return `${m} min`
  return `${Math.floor(m / 60)}h ${m % 60}m`
}

export default async function PodcastShowPage({ params }: Props) {
  const show = await prisma.podcastShow.findUnique({
    where: { slug: params.slug },
    include: {
      episodes: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        take: 30,
      },
    },
  })

  if (!show) notFound()

  return (
    <main className="min-h-screen bg-brand-navy pt-24 pb-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <FadeInUp>
          <Link
            href="/podcasts"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All Shows
          </Link>
        </FadeInUp>

        <FadeInUp>
          <div className="relative flex flex-col sm:flex-row items-start gap-6 mb-12 glass-card rounded-2xl p-6 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-regal" />
            {show.artworkUrl ? (
              <img
                src={show.artworkUrl}
                alt={show.title}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover flex-shrink-0 shadow-2xl"
              />
            ) : (
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0">
                <Headphones className="h-14 w-14 text-brand-gold" />
              </div>
            )}

            <div>
              <Badge variant="gold" className="text-xs mb-3">Podcast</Badge>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
                {show.title}
              </h1>
              {show.description && (
                <p className="text-text-muted text-lg leading-relaxed">{show.description}</p>
              )}

              <div className="flex flex-wrap gap-3 mt-5">
                {show.spotifyUrl && (
                  <a
                    href={show.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white bg-[#1DB954]/10 border border-[#1DB954]/20 hover:bg-[#1DB954]/20 rounded-lg px-4 py-2 transition-colors"
                  >
                    <span className="text-[#1DB954] font-medium">Spotify</span>
                    <ExternalLink className="h-3.5 w-3.5 text-[#1DB954]" />
                  </a>
                )}
                {show.applePodcastUrl && (
                  <a
                    href={show.applePodcastUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-white bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 rounded-lg px-4 py-2 transition-colors"
                  >
                    <span className="text-purple-400 font-medium">Apple Podcasts</span>
                    <ExternalLink className="h-3.5 w-3.5 text-purple-400" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </FadeInUp>

        <FadeInUp>
          <h2 className="font-display text-xl font-semibold text-white mb-5">
            {show.episodes.length > 0
              ? `${show.episodes.length} Episode${show.episodes.length !== 1 ? 's' : ''}`
              : 'Episodes'}
          </h2>

          {show.episodes.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl">
              <Headphones className="h-12 w-12 text-text-muted mx-auto mb-3 opacity-30" />
              <p className="text-text-muted">No episodes published yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {show.episodes.map((ep, i) => {
                const accent = ['gold', 'teal', 'magenta'][i % 3]
                const accentBtn =
                  accent === 'teal'
                    ? 'bg-brand-teal/10 border-brand-teal/20 hover:bg-brand-teal/20 group-hover:border-brand-teal/40'
                    : accent === 'magenta'
                      ? 'bg-brand-magenta/10 border-brand-magenta/20 hover:bg-brand-magenta/20 group-hover:border-brand-magenta/40'
                      : 'bg-brand-gold/10 border-brand-gold/20 hover:bg-brand-gold/20 group-hover:border-brand-gold/40'
                const accentIcon =
                  accent === 'teal' ? 'text-brand-teal' : accent === 'magenta' ? 'text-brand-magenta' : 'text-brand-gold'
                return (
                  <div
                    key={ep.id}
                    className="glass-card rounded-xl p-4 flex items-center gap-4 group hover:border-white/20 transition-all"
                  >
                    <div className="w-8 text-center text-text-muted text-xs font-mono flex-shrink-0">
                      {i + 1}
                    </div>

                    <button className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${accentBtn}`}>
                      <Play className={`h-4 w-4 fill-current ml-0.5 ${accentIcon}`} />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium group-hover:text-brand-gold transition-colors line-clamp-1">
                        {ep.title}
                      </div>
                      {ep.description && (
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{ep.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {ep.publishedAt && (
                        <span className="text-xs text-text-muted hidden md:block">
                          {format(new Date(ep.publishedAt), 'MMM d, yyyy')}
                        </span>
                      )}
                      {ep.duration && (
                        <span className="text-xs text-text-muted flex items-center gap-1 hidden sm:flex">
                          <Clock className="h-3 w-3" />
                          {formatDuration(ep.duration)}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </FadeInUp>
      </div>
    </main>
  )
}
