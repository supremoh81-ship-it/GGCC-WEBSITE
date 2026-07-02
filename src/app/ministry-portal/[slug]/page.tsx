import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, CalendarCheck, HandCoins, FileText, TrendingUp, Clock } from 'lucide-react'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

async function getMinistryOrThrow(slug: string, userId: string, role: string) {
  const ministry = await prisma.ministry.findUnique({
    where: { slug },
    include: {
      members: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
      attendance: { orderBy: { sessionDate: 'desc' }, take: 5 },
      reports: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  })
  if (!ministry) notFound()
  if (
    ministry.leaderUserId !== userId &&
    role !== 'ADMIN' &&
    role !== 'SUPER_ADMIN'
  ) redirect('/403')
  return ministry
}

export default async function MinistryDashboardPage({ params }: { params: { slug: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const ministry = await getMinistryOrThrow(params.slug, session.user.id, session.user.role!)

  const thisMonth = new Date()
  const [memberCount, attendanceSessions, totalGiving, pendingReport] = await Promise.all([
    prisma.ministryMember.count({ where: { ministryId: ministry.id } }),
    prisma.ministryAttendance.count({ where: { ministryId: ministry.id } }),
    prisma.donation.aggregate({
      where: {
        status: 'COMPLETED',
        user: { ministryMembers: { some: { ministryId: ministry.id } } },
      },
      _sum: { amount: true },
    }),
    prisma.ministryMonthlyReport.findFirst({
      where: {
        ministryId: ministry.id,
        month: thisMonth.getMonth() + 1,
        year: thisMonth.getFullYear(),
      },
    }),
  ])

  const stats = [
    { label: 'Total Members', value: memberCount, icon: Users, color: 'text-brand-gold', bg: 'bg-brand-gold/10', href: 'members' },
    { label: 'Sessions Logged', value: attendanceSessions, icon: CalendarCheck, color: 'text-brand-teal-light', bg: 'bg-brand-teal/10', href: 'attendance' },
    { label: 'Unit Giving (Total)', value: `₦${Number(totalGiving._sum.amount ?? 0).toLocaleString()}`, icon: HandCoins, color: 'text-brand-magenta-light', bg: 'bg-brand-magenta/10', href: 'giving' },
    { label: 'Monthly Report', value: pendingReport ? 'Submitted' : 'Due', icon: FileText, color: pendingReport ? 'text-green-400' : 'text-amber-400', bg: pendingReport ? 'bg-green-400/10' : 'bg-amber-400/10', href: 'reports' },
  ]

  return (
    <div className="p-6 sm:p-10">
      {/* Header */}
      <div className="mb-10">
        <div className="text-xs text-text-muted tracking-widest uppercase mb-1">Ministry Unit</div>
        <h1 className="font-display font-bold text-white text-3xl sm:text-4xl">{ministry.name}</h1>
        {ministry.tagline && <p className="text-text-muted mt-1">{ministry.tagline}</p>}
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={`/ministry-portal/${params.slug}/${s.href}`} className="group">
            <div className="glass-card rounded-2xl p-5 border border-white/8 hover:border-brand-gold/25 transition-colors">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div className={`font-display font-bold text-2xl mb-1 ${s.color}`}>{s.value}</div>
              <div className="text-xs text-text-muted">{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent attendance */}
      {ministry.attendance.length > 0 && (
        <div className="glass-card rounded-2xl p-6 mb-6 border border-white/8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white text-lg">Recent Sessions</h2>
            <Link href={`/ministry-portal/${params.slug}/attendance`} className="text-xs text-brand-gold hover:underline">
              View all &rarr;
            </Link>
          </div>
          <div className="space-y-3">
            {ministry.attendance.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3 border-b border-white/6 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-brand-gold" />
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">{a.sessionName || 'Meeting'}</div>
                    <div className="text-xs text-text-muted">{format(new Date(a.sessionDate), 'EEEE, MMMM d, yyyy')}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-brand-gold">{a.memberCount + a.guestCount}</div>
                  <div className="text-xs text-text-muted">present</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link href={`/ministry-portal/${params.slug}/attendance`} className="glass-card rounded-2xl p-5 border border-white/8 hover:border-brand-gold/25 transition-colors group flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-teal/10 flex items-center justify-center">
            <CalendarCheck className="h-5 w-5 text-brand-teal-light" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white group-hover:text-brand-gold transition-colors">Log Today&apos;s Attendance</div>
            <div className="text-xs text-text-muted">Record who attended the last session</div>
          </div>
        </Link>
        <Link href={`/ministry-portal/${params.slug}/reports`} className="glass-card rounded-2xl p-5 border border-white/8 hover:border-brand-gold/25 transition-colors group flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-magenta/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-brand-magenta-light" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white group-hover:text-brand-gold transition-colors">Submit Monthly Report</div>
            <div className="text-xs text-text-muted">Send your monthly update to leadership</div>
          </div>
        </Link>
      </div>
    </div>
  )
}
