import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { sermonSchema } from '@/lib/validations'
import { resolveSpeakerId, resolveSeriesId } from '@/lib/utils/sermon-resolve'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '12'), 50)
  const skip = (page - 1) * limit
  const search = searchParams.get('search')
  const seriesId = searchParams.get('seriesId')
  const speakerId = searchParams.get('speakerId')
  const type = searchParams.get('type')
  const featured = searchParams.get('featured')

  const where = {
    status: 'PUBLISHED' as const,
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
    ...(seriesId && { seriesId }),
    ...(speakerId && { speakerId }),
    ...(type && { type: type as 'VIDEO' | 'AUDIO' | 'NOTES_ONLY' }),
    ...(featured === 'true' && { isFeatured: true }),
  }

  const [sermons, total] = await Promise.all([
    prisma.sermon.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        type: true,
        thumbnailUrl: true,
        videoUrl: true,
        audioUrl: true,
        duration: true,
        viewCount: true,
        isFeatured: true,
        publishedAt: true,
        status: true,
        speaker: { select: { id: true, name: true, avatarUrl: true } },
        series: { select: { id: true, title: true, slug: true } },
      },
    }),
    prisma.sermon.count({ where }),
  ])

  return NextResponse.json({
    data: sermons,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'MINISTER']
  if (!adminRoles.includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = sermonSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { speakerName, seriesTitle, speakerId: _speakerId, seriesId: _seriesId, ...rest } = parsed.data

  const [speakerId, seriesId] = await Promise.all([
    resolveSpeakerId(speakerName),
    resolveSeriesId(seriesTitle),
  ])

  const sermon = await prisma.sermon.create({
    data: {
      ...rest,
      videoUrl: rest.videoUrl || null,
      audioUrl: rest.audioUrl || null,
      speakerId: speakerId ?? undefined,
      seriesId: seriesId ?? undefined,
    },
  })

  return NextResponse.json({ data: sermon }, { status: 201 })
}
