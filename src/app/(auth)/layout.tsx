import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-navy flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&q=80"
            alt="GGCC worship"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/90 via-brand-navy/80 to-brand-blue/70" />
        </div>

        <div className="relative">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center">
              <span className="text-brand-gold font-display font-bold text-lg">G</span>
            </div>
            <span className="font-display font-bold text-white text-lg">GGCC</span>
          </Link>
        </div>

        <div className="relative space-y-4">
          <blockquote className="text-white text-2xl font-display font-light leading-relaxed">
            &ldquo;For we are God&rsquo;s handiwork, created in Christ Jesus to do good works,
            which God prepared in advance for us to do.&rdquo;
          </blockquote>
          <cite className="text-brand-gold text-sm not-italic">Ephesians 2:10</cite>
        </div>

        <div className="relative grid grid-cols-3 gap-6">
          {[
            { value: '50K+', label: 'Members' },
            { value: '120+', label: 'Nations' },
            { value: '15yr', label: 'Ministry' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-display font-bold text-brand-gold">{s.value}</div>
              <div className="text-xs text-white/60">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-gold/20 border border-brand-gold/40 flex items-center justify-center">
                <span className="text-brand-gold font-display font-bold text-lg">G</span>
              </div>
              <span className="font-display font-bold text-white text-lg">GGCC</span>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
