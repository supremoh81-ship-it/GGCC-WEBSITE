'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import type { Ministry, MinistryLeader } from '@prisma/client'

const schema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  tagline: z.string().max(200).optional(),
  description: z.string().max(5000).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  meetingSchedule: z.string().max(200).optional(),
  location: z.string().max(300).optional(),
  email: z.string().email().optional().or(z.literal('')),
  isActive: z.boolean(),
})

type FormValues = z.infer<typeof schema>

interface Props {
  ministry: Ministry & { leaders: MinistryLeader[] }
}

export function AdminMinistryEditor({ ministry }: Props) {
  const router = useRouter()
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        name: ministry.name,
        slug: ministry.slug,
        tagline: ministry.tagline ?? '',
        description: ministry.description ?? '',
        color: ministry.color ?? '#C9A84C',
        meetingSchedule: ministry.meetingSchedule ?? '',
        location: ministry.location ?? '',
        email: ministry.email ?? '',
        isActive: ministry.isActive,
      },
    })

  async function onSubmit(data: FormValues) {
    setError('')
    const res = await fetch(`/api/admin/ministries/${ministry.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const json = await res.json().catch(() => ({}))
      setError(json.error ?? 'Failed to save')
      return
    }

    router.push('/admin/ministries')
    router.refresh()
  }

  async function handleDelete() {
    if (!confirm(`Delete "${ministry.name}"? This cannot be undone.`)) return
    setDeleting(true)
    await fetch(`/api/admin/ministries/${ministry.id}`, { method: 'DELETE' })
    router.push('/admin/ministries')
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/ministries" className="text-text-muted hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-display font-bold text-white">Edit Ministry</h1>
        </div>
        <Button variant="danger" size="sm" onClick={handleDelete} loading={deleting}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-2xl p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Ministry Name" {...register('name')} error={errors.name?.message} />
          <Input label="Slug" {...register('slug')} error={errors.slug?.message} />
        </div>

        <Input label="Tagline" {...register('tagline')} error={errors.tagline?.message} />
        <Textarea label="Description" {...register('description')} error={errors.description?.message} rows={4} />

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Meeting Schedule" {...register('meetingSchedule')} error={errors.meetingSchedule?.message} />
          <Input label="Location" {...register('location')} error={errors.location?.message} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Contact Email" type="email" {...register('email')} error={errors.email?.message} />
          <div>
            <label className="block text-sm font-medium text-white mb-1.5">Brand Color</label>
            <div className="flex items-center gap-3">
              <input type="color" {...register('color')} className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0" />
              <Input {...register('color')} error={errors.color?.message} className="flex-1" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="isActive" {...register('isActive')} className="w-4 h-4 accent-brand-gold" />
          <label htmlFor="isActive" className="text-sm text-white">Active (visible on website)</label>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="gold" loading={isSubmitting}>Save Changes</Button>
          <Link href="/admin/ministries">
            <Button type="button" variant="ghost">Cancel</Button>
          </Link>
        </div>
      </form>

      {/* Leaders */}
      {ministry.leaders.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-sm font-medium text-text-muted uppercase tracking-widest mb-4">Ministry Leaders</h2>
          <div className="space-y-3">
            {ministry.leaders.map((leader) => (
              <div key={leader.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <div className="text-white font-medium text-sm">{leader.name}</div>
                  <div className="text-xs text-text-muted">{leader.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
