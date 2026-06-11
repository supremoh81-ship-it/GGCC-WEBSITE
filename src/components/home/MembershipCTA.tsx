import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { UserPlus, BookOpen, Users, Globe, ArrowRight } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Connect',
    desc: 'Join our community by attending a service or registering online. You belong here.',
  },
  {
    step: '02',
    icon: BookOpen,
    title: 'Grow',
    desc: 'Dive into Bible studies, discipleship programs, and transformative sermon content.',
  },
  {
    step: '03',
    icon: Users,
    title: 'Serve',
    desc: 'Find your ministry gift and start serving in the local church and community.',
  },
  {
    step: '04',
    icon: Globe,
    title: 'Impact',
    desc: 'Be sent as a carrier of God\'s love to your workplace, city, and the nations.',
  },
]

export function MembershipCTA() {
  return (
    <section className="section-padding bg-brand-blue relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/3 clip-diagonal pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative">
        <FadeInUp className="text-center mb-14">
          <span className="section-label mb-4 inline-flex justify-center">Membership Journey</span>
          <h2 className="text-display-md font-display text-white mb-4">
            Begin Your{' '}
            <GoldShimmer>Faith Journey</GoldShimmer>
          </h2>
          <p className="text-body-lg text-text-muted max-w-2xl mx-auto">
            Every great story starts with a single step. Here is how to get connected and grow with us.
          </p>
        </FadeInUp>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {steps.map((step, i) => (
            <StaggerItem key={step.step}>
              <div className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%+0.5rem)] w-full h-px bg-gradient-to-r from-brand-gold/30 to-transparent z-10" />
                )}

                <div className="glass-card rounded-2xl p-6 h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-3xl font-display font-bold text-brand-gold/30 leading-none">
                      {step.step}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                      <step.icon className="h-5 w-5 text-brand-gold" />
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-white text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <FadeInUp className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Link href="/register" className="btn-gold text-lg px-8 py-4">
              <UserPlus className="h-5 w-5" />
              Become a Member
            </Link>
            <Link href="/about" className="btn-ghost text-lg px-8 py-4">
              Learn More About Us
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}
