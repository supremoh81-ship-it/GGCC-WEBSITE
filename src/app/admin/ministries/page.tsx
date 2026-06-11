import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { Plus, Users, Edit2 } from 'lucide-react'

export const metadata: Metadata = { title: 'Ministries | Admin' }

export default async function AdminMinistriesPage() {
  const ministries = await prisma.ministry.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      _count: { select: { members: true } },
      leaders: { take: 1 },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-white">Ministries</h1>
          <p className="text-sm text-text-muted mt-0.5">{ministries.length} ministries</p>
        </div>
        <Link href="/admin/ministries/new" className="btn-gold text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Ministry
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ministries.map((m) => (
          <div
            key={m.id}
            className="glass-card rounded-2xl p-5"
            style={{ borderColor: `${m.color}30` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${m.color}18`, border: `1px solid ${m.color}30` }}
              >
                <Users className="h-5 w-5" style={{ color: m.color ?? '#C9A84C' }} />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={m.isActive ? 'success' : 'muted'} className="text-[10px]">
                  {m.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Link
                  href={`/admin/ministries/${m.id}`}
                  className="text-text-muted hover:text-white transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <h3 className="text-white font-semibold">{m.name}</h3>
            {m.tagline && (
              <p className="text-sm text-text-muted mt-0.5 line-clamp-2">{m.tagline}</p>
            )}

            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/8">
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Users className="h-3.5 w-3.5" />
                {m._count.members} member{m._count.members !== 1 ? 's' : ''}
              </div>
              {m.leaders[0] && (
                <div className="text-xs text-text-muted">
                  Lead: {m.leaders[0].name}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {ministries.length === 0 && (
        <div className="text-center py-16 glass-card rounded-2xl">
          <Users className="h-12 w-12 text-text-muted mx-auto mb-3 opacity-30" />
          <p className="text-text-muted mb-4">No ministries yet.</p>
          <Link href="/admin/ministries/new" className="btn-gold text-sm">
            Create First Ministry
          </Link>
        </div>
      )}
    </div>
  )
}
