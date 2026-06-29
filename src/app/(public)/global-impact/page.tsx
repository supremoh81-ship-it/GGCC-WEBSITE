import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { CountUp } from '@/components/motion/CountUp'
import { SignatureHalo } from '@/components/motion/SignatureHalo'
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
    accent: 'gold',
  },
  {
    name: 'East Africa',
    countries: ['Kenya', 'Uganda', 'Tanzania', 'Ethiopia', 'Rwanda'],
    partners: 31,
    initiatives: ['School sponsorships', 'Pastoral training', 'Food security'],
    accent: 'teal',
  },
  {
    name: 'Latin America',
    countries: ['Brazil', 'Colombia', 'Peru', 'Mexico', 'Argentina'],
    partners: 22,
    initiatives: ['Youth discipleship', 'Street outreach', 'Women empowerment'],
    accent: 'magenta',
  },
  {
    name: 'Asia Pacific',
    countries: ['India', 'Philippines', 'Indonesia', 'South Korea', 'Australia'],
    partners: 18,
    initiatives: ['Underground church support', 'Bible translation aid', 'Leadership schools'],
    accent: 'gold',
  },
  {
    name: 'Middle East',
    countries: ['Lebanon', 'Jordan', 'Egypt', 'UAE', 'Turkey'],
    partners: 12,
    initiatives: ['Refugee ministry', 'House churches', 'Trauma healing'],
    accent: 'teal',
  },
  {
    name: 'Europe',
    countries: ['UK', 'Germany', 'France', 'Netherlands', 'Sweden'],
    partners: 15,
    initiatives: ['Diaspora ministry', 'Campus evangelism', 'Prayer networks'],
    accent: 'gold',
  },
] as const

const regionAccentClasses = {
  gold: { border: 'border-brand-gold/25', pillBg: 'bg-brand-gold/20', pillText: 'text-brand-gold', dot: 'bg-brand-gold' },
  teal: { border: 'border-brand-teal/25', pillBg: 'bg-brand-teal/20', pillText: 'text-brand-teal-light', dot: 'bg-brand-teal-light' },
  magenta: { border: 'border-brand-magenta/25', pillBg: 'bg-brand-magenta/20', pillText: 'text-brand-magenta-light', dot: 'bg-brand-magenta-light' },
}

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

const initiativeAccents = [
  { chip: 'bg-brand-gold/10 border-brand-gold/25', icon: 'text-brand-gold', value: 'text-brand-gold' },
  { chip: 'bg-brand-teal/10 border-brand-teal/25', icon: 'text-brand-teal-light', value: 'text-brand-teal-light' },
  { chip: 'bg-brand-gold/10 border-brand-gold/25', icon: 'text-brand-gold', value: 'text-brand-gold' },
  { chip: 'bg-brand-magenta/10 border-brand-magenta/25', icon: 'text-brand-magenta-light', value: 'text-brand-magenta-light' },
  { chip: 'bg-brand-gold/10 border-brand-gold/25', icon: 'text-brand-gold', value: 'text-brand-gold' },
  { chip: 'bg-brand-teal/10 border-brand-teal/25', icon: 'text-brand-teal-light', value: 'text-brand-teal-light' },
]

export default function GlobalImpactPage() {
  return (
    <div className="min-h-screen bg-brand-navy pt-24">
      {/* Hero */}
      <section className="section-padding bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-25 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-40 pointer-events-none" />
        <div className="absolute left-1/2 top-[2%] -translate-x-1/2 pointer-events-none opacity-50">
          <SignatureHalo size={520} />
        </div>
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
                { value: 120, suffix: '+', label: 'Nations Reached', color: 'text-brand-gold' },
                { value: 145, suffix: '', label: 'Partner Churches', color: 'text-brand-teal-light' },
                { value: 50000, suffix: '+', label: 'Lives Impacted', color: 'text-brand-magenta-light' },
                { value: 15, suffix: 'yrs', label: 'Years of Mission', color: 'text-brand-gold' },
              ].map((s) => (
                <div key={s.label} className="glass-card rounded-2xl p-5">
                  <div className={`font-display font-bold text-3xl ${s.color}`}>
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
            {initiatives.map((item, i) => {
              const accent = initiativeAccents[i % initiativeAccents.length]
              return (
                <StaggerItem key={item.title}>
                  <div className="glass-card rounded-2xl p-7 h-full flex flex-col gap-4">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${accent.chip}`}>
                      <item.icon className={`h-6 w-6 ${accent.icon}`} />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-white text-lg mb-1">{item.title}</h3>
                      <p className="text-sm text-text-muted leading-relaxed">{item.description}</p>
                    </div>
                    <div className="pt-4 border-t border-white/8 mt-auto">
                      <div className={`font-display font-bold text-2xl ${accent.value}`}>
                        <CountUp end={item.stat} />
                      </div>
                      <div className="text-xs text-text-muted">{item.statLabel}</div>
                    </div>
                  </div>
                </StaggerItem>
              )
            })}
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
            {regions.map((region) => {
              const accent = regionAccentClasses[region.accent]
              return (
                <StaggerItem key={region.name}>
                  <div className={`glass-card rounded-2xl p-6 h-full border ${accent.border}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-display font-bold text-white text-lg">{region.name}</h3>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${accent.pillBg} ${accent.pillText}`}>
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
                          <div className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />
                          {i}
                        </li>
                      ))}
                    </ul>
                  </div>
                </StaggerItem>
              )
            })}
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
