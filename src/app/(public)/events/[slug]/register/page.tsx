'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const registrationSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
})
type RegistrationInput = z.infer<typeof registrationSchema>

export default function EventRegistrationPage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
  })

  async function onSubmit(data: RegistrationInput) {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/events/${params.slug}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Registration failed')
      }
      setSubmitted(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-brand-navy flex items-center justify-center px-4">
        <FadeInUp className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-3">You're Registered!</h1>
          <p className="text-text-muted mb-8">
            Check your email for confirmation details. We look forward to seeing you there.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/events" className="btn-gold">View All Events</Link>
            <Link href="/" className="btn-outline">Back to Home</Link>
          </div>
        </FadeInUp>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-brand-navy pt-24 pb-24">
      <div className="container mx-auto px-4 sm:px-6 max-w-lg">
        <FadeInUp>
          <Link
            href={`/events/${params.slug}`}
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Event
          </Link>

          <h1 className="font-display text-3xl font-bold text-white mb-2">Register</h1>
          <p className="text-text-muted mb-8">Fill in your details to secure your spot.</p>

          <div className="glass-card rounded-2xl p-7">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  {...register('firstName')}
                  error={errors.firstName?.message}
                  placeholder="Grace"
                />
                <Input
                  label="Last Name"
                  {...register('lastName')}
                  error={errors.lastName?.message}
                  placeholder="Johnson"
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                placeholder="grace@example.com"
              />

              <Input
                label="Phone Number (optional)"
                type="tel"
                {...register('phone')}
                error={errors.phone?.message}
                placeholder="+1 (555) 000-0000"
              />

              <div>
                <label className="block text-sm font-medium text-white mb-1.5">
                  Additional Notes (optional)
                </label>
                <textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="Dietary restrictions, accessibility needs, or questions..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-brand-gold/50 transition-colors resize-none"
                />
              </div>

              <Button type="submit" variant="gold" loading={submitting} className="w-full">
                {submitting ? 'Registering...' : 'Complete Registration'}
              </Button>

              <p className="text-center text-xs text-text-muted">
                By registering, you agree to receive event communications from GGCC.
              </p>
            </form>
          </div>
        </FadeInUp>
      </div>
    </main>
  )
}
