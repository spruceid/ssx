import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { SSXServer } from '@spruceid/ssx-server';

export function ssxMiddleware(request: NextRequest, ssx: SSXServer) {
  if (request.nextUrl.pathname.includes('/ssx-nonce')) {
    console.log('[Middleware] ssx-nonce');
    // request.session.nonce = ssx.generateNonce();

    return NextResponse.next();
  }

  if (request.nextUrl.pathname.includes('/ssx-login')) {
    console.log('[Middleware] ssx-login');
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.includes('/ssx-logout')) {
    console.log('[Middleware] ssx-logout');
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.includes('/ssx-me')) {
    console.log('[Middleware] ssx-me');
    return NextResponse.next();
  }

  return NextResponse.next();
}
