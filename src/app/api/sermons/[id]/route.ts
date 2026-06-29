import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { resolveSpeakerId, resolveSeriesId } from '@/lib/utils/sermon-resolve'

const updateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(500).optional(),
  body: z.string().optional(),
  scriptureRef: z.string().max(100).optional().or(z.null()),
  type: z.enum(['VIDEO', 'AUDIO', 'NOTES_ONLY']).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  videoUrl: z.string().url().optional().or(z.literal('')).or(z.null()),
  audioUrl: z.string().url().optional().or(z.literal('')).or(z.null()),
  duration: z.number().int().positive().optional().or(z.null()),
  thumbnailUrl: z.string().url().optional().or(z.literal('')).or(z.null()),
  speakerId: z.string().cuid().optional().or(z.null()),
  seriesId: z.string().cuid().optional().or(z.null()),
  speakerName: z.string().max(150).optional().or(z.literal('')),
  seriesTitle: z.string().max(150).optional().or(z.literal('')),
  isFeatured: z.boolean().optional(),
  publishedAt: z.preprocess((v) => (v === '' ? undefined : v), z.coerce.date().optional().or(z.null())),
})

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const sermon = await prisma.sermon.findUnique({
      where: { id: params.id },
      include: { speaker: true, series: true },
    })
    if (!sermon) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: sermon })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { speakerName, seriesTitle, speakerId: _speakerId, seriesId: _seriesId, ...data } = updateSchema.parse(body)

    const [speakerId, seriesId] = await Promise.all([
      speakerName !== undefined ? resolveSpeakerId(speakerName) : undefined,
      seriesTitle !== undefined ? resolveSeriesId(seriesTitle) : undefined,
    ])

    const cleanData = {
      ...data,
      videoUrl: data.videoUrl || null,
      audioUrl: data.audioUrl || null,
      thumbnailUrl: data.thumbnailUrl || null,
      ...(speakerId !== undefined ? { speakerId } : {}),
      ...(seriesId !== undefined ? { seriesId } : {}),
    }

    const sermon = await prisma.sermon.update({
      where: { id: params.id },
      data: cleanData,
    })

    return NextResponse.json({ data: sermon })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', issues: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.sermon.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Sermon deleted' })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
