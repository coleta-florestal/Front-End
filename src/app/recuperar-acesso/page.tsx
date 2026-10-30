'use client';

import { useState } from 'react';
import Button from '../../components/core/Button';
import { Input } from '@/components/core/Input';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../public/assets/apenas_circulo.png';

export default function RecuperarAcesso() {
  const [email, setEmail] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    if (!email.trim()) {
      setError('Email é obrigatório');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return false;
    }

    setError(null);
    return true;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSuccess(false);

    if (!validate()) return;

    setLoading(true);

    try {
      // Simulação da chamada da API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSuccess(true);
      setEmail('');
      setError(null);
    } catch {
      setError('Erro ao enviar as instruções. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-creme-flor px-4 py-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-xl bg-verde-mata p-8 shadow-lg">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            src={logo}
            alt="Glupta-Logo"
            className="h-20 w-20 select-none object-contain lg:h-24 lg:w-24"
            loading="eager"
          />
          <h1 className="text-2xl text-creme-flor lg:text-3xl">Recuperar Acesso</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <Input
            variant="inverted"
            label="Email"
            placeholder="amanda@glupta.com.br"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            helperText="Enviaremos um link de redefinição de senha para o seu email."
            disabled={loading}
          />

          {error && (
            <p className="flex items-center gap-1 text-sm text-coral-flor">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1" />
                <path
                  d="M7 4v4M7 10v1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {error}
            </p>
          )}

          {isSuccess && (
            <p className="flex items-center gap-1 text-sm text-creme-flor">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1" />
                <path
                  d="M4.5 7l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Instruções enviadas! Verifique seu email.
            </p>
          )}

          <Button
            label={loading ? 'Enviando...' : 'Enviar instruções'}
            className="mt-2 h-12 w-full self-center bg-[#F17C38] text-lg text-creme-flor hover:bg-[#F17C38]/90 md:w-auto"
            disabled={loading}
          />
        </form>

        <p className="text-center text-base text-creme-flor sm:text-lg">
          Voltar ao{' '}
          <Link href="/" className="font-semibold text-coral-flor hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
