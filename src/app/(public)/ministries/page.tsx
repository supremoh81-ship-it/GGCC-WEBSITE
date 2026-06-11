import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Users, Music, BookOpen, Heart, Globe, Baby, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ministries',
  description: 'Discover and join GGCC ministry teams. Find your place to serve and grow.',
}

const ministries = [
  {
    slug: 'worship',
    name: 'Worship Ministry',
    tagline: 'Leading hearts to encounter God',
    description: 'Our worship team creates Spirit-filled environments where people encounter God. We welcome singers, musicians, and technical artists.',
    icon: Music,
    color: '#C9A84C',
    memberCount: 84,
    meetingSchedule: 'Wednesdays, 7 PM',
  },
  {
    slug: 'youth',
    name: 'Youth & Young Adults',
    tagline: 'Shaping the next generation',
    description: 'A vibrant community for ages 13-35, focused on discipleship, community, and equipping the next generation of leaders.',
    icon: Users,
    color: '#5B8DD9',
    memberCount: 210,
    meetingSchedule: 'Saturdays, 5 PM',
  },
  {
    slug: 'bible-study',
    name: 'Bible Study',
    tagline: 'Rooted in the Word',
    description: 'In-depth, transformative study of scripture in small group settings. We believe the Word of God changes lives.',
    icon: BookOpen,
    color: '#56B87D',
    memberCount: 156,
    meetingSchedule: 'Tuesdays, 6:30 PM',
  },
  {
    slug: 'prayer-warriors',
    name: 'Prayer Warriors',
    tagline: 'Interceding for the world',
    description: 'Dedicated intercessors who stand in the gap for the church, community, and nations through regular prayer.',
    icon: Heart,
    color: '#E85D75',
    memberCount: 320,
    meetingSchedule: 'Daily, 6 AM',
  },
  {
    slug: 'missions',
    name: 'Missions & Outreach',
    tagline: 'Serving our city and nations',
    description: 'We believe in tangible love. Our missions team runs local community programs and supports global church planting.',
    icon: Globe,
    color: '#9B72CF',
    memberCount: 98,
    meetingSchedule: 'Monthly, 3rd Sunday',
  },
  {
    slug: 'childrens',
    name: "Children's Ministry",
    tagline: 'Nurturing faith from the start',
    description: 'Safe, fun, and spiritually rich programs that introduce children to God and build lifelong foundations of faith.',
    icon: Baby,
    color: '#F0A500',
    memberCount: 135,
    meetingSchedule: 'Sundays, 9 AM',
  },
]

export default function MinistriesPage() {
  return (
    <div className="min-h-screen bg-brand-navy pt-24">
      <section className="section-padding-sm bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-30 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative">
          <FadeInUp className="text-center">
            <span className="section-label mb-4 inline-flex justify-center">Our Ministries</span>
            <h1 className="text-display-lg font-display text-white mb-4">
              Find Your <GoldShimmer>Place to Serve</GoldShimmer>
            </h1>
            <p className="text-body-lg text-text-muted max-w-xl mx-auto">
              Every believer is gifted. Every gift is needed. Find the ministry where yours will flourish.
            </p>
          </FadeInUp>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-7xl">
          <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ministries.map((ministry) => (
              <StaggerItem key={ministry.slug}>
                <div className="glass-card rounded-2xl p-7 h-full flex flex-col gap-5">
                  <div className="flex items-start justify-between">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${ministry.color}20`, border: `1px solid ${ministry.color}35` }}
                    >
                      <ministry.icon className="h-7 w-7" style={{ color: ministry.color }} />
                    </div>
                    <span className="text-xs text-text-muted">{ministry.memberCount} members</span>
                  </div>

                  <div>
                    <h2 className="font-display font-bold text-white text-xl mb-1">{ministry.name}</h2>
                    <p className="text-sm font-medium" style={{ color: ministry.color }}>{ministry.tagline}</p>
                  </div>

                  <p className="text-sm text-text-muted leading-relaxed flex-1">{ministry.description}</p>

                  <div className="pt-4 border-t border-white/8 flex items-center justify-between">
                    <div className="text-xs text-text-muted">{ministry.meetingSchedule}</div>
                    <Link
                      href={`/ministries/${ministry.slug}`}
                      className="flex items-center gap-1 text-sm font-semibold transition-colors hover:opacity-80"
                      style={{ color: ministry.color }}
                    >
                      Join
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>
    </div>
  )
}
