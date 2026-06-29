'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Upload, Trash2, ImageOff } from 'lucide-react'
import { toast } from 'sonner'

interface Photo {
  id: string
  url: string
  thumbnailUrl: string | null
  caption: string | null
  createdAt: string
}

function cldThumb(url: string) {
  return url.replace('/upload/', '/upload/w_400,h_400,c_fill,q_auto,f_auto/')
}

export function GalleryCategorySection({
  slug,
  title,
  description,
  initialPhotos,
}: {
  slug: string
  title: string
  description: string
  initialPhotos: Photo[]
}) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [opening, setOpening] = useState(false)

  async function handleUpload() {
    setOpening(true)
    try {
      const res = await fetch('/api/admin/gallery/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: slug }),
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
          sources: ['local', 'camera'],
          multiple: true,
          maxFiles: 25,
          resourceType: 'image',
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'heic'],
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
        async (_error, result) => {
          if (result?.event !== 'success' || !result.info) return

          const { public_id, secure_url } = result.info
          const createRes = await fetch('/api/admin/gallery/photos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              category: slug,
              publicId: public_id,
              url: secure_url,
              thumbnailUrl: cldThumb(secure_url),
            }),
          })

          if (!createRes.ok) {
            toast.error('Image uploaded but failed to save. Refresh and try again.')
            return
          }

          const { data } = await createRes.json()
          setPhotos((prev) => [data, ...prev])
        }
      )

      widget.open()
    } catch {
      toast.error('Could not start upload. Please try again.')
    } finally {
      setOpening(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this photo? This cannot be undone.')) return

    const res = await fetch(`/api/admin/gallery/photos/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      toast.error('Failed to delete photo.')
      return
    }
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="font-display font-bold text-white text-lg">{title}</h2>
          <p className="text-sm text-text-muted mt-0.5">{description}</p>
        </div>
        <button
          onClick={handleUpload}
          disabled={opening}
          className="btn-gold text-sm flex items-center gap-2 shrink-0 disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          {opening ? 'Opening...' : 'Upload Photos'}
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
          <ImageOff className="h-8 w-8 text-text-muted mx-auto mb-2 opacity-40" />
          <p className="text-sm text-text-muted">No photos in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square rounded-xl overflow-hidden group bg-white/5"
            >
              <img
                src={photo.thumbnailUrl ?? photo.url}
                alt={photo.caption ?? title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="self-end w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white transition-colors"
                  aria-label="Delete photo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <span className="text-[10px] text-white/80">
                  {format(new Date(photo.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
