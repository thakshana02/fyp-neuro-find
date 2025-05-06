import { NextResponse } from 'next/server';

// Middleware function to protect routes
export function middleware(request) {
  // Check if the auth cookie exists (this is set by Firebase client-side)
  // Note: Since we can't directly access Firebase auth state in middleware,
  // we'll need to rely on cookies or session management.
  // The implementation below is simplified and should be enhanced in production.
  
  const authCookie = request.cookies.get('firebaseAuth');
  const { pathname } = request.nextUrl;

  // List of paths that require authentication
  const protectedPaths = ['/dashboard', '/predict', '/results'];
  const authPaths = ['/login', '/signup'];

  // Check if the current path is protected and user is not authenticated
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  if (isProtectedPath && !authCookie) {
    // Redirect to login page if user is not authenticated
    return NextResponse.redirect(new URL('/login', request.url));
  } 
  
  if (isAuthPath && authCookie) {
    // Redirect to dashboard if user is already authenticated and trying to access login/signup
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Specify which paths this middleware should run on
export const config = {
  matcher: ['/dashboard/:path*', '/predict/:path*', '/results/:path*', '/login', '/signup'],
};