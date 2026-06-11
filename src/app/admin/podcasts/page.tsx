import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { Plus, Headphones, Edit2 } from 'lucide-react'
import { format } from 'date-fns'

export const metadata: Metadata = { title: 'Podcasts | Admin' }

export default async function AdminPodcastsPage() {
  const [shows, episodes] = await Promise.all([
    prisma.podcastShow.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { episodes: true } },
      },
    }),
    prisma.podcastEpisode.findMany({
      orderBy: { publishedAt: 'desc' },
      take: 20,
      include: {
        show: { select: { title: true, slug: true } },
      },
    }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-white">Podcasts</h1>
          <p className="text-sm text-text-muted mt-0.5">Shows and episodes</p>
        </div>
        <Link href="/admin/podcasts/new" className="btn-gold text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Episode
        </Link>
      </div>

      {/* Shows */}
      <div>
        <h2 className="text-sm font-medium text-text-muted uppercase tracking-widest mb-3">Shows</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shows.map((show) => (
            <div key={show.id} className="glass-card rounded-xl p-5">
              <div className="flex items-start gap-3">
                {show.artworkUrl ? (
                  <img
                    src={show.artworkUrl}
                    alt={show.title}
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0">
                    <Headphones className="h-6 w-6 text-brand-gold" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-white font-semibold text-sm line-clamp-1">{show.title}</div>
                  <div className="text-xs text-text-muted mt-0.5">
                    {show._count.episodes} episode{show._count.episodes !== 1 ? 's' : ''}
                  </div>
                  <Link
                    href={`/admin/podcasts/shows/${show.id}`}
                    className="text-xs text-brand-gold hover:underline mt-1 inline-block"
                  >
                    Manage show
                  </Link>
                </div>
              </div>
            </div>
          ))}
          <Link
            href="/admin/podcasts/shows/new"
            className="glass-card rounded-xl p-5 border-dashed flex items-center justify-center gap-2 text-sm text-text-muted hover:text-white hover:border-white/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            New Show
          </Link>
        </div>
      </div>

      {/* Episodes */}
      <div>
        <h2 className="text-sm font-medium text-text-muted uppercase tracking-widest mb-3">Recent Episodes</h2>
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Episode</th>
                <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden md:table-cell">Show</th>
                <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden lg:table-cell">Published</th>
                <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {episodes.map((ep) => (
                <tr key={ep.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                        <Headphones className="h-3.5 w-3.5 text-brand-gold" />
                      </div>
                      <span className="text-white font-medium line-clamp-1 max-w-xs">{ep.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-text-muted hidden md:table-cell">
                    {ep.show.title}
                  </td>
                  <td className="px-5 py-3.5 text-text-muted text-xs hidden lg:table-cell">
                    {ep.publishedAt ? format(new Date(ep.publishedAt), 'MMM d, yyyy') : '-'}
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge
                      variant={ep.status === 'PUBLISHED' ? 'success' : 'muted'}
                      className="text-[10px]"
                    >
                      {ep.status === 'PUBLISHED' ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/admin/podcasts/episodes/${ep.id}`}
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
          {episodes.length === 0 && (
            <div className="py-16 text-center text-text-muted">
              No episodes yet.{' '}
              <Link href="/admin/podcasts/new" className="text-brand-gold hover:underline">
                Create your first episode.
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
