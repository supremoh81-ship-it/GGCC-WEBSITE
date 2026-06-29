import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { generateSignedUploadParams } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN', 'MINISTER'].includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { kind } = await req.json().catch(() => ({ kind: 'video' }))
  const folder = kind === 'thumbnail' ? 'sermons/thumbnails' : 'sermons/videos'

  const params = await generateSignedUploadParams(folder)
  return NextResponse.json(params)
}
