import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/).optional(),
  tagline: z.string().max(200).optional(),
  description: z.string().max(5000).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
  meetingSchedule: z.string().max(200).optional(),
  location: z.string().max(300).optional(),
  email: z.string().email().optional().or(z.literal('')),
  isActive: z.boolean().optional(),
})

async function guardAdmin() {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role as string)) {
    return null
  }
  return session
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await guardAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const ministry = await prisma.ministry.update({
    where: { id: params.id },
    data: { ...parsed.data, email: parsed.data.email || null },
  })

  return NextResponse.json({ data: ministry })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await guardAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.ministry.delete({ where: { id: params.id } })
  return NextResponse.json({ message: 'Ministry deleted' })
}
