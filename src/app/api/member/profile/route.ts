import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
})

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { firstName, lastName, email, phone, city, country } = parsed.data

  const emailTaken = await prisma.user.findFirst({
    where: { email, NOT: { id: session.user.id } },
  })
  if (emailTaken) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { firstName, lastName, email, phone, city, country },
    select: { id: true, firstName: true, lastName: true, email: true },
  })

  return NextResponse.json({ data: user })
}

