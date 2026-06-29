'use client'

import { useState } from 'react'
import Script from 'next/script'
import { UploadCloud } from 'lucide-react'
import { toast } from 'sonner'

export function VideoUploadButton({ onUploaded }: { onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)

  async function handleClick() {
    setUploading(true)
    try {
      const res = await fetch('/api/admin/sermons/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind: 'video' }),
      })
      if (!res.ok) throw new Error()
      const signed = await res.json()

      if (!window.cloudinary) throw new Error('Upload widget not loaded yet')

      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: signed.cloudName,
          apiKey: signed.apiKey,
          uploadSignature: signed.signature,
          uploadSignatureTimestamp: signed.timestamp,
          folder: signed.folder,
          uploadPreset: signed.uploadPreset,
          resourceType: 'video',
          sources: ['local'],
          maxFiles: 1,
          styles: {
            palette: {
              window: '#1C1422',
              windowBorder: '#C9A84C',
              tabIcon: '#C9A84C',
              menuIcons: '#E8C97A',
              textDark: '#100B16',
              textLight: '#FFFFFF',
              link: '#C9A84C',
              action: '#C9A84C',
              inactiveTabIcon: '#8A93A6',
              error: '#E85D75',
              inProgress: '#C9A84C',
              complete: '#56B87D',
              sourceBg: '#100B16',
            },
          },
        },
        (_error, result) => {
          if (result?.event === 'success' && result.info) {
            onUploaded(result.info.secure_url)
            toast.success('Video uploaded.')
          }
        }
      )

      widget.open()
    } catch {
      toast.error('Could not start video upload.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="lazyOnload" />
      <button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        className="btn-outline-gold text-sm flex items-center gap-2 disabled:opacity-60"
      >
        <UploadCloud className="h-4 w-4" />
        {uploading ? 'Opening...' : 'Upload Video File'}
      </button>
    </>
  )
}
