import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

async function resolveAccess(req: NextRequest, slug: string) {
  const adminToken = req.cookies.get(ADMIN_COOKIE)?.value
  if (adminToken && (await verifyAdminToken(adminToken))) {
    const ministry = await prisma.ministry.findUnique({ where: { slug } })
    return { ministry: ministry ?? null, userId: null }
  }

  const session = await auth()
  if (!session?.user?.id) return { ministry: null, userId: null }
  const ministry = await prisma.ministry.findUnique({ where: { slug } })
  if (!ministry) return { ministry: null, userId: null }
  const role = session.user.role as string
  if (ministry.leaderUserId !== session.user.id && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    return { ministry: null, userId: null }
  }
  return { ministry, userId: session.user.id }
}

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const { ministry } = await resolveAccess(req, params.slug)
  if (!ministry) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
  const { ministry, userId } = await resolveAccess(req, params.slug)
  if (!ministry) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!userId) return NextResponse.json({ error: 'Report submission requires a member login' }, { status: 403 })

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
      submittedById: userId,
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
