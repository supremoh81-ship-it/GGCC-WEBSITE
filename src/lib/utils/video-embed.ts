export type VideoPlatform = 'youtube' | 'facebook' | 'tiktok' | 'instagram' | 'direct'

export interface ParsedVideo {
  platform: VideoPlatform
  embedUrl: string
}

export function parseVideoUrl(url: string): ParsedVideo {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const id = u.searchParams.get('v') ?? u.pathname.split('/').filter(Boolean).pop()
      if (id) return { platform: 'youtube', embedUrl: `https://www.youtube.com/embed/${id}` }
    }
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1)
      if (id) return { platform: 'youtube', embedUrl: `https://www.youtube.com/embed/${id}` }
    }

    if (host === 'facebook.com' || host === 'fb.watch') {
      return {
        platform: 'facebook',
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`,
      }
    }

    if (host === 'tiktok.com') {
      const match = u.pathname.match(/\/video\/(\d+)/)
      if (match) return { platform: 'tiktok', embedUrl: `https://www.tiktok.com/embed/v2/${match[1]}` }
    }

    if (host === 'instagram.com') {
      const match = u.pathname.match(/\/(p|reel|tv)\/([^/]+)/)
      if (match) return { platform: 'instagram', embedUrl: `https://www.instagram.com/${match[1]}/${match[2]}/embed` }
    }
  } catch {
    // Not a valid absolute URL — fall through and treat as a direct file reference.
  }

  return { platform: 'direct', embedUrl: url }
}
