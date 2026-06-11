import type { Metadata } from 'next'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { GivingForm } from '@/components/giving/GivingForm'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Shield, Globe, Heart, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Give',
  description:
    'Support the mission of GGCC through generous giving. Tithe, offerings, and campaign gifts accepted.',
}

const funds = [
  { name: 'General Fund', icon: Heart, desc: 'Supports daily ministry operations, staff, and programs.' },
  { name: 'Building Project', icon: Shield, desc: 'Helps complete the new sanctuary and education wing.' },
  { name: 'Missions & Outreach', icon: Globe, desc: 'Funds global church planting and humanitarian relief.' },
  { name: 'Scholarship Fund', icon: BookOpen, desc: 'Provides education support for young believers.' },
]

export default function GivePage() {
  return (
    <div className="min-h-screen bg-brand-navy pt-24">
      {/* Header */}
      <section className="section-padding-sm bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-40 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-5xl relative text-center">
          <FadeInUp>
            <span className="section-label mb-4 inline-flex justify-center">Online Giving</span>
            <h1 className="text-display-lg font-display text-white mb-4">
              Give with a{' '}
              <GoldShimmer>Generous Heart</GoldShimmer>
            </h1>
            <p className="text-body-lg text-text-muted max-w-xl mx-auto">
              Your generosity fuels global ministry. Every gift, large or small, makes a lasting difference.
            </p>
          </FadeInUp>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            {/* Giving form */}
            <FadeInUp>
              <GivingForm />
            </FadeInUp>

            {/* Fund info + campaign */}
            <div className="space-y-8">
              <FadeInUp delay={0.1}>
                <div>
                  <h2 className="font-display font-bold text-white text-xl mb-5">Where Your Gift Goes</h2>
                  <div className="space-y-3">
                    {funds.map((fund) => (
                      <div key={fund.name} className="glass-card rounded-xl p-4 flex items-start gap-4">
                        <div className="w-9 h-9 rounded-lg bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                          <fund.icon className="h-4.5 w-4.5 text-brand-gold" />
                        </div>
                        <div>
                          <div className="font-medium text-white text-sm">{fund.name}</div>
                          <div className="text-xs text-text-muted mt-0.5">{fund.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInUp>

              {/* Featured campaign */}
              <FadeInUp delay={0.2}>
                <div className="glass-card rounded-2xl p-6" style={{ border: '1px solid rgba(201, 168, 76, 0.3)' }}>
                  <div className="text-xs font-semibold text-brand-gold tracking-widest uppercase mb-3">
                    Featured Campaign
                  </div>
                  <h3 className="font-display font-bold text-white text-lg mb-2">
                    Building for the Next Generation
                  </h3>
                  <p className="text-sm text-text-muted mb-5">
                    Help us complete our new facility dedicated to discipleship and community impact.
                  </p>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-brand-gold font-semibold">$337,500 raised</span>
                    <span className="text-text-muted">of $500,000 goal</span>
                  </div>
                  <ProgressBar value={337500} max={500000} size="md" />
                  <div className="text-xs text-text-muted mt-2">1,842 donors &bull; Closes Dec 31, 2025</div>
                </div>
              </FadeInUp>

              {/* Trust indicators */}
              <FadeInUp delay={0.3}>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <Shield className="h-4 w-4 text-brand-gold flex-shrink-0" />
                  <span>Secure SSL-encrypted payments. Receipts issued for all donations.</span>
                </div>
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
