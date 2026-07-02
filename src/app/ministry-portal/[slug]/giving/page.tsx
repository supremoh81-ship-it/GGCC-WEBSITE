import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import { HandCoins, TrendingUp, Users, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function GivingReportsPage({ params }: { params: { slug: string } }) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const ministry = await prisma.ministry.findUnique({ where: { slug: params.slug } })
  if (!ministry) notFound()
  if (
    ministry.leaderUserId !== session.user.id &&
    session.user.role !== 'ADMIN' &&
    session.user.role !== 'SUPER_ADMIN'
  ) redirect('/403')

  // All members of this ministry with their giving totals
  const members = await prisma.ministryMember.findMany({
    where: { ministryId: ministry.id },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          donations: {
            where: { status: 'COMPLETED' },
            select: { amount: true, createdAt: true, frequency: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      },
    },
  })

  const memberGiving = members.map((m) => {
    const total = m.user.donations.reduce((sum, d) => sum + Number(d.amount), 0)
    const lastGift = m.user.donations[0]
    return {
      id: m.userId,
      name: `${m.user.firstName} ${m.user.lastName}`,
      email: m.user.email,
      total,
      giftCount: m.user.donations.length,
      lastGift: lastGift?.createdAt ?? null,
    }
  }).sort((a, b) => b.total - a.total)

  const totalGiving = memberGiving.reduce((s, m) => s + m.total, 0)
  const givingMembers = memberGiving.filter((m) => m.total > 0).length
  const topGiver = memberGiving[0]

  return (
    <div className="p-6 sm:p-10">
      <div className="mb-8">
        <div className="text-xs text-text-muted tracking-widest uppercase mb-1">Ministry Unit</div>
        <h1 className="font-display font-bold text-white text-2xl sm:text-3xl flex items-center gap-3">
          <HandCoins className="h-7 w-7 text-brand-magenta-light" />
          Giving Reports
        </h1>
        <p className="text-text-muted mt-1">
          Overview of giving from members of {ministry.name}. Amounts are cumulative totals.
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="glass-card rounded-2xl p-5 border border-white/8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-brand-magenta/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-brand-magenta-light" />
            </div>
            <span className="text-xs text-text-muted uppercase tracking-wider">Total Given</span>
          </div>
          <div className="font-display font-bold text-2xl text-brand-gold">
            {'₦'}{totalGiving.toLocaleString()}
          </div>
          <div className="text-xs text-text-muted mt-1">All-time from unit members</div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-white/8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-brand-gold/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-brand-gold" />
            </div>
            <span className="text-xs text-text-muted uppercase tracking-wider">Active Givers</span>
          </div>
          <div className="font-display font-bold text-2xl text-white">
            {givingMembers} <span className="text-text-muted text-base font-normal">/ {members.length}</span>
          </div>
          <div className="text-xs text-text-muted mt-1">Members who have given</div>
        </div>
        <div className="glass-card rounded-2xl p-5 border border-white/8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-brand-teal/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-brand-teal-light" />
            </div>
            <span className="text-xs text-text-muted uppercase tracking-wider">Top Contributor</span>
          </div>
          <div className="font-display font-bold text-xl text-white truncate">
            {topGiver?.total > 0 ? topGiver.name : 'N/A'}
          </div>
          {topGiver?.total > 0 && (
            <div className="text-xs text-text-muted mt-1">{'₦'}{topGiver.total.toLocaleString()} total</div>
          )}
        </div>
      </div>

      {/* Member giving table */}
      <div className="glass-card rounded-2xl border border-white/8 overflow-hidden">
        {memberGiving.length === 0 ? (
          <div className="text-center py-16 text-text-muted text-sm">
            No members in this unit yet. Add members to see their giving records.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Member</th>
                  <th className="text-right px-5 py-3">Total Given</th>
                  <th className="text-right px-5 py-3">Gift Count</th>
                  <th className="text-left px-5 py-3">Last Gift</th>
                  <th className="text-left px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {memberGiving.map((m, i) => (
                  <tr key={m.id} className="border-b border-white/6 last:border-0 hover:bg-white/4 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-brand-gold/20 flex items-center justify-center text-xs font-bold text-brand-gold shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <div className="text-white font-medium">{m.name}</div>
                          <div className="text-xs text-text-muted">{m.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-brand-gold">
                      {m.total > 0 ? `₦${m.total.toLocaleString()}` : <span className="text-white/30">-</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right text-text-muted">{m.giftCount || '-'}</td>
                    <td className="px-5 py-3.5 text-text-muted text-xs">
                      {m.lastGift ? format(new Date(m.lastGift), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="px-5 py-3.5">
                      {m.total > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-400/10 text-green-400">
                          Active Giver
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-muted">
                          No Record
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-white/8 text-xs text-text-muted">
          Giving data reflects records in the GGCC system. Encourage members to give through the official platform.
        </div>
      </div>
    </div>
  )
}
