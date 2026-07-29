import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { action } = await req.json()
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const updated = await prisma.unitMember.update({
    where: { id: params.id },
    data: { status: action === 'approve' ? 'APPROVED' : 'PENDING' },
  })

  return NextResponse.json({ data: updated })
}
