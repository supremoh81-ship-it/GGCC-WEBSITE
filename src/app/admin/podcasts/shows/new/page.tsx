'use client'

import { useState } from 'react'
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
  artworkUrl: z.string().url().optional().or(z.literal('')),
  rssFeedUrl: z.string().url().optional().or(z.literal('')),
  spotifyUrl: z.string().url().optional().or(z.literal('')),
  applePodcastUrl: z.string().url().optional().or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

export default function NewPodcastShowPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  function generateSlug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function onSubmit(data: FormValues) {
    setError('')
    const res = await fetch('/api/podcasts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      setError(json.error ?? 'Failed to create show')
      return
    }

    router.push('/admin/podcasts')
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/podcasts" className="text-text-muted hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-display font-bold text-white">New Podcast Show</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-2xl p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Show Title"
            {...register('title', {
              onChange: (e) => setValue('slug', generateSlug(e.target.value)),
            })}
            error={errors.title?.message}
            placeholder="The GGCC Podcast"
          />
          <Input
            label="Slug"
            {...register('slug')}
            error={errors.slug?.message}
            placeholder="ggcc-podcast"
          />
        </div>

        <Textarea
          label="Description (optional)"
          {...register('description')}
          error={errors.description?.message}
          placeholder="What is this show about?"
          rows={3}
        />

        <Input
          label="Artwork URL (optional)"
          type="url"
          {...register('artworkUrl')}
          error={errors.artworkUrl?.message}
          placeholder="https://..."
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="RSS Feed URL (optional)"
            type="url"
            {...register('rssFeedUrl')}
            error={errors.rssFeedUrl?.message}
            placeholder="https://feeds...."
          />
          <Input
            label="Spotify URL (optional)"
            type="url"
            {...register('spotifyUrl')}
            error={errors.spotifyUrl?.message}
            placeholder="https://open.spotify.com/..."
          />
        </div>

        <Input
          label="Apple Podcasts URL (optional)"
          type="url"
          {...register('applePodcastUrl')}
          error={errors.applePodcastUrl?.message}
          placeholder="https://podcasts.apple.com/..."
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="gold" loading={isSubmitting}>Create Show</Button>
          <Link href="/admin/podcasts">
            <Button type="button" variant="ghost">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
