import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  verifySessionToken,
  validateAdminCredentials,
  createSessionToken,
} from '@/lib/auth-token';

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Whitelist login route and assets
    if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
      return NextResponse.next();
    }

    // 1. Verify encrypted session cookie
    const sessionToken = req.cookies.get(COOKIE_NAME)?.value;
    const validSession = verifySessionToken(sessionToken);

    if (validSession) {
      return NextResponse.next();
    }

    // 2. Backward compatibility: Support Basic Auth header if present
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Basic ')) {
      try {
        const base64Credentials = authHeader.split(' ')[1];
        const [user, pwd] = atob(base64Credentials).split(':');

        if (user && pwd && validateAdminCredentials(user, pwd)) {
          const res = NextResponse.next();
          // Issue session cookie so subsequent requests don't need repeated Basic auth
          res.cookies.set({
            name: COOKIE_NAME,
            value: createSessionToken(user),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: SESSION_MAX_AGE_SECONDS,
          });
          return res;
        }
      } catch (e) {
        console.error('Basic auth parsing error in proxy:', e);
      }
    }

    // If unauthenticated, redirect to dedicated login portal
    const loginUrl = new URL('/admin/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};
