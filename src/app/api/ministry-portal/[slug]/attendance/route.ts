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

  const sessions = await prisma.ministryAttendance.findMany({
    where: { ministryId: ministry.id },
    orderBy: { sessionDate: 'desc' },
    take: 100,
  })

  return NextResponse.json({ sessions })
}

const sessionSchema = z.object({
  sessionDate: z.string().min(1),
  sessionName: z.string().optional().nullable(),
  memberCount: z.number().min(0).default(0),
  guestCount: z.number().min(0).default(0),
  notes: z.string().optional().nullable(),
})

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const { ministry, userId } = await resolveAccess(req, params.slug)
  if (!ministry) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!userId) return NextResponse.json({ error: 'Attendance recording requires a member login' }, { status: 403 })

  const body = await req.json()
  const parsed = sessionSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const attendance = await prisma.ministryAttendance.create({
    data: {
      ministryId: ministry.id,
      sessionDate: new Date(parsed.data.sessionDate),
      sessionName: parsed.data.sessionName ?? null,
      memberCount: parsed.data.memberCount,
      guestCount: parsed.data.guestCount,
      notes: parsed.data.notes ?? null,
      recordedBy: userId,
    },
  })

  return NextResponse.json({ session: attendance }, { status: 201 })
}
