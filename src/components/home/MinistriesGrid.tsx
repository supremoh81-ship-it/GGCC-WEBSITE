import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Users, Music, BookOpen, Heart, Globe, Baby, ChevronRight } from 'lucide-react'

const ministries = [
  {
    name: 'Worship Ministry',
    tagline: 'Leading hearts to encounter God',
    icon: Music,
    color: '#C9A84C',
    slug: 'worship',
    memberCount: 84,
  },
  {
    name: 'Youth & Young Adults',
    tagline: 'Shaping the next generation',
    icon: Users,
    color: '#5B8DD9',
    slug: 'youth',
    memberCount: 210,
  },
  {
    name: 'Bible Study',
    tagline: 'Rooted in the Word',
    icon: BookOpen,
    color: '#56B87D',
    slug: 'bible-study',
    memberCount: 156,
  },
  {
    name: 'Prayer Warriors',
    tagline: 'Interceding for the world',
    icon: Heart,
    color: '#E85D75',
    slug: 'prayer-warriors',
    memberCount: 320,
  },
  {
    name: 'Missions & Outreach',
    tagline: 'Serving our city and nations',
    icon: Globe,
    color: '#9B72CF',
    slug: 'missions',
    memberCount: 98,
  },
  {
    name: "Children's Ministry",
    tagline: 'Nurturing faith from the start',
    icon: Baby,
    color: '#F0A500',
    slug: 'childrens',
    memberCount: 135,
  },
]

export function MinistriesGrid() {
  return (
    <section className="section-padding bg-brand-navy relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <FadeInUp className="text-center mb-14">
          <span className="section-label mb-4 inline-flex justify-center">Our Ministries</span>
          <h2 className="text-display-md font-display text-white mb-4">
            Find Your{' '}
            <GoldShimmer>Place to Belong</GoldShimmer>
          </h2>
          <p className="text-body-lg text-text-muted max-w-xl mx-auto">
            Every believer has a role to play. Join a ministry and start making a difference today.
          </p>
        </FadeInUp>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {ministries.map((ministry) => (
            <StaggerItem key={ministry.slug}>
              <Link href={`/ministries/${ministry.slug}`} className="block group">
                <div
                  className="glass-card rounded-2xl p-6 glass-card-interactive h-full"
                  style={{ '--ministry-color': ministry.color } as React.CSSProperties}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${ministry.color}20`,
                        border: `1px solid ${ministry.color}35`,
                      }}
                    >
                      <ministry.icon
                        className="h-6 w-6"
                        style={{ color: ministry.color }}
                      />
                    </div>
                    <span className="text-xs text-text-muted">{ministry.memberCount} members</span>
                  </div>

                  <h3 className="font-display font-bold text-white text-lg mb-1.5 group-hover:text-brand-gold transition-colors">
                    {ministry.name}
                  </h3>
                  <p className="text-sm text-text-muted mb-4">{ministry.tagline}</p>

                  <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: ministry.color }}>
                    Join Ministry
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeInUp className="text-center">
          <Link href="/ministries" className="btn-outline-gold">
            View All Ministries
          </Link>
        </FadeInUp>
      </div>
    </section>
  )
}
