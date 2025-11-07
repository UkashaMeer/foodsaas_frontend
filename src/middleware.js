import { NextResponse } from 'next/server'

// Public routes - no authentication required
const publicRoutes = ['/', '/admin/login']
// User protected routes - require any authenticated user
const userProtectedRoutes = ['/checkout', '/profile']
// Owner protected routes - require OWNER role
const ownerProtectedRoutes = ['/admin/dashboard']

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Check if the current path matches any protected route
  const isUserProtectedRoute = userProtectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  const isOwnerProtectedRoute = ownerProtectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  const isPublicRoute = publicRoutes.includes(pathname) || 
                       pathname === '/admin/login'

  // Get token from cookies
  const token = request.cookies.get('token')?.value

  console.log('🔍 Middleware Debug:', {
    pathname,
    isUserProtectedRoute,
    isOwnerProtectedRoute,
    isPublicRoute,
    hasToken: !!token
  })

  // If no token found and route is protected, redirect to appropriate page
  if (!token && (isUserProtectedRoute || isOwnerProtectedRoute)) {
    console.log('🚫 No token found, redirecting...')
    if (isOwnerProtectedRoute) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If token exists, verify it and check role for owner routes
  if (token && isOwnerProtectedRoute) {
    try {
      // Decode JWT token to get role
      const payload = JSON.parse(atob(token.split('.')[1]))
      console.log('👤 User Role:', payload.role)
      
      if (payload.role !== 'OWNER') {
        console.log('❌ Not owner, redirecting to home')
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      console.error('Token decode error:', error)
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // If user has token and tries to access admin/login, redirect accordingly
  if (token && pathname === '/admin/login') {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      console.log('🔄 Already logged in with role:', payload.role)
      
      if (payload.role === 'OWNER') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      } else {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      console.error('Token decode error:', error)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/checkout',
    '/profile',
    '/admin/:path*',
  ],
}