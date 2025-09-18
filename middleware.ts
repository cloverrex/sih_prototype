import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths requiring authenticated session (session cookie heuristic)
const PROTECTED_PREFIXES = ['/profile','/donations','/mentorship','/alumni'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const protectedPath = PROTECTED_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'));
  if (protectedPath) {
    // next-auth session cookie names:
    //  - next-auth.session-token (HTTP) or __Secure-next-auth.session-token (HTTPS)
    const hasNextAuth = req.cookies.has('next-auth.session-token') || req.cookies.has('__Secure-next-auth.session-token');
    // fallback legacy express session
    const hasLegacy = req.cookies.has('connect.sid');
    if (!hasNextAuth && !hasLegacy) {
      const url = req.nextUrl.clone();
      url.pathname = '/auth';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*','/donations/:path*','/mentorship/:path*','/alumni/:path*']
};
