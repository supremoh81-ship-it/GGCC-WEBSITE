import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { FadeInUp } from '@/components/motion/FadeInUp'
import { StaggerChildren, StaggerItem } from '@/components/motion/StaggerChildren'
import { GoldShimmer } from '@/components/motion/GoldShimmer'
import { CountUp } from '@/components/motion/CountUp'
import { ArrowRight, BookOpen, Mic, Globe, TrendingUp, Heart, Users, Church } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Grace for Greatness Christian Center — our story, mission, leadership, and global vision.',
}

const coreValues = [
  'Bible-Centered Preaching and Teaching',
  'A Grace Orientation for Life',
  'Evangelism',
  'The Poor and Disenfranchised Matter to God',
  'Sustained Excellence and Quality',
  'Strong Family Ties and Fellowship',
  'Discipleship and Christian Education',
  'Giving — Tithing, Offerings, and Stewardship of Time, Self, Possessions and Influence',
  'The Ordinances — Baptism and Holy Communion',
]

const anchorPoints = [
  { icon: Heart, label: 'Warmer', desc: 'through Fellowship' },
  { icon: BookOpen, label: 'Deeper', desc: 'through Discipleship' },
  { icon: Church, label: 'Stronger', desc: 'through Worship' },
  { icon: Users, label: 'Broader', desc: 'through Ministry' },
  { icon: Globe, label: 'Larger', desc: 'through Evangelism' },
]

