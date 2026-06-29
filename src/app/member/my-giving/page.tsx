import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { Badge } from '@/components/ui/Badge'
import { Heart, ArrowRight, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'

export const metadata: Metadata = { title: 'My Giving' }

export default async function MyGivingPage() {
  const session = await auth()
  const userId = session!.user.id

  const [donations, aggregate] = await Promise.all([
    prisma.donation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.donation.aggregate({
      where: { userId, status: 'COMPLETED' },
      _sum: { amount: true },
      _count: true,
    }),
  ])

  const total = Number(aggregate._sum.amount ?? 0)
  const count = aggregate._count

  const statusVariant = (s: string) => {
    if (s === 'COMPLETED') return 'success' as const
    if (s === 'PENDING') return 'gold' as const
    return 'muted' as const
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <FadeInUp>
        <h1 className="text-2xl font-display font-bold text-white">My Giving</h1>
        <p className="text-text-muted mt-1">A record of your generosity and impact.</p>
      </FadeInUp>

      {/* Summary */}
      <FadeInUp>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Given', value: `$${total.toFixed(2)}`, icon: Heart, color: '#C9A84C' },
            { label: 'Donations Made', value: String(count), icon: TrendingUp, color: '#5B8DD9' },
            { label: 'Year to Date', value: '$0.00', icon: TrendingUp, color: '#56B87D' },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <s.icon className="h-4 w-4" style={{ color: s.color }} />
                <span className="text-xs text-text-muted">{s.label}</span>
              </div>
              <div className="text-2xl font-display font-bold text-white">{s.value}</div>
            </div>
          ))}
        </div>
      </FadeInUp>

      {/* Donation history */}
      <FadeInUp>
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/8">
            <h2 className="font-semibold text-white">Giving History</h2>
            <Link href="/give" className="flex items-center gap-1 text-sm text-brand-gold hover:underline">
              Give Again <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {donations.length === 0 ? (
            <div className="p-10 text-center">
              <Heart className="h-10 w-10 text-text-muted mx-auto mb-3" />
              <p className="text-text-muted">No giving history yet.</p>
              <Link href="/give" className="btn-gold mt-4 inline-flex">Give Your First Offering</Link>
            </div>
          ) : (
            <div className="divide-y divide-white/8">
              {donations.map((d) => (
                <div key={d.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-white">
                      General Offering
                    </div>
                    <div className="text-xs text-text-muted mt-0.5">
                      {format(new Date(d.createdAt), 'MMM d, yyyy')}
                      {d.frequency !== 'ONE_TIME' && (
                        <span className="ml-2 text-brand-gold capitalize">
                          {d.frequency.toLowerCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusVariant(d.status)} className="text-[10px]">
                      {d.status.toLowerCase()}
                    </Badge>
                    <div className="text-sm font-semibold text-white">
                      ${Number(d.amount).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </FadeInUp>
    </div>
  )
}
