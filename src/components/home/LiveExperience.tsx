'use client'

import { useState, useEffect } from 'react'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { Radio, Clock, Users, Facebook, Video, Calendar, Tv } from 'lucide-react'

type Platform = 'facebook' | 'zoom' | 'whatsapp'

interface Session {
  id: string
  name: string
  shortName: string
  host: string
  days: number[]   // 0=Sun … 6=Sat
  dayLabel: string
  time: string     // 24-hr "HH:MM"
  displayTime: string
  platforms: Platform[]
  description: string
  color: string
}

const WEEKLY_SERVICES = [
  {
    day: 'Sunday',
    services: [
      { name: 'Sunday School Service', time: '8:00 AM', live: false, streamEmbed: false },
      { name: 'Main Service', time: '10:00 AM', live: true, streamEmbed: true },
    ],
  },
  {
    day: 'Thursday',
    services: [
      { name: 'Midweek Service (School of Purpose)', time: '5:00 PM', live: false, streamEmbed: false },
    ],
  },
  {
    day: 'Saturday',
    services: [
      { name: 'Choir Rehearsal', time: '5:00 PM', live: false, streamEmbed: false },
      { name: 'Church Cleaning', time: '', live: false, streamEmbed: false },
    ],
  },
]

const SESSIONS: Session[] = [
  {
    id: 'ypp',
    name: 'YPP — Young People Pray',
    shortName: 'YPP',
    host: 'Pastorate / Pastoral Team',
    days: [5],
    dayLabel: 'Every Friday',
    time: '19:00',
    displayTime: '7:00 PM',
    platforms: ['facebook', 'zoom'],
    description: 'Pastors reach out to people online, pray for them, and fellowship together.',
    color: 'from-violet-500/20 to-transparent',
  },
  {
    id: 'emp',
    name: 'Early Morning Prayer',
    shortName: 'Morning Prayer',
    host: 'Pastorate / Pastoral Team',
    days: [1, 2, 3, 4, 5],
    dayLabel: 'Monday – Friday',
    time: '06:30',
    displayTime: '6:30 AM',
    platforms: ['whatsapp', 'zoom'],
    description: 'Share prayer requests, pray for one another, and receive prophecy.',
    color: 'from-amber-500/20 to-transparent',
  },
  {
    id: 'intercession',
    name: 'Sunday Intercession',
    shortName: 'Intercession',
    host: 'Pastorate / Pastoral Team',
    days: [0],
    dayLabel: 'Every Sunday',
    time: '14:00',
    displayTime: '2:00 PM',
    platforms: ['zoom'],
    description: 'Hosted by the Pastoral Team to intercede for the church and the nations.',
    color: 'from-sky-500/20 to-transparent',
  },
]

