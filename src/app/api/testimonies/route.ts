import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createSchema = z.object({
  name: z.string().min(2).max(100),
  title: z.string().min(5).max(200),
  body: z.string().min(50).max(5000),
  videoUrl: z.string().url().optional().or(z.literal('')),
  imageUrl: z.string().url().optional().or(z.literal('')),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '12')
  const featured = searchParams.get('featured')

  const skip = (page - 1) * limit

  const where = {
    status: 'APPROVED' as const,
    ...(featured === 'true' && { isFeatured: true }),
  }

  const [testimonies, total] = await Promise.all([
    prisma.testimony.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    }),
    prisma.testimony.count({ where }),
  ])

  return NextResponse.json({
    data: testimonies,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  const body = await req.json()

  const parsed = createSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const testimony = await prisma.testimony.create({
    data: {
      ...parsed.data,
      videoUrl: parsed.data.videoUrl || null,
      imageUrl: parsed.data.imageUrl || null,
      userId: session?.user.id,
      status: 'PENDING',
    },
  })

  return NextResponse.json({ data: testimony }, { status: 201 })
}
