import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Badge } from '@/components/ui/Badge'
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Events',
  description: 'Browse upcoming GGCC events, services, retreats, and conferences. Register online.',
}

const events = [
  {
    slug: 'annual-praise-worship-night',
    title: 'Annual Praise & Worship Night',
    description: 'An evening of Spirit-led worship with our full praise team and guest worship leaders.',
    date: 'June 28, 2025',
    time: '6:00 PM',
    endTime: '10:00 PM',
    location: 'Main Sanctuary',
    address: '100 Grace Avenue, City',
    type: 'IN_PERSON',
    category: 'Worship',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    registrations: 342,
    capacity: 800,
    isFree: true,
  },
  {
    slug: 'leadership-development-summit',
    title: 'Leadership Development Summit',
    description: 'An intensive one-day training for current and emerging leaders in the church.',
    date: 'July 5, 2025',
    time: '9:00 AM',
    endTime: '5:00 PM',
    location: 'Online via Zoom',
    address: null,
    type: 'ONLINE',
    category: 'Training',
    image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=80',
    registrations: 189,
    capacity: 500,
    isFree: true,
  },
  {
    slug: 'youth-retreat-2025',
    title: 'Youth Retreat 2025: Ignite',
    description: 'Three days of worship, discipleship, outdoor activities, and deep community for young adults.',
    date: 'July 18-20, 2025',
    time: 'Multi-day',
    endTime: null,
    location: 'Grace Camp, Hillside',
    address: '55 Mountain Road, Hillside',
    type: 'IN_PERSON',
    category: 'Retreat',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
    registrations: 85,
    capacity: 150,
    isFree: false,
  },
  {
    slug: 'global-missions-conference',
    title: 'Global Missions Conference',
    description: 'A weekend gathering of missionaries, intercessors, and mission-minded believers from around the world.',
    date: 'August 15-17, 2025',
    time: 'Multi-day',
    endTime: null,
    location: 'Main Campus + Online',
    address: '100 Grace Avenue, City',
    type: 'HYBRID',
    category: 'Conference',
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
    registrations: 612,
    capacity: 1200,
    isFree: false,
  },
]

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-brand-navy pt-24">
      <section className="section-padding-sm bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-30 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative">
          <FadeInUp className="text-center">
            <span className="section-label mb-4 inline-flex justify-center">Events</span>
            <h1 className="text-display-lg font-display text-white mb-4">
              Experience <GoldShimmer>Community</GoldShimmer>
            </h1>
            <p className="text-body-lg text-text-muted max-w-xl mx-auto">
              From Sunday services to global conferences, there is always something happening at GGCC.
            </p>
          </FadeInUp>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Filter row */}
          <FadeInUp className="flex flex-wrap gap-2 mb-10">
            {['All', 'In Person', 'Online', 'Hybrid', 'Free', 'This Month'].map((f) => (
              <button
                key={f}
                className="px-4 py-2 rounded-full text-sm border border-white/10 text-text-muted hover:text-white hover:border-brand-gold/40 transition-colors"
              >
                {f}
              </button>
            ))}
          </FadeInUp>

          <StaggerChildren className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <StaggerItem key={event.slug}>
                <Link href={`/events/${event.slug}`} className="block group">
                  <div className="glass-card rounded-2xl overflow-hidden glass-card-interactive">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant={event.type === 'ONLINE' ? 'teal' : event.type === 'HYBRID' ? 'magenta' : 'gold'}>
                          {event.type.replace('_', ' ')}
                        </Badge>
                        <Badge variant="muted">{event.category}</Badge>
                      </div>
                      {event.isFree && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="success">Free</Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="font-display font-semibold text-white text-xl mb-2 group-hover:text-brand-gold transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-text-muted mb-4 line-clamp-2">{event.description}</p>

                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <Calendar className="h-3.5 w-3.5 text-brand-gold" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <Clock className="h-3.5 w-3.5 text-brand-gold" />
                          {event.time}{event.endTime && ` - ${event.endTime}`}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <MapPin className="h-3.5 w-3.5 text-brand-gold" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-muted">
                          <Users className="h-3.5 w-3.5 text-brand-gold" />
                          {event.registrations} / {event.capacity} registered
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/8">
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
    </div>
  )
}
