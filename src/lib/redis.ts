import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

let redis: Redis | null = null

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  })
}

export { redis }

export function createRatelimit(requests: number, window: '1 m' | '10 s' | '1 h' = '1 m') {
  if (!redis) return null
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
  })
}

export const prayerRatelimit = createRatelimit(5, '1 m')
export const contactRatelimit = createRatelimit(3, '1 m')
export const newsletterRatelimit = createRatelimit(2, '1 m')
