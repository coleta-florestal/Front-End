import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-family': ['font-newsreader', 'font-sans', 'font-mono'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

// Espelha o IsStrongPassword do back (cadastro, redefinição e perfil), para o erro aparecer antes do envio.
export function getPasswordError(password: string): string | null {
  if (!password) return 'Senha é obrigatória';
  if (password.length < 8) return 'Senha deve ter pelo menos 8 caracteres';
  if (!/[A-Z]/.test(password)) return 'Senha deve conter pelo menos uma letra maiúscula';
  if (!/[a-z]/.test(password)) return 'Senha deve conter pelo menos uma letra minúscula';
  if (!/[0-9]/.test(password)) return 'Senha deve conter pelo menos um número';
  if (!/[^A-Za-z0-9\s]/.test(password))
    return 'Senha deve conter pelo menos um caractere especial (!@#$...)';
  return null;
}
