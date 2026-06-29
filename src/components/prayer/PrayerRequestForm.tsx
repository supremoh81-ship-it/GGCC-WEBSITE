'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Heart, Lock, Globe, Eye } from 'lucide-react'
import { toast } from 'sonner'

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  title: z.string().min(5, 'Please provide a brief title').max(100),
  body: z.string().min(20, 'Please describe your prayer request (min 20 characters)').max(2000),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'ANONYMOUS']),
  isUrgent: z.boolean().default(false),
})

type FormValues = z.infer<typeof schema>

const visibilityOptions = [
  {
    value: 'PUBLIC' as const,
    label: 'Public',
    desc: 'Shared on prayer wall',
    icon: Globe,
    activeClasses: 'border-brand-gold/60 bg-brand-gold/10 text-white',
    iconActive: 'text-brand-gold',
  },
  {
    value: 'ANONYMOUS' as const,
    label: 'Anonymous',
    desc: 'Posted without your name',
    icon: Eye,
    activeClasses: 'border-brand-teal/60 bg-brand-teal/10 text-white',
    iconActive: 'text-brand-teal',
  },
  {
    value: 'PRIVATE' as const,
    label: 'Private',
    desc: 'Only seen by our team',
    icon: Lock,
    activeClasses: 'border-brand-magenta/60 bg-brand-magenta/10 text-white',
    iconActive: 'text-brand-magenta',
  },
]

export function PrayerRequestForm() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { visibility: 'PUBLIC', isUrgent: false },
  })

  const visibility = watch('visibility')

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch('/api/prayers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to submit')
      setSubmitted(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-gold/15 flex items-center justify-center mx-auto mb-5">
          <Heart className="h-8 w-8 text-brand-gold fill-brand-gold/30" />
        </div>
        <h3 className="font-display font-bold text-white text-2xl mb-3">Your Prayer is Received</h3>
        <p className="text-text-muted max-w-sm mx-auto">
          Our prayer team has your request. We are already standing with you in faith.
          You will receive a confirmation email shortly.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-3xl p-8 space-y-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-regal" />
      {/* Visibility selector */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-3">
          How should we share this?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {visibilityOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setValue('visibility', opt.value)}
              className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                visibility === opt.value
                  ? opt.activeClasses
                  : 'border-white/10 text-text-muted hover:border-white/25 hover:text-white'
              }`}
            >
              <opt.icon className={`h-4 w-4 mx-auto mb-1 ${visibility === opt.value ? opt.iconActive : ''}`} />
              <div className="text-xs font-medium">{opt.label}</div>
              <div className="text-[10px] opacity-60 mt-0.5">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Input
          label="Your Name"
          placeholder="Enter your name"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email (optional)"
          type="email"
          placeholder="For prayer confirmation"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <Input
        label="Prayer Title"
        placeholder="Brief description e.g. Healing for my mother"
        error={errors.title?.message}
        {...register('title')}
      />

      <Textarea
        label="Your Prayer Request"
        placeholder="Share what is on your heart. Be as specific as you feel comfortable..."
        rows={5}
        error={errors.body?.message}
        {...register('body')}
      />

      {/* Urgent checkbox */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-white/20 bg-white/5 accent-brand-gold"
          {...register('isUrgent')}
        />
        <span className="text-sm text-text-secondary group-hover:text-white transition-colors">
          Mark as urgent prayer request
        </span>
      </label>

      <Button type="submit" loading={isSubmitting} className="w-full" size="lg">
        <Heart className="h-5 w-5" />
        Submit Prayer Request
      </Button>

      <p className="text-xs text-text-muted text-center">
        Your request is handled with care and confidentiality.
      </p>
    </form>
  )
}
