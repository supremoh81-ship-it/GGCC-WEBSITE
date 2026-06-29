import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { CountUp } from '@/components/motion/CountUp'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Eye, Target, Flame, Globe } from 'lucide-react'

const pillars = [
  {
    icon: Eye,
    title: 'Our Vision',
    body: 'We exist to see people saved, restored, discipled, equipped, and empowered to serve and to lead.',
  },
  {
    icon: Target,
    title: 'Our Mission',
    body: 'To heal a shattered world through God\'s kind love and birthing greatness in people.',
  },
  {
    icon: Flame,
    title: 'Our Values',
    body: 'Bible-Centered Preaching and Teaching, A Grace Orientation for Life, Evangelism, The Poor and Disenfranchised Matter to God, Sustained Excellence and Quality, Strong Family Ties and Fellowship, Discipleship and Christian Education, Giving — Tithing, Offerings, and Stewardship of Time, Self, Possessions and Influence, The Ordinances — Baptism and Holy Communion.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    body: 'From our local roots in Osogbo to our expanding presence across nations, Grace for Greatness Christian Center continues to extend God\'s kingdom through worship, prayer, discipleship, and purposeful service. Our vision includes planting churches locally and abroad, raising leaders of integrity, and establishing a Christian school to impact generations.',
  },
]

const stats = [
  { end: 10000, suffix: '+', label: 'Members Worldwide' },
  { end: 6, suffix: '+', label: 'Nations Reached' },
  { end: 780, suffix: '+', label: 'Sermons Archived' },
  { end: 5, suffix: 'yrs', label: 'Years of Ministry' },
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
          <p className="text-body-lg text-text-muted max-w-3xl mx-auto text-balance">
            Grace for Greatness Christian Center is built on the foundation of God&apos;s grace and purpose.
            Our ministry emphasis is <span className="text-white font-semibold">RESTORATION</span> — to lead people who feel their lives have been shattered
            back to God for total restoration by providing an atmosphere of grace, showing them God&apos;s kind of love,
            and bringing out the greatness in them through teaching God&apos;s word and empowering them to become great leaders.
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
