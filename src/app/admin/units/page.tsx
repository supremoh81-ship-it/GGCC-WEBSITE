import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { UnitsAdmin } from '@/components/admin/UnitsAdmin'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Units | Admin' }

export default async function AdminUnitsPage() {
  const [members, reports] = await Promise.all([
    prisma.unitMember.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.unitReport.findMany({ orderBy: { activityDate: 'desc' } }),
  ])

  return (
    <UnitsAdmin
      initialMembers={members.map((m) => ({
        ...m,
        dateOfBirth: m.dateOfBirth.toISOString(),
        createdAt: m.createdAt.toISOString(),
      }))}
      initialReports={reports.map((r) => ({
        ...r,
        activityDate: r.activityDate.toISOString(),
        createdAt: r.createdAt.toISOString(),
      }))}
    />
  )
}
