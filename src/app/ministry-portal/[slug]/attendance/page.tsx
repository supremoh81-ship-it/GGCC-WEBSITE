'use client'

import { useState, useEffect } from 'react'
import { CalendarCheck, Plus, Loader2, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Session {
  id: string
  sessionDate: string
  sessionName: string | null
  memberCount: number
  guestCount: number
  notes: string | null
  createdAt: string
}

export default function AttendancePage({ params }: { params: { slug: string } }) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    sessionDate: new Date().toISOString().slice(0, 10),
    sessionName: '',
    memberCount: '',
    guestCount: '',
    notes: '',
  })

  useEffect(() => {
    fetch(`/api/ministry-portal/${params.slug}/attendance`)
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions ?? []))
      .finally(() => setLoading(false))
  }, [params.slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/ministry-portal/${params.slug}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionDate: form.sessionDate,
          sessionName: form.sessionName || null,
          memberCount: Number(form.memberCount) || 0,
          guestCount: Number(form.guestCount) || 0,
          notes: form.notes || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setSessions((prev) => [data.session, ...prev])
      setForm({ sessionDate: new Date().toISOString().slice(0, 10), sessionName: '', memberCount: '', guestCount: '', notes: '' })
      setShowForm(false)
      toast.success('Attendance recorded successfully.')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error saving attendance')
    } finally {
      setSaving(false)
    }
  }

  const totalMembers = sessions.reduce((s, a) => s + a.memberCount, 0)
  const totalGuests = sessions.reduce((s, a) => s + a.guestCount, 0)
  const avgAttendance = sessions.length > 0 ? Math.round((totalMembers + totalGuests) / sessions.length) : 0

  return (
    <div className="p-6 sm:p-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="text-xs text-text-muted tracking-widest uppercase mb-1">Ministry Unit</div>
          <h1 className="font-display font-bold text-white text-2xl sm:text-3xl flex items-center gap-3">
            <CalendarCheck className="h-7 w-7 text-brand-teal-light" />
            Attendance Tracker
          </h1>
          <p className="text-text-muted mt-1">Log attendance for each meeting or event session.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-gold flex items-center gap-2 shrink-0">
          <Plus className="h-4 w-4" />
          Log Session
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Sessions Logged', value: sessions.length, color: 'text-white' },
          { label: 'Avg Attendance', value: avgAttendance, color: 'text-brand-gold' },
          { label: 'Total Guests', value: totalGuests, color: 'text-brand-teal-light' },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-4 border border-white/8 text-center">
            <div className={`font-display font-bold text-2xl ${s.color}`}>{s.value}</div>
            <div className="text-xs text-text-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Log form */}
      {showForm && (
        <div className="glass-card rounded-2xl p-6 mb-8 border border-brand-gold/20">
          <h2 className="font-semibold text-white mb-4">Log a Session</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Session Date *</label>
                <input
                  type="date"
                  value={form.sessionDate}
                  onChange={(e) => setForm((f) => ({ ...f, sessionDate: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Session Name (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Weekly Meeting, Special Practice"
                  value={form.sessionName}
                  onChange={(e) => setForm((f) => ({ ...f, sessionName: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Members Present *</label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.memberCount}
                  onChange={(e) => setForm((f) => ({ ...f, memberCount: e.target.value }))}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Guests / First-timers</label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.guestCount}
                  onChange={(e) => setForm((f) => ({ ...f, guestCount: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Session Notes (optional)</label>
              <textarea
                rows={3}
                placeholder="Brief note about the session — topics covered, announcements, etc."
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-gold flex items-center gap-2 disabled:opacity-60">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Session
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sessions list */}
      <div className="glass-card rounded-2xl border border-white/8 overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-text-muted text-sm flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16 text-text-muted text-sm">
            No sessions logged yet. Click &quot;Log Session&quot; to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-text-muted text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Date</th>
                  <th className="text-left px-5 py-3">Session</th>
                  <th className="text-right px-5 py-3">Members</th>
                  <th className="text-right px-5 py-3">Guests</th>
                  <th className="text-right px-5 py-3">Total</th>
                  <th className="text-left px-5 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-b border-white/6 last:border-0 hover:bg-white/4 transition-colors">
                    <td className="px-5 py-3.5 text-text-muted whitespace-nowrap">
                      {format(new Date(s.sessionDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-5 py-3.5 text-white">{s.sessionName || <span className="text-white/40 italic">General Meeting</span>}</td>
                    <td className="px-5 py-3.5 text-right text-brand-gold font-semibold">{s.memberCount}</td>
                    <td className="px-5 py-3.5 text-right text-brand-teal-light">{s.guestCount}</td>
                    <td className="px-5 py-3.5 text-right text-white font-bold">{s.memberCount + s.guestCount}</td>
                    <td className="px-5 py-3.5 text-text-muted text-xs max-w-[200px] truncate">{s.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-white/8 text-xs text-text-muted flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-brand-gold" />
          {sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded
        </div>
      </div>
    </div>
  )
}
