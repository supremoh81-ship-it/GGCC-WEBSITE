import type { Metadata } from 'next'
import { HeroSection } from '@/components/home/HeroSection'
import { PastorWelcome } from '@/components/home/PastorWelcome'
import { VisionMission } from '@/components/home/VisionMission'
import { LiveExperience } from '@/components/home/LiveExperience'
import { FeaturedSermon } from '@/components/home/FeaturedSermon'
import { LatestPodcast } from '@/components/home/LatestPodcast'
import { PrayerCTA } from '@/components/home/PrayerCTA'
import { UpcomingEvents } from '@/components/home/UpcomingEvents'
import { MinistriesGrid } from '@/components/home/MinistriesGrid'
import { TestimonyCarousel } from '@/components/home/TestimonyCarousel'
import { GlobalImpact } from '@/components/home/GlobalImpact'
import { GivingBanner } from '@/components/home/GivingBanner'
import { GalleryStrip } from '@/components/home/GalleryStrip'
import { MembershipCTA } from '@/components/home/MembershipCTA'

export const metadata: Metadata = {
  title: 'GGCC | Greater Grace Christian Center',
  description:
    'A global church community rooted in faith, serving the world with love, purpose, and the transforming power of the Gospel. Watch sermons, join prayer, give, and connect.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PastorWelcome />
      <VisionMission />
      <GalleryStrip />
      <LiveExperience />
      <FeaturedSermon />
      <LatestPodcast />
      <PrayerCTA />
      <UpcomingEvents />
      <MinistriesGrid />
      <TestimonyCarousel />
      <GlobalImpact />
      <GivingBanner />
      <MembershipCTA />
    </>
  )
}
