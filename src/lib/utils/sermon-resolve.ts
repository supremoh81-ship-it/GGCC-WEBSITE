import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils/slugify'

export async function resolveSpeakerId(name?: string | null) {
  if (!name) return null
  const slug = slugify(name)
  const speaker = await prisma.speaker.upsert({
    where: { slug },
    update: { name },
    create: { slug, name },
  })
  return speaker.id
}

export async function resolveSeriesId(title?: string | null) {
  if (!title) return null
  const slug = slugify(title)
  const series = await prisma.sermonSeries.upsert({
    where: { slug },
    update: { title },
    create: { slug, title },
  })
  return series.id
}
