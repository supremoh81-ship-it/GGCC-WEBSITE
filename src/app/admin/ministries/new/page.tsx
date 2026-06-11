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
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  tagline: z.string().max(200).optional(),
  description: z.string().max(5000).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).default('#C9A84C'),
  meetingSchedule: z.string().max(200).optional(),
  location: z.string().max(300).optional(),
  email: z.string().email().optional().or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

export default function NewMinistryPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { color: '#C9A84C' },
    })

  const name = watch('name')

  function generateSlug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function onSubmit(data: FormValues) {
    setError('')
    const res = await fetch('/api/admin/ministries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      setError(json.error ?? 'Failed to create ministry')
      return
    }

    router.push('/admin/ministries')
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/ministries" className="text-text-muted hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-display font-bold text-white">New Ministry</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-2xl p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Ministry Name"
            {...register('name', {
              onChange: (e) => setValue('slug', generateSlug(e.target.value)),
            })}
            error={errors.name?.message}
            placeholder="Worship Ministry"
          />
          <Input
            label="Slug"
            {...register('slug')}
            error={errors.slug?.message}
            placeholder="worship-ministry"
          />
        </div>

        <Input
          label="Tagline (optional)"
          {...register('tagline')}
          error={errors.tagline?.message}
          placeholder="Lifting hearts in praise"
        />

        <Textarea
          label="Description (optional)"
          {...register('description')}
          error={errors.description?.message}
          placeholder="Describe the ministry's vision and activities..."
          rows={4}
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Meeting Schedule (optional)"
            {...register('meetingSchedule')}
            error={errors.meetingSchedule?.message}
            placeholder="Sundays after service"
          />
          <Input
            label="Location (optional)"
            {...register('location')}
            error={errors.location?.message}
            placeholder="Room 201"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Contact Email (optional)"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="ministry@ggcc.church"
          />
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Brand Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                {...register('color')}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <Input
                {...register('color')}
                error={errors.color?.message}
                placeholder="#C9A84C"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="gold" loading={isSubmitting}>
            Create Ministry
          </Button>
          <Link href="/admin/ministries">
            <Button type="button" variant="ghost">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
