import type { Metadata } from 'next'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { SignatureHalo } from '@/components/motion/SignatureHalo'
import { PrayerRequestForm } from '@/components/prayer/PrayerRequestForm'
import { Heart, HandHeart, Shield, Users, Clock, Globe } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Prayer Hub',
  description:
    'Submit prayer requests, intercede for others, and join live prayer sessions at GGCC.',
}

const sessions = [
  {
    title: 'Global Prayer Call',
    host: 'Pastoral Team',
    platform: 'Zoom',
    schedule: 'Every Tuesday, 7:00 PM',
    description: 'A weekly gathering of believers from around the world praying in one accord.',
  },
  {
    title: 'Early Morning Prayer',
    host: 'Prayer Warriors Ministry',
    platform: 'YouTube Live',
    schedule: 'Monday–Friday, 6:00 AM',
    description: 'Start your day in the presence of God with our dedicated prayer team.',
  },
  {
    title: 'Sunday Intercession',
    host: 'Dr. Emmanuel Grace',
    platform: 'In-Person + Zoom',
    schedule: 'Sunday, 9:00 AM',
    description: 'Pre-service intercession before every Sunday gathering.',
  },
]

export default function PrayerPage() {
  return (
    <div className="min-h-screen bg-brand-navy pt-24">
      {/* Header */}
      <section className="section-padding-sm bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-50 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60">
          <SignatureHalo size={520} />
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative">
          <FadeInUp className="text-center">
            <span className="section-label mb-4 inline-flex justify-center">Prayer Hub</span>
            <h1 className="text-display-lg font-display text-white mb-4">
              We Are Here to{' '}
              <GoldShimmer>Pray with You</GoldShimmer>
            </h1>
            <p className="text-body-lg text-text-muted max-w-xl mx-auto">
              No request is too small or too great. Our prayer community is standing ready to intercede for you.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Options */}
      <section className="section-padding-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {[
              {
                icon: Heart,
                title: 'Submit a Request',
                desc: 'Share your prayer need with our community. Choose to share publicly or privately.',
                href: '#submit',
                color: 'bg-brand-magenta/15',
                text: 'text-brand-magenta-light',
              },
              {
                icon: HandHeart,
                title: 'Prayer Wall',
                desc: 'Join thousands interceding for community needs. Pray for others in real time.',
                href: '/prayer/wall',
                color: 'bg-brand-gold/15',
                text: 'text-brand-gold',
              },
              {
                icon: Shield,
                title: 'Private Counseling',
                desc: 'Connect confidentially with a trained minister for personal prayer support.',
                href: '#submit',
                color: 'bg-brand-teal/15',
                text: 'text-brand-teal-light',
              },
            ].map((opt) => (
              <StaggerItem key={opt.title}>
                <Link href={opt.href} className="block h-full">
                  <div className="glass-card glass-card-interactive rounded-2xl p-7 flex flex-col gap-4 h-full">
                    <div className={`w-12 h-12 rounded-xl ${opt.color} flex items-center justify-center`}>
                      <opt.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-display font-bold text-white text-xl">{opt.title}</h3>
                    <p className="text-sm text-text-muted flex-1">{opt.desc}</p>
                    <div className={`text-sm font-semibold ${opt.text}`}>{opt.title === 'Prayer Wall' ? 'Visit Wall' : 'Get Started'} &rarr;</div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* Prayer sessions */}
          <FadeInUp className="mb-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="section-label mb-3 inline-flex">Live Prayer Sessions</span>
                <h2 className="text-display-sm font-display text-white">
                  Join Us <GoldShimmer>Live</GoldShimmer>
                </h2>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {sessions.map((s, i) => {
                const iconAccent = ['text-brand-gold', 'text-brand-teal-light', 'text-brand-magenta-light'][i % 3]
                return (
                <div key={s.title} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-400 font-medium uppercase tracking-wide">Recurring</span>
                  </div>
                  <h3 className="font-display font-semibold text-white text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-text-muted mb-4">{s.description}</p>
                  <div className="space-y-2 text-xs text-text-muted">
                    <div className="flex items-center gap-2">
                      <Users className={`h-3.5 w-3.5 ${iconAccent}`} />
                      Host: {s.host}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className={`h-3.5 w-3.5 ${iconAccent}`} />
                      {s.schedule}
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className={`h-3.5 w-3.5 ${iconAccent}`} />
                      {s.platform}
                    </div>
                  </div>
                  <button className="mt-5 btn-outline-gold text-sm w-full justify-center py-2.5">
                    Join Session
                  </button>
                </div>
                )
              })}
            </div>
          </FadeInUp>

          {/* Submit prayer form */}
          <div id="submit">
            <FadeInUp className="text-center mb-10">
              <span className="section-label mb-4 inline-flex justify-center">Submit a Request</span>
              <h2 className="text-display-sm font-display text-white">
                Tell Us How to <GoldShimmer>Pray for You</GoldShimmer>
              </h2>
            </FadeInUp>
            <div className="max-w-2xl mx-auto">
              <PrayerRequestForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
