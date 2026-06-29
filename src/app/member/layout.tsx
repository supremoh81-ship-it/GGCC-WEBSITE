import type { ReactNode } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { LayoutDashboard, User, Heart, BookmarkCheck, Calendar, Settings, LogOut } from 'lucide-react'

const navItems = [
  { href: '/member/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/member/profile', label: 'My Profile', icon: User },
  { href: '/member/my-giving', label: 'My Giving', icon: Heart },
  { href: '/member/my-prayers', label: 'My Prayers', icon: BookmarkCheck },
  { href: '/member/my-events', label: 'My Events', icon: Calendar },
  { href: '/member/settings', label: 'Settings', icon: Settings },
]

export default async function MemberLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login?callbackUrl=/member/dashboard')

  return (
    <div className="min-h-screen bg-brand-navy pt-16">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-4rem)] bg-brand-blue border-r border-white/8 p-5 sticky top-16">
          <div className="mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center mb-3">
              <span className="text-brand-gold font-bold text-lg">
                {session.user?.name?.[0]?.toUpperCase() ?? 'M'}
              </span>
            </div>
            <div className="text-sm font-semibold text-white">{session.user?.name}</div>
            <div className="text-xs text-text-muted">{session.user?.email}</div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-text-muted hover:text-white hover:bg-white/5 transition-all"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="pt-4 border-t border-white/8">
            <Link
              href="/api/auth/signout"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-text-muted hover:text-white hover:bg-white/5 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-6 lg:p-8 max-w-5xl">
          {children}
        </main>
      </div>
    </div>
  )
}
