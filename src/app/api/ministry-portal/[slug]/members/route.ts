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

  const members = await prisma.ministryMember.findMany({
    where: { ministryId: ministry.id },
    include: {
      user: { select: { firstName: true, lastName: true, email: true, phone: true, avatarUrl: true } },
    },
    orderBy: { joinedAt: 'desc' },
  })

  return NextResponse.json({ members })
}

const addSchema = z.object({
  email: z.string().email(),
  role: z.string().optional().nullable(),
})

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ministry = await verifyAccess(params.slug, session.user.id, session.user.role!)
  if (!ministry) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const parsed = addSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } })
  if (!user) return NextResponse.json({ error: 'No GGCC account found with that email address.' }, { status: 404 })

  const existing = await prisma.ministryMember.findUnique({
    where: { userId_ministryId: { userId: user.id, ministryId: ministry.id } },
  })
  if (existing) return NextResponse.json({ error: 'This person is already a member of this unit.' }, { status: 409 })

  const member = await prisma.ministryMember.create({
    data: { userId: user.id, ministryId: ministry.id, role: parsed.data.role ?? null },
    include: { user: { select: { firstName: true, lastName: true, email: true, phone: true, avatarUrl: true } } },
  })

  return NextResponse.json({ member }, { status: 201 })
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ministry = await verifyAccess(params.slug, session.user.id, session.user.role!)
  if (!ministry) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { userId } = await req.json()
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  await prisma.ministryMember.delete({
    where: { userId_ministryId: { userId, ministryId: ministry.id } },
  })

  return NextResponse.json({ ok: true })
}
