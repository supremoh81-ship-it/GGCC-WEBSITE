import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { Heart, Globe, Eye, Lock } from 'lucide-react'
import { format } from 'date-fns'

export const metadata: Metadata = { title: 'Prayers | Admin' }

const visibilityIcon = { PUBLIC: Globe, ANONYMOUS: Eye, PRIVATE: Lock }

export default async function AdminPrayersPage() {
  const prayers = await prisma.prayerRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
    },
  })

  const total = await prisma.prayerRequest.count()
  const answered = await prisma.prayerRequest.count({ where: { status: 'ANSWERED' } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-white">Prayer Requests</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {total} total &bull; {answered} answered
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: total, color: '#5B8DD9' },
          { label: 'Answered', value: answered, color: '#56B87D' },
          { label: 'Active', value: total - answered, color: '#C9A84C' },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <div className="font-display font-bold text-xl text-white">{s.value}</div>
            <div className="text-xs text-text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Request</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden md:table-cell">Submitted By</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Visibility</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Status</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden sm:table-cell">Praying</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden lg:table-cell">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {prayers.map((p) => {
              const VisIcon = visibilityIcon[p.visibility as keyof typeof visibilityIcon] ?? Globe
              return (
                <tr key={p.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3.5 max-w-xs">
                    <div className="text-white font-medium line-clamp-1">{p.title}</div>
                    {p.body && (
                      <div className="text-xs text-text-muted line-clamp-1 mt-0.5">{p.body}</div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-text-muted hidden md:table-cell text-xs">
                    {p.visibility === 'ANONYMOUS'
                      ? 'Anonymous'
                      : p.user
                      ? `${p.user.firstName} ${p.user.lastName}`
                      : 'Guest'}
                  </td>
                  <td className="px-5 py-3.5">
                    <VisIcon className="h-4 w-4 text-text-muted" />
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge
                      variant={p.status === 'ANSWERED' ? 'success' : 'muted'}
                      className="text-[10px]"
                    >
                      {p.status.toLowerCase()}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <div className="flex items-center gap-1 text-xs text-brand-gold">
                      <Heart className="h-3 w-3 fill-current" />
                      {p.intercedeCount}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-text-muted text-xs hidden lg:table-cell">
                    {format(new Date(p.createdAt), 'MMM d, yyyy')}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
