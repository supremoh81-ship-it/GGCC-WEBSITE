import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login?callbackUrl=/admin')

  const role = session.user.role as string
  if (!['ADMIN', 'SUPER_ADMIN', 'MINISTER'].includes(role)) {
    redirect('/403')
  }

  return (
    <div className="min-h-screen bg-brand-navy flex">
      <AdminSidebar role={role} />
      <main className="flex-1 ml-0 lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8 pt-20 lg:pt-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
