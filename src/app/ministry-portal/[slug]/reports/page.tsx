'use client'

import { useState, useEffect } from 'react'
import { FileText, Send, CheckCircle2, Clock, Loader2, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Report {
  id: string
  month: number
  year: number
  memberCount: number | null
  highlights: string | null
  challenges: string | null
  prayerPoints: string | null
  goalsNextMonth: string | null
  status: string
  reviewNote: string | null
  createdAt: string
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function ReportsPage({ params }: { params: { slug: string } }) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const now = new Date()
  const [form, setForm] = useState({
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    memberCount: '',
    highlights: '',
    challenges: '',
    prayerPoints: '',
    goalsNextMonth: '',
  })

  useEffect(() => {
    fetch(`/api/ministry-portal/${params.slug}/reports`)
      .then((r) => r.json())
      .then((d) => setReports(d.reports ?? []))
      .finally(() => setLoading(false))
  }, [params.slug])

  const currentMonthReport = reports.find(
    (r) => r.month === now.getMonth() + 1 && r.year === now.getFullYear()
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`/api/ministry-portal/${params.slug}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: form.month,
          year: form.year,
          memberCount: Number(form.memberCount) || null,
          highlights: form.highlights || null,
          challenges: form.challenges || null,
          prayerPoints: form.prayerPoints || null,
          goalsNextMonth: form.goalsNextMonth || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setReports((prev) => {
        const filtered = prev.filter((r) => !(r.month === data.report.month && r.year === data.report.year))
        return [data.report, ...filtered].sort((a, b) => b.year - a.year || b.month - a.month)
      })
      setShowForm(false)
      toast.success('Monthly report submitted successfully.')
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error submitting report')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 sm:p-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="text-xs text-text-muted tracking-widest uppercase mb-1">Ministry Unit</div>
          <h1 className="font-display font-bold text-white text-2xl sm:text-3xl flex items-center gap-3">
            <FileText className="h-7 w-7 text-brand-magenta-light" />
            Monthly Reports
          </h1>
          <p className="text-text-muted mt-1">Submit your monthly update to leadership.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-gold flex items-center gap-2 shrink-0">
          <Send className="h-4 w-4" />
          {currentMonthReport ? 'Update This Month' : 'Submit Report'}
        </button>
      </div>

      {/* Status banner */}
      {currentMonthReport ? (
        <div className="flex items-center gap-3 bg-green-400/10 border border-green-400/20 rounded-2xl px-5 py-4 mb-8">
          <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-white">
              {MONTHS[currentMonthReport.month - 1]} {currentMonthReport.year} report submitted
            </div>
            <div className="text-xs text-text-muted">
              Status: <span className="text-green-400">{currentMonthReport.status}</span>
              {currentMonthReport.reviewNote && ` · Leadership note: ${currentMonthReport.reviewNote}`}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-amber-400/10 border border-amber-400/20 rounded-2xl px-5 py-4 mb-8">
          <Clock className="h-5 w-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-white">
              {MONTHS[now.getMonth()]} {now.getFullYear()} report is pending
            </div>
            <div className="text-xs text-text-muted">
              Please submit your monthly report by the end of the month.
            </div>
          </div>
        </div>
      )}

      {/* Report form */}
      {showForm && (
        <div className="glass-card rounded-2xl p-6 mb-8 border border-brand-gold/20">
          <h2 className="font-semibold text-white mb-5">
            Monthly Report — {MONTHS[form.month - 1]} {form.year}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Month</label>
                <div className="relative">
                  <select
                    value={form.month}
                    onChange={(e) => setForm((f) => ({ ...f, month: Number(e.target.value) }))}
                    className="w-full appearance-none px-4 py-2.5 pr-8 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                  >
                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Year</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1.5 block">Current Member Count</label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 32"
                  value={form.memberCount}
                  onChange={(e) => setForm((f) => ({ ...f, memberCount: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Highlights this month</label>
              <textarea
                rows={3}
                placeholder="What went well? Achievements, testimonies, special events..."
                value={form.highlights}
                onChange={(e) => setForm((f) => ({ ...f, highlights: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Challenges faced</label>
              <textarea
                rows={3}
                placeholder="Any difficulties, attendance issues, resource needs, or concerns to report..."
                value={form.challenges}
                onChange={(e) => setForm((f) => ({ ...f, challenges: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Prayer points</label>
              <textarea
                rows={3}
                placeholder="Specific things leadership and the church should pray for regarding your unit..."
                value={form.prayerPoints}
                onChange={(e) => setForm((f) => ({ ...f, prayerPoints: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-text-muted mb-1.5 block">Goals for next month</label>
              <textarea
                rows={3}
                placeholder="Plans, targets, upcoming activities, or improvement goals for next month..."
                value={form.goalsNextMonth}
                onChange={(e) => setForm((f) => ({ ...f, goalsNextMonth: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/40 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-gold flex items-center gap-2 disabled:opacity-60">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {saving ? 'Submitting...' : 'Submit Report'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Past reports */}
      <div className="space-y-4">
        {loading ? (
          <div className="glass-card rounded-2xl p-8 text-center text-text-muted text-sm flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center text-text-muted text-sm border border-white/8">
            No reports submitted yet. Use the button above to submit your first monthly report.
          </div>
        ) : (
          reports.map((r) => (
            <div key={r.id} className="glass-card rounded-2xl p-6 border border-white/8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white">
                  {MONTHS[r.month - 1]} {r.year}
                </h3>
                <span className={`text-xs px-2.5 py-1 rounded-full ${
                  r.status === 'REVIEWED' || r.status === 'ACKNOWLEDGED'
                    ? 'bg-green-400/10 text-green-400'
                    : 'bg-amber-400/10 text-amber-400'
                }`}>
                  {r.status === 'SUBMITTED' ? 'Awaiting Review' : r.status}
                </span>
              </div>
              {r.memberCount !== null && (
                <div className="text-xs text-text-muted mb-3">Members: <span className="text-brand-gold font-semibold">{r.memberCount}</span></div>
              )}
              {r.highlights && (
                <div className="mb-3">
                  <div className="text-xs text-brand-gold uppercase tracking-wider mb-1">Highlights</div>
                  <p className="text-sm text-text-secondary whitespace-pre-wrap">{r.highlights}</p>
                </div>
              )}
              {r.challenges && (
                <div className="mb-3">
                  <div className="text-xs text-amber-400 uppercase tracking-wider mb-1">Challenges</div>
                  <p className="text-sm text-text-secondary whitespace-pre-wrap">{r.challenges}</p>
                </div>
              )}
              {r.prayerPoints && (
                <div className="mb-3">
                  <div className="text-xs text-brand-magenta-light uppercase tracking-wider mb-1">Prayer Points</div>
                  <p className="text-sm text-text-secondary whitespace-pre-wrap">{r.prayerPoints}</p>
                </div>
              )}
              {r.goalsNextMonth && (
                <div className="mb-3">
                  <div className="text-xs text-brand-teal-light uppercase tracking-wider mb-1">Goals Next Month</div>
                  <p className="text-sm text-text-secondary whitespace-pre-wrap">{r.goalsNextMonth}</p>
                </div>
              )}
              {r.reviewNote && (
                <div className="mt-4 pt-4 border-t border-white/8">
                  <div className="text-xs text-text-muted mb-1">Leadership Response:</div>
                  <p className="text-sm text-white italic">&ldquo;{r.reviewNote}&rdquo;</p>
                </div>
              )}
              <div className="text-xs text-text-muted mt-4">
                Submitted {format(new Date(r.createdAt), 'MMMM d, yyyy')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
