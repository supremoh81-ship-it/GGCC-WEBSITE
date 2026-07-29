import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAdminToken } from '@/lib/admin-auth'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') ?? ''

  // Login page shares this layout but must not trigger an auth redirect.
  // The middleware already enforces access on every other admin route.
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const cookieStore = await cookies()
  const token = cookieStore.get('ggcc_admin')?.value

  if (!token || !(await verifyAdminToken(token))) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-brand-navy flex">
      <AdminSidebar />
      <main className="flex-1 ml-0 lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8 pt-20 lg:pt-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
