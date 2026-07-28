import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { jwtVerify } from 'jose'

const ADMIN_COOKIE = 'ggcc_admin'

async function verifyAdminCookie(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(ADMIN_COOKIE)?.value
  if (!token) return false
  try {
    const key = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)
    const { payload } = await jwtVerify(token, key)
    return payload.admin === true
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Member-only pages: require NextAuth session
  if (pathname.startsWith('/member')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      const url = new URL('/login', req.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  // Ministry portal: require member session with minister/admin role
  if (pathname.startsWith('/ministry-portal')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      const url = new URL('/login', req.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
    const role = token.role as string | undefined
    if (!role || !['MINISTER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return NextResponse.redirect(new URL('/403', req.url))
    }
    return NextResponse.next()
  }

  // Admin login page is always public
  if (pathname === '/admin/login') return NextResponse.next()

  // All other /admin/* and /api/admin/* require the admin JWT cookie
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const valid = await verifyAdminCookie(req)
    if (!valid) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/member/:path*', '/ministry-portal/:path*', '/admin/:path*', '/api/admin/:path*'],
}
