'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/Button'
import { MobileNav } from '@/components/layout/MobileNav'
import {
  Menu,
  X,
  ChevronDown,
  Play,
  BookOpen,
  Mic,
  Heart,
  Calendar,
  Users,
  Gift,
  Image as ImageIcon,
  Globe,
} from 'lucide-react'

const navItems = [
  {
    label: 'Media',
    children: [
      { label: 'Sermons', href: '/sermons', icon: Play, desc: 'Video and audio messages' },
      { label: 'Podcasts', href: '/podcasts', icon: Mic, desc: 'Devotionals and discussions' },
      { label: 'Gallery', href: '/gallery', icon: ImageIcon, desc: 'Photos and memories' },
    ],
  },
  {
    label: 'Community',
    children: [
      { label: 'Prayer Hub', href: '/prayer', icon: Heart, desc: 'Submit and intercede' },
      { label: 'Testimonies', href: '/testimonies', icon: BookOpen, desc: 'Stories of transformation' },
      { label: 'Ministries', href: '/ministries', icon: Users, desc: 'Join a ministry team' },
    ],
  },
  {
    label: 'Events',
    href: '/events',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Global Impact',
    href: '/global-impact',
    icon: Globe,
  },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[200] transition-all duration-500',
          scrolled
            ? 'bg-brand-navy/95 backdrop-blur-xl py-3'
            : 'bg-transparent py-5'
        )}
      >
        {scrolled && <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-regal opacity-40" />}
        <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-14 h-14 shrink-0">
              <Image
                src="/images/logo.png"
                alt="Grace for Greatness Christian Centre"
                fill
                className="object-contain drop-shadow-[0_0_12px_rgba(201,168,76,0.5)] transition-all duration-300 group-hover:drop-shadow-[0_0_22px_rgba(201,168,76,0.75)] group-hover:scale-105"
                sizes="56px"
                priority
              />
            </div>
            <div className="hidden sm:flex flex-col gap-0.5">
              <span className="font-display font-bold text-white text-[17px] leading-none tracking-tight">
                Grace for Greatness
              </span>
              <span className="text-[10px] text-brand-gold/80 tracking-[0.18em] uppercase leading-none font-medium">
                Christian Centre
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'text-brand-gold'
                        : 'text-text-secondary hover:text-white'
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    className={cn(
                      'flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                      activeDropdown === item.label ? 'text-white' : 'text-text-secondary hover:text-white'
                    )}
                    aria-expanded={activeDropdown === item.label}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-200',
                        activeDropdown === item.label && 'rotate-180'
                      )}
                    />
                  </button>
                )}

                {/* Dropdown */}
                {item.children && (
                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 glass-card rounded-2xl p-2 border border-brand-gold/15"
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                          >
                            <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold/20 transition-colors">
                              <child.icon className="h-4 w-4 text-brand-gold" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-white">{child.label}</div>
                              <div className="text-xs text-text-muted mt-0.5">{child.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/give" className="btn-gold text-sm px-5 py-2.5">
              <Gift className="h-4 w-4" />
              Give
            </Link>
            <Link href="/login" className="btn-ghost text-sm px-5 py-2.5">
              Sign In
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} navItems={navItems} />
    </>
  )
}
