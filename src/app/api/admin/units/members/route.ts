import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { searchParams } = new URL(req.url)
  const unit = searchParams.get('unit') ?? ''
  const status = searchParams.get('status') ?? ''

  const members = await prisma.unitMember.findMany({
    where: {
      ...(unit ? { unitName: unit } : {}),
      ...(status === 'PENDING' || status === 'APPROVED' ? { status } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 500,
  })

  return NextResponse.json({ data: members })
}
