import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { Heart, Calendar, BookmarkCheck, ArrowRight, Play } from 'lucide-react'

export const metadata: Metadata = { title: 'Member Dashboard' }

export default async function MemberDashboardPage() {
  const session = await auth()
  const userId = session!.user.id

  const [prayerCount, eventCount, donationTotal] = await Promise.all([
    prisma.prayerRequest.count({ where: { userId } }),
    prisma.eventRegistration.count({ where: { userId } }),
    prisma.donation.aggregate({
      where: { userId, status: 'COMPLETED' },
      _sum: { amount: true },
    }),
  ])

  const recentSermons = await prisma.sermon.findMany({
    take: 3,
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    include: { speaker: true },
  })

  const firstName = session!.user.name?.split(' ')[0] ?? 'Friend'

  return (
    <div className="space-y-8">
      <FadeInUp>
        <h1 className="text-2xl font-display font-bold text-white">
          Welcome back, {firstName}
        </h1>
        <p className="text-text-muted mt-1">Here is a summary of your faith journey.</p>
      </FadeInUp>

      {/* Stats */}
      <StaggerChildren className="grid sm:grid-cols-3 gap-5">
        {[
          {
            icon: Heart,
            label: 'Prayers Submitted',
            value: prayerCount,
            href: '/member/my-prayers',
            color: '#E85D75',
          },
          {
            icon: Calendar,
            label: 'Events Registered',
            value: eventCount,
            href: '/member/my-events',
            color: '#5B8DD9',
          },
          {
            icon: BookmarkCheck,
            label: 'Total Given',
            value: `$${(Number(donationTotal._sum.amount) || 0).toFixed(2)}`,
            href: '/member/my-giving',
            color: '#C9A84C',
          },
        ].map((s) => (
          <StaggerItem key={s.label}>
            <Link href={s.href} className="glass-card rounded-2xl p-6 block hover:border-white/20 transition-all group">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}
              >
                <s.icon className="h-5 w-5" style={{ color: s.color }} />
              </div>
              <div className="text-2xl font-display font-bold text-white">{s.value}</div>
              <div className="text-xs text-text-muted mt-1">{s.label}</div>
              <div
                className="flex items-center gap-1 text-xs mt-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: s.color }}
              >
                View details <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerChildren>

      {/* Recent Sermons */}
      <FadeInUp>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-white text-lg">Continue Watching</h2>
          <Link href="/sermons" className="text-sm text-brand-gold hover:underline flex items-center gap-1">
            All sermons <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {recentSermons.map((s) => (
            <Link key={s.id} href={`/sermons/${s.slug}`} className="glass-card rounded-xl p-4 group hover:border-white/20 transition-all block">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-gold/20 transition-colors">
                  <Play className="h-4 w-4 text-brand-gold fill-current ml-0.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white line-clamp-2 group-hover:text-brand-gold transition-colors">
                    {s.title}
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    {s.speaker?.name ?? 'GGCC'}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </FadeInUp>

      {/* Quick actions */}
      <FadeInUp delay={0.2}>
        <h2 className="font-display font-semibold text-white text-lg mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { label: 'Submit a Prayer Request', href: '/prayer', color: '#E85D75' },
            { label: 'Register for an Event', href: '/events', color: '#5B8DD9' },
            { label: 'Give an Offering', href: '/give', color: '#C9A84C' },
            { label: 'Share a Testimony', href: '/testimonies/submit', color: '#56B87D' },
          ].map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className="flex items-center justify-between glass-card rounded-xl px-5 py-4 group hover:border-white/20 transition-all"
            >
              <span className="text-sm text-white font-medium">{a.label}</span>
              <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-white group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </FadeInUp>
    </div>
  )
}
