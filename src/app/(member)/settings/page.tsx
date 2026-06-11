'use client'

import { FadeInUp } from '@/components/motion/FadeInUp'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function MemberSettingsPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <FadeInUp>
        <h1 className="text-2xl font-display font-bold text-white">Settings</h1>
        <p className="text-text-muted mt-1">Manage your account preferences.</p>
      </FadeInUp>

      <FadeInUp>
        <div className="space-y-3">
          {[
            { label: 'Profile & Personal Info', href: '/member/profile', desc: 'Update your name, email, and contact details.' },
            { label: 'Password & Security', href: '/member/profile', desc: 'Change your password and manage security settings.' },
            { label: 'Notification Preferences', href: '#', desc: 'Control what emails and alerts you receive.' },
            { label: 'Delete Account', href: '#', desc: 'Permanently delete your account and all data.' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between glass-card rounded-xl px-5 py-4 group hover:border-white/20 transition-all"
            >
              <div>
                <div className="text-sm font-medium text-white">{item.label}</div>
                <div className="text-xs text-text-muted mt-0.5">{item.desc}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-white transition-colors" />
            </Link>
          ))}
        </div>
      </FadeInUp>
    </div>
  )
}
