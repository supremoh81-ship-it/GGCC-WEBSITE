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
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ministry = await verifyAccess(params.slug, session.user.id, session.user.role!)
  if (!ministry) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

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
      recordedBy: session.user.id,
    },
  })

  return NextResponse.json({ session: attendance }, { status: 201 })
}
