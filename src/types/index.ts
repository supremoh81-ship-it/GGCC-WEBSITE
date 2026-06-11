export type Role = 'MEMBER' | 'VOLUNTEER' | 'MINISTER' | 'ADMIN' | 'SUPER_ADMIN'
export type PublishStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED'
export type MediaType = 'VIDEO' | 'AUDIO' | 'IMAGE' | 'DOCUMENT'
export type EventType = 'IN_PERSON' | 'ONLINE' | 'HYBRID'
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'
export type DonationStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
export type DonationFrequency = 'ONE_TIME' | 'WEEKLY' | 'MONTHLY' | 'ANNUALLY'
export type PrayerVisibility = 'PUBLIC' | 'ANONYMOUS' | 'PRIVATE'
export type PrayerStatus = 'ACTIVE' | 'ANSWERED' | 'CLOSED'
export type TestimonyStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type SermonType = 'SUNDAY_SERVICE' | 'MIDWEEK' | 'SPECIAL' | 'CONFERENCE' | 'YOUTH'

export interface SermonSummary {
  id: string
  slug: string
  title: string
  excerpt: string | null
  coverImageUrl: string | null
  videoUrl: string | null
  audioUrl: string | null
  duration: number | null
  viewCount: number
  isFeatured: boolean
  publishedAt: Date | null
  speaker: { id: string; name: string; avatarUrl: string | null } | null
  series: { id: string; title: string; slug: string } | null
}

export interface PodcastShowSummary {
  id: string
  slug: string
  title: string
  description: string | null
  coverImageUrl: string | null
  episodeCount?: number
}

export interface PodcastEpisodeSummary {
  id: string
  title: string
  description: string | null
  audioUrl: string
  duration: number | null
  episodeNo: number
  seasonNo: number | null
  publishedAt: Date | null
  show: PodcastShowSummary
}

export interface EventSummary {
  id: string
  slug: string
  title: string
  description: string | null
  startDate: Date
  endDate: Date | null
  location: string | null
  coverImageUrl: string | null
  type: EventType
  requiresTicket: boolean
  ticketPrice: number | null
  capacity: number | null
  registrationCount?: number
}

export interface PrayerRequestSummary {
  id: string
  title: string
  body: string | null
  visibility: PrayerVisibility
  status: PrayerStatus
  intercedeCount: number
  createdAt: Date
  user: { firstName: string; lastName: string } | null
}

export interface DonationSummary {
  id: string
  amount: number
  frequency: DonationFrequency
  status: DonationStatus
  fundLabel: string | null
  createdAt: Date
  user: { firstName: string; lastName: string; email: string } | null
}

export interface MinistryProfile {
  id: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  color: string | null
  iconName: string | null
  meetingSchedule: string | null
  memberCount?: number
  leaders?: Array<{
    user: { firstName: string; lastName: string; avatarUrl: string | null }
    title: string
  }>
}

export interface TestimonySummary {
  id: string
  title: string
  body: string
  authorName: string | null
  authorLocation: string | null
  authorAvatarUrl: string | null
  category: string | null
  isFeatured: boolean
  status: TestimonyStatus
  createdAt: Date
}

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
