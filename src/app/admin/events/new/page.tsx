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
import { eventSchema, type EventInput } from '@/lib/validations'
import { toast } from 'sonner'

export default function AdminNewEventPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      status: 'DRAFT',
      type: 'IN_PERSON',
      requiresTicket: false,
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

  async function onSubmit(data: EventInput) {
    setSaving(true)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      const { data: event } = await res.json()
      toast.success('Event created!')
      router.push(`/admin/events/${event.id}`)
    } catch {
      toast.error('Failed to create event.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <FadeInUp className="flex items-center gap-3">
        <Link href="/admin/events" className="text-text-muted hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-display font-bold text-white">New Event</h1>
      </FadeInUp>

      <FadeInUp>
        <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-2xl p-7 space-y-5">
          <Input
            label="Title"
            {...register('title')}
            error={errors.title?.message}
            onBlur={autoSlug}
            placeholder="Encounter Night 2025"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Slug"
              {...register('slug')}
              error={errors.slug?.message}
              placeholder="encounter-night-2025"
            />
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Type</label>
              <select
                {...register('type')}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
              >
                <option value="IN_PERSON" className="bg-brand-navy">In Person</option>
                <option value="ONLINE" className="bg-brand-navy">Online</option>
                <option value="HYBRID" className="bg-brand-navy">Hybrid</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            placeholder="Describe the event..."
            rows={4}
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Start Date and Time"
              type="datetime-local"
              {...register('startDate')}
              error={errors.startDate?.message}
            />
            <Input
              label="End Date and Time (optional)"
              type="datetime-local"
              {...register('endDate')}
              error={errors.endDate?.message}
            />
          </div>

          <Input
            label="Location"
            {...register('location')}
            error={errors.location?.message}
            placeholder="1 Grace Boulevard, Houston, TX"
          />

          <Input
            label="Virtual Link (optional)"
            type="url"
            {...register('onlineUrl')}
            error={errors.onlineUrl?.message}
            placeholder="https://zoom.us/..."
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Capacity (optional)"
              type="number"
              {...register('capacity', { valueAsNumber: true })}
              error={errors.capacity?.message}
              placeholder="500"
            />
            <div>
              <label className="block text-sm font-medium text-white mb-1.5">Status</label>
              <select
                {...register('status')}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
              >
                <option value="DRAFT" className="bg-brand-navy">Draft</option>
                <option value="PUBLISHED" className="bg-brand-navy">Published</option>
                <option value="CANCELLED" className="bg-brand-navy">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="requiresTicket"
              {...register('requiresTicket')}
              className="w-4 h-4 rounded bg-white/10 border border-white/20"
            />
            <label htmlFor="requiresTicket" className="text-sm text-white">
              Requires ticket / registration
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-white/8">
            <Button type="submit" variant="gold" loading={saving}>
              {saving ? 'Creating...' : 'Create Event'}
            </Button>
            <Link href="/admin/events" className="btn-ghost text-sm">
              Cancel
            </Link>
          </div>
        </form>
      </FadeInUp>
    </div>
  )
}
