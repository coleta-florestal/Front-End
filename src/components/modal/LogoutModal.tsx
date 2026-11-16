'use client';

import { useEffect } from 'react';
import Button from '@/components/core/Button';
import { clearAuthCookies } from '@/lib/auth';

export interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogoutModal({ isOpen, onClose }: LogoutModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    clearAuthCookies();
    window.location.href = '/';
  };

  return (
    <div
      id="logout-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        id="logout-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#e7e2d8] bg-[#faf7f0] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="logout-modal-title"
          className="text-2xl font-semibold text-verde-mata font-newsreader"
        >
          Sair da conta?
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-[#3d3d3d]">
          Você precisará entrar novamente para acessar o Glupta.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:justify-between">
          <Button
            label="Cancelar"
            onClick={onClose}
            className="border border-[#D7D0C2] bg-creme-flor text-verde-mata hover:bg-[#f0ede5] rounded-xl px-6 py-3 font-semibold"
          />
          <Button
            label="Sair da conta"
            onClick={handleConfirm}
            className="bg-[#a96a50] text-white hover:bg-[#945a45] rounded-xl px-6 py-3 font-semibold"
          />
        </div>
      </div>
    </div>
  );
}
