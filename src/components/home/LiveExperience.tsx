'use client'

import { useState, useEffect } from 'react'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren } from '@/components/motion/StaggerChildren'
import { Radio, Calendar, Clock, ArrowRight, Play } from 'lucide-react'
import Link from 'next/link'

const SCHEDULE = [
  { day: 'Sunday', time: '8:00 AM', label: 'First Service', type: 'in-person' },
  { day: 'Sunday', time: '10:30 AM', label: 'Main Service (Live Stream)', type: 'live' },
  { day: 'Wednesday', time: '7:00 PM', label: 'Midweek Service', type: 'in-person' },
  { day: 'Friday', time: '6:30 PM', label: 'Youth Night', type: 'in-person' },
]

const DAY_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function getNextService() {
  const now = new Date()
  const currentDay = now.getDay()
  const currentHour = now.getHours()
  const currentMin = now.getMinutes()

  for (let offset = 0; offset < 7; offset++) {
    const checkDay = (currentDay + offset) % 7
    const dayName = DAY_ORDER[checkDay]
    const services = SCHEDULE.filter((s) => s.day === dayName)

    for (const svc of services) {
      const [hour, min] = svc.time.replace(' AM', '').replace(' PM', '').split(':').map(Number)
      const isPM = svc.time.includes('PM') && hour !== 12
      const h24 = isPM ? hour + 12 : hour === 12 && svc.time.includes('AM') ? 0 : hour

      if (offset > 0 || h24 > currentHour || (h24 === currentHour && min > currentMin)) {
        const target = new Date(now)
        target.setDate(now.getDate() + offset)
        target.setHours(h24, min, 0, 0)
        return { service: svc, target }
      }
    }
  }
  return null
}

function Countdown({ target }: { target: Date }) {
  const [diff, setDiff] = useState(0)

  useEffect(() => {
    const tick = () => setDiff(Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000)))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [target])

  const d = Math.floor(diff / 86400)
  const h = Math.floor((diff % 86400) / 3600)
  const m = Math.floor((diff % 3600) / 60)
  const s = diff % 60

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-3">
      {[
        { label: 'Days', value: d },
        { label: 'Hrs', value: h },
        { label: 'Min', value: m },
        { label: 'Sec', value: s },
      ].map(({ label, value }) => (
        <div key={label} className="text-center">
          <div className="w-14 h-14 glass-card rounded-xl flex items-center justify-center border border-brand-gold/30">
            <span className="text-xl font-display font-bold text-brand-gold tabular-nums">{pad(value)}</span>
          </div>
          <div className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">{label}</div>
        </div>
      ))}
    </div>
  )
}

export function LiveExperience() {
  const next = getNextService()

  return (
    <section className="py-24 bg-brand-blue relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06)_0%,transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Stream embed / placeholder */}
          <FadeInUp>
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-brand-navy border border-white/10 group">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="w-20 h-20 rounded-full bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors cursor-pointer">
                  <Play className="h-8 w-8 text-brand-gold fill-brand-gold ml-1" />
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Radio className="h-4 w-4 text-red-400 animate-pulse" />
                    <span className="text-sm font-medium text-white">Live Stream</span>
                  </div>
                  <p className="text-xs text-text-muted">Sundays at 10:30 AM</p>
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-1.5 bg-red-500/90 rounded-full px-3 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wide">Live</span>
                </div>
              </div>
            </div>
          </FadeInUp>

          {/* Right: Info */}
          <div className="space-y-8">
            <FadeInUp delay={0.1}>
              <div>
                <p className="text-brand-gold text-sm font-medium uppercase tracking-widest mb-2">Worship With Us</p>
                <h2 className="text-4xl font-display font-bold text-white leading-tight">
                  Join Us Live, In Person or Online
                </h2>
                <p className="text-text-muted mt-4 leading-relaxed">
                  Whether you join us from your home or walk through our doors, you belong here. Every service is a full, immersive worship experience.
                </p>
              </div>
            </FadeInUp>

            {/* Countdown to next service */}
            {next && (
              <FadeInUp delay={0.15}>
                <div className="p-5 rounded-xl bg-brand-gold/5 border border-brand-gold/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-brand-gold" />
                    <span className="text-sm text-brand-gold font-medium">
                      Next: {next.service.label} ({next.service.day} {next.service.time})
                    </span>
                  </div>
                  <Countdown target={next.target} />
                </div>
              </FadeInUp>
            )}

            {/* Service schedule */}
            <StaggerChildren delay={0.2}>
              <div className="space-y-2">
                {SCHEDULE.map((svc) => (
                  <div
                    key={`${svc.day}-${svc.time}`}
                    className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/3 border border-white/8 hover:border-white/15 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-text-muted flex-shrink-0" />
                      <div>
                        <span className="text-white text-sm font-medium">{svc.label}</span>
                        <span className="text-text-muted text-xs ml-2">{svc.day}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-brand-gold text-sm font-medium">{svc.time}</span>
                      {svc.type === 'live' && (
                        <span className="text-[10px] bg-red-500/20 text-red-400 rounded-full px-2 py-0.5 font-medium">Live</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </StaggerChildren>

            <FadeInUp delay={0.3}>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-light text-sm font-medium transition-colors"
              >
                View all events
                <ArrowRight className="h-4 w-4" />
              </Link>
            </FadeInUp>
          </div>
        </div>
      </div>
    </section>
  )
}
