import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { SignatureHalo } from '@/components/motion/SignatureHalo'
import { Heart, Plus } from 'lucide-react'
import { format } from 'date-fns'

const cardAccents = [
  { border: 'border-brand-gold/20', icon: 'text-brand-gold', hoverIcon: 'hover:text-brand-gold-light' },
  { border: 'border-brand-teal/20', icon: 'text-brand-teal', hoverIcon: 'hover:text-brand-teal-light' },
  { border: 'border-brand-magenta/20', icon: 'text-brand-magenta', hoverIcon: 'hover:text-brand-magenta-light' },
]

export const metadata: Metadata = {
  title: 'Prayer Wall',
  description: 'Stand in agreement with the GGCC community. Add your prayer, intercede for others.',
}

export const dynamic = 'force-dynamic'

export default async function PrayerWallPage() {
  const prayers = await prisma.prayerRequest.findMany({
    where: {
      status: 'ACTIVE',
      visibility: { in: ['PUBLIC', 'ANONYMOUS'] },
    },
    orderBy: { createdAt: 'desc' },
    take: 40,
  })

  return (
    <div className="min-h-screen bg-brand-navy pt-24">
      <section className="section-padding-sm bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-regal" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-50">
          <SignatureHalo size={500} />
        </div>
        <div className="container mx-auto px-4 max-w-7xl relative">
          <FadeInUp className="text-center">
            <span className="section-label mb-4 inline-flex justify-center">Prayer Wall</span>
            <h1 className="text-display-lg font-display text-white mb-4">
              Standing in <GoldShimmer>Agreement</GoldShimmer>
            </h1>
            <p className="text-body-lg text-text-muted max-w-lg mx-auto mb-6">
              Every prayer on this wall is a declaration of faith. Join us in interceding for one another.
            </p>
            <Link href="/prayer" className="btn-gold">
              <Plus className="h-4 w-4" />
              Add Your Prayer
            </Link>
          </FadeInUp>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-7xl">
          {prayers.length === 0 ? (
            <FadeInUp className="text-center py-12">
              <Heart className="h-12 w-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-muted">No public prayers yet. Be the first to share.</p>
            </FadeInUp>
          ) : (
            <StaggerChildren className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
              {prayers.map((p, i) => {
                const accent = cardAccents[i % cardAccents.length]
                return (
                  <StaggerItem key={p.id}>
                    <div className={`glass-card rounded-2xl p-5 break-inside-avoid mb-5 border ${accent.border}`}>
                      <h3 className="font-semibold text-white text-sm leading-snug mb-2">{p.title}</h3>
                      {p.body && (
                        <p className="text-xs text-text-muted leading-relaxed mb-3">{p.body}</p>
                      )}
                      <div className="flex items-center justify-between pt-3 border-t border-white/8">
                        <span className="text-[10px] text-text-muted">
                          {format(new Date(p.createdAt), 'MMM d, yyyy')}
                        </span>
                        <button className={`flex items-center gap-1.5 text-xs ${accent.icon} ${accent.hoverIcon} transition-colors`}>
                          <Heart className="h-3.5 w-3.5" />
                          <span>{p.intercedeCount} praying</span>
                        </button>
                      </div>
                    </div>
                  </StaggerItem>
                )
              })}
            </StaggerChildren>
          )}
        </div>
      </section>
    </div>
  )
}
