import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import {
  ADMIN_COOKIE,
  signAdminToken,
  checkRateLimit,
  recordFailedAttempt,
  clearLoginAttempts,
} from '@/lib/admin-auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1'

  const { allowed, retryAfterSec } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${Math.ceil(retryAfterSec / 60)} minute(s).` },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } },
    )
  }

  let body: { email?: string; password?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { email, password } = body

  const adminEmail = process.env.ADMIN_EMAIL?.trim()
  const adminHash  = process.env.ADMIN_PASSWORD_HASH?.trim()

  if (!adminEmail || !adminHash) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  const emailMatch    = typeof email === 'string' && email.toLowerCase().trim() === adminEmail.toLowerCase()
  const passwordMatch = typeof password === 'string' && (await bcrypt.compare(password.trim(), adminHash))

  if (!emailMatch || !passwordMatch) {
    recordFailedAttempt(ip)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  clearLoginAttempts(ip)

  const token = await signAdminToken()

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return res
}
