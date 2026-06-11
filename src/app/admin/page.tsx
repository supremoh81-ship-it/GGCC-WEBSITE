import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import {
  Play,
  Heart,
  Calendar,
  Gift,
  Users,
  TrendingUp,
  Star,
  Mic,
  Eye,
} from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const [sermons, prayers, events, donations, users, testimonies] = await Promise.all([
    prisma.sermon.count({ where: { status: 'PUBLISHED' } }),
    prisma.prayerRequest.count({ where: { status: 'ACTIVE' } }),
    prisma.event.count({ where: { status: 'PUBLISHED' } }),
    prisma.donation.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true }, _count: true }),
    prisma.user.count(),
    prisma.testimony.count({ where: { status: 'PENDING' } }),
  ])

  return { sermons, prayers, events, donations, users, testimonies }
}

export default async function AdminDashboard() {
  const session = await auth()
  const stats = await getStats()

  const cards = [
    {
      title: 'Published Sermons',
      value: stats.sermons,
      icon: Play,
      href: '/admin/sermons',
      color: 'bg-brand-gold/10 text-brand-gold',
    },
    {
      title: 'Active Prayers',
      value: stats.prayers,
      icon: Heart,
      href: '/admin/prayers',
      color: 'bg-red-500/10 text-red-400',
    },
    {
      title: 'Upcoming Events',
      value: stats.events,
      icon: Calendar,
      href: '/admin/events',
      color: 'bg-blue-500/10 text-blue-400',
    },
    {
      title: 'Total Donations',
      value: `$${(Number(stats.donations._sum.amount ?? 0) / 1000).toFixed(1)}K`,
      icon: Gift,
      href: '/admin/giving',
      color: 'bg-green-500/10 text-green-400',
    },
    {
      title: 'Total Members',
      value: stats.users,
      icon: Users,
      href: '/admin/users',
      color: 'bg-purple-500/10 text-purple-400',
    },
    {
      title: 'Pending Testimonies',
      value: stats.testimonies,
      icon: Star,
      href: '/admin/testimonies',
      color: 'bg-yellow-500/10 text-yellow-400',
      urgent: stats.testimonies > 0,
    },
  ]

  const quickActions = [
    { label: 'Add Sermon', href: '/admin/sermons/new', icon: Play },
    { label: 'Add Event', href: '/admin/events/new', icon: Calendar },
    { label: 'Add Podcast', href: '/admin/podcasts/new', icon: Mic },
    { label: 'View Analytics', href: '/admin/analytics', icon: TrendingUp },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display-sm font-display text-white">
          Welcome back, <GoldShimmer>{session?.user?.name?.split(' ')[0]}</GoldShimmer>
        </h1>
        <p className="text-text-muted mt-1">
          Here is an overview of your church platform.
        </p>
      </div>

      {/* Stats grid */}
      <StaggerChildren className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <StaggerItem key={card.title}>
            <Link href={card.href}>
              <div className={`glass-card rounded-2xl p-5 glass-card-interactive relative ${card.urgent ? 'border-yellow-500/30' : ''}`}>
                {card.urgent && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                )}
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <div className="font-display font-bold text-2xl text-white mb-1">
                  {card.value.toLocaleString()}
                </div>
                <div className="text-xs text-text-muted">{card.title}</div>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerChildren>

      {/* Quick actions */}
      <div className="glass-card rounded-2xl p-6 mb-8">
        <h2 className="font-display font-semibold text-white text-lg mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2.5 p-4 rounded-xl border border-white/10 hover:border-brand-gold/40 hover:bg-brand-gold/5 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                <action.icon className="h-5 w-5 text-brand-gold" />
              </div>
              <span className="text-xs font-medium text-text-muted group-hover:text-white transition-colors text-center">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-white text-lg">Recent Activity</h2>
          <Link href="/admin/analytics" className="text-xs text-brand-gold hover:underline">
            View Analytics
          </Link>
        </div>
        <div className="flex items-center justify-center h-32 text-text-muted text-sm">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Activity feed loads from analytics data
          </div>
        </div>
      </div>
    </div>
  )
}
