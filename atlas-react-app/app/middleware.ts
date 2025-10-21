import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the token from cookies
  const token = request.cookies.get('token')?.value
  const userData = request.cookies.get('user')?.value
  
  let user = null
  if (userData) {
    try {
      user = JSON.parse(userData)
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
  }

  const { pathname } = request.nextUrl

  // If no token and trying to access protected routes, redirect to login
  if (!token && (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/barangayadmin') ||
    pathname.startsWith('/municipalityadmin') ||
    pathname.startsWith('/superadmin')
  )) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is logged in and trying to access login, redirect to appropriate dashboard
  if (token && user && pathname === '/login') {
    switch (user.role) {
      case 'SuperAdmin':
        return NextResponse.redirect(new URL('/superadmin/dashboard', request.url))
      case 'MunicipalityAdmin':
        return NextResponse.redirect(new URL('/municipalityadmin/dashboard', request.url))
      case 'BarangayAdmin':
        return NextResponse.redirect(new URL('/barangayadmin/dashboard', request.url))
      default:
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Role-based route protection
  if (token && user) {
    // Barangay Admin can only access barangayadmin routes
    if (user.role === 'BarangayAdmin' && !pathname.startsWith('/barangayadmin')) {
      return NextResponse.redirect(new URL('/barangayadmin/dashboard', request.url))
    }

    // Municipality Admin can only access municipalityadmin routes
    if (user.role === 'MunicipalityAdmin' && !pathname.startsWith('/municipalityadmin')) {
      return NextResponse.redirect(new URL('/municipalityadmin/dashboard', request.url))
    }

    // Super Admin can only access superadmin routes
    if (user.role === 'SuperAdmin' && !pathname.startsWith('/superadmin')) {
      return NextResponse.redirect(new URL('/superadmin/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/barangayadmin/:path*',
    '/municipalityadmin/:path*',
    '/superadmin/:path*',
    '/login'
  ]
}