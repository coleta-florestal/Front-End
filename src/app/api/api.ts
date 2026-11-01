import { getAccessToken } from '@/lib/auth';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://back-end-cp74.onrender.com').replace(
  /\/$/,
  '',
);

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  userName: string;
  password: string;
  role: Role;
}

export interface Token {
  jti: string;
  expiresAt: string;
}

export interface CreateUserDto {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}

export async function createUser(dto: CreateUserDto): Promise<User> {
  return apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(dto),
    accessToken: getAccessToken() ?? undefined,
  });
}

export async function login(dto: LoginDto): Promise<AuthToken> {
  const response = await apiFetch('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(dto),
  });

  return {
    accessToken: response.accessToken || response.access_token,
    refreshToken: response.refreshToken || response.refresh_token,
  };
}

export async function apiFetch(
  path: string,
  options: RequestInit & { accessToken?: string; _retried?: boolean } = {},
  refreshToken?: () => Promise<boolean>,
) {
  const { accessToken, ...restOptions } = options;

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${BASE_URL}${cleanPath}`;

  let response: Response;

  try {
    response = await fetch(fullUrl, {
      ...restOptions,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(restOptions.headers ?? {}),
      },
    });
  } catch {
    throw new Error('Não foi possível conectar à API.');
  }

  if (response.status === 401 && refreshToken && !options._retried) {
    const refreshed = await refreshToken();
    if (refreshed) return apiFetch(path, { ...options, _retried: true }, refreshToken);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error([].concat(body.message || response.statusText).join(', '));
  }

  return response.status === 204 ? null : response.json();
}
