import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const LOCALES = ['fr', 'pt', 'ar'] as const;

function isStaticPath(pathname: string) {
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/api')) return true;
  if (pathname === '/favicon.ico') return true;
  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /** Helps Safari and other clients revalidate HTML after deploys (pair with hard refresh if needed). */
  function withHtmlCacheHeaders(res: NextResponse) {
    res.headers.set('Cache-Control', 'private, max-age=0, must-revalidate');
    return res;
  }

  if (isStaticPath(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    return withHtmlCacheHeaders(NextResponse.next());
  }

  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  if (first && LOCALES.includes(first as (typeof LOCALES)[number])) {
    const restSegs = segments.slice(1);
    const restPath = restSegs.length ? `/${restSegs.join('/')}` : '/';
    if (restPath.startsWith('/admin')) {
      return NextResponse.redirect(new URL(restPath, request.url));
    }
    const url = request.nextUrl.clone();
    url.pathname = restPath;
    const res = NextResponse.rewrite(url);
    res.cookies.set('ams_locale', first, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
    return withHtmlCacheHeaders(res);
  }

  const cookieLocale = request.cookies.get('ams_locale')?.value;
  if (cookieLocale && LOCALES.includes(cookieLocale as (typeof LOCALES)[number])) {
    const target = new URL(request.url);
    target.pathname = `/${cookieLocale}${pathname === '/' ? '' : pathname}`;
    return withHtmlCacheHeaders(NextResponse.redirect(target));
  }

  return withHtmlCacheHeaders(NextResponse.next());
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|_next/webpack-hmr).*)'],
};
