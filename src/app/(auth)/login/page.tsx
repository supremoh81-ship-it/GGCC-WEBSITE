'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Chrome, LogIn } from 'lucide-react'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/member/dashboard'
  const [googleLoading, setGoogleLoading] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    if (result?.error) {
      toast.error('Invalid email or password. Please try again.')
    } else {
      window.location.href = callbackUrl
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await signIn('google', { callbackUrl })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold text-white mb-1">
          Welcome <GoldShimmer>Back</GoldShimmer>
        </h1>
        <p className="text-text-muted text-sm">Sign in to your GGCC account</p>
      </div>

      <div className="glass-card rounded-3xl p-8 space-y-5" style={{ border: '1px solid rgba(201, 168, 76, 0.2)' }}>
        <Button
          type="button"
          variant="ghost"
          size="lg"
          className="w-full"
          loading={googleLoading}
          onClick={handleGoogle}
        >
          <Chrome className="h-5 w-5" />
          Continue with Google
        </Button>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-text-muted">or sign in with email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="your@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-brand-gold hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
            <LogIn className="h-4 w-4" />
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted">
          Not a member?{' '}
          <Link href="/register" className="text-brand-gold hover:underline">
            Create an account
          </Link>
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
