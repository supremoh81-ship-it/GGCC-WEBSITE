import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (session) {
    const existing = await prisma.prayerIntercession.findFirst({
      where: { prayerId: params.id, userId: session.user.id },
    })
    if (existing) {
      return NextResponse.json({ error: 'Already interceding' }, { status: 409 })
    }

    await prisma.$transaction([
      prisma.prayerIntercession.create({
        data: { prayerId: params.id, userId: session.user.id },
      }),
      prisma.prayerRequest.update({
        where: { id: params.id },
        data: { intercedeCount: { increment: 1 } },
      }),
    ])
  } else {
    await prisma.prayerRequest.update({
      where: { id: params.id },
      data: { intercedeCount: { increment: 1 } },
    })
  }

  return NextResponse.json({ message: 'Interceding' })
}
