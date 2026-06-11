import Image from 'next/image'
import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Play, ArrowRight, Quote } from 'lucide-react'

export function PastorWelcome() {
  return (
    <section className="section-padding bg-brand-blue relative overflow-hidden">
      {/* Decorative grid */}
      <div className="absolute inset-0 bg-pattern-grid opacity-40 pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image side */}
          <FadeInUp className="relative">
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] max-w-md mx-auto lg:mx-0">
              <Image
                src="https://images.unsplash.com/photo-1537119042441-93a37c6b7a68?w=800&q=80"
                alt="Senior Pastor"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-transparent to-transparent" />

              {/* Name plate */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="glass-card rounded-2xl p-4">
                  <div className="text-sm text-brand-gold font-semibold mb-0.5">Senior Pastor</div>
                  <div className="font-display font-bold text-white text-lg">Dr. Emmanuel Grace</div>
                  <div className="text-xs text-text-muted mt-0.5">Founder, GGCC Global</div>
                </div>
              </div>
            </div>

            {/* Video play button overlay */}
            <button
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-brand-gold flex items-center justify-center shadow-gold hover:scale-110 transition-transform duration-300"
              aria-label="Watch pastor welcome video"
            >
              <Play className="h-6 w-6 text-brand-navy fill-current ml-1" />
            </button>
          </FadeInUp>

          {/* Content side */}
          <StaggerChildren className="space-y-6">
            <StaggerItem>
              <span className="section-label">A Word from the Pastor</span>
            </StaggerItem>

            <StaggerItem>
              <h2 className="text-display-md font-display text-white">
                Walk with us into{' '}
                <GoldShimmer>God&apos;s purpose</GoldShimmer>{' '}
                for your life
              </h2>
            </StaggerItem>

            <StaggerItem>
              <div className="relative pl-5 border-l-2 border-brand-gold">
                <Quote className="absolute -top-1 -left-3 h-5 w-5 text-brand-gold/40" />
                <p className="text-body-lg text-text-secondary italic font-display">
                  &ldquo;Every life carries a divine assignment. Our mission is to help you discover, develop,
                  and deploy yours for the glory of God and the good of the world.&rdquo;
                </p>
              </div>
            </StaggerItem>

            <StaggerItem>
              <p className="text-body text-text-muted">
                For over fifteen years, GGCC has been a place of encounter, transformation,
                and global impact. We believe the Church is not a building but a movement,
                and we invite you to be part of something far greater than yourself.
              </p>
            </StaggerItem>

            <StaggerItem>
              <div className="flex flex-wrap gap-4">
                <Link href="/about" className="btn-gold">
                  Our Story
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/sermons" className="btn-outline-gold">
                  <Play className="h-4 w-4" />
                  Watch Sermons
                </Link>
              </div>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </div>
    </section>
  )
}
