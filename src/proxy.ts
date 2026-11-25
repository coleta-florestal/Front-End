import { NextRequest, NextResponse } from 'next/server';
import { getCurrentRole } from './app/api/api';
import { decodeJwt, isAdminRole } from './lib/auth';

const PUBLIC_ROUTES = ['/', '/cadastro', '/recuperar-acesso', '/redefinir-senha'];

const PROCESSING_ROUTE = /^\/platform\/fazendas\/[^/]+\/[^/]+\/processamento\/?$/;

export async function proxy(request: NextRequest) {
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

  const isAdminRoute = pathname.startsWith('/platform/painel-admin');
  const isProcessingRoute = PROCESSING_ROUTE.test(pathname);
  // Só as rotas admin pagam a ida ao back: o papel do JWT pode estar velho (UC38-CT05).
  if (!isAdminRoute && !isProcessingRoute) return NextResponse.next();

  if (isAdminRole(await getCurrentRole(token))) return NextResponse.next();

  if (isAdminRoute) {
    return NextResponse.redirect(new URL('/platform/fazendas', request.url));
  }

  // Só administradores processam talhões; os demais voltam para a página do talhão.
  return NextResponse.redirect(new URL(pathname.replace(/\/processamento\/?$/, ''), request.url));
}

export const config = {
  matcher: ['/', '/cadastro', '/recuperar-acesso', '/redefinir-senha', '/platform/:path*'],
};
