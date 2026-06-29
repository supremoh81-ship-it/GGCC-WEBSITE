'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { z } from 'zod'

const localTestimonySchema = z.object({
  name: z.string().min(2).max(100),
  title: z.string().min(5).max(200),
  body: z.string().min(50).max(5000),
  category: z.string().max(50).optional(),
})

type TestimonyInput = z.infer<typeof localTestimonySchema>
import { toast } from 'sonner'

export default function SubmitTestimonyPage() {
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<TestimonyInput>({
      resolver: zodResolver(localTestimonySchema),
    })

  async function onSubmit(data: TestimonyInput) {
    try {
      const res = await fetch('/api/testimonies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
      reset()
    } catch {
      toast.error('Failed to submit. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-brand-navy pt-24">
      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-2xl">
          <FadeInUp className="mb-6">
            <Link href="/testimonies" className="flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to testimonies
            </Link>
          </FadeInUp>

          <FadeInUp>
            {submitted ? (
              <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center gap-4">
                <CheckCircle className="h-16 w-16 text-brand-gold" />
                <h2 className="font-display font-bold text-white text-2xl">
                  Thank You for Sharing!
                </h2>
                <p className="text-text-muted max-w-sm">
                  Your testimony has been submitted for review. Our team will publish it soon
                  so it can inspire others.
                </p>
                <Link href="/testimonies" className="btn-gold mt-2">
                  Back to Testimonies
                </Link>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-regal" />
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-display font-bold text-white mb-2">
                    Share Your <GoldShimmer>Testimony</GoldShimmer>
                  </h1>
                  <p className="text-text-muted text-sm">
                    Your story has the power to change someone&rsquo;s life. Share what God has done for you.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <Input
                    label="Title"
                    {...register('title')}
                    error={errors.title?.message}
                    placeholder="Healed from a chronic illness"
                  />

                  <Textarea
                    label="Your Story"
                    {...register('body')}
                    error={errors.body?.message}
                    placeholder="Share your full story here. What happened? How did God move? What changed in your life?"
                    rows={8}
                  />

                  <Input
                    label="Your Name"
                    {...register('name')}
                    error={errors.name?.message}
                    placeholder="John Doe"
                  />

                  <div>
                    <label className="block text-sm font-medium text-white mb-1.5">Category</label>
                    <select
                      {...register('category')}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold/50 transition-colors"
                    >
                      <option value="" className="bg-brand-navy">Select a category</option>
                      <option value="Healing" className="bg-brand-navy">Healing</option>
                      <option value="Salvation" className="bg-brand-navy">Salvation</option>
                      <option value="Restoration" className="bg-brand-navy">Restoration</option>
                      <option value="Financial Breakthrough" className="bg-brand-navy">Financial Breakthrough</option>
                      <option value="Family" className="bg-brand-navy">Family</option>
                      <option value="Career" className="bg-brand-navy">Career & Purpose</option>
                      <option value="Other" className="bg-brand-navy">Other</option>
                    </select>
                  </div>

                  <Button type="submit" variant="gold" size="lg" loading={isSubmitting} className="w-full">
                    {isSubmitting ? 'Submitting...' : 'Submit Testimony'}
                  </Button>

                  <p className="text-center text-xs text-text-muted">
                    Testimonies are reviewed before publishing. Your submission may be edited for length and clarity.
                  </p>
                </form>
              </div>
            )}
          </FadeInUp>
        </div>
      </section>
    </div>
  )
}
