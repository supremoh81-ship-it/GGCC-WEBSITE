'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Lock, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const resetSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
type ResetInput = z.infer<typeof resetSchema>

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetInput>({ resolver: zodResolver(resetSchema) })

  async function onSubmit(data: ResetInput) {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Reset failed')
      }
      setSuccess(true)
      setTimeout(() => router.push('/login'), 2500)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Reset failed. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8 text-center">
        <p className="text-text-muted mb-4">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="btn-gold text-sm">Request a new link</Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-full p-8 text-center">
        <FadeInUp>
          <div className="w-16 h-16 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-brand-gold" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-3">Password Updated</h1>
          <p className="text-text-muted">Redirecting you to sign in...</p>
        </FadeInUp>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center min-h-full p-8 sm:p-12">
      <FadeInUp>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
            <Lock className="h-5 w-5 text-brand-gold" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Set New Password</h1>
            <p className="text-sm text-text-muted">Choose a strong, memorable password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="New Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
            placeholder="At least 8 characters"
          />
          <Input
            label="Confirm Password"
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
            placeholder="Repeat your password"
          />
          <Button type="submit" variant="gold" loading={loading} className="w-full">
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </FadeInUp>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
