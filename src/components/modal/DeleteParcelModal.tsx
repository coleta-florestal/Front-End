'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/core/Button';
import { PrismaSubPlotRecord } from '@/types/farm';

export interface DeleteParcelModalProps {
  isOpen: boolean;
  parcela: PrismaSubPlotRecord;
  onConfirm: (parcela: PrismaSubPlotRecord) => void | Promise<void>;
  onClose: () => void;
}

export function DeleteParcelModal({ isOpen, parcela, onConfirm, onClose }: DeleteParcelModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || loading) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      await onConfirm(parcela);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível excluir a parcela');
    } finally {
      setLoading(false);
    }
  };

  const tituloParcela = parcela.name.toLowerCase().startsWith('parcela')
    ? parcela.name
    : `Parcela ${parcela.name}`;

  return (
    <div
      id="delete-parcel-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        id="delete-parcel-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-parcel-modal-title"
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-[#e7e2d8] bg-[#faf7f0] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="delete-parcel-modal-title"
          className="text-2xl font-semibold text-verde-mata font-newsreader"
        >
          Excluir a {tituloParcela}?
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-[#3d3d3d]">
          A parcela será removida junto com as árvores registradas nela. Essa ação não pode ser
          desfeita.
        </p>

        {error && (
          <p className="mt-4 flex items-center gap-1 text-sm text-coral-flor" role="alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Button
            label="Cancelar"
            onClick={onClose}
            disabled={loading}
            className="border border-[#D7D0C2] bg-creme-flor text-verde-mata hover:bg-[#f0ede5] rounded-xl px-6 py-3 font-semibold"
          />
          <Button
            label={loading ? 'Excluindo...' : 'Excluir Parcela'}
            onClick={handleConfirm}
            disabled={loading}
            className="bg-[#a96a50] text-white hover:bg-[#945a45] rounded-xl px-6 py-3 font-semibold"
          />
        </div>
      </div>
    </div>
  );
}
