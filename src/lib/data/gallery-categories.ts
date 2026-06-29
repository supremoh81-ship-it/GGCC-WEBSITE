export interface GalleryCategory {
  slug: string
  title: string
  description: string
}

export const GALLERY_CATEGORIES: GalleryCategory[] = [
  {
    slug: 'sunday-main-service',
    title: 'Sunday Main Service Moments',
    description: 'Captured during our Sunday Main Service at 10 AM.',
  },
  {
    slug: 'school-of-purpose',
    title: 'School of Purpose',
    description: 'Moments from our Sunday evening services.',
  },
  {
    slug: 'greatness-switch',
    title: 'Greatness Switch',
    description: 'Captured during our Thursday Midweek Service at 5 PM.',
  },
  {
    slug: 'mission-trips',
    title: 'Mission Trips',
    description: 'Moments from our mission and outreach activities.',
  },
  {
    slug: 'community-events',
    title: 'Community Events',
    description: 'Moments from our community service and events.',
  },
  {
    slug: 'anniversary-conferences',
    title: 'Anniversary and Conferences',
    description: 'Moments from church anniversaries, special events, and conferences.',
  },
]

export function getCategory(slug: string) {
  return GALLERY_CATEGORIES.find((c) => c.slug === slug)
}
