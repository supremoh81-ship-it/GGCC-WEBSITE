import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Image, Film, Music, FileText, Upload } from 'lucide-react'
import { format } from 'date-fns'

export const metadata: Metadata = { title: 'Media Library | Admin' }

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const typeIcon = (type: string) => {
  if (type === 'IMAGE') return Image
  if (type === 'VIDEO') return Film
  if (type === 'AUDIO') return Music
  return FileText
}

export default async function AdminMediaPage() {
  const [media, aggregate] = await Promise.all([
    prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      take: 48,
    }),
    prisma.media.aggregate({
      _count: true,
      _sum: { bytes: true },
    }),
  ])

  const totalSize = formatBytes(Number(aggregate._sum.bytes ?? 0))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-white">Media Library</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {aggregate._count} files, {totalSize} total
          </p>
        </div>
        <button className="btn-gold text-sm flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {media.map((file) => {
          const Icon = typeIcon(file.type)
          return (
            <div
              key={file.id}
              className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:border-white/20 transition-all"
            >
              <div className="aspect-square bg-white/5 flex items-center justify-center relative">
                {file.type === 'IMAGE' && file.url ? (
                  <img
                    src={file.url}
                    alt={file.alt ?? file.publicId.split('/').pop() ?? file.publicId}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <Icon className="h-8 w-8 text-text-muted" />
                )}
              </div>
              <div className="p-2">
                <div className="text-[10px] text-white line-clamp-1 font-medium">{file.alt ?? file.publicId.split('/').pop() ?? file.publicId}</div>
                <div className="text-[10px] text-text-muted mt-0.5 flex items-center justify-between">
                  <span>{file.bytes ? formatBytes(file.bytes) : '-'}</span>
                  <span>{format(new Date(file.createdAt), 'MMM d')}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {media.length === 0 && (
        <div className="text-center py-24 glass-card rounded-2xl">
          <Image className="h-12 w-12 text-text-muted mx-auto mb-3 opacity-30" />
          <p className="text-text-muted mb-4">No media files yet.</p>
          <button className="btn-gold text-sm">Upload your first file</button>
        </div>
      )}
    </div>
  )
}
