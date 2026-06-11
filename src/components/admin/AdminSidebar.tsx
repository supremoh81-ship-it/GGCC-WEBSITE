'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'
import {
  LayoutDashboard,
  Play,
  Mic,
  Heart,
  Calendar,
  Users,
  Gift,
  Image,
  BarChart2,
  Settings,
  MessageSquare,
  Star,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface SidebarItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number
  adminOnly?: boolean
}

const navSections: { title: string; items: SidebarItem[] }[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Sermons', href: '/admin/sermons', icon: Play },
      { label: 'Podcasts', href: '/admin/podcasts', icon: Mic },
      { label: 'Events', href: '/admin/events', icon: Calendar },
      { label: 'Ministries', href: '/admin/ministries', icon: Users },
      { label: 'Gallery', href: '/admin/gallery', icon: Image },
      { label: 'Media Library', href: '/admin/media', icon: Image },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Prayers', href: '/admin/prayers', icon: Heart },
      { label: 'Testimonies', href: '/admin/testimonies', icon: Star },
      { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
    ],
  },
  {
    title: 'Finance',
    items: [
      { label: 'Donations', href: '/admin/giving', icon: Gift },
      { label: 'Campaigns', href: '/admin/giving/campaigns', icon: Gift },
    ],
  },
  {
    title: 'Admin',
    items: [
      { label: 'Users', href: '/admin/users', icon: Users, adminOnly: true },
      { label: 'Settings', href: '/admin/settings', icon: Settings, adminOnly: true },
    ],
  },
]

export function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const isSuperAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(role)

  const sidebar = (
    <div className="h-full flex flex-col bg-brand-blue border-r border-white/8 w-64">
      {/* Logo */}
      <div className="p-5 border-b border-white/8">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-gold/15 flex items-center justify-center">
            <span className="font-display font-bold text-brand-gold text-sm">G</span>
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm">GGCC Admin</div>
            <div className="text-[10px] text-text-muted capitalize">{role.toLowerCase().replace('_', ' ')}</div>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-4">
        {navSections.map((section) => {
          const visibleItems = section.items.filter((item) => !item.adminOnly || isSuperAdmin)
          if (!visibleItems.length) return null

          return (
            <div key={section.title}>
              <div className="px-3 py-1 text-[10px] font-semibold text-text-muted tracking-widest uppercase mb-1">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                        active
                          ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/25'
                          : 'text-text-muted hover:text-white hover:bg-white/5'
                      )}
                    >
                      <item.icon className={cn('h-4 w-4 flex-shrink-0', active && 'text-brand-gold')} />
                      <span className="flex-1">{item.label}</span>
                      {item.badge !== undefined && (
                        <span className="text-xs bg-brand-gold/20 text-brand-gold rounded-full px-2 py-0.5">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/8">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-text-muted hover:text-white transition-colors"
        >
          <ChevronRight className="h-3.5 w-3.5 rotate-180" />
          Back to Website
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex">
        {sidebar}
      </aside>

      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-brand-blue border border-white/8 text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle admin menu"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50">
            {sidebar}
          </aside>
        </>
      )}
    </>
  )
}
