import { NextRequest, NextResponse } from 'next/server';

// Define an array of paths that require authentication
const protectedPaths = [
  '/account',
  '/checkout',
  '/orders',
  '/profile',
];

// This function handles the middleware logic
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Debug info
  console.log(`[Middleware] Checking path: ${pathname}`);
  
  // Get the auth token from cookies only (most reliable for server-side middleware)
  const authToken = request.cookies.get('authToken')?.value;
  
  console.log(`[Middleware] Auth token present: ${!!authToken}`);
  
  // Check if this is a protected path
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // If trying to access protected path without authentication
  if (isProtectedPath && !authToken) {
    console.log(`[Middleware] Redirecting unauthenticated user to login`);
    const url = new URL('/login', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // For all other cases, continue - no redirect for login page
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
}; 