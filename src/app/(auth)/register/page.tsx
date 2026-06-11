'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { UserPlus, Chrome } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
})

type FormValues = z.infer<typeof schema>

export default function RegisterPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const err = await res.json()
      toast.error(err.error ?? 'Registration failed. Please try again.')
      return
    }

    await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    router.push('/member/dashboard')
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold text-white mb-1">
          Join <GoldShimmer>GGCC</GoldShimmer>
        </h1>
        <p className="text-text-muted text-sm">Create your account to connect with the community</p>
      </div>

      <div className="glass-card rounded-3xl p-8 space-y-5" style={{ border: '1px solid rgba(201, 168, 76, 0.2)' }}>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="w-full"
          onClick={() => signIn('google', { callbackUrl: '/member/dashboard' })}
        >
          <Chrome className="h-5 w-5" />
          Sign up with Google
        </Button>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-text-muted">or register with email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" placeholder="John" error={errors.firstName?.message} {...register('firstName')} />
            <Input label="Last Name" placeholder="Doe" error={errors.lastName?.message} {...register('lastName')} />
          </div>
          <Input label="Email" type="email" placeholder="your@email.com" error={errors.email?.message} {...register('email')} />
          <Input label="Password" type="password" placeholder="Min 8 characters" error={errors.password?.message} {...register('password')} />
          <Input label="Confirm Password" type="password" placeholder="Repeat password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />

          <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
            <UserPlus className="h-4 w-4" />
            Create Account
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-gold hover:underline">Sign in</Link>
        </p>
      </div>

      <p className="text-center text-xs text-text-muted">
        <Link href="/" className="hover:text-white transition-colors">
          &larr; Back to GGCC
        </Link>
      </p>
    </div>
  )
}
