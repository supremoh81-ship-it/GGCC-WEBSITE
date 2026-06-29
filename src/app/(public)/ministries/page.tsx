import type { Metadata } from 'next'
import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { ALL_MINISTRIES } from '@/lib/data/ministries'

export const metadata: Metadata = {
  title: 'Ministries',
  description:
    'Discover all 14 ministry units at Grace for Greatness Christian Centre. Find your place to serve, grow, and make a difference.',
}

export default function MinistriesPage() {
  return (
    <div className="min-h-screen bg-brand-navy pt-24">

      {/* Hero */}
      <section className="section-padding-sm bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-30 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative">
          <FadeInUp className="text-center">
            <Link
              href="/#ministries"
              className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-brand-gold transition-colors mb-6"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Home
            </Link>
            <span className="section-label mb-4 inline-flex justify-center">Our Ministries</span>
            <h1 className="text-display-lg font-display text-white mb-4">
              Find Your <GoldShimmer>Place to Serve</GoldShimmer>
            </h1>
            <p className="text-body-lg text-text-muted max-w-xl mx-auto">
              Every believer is gifted. Every gift is needed. Discover the {ALL_MINISTRIES.length} ministry
              units where yours will flourish.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Full Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-7xl">
          <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_MINISTRIES.map((ministry) => (
              <StaggerItem key={ministry.slug}>
                <div
                  className="glass-card rounded-2xl p-7 h-full flex flex-col group transition-all duration-300"
                  style={{
                    border: `1px solid ${ministry.color}20`,
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 shrink-0"
                    style={{
                      backgroundColor: `${ministry.color}18`,
                      border: `1px solid ${ministry.color}35`,
                    }}
                  >
                    <ministry.icon
                      className="h-7 w-7"
                      style={{ color: ministry.color }}
                    />
                  </div>

                  {/* Name */}
                  <h2 className="font-display font-bold text-white text-xl mb-3">
                    {ministry.name}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-text-muted leading-relaxed flex-1 mb-6">
                    {ministry.description}
                  </p>

                  {/* Join button */}
                  <Link
                    href="#"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold rounded-full px-5 py-2.5 border transition-all duration-200 self-start hover:opacity-90 active:scale-95"
                    style={{
                      color: ministry.color,
                      borderColor: `${ministry.color}40`,
                      backgroundColor: `${ministry.color}10`,
                    }}
                  >
                    Join This Unit
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding-sm bg-brand-blue">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <FadeInUp>
            <h2 className="text-display-sm font-display text-white mb-4">
              Not Sure Where to <GoldShimmer>Start?</GoldShimmer>
            </h2>
            <p className="text-body text-text-muted mb-8">
              Reach out to us and we will help you find the right ministry unit based on your gifts,
              passion, and availability.
            </p>
            <Link href="/contact" className="btn-gold">
              Get in Touch
            </Link>
          </FadeInUp>
        </div>
      </section>

    </div>
  )
}
