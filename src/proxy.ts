import { NextRequest, NextResponse } from 'next/server';
import { decodeJwt, isAdminToken } from './lib/auth';

const PUBLIC_ROUTES = ['/', '/cadastro', '/recuperar-acesso', 'redefinir-senha'];

const PROCESSING_ROUTE = /^\/platform\/fazendas\/[^/]+\/[^/]+\/processamento\/?$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accessToken')?.value;
  const payload = token ? decodeJwt<{ role?: string; exp?: number }>(token) : null;
  const isValid = !!payload && (!payload.exp || payload.exp * 1000 > Date.now());

  if (PUBLIC_ROUTES.includes(pathname)) {
    return isValid ? NextResponse.redirect(new URL('/platform', request.url)) : NextResponse.next();
  }

  if (!isValid) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname.startsWith('/platform/painel-admin') && !isAdminToken(token)) {
    return NextResponse.redirect(new URL('/platform/fazendas', request.url));
  }

  // Só administradores processam talhões; os demais voltam para a página do talhão.
  if (PROCESSING_ROUTE.test(pathname) && !isAdminToken(token)) {
    return NextResponse.redirect(new URL(pathname.replace(/\/processamento\/?$/, ''), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/cadastro', '/recuperar-acesso', '/redefinir-senha', '/platform/:path*'],
};
