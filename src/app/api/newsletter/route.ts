import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    update: { isActive: true },
    create: {
      email: parsed.data.email,
      firstName: parsed.data.firstName,
      source: 'footer',
    },
  })

  return NextResponse.json({ success: true })
}
