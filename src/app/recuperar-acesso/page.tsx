'use client';

import { useState } from 'react';
import Button from '../../components/core/Button';
import { Input } from '@/components/core/Input';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../public/assets/apenas_circulo.png';

export default function Home() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    if (!value) {
      setError('Email é obrigatório');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setError('Email inválido');
      return;
    }
    setError(null);
    return '';
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) return;

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real app, check API response
    setLoading(false);
    setEmail('');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-creme-flor px-4 py-6 sm:py-8">
      <div className="flex h-auto w-full max-w-130 flex-col gap-6 rounded-xl bg-linear-to-br from-[#245829] to-[#3D7E3F] p-6 shadow-lg lg:h-130 lg:w-130 lg:gap-10 lg:p-11">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            src={logo}
            alt="Glupta-Logo"
            className="h-20 w-20 select-none object-contain lg:h-24 lg:w-24"
            loading="eager"
          />
          <h1 className="text-2xl text-creme-flor lg:text-3xl">Recuperar Acesso</h1>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            label="Email"
            placeholder="amanda@glupta.com.br"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            helperText="Enviaremos um link de redefinição de senha para o seu email."
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
              Erro ao enviar. Tente novamente.
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
              Instruções enviadas! Verifique seu email.
            </p>
          )}
        </form>
        <div className="mt-2 flex flex-col gap-4 lg:mt-4">
          <Button
            label={loading ? 'Enviando...' : 'Enviar instruções'}
            className="h-12 w-full text-lg self-center bg-[#F17C38] text-creme-flor hover:bg-[#F17C38]/90 lg:w-50.5"
            disabled={loading}
          />
          <p className="text-center text-base text-creme-flor sm:text-lg">
            Voltar ao{' '}
            <Link href="/" className="text-coral-flor font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
