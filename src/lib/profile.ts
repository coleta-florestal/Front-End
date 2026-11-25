import { useSyncExternalStore } from 'react';
import { decodeJwt, getAccessToken } from '@/lib/auth';
import { UserProfile } from '@/types/profile';

const SEPARATOR = '\n';

export function getInitialsFromName(name: string, fallback: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

// useSyncExternalStore compara snapshots por valor: uma string evita re-render a cada leitura.
function getSnapshot(): string {
  const token = getAccessToken();
  const payload = token ? decodeJwt<{ name?: string; email?: string }>(token) : null;
  return `${(payload?.name ?? '').trim()}${SEPARATOR}${payload?.email ?? ''}`;
}

function subscribe(onChange: () => void) {
  window.addEventListener('profile-updated', onChange);
  return () => window.removeEventListener('profile-updated', onChange);
}

export function useProfileIdentity(): UserProfile {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => SEPARATOR);
  const [name, email] = snapshot.split(SEPARATOR);

  if (name) return { name, email, initials: getInitialsFromName(name, '?') };

  // Tokens emitidos antes do back incluir o nome no JWT só trazem o email.
  const emailName = email
    .split('@')[0]
    .split(/[._-]+/)
    .join(' ');
  return { name: email || 'Meu perfil', email, initials: getInitialsFromName(emailName, '?') };
}
