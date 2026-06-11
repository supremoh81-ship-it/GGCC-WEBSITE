import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Admin user
  const adminPassword = await bcrypt.hash('Admin@GGCC2024!', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ggcc.church' },
    update: {},
    create: {
      email: 'admin@ggcc.church',
      firstName: 'GGCC',
      lastName: 'Admin',
      passwordHash: adminPassword,
      role: Role.SUPER_ADMIN,
      emailVerified: new Date(),
    },
  })
  console.log('Admin user created:', admin.email)

  // Demo member
  const memberPassword = await bcrypt.hash('Member@GGCC2024!', 12)
  const member = await prisma.user.upsert({
    where: { email: 'member@ggcc.church' },
    update: {},
    create: {
      email: 'member@ggcc.church',
      firstName: 'Grace',
      lastName: 'Member',
      passwordHash: memberPassword,
      role: Role.MEMBER,
      emailVerified: new Date(),
    },
  })
  console.log('Demo member created:', member.email)

  // Speaker
  const speaker = await prisma.speaker.upsert({
    where: { slug: 'dr-emmanuel-grace' },
    update: {},
    create: {
      name: 'Dr. Emmanuel Grace',
      slug: 'dr-emmanuel-grace',
      title: 'Senior Pastor',
      bio: 'With over two decades of ministry, Dr. Grace carries a mandate to raise a global generation of purpose-driven believers.',
      avatarUrl: 'https://images.unsplash.com/photo-1537119042441-93a37c6b7a68?w=300&q=80',
    },
  })
  console.log('Speaker created:', speaker.name)

  // Sermon series
  const series = await prisma.sermonSeries.upsert({
    where: { slug: 'walking-in-grace' },
    update: {},
    create: {
      title: 'Walking in Grace',
      slug: 'walking-in-grace',
      description: 'An eight-week journey through the transforming power of grace.',
      artworkUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80',
    },
  })

  // Sample sermons
  const sermons = [
    {
      title: 'The Weight of Grace',
      slug: 'the-weight-of-grace',
      description: 'Understanding the depth and sufficiency of God\'s grace in every season.',
      type: 'AUDIO' as const,
      status: 'PUBLISHED' as const,
      duration: 2880,
      viewCount: 1240,
      isFeatured: true,
      seriesId: series.id,
      speakerId: speaker.id,
      publishedAt: new Date('2024-11-03'),
      thumbnailUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&q=80',
    },
    {
      title: 'Running With Vision',
      slug: 'running-with-vision',
      description: 'How to pursue God\'s purpose with clarity, focus, and holy boldness.',
      type: 'AUDIO' as const,
      status: 'PUBLISHED' as const,
      duration: 3240,
      viewCount: 980,
      isFeatured: false,
      seriesId: series.id,
      speakerId: speaker.id,
      publishedAt: new Date('2024-10-27'),
      thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    },
  ]

  for (const s of sermons) {
    await prisma.sermon.upsert({
      where: { slug: s.slug },
      update: {},
      create: s,
    })
  }
  console.log('Sample sermons created')

  // Podcast show
  const show = await prisma.podcastShow.upsert({
    where: { slug: 'daily-grace' },
    update: {},
    create: {
      title: 'Daily Grace',
      slug: 'daily-grace',
      description: 'Short daily devotionals to start your morning anchored in the Word.',
      artworkUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=80',
    },
  })

  // Sample events
  const event = await prisma.event.upsert({
    where: { slug: 'encounter-night-2025' },
    update: {},
    create: {
      title: 'Encounter Night 2025',
      slug: 'encounter-night-2025',
      description: 'An evening of worship, prayer, and the presence of God.',
      type: 'IN_PERSON',
      status: 'PUBLISHED',
      startDate: new Date('2025-02-15T18:00:00Z'),
      endDate: new Date('2025-02-15T21:00:00Z'),
      location: '1 Grace Boulevard, Houston, TX',
      capacity: 500,
      requiresTicket: false,
      bannerUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
    },
  })
  console.log('Sample event created:', event.title)

  // Ministries
  const ministryData = [
    { name: 'Worship Ministry', slug: 'worship', tagline: 'Leading hearts to encounter God', color: '#C9A84C' },
    { name: 'Youth & Young Adults', slug: 'youth', tagline: 'Shaping the next generation', color: '#5B8DD9' },
    { name: 'Prayer Warriors', slug: 'prayer-warriors', tagline: 'Interceding for the world', color: '#E85D75' },
    { name: 'Missions & Outreach', slug: 'missions', tagline: 'Serving our city and nations', color: '#9B72CF' },
  ]

  for (const m of ministryData) {
    await prisma.ministry.upsert({
      where: { slug: m.slug },
      update: {},
      create: { ...m, isActive: true },
    })
  }
  console.log('Ministries created')

  // Giving campaign
  await prisma.givingCampaign.upsert({
    where: { slug: 'building-fund-2025' },
    update: {},
    create: {
      title: 'Building Fund 2025',
      slug: 'building-fund-2025',
      description: 'Help us build a world-class ministry facility for our growing congregation.',
      goalAmount: 500000,
      raisedAmount: 142500,
      isActive: true,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
    },
  })
  console.log('Giving campaign created')

  console.log('Seeding complete.')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
