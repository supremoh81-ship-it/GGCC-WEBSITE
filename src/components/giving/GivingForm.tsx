'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Gift, RefreshCw, Lock } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { toast } from 'sonner'

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  amount: z.number().min(1, 'Minimum gift is $1'),
  fund: z.string().min(1),
  frequency: z.enum(['ONE_TIME', 'WEEKLY', 'MONTHLY', 'ANNUALLY']),
  coverFees: z.boolean().default(false),
  isAnonymous: z.boolean().default(false),
  note: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const presetAmounts = [25, 50, 100, 250, 500]
const funds = ['General Fund', 'Building Project', 'Missions & Outreach', 'Scholarship Fund']

export function GivingForm() {
  const [activeTab, setActiveTab] = useState<'ONE_TIME' | 'MONTHLY'>('ONE_TIME')
  const [customAmount, setCustomAmount] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50)
  const [step, setStep] = useState<'amount' | 'details' | 'success'>('amount')

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: 50,
      fund: 'General Fund',
      frequency: 'ONE_TIME',
      coverFees: false,
      isAnonymous: false,
    },
  })

  const coverFees = watch('coverFees')
  const amount = watch('amount')

  const handlePreset = (val: number) => {
    setSelectedAmount(val)
    setCustomAmount(false)
    setValue('amount', val)
  }

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch('/api/giving/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStep('success')
    } catch {
      toast.error('Payment processing unavailable. Please try again.')
    }
  }

  if (step === 'success') {
    return (
      <div className="glass-card rounded-3xl p-10 text-center" style={{ border: '1px solid rgba(201, 168, 76, 0.3)' }}>
        <div className="w-16 h-16 rounded-full bg-brand-gold/15 flex items-center justify-center mx-auto mb-5">
          <Gift className="h-8 w-8 text-brand-gold" />
        </div>
        <h3 className="font-display font-bold text-white text-2xl mb-3">Thank You for Your Gift!</h3>
        <p className="text-text-muted max-w-sm mx-auto mb-6">
          Your generosity is making a real difference. A receipt will be sent to your email shortly.
        </p>
        <button onClick={() => setStep('amount')} className="btn-outline-gold">
          Give Again
        </button>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-3xl overflow-hidden" style={{ border: '1px solid rgba(201, 168, 76, 0.3)' }}>
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {(['ONE_TIME', 'MONTHLY'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => { setActiveTab(tab); setValue('frequency', tab) }}
            className={cn(
              'flex-1 py-4 text-sm font-semibold transition-colors',
              activeTab === tab
                ? 'text-brand-gold border-b-2 border-brand-gold bg-brand-gold/5'
                : 'text-text-muted hover:text-white'
            )}
          >
            {tab === 'ONE_TIME' ? 'One-Time Gift' : (
              <span className="flex items-center justify-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" />
                Monthly Giving
              </span>
            )}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-7 space-y-6">
        {/* Amount selector */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-3">Select Amount</label>
          <div className="grid grid-cols-3 gap-2 mb-3">
            {presetAmounts.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handlePreset(val)}
                className={cn(
                  'py-3 rounded-xl border text-sm font-semibold transition-all',
                  selectedAmount === val && !customAmount
                    ? 'border-brand-gold bg-brand-gold/15 text-brand-gold'
                    : 'border-white/10 text-text-secondary hover:border-brand-gold/40 hover:text-white'
                )}
              >
                ${val}
              </button>
            ))}
            <button
              type="button"
              onClick={() => { setCustomAmount(true); setSelectedAmount(null) }}
              className={cn(
                'py-3 rounded-xl border text-sm font-semibold transition-all',
                customAmount
                  ? 'border-brand-gold bg-brand-gold/15 text-brand-gold'
                  : 'border-white/10 text-text-secondary hover:border-brand-gold/40 hover:text-white'
              )}
            >
              Custom
            </button>
          </div>

          {customAmount && (
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold font-semibold">$</span>
              <input
                type="number"
                min="1"
                placeholder="Enter amount"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-brand-gold/40 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
                onChange={(e) => setValue('amount', parseFloat(e.target.value) || 0)}
              />
            </div>
          )}
        </div>

        {/* Fund selector */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">Designate to</label>
          <select
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-gold/40 focus:border-brand-gold/40"
            {...register('fund')}
          >
            {funds.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        {/* Personal info */}
        <div className="grid grid-cols-2 gap-4">
          <Input label="First Name" placeholder="John" error={errors.firstName?.message} {...register('firstName')} />
          <Input label="Last Name" placeholder="Doe" error={errors.lastName?.message} {...register('lastName')} />
        </div>
        <Input label="Email" type="email" placeholder="your@email.com" error={errors.email?.message} {...register('email')} />

        {/* Cover fees */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-brand-gold" {...register('coverFees')} />
          <span className="text-sm text-text-secondary">
            Cover the transaction fee (2.9% + $0.30) so 100% goes to ministry
          </span>
        </label>

        {/* Total display */}
        <div className="rounded-xl bg-brand-gold/8 border border-brand-gold/20 p-4 flex justify-between items-center">
          <span className="text-sm text-text-secondary">Total</span>
          <span className="font-display font-bold text-brand-gold text-xl">
            ${coverFees && amount ? (amount * 1.029 + 0.30).toFixed(2) : (amount || 0).toFixed(2)}
          </span>
        </div>

        <Button type="submit" loading={isSubmitting} size="lg" className="w-full">
          <Lock className="h-4 w-4" />
          Give ${coverFees && amount ? (amount * 1.029 + 0.30).toFixed(2) : (amount || 0).toFixed(2)} Securely
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
          <Lock className="h-3 w-3" />
          256-bit SSL encryption. Powered by Stripe.
        </div>
      </form>
    </div>
  )
}
