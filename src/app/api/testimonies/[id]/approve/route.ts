import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminRoles = ['ADMIN', 'SUPER_ADMIN']
  if (!adminRoles.includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { action } = await req.json()
  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const testimony = await prisma.testimony.update({
    where: { id: params.id },
    data: {
      status: action === 'approve' ? 'APPROVED' : 'REJECTED',
    },
  })

  return NextResponse.json({ data: testimony })
}
