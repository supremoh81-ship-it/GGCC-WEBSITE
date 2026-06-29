import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { generateSignedUploadParams } from '@/lib/cloudinary'
import { getCategory } from '@/lib/data/gallery-categories'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN', 'MINISTER'].includes(session.user.role as string)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { category } = await req.json().catch(() => ({}))
  if (!category || !getCategory(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  const params = await generateSignedUploadParams(`gallery/${category}`)
  return NextResponse.json(params)
}
