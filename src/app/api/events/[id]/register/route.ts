import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  notes: z.string().max(500).optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, notes } = schema.parse(body)

    const session = await auth()

    const event = await prisma.event.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }] },
      include: { _count: { select: { registrations: true } } },
    })

    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    if (event.status !== 'PUBLISHED') {
      return NextResponse.json({ error: 'Event is not accepting registrations' }, { status: 400 })
    }
    if (event.capacity && event._count.registrations >= event.capacity) {
      return NextResponse.json({ error: 'Event is at full capacity' }, { status: 400 })
    }

    const existing = await prisma.eventRegistration.findFirst({
      where: { eventId: event.id, email },
    })
    if (existing) {
      return NextResponse.json({ error: 'This email is already registered for this event.' }, { status: 409 })
    }

    const registration = await prisma.eventRegistration.create({
      data: {
        eventId: event.id,
        userId: session?.user.id ?? null,
        firstName,
        lastName,
        email,
        phone: phone ?? null,
        notes: notes ?? null,
      },
    })

    return NextResponse.json({ data: registration }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: err.issues }, { status: 400 })
    }
    console.error('[EVENT_REGISTER]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
