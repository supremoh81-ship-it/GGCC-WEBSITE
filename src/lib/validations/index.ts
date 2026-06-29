import { z } from 'zod'

export const registerSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const prayerRequestSchema = z.object({
  title: z.string().min(5).max(200),
  body: z.string().max(2000).optional(),
  visibility: z.enum(['PUBLIC', 'ANONYMOUS', 'PRIVATE']),
  categoryId: z.string().cuid().optional(),
})

export const donationSchema = z.object({
  amount: z.number().min(1).max(100000),
  frequency: z.enum(['ONE_TIME', 'WEEKLY', 'MONTHLY', 'ANNUALLY']),
  fundId: z.string().cuid().optional(),
  fundLabel: z.string().max(100).optional(),
  coverFees: z.boolean().default(false),
  campaignId: z.string().cuid().optional(),
})

export const eventRegistrationSchema = z.object({
  eventId: z.string().cuid(),
  notes: z.string().max(500).optional(),
})

export const sermonSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
  body: z.string().optional(),
  scriptureRef: z.string().max(100).optional(),
  type: z.enum(['VIDEO', 'AUDIO', 'NOTES_ONLY']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  videoUrl: z.string().url().optional().or(z.literal('')),
  audioUrl: z.string().url().optional().or(z.literal('')),
  duration: z.number().int().positive().optional(),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  speakerId: z.string().cuid().optional(),
  seriesId: z.string().cuid().optional(),
  speakerName: z.string().max(150).optional().or(z.literal('')),
  seriesTitle: z.string().max(150).optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  publishedAt: z.preprocess((v) => (v === '' ? undefined : v), z.coerce.date().optional()),
})

export const eventSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional(),
  type: z.enum(['IN_PERSON', 'ONLINE', 'HYBRID']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED']),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  location: z.string().max(300).optional(),
  onlineUrl: z.string().url().optional().or(z.literal('')),
  capacity: z.number().int().positive().optional(),
  requiresTicket: z.boolean().default(false),
  ticketPrice: z.number().min(0).optional(),
})

export const testimonySchema = z.object({
  title: z.string().min(5).max(200),
  body: z.string().min(50).max(5000),
  name: z.string().min(2).max(100),
  location: z.string().max(100).optional(),
  category: z.string().max(50).optional(),
})

export const contactSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  subject: z.string().min(5).max(200),
  message: z.string().min(20).max(5000),
  department: z.enum(['general', 'pastoral', 'missions', 'media', 'events', 'giving']),
})

export const newsletterSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2).max(50).optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type PrayerRequestInput = z.infer<typeof prayerRequestSchema>
export type DonationInput = z.infer<typeof donationSchema>
export type SermonInput = z.infer<typeof sermonSchema>
export type EventInput = z.infer<typeof eventSchema>
export type TestimonyInput = z.infer<typeof testimonySchema>
export type ContactInput = z.infer<typeof contactSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>
