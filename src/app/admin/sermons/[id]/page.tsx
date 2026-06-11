'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { sermonSchema, type SermonInput } from '@/lib/validations'
import { toast } from 'sonner'

export default function AdminEditSermonPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SermonInput>({
    resolver: zodResolver(sermonSchema),
  })

  useEffect(() => {
    fetch(`/api/sermons/${params.id}`)
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          reset({
            title: data.title,
            slug: data.slug,
            description: data.description ?? '',
            type: data.type,
            status: data.status,
            videoUrl: data.videoUrl ?? '',
            audioUrl: data.audioUrl ?? '',
            duration: data.duration ?? undefined,
            thumbnailUrl: data.thumbnailUrl ?? '',
            isFeatured: data.isFeatured,
          })
        }
      })
      .finally(() => setLoading(false))
  }, [params.id, reset])

  async function onSubmit(data: SermonInput) {
    setSaving(true)
    try {
      const res = await fetch(`/api/sermons/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success('Sermon updated!')
    } catch {
      toast.error('Failed to update sermon.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this sermon? This action cannot be undone.')) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/sermons/${params.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Sermon deleted.')
      router.push('/admin/sermons')
    } catch {
      toast.error('Failed to delete sermon.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 max-w-2xl animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-12 bg-white/5 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <FadeInUp className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/sermons" className="text-text-muted hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-display font-bold text-white">Edit Sermon</h1>
        </div>
        <Button
          variant="ghost"
          onClick={handleDelete}
          loading={deleting}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm flex items-center gap-1.5"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </FadeInUp>

      <FadeInUp>
        <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-2xl p-7 space-y-5">
          <Input
            label="Title"
            {...register('title')}
            error={errors.title?.message}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Slug"
              {...register('slug')}
              error={errors.slug?.message}
            />
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Type</label>
              <select
                {...register('type')}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
              >
                <option value="VIDEO" className="bg-brand-navy">Video</option>
                <option value="AUDIO" className="bg-brand-navy">Audio</option>
                <option value="NOTES_ONLY" className="bg-brand-navy">Notes Only</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            rows={3}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Video URL"
              type="url"
              {...register('videoUrl')}
              error={errors.videoUrl?.message}
            />
            <Input
              label="Audio URL"
              type="url"
              {...register('audioUrl')}
              error={errors.audioUrl?.message}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Duration (seconds)"
              type="number"
              {...register('duration', { valueAsNumber: true })}
              error={errors.duration?.message}
            />
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Status</label>
              <select
                {...register('status')}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
              >
                <option value="DRAFT" className="bg-brand-navy">Draft</option>
                <option value="PUBLISHED" className="bg-brand-navy">Published</option>
                <option value="ARCHIVED" className="bg-brand-navy">Archived</option>
              </select>
            </div>
          </div>

          <Input
            label="Thumbnail URL"
            type="url"
            {...register('thumbnailUrl')}
            error={errors.thumbnailUrl?.message}
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isFeatured"
              {...register('isFeatured')}
              className="w-4 h-4 rounded bg-white/10 border border-white/20 checked:bg-brand-gold"
            />
            <label htmlFor="isFeatured" className="text-sm text-white">
              Feature this sermon on the homepage
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-white/8">
            <Button type="submit" variant="gold" loading={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Link href="/admin/sermons" className="btn-ghost text-sm">
              Cancel
            </Link>
          </div>
        </form>
      </FadeInUp>
    </div>
  )
}
