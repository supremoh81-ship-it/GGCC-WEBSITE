import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  slug: z.string().min(2).max(200).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(5000).optional(),
  audioUrl: z.string().url().optional().or(z.literal('')).or(z.null()),
  duration: z.number().int().positive().optional().or(z.null()),
  episodeNo: z.number().int().positive().optional().or(z.null()),
  seasonNo: z.number().int().positive().optional().or(z.null()),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  publishedAt: z.coerce.date().optional().or(z.null()),
})

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const episode = await prisma.podcastEpisode.findUnique({
    where: { id: params.id },
    include: { show: { select: { title: true, slug: true } } },
  })
  if (!episode) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ data: episode })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN', 'EDITOR'].includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const episode = await prisma.podcastEpisode.update({
    where: { id: params.id },
    data: { ...parsed.data, audioUrl: parsed.data.audioUrl || undefined },
  })

  return NextResponse.json({ data: episode })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.podcastEpisode.delete({ where: { id: params.id } })
  return NextResponse.json({ message: 'Episode deleted' })
}
