import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'MINISTER']
  if (!adminRoles.includes(session.user.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    newUsersThisMonth,
    newUsersLastMonth,
    totalSermons,
    totalPlays,
    totalPrayers,
    pendingTestimonies,
    totalDonations,
    thisMonthDonations,
    lastMonthDonations,
    upcomingEvents,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.sermon.count({ where: { status: 'PUBLISHED' } }),
    prisma.sermonPlay.count(),
    prisma.prayerRequest.count(),
    prisma.testimony.count({ where: { status: 'PENDING' } }),
    prisma.donation.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.donation.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: thirtyDaysAgo } },
      _sum: { amount: true },
    }),
    prisma.donation.aggregate({
      where: { status: 'COMPLETED', createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
      _sum: { amount: true },
    }),
    prisma.event.count({ where: { status: 'PUBLISHED', startDate: { gte: now } } }),
  ])

  const growthRate = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100)
  }

  return NextResponse.json({
    users: {
      total: totalUsers,
      newThisMonth: newUsersThisMonth,
      growth: growthRate(newUsersThisMonth, newUsersLastMonth),
    },
    sermons: {
      total: totalSermons,
      totalPlays,
    },
    prayers: {
      total: totalPrayers,
    },
    testimonies: {
      pending: pendingTestimonies,
    },
    giving: {
      total: Number(totalDonations._sum.amount ?? 0),
      count: totalDonations._count,
      thisMonth: Number(thisMonthDonations._sum.amount ?? 0),
      lastMonth: Number(lastMonthDonations._sum.amount ?? 0),
      monthGrowth: growthRate(
        Number(thisMonthDonations._sum.amount ?? 0),
        Number(lastMonthDonations._sum.amount ?? 0)
      ),
    },
    events: {
      upcoming: upcomingEvents,
    },
  })
}

