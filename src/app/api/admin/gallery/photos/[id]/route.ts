import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { prisma } from '@/lib/prisma'
import { deleteCloudinaryAsset } from '@/lib/cloudinary'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const denied = await requireAdmin(req)
  if (denied) return denied

  const photo = await prisma.galleryPhoto.findUnique({ where: { id: params.id } })
  if (!photo) {
    return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
  }

  await prisma.galleryPhoto.delete({ where: { id: params.id } })

  if (photo.publicId) {
    await deleteCloudinaryAsset(photo.publicId).catch(() => {})
  }

  return NextResponse.json({ success: true })
}
