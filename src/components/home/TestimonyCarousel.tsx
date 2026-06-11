'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Quote, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

const testimonies = [
  {
    id: '1',
    name: 'Amara Johnson',
    location: 'Lagos, Nigeria',
    title: 'Restored after years of addiction',
    body: 'After fifteen years trapped in a cycle I could not escape, one Sunday morning changed everything. GGCC was not just a church. It became the community that walked with me through every step of healing. Today I lead others to the same freedom.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
  },
  {
    id: '2',
    name: 'Marcus Williams',
    location: 'Houston, Texas',
    title: 'From bankruptcy to purpose',
    body: 'When my business collapsed, I thought my life was over. Through the prayer team here and the Word preached every Sunday, God rebuilt not just my finances but my entire identity. I am living proof that He restores what the enemy steals.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  },
  {
    id: '3',
    name: 'Grace Okonkwo',
    location: 'Accra, Ghana',
    title: 'Healed of a terminal diagnosis',
    body: 'The doctors gave me six months. The church gave me prayer and faith. That was three years ago. I stand here today as a testimony of what happens when a community refuses to stop praying. God is not done with any of us.',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
  },
]

export function TestimonyCarousel() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right'>('right')

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection('right')
      setCurrent((prev) => (prev + 1) % testimonies.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const go = (dir: 'left' | 'right') => {
    setDirection(dir)
    if (dir === 'right') setCurrent((prev) => (prev + 1) % testimonies.length)
    else setCurrent((prev) => (prev - 1 + testimonies.length) % testimonies.length)
  }

  const variants = {
    enter: (d: 'left' | 'right') => ({ opacity: 0, x: d === 'right' ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (d: 'left' | 'right') => ({ opacity: 0, x: d === 'right' ? -40 : 40 }),
  }

  const t = testimonies[current]

  return (
    <section className="section-padding bg-brand-blue relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial-gold opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative">
        <FadeInUp className="text-center mb-14">
          <span className="section-label mb-4 inline-flex justify-center">Testimonies</span>
          <h2 className="text-display-md font-display text-white">
            Lives{' '}
            <GoldShimmer>Transformed</GoldShimmer>
          </h2>
        </FadeInUp>

        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={t.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="glass-card rounded-3xl p-8 md:p-12">
                <Quote className="h-10 w-10 text-brand-gold/30 mb-6" />

                <p className="font-display text-xl md:text-2xl text-white leading-relaxed mb-8 text-balance">
                  &ldquo;{t.body}&rdquo;
                </p>

                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-brand-gold/30">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{t.name}</div>
                    <div className="text-sm text-brand-gold">{t.location}</div>
                    <div className="text-xs text-text-muted mt-0.5">{t.title}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {testimonies.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 'right' : 'left'); setCurrent(i) }}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-8 h-2 bg-brand-gold'
                      : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to testimony ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => go('left')}
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-text-muted hover:border-brand-gold/40 hover:text-brand-gold transition-colors"
                aria-label="Previous testimony"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => go('right')}
                className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-text-muted hover:border-brand-gold/40 hover:text-brand-gold transition-colors"
                aria-label="Next testimony"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <FadeInUp className="text-center mt-10">
          <Link href="/testimonies" className="btn-outline-gold">
            Share Your Testimony
            <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeInUp>
      </div>
    </section>
  )
}
