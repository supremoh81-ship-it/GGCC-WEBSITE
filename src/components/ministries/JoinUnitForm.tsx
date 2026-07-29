'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, AlertCircle, Lock } from 'lucide-react'
import { ALL_MINISTRIES } from '@/lib/data/ministries'

interface Props {
  slug: string
  name: string
  color: string
}

export function JoinUnitForm({ slug, name, color }: Props) {
  const ministry = ALL_MINISTRIES.find((m) => m.slug === slug)
  const Icon = ministry?.icon

  const [form, setForm] = useState({
    fullName: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    reasonForJoining: '',
    salvationExperience: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  function validate() {
    const e: Record<string, string> = {}
    if (!form.fullName.trim() || form.fullName.trim().length < 2) e.fullName = 'Full name is required'
    if (!form.dateOfBirth) e.dateOfBirth = 'Date of birth is required'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.reasonForJoining.trim() || form.reasonForJoining.trim().length < 10)
      e.reasonForJoining = 'Please write at least a sentence or two'
    if (!form.salvationExperience.trim() || form.salvationExperience.trim().length < 10)
      e.salvationExperience = 'Please share your salvation experience'
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
      const res = await fetch('/api/units/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unitName: name, ...form }),
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
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: `${color}18`, border: `1px solid ${color}35` }}
            >
              <CheckCircle2 className="h-8 w-8" style={{ color }} />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-3">Application Received!</h1>
            <p className="text-text-muted leading-relaxed mb-2">
              Thank you, <span className="text-white font-semibold">{form.fullName}</span>. Your application
              to join the <span className="text-white font-semibold">{name}</span> has been submitted.
            </p>
            <p className="text-text-muted text-sm mb-8">
              A leader from the unit will reach out to you soon. God bless you!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/ministries" className="btn-gold text-sm">View All Units</Link>
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
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${color}18`, border: `1px solid ${color}35` }}
            >
              {Icon && <Icon className="h-7 w-7" style={{ color }} />}
            </div>
            <div>
              <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-0.5">Unit Application</p>
              <h1 className="font-display text-2xl font-bold text-white">{name}</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-2xl">
          <form onSubmit={handleSubmit} noValidate>
            <div className="glass-card rounded-2xl overflow-hidden border border-brand-gold/15">
              <div className="h-[2px] bg-gradient-regal" />
              <div className="p-7 space-y-6">

                {/* Locked unit field */}
                <div>
                  <label className="field-label">Joining</label>
                  <div className="input-base flex items-center gap-2 opacity-70 pointer-events-none">
                    <Lock className="h-3.5 w-3.5 text-text-muted shrink-0" />
                    <span className="text-white text-sm">{name}</span>
                  </div>
                </div>

                <Field label="Full Name" required error={errors.fullName}>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => set('fullName', e.target.value)}
                    placeholder="Your full name"
                    className={`input-base ${errors.fullName ? 'border-red-500/60' : ''}`}
                  />
                </Field>

                <Field label="Date of Birth" required error={errors.dateOfBirth}>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => set('dateOfBirth', e.target.value)}
                    max={new Date().toISOString().slice(0, 10)}
                    className={`input-base ${errors.dateOfBirth ? 'border-red-500/60' : ''}`}
                  />
                </Field>

                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Phone" optional>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="input-base"
                    />
                  </Field>
                  <Field label="Email" optional error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      placeholder="you@email.com"
                      className={`input-base ${errors.email ? 'border-red-500/60' : ''}`}
                    />
                  </Field>
                </div>

                <Field label="Why do you want to join this unit?" required error={errors.reasonForJoining}>
                  <textarea
                    value={form.reasonForJoining}
                    onChange={(e) => set('reasonForJoining', e.target.value)}
                    placeholder="Share what draws you to this ministry..."
                    rows={4}
                    className={`input-base resize-none ${errors.reasonForJoining ? 'border-red-500/60' : ''}`}
                  />
                </Field>

                <Field label="Share your salvation experience" required error={errors.salvationExperience}>
                  <textarea
                    value={form.salvationExperience}
                    onChange={(e) => set('salvationExperience', e.target.value)}
                    placeholder="When and how did you give your life to Christ?"
                    rows={4}
                    className={`input-base resize-none ${errors.salvationExperience ? 'border-red-500/60' : ''}`}
                  />
                </Field>

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
                    'Submit Application'
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

function Field({
  label, required, optional, error, children,
}: {
  label: string
  required?: boolean
  optional?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="field-label">
        {label}{' '}
        {required && <span className="text-brand-gold">*</span>}
        {optional && <span className="text-text-muted text-[10px]">(optional)</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}
