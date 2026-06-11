import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Gift, ArrowRight, Target, Users } from 'lucide-react'

export function GivingBanner() {
  const campaign = {
    title: 'Building for the Next Generation',
    goal: 500000,
    raised: 337500,
    donors: 1842,
    deadline: 'December 31, 2025',
  }

  const percentFunded = Math.round((campaign.raised / campaign.goal) * 100)

  return (
    <section className="section-padding bg-brand-navy relative overflow-hidden">
      {/* Gold glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-gold/4 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 max-w-5xl relative">
        <FadeInUp>
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 35, 71, 0.9) 0%, rgba(26, 58, 107, 0.9) 100%)',
              border: '1px solid rgba(201, 168, 76, 0.3)',
              boxShadow: '0 0 80px rgba(201, 168, 76, 0.1)',
            }}
          >
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-gold/5 rounded-full blur-2xl" />

            <div className="relative p-8 md:p-12">
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                {/* Left: content */}
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-brand-gold/15 flex items-center justify-center">
                      <Gift className="h-4 w-4 text-brand-gold" />
                    </div>
                    <span className="text-xs font-semibold text-brand-gold tracking-widest uppercase">
                      Featured Campaign
                    </span>
                  </div>

                  <h2 className="text-display-sm font-display text-white mb-4">
                    <GoldShimmer>{campaign.title}</GoldShimmer>
                  </h2>

                  <p className="text-body text-text-muted mb-6">
                    Help us build a world-class facility dedicated to the spiritual formation,
                    education, and empowerment of the next generation of believers.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <Link href="/give" className="btn-gold">
                      <Gift className="h-4 w-4" />
                      Give Now
                    </Link>
                    <Link href="/give" className="btn-ghost">
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Right: progress */}
                <div className="glass-card rounded-2xl p-6 space-y-5">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <div className="text-2xl font-bold text-brand-gold font-display">
                          ${(campaign.raised / 1000).toFixed(0)}K
                        </div>
                        <div className="text-xs text-text-muted">raised of ${(campaign.goal / 1000).toFixed(0)}K goal</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-white font-display">{percentFunded}%</div>
                        <div className="text-xs text-text-muted">funded</div>
                      </div>
                    </div>
                    <ProgressBar value={campaign.raised} max={campaign.goal} size="lg" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-xl bg-white/5">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Users className="h-3.5 w-3.5 text-brand-gold" />
                        <span className="font-bold text-white">{campaign.donors.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-text-muted">Generous donors</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/5">
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        <Target className="h-3.5 w-3.5 text-brand-gold" />
                        <span className="font-bold text-white text-sm">Dec 31</span>
                      </div>
                      <div className="text-xs text-text-muted">Campaign deadline</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}
