'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, Gift, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface NavItem {
  label: string
  href?: string
  children?: Array<{ label: string; href: string; desc: string }>
}

interface MobileNavProps {
  open: boolean
  onClose: () => void
  navItems: NavItem[]
}

export function MobileNav({ open, onClose, navItems }: MobileNavProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[190] bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[195] w-80 bg-brand-navy border-l border-white/8 lg:hidden overflow-y-auto"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/8">
              <span className="font-display font-bold text-white text-lg">Menu</span>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {item.label}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <div>
                      <div className="px-4 pt-3 pb-1 text-xs font-semibold text-brand-gold tracking-widest uppercase">
                        {item.label}
                      </div>
                      {item.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="p-4 mt-4 border-t border-white/8 space-y-3">
              <Link
                href="/give"
                onClick={onClose}
                className="btn-gold w-full justify-center"
              >
                <Gift className="h-4 w-4" />
                Give Now
              </Link>
              <Link
                href="/login"
                onClick={onClose}
                className="btn-ghost w-full justify-center"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
