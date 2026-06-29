'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Play, ArrowRight, BookOpen, Mic, Globe, TrendingUp } from 'lucide-react'

const roles = [
  { icon: BookOpen, label: 'Author' },
  { icon: Mic, label: 'Speaker' },
  { icon: Globe, label: 'Leadership Expert' },
  { icon: TrendingUp, label: 'Finance Expert' },
]

export function PastorWelcome() {
  return (
    <section className="section-padding bg-brand-blue relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-grid opacity-40 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative">
        {/* Section header */}
        <FadeInUp className="text-center mb-16">
          <span className="section-label mb-4 inline-flex justify-center">Leadership</span>
          <h2 className="text-display-lg font-display text-white mb-4">
            Meet Our Church Lead{' '}
            <GoldShimmer>Pastors and Founders</GoldShimmer>
          </h2>
          <p className="text-body-lg text-text-muted max-w-2xl mx-auto">
            Grace for Greatness Christian Center is founded and led by Reverend Olumuyiwa Abraham
            and Reverend Oluwaseun Abraham, supported by our team of pastors and ministers.
          </p>
        </FadeInUp>

        {/* Pastor cards */}
        <StaggerChildren className="grid md:grid-cols-2 gap-8 mb-14">
          {/* Rev. Dr. Olumuyiwa Abraham */}
          <StaggerItem>
            <div className="group relative rounded-3xl overflow-hidden bg-brand-navy border border-white/8 hover:border-brand-gold/30 transition-all duration-500">
              {/* Photo */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/pastors.jpg"
                  alt="Rev. Olumuyiwa Abraham"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: '20% center' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/20 to-transparent" />

                {/* Play button overlay */}
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-18 h-18 rounded-full flex items-center justify-center shadow-gold"
                  style={{
                    width: 72,
                    height: 72,
                    background: 'radial-gradient(circle, #C9A84C 0%, #9C7A2E 100%)',
                  }}
                  aria-label="Watch Rev. Olumuyiwa Abraham message"
                >
                  <Play className="h-7 w-7 text-brand-navy fill-current ml-1" />
                </motion.button>

                {/* Coming soon badge */}
                <div className="absolute top-4 right-4 bg-brand-navy/80 backdrop-blur-sm border border-brand-gold/30 rounded-full px-3 py-1 text-[10px] text-brand-gold tracking-widest uppercase">
                  Video Coming Soon
                </div>
              </div>

              {/* Name plate */}
              <div className="p-6">
                <div className="text-xs text-brand-gold font-semibold tracking-widest uppercase mb-1">
                  Senior Pastor &amp; Founder
                </div>
                <h3 className="font-display font-bold text-white text-xl mb-1">
                  Rev. Olumuyiwa Abraham
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  Grace for Greatness Christian Centre
                </p>

                {/* Role badges */}
                <div className="flex flex-wrap gap-2">
                  {roles.map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 bg-brand-gold/10 border border-brand-gold/20 rounded-full px-3 py-1 text-xs text-brand-gold"
                    >
                      <Icon className="h-3 w-3" />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </StaggerItem>

          {/* Rev. Dr. Oluwaseun Abraham */}
          <StaggerItem>
            <div className="group relative rounded-3xl overflow-hidden bg-brand-navy border border-white/8 hover:border-brand-gold/30 transition-all duration-500">
              {/* Photo */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/pastors.jpg"
                  alt="Rev. Oluwaseun Abraham"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  style={{ objectPosition: '80% center' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/20 to-transparent" />
              </div>

              {/* Name plate */}
              <div className="p-6">
                <div className="text-xs text-brand-gold font-semibold tracking-widest uppercase mb-1">
                  Co-Pastor
                </div>
                <h3 className="font-display font-bold text-white text-xl mb-1">
                  Rev. Oluwaseun Abraham
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  Grace for Greatness Christian Centre
                </p>

                <span className="inline-flex items-center gap-1.5 bg-brand-gold/10 border border-brand-gold/20 rounded-full px-3 py-1 text-xs text-brand-gold">
                  <Globe className="h-3 w-3" />
                  Minister &amp; Pastor
                </span>
              </div>
            </div>
          </StaggerItem>
        </StaggerChildren>

        {/* Caption + bio */}
        <FadeInUp>
          <div className="glass-card rounded-3xl p-8 md:p-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div className="space-y-3">
              <p className="text-text-secondary leading-relaxed">
                GGCC is led by <span className="text-white font-semibold">Rev. Olumuyiwa Abraham</span> and{' '}
                <span className="text-white font-semibold">Rev. Oluwaseun Abraham</span>,
                supported by our team of pastors and ministers.
                Reverend Olumuyiwa is an accomplished author, speaker, leadership expert, relationship coach,
                renowned publisher, and finance expert.
              </p>
              <p className="text-text-muted text-sm">
                Together they carry a divine mandate to restore broken lives, awaken greatness in people,
                and build a generation of purpose-driven leaders.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <Link href="/about" className="btn-gold whitespace-nowrap">
                Our Story
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/sermons" className="btn-outline-gold whitespace-nowrap">
                <Play className="h-4 w-4" />
                Watch Sermons
              </Link>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}
