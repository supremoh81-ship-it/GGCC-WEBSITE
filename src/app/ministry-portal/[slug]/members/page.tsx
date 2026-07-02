'use client'

import { useState, useEffect } from 'react'
import { Users, UserPlus, Trash2, Search, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Member {
  userId: string
  role: string | null
  joinedAt: string
  user: { firstName: string; lastName: string; email: string; phone: string | null; avatarUrl: string | null }
}

export default function MembersPage({ params }: { params: { slug: string } }) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [addEmail, setAddEmail] = useState('')
  const [addRole, setAddRole] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetch(`/api/ministry-portal/${params.slug}/members`)
      .then((r) => r.json())
      .then((d) => setMembers(d.members ?? []))
      .finally(() => setLoading(false))
  }, [params.slug])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addEmail.trim()) return
    setAdding(true)
    try {
      const res = await fetch(`/api/ministry-portal/${params.slug}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: addEmail.trim(), role: addRole.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setMembers((prev) => [data.member, ...prev])
      setAddEmail('')
      setAddRole('')
      toast.success('Member added successfully.')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error adding member')
    } finally {
      setAdding(false)
    }
  }

  const handleRemove = async (userId: string, name: string) => {
    if (!confirm(`Remove ${name} from this ministry unit?`)) return
    try {
      const res = await fetch(`/api/ministry-portal/${params.slug}/members`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (!res.ok) throw new Error('Failed to remove')
      setMembers((prev) => prev.filter((m) => m.userId !== userId))
      toast.success(`${name} removed.`)
    } catch {
      toast.error('Error removing member')
    }
  }

  const filtered = members.filter((m) => {
    const q = search.toLowerCase()
    return (
      m.user.firstName.toLowerCase().includes(q) ||
      m.user.lastName.toLowerCase().includes(q) ||
      m.user.email.toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-6 sm:p-10">
      <div className="mb-8">
        <div className="text-xs text-text-muted tracking-widest uppercase mb-1">Ministry Unit</div>
        <h1 className="font-display font-bold text-white text-2xl sm:text-3xl flex items-center gap-3">
          <Users className="h-7 w-7 text-brand-gold" />
          Member List
        </h1>
        <p className="text-text-muted mt-1">Manage who belongs to your ministry unit.</p>
      </div>

      {/* Add member form */}
      <div className="glass-card rounded-2xl p-6 mb-8 border border-white/8">
        <h2 className="font-semibold text-white mb-4 text-sm">Add a Member</h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Member email address"
            value={addEmail}
            onChange={(e) => setAddEmail(e.target.value)}
            required
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
          <input
            type="text"
            placeholder="Role (e.g. Vocalist, Usher) — optional"
            value={addRole}
            onChange={(e) => setAddRole(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
          <button
            type="submit"
            disabled={adding}
            className="btn-gold shrink-0 flex items-center gap-2 disabled:opacity-60"
          >
            <UserPlus className="h-4 w-4" />
            {adding ? 'Adding...' : 'Add Member'}
          </button>
        </form>
        <p className="text-xs text-text-muted mt-2">
          The member must already have a GGCC account. Enter their registered email address.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
        <input
          type="search"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 max-w-sm"
        />
      </div>

      {/* Members table */}
      <div className="glass-card rounded-2xl border border-white/8 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-text-muted text-sm">Loading members...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-text-muted text-sm">
            {members.length === 0 ? 'No members yet. Add the first member above.' : 'No members match your search.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Name</th>
                  <th className="text-left px-5 py-3">Email</th>
                  <th className="text-left px-5 py-3">Role in Unit</th>
                  <th className="text-left px-5 py-3">Joined</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const name = `${m.user.firstName} ${m.user.lastName}`
                  return (
                    <tr key={m.userId} className="border-b border-white/6 last:border-0 hover:bg-white/4 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {m.user.avatarUrl ? (
                            <img src={m.user.avatarUrl} alt={name} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center text-xs font-bold text-brand-gold">
                              {m.user.firstName.charAt(0)}
                            </div>
                          )}
                          <span className="text-white font-medium">{name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-text-muted">{m.user.email}</td>
                      <td className="px-5 py-3.5 text-text-muted">{m.role || <span className="text-white/25 italic">General</span>}</td>
                      <td className="px-5 py-3.5 text-text-muted">{format(new Date(m.joinedAt), 'MMM d, yyyy')}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => handleRemove(m.userId, name)}
                          className="text-red-400/60 hover:text-red-400 transition-colors"
                          title="Remove from unit"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-white/8 text-xs text-text-muted flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-brand-gold" />
          {members.length} member{members.length !== 1 ? 's' : ''} in this unit
        </div>
      </div>
    </div>
  )
}
