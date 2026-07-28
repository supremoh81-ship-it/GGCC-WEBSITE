import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const result = await prisma.event.updateMany({
    where: { slug: 'greatness-conference-2026' },
    data: {
      bannerUrl: '/images/greatness-conference-2026.jpg',
      status: 'PUBLISHED',
      isFeatured: true,
    },
  })
  if (result.count === 0) {
    console.log('Event not found — creating it...')
    await prisma.event.create({
      data: {
        title: 'Greatness Conference 2026 & 5 Years Anniversary',
        slug: 'greatness-conference-2026',
        description:
          'Join us for the Greatness Conference 2026 as we celebrate 5 years of ministry under the theme "Grace for Exploits". Five days of powerful worship, teaching, and divine encounter with anointed ministers from across Nigeria.',
        type: 'IN_PERSON',
        status: 'PUBLISHED',
        isFeatured: true,
        bannerUrl: '/images/greatness-conference-2026.jpg',
        startDate: new Date('2026-07-29T17:00:00+01:00'),
        endDate: new Date('2026-08-02T12:00:00+01:00'),
        location: '07 Covenant Avenue, Dele Yes Sir Area, Ofatedo, Osogbo, Osun State',
        address: '07 Covenant Avenue, Dele Yes Sir Area, Ofatedo, Osogbo, Osun State',
        capacity: 1000,
        requiresTicket: false,
        organizerName: 'Grace for Greatness Christian Centre',
        organizerEmail: 'Connectggcchurch@gmail.com',
        tags: ['conference', 'anniversary', '2026', 'grace-for-exploits'],
      },
    })
    console.log('Event created with banner.')
  } else {
    console.log(`Banner URL set on ${result.count} event(s).`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
