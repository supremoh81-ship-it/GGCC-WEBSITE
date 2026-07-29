import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { searchParams } = new URL(req.url)
  const unit = searchParams.get('unit') ?? ''
  const month = searchParams.get('month') ?? ''

  const reports = await prisma.unitReport.findMany({
    where: {
      ...(unit ? { unitName: unit } : {}),
      ...(month ? { reportMonth: month } : {}),
    },
    orderBy: { activityDate: 'desc' },
    take: 500,
  })

  return NextResponse.json({ data: reports })
}
