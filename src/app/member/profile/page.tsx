'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { User, Lock, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

const profileSchema = z.object({
  firstName: z.string().min(2, 'Required'),
  lastName: z.string().min(2, 'Required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(8, 'Required'),
  newPassword: z.string().min(8, 'Min 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
})

type ProfileValues = z.infer<typeof profileSchema>
type PasswordValues = z.infer<typeof passwordSchema>

export default function MemberProfilePage() {
  const { data: session, update } = useSession()
  const [tab, setTab] = useState<'profile' | 'security'>('profile')
  const [saved, setSaved] = useState(false)

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: session?.user?.name?.split(' ')[0] ?? '',
      lastName: session?.user?.name?.split(' ')[1] ?? '',
      email: session?.user?.email ?? '',
    },
  })

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
  })

  async function saveProfile(data: ProfileValues) {
    try {
      const res = await fetch('/api/member/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      await update({ name: `${data.firstName} ${data.lastName}` })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      toast.error('Failed to save profile.')
    }
  }

  async function changePassword(data: PasswordValues) {
    try {
      const res = await fetch('/api/member/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success('Password updated successfully.')
      passwordForm.reset()
    } catch {
      toast.error('Failed to update password. Check your current password.')
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <FadeInUp>
        <h1 className="text-2xl font-display font-bold text-white">My Profile</h1>
        <p className="text-text-muted mt-1">Manage your account information and security settings.</p>
      </FadeInUp>

      {/* Tabs */}
      <FadeInUp>
        <div className="flex gap-2 border-b border-white/10 pb-1">
          {(['profile', 'security'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-all capitalize ${
                tab === t ? 'text-brand-gold border-b-2 border-brand-gold' : 'text-text-muted hover:text-white'
              }`}
            >
              {t === 'profile' ? <User className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              {t === 'profile' ? 'Profile' : 'Security'}
            </button>
          ))}
        </div>
      </FadeInUp>

      {tab === 'profile' && (
        <FadeInUp>
          <form onSubmit={profileForm.handleSubmit(saveProfile)} className="glass-card rounded-2xl p-7 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                {...profileForm.register('firstName')}
                error={profileForm.formState.errors.firstName?.message}
              />
              <Input
                label="Last Name"
                {...profileForm.register('lastName')}
                error={profileForm.formState.errors.lastName?.message}
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              {...profileForm.register('email')}
              error={profileForm.formState.errors.email?.message}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Phone (optional)"
                type="tel"
                {...profileForm.register('phone')}
              />
              <Input
                label="City (optional)"
                {...profileForm.register('city')}
              />
            </div>
            <Input
              label="Country (optional)"
              {...profileForm.register('country')}
            />

            <div className="flex items-center gap-4">
              <Button
                type="submit"
                variant="gold"
                loading={profileForm.formState.isSubmitting}
              >
                Save Changes
              </Button>
              {saved && (
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  Saved
                </div>
              )}
            </div>
          </form>
        </FadeInUp>
      )}

      {tab === 'security' && (
        <FadeInUp>
          <form onSubmit={passwordForm.handleSubmit(changePassword)} className="glass-card rounded-2xl p-7 space-y-5">
            <h2 className="font-semibold text-white">Change Password</h2>
            <Input
              label="Current Password"
              type="password"
              {...passwordForm.register('currentPassword')}
              error={passwordForm.formState.errors.currentPassword?.message}
            />
            <Input
              label="New Password"
              type="password"
              {...passwordForm.register('newPassword')}
              error={passwordForm.formState.errors.newPassword?.message}
            />
            <Input
              label="Confirm New Password"
              type="password"
              {...passwordForm.register('confirmPassword')}
              error={passwordForm.formState.errors.confirmPassword?.message}
            />
            <Button
              type="submit"
              variant="gold"
              loading={passwordForm.formState.isSubmitting}
            >
              Update Password
            </Button>
          </form>
        </FadeInUp>
      )}
    </div>
  )
}
