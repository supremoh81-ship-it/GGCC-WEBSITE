import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/Badge'
import { format } from 'date-fns'
import { Users } from 'lucide-react'

export const metadata: Metadata = { title: 'Users | Admin' }

const roleVariant = (role: string) => {
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') return 'danger' as const
  if (role === 'MINISTER') return 'gold' as const
  if (role === 'VOLUNTEER') return 'success' as const
  return 'muted' as const
}

export default async function AdminUsersPage() {
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        createdAt: true,
        emailVerified: true,
        _count: {
          select: {
            prayers: true,
            eventRegistrations: true,
            donations: true,
          },
        },
      },
    }),
    prisma.user.count(),
  ])

  const byRole = users.reduce<Record<string, number>>((acc, u) => {
    acc[u.role] = (acc[u.role] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-white">Users</h1>
          <p className="text-sm text-text-muted mt-0.5">{total} total members</p>
        </div>
      </div>

      {/* Role breakdown */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
        {Object.entries(byRole).map(([role, count]) => (
          <div key={role} className="glass-card rounded-xl p-3 text-center">
            <div className="text-lg font-bold text-white">{count}</div>
            <div className="text-[10px] text-text-muted capitalize mt-0.5">
              {role.replace('_', ' ').toLowerCase()}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Member</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden lg:table-cell">Email</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium">Role</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden md:table-cell">Prayers</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden md:table-cell">Events</th>
              <th className="text-left px-5 py-3 text-xs text-text-muted font-medium hidden lg:table-cell">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/3 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-gold text-xs font-bold">
                        {u.firstName[0]}{u.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">
                        {u.firstName} {u.lastName}
                      </div>
                      <div className="text-xs text-text-muted lg:hidden">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-text-muted text-xs hidden lg:table-cell">
                  {u.email}
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant={roleVariant(u.role)} className="text-[10px] capitalize">
                    {u.role.replace('_', ' ').toLowerCase()}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-text-muted text-xs hidden md:table-cell">
                  {u._count.prayers}
                </td>
                <td className="px-5 py-3.5 text-text-muted text-xs hidden md:table-cell">
                  {u._count.eventRegistrations}
                </td>
                <td className="px-5 py-3.5 text-text-muted text-xs hidden lg:table-cell">
                  {format(new Date(u.createdAt), 'MMM d, yyyy')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="py-16 text-center">
            <Users className="h-10 w-10 text-text-muted mx-auto mb-3" />
            <p className="text-text-muted text-sm">No members yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
