import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const MEMBER_ROUTES = ['/member']
const ADMIN_ROUTES = ['/admin']
const PORTAL_ROUTES = ['/ministry-portal']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  const isMemberRoute = MEMBER_ROUTES.some((r) => pathname.startsWith(r))
  const isAdminRoute = ADMIN_ROUTES.some((r) => pathname.startsWith(r))
  const isPortalRoute = PORTAL_ROUTES.some((r) => pathname.startsWith(r))

  if (isMemberRoute && !session) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAdminRoute) {
    if (!session) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    const role = session.user?.role
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN' && role !== 'MINISTER') {
      return NextResponse.redirect(new URL('/403', req.url))
    }
  }

  if (isPortalRoute) {
    if (!session) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    const role = session.user?.role
    if (role !== 'MINISTER' && role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return NextResponse.redirect(new URL('/403', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/member/:path*', '/admin/:path*', '/ministry-portal/:path*'],
}
