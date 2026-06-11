import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  await prisma.$transaction([
    prisma.sermon.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    }),
    prisma.sermonPlay.create({
      data: {
        sermonId: params.id,
        userId: session?.user?.id ?? null,
      },
    }),
  ])

  return NextResponse.json({ ok: true })
}
