import { NextResponse } from 'next/server'

// Public routes - no authentication required
const publicRoutes = ['/', '/admin/login', '/rider/login']
// User protected routes - require any authenticated user
const userProtectedRoutes = ['/checkout', '/profile']
// Owner protected routes - require OWNER role
const ownerProtectedRoutes = ['/admin/dashboard']
// Rider protected routes - require RIDER role  
const riderProtectedRoutes = ['/rider/dashboard']

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Check if the current path matches any protected route
  const isUserProtectedRoute = userProtectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  const isOwnerProtectedRoute = ownerProtectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  const isRiderProtectedRoute = riderProtectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  const isPublicRoute = publicRoutes.includes(pathname) || 
                       pathname === '/admin/login' ||
                       pathname === '/rider/login'

  // Get token from cookies
  const token = request.cookies.get('token')?.value

  console.log('🔍 Middleware Debug:', {
    pathname,
    isUserProtectedRoute,
    isOwnerProtectedRoute,
    isRiderProtectedRoute,
    isPublicRoute,
    hasToken: !!token
  })

  // If no token found and route is protected, redirect to appropriate page
  if (!token && (isUserProtectedRoute || isOwnerProtectedRoute || isRiderProtectedRoute)) {
    console.log('🚫 No token found, redirecting...')
    if (isOwnerProtectedRoute) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (isRiderProtectedRoute) {
      return NextResponse.redirect(new URL('/rider/login', request.url))
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If token exists, verify it and check role for protected routes
  if (token && (isOwnerProtectedRoute || isRiderProtectedRoute)) {
    try {
      // Decode JWT token to get role
      const payload = JSON.parse(atob(token.split('.')[1]))
      console.log('👤 User Role:', payload.role)
      
      // Owner routes - only OWNER can access
      if (isOwnerProtectedRoute && payload.role !== 'OWNER') {
        console.log('❌ Not owner, redirecting to home')
        
        // Redirect based on user role
        if (payload.role === 'RIDER') {
          return NextResponse.redirect(new URL('/rider/dashboard', request.url))
        }
        return NextResponse.redirect(new URL('/', request.url))
      }
      
      // Rider routes - only RIDER can access
      if (isRiderProtectedRoute && payload.role !== 'RIDER') {
        console.log('❌ Not rider, redirecting to home')
        
        // Redirect based on user role
        if (payload.role === 'OWNER') {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      console.error('Token decode error:', error)
      // Clear invalid token and redirect to login
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('token')
      return response
    }
  }

  // If user has token and tries to access login pages, redirect accordingly
  if (token && (pathname === '/admin/login' || pathname === '/rider/login')) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      console.log('🔄 Already logged in with role:', payload.role)
      
      if (payload.role === 'OWNER') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      } else if (payload.role === 'RIDER') {
        return NextResponse.redirect(new URL('/rider/dashboard', request.url))
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
    '/rider/:path*',
  ],
}