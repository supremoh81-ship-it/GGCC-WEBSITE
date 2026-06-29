import { parseVideoUrl } from '@/lib/utils/video-embed'

export function VideoEmbed({
  url,
  title,
  className,
}: {
  url: string
  title: string
  className?: string
}) {
  const { platform, embedUrl } = parseVideoUrl(url)

  if (platform === 'direct') {
    // eslint-disable-next-line jsx-a11y/media-has-caption
    return (
      <video
        src={embedUrl}
        controls
        preload="metadata"
        className={className}
      />
    )
  }

  return (
    <iframe
      src={embedUrl}
      title={title}
      className={className}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      frameBorder="0"
    />
  )
}
