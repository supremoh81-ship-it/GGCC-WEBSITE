'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const forgotSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})
type ForgotInput = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotInput>({
    resolver: zodResolver(forgotSchema),
  })

  async function onSubmit(data: ForgotInput) {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Request failed')
      }
      setSubmitted(true)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8 text-center">
        <FadeInUp>
          <div className="w-16 h-16 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-brand-gold" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-3">Check your inbox</h1>
          <p className="text-text-muted max-w-sm mx-auto mb-6">
            If an account exists for <span className="text-white">{getValues('email')}</span>, you
            will receive a password reset link shortly.
          </p>
          <Link href="/login" className="btn-gold text-sm">
            Back to Sign In
          </Link>
        </FadeInUp>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center min-h-full p-8 sm:p-12">
      <FadeInUp>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
            <Mail className="h-5 w-5 text-brand-gold" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Forgot Password</h1>
            <p className="text-sm text-text-muted">We will send you a reset link</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="your@email.com"
          />

          <Button type="submit" variant="gold" loading={loading} className="w-full">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Remember your password?{' '}
          <Link href="/login" className="text-brand-gold hover:underline">
            Sign in
          </Link>
        </p>
      </FadeInUp>
    </div>
  )
}
