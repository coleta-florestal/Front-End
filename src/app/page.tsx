'use client';

import { useState } from 'react';
import Button from '../components/core/Button';
import { Input } from '@/components/core/Input';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/assets/apenas_circulo.png';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    if (!email.trim()) {
      setError('Email ou usuário é obrigatório');
      return false;
    }

    if (!password) {
      setError('Senha é obrigatória');
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
      // Simulação da chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSuccess(true);
      setEmail('');
      setPassword('');
      setError(null);
    } catch {
      setError('Erro ao entrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-creme-flor px-4 py-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5 rounded-xl bg-verde-mata p-6 shadow-lg">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            src={logo}
            alt="Glupta-Logo"
            className="h-20 w-20 select-none object-contain lg:h-24 lg:w-24"
            loading="eager"
          />
          <h1 className="text-2xl text-creme-flor lg:text-3xl">Entrar no Glupta</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          <Input
            variant="inverted"
            label="Email ou usuário"
            placeholder="Digite seu email ou usuário"
            type="text"
            autoComplete="username"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            disabled={loading}
          />

          <div className="flex flex-col gap-1.5">
            <Input
              variant="inverted"
              label="Senha"
              placeholder="Digite sua senha"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              disabled={loading}
            />
            <div className="flex w-full justify-end">
              <Link href="/recuperar-acesso" className="text-sm text-creme-flor/70 hover:underline">
                Esqueceu sua senha?
              </Link>
            </div>
          </div>

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
              Login realizado com sucesso!
            </p>
          )}

          <Button
            label={loading ? 'Entrando...' : 'Entrar'}
            className="h-12 w-full self-center bg-[#F17C38] text-lg text-creme-flor hover:bg-[#F17C38]/90 md:w-auto"
            disabled={loading}
          />
        </form>

        <p className="text-center text-base text-creme-flor sm:text-lg">
          Não possui uma conta?{' '}
          <Link href="/cadastro" className="font-semibold text-coral-flor hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
