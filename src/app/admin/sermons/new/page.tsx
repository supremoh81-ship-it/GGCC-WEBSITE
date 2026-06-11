'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { sermonSchema, type SermonInput } from '@/lib/validations'
import { toast } from 'sonner'

export default function AdminNewSermonPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SermonInput>({
    resolver: zodResolver(sermonSchema),
    defaultValues: {
      status: 'DRAFT',
      type: 'VIDEO',
      isFeatured: false,
    },
  })

  const title = watch('title')

  function autoSlug() {
    if (title) {
      setValue(
        'slug',
        title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
      )
    }
  }

  async function onSubmit(data: SermonInput) {
    setSaving(true)
    try {
      const res = await fetch('/api/sermons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      const { data: sermon } = await res.json()
      toast.success('Sermon created!')
      router.push(`/admin/sermons/${sermon.id}`)
    } catch {
      toast.error('Failed to create sermon.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <FadeInUp className="flex items-center gap-3">
        <Link href="/admin/sermons" className="text-text-muted hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-display font-bold text-white">New Sermon</h1>
      </FadeInUp>

      <FadeInUp>
        <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-2xl p-7 space-y-5">
          <Input
            label="Title"
            {...register('title')}
            error={errors.title?.message}
            onBlur={autoSlug}
            placeholder="The Weight of Grace"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Slug"
              {...register('slug')}
              error={errors.slug?.message}
              placeholder="the-weight-of-grace"
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
            placeholder="A short description of the sermon..."
            rows={3}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Video URL"
              type="url"
              {...register('videoUrl')}
              error={errors.videoUrl?.message}
              placeholder="https://..."
            />
            <Input
              label="Audio URL"
              type="url"
              {...register('audioUrl')}
              error={errors.audioUrl?.message}
              placeholder="https://..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Duration (seconds)"
              type="number"
              {...register('duration', { valueAsNumber: true })}
              error={errors.duration?.message}
              placeholder="3600"
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
            placeholder="https://..."
          />

          <div className="flex items-center gap-3 pt-2 border-t border-white/8">
            <Button type="submit" variant="gold" loading={saving}>
              {saving ? 'Creating...' : 'Create Sermon'}
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
