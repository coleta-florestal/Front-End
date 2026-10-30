'use client';

import { useState } from 'react';
import Button from '../../components/core/Button';
import { Input } from '@/components/core/Input';
import Image from 'next/image';
import logo from '../../../public/assets/apenas_circulo.png';

export default function RedefinirSenha() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    if (!password) {
      setError('Senha é obrigatória');
      return false;
    }
    if (password.length < 8) {
      setError('Senha deve ter pelo menos 8 caracteres');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setError('Senha deve conter pelo menos uma letra maiúscula');
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setError('Senha deve conter pelo menos uma letra minúscula');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setError('Senha deve conter pelo menos um número');
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
      // Simulação da chamada da API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSuccess(true);
      setPassword('');
      setConfirmPassword('');
      setError(null);
    } catch {
      setError('Erro ao redefinir a senha. Tente novamente.');
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
            helperText="Mínimo 8 caracteres, com maiúscula, minúscula e número"
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
              Senha redefinida com sucesso!
            </p>
          )}

          <Button
            label={loading ? 'Redefinindo...' : 'Redefinir senha'}
            className="mt-4 h-12 w-full self-center bg-[#F17C38] text-lg text-creme-flor hover:bg-[#F17C38]/90 md:w-auto"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
}
