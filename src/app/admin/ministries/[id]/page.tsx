import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminMinistryEditor } from '@/components/admin/MinistryEditor'

export const metadata: Metadata = { title: 'Edit Ministry | Admin' }

export default async function EditMinistryPage({ params }: { params: { id: string } }) {
  const ministry = await prisma.ministry.findUnique({
    where: { id: params.id },
    include: { leaders: true },
  })

  if (!ministry) notFound()

  return <AdminMinistryEditor ministry={ministry as Parameters<typeof AdminMinistryEditor>[0]['ministry']} />
}
