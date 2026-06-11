import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { eventSchema } from '@/lib/validations'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '12')
  const type = searchParams.get('type')
  const status = searchParams.get('status') ?? 'PUBLISHED'
  const upcoming = searchParams.get('upcoming')

  const skip = (page - 1) * limit

  const where = {
    ...(status && { status: status as 'PUBLISHED' }),
    ...(type && { type: type as 'IN_PERSON' | 'ONLINE' | 'HYBRID' }),
    ...(upcoming === 'true' && { startDate: { gte: new Date() } }),
  }

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      skip,
      take: limit,
      orderBy: { startDate: 'asc' },
      include: {
        _count: { select: { registrations: true } },
        category: { select: { name: true, slug: true } },
      },
    }),
    prisma.event.count({ where }),
  ])

  return NextResponse.json({
    data: events,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const data = eventSchema.parse(body)

    const event = await prisma.event.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        type: data.type,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate ?? null,
        location: data.location ?? null,
        onlineUrl: data.onlineUrl || null,
        capacity: data.capacity ?? null,
        requiresTicket: data.requiresTicket,
        ticketPrice: data.ticketPrice ?? null,
      },
    })

    return NextResponse.json({ data: event }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: err.issues }, { status: 400 })
    }
    console.error('[EVENT_CREATE]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

