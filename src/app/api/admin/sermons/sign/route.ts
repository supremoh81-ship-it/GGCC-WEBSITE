import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { generateSignedUploadParams } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const { kind } = await req.json().catch(() => ({ kind: 'video' }))
  const folder = kind === 'thumbnail' ? 'sermons/thumbnails' : 'sermons/videos'

  const params = await generateSignedUploadParams(folder)
  return NextResponse.json(params)
}
