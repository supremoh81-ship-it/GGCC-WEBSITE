import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { CountUp } from '@/components/motion/CountUp'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about GGCC — our story, mission, leadership, and global vision.',
}

const leadership = [
  {
    name: 'Dr. Emmanuel Grace',
    title: 'Senior Pastor & Founder',
    bio: 'With over two decades of ministry, Dr. Grace carries a mandate to raise a global generation of purpose-driven believers.',
    avatar: 'https://images.unsplash.com/photo-1537119042441-93a37c6b7a68?w=300&q=80',
  },
  {
    name: 'Pastor Sarah Mitchell',
    title: 'Associate Pastor',
    bio: 'A gifted teacher and counselor, Pastor Sarah leads our discipleship programs and women\'s ministry.',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&q=80',
  },
  {
    name: 'Bishop Thomas Adeyemi',
    title: 'Overseeing Bishop',
    bio: 'Bishop Adeyemi brings wisdom and apostolic covering to the ministry, overseeing our global partner network.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-navy pt-24">
      {/* Hero */}
      <section className="section-padding bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-grid opacity-30 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInUp>
              <span className="section-label mb-5 inline-flex">Our Story</span>
              <h1 className="text-display-lg font-display text-white mb-6">
                A Movement Born from <GoldShimmer>Faith</GoldShimmer>
              </h1>
              <p className="text-body-lg text-text-muted mb-6">
                Greater Grace Christian Center began in 2010 with twelve people in a living room,
                a Bible, and a bold prayer: &ldquo;God, make us a global voice.&rdquo;
              </p>
              <p className="text-body text-text-muted mb-8">
                Today we gather thousands weekly across multiple campuses and digital platforms,
                with ministry partners in over 120 nations. What started as a local expression
                of faith has grown into a global movement of grace.
              </p>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: 15, suffix: 'yr', label: 'Years Strong' },
                  { value: 50000, suffix: '+', label: 'Members' },
                  { value: 120, suffix: '+', label: 'Nations' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-display font-bold text-3xl text-brand-gold">
                      <CountUp end={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-xs text-text-muted mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </FadeInUp>

            <FadeInUp delay={0.2} className="relative">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=900&q=80"
                  alt="GGCC congregation"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent" />
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section-padding bg-brand-navy">
        <div className="container mx-auto px-4 max-w-7xl">
          <FadeInUp className="text-center mb-14">
            <span className="section-label mb-4 inline-flex justify-center">Leadership</span>
            <h2 className="text-display-md font-display text-white">
              Shepherds of the <GoldShimmer>Vision</GoldShimmer>
            </h2>
          </FadeInUp>

          <StaggerChildren className="grid md:grid-cols-3 gap-8">
            {leadership.map((leader) => (
              <StaggerItem key={leader.name}>
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={leader.avatar} alt={leader.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-brand-gold font-medium mb-1">{leader.title}</div>
                    <h3 className="font-display font-bold text-white text-xl mb-3">{leader.name}</h3>
                    <p className="text-sm text-text-muted">{leader.bio}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-blue">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <FadeInUp>
            <h2 className="text-display-md font-display text-white mb-4">
              Ready to <GoldShimmer>Connect?</GoldShimmer>
            </h2>
            <p className="text-body-lg text-text-muted mb-8">
              Whether you are exploring faith for the first time or looking for a spiritual home,
              we welcome you with open arms.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register" className="btn-gold">
                Join the Community
              </Link>
              <Link href="/events" className="btn-ghost">
                Upcoming Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  )
}
