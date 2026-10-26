'use client';

import { useState } from 'react';
import Button from '../../components/core/Button';
import { Input } from '@/components/core/Input';
import Image from 'next/image';
import logo from '../../../public/assets/apenas_circulo.png';

export default function Home() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (value: string) => {
    if (!value) {
      setError('Senha é obrigatória');
      return;
    }
    if (value.length < 8) {
      setError('Senha deve ter pelo menos 8 caracteres');
      return;
    }
    if (!/[A-Z]/.test(value)) {
      setError('Senha deve conter pelo menos uma maiúscula');
      return;
    }
    if (!/[a-z]/.test(value)) {
      setError('Senha deve conter pelo menos uma minúscula');
      return;
    }
    if (!/[0-9]/.test(value)) {
      setError('Senha deve conter pelo menos um número');
      return;
    }
    setError(null);
    return '';
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) {
      setError('Confirmação de senha é obrigatória');
      return;
    }
    if (value !== password) {
      setError('As senhas não coincidem');
      return;
    }
    setError(null);
    return '';
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validatePassword || !validateConfirmPassword) return;

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    setPassword('');
    setConfirmPassword('');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-creme-flor px-4 py-6 sm:py-8">
      <div className="flex h-full w-full max-w-130 flex-col gap-5 rounded-xl bg-linear-to-br from-[#245829] to-[#3D7E3F] p-6 shadow-lg lg:h-130 lg:w-130 lg:gap-6 lg:p-11">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            src={logo}
            alt="Glupta-Logo"
            className="h-20 w-20 select-none object-contain lg:h-24 lg:w-24"
            loading="eager"
          />
          <h1 className="text-2xl text-creme-flor lg:text-3xl">Redefinir Senha</h1>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            label="Nova senha"
            type="password"
            placeholder="Digite sua nova senha"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText="Mínimo 8 caracteres, com maiúscula, minúscula e número"
            disabled={loading}
          />
          <Input
            label="Confirme sua senha"
            type="password"
            placeholder="Digite sua senha novamente"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
          />
          {error ? (
            <p className="text-sm text-coral-flor flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6.5" stroke="currentColor" stroke-width="1" />
                <path
                  d="M7 4v4M7 10v1"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              Erro ao redefinir. Tente novamente.
            </p>
          ) : (
            <p className="text-sm text-coral-flor flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6.5" stroke="currentColor" stroke-width="1" />
                <path
                  d="M4.5 7l2 2 4-4"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              Senha redefinida com sucesso!
            </p>
          )}
          <Button
            label={loading ? 'Redefinindo...' : 'Redefinir senha'}
            className="mt-4 h-12 w-full text-lg self-center bg-[#F17C38] text-creme-flor hover:bg-[#F17C38]/90 lg:mt-8 lg:w-52.75"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}
