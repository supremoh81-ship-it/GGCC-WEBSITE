import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { Quote, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'Testimonies',
  description: 'Read and share stories of transformation, healing, and God\'s faithfulness at GGCC.',
}

const testimonies = [
  {
    id: '1',
    name: 'Amara Johnson',
    location: 'Lagos, Nigeria',
    title: 'Restored after years of addiction',
    body: 'After fifteen years trapped in a cycle I could not escape, one Sunday morning changed everything. GGCC was not just a church. It became the community that walked with me through every step of healing. Today I lead others to the same freedom.',
    category: 'Healing',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Marcus Williams',
    location: 'Houston, Texas',
    title: 'From bankruptcy to purpose',
    body: 'When my business collapsed, I thought my life was over. Through the prayer team here and the Word preached every Sunday, God rebuilt not just my finances but my entire identity. I am living proof that He restores what the enemy steals.',
    category: 'Restoration',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Grace Okonkwo',
    location: 'Accra, Ghana',
    title: 'Healed of a terminal diagnosis',
    body: 'The doctors gave me six months. The church gave me prayer and faith. That was three years ago. I stand here today as a testimony of what happens when a community refuses to stop praying.',
    category: 'Healing',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
    isFeatured: true,
  },
  {
    id: '4',
    name: 'David Mensah',
    location: 'London, UK',
    title: 'Saved and immediately transformed',
    body: 'I came to GGCC as a visitor on a work trip. I left as a different man. I have never looked back. That was seven years ago and I now lead a home church of forty-five people.',
    category: 'Salvation',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    isFeatured: false,
  },
]

export default function TestimoniesPage() {
  return (
    <div className="min-h-screen bg-brand-navy pt-24">
      <section className="section-padding-sm bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial-gold opacity-40 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative">
          <FadeInUp className="text-center">
            <span className="section-label mb-4 inline-flex justify-center">Testimonies</span>
            <h1 className="text-display-lg font-display text-white mb-4">
              Lives <GoldShimmer>Transformed</GoldShimmer> by Grace
            </h1>
            <p className="text-body-lg text-text-muted max-w-xl mx-auto">
              Real stories from real people. Proof that God is still moving, healing, and saving today.
            </p>
          </FadeInUp>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto px-4 max-w-7xl">
          <StaggerChildren className="grid md:grid-cols-2 gap-6 mb-16">
            {testimonies.map((t) => (
              <StaggerItem key={t.id}>
                <div className={`glass-card rounded-2xl p-7 h-full flex flex-col gap-5 ${t.isFeatured ? 'border-brand-gold/25' : ''}`}>
                  <div className="flex items-start justify-between">
                    <Quote className="h-8 w-8 text-brand-gold/30" />
                    <Badge variant="gold">{t.category}</Badge>
                  </div>

                  <h3 className="font-display font-semibold text-white text-xl">{t.title}</h3>

                  <p className="text-text-muted text-sm leading-relaxed flex-1">
                    &ldquo;{t.body}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-brand-gold/25">
                      <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{t.name}</div>
                      <div className="text-xs text-text-muted">{t.location}</div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>

          {/* Submit CTA */}
          <FadeInUp>
            <div className="glass-card rounded-3xl p-10 text-center" style={{ border: '1px solid rgba(201, 168, 76, 0.25)' }}>
              <h2 className="font-display font-bold text-white text-2xl mb-3">
                Has God Done Something in Your Life?
              </h2>
              <p className="text-text-muted max-w-md mx-auto mb-7">
                Your story could be the testimony that brings hope to someone who has given up.
                Share what God has done.
              </p>
              <Link href="/testimonies/submit" className="btn-gold">
                Share Your Testimony
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>
    </div>
  )
}
