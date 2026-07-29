'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, AlertCircle, FileText } from 'lucide-react'
import { ALL_MINISTRIES } from '@/lib/data/ministries'
import type { Metadata } from 'next'

const UNIT_NAMES = ALL_MINISTRIES.map((m) => m.name)

export default function SubmitReportPage() {
  const [form, setForm] = useState({
    unitName: '',
    memberName: '',
    reportText: '',
    activityDate: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  function validate() {
    const e: Record<string, string> = {}
    if (!form.unitName) e.unitName = 'Please select your unit'
    if (!form.memberName.trim() || form.memberName.trim().length < 2) e.memberName = 'Your name is required'
    if (!form.reportText.trim() || form.reportText.trim().length < 10)
      e.reportText = 'Please provide a meaningful report (at least a few sentences)'
    if (!form.activityDate) e.activityDate = 'Activity date is required'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return
    if (status === 'submitting') return

    setStatus('submitting')
    setServerError('')

    try {
      const res = await fetch('/api/units/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        setServerError(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setServerError('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => { const n = { ...e }; delete n[field]; return n })
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-brand-navy pt-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="glass-card rounded-3xl p-10 border border-brand-gold/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-regal" />
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-brand-gold/10 border border-brand-gold/30">
              <CheckCircle2 className="h-8 w-8 text-brand-gold" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-3">Report Submitted!</h1>
            <p className="text-text-muted leading-relaxed mb-2">
              Thank you, <span className="text-white font-semibold">{form.memberName}</span>. Your report for
              the <span className="text-white font-semibold">{form.unitName}</span> has been received.
            </p>
            <p className="text-text-muted text-sm mb-8">
              Church leadership can now review this. Thank you for your faithful service!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setForm({ unitName: '', memberName: '', reportText: '', activityDate: '' })
                  setStatus('idle')
                }}
                className="btn-gold text-sm"
              >
                Submit Another
              </button>
              <Link href="/" className="btn-outline text-sm">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-navy pt-24">
      {/* Hero */}
      <section className="section-padding-sm bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-dots opacity-25 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-2xl relative">
          <Link
            href="/ministries"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-brand-gold transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All Ministries
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 bg-brand-gold/10 border border-brand-gold/25">
              <FileText className="h-7 w-7 text-brand-gold" />
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-0.5">Unit Reports</p>
              <h1 className="font-display text-2xl font-bold text-white">Submit Activity Report</h1>
            </div>
          </div>
          <p className="text-text-muted text-sm mt-3 max-w-lg">
            Use this form to report on your unit's recent activities. These reports help leadership stay
            informed and celebrate what God is doing across every ministry.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-2xl">
          <form onSubmit={handleSubmit} noValidate>
            <div className="glass-card rounded-2xl overflow-hidden border border-brand-gold/15">
              <div className="h-[2px] bg-gradient-regal" />
              <div className="p-7 space-y-6">

                {/* Unit select */}
                <div>
                  <label className="field-label">
                    Your Unit <span className="text-brand-gold">*</span>
                  </label>
                  <select
                    value={form.unitName}
                    onChange={(e) => set('unitName', e.target.value)}
                    className={`input-base ${errors.unitName ? 'border-red-500/60' : ''}`}
                  >
                    <option value="">Select your ministry unit...</option>
                    {UNIT_NAMES.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                  {errors.unitName && <FieldError msg={errors.unitName} />}
                </div>

                {/* Member name */}
                <div>
                  <label className="field-label">
                    Your Full Name <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.memberName}
                    onChange={(e) => set('memberName', e.target.value)}
                    placeholder="Your name"
                    className={`input-base ${errors.memberName ? 'border-red-500/60' : ''}`}
                  />
                  {errors.memberName && <FieldError msg={errors.memberName} />}
                </div>

                {/* Activity date */}
                <div>
                  <label className="field-label">
                    Date of Activity <span className="text-brand-gold">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.activityDate}
                    onChange={(e) => set('activityDate', e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                    className={`input-base ${errors.activityDate ? 'border-red-500/60' : ''}`}
                  />
                  {errors.activityDate && <FieldError msg={errors.activityDate} />}
                </div>

                {/* Report text */}
                <div>
                  <label className="field-label">
                    Report on Activity <span className="text-brand-gold">*</span>
                  </label>
                  <textarea
                    value={form.reportText}
                    onChange={(e) => set('reportText', e.target.value)}
                    placeholder="Describe what happened, how many attended, key highlights, any challenges, and praise points..."
                    rows={7}
                    className={`input-base resize-none ${errors.reportText ? 'border-red-500/60' : ''}`}
                  />
                  {errors.reportText && <FieldError msg={errors.reportText} />}
                </div>

                {status === 'error' && serverError && (
                  <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3">
                    <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-400">{serverError}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-gold w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'submitting' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-brand-navy/40 border-t-brand-navy rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {msg}
    </p>
  )
}
