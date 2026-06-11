import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { Plus, Edit2, Play } from 'lucide-react'
import { format } from 'date-fns'

export const metadata: Metadata = { title: 'Sermons | Admin' }

export default async function AdminSermonsPage() {
  const sermons = await prisma.sermon.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      speaker: { select: { name: true } },
      series: { select: { title: true } },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-white">Sermons</h1>
          <p className="text-sm text-text-muted mt-0.5">{sermons.length} sermons</p>
        </div>
        <Link href="/admin/sermons/new" className="btn-gold text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Sermon
        </Link>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Title</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden md:table-cell">Speaker</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden lg:table-cell">Series</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Status</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden md:table-cell">Published</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Views</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sermons.map((s) => (
              <tr key={s.id} className="hover:bg-white/3 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    {s.videoUrl && <Play className="h-3.5 w-3.5 text-brand-gold flex-shrink-0" />}
                    <span className="text-white font-medium line-clamp-1 max-w-xs">{s.title}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-text-muted hidden md:table-cell">
                  {s.speaker?.name ?? '-'}
                </td>
                <td className="px-5 py-3.5 text-text-muted hidden lg:table-cell">
                  {s.series?.title ?? '-'}
                </td>
                <td className="px-5 py-3.5">
                  <Badge
                    variant={
                      s.status === 'PUBLISHED'
                        ? 'success'
                        : s.status === 'DRAFT'
                        ? 'muted'
                        : 'gold'
                    }
                    className="text-[10px]"
                  >
                    {s.status.toLowerCase()}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-text-muted text-xs hidden md:table-cell">
                  {s.publishedAt ? format(new Date(s.publishedAt), 'MMM d, yyyy') : '-'}
                </td>
                <td className="px-5 py-3.5 text-text-muted">{s.viewCount.toLocaleString()}</td>
                <td className="px-5 py-3.5">
                  <Link
                    href={`/admin/sermons/${s.id}`}
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

        {sermons.length === 0 && (
          <div className="py-16 text-center text-text-muted">
            No sermons yet.{' '}
            <Link href="/admin/sermons/new" className="text-brand-gold hover:underline">
              Create your first sermon.
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
