import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { generateSignedUploadParams } from '@/lib/cloudinary'
import { getCategory } from '@/lib/data/gallery-categories'

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { category } = await req.json().catch(() => ({}))
  if (!category || !getCategory(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  const params = await generateSignedUploadParams(`gallery/${category}`)
  return NextResponse.json(params)
}
