import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function MinistryPortalRootPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login?callbackUrl=/ministry-portal')

  // Find which ministry this user leads
  const ministry = await prisma.ministry.findFirst({
    where: { leaderUserId: session.user.id },
  })

  if (ministry) {
    redirect(`/ministry-portal/${ministry.slug}`)
  }

  // ADMIN/SUPER_ADMIN: show all ministries picker
  const all = await prisma.ministry.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    select: { slug: true, name: true, tagline: true },
  })

  return (
    <div className="p-8">
      <h1 className="font-display font-bold text-white text-2xl mb-2">Ministry Portal</h1>
      <p className="text-text-muted mb-8">Select a ministry unit to manage:</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {all.map((m) => (
          <a
            key={m.slug}
            href={`/ministry-portal/${m.slug}`}
            className="glass-card rounded-2xl p-5 border border-white/8 hover:border-brand-gold/30 transition-colors group"
          >
            <div className="font-display font-semibold text-white group-hover:text-brand-gold transition-colors">{m.name}</div>
            {m.tagline && <div className="text-xs text-text-muted mt-1">{m.tagline}</div>}
          </a>
        ))}
      </div>
    </div>
  )
}
