import { AuthToken } from '@/app/api/api';

const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';

interface JwtPayload {
  sub?: string;
  role?: 'ADMIN' | 'USER' | 'SUPER_ADMIN';
  exp?: number;
  [key: string]: unknown;
}

export function decodeJwt<T = JwtPayload>(token: string): T | null {
  try {
    const payload = token.split('.')[1];
    // atob devolve bytes soltos: sem o TextDecoder, acentos do nome ("João") viram "JoÃ£o".
    const binary = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  } catch {
    return null;
  }
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; SameSite=Lax`;
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setAuthCookies(tokens: AuthToken) {
  setCookie(ACCESS_TOKEN_COOKIE, tokens.accessToken);
  if (tokens.refreshToken) setCookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken);
}

export function clearAuthCookies() {
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; max-age=0`;
  document.cookie = `${REFRESH_TOKEN_COOKIE}=; path=/; max-age=0`;
}

export function getAccessToken(): string | null {
  return readCookie(ACCESS_TOKEN_COOKIE);
}

export function isAdminRole(role?: string | null): boolean {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

export function getRefreshToken(): string | null {
  return readCookie(REFRESH_TOKEN_COOKIE);
}
