'use client'

import { useState } from 'react'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { toast } from 'sonner'
import { Settings, Mail, Globe, DollarSign, Shield } from 'lucide-react'

const sections = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'site', label: 'Website', icon: Globe },
  { id: 'giving', label: 'Giving', icon: DollarSign },
  { id: 'security', label: 'Security', icon: Shield },
]

export default function AdminSettingsPage() {
  const [active, setActive] = useState('general')
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
    toast.success('Settings saved.')
  }

  return (
    <div className="space-y-6">
      <FadeInUp>
        <h1 className="text-xl font-display font-bold text-white">Settings</h1>
        <p className="text-sm text-text-muted mt-0.5">Configure your church platform.</p>
      </FadeInUp>

      <FadeInUp>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                active === s.id
                  ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/25'
                  : 'glass-card text-text-muted hover:text-white'
              }`}
            >
              <s.icon className="h-4 w-4" />
              {s.label}
            </button>
          ))}
        </div>
      </FadeInUp>

      {active === 'general' && (
        <FadeInUp>
          <div className="glass-card rounded-2xl p-7 space-y-5 max-w-xl">
            <h2 className="font-semibold text-white">Church Information</h2>
            <Input label="Church Name" defaultValue="Greater Grace Christian Center" />
            <Input label="Tagline" defaultValue="Rooted in faith. Reaching the world." />
            <Input label="Address" defaultValue="1 Grace Boulevard, Houston, TX 77001" />
            <Input label="Phone" defaultValue="+1 (713) 555-0180" type="tel" />
            <Input label="Email" defaultValue="connect@ggcc.church" type="email" />
            <Input label="Website URL" defaultValue="https://ggcc.church" type="url" />
            <Button variant="gold" loading={saving} onClick={save}>Save Changes</Button>
          </div>
        </FadeInUp>
      )}

      {active === 'email' && (
        <FadeInUp>
          <div className="glass-card rounded-2xl p-7 space-y-5 max-w-xl">
            <h2 className="font-semibold text-white">Email Configuration</h2>
            <Input label="From Email" defaultValue="noreply@ggcc.church" type="email" />
            <Input label="Reply-To Email" defaultValue="connect@ggcc.church" type="email" />
            <Input label="Resend API Key" defaultValue="" type="password" placeholder="re_..." />
            <Button variant="gold" loading={saving} onClick={save}>Save Changes</Button>
          </div>
        </FadeInUp>
      )}

      {active === 'giving' && (
        <FadeInUp>
          <div className="glass-card rounded-2xl p-7 space-y-5 max-w-xl">
            <h2 className="font-semibold text-white">Giving Configuration</h2>
            <Input label="Stripe Publishable Key" defaultValue="" type="password" placeholder="pk_live_..." />
            <Input label="Stripe Webhook Secret" defaultValue="" type="password" placeholder="whsec_..." />
            <div>
              <label className="block text-sm font-medium text-white mb-2">Default Giving Funds</label>
              <div className="space-y-2">
                {['General Offering', 'Building Fund', 'Missions Fund', 'Youth Ministry'].map((f) => (
                  <div key={f} className="flex items-center gap-3 glass-card rounded-xl px-4 py-3">
                    <span className="text-sm text-white flex-1">{f}</span>
                    <button className="text-xs text-red-400 hover:underline">Remove</button>
                  </div>
                ))}
              </div>
            </div>
            <Button variant="gold" loading={saving} onClick={save}>Save Changes</Button>
          </div>
        </FadeInUp>
      )}

      {(active === 'site' || active === 'security') && (
        <FadeInUp>
          <div className="glass-card rounded-2xl p-7 space-y-4 max-w-xl">
            <h2 className="font-semibold text-white capitalize">{active} Settings</h2>
            <p className="text-sm text-text-muted">
              Additional {active} configuration options will appear here as the platform grows.
            </p>
            <Button variant="ghost" disabled>Coming Soon</Button>
          </div>
        </FadeInUp>
      )}
    </div>
  )
}
