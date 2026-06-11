import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { CountUp } from '@/components/motion/CountUp'
import { Globe, MapPin, Heart, Wifi } from 'lucide-react'

const regions = [
  { region: 'Africa', countries: 38, flag: '🌍' },
  { region: 'Americas', countries: 22, flag: '🌎' },
  { region: 'Europe', countries: 18, flag: '🌍' },
  { region: 'Asia Pacific', countries: 28, flag: '🌏' },
  { region: 'Middle East', countries: 8, flag: '🌍' },
  { region: 'Online Global', countries: 120, flag: '💻' },
]

const impactStats = [
  { icon: Globe, value: 120, suffix: '+', label: 'Nations with GGCC presence' },
  { icon: Heart, value: 250000, suffix: '+', label: 'Lives impacted annually' },
  { icon: MapPin, value: 85, suffix: '+', label: 'Local partner churches' },
  { icon: Wifi, value: 1200000, suffix: '+', label: 'Online viewers per year' },
]

export function GlobalImpact() {
  return (
    <section className="section-padding bg-brand-blue relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-grid opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative">
        <FadeInUp className="text-center mb-14">
          <span className="section-label mb-4 inline-flex justify-center">Global Impact</span>
          <h2 className="text-display-md font-display text-white mb-4">
            Reaching{' '}
            <GoldShimmer>Every Nation</GoldShimmer>
          </h2>
          <p className="text-body-lg text-text-muted max-w-xl mx-auto">
            From local communities to international networks, the Great Commission drives everything we do.
          </p>
        </FadeInUp>

        {/* Impact stats */}
        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {impactStats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-6 w-6 text-brand-gold" />
                </div>
                <div className="font-display font-bold text-2xl text-brand-gold mb-1">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-text-muted leading-snug">{stat.label}</div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Region breakdown */}
        <FadeInUp>
          <div className="glass-card rounded-3xl p-8">
            <h3 className="font-display font-semibold text-white text-xl mb-6 text-center">
              Our Presence by Region
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {regions.map((r) => (
                <div
                  key={r.region}
                  className="text-center p-4 rounded-xl bg-white/5 border border-white/8 hover:border-brand-gold/30 transition-colors"
                >
                  <div className="text-2xl mb-2">{r.flag}</div>
                  <div className="font-bold text-brand-gold text-lg">{r.countries}</div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {r.region === 'Online Global' ? 'nations online' : 'countries'}
                  </div>
                  <div className="text-xs text-white/60 mt-1">{r.region}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}
