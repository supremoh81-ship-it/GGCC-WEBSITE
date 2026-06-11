import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { CountUp } from '@/components/motion/CountUp'
import { Globe, Heart, BookOpen, Home, Droplets, Users, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Global Impact',
  description: 'Discover how GGCC is reaching the nations with the Gospel, mercy outreaches, and church planting.',
}

const regions = [
  {
    name: 'West Africa',
    countries: ['Nigeria', 'Ghana', 'Senegal', 'Sierra Leone', 'Ivory Coast'],
    partners: 47,
    initiatives: ['Church planting', 'Medical missions', 'Clean water wells'],
    color: '#C9A84C',
  },
  {
    name: 'East Africa',
    countries: ['Kenya', 'Uganda', 'Tanzania', 'Ethiopia', 'Rwanda'],
    partners: 31,
    initiatives: ['School sponsorships', 'Pastoral training', 'Food security'],
    color: '#5B8DD9',
  },
  {
    name: 'Latin America',
    countries: ['Brazil', 'Colombia', 'Peru', 'Mexico', 'Argentina'],
    partners: 22,
    initiatives: ['Youth discipleship', 'Street outreach', 'Women empowerment'],
    color: '#56B87D',
  },
  {
    name: 'Asia Pacific',
    countries: ['India', 'Philippines', 'Indonesia', 'South Korea', 'Australia'],
    partners: 18,
    initiatives: ['Underground church support', 'Bible translation aid', 'Leadership schools'],
    color: '#E85D75',
  },
  {
    name: 'Middle East',
    countries: ['Lebanon', 'Jordan', 'Egypt', 'UAE', 'Turkey'],
    partners: 12,
    initiatives: ['Refugee ministry', 'House churches', 'Trauma healing'],
    color: '#9B72CF',
  },
  {
    name: 'Europe',
    countries: ['UK', 'Germany', 'France', 'Netherlands', 'Sweden'],
    partners: 15,
    initiatives: ['Diaspora ministry', 'Campus evangelism', 'Prayer networks'],
    color: '#F0A500',
  },
]

const initiatives = [
  {
    icon: Home,
    title: 'Church Planting',
    description: 'Establishing indigenous local churches in unreached communities across every region.',
    stat: 280,
    statLabel: 'churches planted',
  },
  {
    icon: BookOpen,
    title: 'Pastoral Training',
    description: 'Equipping local leaders through our Schools of Ministry and annual summit programs.',
    stat: 1200,
    statLabel: 'leaders trained',
  },
  {
    icon: Heart,
    title: 'Medical Missions',
    description: 'Annual medical outreach providing free healthcare to underserved communities.',
    stat: 45000,
    statLabel: 'patients treated',
  },
  {
    icon: Droplets,
    title: 'Clean Water',
    description: 'Drilling fresh water wells to transform the health of entire villages.',
    stat: 94,
    statLabel: 'wells drilled',
  },
  {
    icon: BookOpen,
    title: 'Education Aid',
    description: 'Sponsoring children and young adults through primary, secondary, and tertiary education.',
    stat: 3800,
    statLabel: 'students sponsored',
  },
  {
    icon: Users,
    title: 'Refugee Ministry',
    description: 'Providing practical and spiritual support to displaced families and communities.',
    stat: 12000,
    statLabel: 'individuals served',
  },
]

export default function GlobalImpactPage() {
  return (
    <div className="min-h-screen bg-brand-navy pt-24">
      {/* Hero */}
      <section className="section-padding bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-25 pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201, 168, 76, 0.4), transparent)' }}
        />
        <div className="container mx-auto px-4 max-w-7xl relative text-center">
          <FadeInUp>
            <Globe className="h-12 w-12 text-brand-gold mx-auto mb-5" />
            <span className="section-label mb-4 inline-flex justify-center">Global Impact</span>
            <h1 className="text-display-lg font-display text-white mb-5">
              Reaching Every <GoldShimmer>Nation</GoldShimmer>
            </h1>
            <p className="text-body-lg text-text-muted max-w-2xl mx-auto mb-10">
              The Great Commission is not a suggestion. GGCC is committed to seeing the Gospel reach every
              tribe, tongue, and nation through church planting, mercy ministry, and leadership development.
            </p>
          </FadeInUp>

          {/* Global stats */}
          <FadeInUp delay={0.3}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { value: 120, suffix: '+', label: 'Nations Reached' },
                { value: 145, suffix: '', label: 'Partner Churches' },
                { value: 50000, suffix: '+', label: 'Lives Impacted' },
                { value: 15, suffix: 'yrs', label: 'Years of Mission' },
              ].map((s) => (
                <div key={s.label} className="glass-card rounded-2xl p-5">
                  <div className="font-display font-bold text-3xl text-brand-gold">
                    <CountUp end={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-xs text-text-muted mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Initiatives */}
      <section className="section-padding bg-brand-navy">
        <div className="container mx-auto px-4 max-w-7xl">
          <FadeInUp className="text-center mb-14">
            <span className="section-label mb-4 inline-flex justify-center">What We Do</span>
            <h2 className="text-display-md font-display text-white">
              Ministry That <GoldShimmer>Goes Beyond</GoldShimmer> the Four Walls
            </h2>
          </FadeInUp>

          <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initiatives.map((item) => (
              <StaggerItem key={item.title}>
                <div className="glass-card rounded-2xl p-7 h-full flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-text-muted leading-relaxed">{item.description}</p>
                  </div>
                  <div className="pt-4 border-t border-white/8 mt-auto">
                    <div className="font-display font-bold text-2xl text-brand-gold">
                      <CountUp end={item.stat} />
                    </div>
                    <div className="text-xs text-text-muted">{item.statLabel}</div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Regions */}
      <section className="section-padding bg-brand-blue">
        <div className="container mx-auto px-4 max-w-7xl">
          <FadeInUp className="text-center mb-14">
            <span className="section-label mb-4 inline-flex justify-center">Our Regions</span>
            <h2 className="text-display-md font-display text-white">
              A <GoldShimmer>Presence</GoldShimmer> on Every Continent
            </h2>
          </FadeInUp>

          <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.map((region) => (
              <StaggerItem key={region.name}>
                <div
                  className="glass-card rounded-2xl p-6 h-full"
                  style={{ borderColor: `${region.color}25` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-white text-lg">{region.name}</h3>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{ background: `${region.color}20`, color: region.color }}
                    >
                      {region.partners} partners
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {region.countries.map((c) => (
                      <span key={c} className="text-xs text-text-muted bg-white/5 px-2.5 py-1 rounded-full">
                        {c}
                      </span>
                    ))}
                  </div>
                  <ul className="space-y-1.5">
                    {region.initiatives.map((i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-text-muted">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: region.color }} />
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-navy">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <FadeInUp>
            <h2 className="text-display-md font-display text-white mb-4">
              Partner With <GoldShimmer>Our Mission</GoldShimmer>
            </h2>
            <p className="text-body-lg text-text-muted mb-8">
              Every gift, every prayer, and every trip extends the Kingdom further.
              Join us in reaching the unreached.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/give" className="btn-gold">
                Support Global Mission
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-ghost">
                Inquire About Mission Trips
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  )
}
