'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/core/Button';

interface RemoveEquationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function RemoveEquationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: RemoveEquationModalProps) {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen || !isMounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[#FAF8F3] p-8 shadow-xl">
        <header className="mb-4 flex items-center gap-3 text-[#A84A3F]">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
            />
          </svg>
          <h2 className="font-serif text-xl font-bold">
            Tem certeza que deseja remover a equação?
          </h2>
        </header>

        <div className="mb-8 rounded-xl border border-[#E8D499] bg-[#FDF6E1] p-4 text-sm font-medium text-[#8F7425]">
          <p>
            Depois de removida, a equação será eliminada do sistema. Será necessário cadastrá-la
            novamente caso deseje utilizá-la no futuro.
          </p>
        </div>

        <footer className="flex items-center justify-between gap-4">
          <Button
            type="button"
            label="Cancelar"
            onClick={onClose}
            disabled={isLoading}
            className="w-full rounded-xl border-2 border-[#D7D0C2] bg-transparent px-6 py-2.5 text-sm font-bold text-[#2C5F2D] transition-colors hover:bg-[#E4EDE2]/50 disabled:opacity-60"
          />
          <Button
            type="button"
            label={isLoading ? 'Removendo...' : 'Sim, remover equação'}
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full rounded-xl bg-[#A84A3F] px-6 py-2.5 text-sm font-bold text-[#FAF8F3] transition-colors hover:bg-[#8A3A31] disabled:opacity-60"
          />
        </footer>
      </div>
    </div>
  );
}
