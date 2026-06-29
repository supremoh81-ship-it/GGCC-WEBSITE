import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { ChevronRight } from 'lucide-react'
import { FEATURED_MINISTRIES, ALL_MINISTRIES } from '@/lib/data/ministries'

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
            Every believer has a role to play. Join a ministry unit and start making a difference today.
          </p>
        </FadeInUp>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {FEATURED_MINISTRIES.map((ministry) => (
            <StaggerItem key={ministry.slug}>
              <div
                className="glass-card rounded-2xl p-6 h-full flex flex-col group hover:border-opacity-40 transition-all duration-300"
                style={{
                  borderColor: `${ministry.color}22`,
                  border: `1px solid ${ministry.color}22`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shrink-0"
                  style={{
                    backgroundColor: `${ministry.color}18`,
                    border: `1px solid ${ministry.color}35`,
                  }}
                >
                  <ministry.icon
                    className="h-6 w-6"
                    style={{ color: ministry.color }}
                  />
                </div>

                <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-brand-gold transition-colors">
                  {ministry.name}
                </h3>

                <p className="text-sm text-text-muted leading-relaxed flex-1 mb-5">
                  {ministry.description}
                </p>

                <Link
                  href="#"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-4 py-2 border transition-all duration-200 self-start hover:opacity-90 active:scale-95"
                  style={{
                    color: ministry.color,
                    borderColor: `${ministry.color}40`,
                    backgroundColor: `${ministry.color}10`,
                  }}
                >
                  Join This Unit
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeInUp className="text-center">
          <Link href="/ministries" className="btn-outline-gold">
            View All {ALL_MINISTRIES.length} Ministry Units
          </Link>
        </FadeInUp>
      </div>
    </section>
  )
}
