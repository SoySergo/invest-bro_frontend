import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const protectedPaths = ['/listing/create', '/favorites', '/chat', '/profile', '/dashboard'];

const localePattern = new RegExp(`^\\/(${routing.locales.join('|')})`);

function isProtectedPath(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(localePattern, '') || '/';
  return protectedPaths.some((path) => pathWithoutLocale.startsWith(path));
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check auth for protected routes via session token cookie
  if (isProtectedPath(pathname)) {
    const sessionToken =
      request.cookies.get('authjs.session-token')?.value ||
      request.cookies.get('__Secure-authjs.session-token')?.value;

    if (!sessionToken) {
      const localeMatch = pathname.match(localePattern);
      const locale = localeMatch ? localeMatch[1] : routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames + API auth routes
  matcher: ['/', '/(en|fr|es|pt|de|it|nl|ru)/:path*']
};
