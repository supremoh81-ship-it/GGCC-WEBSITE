import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Play, Download, BookOpen, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { FeaturedSermonPlayer } from '@/components/sermons/FeaturedSermonPlayer'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export async function FeaturedSermon() {
  const sermon = await prisma.sermon.findFirst({
    where: { isFeatured: true, status: 'PUBLISHED' },
    include: { speaker: true, series: true },
    orderBy: { publishedAt: 'desc' },
  })

  if (!sermon) return null

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
              <FeaturedSermonPlayer
                videoUrl={sermon.videoUrl}
                thumbnailUrl={sermon.thumbnailUrl}
                title={sermon.title}
                duration={sermon.duration ? formatDuration(sermon.duration) : undefined}
              />

              {/* Content */}
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex flex-wrap gap-2 mb-5">
                  {sermon.series && <Badge variant="gold">{sermon.series.title}</Badge>}
                  {sermon.scriptureRef && <Badge variant="blue">{sermon.scriptureRef}</Badge>}
                </div>

                <h3 className="font-display font-bold text-2xl lg:text-3xl text-white mb-3">
                  {sermon.title}
                </h3>

                <p className="text-sm text-brand-gold font-medium mb-4">
                  {sermon.speaker?.name}
                  {sermon.speaker && sermon.publishedAt && ' • '}
                  {sermon.publishedAt && format(new Date(sermon.publishedAt), 'MMMM d, yyyy')}
                </p>

                {sermon.description && (
                  <p className="text-body text-text-muted mb-8 leading-relaxed">
                    {sermon.description}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <Link href={`/sermons/${sermon.slug}`} className="btn-gold">
                    <Play className="h-4 w-4 fill-current" />
                    Watch Now
                  </Link>
                  {sermon.notes && (
                    <Link href={`/sermons/${sermon.slug}`} className="btn-ghost">
                      <Download className="h-4 w-4" />
                      Notes
                    </Link>
                  )}
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
