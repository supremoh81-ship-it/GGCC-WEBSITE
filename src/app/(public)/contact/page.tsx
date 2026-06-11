'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const schema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject required'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  department: z.enum(['general', 'pastoral', 'missions', 'media', 'events', 'giving']),
})

type FormValues = z.infer<typeof schema>

const departments = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'pastoral', label: 'Pastoral Care' },
  { value: 'missions', label: 'Missions & Outreach' },
  { value: 'media', label: 'Media & Press' },
  { value: 'events', label: 'Events & Booking' },
  { value: 'giving', label: 'Giving & Finance' },
]

const contactDetails = [
  { icon: MapPin, label: 'Address', value: '1 Grace Boulevard, Suite 400, Houston, TX 77001' },
  { icon: Phone, label: 'Phone', value: '+1 (713) 555-0180' },
  { icon: Mail, label: 'Email', value: 'connect@ggcc.church' },
  {
    icon: Clock,
    label: 'Office Hours',
    value: 'Monday to Friday, 9 AM to 5 PM CT',
  },
]

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { department: 'general' },
  })

  async function onSubmit(data: FormValues) {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      reset()
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-brand-navy pt-24">
      {/* Header */}
      <section className="section-padding-sm bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-grid opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative">
          <FadeInUp className="text-center">
            <span className="section-label mb-4 inline-flex justify-center">Get In Touch</span>
            <h1 className="text-display-lg font-display text-white mb-4">
              We Would Love to <GoldShimmer>Hear From You</GoldShimmer>
            </h1>
            <p className="text-body-lg text-text-muted max-w-lg mx-auto">
              Whether you have a question, a prayer request, or want to learn more about GGCC,
              our team is ready to connect with you.
            </p>
          </FadeInUp>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact details */}
            <div className="lg:col-span-2 space-y-6">
              <FadeInUp>
                <h2 className="font-display font-bold text-white text-2xl mb-6">Contact Information</h2>
                {contactDetails.map((d) => (
                  <div key={d.label} className="glass-card rounded-2xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/25 flex items-center justify-center flex-shrink-0">
                      <d.icon className="h-5 w-5 text-brand-gold" />
                    </div>
                    <div>
                      <div className="text-xs text-text-muted mb-0.5">{d.label}</div>
                      <div className="text-sm text-white">{d.value}</div>
                    </div>
                  </div>
                ))}
              </FadeInUp>

              <FadeInUp delay={0.2}>
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-semibold text-white mb-3">Service Times</h3>
                  <ul className="space-y-2 text-sm text-text-muted">
                    <li className="flex justify-between">
                      <span>Sunday First Service</span>
                      <span className="text-brand-gold">8:00 AM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sunday Second Service</span>
                      <span className="text-brand-gold">10:30 AM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Midweek Bible Study</span>
                      <span className="text-brand-gold">Wed 7:00 PM</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Prayer Meeting</span>
                      <span className="text-brand-gold">Fri 6:00 AM</span>
                    </li>
                  </ul>
                </div>
              </FadeInUp>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <FadeInUp>
                {submitted ? (
                  <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center gap-4">
                    <CheckCircle className="h-16 w-16 text-brand-gold" />
                    <h3 className="font-display font-bold text-white text-2xl">Message Received!</h3>
                    <p className="text-text-muted max-w-sm">
                      Thank you for reaching out. A member of our team will respond within 1-2 business days.
                    </p>
                    <button
                      className="btn-outline-gold mt-2"
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-3xl p-8 space-y-5">
                    <h2 className="font-display font-bold text-white text-2xl">Send Us a Message</h2>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="First Name"
                        {...register('firstName')}
                        error={errors.firstName?.message}
                        placeholder="John"
                      />
                      <Input
                        label="Last Name"
                        {...register('lastName')}
                        error={errors.lastName?.message}
                        placeholder="Doe"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Email"
                        type="email"
                        {...register('email')}
                        error={errors.email?.message}
                        placeholder="john@example.com"
                      />
                      <Input
                        label="Phone (optional)"
                        type="tel"
                        {...register('phone')}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-1.5">Department</label>
                      <select
                        {...register('department')}
                        className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
                      >
                        {departments.map((d) => (
                          <option key={d.value} value={d.value} className="bg-brand-navy">
                            {d.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="Subject"
                      {...register('subject')}
                      error={errors.subject?.message}
                      placeholder="How can we help you?"
                    />

                    <Textarea
                      label="Message"
                      {...register('message')}
                      error={errors.message?.message}
                      placeholder="Share your question, prayer request, or inquiry..."
                      rows={5}
                    />

                    <Button type="submit" variant="gold" size="lg" loading={isSubmitting} className="w-full">
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </FadeInUp>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
