'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Play, Heart, ArrowDown, Tv } from 'lucide-react'
import { AmbientParticles } from '@/components/motion/AmbientParticles'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { SignatureHalo } from '@/components/motion/SignatureHalo'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Background image — anchored to bottom so text area stays clear */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 100%',
          backgroundRepeat: 'no-repeat',
          opacity: 0.22,
        }}
      />

      {/* Top-to-mid hard fade: keeps the entire text block on pure dark ink */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, #100B16 0%, #100B16 55%, rgba(16,11,22,0.85) 75%, rgba(16,11,22,0.4) 100%)',
        }}
      />

      {/* Signature halo — gold ring + teal/magenta bloom + dove, echoing the crest */}
      <div className="absolute left-1/2 top-[8%] -translate-x-1/2 pointer-events-none opacity-90">
        <SignatureHalo size={620} />
      </div>

      {/* Ambient particle canvas */}
      <AmbientParticles count={60} />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-gradient-radial-gold" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 max-w-5xl text-center pt-24" style={{ isolation: 'isolate' }}>
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 mb-7"
        >
          <span className="section-label">
            Welcome to Grace for Greatness
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-display-xl font-display text-white mb-6 text-balance"
          style={{ textShadow: '0 2px 32px rgba(16,11,22,0.85)' }}
        >
          Your Place to Grow<br className="hidden sm:block" /> into{' '}
          <GoldShimmer>Greatness</GoldShimmer>
        </motion.h1>

        {/* Flourish tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.48 }}
          className="text-flourish text-xl md:text-2xl text-brand-gold-light/90 mb-5"
        >
          &ldquo;For we are His workmanship, created for greatness.&rdquo;
        </motion.p>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-body-lg text-text-secondary max-w-2xl mx-auto mb-10 text-balance"
        >
          A restored community rooted in God&apos;s grace, where broken lives are healed,
          purpose is discovered, and greatness is awakened through worship, discipleship,
          and purposeful service.
        </motion.p>

        {/* CTA Group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.72, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/sermons" className="btn-gold text-base px-7 py-3.5">
            <Play className="h-4 w-4 fill-current" />
            Latest Messages
          </Link>
          <Link href="/prayer" className="btn-ghost text-base px-7 py-3.5">
            <Heart className="h-4 w-4" />
            Join Prayer
          </Link>
          <a
            href="#live"
            className="btn-outline-gold text-base px-7 py-3.5"
          >
            <Tv className="h-4 w-4" />
            Watch Live
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: '5K+', label: 'Global Members', color: 'text-brand-gold' },
            { value: '6+', label: 'Nations Reached', color: 'text-brand-teal-light' },
            { value: '5yr', label: 'Years of Ministry', color: 'text-brand-magenta-light' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`font-display font-bold text-2xl mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-xs text-text-muted tracking-wide">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.7 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-brand-gold/60"
        >
          <ArrowDown className="h-5 w-5" />
        </motion.div>
        <span className="text-[10px] text-text-muted tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  )
}
