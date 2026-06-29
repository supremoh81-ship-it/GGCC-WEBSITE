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
          <Link href="/" className="flex items-center gap-2">
            <div className="relative w-11 h-11 shrink-0">
              <Image
                src="/images/logo.png"
                alt="Grace for Greatness Christian Centre"
                fill
                className="object-contain drop-shadow-[0_0_10px_rgba(201,168,76,0.5)]"
                sizes="44px"
              />
            </div>
            <div>
              <div className="font-display font-bold text-white text-base leading-none">Grace for Greatness</div>
              <div className="text-[9px] text-white/50 tracking-widest uppercase mt-0.5">Christian Centre</div>
            </div>
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
            { value: '10K+', label: 'Members' },
            { value: '6+', label: 'Nations' },
            { value: '5yr', label: 'Ministry' },
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
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-11 h-11 shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="Grace for Greatness Christian Centre"
                  fill
                  className="object-contain"
                  sizes="44px"
                />
              </div>
              <div>
                <div className="font-display font-bold text-white text-base leading-none">Grace for Greatness</div>
                <div className="text-[9px] text-text-muted tracking-widest uppercase mt-0.5">Christian Centre</div>
              </div>
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
