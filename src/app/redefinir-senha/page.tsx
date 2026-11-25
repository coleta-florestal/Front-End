'use client';

import { use, useState } from 'react';
import Button from '../../components/core/Button';
import { Input } from '@/components/core/Input';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../public/assets/apenas_circulo.png';
import { resetPassword } from '../api/api';
import { getPasswordError } from '@/lib/utils';

interface RedefinirSenhaProps {
  searchParams: Promise<{ token?: string | string[] }>;
}

export default function RedefinirSenha({ searchParams }: RedefinirSenhaProps) {
  const { token: rawToken } = use(searchParams);
  const token = typeof rawToken === 'string' ? rawToken.trim() : '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const passwordError = getPasswordError(password);
    if (passwordError) {
      setError(passwordError);
      return false;
    }
    if (!confirmPassword) {
      setError('Confirmação de senha é obrigatória');
      return false;
    }
    if (confirmPassword !== password) {
      setError('As senhas não coincidem');
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
      await resetPassword(token, password);

      setIsSuccess(true);
      setPassword('');
      setConfirmPassword('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao redefinir a senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-creme-flor px-4 py-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-md flex-col gap-5 rounded-xl bg-verde-mata p-8 shadow-lg">
        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            src={logo}
            alt="Glupta-Logo"
            className="h-20 w-20 select-none object-contain lg:h-24 lg:w-24"
            loading="eager"
          />
          <h1 className="text-2xl text-creme-flor lg:text-3xl">Redefinir Senha</h1>
        </div>

        {!token ? (
          <p className="text-center text-base text-creme-flor">
            Link inválido ou expirado. Peça um novo link de recuperação.
          </p>
        ) : isSuccess ? (
          <p className="flex items-center justify-center gap-1 text-base text-creme-flor">
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
            Senha redefinida com sucesso!
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
            <Input
              variant="inverted"
              label="Nova senha"
              type="password"
              placeholder="Digite sua nova senha"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              helperText="Mínimo 8 caracteres, com maiúscula, minúscula, número e símbolo"
              disabled={loading}
            />

            <Input
              variant="inverted"
              label="Confirme sua senha"
              type="password"
              placeholder="Digite sua senha novamente"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(null);
              }}
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

            <Button
              type="submit"
              label={loading ? 'Redefinindo...' : 'Redefinir senha'}
              className="mt-4 h-12 w-full self-center bg-[#F17C38] text-lg text-creme-flor hover:bg-[#F17C38]/90 md:w-auto"
              disabled={loading}
            />
          </form>
        )}

        <p className="text-center text-base text-creme-flor sm:text-lg">
          {isSuccess ? (
            <Link href="/" className="font-semibold text-coral-flor hover:underline">
              Ir para o login
            </Link>
          ) : (
            <>
              Link expirado?{' '}
              <Link
                href="/recuperar-acesso"
                className="font-semibold text-coral-flor hover:underline"
              >
                Pedir novo link
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
