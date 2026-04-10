import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['fr', 'pt', 'ar'] as const;

function isStaticPath(pathname: string) {
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/api')) return true;
  if (pathname === '/favicon.ico') return true;
  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

import { AMS_PATHNAME_HEADER } from '@/lib/amsPathnameHeader';

function stripTrailingSlash(p: string) {
  if (p.length > 1 && p.endsWith('/')) return p.slice(0, -1);
  return p;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathNorm = stripTrailingSlash(pathname) || '/';

  function requestHeadersWithPath() {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set(AMS_PATHNAME_HEADER, pathname);
    return requestHeaders;
  }

  function nextWithPath() {
    return NextResponse.next({ request: { headers: requestHeadersWithPath() } });
  }

  /** Harden HTML caching behavior (especially Safari bfcache/history cache edge cases). */
  function withHtmlCacheHeaders(res: NextResponse) {
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.headers.set('Pragma', 'no-cache');
    res.headers.set('Expires', '0');
    // Locale and cookie-dependent pages should never be shared under one cached variant.
    res.headers.set('Vary', 'Accept-Language, Cookie');
    return res;
  }

  if (isStaticPath(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    return withHtmlCacheHeaders(nextWithPath());
  }

  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  if (first && LOCALES.includes(first as (typeof LOCALES)[number])) {
    const restSegs = segments.slice(1);
    const restPath = restSegs.length ? `/${restSegs.join('/')}` : '/';
    if (stripTrailingSlash(restPath) === '/newhomepage') {
      const url = request.nextUrl.clone();
      url.pathname = '/newhomepage';
      return withHtmlCacheHeaders(NextResponse.redirect(url));
    }
    if (restPath.startsWith('/admin')) {
      return NextResponse.redirect(new URL(restPath, request.url));
    }
    const url = request.nextUrl.clone();
    url.pathname = restPath;
    const res = NextResponse.rewrite(url, {
      request: { headers: requestHeadersWithPath() },
    });
    res.cookies.set('ams_locale', first, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return withHtmlCacheHeaders(res);
  }

  const cookieLocale = request.cookies.get('ams_locale')?.value;
  if (
    cookieLocale &&
    LOCALES.includes(cookieLocale as (typeof LOCALES)[number]) &&
    pathNorm !== '/newhomepage'
  ) {
    const target = new URL(request.url);
    target.pathname = `/${cookieLocale}${pathname === '/' ? '' : pathname}`;
    return withHtmlCacheHeaders(NextResponse.redirect(target));
  }

  return withHtmlCacheHeaders(nextWithPath());
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|_next/webpack-hmr).*)'],
};
