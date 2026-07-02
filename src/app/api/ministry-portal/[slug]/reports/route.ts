import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

async function verifyAccess(slug: string, userId: string, role: string) {
  const ministry = await prisma.ministry.findUnique({ where: { slug } })
  if (!ministry) return null
  if (ministry.leaderUserId !== userId && role !== 'ADMIN' && role !== 'SUPER_ADMIN') return null
  return ministry
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ministry = await verifyAccess(params.slug, session.user.id, session.user.role!)
  if (!ministry) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const reports = await prisma.ministryMonthlyReport.findMany({
    where: { ministryId: ministry.id },
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
  })

  return NextResponse.json({ reports })
}

const reportSchema = z.object({
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2099),
  memberCount: z.number().optional().nullable(),
  highlights: z.string().optional().nullable(),
  challenges: z.string().optional().nullable(),
  prayerPoints: z.string().optional().nullable(),
  goalsNextMonth: z.string().optional().nullable(),
})

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ministry = await verifyAccess(params.slug, session.user.id, session.user.role!)
  if (!ministry) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const parsed = reportSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const report = await prisma.ministryMonthlyReport.upsert({
    where: { ministryId_month_year: { ministryId: ministry.id, month: parsed.data.month, year: parsed.data.year } },
    update: {
      memberCount: parsed.data.memberCount ?? null,
      highlights: parsed.data.highlights ?? null,
      challenges: parsed.data.challenges ?? null,
      prayerPoints: parsed.data.prayerPoints ?? null,
      goalsNextMonth: parsed.data.goalsNextMonth ?? null,
      status: 'SUBMITTED',
    },
    create: {
      ministryId: ministry.id,
      submittedById: session.user.id,
      month: parsed.data.month,
      year: parsed.data.year,
      memberCount: parsed.data.memberCount ?? null,
      highlights: parsed.data.highlights ?? null,
      challenges: parsed.data.challenges ?? null,
      prayerPoints: parsed.data.prayerPoints ?? null,
      goalsNextMonth: parsed.data.goalsNextMonth ?? null,
    },
  })

  return NextResponse.json({ report }, { status: 201 })
}
