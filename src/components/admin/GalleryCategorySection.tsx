'use client'

import { useRef, useState } from 'react'
import { format } from 'date-fns'
import { Upload, Trash2, ImageOff, Loader2 } from 'lucide-react'
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
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<Record<string, number>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File): Promise<void> {
    const id = `${file.name}-${Date.now()}`
    setProgress((p) => ({ ...p, [id]: 0 }))

    // 1. Get signed params from our server
    const signRes = await fetch('/api/admin/gallery/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: slug }),
    })

    if (!signRes.ok) throw new Error('Could not get upload credentials.')
    const signed = await signRes.json()

    if (!signed.cloudName || !signed.apiKey) {
      throw new Error('Cloudinary is not configured. Add env vars in Vercel.')
    }

    // 2. Upload directly to Cloudinary via XHR so we can track progress
    const formData = new FormData()
    formData.append('file', file)
    formData.append('timestamp', String(signed.timestamp))
    formData.append('signature', signed.signature)
    formData.append('api_key', signed.apiKey)
    formData.append('folder', signed.folder)
    if (signed.uploadPreset) formData.append('upload_preset', signed.uploadPreset)

    const url = `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`

    const secureUrl = await new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', url)
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress((p) => ({ ...p, [id]: Math.round((e.loaded / e.total) * 100) }))
        }
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText)
          resolve(data.secure_url)
        } else {
          reject(new Error(`Upload failed (${xhr.status})`))
        }
      }
      xhr.onerror = () => reject(new Error('Network error during upload'))
      xhr.send(formData)
    })

    setProgress((p) => ({ ...p, [id]: 100 }))

    // 3. Save to our database
    const publicId = secureUrl.split('/upload/')[1]?.replace(/\.[^.]+$/, '') ?? ''
    const createRes = await fetch('/api/admin/gallery/photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: slug,
        publicId: `${signed.cloudName}/${publicId}`,
        url: secureUrl,
        thumbnailUrl: cldThumb(secureUrl),
      }),
    })

    if (!createRes.ok) throw new Error('Uploaded but failed to save. Refresh and check.')

    const { data } = await createRes.json()
    setPhotos((prev) => [data, ...prev])
    setProgress((p) => { const n = { ...p }; delete n[id]; return n })
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)

    const results = await Promise.allSettled(Array.from(files).map(uploadFile))
    const failed = results.filter((r) => r.status === 'rejected')

    if (failed.length > 0) {
      const msg = (failed[0] as PromiseRejectedResult).reason?.message ?? 'Upload failed'
      toast.error(msg)
    }
    if (results.some((r) => r.status === 'fulfilled')) {
      toast.success(`${results.filter((r) => r.status === 'fulfilled').length} photo(s) uploaded.`)
    }

    setUploading(false)
    setProgress({})
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this photo? This cannot be undone.')) return
    const res = await fetch(`/api/admin/gallery/photos/${id}`, { method: 'DELETE' })
    if (!res.ok) { toast.error('Failed to delete photo.'); return }
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  const uploadCount = Object.keys(progress).length

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="font-display font-bold text-white text-lg">{title}</h2>
          <p className="text-sm text-text-muted mt-0.5">{description}</p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-gold text-sm flex items-center gap-2 shrink-0 disabled:opacity-60"
        >
          {uploading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading {uploadCount}…</>
            : <><Upload className="h-4 w-4" /> Upload Photos</>
          }
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Progress bars */}
      {uploadCount > 0 && (
        <div className="mb-4 space-y-2">
          {Object.entries(progress).map(([id, pct]) => (
            <div key={id} className="space-y-1">
              <div className="flex justify-between text-xs text-text-muted">
                <span>Uploading…</span>
                <span>{pct}%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-gold rounded-full transition-all duration-200"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

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
