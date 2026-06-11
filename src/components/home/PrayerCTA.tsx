'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Heart, HandHeart, Users, Shield } from 'lucide-react'
import { useState } from 'react'

export function PrayerCTA() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const options = [
    {
      icon: Heart,
      title: 'Submit a Prayer',
      desc: 'Share your request with our prayer community or privately with our intercessors.',
      href: '/prayer',
      color: 'from-red-500/20 to-red-500/5',
      iconBg: 'bg-red-500/15',
    },
    {
      icon: HandHeart,
      title: 'Intercede for Others',
      desc: 'Join thousands standing in prayer for community needs on our live prayer wall.',
      href: '/prayer/wall',
      color: 'from-brand-gold/20 to-brand-gold/5',
      iconBg: 'bg-brand-gold/15',
    },
    {
      icon: Users,
      title: 'Prayer Sessions',
      desc: 'Join live online prayer sessions hosted by our pastoral team every week.',
      href: '/prayer',
      color: 'from-blue-500/20 to-blue-500/5',
      iconBg: 'bg-blue-500/15',
    },
    {
      icon: Shield,
      title: 'Private Counseling',
      desc: 'Connect confidentially with trained ministers for personal prayer support.',
      href: '/prayer',
      color: 'from-purple-500/20 to-purple-500/5',
      iconBg: 'bg-purple-500/15',
    },
  ]

  return (
    <section className="section-padding bg-brand-navy relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-brand-gold/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative">
        <FadeInUp className="text-center mb-14">
          <span className="section-label mb-4 inline-flex justify-center">Prayer Hub</span>
          <h2 className="text-display-md font-display text-white mb-4">
            We&apos;re Here to{' '}
            <GoldShimmer>Pray with You</GoldShimmer>
          </h2>
          <p className="text-body-lg text-text-muted max-w-xl mx-auto">
            Prayer is the foundation of everything we do. No request is too small or too great.
          </p>
        </FadeInUp>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {options.map((opt, i) => (
            <motion.div
              key={opt.title}
              onHoverStart={() => setHoveredIndex(i)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={opt.href} className="block h-full">
                <div
                  className={`h-full glass-card rounded-2xl p-7 flex flex-col gap-4 bg-gradient-to-br ${opt.color} transition-all duration-300`}
                >
                  <div className={`w-12 h-12 rounded-xl ${opt.iconBg} flex items-center justify-center`}>
                    <opt.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-white text-lg">{opt.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed flex-1">{opt.desc}</p>
                  <div className="text-xs font-semibold text-brand-gold">
                    Get started &rarr;
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
