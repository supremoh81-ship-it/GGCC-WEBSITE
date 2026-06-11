import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { ArrowLeft, Plus, Edit2, Headphones } from 'lucide-react'
import { format } from 'date-fns'

export const metadata: Metadata = { title: 'Manage Show | Admin' }

export default async function AdminShowPage({ params }: { params: { id: string } }) {
  const show = await prisma.podcastShow.findUnique({
    where: { id: params.id },
    include: {
      episodes: {
        orderBy: { episodeNo: 'desc' },
        take: 50,
      },
      _count: { select: { episodes: true } },
    },
  })

  if (!show) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/podcasts" className="text-text-muted hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-display font-bold text-white">{show.title}</h1>
            <p className="text-sm text-text-muted">{show._count.episodes} episodes</p>
          </div>
        </div>
        <Link href={`/admin/podcasts/episodes/new?showId=${show.id}`} className="btn-gold text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Episode
        </Link>
      </div>

      {/* Show info */}
      <div className="glass-card rounded-2xl p-5 flex items-start gap-5">
        {show.artworkUrl ? (
          <img src={show.artworkUrl} alt={show.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0">
            <Headphones className="h-8 w-8 text-brand-gold" />
          </div>
        )}
        <div className="min-w-0">
          {show.description && <p className="text-text-muted text-sm line-clamp-2 mb-3">{show.description}</p>}
          <div className="flex flex-wrap gap-2">
            {show.spotifyUrl && (
              <a href={show.spotifyUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-gold hover:underline">Spotify</a>
            )}
            {show.applePodcastUrl && (
              <a href={show.applePodcastUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-gold hover:underline">Apple Podcasts</a>
            )}
            {show.rssFeedUrl && (
              <a href={show.rssFeedUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-gold hover:underline">RSS Feed</a>
            )}
          </div>
        </div>
      </div>

      {/* Episodes */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Episode</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden sm:table-cell">Published</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Status</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {show.episodes.map((ep) => (
              <tr key={ep.id} className="hover:bg-white/3 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="text-white font-medium line-clamp-1">{ep.title}</div>
                  {ep.episodeNo && (
                    <div className="text-xs text-text-muted mt-0.5">Episode {ep.episodeNo}</div>
                  )}
                </td>
                <td className="px-5 py-3.5 text-text-muted text-xs hidden sm:table-cell">
                  {ep.publishedAt ? format(new Date(ep.publishedAt), 'MMM d, yyyy') : 'Not set'}
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={ep.status === 'PUBLISHED' ? 'success' : 'muted'} className="text-[10px]">
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

        {show.episodes.length === 0 && (
          <div className="py-16 text-center">
            <Headphones className="h-10 w-10 text-text-muted mx-auto mb-3 opacity-30" />
            <p className="text-text-muted text-sm mb-4">No episodes yet.</p>
            <Link href={`/admin/podcasts/episodes/new?showId=${show.id}`} className="btn-gold text-sm">
              Add First Episode
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
