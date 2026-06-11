import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { CountUp } from '@/components/motion/CountUp'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Eye, Target, Flame, Globe } from 'lucide-react'

const pillars = [
  {
    icon: Eye,
    title: 'Our Vision',
    body: 'To be a global light bearer, raising spiritually mature disciples who transform every sphere of society with the love and truth of Jesus Christ.',
  },
  {
    icon: Target,
    title: 'Our Mission',
    body: 'To connect, equip, and deploy believers to fulfill their God-given purpose through Spirit-led worship, discipleship, community, and world outreach.',
  },
  {
    icon: Flame,
    title: 'Our Values',
    body: 'Reverence for God. Radical love for people. Relentless pursuit of excellence. Responsibility to community. Resilience through faith.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    body: 'From our local roots to nations across six continents, our presence, partnerships, and prayer networks continue to expand the Kingdom.',
  },
]

const stats = [
  { end: 50000, suffix: '+', label: 'Members Worldwide' },
  { end: 120, suffix: '+', label: 'Nations Reached' },
  { end: 1500, suffix: '+', label: 'Sermons Archived' },
  { end: 15, suffix: 'yrs', label: 'Years of Ministry' },
]

export function VisionMission() {
  return (
    <section className="section-padding bg-brand-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-dots opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative">
        {/* Header */}
        <FadeInUp className="text-center mb-16">
          <span className="section-label mb-4 inline-flex justify-center">Our Foundation</span>
          <h2 className="text-display-lg font-display text-white mb-4">
            Built on{' '}
            <GoldShimmer>Purpose</GoldShimmer>,{' '}
            guided by <GoldShimmer>Faith</GoldShimmer>
          </h2>
          <p className="text-body-lg text-text-muted max-w-2xl mx-auto text-balance">
            Everything we do flows from a clear sense of who we are, why we exist,
            and where God is calling us to go.
          </p>
        </FadeInUp>

        {/* Pillars grid */}
        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {pillars.map((pillar) => (
            <StaggerItem key={pillar.title}>
              <div className="glass-card rounded-2xl p-7 h-full flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0">
                  <pillar.icon className="h-6 w-6 text-brand-gold" />
                </div>
                <h3 className="font-display font-bold text-white text-lg">{pillar.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed flex-1">{pillar.body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Stats */}
        <FadeInUp>
          <div className="glass-card rounded-3xl p-10 grid grid-cols-2 lg:grid-cols-4 gap-10">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display font-bold text-3xl lg:text-4xl text-brand-gold mb-2">
                  <CountUp end={stat.end} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-text-muted tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}