function getNextSession(): { session: Session; target: Date } | null {
  const now = new Date()
  let best: { session: Session; target: Date } | null = null

  for (const session of SESSIONS) {
    for (let offset = 0; offset < 7; offset++) {
      const candidate = new Date(now)
      candidate.setDate(now.getDate() + offset)
      const dow = candidate.getDay()
      if (!session.days.includes(dow)) continue

      const [h, m] = session.time.split(':').map(Number)
      candidate.setHours(h, m, 0, 0)
      if (candidate.getTime() <= now.getTime()) continue

      if (!best || candidate.getTime() < best.target.getTime()) {
        best = { session, target: candidate }
      }
      break
    }
  }
  return best
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

function PlatformBadge({ platform }: { platform: Platform }) {
  const config: Record<Platform, { icon: React.ReactNode; label: string; cls: string }> = {
    facebook: {
      icon: <Facebook className="h-3 w-3" />,
      label: 'Facebook',
      cls: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
    },
    zoom: {
      icon: <Video className="h-3 w-3" />,
      label: 'Zoom',
      cls: 'bg-sky-500/15 border-sky-500/30 text-sky-400',
    },
    whatsapp: {
      icon: (
        <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.856L.057 23.571a.5.5 0 0 0 .611.611l5.715-1.475A11.946 11.946 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.817 9.817 0 0 1-5.003-1.37l-.36-.213-3.731.962.984-3.614-.235-.371A9.818 9.818 0 1 1 12 21.818z" />
        </svg>
      ),
      label: 'WhatsApp',
      cls: 'bg-green-500/15 border-green-500/30 text-green-400',
    },
  }
  const { icon, label, cls } = config[platform]
  return (
    <span className={`inline-flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-[11px] font-medium ${cls}`}>
      {icon}
      {label}
    </span>
  )
}

export function LiveExperience() {
  const next = getNextSession()

  return (
    <section className="py-24 bg-brand-blue relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.06)_0%,transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <FadeInUp className="text-center mb-14">
          <span className="section-label mb-4 inline-flex justify-center">
            <Radio className="h-3.5 w-3.5 mr-1.5 animate-pulse text-red-400" />
            Join Us Live
          </span>
          <h2 className="text-display-lg font-display text-white mb-4">
            Prayer Sessions
          </h2>
          <p className="text-body-lg text-text-muted max-w-2xl mx-auto">
            Hosted by our Pastoral Team. Join us online to pray, fellowship, and encounter God together
            — wherever you are in the world.
          </p>
        </FadeInUp>

        {/* Session cards */}
        <StaggerChildren className="grid md:grid-cols-3 gap-6 mb-14">
          {SESSIONS.map((session) => (
            <StaggerItem key={session.id}>
              <div className={`relative rounded-3xl overflow-hidden bg-brand-navy border border-white/8 hover:border-brand-gold/30 transition-all duration-500 h-full flex flex-col`}>
                {/* Top colour strip */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${session.color}`} />

                <div className="p-7 flex flex-col gap-4 flex-1">
                  {/* Title */}
                  <div>
                    <h3 className="font-display font-bold text-white text-lg leading-snug mb-1">
                      {session.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-text-muted">
                      <Users className="h-3 w-3" />
                      {session.host}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-text-muted leading-relaxed flex-1">
                    {session.description}
                  </p>

                  {/* Schedule */}
                  <div className="flex items-center gap-2 bg-brand-gold/8 border border-brand-gold/20 rounded-xl px-4 py-3">
                    <Clock className="h-4 w-4 text-brand-gold shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-white">{session.displayTime}</p>
                      <p className="text-[11px] text-text-muted">{session.dayLabel}</p>
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="flex flex-wrap gap-2">
                    {session.platforms.map((p) => (
                      <PlatformBadge key={p} platform={p} />
                    ))}
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Countdown to next session */}
        {next && (
          <FadeInUp>
            <div className="glass-card rounded-2xl p-7 flex flex-col sm:flex-row items-center gap-6 justify-between max-w-2xl mx-auto mb-24">
              <div>
                <p className="text-xs text-brand-gold font-semibold tracking-widest uppercase mb-1">
                  Next Prayer Session
                </p>
                <p className="text-white font-display font-bold text-lg">{next.session.name}</p>
                <p className="text-text-muted text-sm">
                  {next.session.dayLabel} at {next.session.displayTime}
                </p>
              </div>
              <Countdown target={next.target} />
            </div>
          </FadeInUp>
        )}

        {/* Order of the Week Service */}
        <FadeInUp className="text-center mb-10">
          <span className="section-label mb-4 inline-flex justify-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            Weekly Schedule
          </span>
          <h2 className="text-display-md font-display text-white mb-3">
            Order of the Week Service
          </h2>
          <p className="text-body-lg text-text-muted max-w-xl mx-auto">
            Join us in person at our Osogbo location. The Main Sunday Service is also
            streamed live online.
          </p>
        </FadeInUp>

        <StaggerChildren className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {WEEKLY_SERVICES.map((group) => (
            <StaggerItem key={group.day}>
              <div className="glass-card rounded-2xl overflow-hidden h-full">
                {/* Day header */}
                <div className="bg-brand-gold/10 border-b border-brand-gold/20 px-5 py-3">
                  <h3 className="font-display font-bold text-brand-gold text-sm tracking-widest uppercase">
                    {group.day}
                  </h3>
                </div>

                {/* Services */}
                <div className="p-5 space-y-3">
                  {group.services.map((svc) => (
                    <div key={svc.name}>
                      <div className="flex items-start justify-between gap-3 py-2 border-b border-white/5 last:border-0">
                        <div className="flex items-start gap-2 min-w-0">
                          <Clock className="h-3.5 w-3.5 text-text-muted mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white leading-snug">{svc.name}</p>
                            {svc.live && (
                              <span className="inline-flex items-center gap-1 mt-1 text-[10px] bg-red-500/20 text-red-400 rounded-full px-2 py-0.5 font-medium">
                                <Tv className="h-2.5 w-2.5" />
                                Live Stream
                              </span>
                            )}
                          </div>
                        </div>
                        {svc.time && (
                          <span className="text-brand-gold text-sm font-semibold whitespace-nowrap shrink-0">
                            {svc.time}
                          </span>
                        )}
                      </div>

                      {/* Mini live stream screen */}
                      {svc.streamEmbed && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-white/10 bg-brand-navy aspect-video relative group cursor-pointer">
                          {/* Screen background */}
                          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-[#0d1e3a] to-brand-blue" />

                          {/* Scan-line texture */}
                          <div
                            className="absolute inset-0 opacity-5 pointer-events-none"
                            style={{
                              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px)',
                            }}
                          />

                          {/* Gold glow behind play */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="absolute w-24 h-24 rounded-full bg-brand-gold/10 blur-2xl" />
                          </div>

                          {/* Play button */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center group-hover:bg-brand-gold/30 group-hover:scale-110 transition-all duration-300">
                              <Tv className="h-4 w-4 text-brand-gold" />
                            </div>
                            <p className="text-[11px] text-white/70 font-medium tracking-wide">Watch Live</p>
                          </div>

                          {/* LIVE badge */}
                          <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500/90 rounded-full px-2 py-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span className="text-[9px] font-bold text-white uppercase tracking-wider">Live</span>
                          </div>

                          {/* Sundays label */}
                          <div className="absolute bottom-2 right-2">
                            <span className="text-[9px] text-white/40 tracking-widest uppercase">Sundays 10 AM</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

      </div>
    </section>
  )
}
