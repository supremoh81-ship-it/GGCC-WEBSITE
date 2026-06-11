import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { format } from 'date-fns'
import { TrendingUp, DollarSign, Users, RefreshCw } from 'lucide-react'

export const metadata: Metadata = { title: 'Giving | Admin' }

export default async function AdminGivingPage() {
  const [donations, aggregate, campaigns] = await Promise.all([
    prisma.donation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    }),
    prisma.donation.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.givingCampaign.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const total = Number(aggregate._sum.amount ?? 0)

  const statusVariant = (s: string) => {
    if (s === 'COMPLETED') return 'success' as const
    if (s === 'PENDING') return 'gold' as const
    if (s === 'FAILED') return 'danger' as const
    return 'muted' as const
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-white">Giving</h1>
        <p className="text-sm text-text-muted mt-0.5">Donations and campaigns overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: DollarSign, label: 'Total Raised', value: `$${total.toFixed(2)}`, color: '#C9A84C' },
          { icon: Users, label: 'Donors', value: String(aggregate._count), color: '#5B8DD9' },
          {
            icon: TrendingUp,
            label: 'Active Campaigns',
            value: String(campaigns.length),
            color: '#56B87D',
          },
          {
            icon: RefreshCw,
            label: 'Recurring',
            value: String(donations.filter((d) => d.frequency !== 'ONE_TIME').length),
            color: '#9B72CF',
          },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
              <span className="text-xs text-text-muted">{s.label}</span>
            </div>
            <div className="text-xl font-display font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Active campaigns */}
      {campaigns.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-4 text-sm">Active Campaigns</h2>
          <div className="space-y-3">
            {campaigns.map((c) => {
              const pct = Math.min(
                100,
                Math.round((Number(c.raisedAmount) / Number(c.goalAmount)) * 100)
              )
              return (
                <div key={c.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-white font-medium">{c.title}</span>
                    <span className="text-text-muted text-xs">
                      ${Number(c.raisedAmount).toFixed(0)} / ${Number(c.goalAmount).toFixed(0)}
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div
                      className="bg-brand-gold h-1.5 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Donations table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8">
          <h2 className="font-semibold text-white text-sm">Recent Donations</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Donor</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Amount</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden sm:table-cell">Fund</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden md:table-cell">Frequency</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Status</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden lg:table-cell">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {donations.map((d) => (
              <tr key={d.id} className="hover:bg-white/3 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="text-white font-medium text-sm">
                    {d.user
                      ? `${d.user.firstName} ${d.user.lastName}`
                      : 'Anonymous'}
                  </div>
                  {d.user && (
                    <div className="text-xs text-text-muted">{d.user.email}</div>
                  )}
                </td>
                <td className="px-5 py-3.5 font-semibold text-brand-gold">
                  ${Number(d.amount).toFixed(2)}
                </td>
                <td className="px-5 py-3.5 text-text-muted hidden sm:table-cell text-xs">
                  General
                </td>
                <td className="px-5 py-3.5 text-text-muted text-xs capitalize hidden md:table-cell">
                  {d.frequency.replace('_', ' ').toLowerCase()}
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={statusVariant(d.status)} className="text-[10px]">
                    {d.status.toLowerCase()}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-text-muted text-xs hidden lg:table-cell">
                  {format(new Date(d.createdAt), 'MMM d, yyyy')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
