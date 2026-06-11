import slugifyLib from 'slugify'

export function slugify(text: string): string {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  })
}

export function generateUniqueSlug(base: string, suffix?: string): string {
  const slug = slugify(base)
  if (suffix) return `${slug}-${suffix}`
  return slug
}
