import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { Badge } from '@/components/ui/Badge'
import { Heart, Plus, Globe, Eye, Lock } from 'lucide-react'
import { format } from 'date-fns'

export const metadata: Metadata = { title: 'My Prayers' }

const visibilityIcon = { PUBLIC: Globe, ANONYMOUS: Eye, PRIVATE: Lock }
const visibilityColor = { PUBLIC: '#5B8DD9', ANONYMOUS: '#C9A84C', PRIVATE: '#E85D75' }

export default async function MyPrayersPage() {
  const session = await auth()
  const userId = session!.user.id

  const prayers = await prisma.prayerRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 30,
  })

  return (
    <div className="space-y-8 max-w-3xl">
      <FadeInUp className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">My Prayers</h1>
          <p className="text-text-muted mt-1">Track your prayer requests and watch God move.</p>
        </div>
        <Link href="/prayer" className="btn-gold text-sm flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Request
        </Link>
      </FadeInUp>

      {prayers.length === 0 ? (
        <FadeInUp>
          <div className="glass-card rounded-2xl p-12 text-center">
            <Heart className="h-12 w-12 text-text-muted mx-auto mb-4" />
            <h3 className="font-display font-semibold text-white text-lg mb-2">
              No prayer requests yet
            </h3>
            <p className="text-text-muted mb-6 text-sm">
              Submit your first prayer request and let the community stand with you.
            </p>
            <Link href="/prayer" className="btn-gold">Submit a Prayer Request</Link>
          </div>
        </FadeInUp>
      ) : (
        <FadeInUp>
          <div className="space-y-4">
            {prayers.map((p) => {
              const VisIcon = visibilityIcon[p.visibility as keyof typeof visibilityIcon] ?? Globe
              const visColor = visibilityColor[p.visibility as keyof typeof visibilityColor] ?? '#5B8DD9'
              return (
                <div key={p.id} className="glass-card rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="font-semibold text-white text-sm leading-snug flex-1">{p.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: `${visColor}18`, color: visColor }}
                      >
                        <VisIcon className="h-3 w-3" />
                        {p.visibility.toLowerCase()}
                      </span>
                      <Badge
                        variant={p.status === 'ANSWERED' ? 'success' : 'muted'}
                        className="text-[10px]"
                      >
                        {p.status === 'ANSWERED' ? 'Answered' : 'Active'}
                      </Badge>
                    </div>
                  </div>

                  {p.body && (
                    <p className="text-sm text-text-muted line-clamp-2 mb-3">{p.body}</p>
                  )}

                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span>{format(new Date(p.createdAt), 'MMMM d, yyyy')}</span>
                    <span className="flex items-center gap-1 text-brand-gold">
                      <Heart className="h-3 w-3 fill-current" />
                      {p.intercedeCount} praying
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </FadeInUp>
      )}
    </div>
  )
}
