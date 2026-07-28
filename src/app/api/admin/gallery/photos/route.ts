import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { getCategory } from '@/lib/data/gallery-categories'
import { z } from 'zod'

const schema = z.object({
  category: z.string().min(1),
  publicId: z.string().min(1),
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  caption: z.string().max(300).optional(),
})

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const category = getCategory(parsed.data.category)
  if (!category) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  const album = await prisma.galleryAlbum.upsert({
    where: { slug: category.slug },
    update: {},
    create: { slug: category.slug, title: category.title, description: category.description, isPublic: true },
  })

  const photo = await prisma.galleryPhoto.create({
    data: {
      albumId: album.id,
      publicId: parsed.data.publicId,
      url: parsed.data.url,
      thumbnailUrl: parsed.data.thumbnailUrl,
      caption: parsed.data.caption,
    },
  })

  return NextResponse.json({ data: photo }, { status: 201 })
}
