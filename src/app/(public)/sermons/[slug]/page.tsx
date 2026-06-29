import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Play, Headphones, FileText, Clock, Eye, BookmarkPlus, Share2 } from 'lucide-react'
import { format } from 'date-fns'
import { VideoEmbed } from '@/components/sermons/VideoEmbed'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sermon = await prisma.sermon.findUnique({
    where: { slug: params.slug },
    include: { speaker: true },
  })
  if (!sermon) return { title: 'Sermon Not Found' }
  return {
    title: `${sermon.title} | GGCC Sermons`,
    description: sermon.description ?? undefined,
    openGraph: {
      title: sermon.title,
      description: sermon.description ?? undefined,
      images: sermon.thumbnailUrl ? [sermon.thumbnailUrl] : [],
    },
  }
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default async function SermonDetailPage({ params }: Props) {
  const sermon = await prisma.sermon.findUnique({
    where: { slug: params.slug },
    include: {
      speaker: true,
      series: true,
    },
  })

  if (!sermon || sermon.status !== 'PUBLISHED') notFound()

  await prisma.sermon.update({
    where: { id: sermon.id },
    data: { viewCount: { increment: 1 } },
  })

  const relatedSermons = await prisma.sermon.findMany({
    where: {
      status: 'PUBLISHED',
      seriesId: sermon.seriesId ?? undefined,
      id: { not: sermon.id },
    },
    include: { speaker: true },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  })

  const typeIcon = sermon.type === 'VIDEO' ? Play : sermon.type === 'AUDIO' ? Headphones : FileText
  const TypeIcon = typeIcon

  return (
    <main className="min-h-screen bg-brand-navy">
      {sermon.thumbnailUrl && (
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
          <img
            src={sermon.thumbnailUrl}
            alt={sermon.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent" />
        </div>
      )}

      <div className={`${sermon.thumbnailUrl ? '-mt-32 relative z-10' : 'pt-24'} container mx-auto px-4 sm:px-6 max-w-4xl pb-24`}>
        <FadeInUp>
          <Link
            href="/sermons"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All Sermons
          </Link>
        </FadeInUp>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <FadeInUp>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="gold" className="flex items-center gap-1.5 text-xs">
                  <TypeIcon className="h-3 w-3" />
                  {sermon.type.replace('_', ' ')}
                </Badge>
                {sermon.series && (
                  <Badge variant="muted" className="text-xs">
                    {sermon.series.title}
                  </Badge>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
                {sermon.title}
              </h1>

              {sermon.description && (
                <p className="text-text-muted text-lg leading-relaxed">{sermon.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mt-6 pt-6 border-t border-white/8">
                {sermon.speaker && (
                  <span className="text-white font-medium">{sermon.speaker.name}</span>
                )}
                {sermon.publishedAt && (
                  <span>{format(new Date(sermon.publishedAt), 'MMMM d, yyyy')}</span>
                )}
                {sermon.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDuration(sermon.duration)}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {sermon.viewCount.toLocaleString()} views
                </span>
              </div>
            </FadeInUp>

            {sermon.videoUrl && (
              <FadeInUp>
                <div className="aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/10">
                  <VideoEmbed url={sermon.videoUrl} title={sermon.title} className="w-full h-full" />
                </div>
              </FadeInUp>
            )}

            {!sermon.videoUrl && sermon.audioUrl && (
              <FadeInUp>
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0">
                      <Headphones className="h-7 w-7 text-brand-gold" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">{sermon.title}</div>
                      {sermon.speaker && (
                        <div className="text-sm text-text-muted">{sermon.speaker.name}</div>
                      )}
                    </div>
                  </div>
                  <audio
                    src={sermon.audioUrl}
                    controls
                    className="w-full"
                    preload="metadata"
                  />
                </div>
              </FadeInUp>
            )}

            {sermon.notes && (
              <FadeInUp>
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="font-display font-semibold text-white text-lg mb-4">Notes</h2>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <p className="text-text-muted whitespace-pre-wrap">{sermon.notes}</p>
                  </div>
                </div>
              </FadeInUp>
            )}
          </div>

          <div className="space-y-6">
            <FadeInUp>
              <div className="glass-card rounded-2xl p-5 space-y-3">
                {sermon.audioUrl && (
                  <Button variant="gold" className="w-full flex items-center justify-center gap-2">
                    <Headphones className="h-4 w-4" />
                    Listen to Audio
                  </Button>
                )}
                <Button variant="outline-gold" className="w-full flex items-center justify-center gap-2">
                  <BookmarkPlus className="h-4 w-4" />
                  Save Sermon
                </Button>
                <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </FadeInUp>

            {sermon.speaker && (
              <FadeInUp>
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="text-xs text-text-muted uppercase tracking-widest mb-4">Speaker</h3>
                  <div className="flex items-start gap-3">
                    {sermon.speaker.avatarUrl && (
                      <img
                        src={sermon.speaker.avatarUrl}
                        alt={sermon.speaker.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-brand-gold/20 flex-shrink-0"
                      />
                    )}
                    <div>
                      <div className="text-white font-semibold text-sm">{sermon.speaker.name}</div>
                      {sermon.speaker.title && (
                        <div className="text-xs text-brand-gold mt-0.5">{sermon.speaker.title}</div>
                      )}
                      {sermon.speaker.bio && (
                        <p className="text-xs text-text-muted mt-2 line-clamp-4">{sermon.speaker.bio}</p>
                      )}
                    </div>
                  </div>
                </div>
              </FadeInUp>
            )}

            {sermon.series && (
              <FadeInUp>
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="text-xs text-text-muted uppercase tracking-widest mb-3">Part of Series</h3>
                  <div className="text-white font-semibold text-sm">{sermon.series.title}</div>
                  {sermon.series.description && (
                    <p className="text-xs text-text-muted mt-1 line-clamp-3">{sermon.series.description}</p>
                  )}
                  <Link
                    href={`/sermons?series=${sermon.series.slug}`}
                    className="text-xs text-brand-gold hover:underline mt-2 inline-block"
                  >
                    View all in series
                  </Link>
                </div>
              </FadeInUp>
            )}

            {relatedSermons.length > 0 && (
              <FadeInUp>
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="text-xs text-text-muted uppercase tracking-widest mb-4">More Sermons</h3>
                  <div className="space-y-3">
                    {relatedSermons.map((s) => (
                      <Link
                        key={s.id}
                        href={`/sermons/${s.slug}`}
                        className="flex items-start gap-3 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold/20 transition-colors">
                          <Play className="h-3.5 w-3.5 text-brand-gold fill-current ml-0.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm text-white group-hover:text-brand-gold transition-colors line-clamp-2 font-medium">
                            {s.title}
                          </div>
                          {s.speaker && (
                            <div className="text-xs text-text-muted mt-0.5">{s.speaker.name}</div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
