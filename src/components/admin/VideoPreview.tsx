'use client'

import { parseVideoUrl } from '@/lib/utils/video-embed'
import { PlayCircle, ExternalLink } from 'lucide-react'

export function VideoPreview({ url }: { url?: string | null }) {
  if (!url?.trim()) return null

  let parsed: ReturnType<typeof parseVideoUrl> | null = null
  try {
    parsed = parseVideoUrl(url.trim())
  } catch {
    return null
  }

  const { platform, embedUrl } = parsed

  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-brand-gold/20 bg-black/40">
      <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border-b border-white/8">
        <PlayCircle className="h-3.5 w-3.5 text-brand-gold" />
        <span className="text-[11px] text-text-muted capitalize">{platform} preview</span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-[11px] text-brand-gold/70 hover:text-brand-gold flex items-center gap-1 transition-colors"
        >
          Open <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="relative aspect-video">
        {platform === 'direct' ? (
          <video src={embedUrl} controls className="w-full h-full" />
        ) : (
          <iframe
            src={embedUrl}
            title="Video preview"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
            className="w-full h-full border-0"
          />
        )}
      </div>
    </div>
  )
}
