import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { SignatureHalo } from '@/components/motion/SignatureHalo'
import { Badge } from '@/components/ui/Badge'
import { Play, Clock, Search, MicVocal, Film } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { cn } from '@/lib/utils/cn'
import { format } from 'date-fns'
import type { SermonType } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Sermons',
  description:
    'Browse our full library of sermons, series, and speaker messages. Video, audio, and downloadable notes available.',
}

const FILTERS: { label: string; value: SermonType | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Video', value: 'VIDEO' },
  { label: 'Audio', value: 'AUDIO' },
  { label: 'Notes', value: 'NOTES_ONLY' },
]

const PAGE_SIZE = 12

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default async function SermonsPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string; take?: string }
}) {
  const activeType = FILTERS.some((f) => f.value === searchParams.type) ? searchParams.type : 'ALL'
  const take = Math.min(Number(searchParams.take) || PAGE_SIZE, 96)

  const sermons = await prisma.sermon.findMany({
    where: {
      status: 'PUBLISHED',
      ...(activeType !== 'ALL' ? { type: activeType as SermonType } : {}),
      ...(searchParams.q ? { title: { contains: searchParams.q, mode: 'insensitive' } } : {}),
    },
    include: { speaker: true, series: true },
    orderBy: { publishedAt: 'desc' },
    take,
  })

  const hasMore = sermons.length === take

  return (
    <div className="min-h-screen bg-brand-navy pt-24">
      {/* Header */}
      <section className="section-padding-sm bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-30 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60">
          <SignatureHalo size={500} />
        </div>
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
          <form action="/sermons" method="GET" className="relative flex-1 max-w-md w-full">
            {activeType !== 'ALL' && <input type="hidden" name="type" value={activeType} />}
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="search"
              name="q"
              defaultValue={searchParams.q ?? ''}
              placeholder="Search sermons..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-white/10 bg-white/5 text-sm text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold/40 transition-colors"
            />
          </form>
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <Link
                key={f.value}
                href={f.value === 'ALL' ? '/sermons' : `/sermons?type=${f.value}`}
                className={cn(
                  'px-4 py-2 rounded-full text-sm transition-colors border',
                  activeType === f.value
                    ? 'bg-brand-gold text-brand-navy border-brand-gold'
                    : 'text-text-muted border-transparent hover:text-white hover:bg-white/10 hover:border-white/15'
                )}
              >
                {f.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sermons grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-7xl">
          {sermons.length === 0 ? (
            <div className="text-center py-24 glass-card rounded-2xl">
              <Film className="h-10 w-10 text-text-muted mx-auto mb-3 opacity-30" />
              <p className="text-text-muted">No sermons found. Check back soon.</p>
            </div>
          ) : (
            <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sermons.map((sermon, i) => {
                const accent = ['gold', 'teal', 'magenta'][i % 3]
                const seriesAccent =
                  accent === 'teal' ? 'text-brand-teal-light' : accent === 'magenta' ? 'text-brand-magenta-light' : 'text-brand-gold'
                return (
                <StaggerItem key={sermon.id}>
                  <Link href={`/sermons/${sermon.slug}`} className="block group">
                    <div className="glass-card rounded-2xl overflow-hidden glass-card-interactive relative">
                      {i === 0 && <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-regal z-10" />}
                      {/* Thumbnail */}
                      <div className="relative aspect-video overflow-hidden bg-white/5">
                        {sermon.thumbnailUrl ? (
                          <Image
                            src={sermon.thumbnailUrl}
                            alt={sermon.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-[#0d1e3a] to-brand-blue" />
                        )}
                        <div className="absolute inset-0 bg-brand-navy/30 group-hover:bg-brand-navy/10 transition-colors" />

                        {/* Play button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-14 h-14 rounded-full bg-brand-gold/90 flex items-center justify-center shadow-gold">
                            <Play className="h-5 w-5 text-brand-navy fill-current ml-0.5" />
                          </div>
                        </div>

                        {/* Duration */}
                        {sermon.duration && (
                          <div className="absolute bottom-2.5 right-2.5 glass-card rounded-full px-2.5 py-1 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-brand-gold" />
                            <span className="text-xs text-white font-medium">
                              {formatDuration(sermon.duration)}
                            </span>
                          </div>
                        )}

                        {/* Type badge */}
                        <div className="absolute top-2.5 left-2.5">
                          <Badge variant={sermon.type === 'AUDIO' ? 'blue' : 'gold'}>
                            {sermon.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        {sermon.series && (
                          <div className={`text-xs font-medium mb-2 ${seriesAccent}`}>{sermon.series.title}</div>
                        )}
                        <h3 className="font-display font-semibold text-white text-base mb-2 group-hover:text-brand-gold transition-colors line-clamp-2">
                          {sermon.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-text-muted mb-3">
                          <MicVocal className="h-3 w-3" />
                          {sermon.speaker?.name}
                          {sermon.speaker && sermon.publishedAt && ' • '}
                          {sermon.publishedAt && format(new Date(sermon.publishedAt), 'MMM d, yyyy')}
                        </div>
                        {sermon.scriptureRef && (
                          <span className="text-xs text-text-muted italic">{sermon.scriptureRef}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </StaggerItem>
                )
              })}
            </StaggerChildren>
          )}

          {/* Load more */}
          {hasMore && (
            <FadeInUp className="text-center mt-12">
              <Link
                href={`/sermons?${new URLSearchParams({
                  ...(searchParams.q ? { q: searchParams.q } : {}),
                  ...(activeType !== 'ALL' ? { type: activeType } : {}),
                  take: String(take + PAGE_SIZE),
                }).toString()}`}
                className="btn-outline-gold"
              >
                Load More Sermons
              </Link>
            </FadeInUp>
          )}
        </div>
      </section>
    </div>
  )
}
