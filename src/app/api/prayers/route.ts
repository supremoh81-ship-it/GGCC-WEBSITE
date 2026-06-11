import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { PrayerVisibility } from '@prisma/client'

const createSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional().or(z.literal('')),
  title: z.string().min(5).max(100),
  body: z.string().min(20).max(2000),
  visibility: z.nativeEnum(PrayerVisibility).default('PUBLIC'),
  isUrgent: z.boolean().default(false),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '12'), 50)
  const skip = (page - 1) * limit

  const prayers = await prisma.prayerRequest.findMany({
    where: { visibility: 'PUBLIC', status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
    skip,
    take: limit,
    select: {
      id: true,
      name: true,
      title: true,
      body: true,
      visibility: true,
      isUrgent: true,
      intercedeCount: true,
      isAnswered: true,
      createdAt: true,
      category: { select: { name: true } },
    },
  })

  const total = await prisma.prayerRequest.count({
    where: { visibility: 'PUBLIC', status: 'ACTIVE' },
  })

  return NextResponse.json({ prayers, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { email, ...rest } = parsed.data

  const prayer = await prisma.prayerRequest.create({
    data: {
      ...rest,
      email: email || null,
    },
  })

  return NextResponse.json(prayer, { status: 201 })
}
