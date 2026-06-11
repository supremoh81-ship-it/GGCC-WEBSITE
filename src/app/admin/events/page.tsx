import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit2, MapPin, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export const metadata: Metadata = { title: 'Events | Admin' }

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: 'desc' },
    take: 50,
    include: {
      _count: { select: { registrations: true } },
    },
  })

  const statusVariant = (s: string) => {
    if (s === 'PUBLISHED') return 'success' as const
    if (s === 'DRAFT') return 'muted' as const
    if (s === 'CANCELLED') return 'danger' as const
    return 'gold' as const
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-white">Events</h1>
          <p className="text-sm text-text-muted mt-0.5">{events.length} events</p>
        </div>
        <Link href="/admin/events/new" className="btn-gold text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Event
        </Link>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Event</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden md:table-cell">Date</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden lg:table-cell">Location</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Status</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden sm:table-cell">Registrations</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {events.map((e) => (
              <tr key={e.id} className="hover:bg-white/3 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="text-white font-medium line-clamp-1">{e.title}</div>
                  <div className="text-xs text-text-muted capitalize mt-0.5">
                    {e.type.replace('_', ' ').toLowerCase()}
                  </div>
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(e.startDate), 'MMM d, yyyy')}
                  </div>
                </td>
                <td className="px-5 py-3.5 hidden lg:table-cell">
                  {e.location ? (
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">{e.location}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-text-muted">Online</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={statusVariant(e.status)} className="text-[10px]">
                    {e.status.toLowerCase()}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-text-muted text-xs hidden sm:table-cell">
                  {e._count.registrations}
                  {e.capacity ? ` / ${e.capacity}` : ''}
                </td>
                <td className="px-5 py-3.5">
                  <Link
                    href={`/admin/events/${e.id}`}
                    className="flex items-center justify-end gap-1 text-xs text-brand-gold hover:underline"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {events.length === 0 && (
          <div className="py-16 text-center text-text-muted">
            No events yet.{' '}
            <Link href="/admin/events/new" className="text-brand-gold hover:underline">
              Create your first event.
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
