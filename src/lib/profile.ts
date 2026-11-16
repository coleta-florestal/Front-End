import { useSyncExternalStore } from 'react';
import { decodeJwt, getAccessToken } from '@/lib/auth';

const MOCK_STORAGE_KEY = 'glupta_mock_profile';
const SEPARATOR = '\n';

export function getInitialsFromName(name: string, fallback: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getSnapshot(): string {
  let name = '';
  try {
    const saved = localStorage.getItem(MOCK_STORAGE_KEY);
    if (saved) name = (JSON.parse(saved).name ?? '').trim();
  } catch {}

  const token = getAccessToken();
  const email = (token && decodeJwt<{ email?: string }>(token)?.email) || '';
  return `${name}${SEPARATOR}${email}`;
}

function subscribe(onChange: () => void) {
  window.addEventListener('profile-updated', onChange);
  return () => window.removeEventListener('profile-updated', onChange);
}

export function useProfileIdentity(): { name: string; initials: string } {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => SEPARATOR);
  const [name, email] = snapshot.split(SEPARATOR);

  if (name) return { name, initials: getInitialsFromName(name, '?') };

  const emailName = email
    .split('@')[0]
    .split(/[._-]+/)
    .join(' ');
  // return { name: email || 'Meu perfil', initials: getInitialsFromName(emailName, '?') };
  return { name: email || 'Meu perfil', initials: getInitialsFromName(emailName, '?') };
}
