import { SignJWT, jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'

export const ADMIN_COOKIE = 'ggcc_admin'

function secret(): Uint8Array {
  const s = process.env.NEXTAUTH_SECRET
  if (!s) throw new Error('NEXTAUTH_SECRET is not set')
  return new TextEncoder().encode(s)
}

// ── Token helpers (work in both Edge and Node runtimes) ───────────────────

export async function signAdminToken(): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret())
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret())
    return payload.admin === true
  } catch {
    return false
  }
}

// ── In-memory rate limiter (resets on process restart — fine for serverless) ─

interface RateRecord {
  count: number
  windowEnd: number
  blockedUntil: number
}

const loginAttempts = new Map<string, RateRecord>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60_000   // 15 min sliding window
const BLOCK_MS  = 15 * 60_000   // 15 min lockout after 5 failures

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now()
  const rec = loginAttempts.get(ip)

  if (rec && rec.blockedUntil > now) {
    return { allowed: false, retryAfterSec: Math.ceil((rec.blockedUntil - now) / 1000) }
  }
  if (!rec || now > rec.windowEnd) {
    loginAttempts.set(ip, { count: 0, windowEnd: now + WINDOW_MS, blockedUntil: 0 })
    return { allowed: true, retryAfterSec: 0 }
  }
  if (rec.count >= MAX_ATTEMPTS) {
    rec.blockedUntil = now + BLOCK_MS
    return { allowed: false, retryAfterSec: Math.ceil(BLOCK_MS / 1000) }
  }
  return { allowed: true, retryAfterSec: 0 }
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now()
  const rec = loginAttempts.get(ip) ?? { count: 0, windowEnd: now + WINDOW_MS, blockedUntil: 0 }
  rec.count += 1
  if (rec.count >= MAX_ATTEMPTS) rec.blockedUntil = now + BLOCK_MS
  loginAttempts.set(ip, rec)
}

export function clearLoginAttempts(ip: string): void {
  loginAttempts.delete(ip)
}

// ── API-route guard (Node.js runtime only) ────────────────────────────────
// Returns a 401 Response if the admin JWT cookie is absent/invalid, else null.

export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get(ADMIN_COOKIE)?.value
  if (token && (await verifyAdminToken(token))) return null
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