const leaderRoles = [
  { icon: BookOpen, label: 'Author' },
  { icon: Mic, label: 'Speaker' },
  { icon: Globe, label: 'Leadership Expert' },
  { icon: TrendingUp, label: 'Finance Expert' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-navy pt-24">

      {/* Hero — Intro Story (item 3) */}
      <section className="section-padding bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-grid opacity-30 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-7xl relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeInUp>
              <span className="section-label mb-5 inline-flex">Our Story</span>
              <h1 className="text-display-lg font-display text-white mb-6">
                Born to Restore, Built to <GoldShimmer>Awaken Greatness</GoldShimmer>
              </h1>
              <p className="text-body-lg text-text-muted mb-4">
                Grace for Greatness Christian Center was born from a divine calling to restore broken lives
                and awaken greatness in people. Led by Reverend Olumuyiwa Abraham and Reverend Oluwaseun
                Abraham, our church exists to see people saved, restored, discipled, equipped and empowered
                to serve and to lead.
              </p>
              <p className="text-body text-text-muted mb-8">
                We are a Pentecostal church rooted in God&apos;s grace, reaching young adults and those who
                have lost hope, showing them that there is greatness within them and a purpose for their lives.
              </p>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: 5, suffix: 'yr', label: 'Years Strong' },
                  { value: 10000, suffix: '+', label: 'Members' },
                  { value: 6, suffix: '+', label: 'Nations' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-display font-bold text-3xl text-brand-gold">
                      <CountUp end={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-xs text-text-muted mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </FadeInUp>

            <FadeInUp delay={0.2} className="relative">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                <Image
                  src="/images/pastors.jpg"
                  alt="Rev. Olumuyiwa and Rev. Oluwaseun Abraham"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 15%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 glass-card rounded-xl p-3 text-center">
                  <p className="text-xs text-brand-gold tracking-widest uppercase font-semibold">
                    Rev. Olumuyiwa Abraham &amp; Rev. Oluwaseun Abraham
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">Lead Pastors and Founders, GGCC</p>
                </div>
              </div>
            </FadeInUp>
          </div>
        </div>
      </section>

      {/* Full Story (item 4) */}
      <section className="section-padding bg-brand-navy">
        <div className="container mx-auto px-4 max-w-5xl">
          <FadeInUp className="text-center mb-14">
            <span className="section-label mb-4 inline-flex justify-center">Our Foundation</span>
            <h2 className="text-display-md font-display text-white">
              The Story Behind the <GoldShimmer>Vision</GoldShimmer>
            </h2>
          </FadeInUp>

          <StaggerChildren className="space-y-10">

            {/* Vision and Mission */}
            <StaggerItem>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="glass-card rounded-2xl p-7">
                  <h3 className="font-display font-bold text-brand-gold text-lg mb-3">Our Vision</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    We exist to see people saved, restored, discipled, equipped and empowered to serve and to lead.
                  </p>
                </div>
                <div className="glass-card rounded-2xl p-7">
                  <h3 className="font-display font-bold text-brand-gold text-lg mb-3">Our Mission</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    To heal a shattered world through God&apos;s kind of love and birthing greatness in people.
                  </p>
                </div>
              </div>
            </StaggerItem>

            {/* Anchor Statement */}
            <StaggerItem>
              <div className="glass-card rounded-2xl p-8">
                <h3 className="font-display font-bold text-white text-xl mb-6 text-center">
                  Our Anchor Statement
                </h3>
                <div className="grid sm:grid-cols-5 gap-4">
                  {anchorPoints.map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="text-center">
                      <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mx-auto mb-3">
                        <Icon className="h-5 w-5 text-brand-gold" />
                      </div>
                      <p className="font-display font-bold text-white text-sm">{label}</p>
                      <p className="text-[11px] text-text-muted mt-0.5">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </StaggerItem>

            {/* Why We Planted */}
            <StaggerItem>
              <div className="glass-card rounded-2xl p-8">
                <h3 className="font-display font-bold text-white text-xl mb-4">Why We Planted This Church</h3>
                <p className="text-text-muted leading-relaxed">
                  Reverend Olumuyiwa and Reverend Oluwaseun Abraham received a divine calling to bring people
                  back to God for total restoration. They recognized that there are many unchurched young adults
                  and youths in our community who have lost hope due to life&apos;s challenges, who are tired of
                  messages of conflict, and who need to hear messages of grace and hope. They saw the need for
                  proper discipleship, raising of young leaders, and a place where people could discover their
                  God-given purpose and greatness.
                </p>
              </div>
            </StaggerItem>

            {/* Core Values */}
            <StaggerItem>
              <div className="glass-card rounded-2xl p-8">
                <h3 className="font-display font-bold text-white text-xl mb-5">Our Core Values</h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {coreValues.map((value, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-1 w-5 h-5 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center shrink-0 text-[10px] font-bold text-brand-gold">
                        {i + 1}
                      </span>
                      <span className="text-sm text-text-muted leading-relaxed">{value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>

            {/* Our Target */}
            <StaggerItem>
              <div className="glass-card rounded-2xl p-8 border border-brand-gold/20">
                <h3 className="font-display font-bold text-white text-xl mb-4">Our Target</h3>
                <p className="text-text-muted leading-relaxed">
                  Young adults and middle-age youths who have lost hope, misunderstood the message of grace,
                  held wrong belief systems, or suffered rejection. We believe that through restoration,
                  discipleship, and empowerment, greatness can be awakened in every person.
                </p>
              </div>
            </StaggerItem>

          </StaggerChildren>
        </div>
      </section>

      {/* Leadership */}
      <section className="section-padding bg-brand-blue">
        <div className="container mx-auto px-4 max-w-7xl">
          <FadeInUp className="text-center mb-14">
            <span className="section-label mb-4 inline-flex justify-center">Leadership</span>
            <h2 className="text-display-md font-display text-white">
              Meet Our Church Lead{' '}
              <GoldShimmer>Pastors and Founders</GoldShimmer>
            </h2>
          </FadeInUp>

          <StaggerChildren className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {/* Rev. Olumuyiwa */}
            <StaggerItem>
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/pastors.jpg"
                    alt="Rev. Olumuyiwa Abraham"
                    fill
                    className="object-cover"
                    style={{ objectPosition: '20% center' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="text-sm text-brand-gold font-semibold tracking-widest uppercase mb-1">
                    Senior Pastor and Founder
                  </div>
                  <h3 className="font-display font-bold text-white text-xl mb-3">
                    Rev. Olumuyiwa Abraham
                  </h3>
                  <p className="text-sm text-text-muted mb-4 leading-relaxed">
                    An accomplished author, speaker, leadership expert, relationship coach, renowned publisher,
                    and finance expert. Reverend Olumuyiwa carries a divine mandate to restore broken lives and
                    raise a generation of purpose-driven leaders.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {leaderRoles.map(({ icon: Icon, label }) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1.5 bg-brand-gold/10 border border-brand-gold/20 rounded-full px-3 py-1 text-xs text-brand-gold"
                      >
                        <Icon className="h-3 w-3" />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </StaggerItem>

            {/* Rev. Oluwaseun */}
            <StaggerItem>
              <div className="glass-card rounded-2xl overflow-hidden">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src="/images/pastors.jpg"
                    alt="Rev. Oluwaseun Abraham"
                    fill
                    className="object-cover"
                    style={{ objectPosition: '80% center' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="text-sm text-brand-gold font-semibold tracking-widest uppercase mb-1">
                    Co-Pastor and Co-Founder
                  </div>
                  <h3 className="font-display font-bold text-white text-xl mb-3">
                    Rev. Oluwaseun Abraham
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Together with her husband, Reverend Oluwaseun anchors the pastoral vision of Grace for
                    Greatness Christian Center, ministering with grace, care, and a heart to see every
                    person discover their God-given purpose.
                  </p>
                </div>
              </div>
            </StaggerItem>
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-navy">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <FadeInUp>
            <h2 className="text-display-md font-display text-white mb-4">
              Ready to <GoldShimmer>Connect?</GoldShimmer>
            </h2>
            <p className="text-body-lg text-text-muted mb-8">
              Whether you are exploring faith for the first time or looking for a spiritual home,
              we welcome you with open arms.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register" className="btn-gold">
                Join the Community
              </Link>
              <Link href="/events" className="btn-ghost">
                Upcoming Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeInUp>
        </div>
      </section>

    </div>
  )
}
