import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const ministries = await prisma.ministry.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    include: {
      leaders: true,
      _count: { select: { members: true } },
    },
  })

  return NextResponse.json({ data: ministries })
}
