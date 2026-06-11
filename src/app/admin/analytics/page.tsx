import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import {
  Users,
  TrendingUp,
  Heart,
  Play,
  DollarSign,
  Calendar,
  BookOpen,
  Star,
} from 'lucide-react'

export const metadata: Metadata = { title: 'Analytics | Admin' }

export default async function AdminAnalyticsPage() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    newUsers,
    totalSermons,
    totalPlays,
    totalPrayers,
    prayersThisMonth,
    totalDonations,
    thisMonthDonations,
    upcomingEvents,
    testimoniesPending,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.sermon.count({ where: { status: 'PUBLISHED' } }),
    prisma.sermonPlay.count(),
    prisma.prayerRequest.count(),
    prisma.prayerRequest.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.donation.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    }),
    prisma.donation.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: thirtyDaysAgo } },
      _sum: { amount: true },
    }),
    prisma.event.count({ where: { status: 'PUBLISHED', startDate: { gte: now } } }),
    prisma.testimony.count({ where: { status: 'PENDING' } }),
  ])

  const stats = [
    {
      icon: Users,
      label: 'Total Members',
      value: totalUsers.toLocaleString(),
      sub: `+${newUsers} this month`,
      color: '#5B8DD9',
    },
    {
      icon: Play,
      label: 'Sermon Plays',
      value: totalPlays.toLocaleString(),
      sub: `${totalSermons} published sermons`,
      color: '#C9A84C',
    },
    {
      icon: Heart,
      label: 'Prayer Requests',
      value: totalPrayers.toLocaleString(),
      sub: `${prayersThisMonth} this month`,
      color: '#E85D75',
    },
    {
      icon: DollarSign,
      label: 'Total Giving',
      value: `$${Number(totalDonations._sum.amount ?? 0).toLocaleString()}`,
      sub: `$${Number(thisMonthDonations._sum.amount ?? 0).toLocaleString()} this month`,
      color: '#56B87D',
    },
    {
      icon: Calendar,
      label: 'Upcoming Events',
      value: String(upcomingEvents),
      sub: 'Published and scheduled',
      color: '#9B72CF',
    },
    {
      icon: Star,
      label: 'Testimonies Pending',
      value: String(testimoniesPending),
      sub: 'Awaiting review',
      color: '#F0A500',
    },
  ]

  return (
    <div className="space-y-8">
      <FadeInUp>
        <h1 className="text-xl font-display font-bold text-white">Analytics</h1>
        <p className="text-sm text-text-muted mt-0.5">Platform-wide statistics and trends.</p>
      </FadeInUp>

      <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((s) => (
          <StaggerItem key={s.label}>
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}
                >
                  <s.icon className="h-5 w-5" style={{ color: s.color }} />
                </div>
                <span className="text-xs text-text-muted">{s.label}</span>
              </div>
              <div className="text-3xl font-display font-bold text-white mb-1">{s.value}</div>
              <div className="text-xs text-text-muted">{s.sub}</div>
            </div>
          </StaggerItem>
        ))}
      </StaggerChildren>

      <FadeInUp>
        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4">Recent Activity</h2>
          <p className="text-sm text-text-muted">
            Full analytics charts with time-series data are available once connected to the analytics service.
            Connect Plausible or PostHog via the Settings page to enable rich data visualizations.
          </p>
        </div>
      </FadeInUp>
    </div>
  )
}
