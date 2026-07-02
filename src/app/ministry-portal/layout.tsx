import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { LayoutDashboard, Users, CalendarCheck, HandCoins, FileText, LogOut, ChevronRight } from 'lucide-react'

const NAV = [
  { label: 'Dashboard', href: '', icon: LayoutDashboard },
  { label: 'Members', href: '/members', icon: Users },
  { label: 'Attendance', href: '/attendance', icon: CalendarCheck },
  { label: 'Giving Reports', href: '/giving', icon: HandCoins },
  { label: 'Monthly Report', href: '/reports', icon: FileText },
]

export default async function MinistryPortalLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug?: string }
}) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login?callbackUrl=/ministry-portal')
  }

  const role = session.user.role
  if (role !== 'MINISTER' && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    redirect('/403')
  }

  const slug = params?.slug ?? ''

  return (
    <div className="min-h-screen bg-brand-navy flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-brand-blue border-r border-white/8 flex flex-col min-h-screen">
        {/* Logo */}
        <div className="p-6 border-b border-white/8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src="/images/logo.png"
                alt="GGCC"
                fill
                className="object-contain drop-shadow-[0_0_8px_rgba(201,168,76,0.4)]"
                sizes="40px"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-none">GGCC</div>
              <div className="text-[10px] text-brand-gold/80 tracking-wider uppercase mt-0.5">Unit Portal</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map((item) => {
            const href = `/ministry-portal/${slug}${item.href}`
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-white hover:bg-white/8 transition-colors group"
              >
                <Icon className="h-4 w-4 text-brand-gold/70 group-hover:text-brand-gold transition-colors" />
                {item.label}
                <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
              </Link>
            )
          })}
        </nav>

        {/* User + sign out */}
        <div className="p-4 border-t border-white/8">
          <div className="flex items-center gap-3 mb-3 px-3">
            <div className="w-8 h-8 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-brand-gold">
                {session.user.name?.charAt(0).toUpperCase() ?? 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-white truncate">{session.user.name}</div>
              <div className="text-[10px] text-text-muted truncate">{session.user.email}</div>
            </div>
          </div>
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-text-muted hover:text-white hover:bg-white/8 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
