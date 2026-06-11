import Link from 'next/link'
import Image from 'next/image'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Calendar, MapPin, Clock, ArrowRight, Users } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

const events = [
  {
    id: '1',
    title: 'Annual Praise & Worship Night',
    date: 'June 28, 2025',
    time: '6:00 PM',
    location: 'Main Sanctuary',
    type: 'IN_PERSON',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80',
    registrations: 342,
    slug: 'annual-praise-worship-night',
  },
  {
    id: '2',
    title: 'Leadership Development Summit',
    date: 'July 5, 2025',
    time: '9:00 AM',
    location: 'Online via Zoom',
    type: 'ONLINE',
    image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600&q=80',
    registrations: 189,
    slug: 'leadership-development-summit',
  },
  {
    id: '3',
    title: 'Youth Retreat 2025: Ignite',
    date: 'July 18-20, 2025',
    time: 'Multi-day',
    location: 'Grace Camp, Hillside',
    type: 'IN_PERSON',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    registrations: 85,
    slug: 'youth-retreat-2025',
  },
]

export function UpcomingEvents() {
  return (
    <section className="section-padding bg-brand-blue relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
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

        <StaggerChildren className="grid md:grid-cols-3 gap-6">
          {events.map((event) => (
            <StaggerItem key={event.id}>
              <Link href={`/events/${event.slug}`} className="block group">
                <div className="glass-card rounded-2xl overflow-hidden glass-card-interactive">
                  {/* Image */}
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge variant={event.type === 'ONLINE' ? 'blue' : 'gold'}>
                        {event.type === 'ONLINE' ? 'Online' : 'In Person'}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-white text-base mb-3 group-hover:text-brand-gold transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Calendar className="h-3.5 w-3.5 text-brand-gold flex-shrink-0" />
                        {event.date} &bull; {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <MapPin className="h-3.5 w-3.5 text-brand-gold flex-shrink-0" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-muted">
                        <Users className="h-3.5 w-3.5 text-brand-gold flex-shrink-0" />
                        {event.registrations} registered
                      </div>
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
      </div>
    </section>
  )
}
