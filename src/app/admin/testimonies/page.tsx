import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { format } from 'date-fns'
import { AdminTestimonyActions } from '@/components/admin/TestimonyActions'

export const metadata: Metadata = { title: 'Testimonies | Admin' }

export default async function AdminTestimoniesPage() {
  const testimonies = await prisma.testimony.findMany({
    orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    take: 50,
    include: {
      user: { select: { firstName: true, lastName: true } },
    },
  })

  const pending = testimonies.filter((t) => t.status === 'PENDING').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-white">Testimonies</h1>
        <p className="text-sm text-text-muted mt-0.5">
          {testimonies.length} total &bull;{' '}
          <span className="text-amber-400">{pending} pending review</span>
        </p>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Testimony</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden md:table-cell">Submitted By</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Status</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden md:table-cell">Date</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {testimonies.map((t) => (
              <tr key={t.id} className="hover:bg-white/3 transition-colors">
                <td className="px-5 py-3.5 max-w-xs">
                  <div className="text-white font-medium line-clamp-1">{t.title}</div>
                  <div className="text-xs text-text-muted line-clamp-1 mt-0.5">{t.body}</div>
                </td>
                <td className="px-5 py-3.5 text-text-muted text-xs hidden md:table-cell">
                  {t.name ?? (t.user ? `${t.user.firstName} ${t.user.lastName}` : 'Anonymous')}
                </td>
                <td className="px-5 py-3.5">
                  <Badge
                    variant={
                      t.status === 'APPROVED'
                        ? 'success'
                        : t.status === 'PENDING'
                        ? 'gold'
                        : 'danger'
                    }
                    className="text-[10px]"
                  >
                    {t.status.toLowerCase()}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-text-muted text-xs hidden md:table-cell">
                  {format(new Date(t.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-5 py-3.5">
                  {t.status === 'PENDING' && (
                    <AdminTestimonyActions id={t.id} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {testimonies.length === 0 && (
          <div className="py-16 text-center text-text-muted">No testimonies submitted yet.</div>
        )}
      </div>
    </div>
  )
}
