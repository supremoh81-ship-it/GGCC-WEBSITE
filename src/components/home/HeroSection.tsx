'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Play, Heart, ArrowDown, Tv } from 'lucide-react'
import { AmbientParticles } from '@/components/motion/AmbientParticles'
import { GoldShimmer } from '@/components/motion/GoldShimmer'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Cinematic background */}
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Background image (swapped with video when available) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1920&q=80)',
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-overlay" />

      {/* Ambient particle canvas */}
      <AmbientParticles count={60} />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-gradient-radial-gold" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 max-w-5xl text-center pt-24">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 mb-7"
        >
          <span className="section-label">
            Welcome to GGCC
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="text-display-xl font-display text-white mb-6 text-balance"
        >
          Where{' '}
          <GoldShimmer>Faith</GoldShimmer>{' '}
          Moves<br className="hidden sm:block" /> the{' '}
          <GoldShimmer>World</GoldShimmer>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="text-body-lg text-text-secondary max-w-2xl mx-auto mb-10 text-balance"
        >
          A global community rooted in the love of Christ, empowering lives through
          worship, prayer, and purposeful service to the world.
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
            { value: '50K+', label: 'Global Members' },
            { value: '120+', label: 'Nations Reached' },
            { value: '15yr', label: 'Years of Ministry' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display font-bold text-2xl text-brand-gold mb-1">
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
