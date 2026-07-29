'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { Download, Users, FileText, CheckCircle2, Clock, Filter } from 'lucide-react'
import { ALL_MINISTRIES } from '@/lib/data/ministries'
import { Badge } from '@/components/ui/Badge'

type MemberRow = {
  id: string
  unitName: string
  fullName: string
  dateOfBirth: string
  phone: string | null
  email: string | null
  reasonForJoining: string
  salvationExperience: string
  status: 'PENDING' | 'APPROVED'
  createdAt: string
}

type ReportRow = {
  id: string
  unitName: string
  memberName: string
  reportText: string
  activityDate: string
  reportMonth: string
  createdAt: string
}

interface Props {
  initialMembers: MemberRow[]
  initialReports: ReportRow[]
}

const UNIT_NAMES = ['All Units', ...ALL_MINISTRIES.map((m) => m.name)]

function csvEscape(v: string | null | undefined) {
  const s = (v ?? '').replace(/"/g, '""')
  return `"${s}"`
}

function downloadCsv(rows: string[][], filename: string) {
  const BOM = '﻿'
  const content = BOM + rows.map((r) => r.map(csvEscape).join(',')).join('\r\n')
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function UnitsAdmin({ initialMembers, initialReports }: Props) {
  const [tab, setTab] = useState<'members' | 'reports'>('members')
  const [unitFilter, setUnitFilter] = useState('All Units')
  const [statusFilter, setStatusFilter] = useState<'All' | 'PENDING' | 'APPROVED'>('All')
  const [monthFilter, setMonthFilter] = useState('')
  const [members, setMembers] = useState(initialMembers)
  const [approving, setApproving] = useState<string | null>(null)

  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      if (unitFilter !== 'All Units' && m.unitName !== unitFilter) return false
      if (statusFilter !== 'All' && m.status !== statusFilter) return false
      return true
    })
  }, [members, unitFilter, statusFilter])

  const filteredReports = useMemo(() => {
    return initialReports.filter((r) => {
      if (unitFilter !== 'All Units' && r.unitName !== unitFilter) return false
      if (monthFilter && r.reportMonth !== monthFilter) return false
      return true
    })
  }, [initialReports, unitFilter, monthFilter])

  const availableMonths = useMemo(() => {
    const months = [...new Set(initialReports.map((r) => r.reportMonth))].sort().reverse()
    return months
  }, [initialReports])

  const pendingCount = members.filter((m) => m.status === 'PENDING').length

  async function approve(id: string) {
    setApproving(id)
    try {
      const res = await fetch(`/api/admin/units/members/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      })
      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) => m.id === id ? { ...m, status: 'APPROVED' } : m)
        )
      }
    } finally {
      setApproving(null)
    }
  }

  function downloadMembers() {
    const header = ['Unit', 'Full Name', 'Date of Birth', 'Phone', 'Email', 'Reason for Joining', 'Salvation Experience', 'Status', 'Applied']
    const rows = [header, ...filteredMembers.map((m) => [
      m.unitName,
      m.fullName,
      format(new Date(m.dateOfBirth), 'yyyy-MM-dd'),
      m.phone ?? '',
      m.email ?? '',
      m.reasonForJoining,
      m.salvationExperience,
      m.status,
      format(new Date(m.createdAt), 'yyyy-MM-dd'),
    ])]
    const unit = unitFilter === 'All Units' ? 'all' : unitFilter.toLowerCase().replace(/\s+/g, '-')
    downloadCsv(rows, `ggcc-${unit}-members-${format(new Date(), 'yyyy-MM')}.csv`)
  }

  function downloadReports() {
    const header = ['Unit', 'Member Name', 'Activity Date', 'Month', 'Report']
    const rows = [header, ...filteredReports.map((r) => [
      r.unitName,
      r.memberName,
      format(new Date(r.activityDate), 'yyyy-MM-dd'),
      r.reportMonth,
      r.reportText,
    ])]
    const unit = unitFilter === 'All Units' ? 'all' : unitFilter.toLowerCase().replace(/\s+/g, '-')
    const month = monthFilter || format(new Date(), 'yyyy-MM')
    downloadCsv(rows, `ggcc-${unit}-reports-${month}.csv`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-white">Units</h1>
          <p className="text-sm text-text-muted mt-0.5">
            {members.length} applications &bull;{' '}
            {pendingCount > 0 && (
              <span className="text-amber-400">{pendingCount} pending approval</span>
            )}
            {pendingCount === 0 && <span>all reviewed</span>}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-brand-blue/50 rounded-xl p-1 w-fit border border-white/8">
        <TabBtn active={tab === 'members'} onClick={() => setTab('members')} icon={<Users className="h-3.5 w-3.5" />} label={`Applications (${members.length})`} />
        <TabBtn active={tab === 'reports'} onClick={() => setTab('reports')} icon={<FileText className="h-3.5 w-3.5" />} label={`Reports (${initialReports.length})`} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-text-muted" />
          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="text-xs bg-brand-blue border border-white/10 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-gold/40"
          >
            {UNIT_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        {tab === 'members' && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="text-xs bg-brand-blue border border-white/10 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-gold/40"
          >
            <option value="All">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
          </select>
        )}

        {tab === 'reports' && availableMonths.length > 0 && (
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="text-xs bg-brand-blue border border-white/10 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-gold/40"
          >
            <option value="">All Months</option>
            {availableMonths.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        )}

        <button
          onClick={tab === 'members' ? downloadMembers : downloadReports}
          className="ml-auto flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-gold-light border border-brand-gold/30 rounded-lg px-3 py-1.5 hover:bg-brand-gold/10 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Download CSV
        </button>
      </div>

      {/* Members table */}
      {tab === 'members' && (
        <div className="glass-card rounded-2xl overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-white/8">
                {['Unit', 'Name', 'DOB', 'Phone', 'Email', 'Reason', 'Salvation Experience', 'Status', 'Applied', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-text-muted font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 text-white text-xs font-medium whitespace-nowrap">{m.unitName}</td>
                  <td className="px-4 py-3 text-white text-xs whitespace-nowrap">{m.fullName}</td>
                  <td className="px-4 py-3 text-text-muted text-xs whitespace-nowrap">{format(new Date(m.dateOfBirth), 'dd MMM yyyy')}</td>
                  <td className="px-4 py-3 text-text-muted text-xs">{m.phone ?? '-'}</td>
                  <td className="px-4 py-3 text-text-muted text-xs">{m.email ?? '-'}</td>
                  <td className="px-4 py-3 text-text-muted text-xs max-w-[200px]">
                    <span className="line-clamp-2">{m.reasonForJoining}</span>
                  </td>
                  <td className="px-4 py-3 text-text-muted text-xs max-w-[200px]">
                    <span className="line-clamp-2">{m.salvationExperience}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={m.status === 'APPROVED' ? 'success' : 'gold'} className="text-[10px] whitespace-nowrap">
                      {m.status === 'APPROVED' ? <CheckCircle2 className="h-2.5 w-2.5 inline mr-1" /> : <Clock className="h-2.5 w-2.5 inline mr-1" />}
                      {m.status.toLowerCase()}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-text-muted text-xs whitespace-nowrap">{format(new Date(m.createdAt), 'dd MMM yyyy')}</td>
                  <td className="px-4 py-3">
                    {m.status === 'PENDING' && (
                      <button
                        onClick={() => approve(m.id)}
                        disabled={approving === m.id}
                        className="text-xs text-brand-gold border border-brand-gold/30 rounded-lg px-3 py-1 hover:bg-brand-gold/10 transition-colors disabled:opacity-40 whitespace-nowrap"
                      >
                        {approving === m.id ? 'Saving...' : 'Approve'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMembers.length === 0 && (
            <div className="py-14 text-center text-text-muted text-sm">No applications match the current filters.</div>
          )}
        </div>
      )}

      {/* Reports table */}
      {tab === 'reports' && (
        <div className="glass-card rounded-2xl overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-white/8">
                {['Unit', 'Member', 'Activity Date', 'Month', 'Report'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-text-muted font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredReports.map((r) => (
                <tr key={r.id} className="hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 text-white text-xs font-medium whitespace-nowrap">{r.unitName}</td>
                  <td className="px-4 py-3 text-text-muted text-xs whitespace-nowrap">{r.memberName}</td>
                  <td className="px-4 py-3 text-text-muted text-xs whitespace-nowrap">{format(new Date(r.activityDate), 'dd MMM yyyy')}</td>
                  <td className="px-4 py-3 text-text-muted text-xs">{r.reportMonth}</td>
                  <td className="px-4 py-3 text-text-muted text-xs max-w-sm">
                    <span className="line-clamp-3 whitespace-pre-wrap">{r.reportText}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredReports.length === 0 && (
            <div className="py-14 text-center text-text-muted text-sm">No reports match the current filters.</div>
          )}
        </div>
      )}
    </div>
  )
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
        active
          ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/25'
          : 'text-text-muted hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
