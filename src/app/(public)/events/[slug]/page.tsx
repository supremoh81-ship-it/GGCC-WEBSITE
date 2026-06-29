import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Calendar, MapPin, Clock, Users, Video, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await prisma.event.findUnique({ where: { slug: params.slug } })
  if (!event) return { title: 'Event Not Found' }
  return {
    title: `${event.title} | GGCC Events`,
    description: event.description ?? undefined,
    openGraph: {
      title: event.title,
      description: event.description ?? undefined,
      images: event.bannerUrl ? [event.bannerUrl] : [],
    },
  }
}

export default async function EventDetailPage({ params }: Props) {
  const event = await prisma.event.findUnique({
    where: { slug: params.slug },
    include: {
      _count: { select: { registrations: true } },
    },
  })

  if (!event || event.status !== 'PUBLISHED') notFound()

  const registrationCount = event._count.registrations
  const capacityFull = event.capacity ? registrationCount >= event.capacity : false
  const spotsLeft = event.capacity ? event.capacity - registrationCount : null
  const isPast = event.endDate ? new Date(event.endDate) < new Date() : new Date(event.startDate) < new Date()

  const typeLabel = event.type === 'IN_PERSON' ? 'In Person' : event.type === 'ONLINE' ? 'Online' : 'Hybrid'

  return (
    <main className="min-h-screen bg-brand-navy">
      {event.bannerUrl && (
        <div className="relative h-72 sm:h-96 overflow-hidden">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
        </div>
      )}

      <div className={`${event.bannerUrl ? '-mt-40 relative z-10' : 'pt-24'} container mx-auto px-4 sm:px-6 max-w-5xl pb-24`}>
        <FadeInUp>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All Events
          </Link>
        </FadeInUp>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <FadeInUp>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="gold" className="text-xs">{typeLabel}</Badge>
                {event.requiresTicket && (
                  <Badge variant="muted" className="text-xs">
                    {event.ticketPrice ? `$${Number(event.ticketPrice).toFixed(2)} ticket` : 'Free Registration'}
                  </Badge>
                )}
                {isPast && <Badge variant="danger" className="text-xs">Past Event</Badge>}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
                {event.title}
              </h1>

              {event.description && (
                <p className="text-text-muted text-lg leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              )}
            </FadeInUp>

            <FadeInUp>
              <div className="glass-card rounded-2xl p-6 grid sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-brand-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-text-muted uppercase tracking-widest mb-1">Date</div>
                    <div className="text-white font-medium">
                      {format(new Date(event.startDate), 'EEEE, MMMM d, yyyy')}
                    </div>
                    {event.endDate && format(new Date(event.startDate), 'yyyy-MM-dd') !== format(new Date(event.endDate), 'yyyy-MM-dd') && (
                      <div className="text-text-muted text-sm">
                        to {format(new Date(event.endDate), 'MMMM d, yyyy')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-brand-gold mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-text-muted uppercase tracking-widest mb-1">Time</div>
                    <div className="text-white font-medium">
                      {format(new Date(event.startDate), 'h:mm a')}
                      {event.endDate && ` - ${format(new Date(event.endDate), 'h:mm a')}`}
                    </div>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-brand-gold mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-text-muted uppercase tracking-widest mb-1">Location</div>
                      <div className="text-white font-medium">{event.location}</div>
                    </div>
                  </div>
                )}

                {event.onlineUrl && (
                  <div className="flex items-start gap-3">
                    <Video className="h-5 w-5 text-brand-gold mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-text-muted uppercase tracking-widest mb-1">Online Access</div>
                      <a
                        href={event.onlineUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-gold hover:underline text-sm flex items-center gap-1"
                      >
                        Join Online <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}

                {event.capacity && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-brand-gold mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-text-muted uppercase tracking-widest mb-1">Capacity</div>
                      <div className="text-white font-medium">{registrationCount} / {event.capacity} registered</div>
                      {spotsLeft !== null && spotsLeft <= 20 && spotsLeft > 0 && (
                        <div className="text-brand-gold text-xs mt-0.5">Only {spotsLeft} spots left</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </FadeInUp>
          </div>

          <div className="space-y-5">
            <FadeInUp>
              <div className="glass-card rounded-2xl p-5">
                {isPast ? (
                  <div className="text-center py-4">
                    <p className="text-text-muted text-sm mb-3">This event has already taken place.</p>
                    <Link href="/events" className="btn-outline text-sm w-full text-center block">
                      Upcoming Events
                    </Link>
                  </div>
                ) : capacityFull ? (
                  <div className="text-center py-4">
                    <p className="text-text-muted text-sm mb-3">Registration is full.</p>
                    <Button variant="ghost" disabled className="w-full opacity-50">Fully Booked</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-center mb-2">
                      <div className="text-lg font-display font-bold text-brand-gold">
                        {event.requiresTicket && event.ticketPrice
                          ? `$${Number(event.ticketPrice).toFixed(2)}`
                          : 'Free'}
                      </div>
                      <div className="text-xs text-text-muted">per person</div>
                    </div>
                    <Link
                      href={`/events/${event.slug}/register`}
                      className="btn-gold w-full text-center block text-sm"
                    >
                      Register Now
                    </Link>
                    {spotsLeft !== null && (
                      <p className="text-center text-xs text-text-muted">
                        {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} remaining
                      </p>
                    )}
                  </div>
                )}
              </div>
            </FadeInUp>

            <FadeInUp>
              <div className="glass-card rounded-2xl p-5 space-y-3">
                <h3 className="text-xs text-text-muted uppercase tracking-widest">Share this Event</h3>
                <div className="flex gap-2">
                  {['Facebook', 'Twitter', 'WhatsApp'].map((platform) => (
                    <button
                      key={platform}
                      className="flex-1 text-xs text-text-muted hover:text-white py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </div>
    </main>
  )
}
