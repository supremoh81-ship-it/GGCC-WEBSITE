import Link from 'next/link'
import Image from 'next/image'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Calendar, MapPin, ArrowRight, Star, Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'

export async function UpcomingEvents() {
  const [featuredEvent, upcomingEvents] = await Promise.all([
    prisma.event.findFirst({
      where: { status: 'PUBLISHED', isFeatured: true },
      orderBy: { startDate: 'asc' },
    }),
    prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        isFeatured: false,
        startDate: { gte: new Date() },
      },
      orderBy: { startDate: 'asc' },
      take: 3,
    }),
  ])

  if (!featuredEvent && upcomingEvents.length === 0) return null

  return (
    <section className="section-padding bg-brand-blue relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-dots opacity-20 pointer-events-none" />
      <div className="container mx-auto px-4 max-w-7xl relative">
        <FadeInUp className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="section-label mb-4 inline-flex">Upcoming Events</span>
            <h2 className="text-display-md font-display text-white">
              Join Us{' '}
              <GoldShimmer>In Person</GoldShimmer>{' '}
              or Online
            </h2>
          </div>
          <Link href="/events" className="btn-outline-gold shrink-0">
            View All Events
            <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeInUp>

        {/* Featured conference / flagship event */}
        {featuredEvent && (
          <FadeInUp className="mb-10">
            <Link href={`/events/${featuredEvent.slug}`} className="block group">
              <div className="relative rounded-3xl overflow-hidden border border-brand-gold/40 shadow-[0_0_60px_rgba(201,168,76,0.15)]">
                {/* Background: use bannerUrl if available, else cinematic gradient */}
                {featuredEvent.bannerUrl ? (
                  <div className="relative h-72 sm:h-96 md:h-[420px]">
                    <Image
                      src={featuredEvent.bannerUrl}
                      alt={featuredEvent.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/96 via-brand-navy/75 to-brand-navy/20" />
                  </div>
                ) : (
                  <div className="relative h-72 sm:h-96 md:h-[420px] bg-gradient-to-br from-brand-navy via-[#0d1e3a] to-[#142b50]">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_100%_50%,rgba(201,168,76,0.18)_0%,transparent_70%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_80%_at_0%_50%,rgba(15,35,71,0.8)_0%,transparent_60%)]" />
                    {/* Decorative text watermark */}
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 select-none pointer-events-none">
                      <div className="font-display font-black text-[96px] sm:text-[140px] leading-none text-white/[0.04] tracking-[-0.04em]">
                        2026
                      </div>
                    </div>
                  </div>
                )}

                {/* Content overlay */}
                <div className="absolute inset-0 flex items-center p-8 sm:p-12">
                  <div className="max-w-xl">
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="h-3.5 w-3.5 text-brand-gold fill-current" />
                      <span className="text-xs font-bold tracking-[0.2em] text-brand-gold uppercase">
                        Featured Event
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-white text-2xl sm:text-3xl md:text-4xl mb-3 leading-tight">
                      {featuredEvent.title}
                    </h3>

                    {featuredEvent.description && (
                      <p className="text-text-secondary text-sm sm:text-base mb-5 line-clamp-2 max-w-lg">
                        {featuredEvent.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-7">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-brand-gold flex-shrink-0" />
                        <span>
                          {format(new Date(featuredEvent.startDate), 'EEE, MMMM d')}
                          {featuredEvent.endDate &&
                            ` – ${format(new Date(featuredEvent.endDate), 'MMMM d, yyyy')}`}
                        </span>
                      </div>
                      {featuredEvent.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-brand-gold flex-shrink-0" />
                          <span className="line-clamp-1">{featuredEvent.location}</span>
                        </div>
                      )}
                    </div>

                    <span className="btn-gold inline-flex items-center gap-2 group-hover:shadow-gold transition-shadow">
                      Learn More &amp; Register
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>

                {/* Gold accent line */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-regal" />
              </div>
            </Link>
          </FadeInUp>
        )}

        {/* Regular upcoming events grid */}
        {upcomingEvents.length > 0 && (
          <StaggerChildren className="grid md:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <StaggerItem key={event.id}>
                <Link href={`/events/${event.slug}`} className="block group">
                  <div className="glass-card rounded-2xl overflow-hidden glass-card-interactive">
                    <div className="relative aspect-video overflow-hidden bg-white/5">
                      {event.bannerUrl || event.thumbnailUrl ? (
                        <Image
                          src={(event.bannerUrl || event.thumbnailUrl)!}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy to-brand-blue" />
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge variant={event.type === 'ONLINE' ? 'blue' : 'gold'}>
                          {event.type === 'ONLINE' ? 'Online' : event.type === 'HYBRID' ? 'Hybrid' : 'In Person'}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-display font-semibold text-white text-base mb-3 group-hover:text-brand-gold transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <Calendar className="h-3.5 w-3.5 text-brand-gold flex-shrink-0" />
                          {format(new Date(event.startDate), 'MMMM d, yyyy')}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-xs text-text-muted">
                            <MapPin className="h-3.5 w-3.5 text-brand-gold flex-shrink-0" />
                            {event.location}
                          </div>
                        )}
                        {event.capacity && (
                          <div className="flex items-center gap-2 text-xs text-text-muted">
                            <Users className="h-3.5 w-3.5 text-brand-gold flex-shrink-0" />
                            Up to {event.capacity.toLocaleString()} attendees
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/8">
                        <span className="text-xs font-semibold text-brand-gold">
                          Register Now &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>
        )}
      </div>
    </section>
  )
}
