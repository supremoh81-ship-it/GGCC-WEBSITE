import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await prisma.ministryMember.findFirst({
    where: { ministryId: params.id, userId: session.user.id },
  })
  if (existing) {
    return NextResponse.json({ error: 'Already a member' }, { status: 409 })
  }

  const member = await prisma.ministryMember.create({
    data: { ministryId: params.id, userId: session.user.id },
  })

  return NextResponse.json({ data: member }, { status: 201 })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.ministryMember.deleteMany({
    where: { ministryId: params.id, userId: session.user.id },
  })

  return NextResponse.json({ message: 'Left ministry' })
}
