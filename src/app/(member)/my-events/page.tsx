import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { Badge } from '@/components/ui/Badge'
import { Calendar, MapPin, Plus, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'

export const metadata: Metadata = { title: 'My Events' }

export default async function MyEventsPage() {
  const session = await auth()
  const userId = session!.user.id

  const registrations = await prisma.eventRegistration.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          slug: true,
          startDate: true,
          location: true,
          type: true,
          bannerUrl: true,
        },
      },
    },
  })

  const upcoming = registrations.filter(
    (r) => new Date(r.event.startDate) >= new Date()
  )
  const past = registrations.filter(
    (r) => new Date(r.event.startDate) < new Date()
  )

  const EventCard = ({ reg }: { reg: (typeof registrations)[0] }) => (
    <div className="glass-card rounded-2xl p-5 flex items-start gap-4">
      <div className="w-14 h-14 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex flex-col items-center justify-center flex-shrink-0">
        <span className="text-xs text-brand-gold font-semibold">
          {format(new Date(reg.event.startDate), 'MMM')}
        </span>
        <span className="text-lg font-display font-bold text-white leading-none">
          {format(new Date(reg.event.startDate), 'd')}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link
            href={`/events/${reg.event.slug}`}
            className="text-sm font-semibold text-white hover:text-brand-gold transition-colors line-clamp-1"
          >
            {reg.event.title}
          </Link>
          <Badge
            variant={reg.checkedIn ? 'success' : 'gold'}
            className="text-[10px] flex-shrink-0"
          >
            {reg.checkedIn ? 'Attended' : 'Registered'}
          </Badge>
        </div>
        {reg.event.location && (
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <MapPin className="h-3 w-3" />
            {reg.event.location}
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
          <Calendar className="h-3 w-3" />
          {format(new Date(reg.event.startDate), 'EEEE, MMMM d, yyyy')}
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 max-w-3xl">
      <FadeInUp className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">My Events</h1>
          <p className="text-text-muted mt-1">Your event registrations and attendance history.</p>
        </div>
        <Link href="/events" className="btn-gold text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Find Events
        </Link>
      </FadeInUp>

      {registrations.length === 0 ? (
        <FadeInUp>
          <div className="glass-card rounded-2xl p-12 text-center">
            <Calendar className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <h3 className="font-display font-semibold text-white text-lg mb-2">
              No event registrations yet
            </h3>
            <p className="text-text-muted mb-6 text-sm">
              Explore upcoming events and register to be part of what God is doing.
            </p>
            <Link href="/events" className="btn-gold">Browse Events</Link>
          </div>
        </FadeInUp>
      ) : (
        <>
          {upcoming.length > 0 && (
            <FadeInUp>
              <h2 className="font-display font-semibold text-white mb-4">
                Upcoming ({upcoming.length})
              </h2>
              <div className="space-y-3">
                {upcoming.map((r) => (
                  <EventCard key={r.id} reg={r} />
                ))}
              </div>
            </FadeInUp>
          )}

          {past.length > 0 && (
            <FadeInUp>
              <h2 className="font-display font-semibold text-white mb-4">
                Past Events ({past.length})
              </h2>
              <div className="space-y-3 opacity-70">
                {past.map((r) => (
                  <EventCard key={r.id} reg={r} />
                ))}
              </div>
            </FadeInUp>
          )}

          <FadeInUp>
            <Link
              href="/events"
              className="flex items-center justify-center gap-2 glass-card rounded-xl py-4 text-sm text-brand-gold hover:border-brand-gold/30 transition-all"
            >
              Explore more events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeInUp>
        </>
      )}
    </div>
  )
}
