'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'

const schema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional(),
  audioUrl: z.string().url().optional().or(z.literal('')),
  duration: z.number().int().positive().optional(),
  episodeNo: z.number().int().positive().optional(),
  seasonNo: z.number().int().positive().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  publishedAt: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function EditEpisodePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showTitle, setShowTitle] = useState('')

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    fetch(`/api/podcasts/episodes/${params.id}`)
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          reset({
            title: data.title,
            slug: data.slug,
            description: data.description ?? '',
            audioUrl: data.audioUrl ?? '',
            duration: data.duration ?? undefined,
            episodeNo: data.episodeNo ?? undefined,
            seasonNo: data.seasonNo ?? undefined,
            status: data.status,
            publishedAt: data.publishedAt ? data.publishedAt.slice(0, 10) : '',
          })
          setShowTitle(data.show?.title ?? '')
        }
        setLoading(false)
      })
  }, [params.id, reset])

  async function onSubmit(data: FormValues) {
    setError('')
    const res = await fetch(`/api/podcasts/episodes/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, publishedAt: data.publishedAt ? new Date(data.publishedAt) : null }),
    })

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      setError(json.error ?? 'Failed to save')
      return
    }

    router.back()
    router.refresh()
  }

  if (loading) return <div className="animate-pulse text-text-muted p-8">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-text-muted hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-display font-bold text-white">Edit Episode</h1>
          {showTitle && <p className="text-sm text-text-muted">{showTitle}</p>}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-2xl p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Title" {...register('title')} error={errors.title?.message} />
          <Input label="Slug" {...register('slug')} error={errors.slug?.message} />
        </div>

        <Textarea label="Description" {...register('description')} error={errors.description?.message} rows={3} />

        <Input label="Audio URL" type="url" {...register('audioUrl')} error={errors.audioUrl?.message} placeholder="https://..." />

        <div className="grid grid-cols-3 gap-4">
          <Input label="Episode #" type="number" {...register('episodeNo', { valueAsNumber: true })} error={errors.episodeNo?.message} />
          <Input label="Season #" type="number" {...register('seasonNo', { valueAsNumber: true })} error={errors.seasonNo?.message} />
          <Input label="Duration (sec)" type="number" {...register('duration', { valueAsNumber: true })} error={errors.duration?.message} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
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
          <Input label="Publish Date" type="date" {...register('publishedAt')} error={errors.publishedAt?.message} />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="gold" loading={isSubmitting}>Save Changes</Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
