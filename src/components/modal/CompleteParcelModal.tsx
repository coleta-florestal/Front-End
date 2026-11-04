'use client';

import { useState } from 'react';
import Button from '@/components/core/Button';
import { Close } from '@/components/core/Icons';

export interface CompleteParcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  parcelaNumero: string;
  fazenda: string;
  talhao: string;
  arvoresRegistradas: number;
  metragemTotal: number;
  metaReferencia: number;
  arvoresFaltando: number;
}

export function CompleteParcelModal({
  isOpen,
  onClose,
  onConfirm,
  parcelaNumero,
  fazenda,
  talhao,
  arvoresRegistradas,
  metragemTotal,
  metaReferencia,
  arvoresFaltando,
}: CompleteParcelModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);

    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível concluir a parcela');
    } finally {
      setLoading(false);
    }
  };

  const numeroSeguro = parcelaNumero || '';
  const faltamSeguro = arvoresFaltando || 0;

  return (
    <div
      id="complete-parcel-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        id="complete-parcel-modal"
        className="w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-[#e7e2d8] bg-[#faf7f0] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex-none flex items-center justify-between border-b border-[#e7e2d8] px-6 py-4 gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-semibold text-verde-mata font-newsreader">
              Concluir Parcela {numeroSeguro}?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border-none bg-transparent p-0 font-semibold text-[#3d3d3d] shadow-none hover:bg-[#f0ede5]"
            aria-label="Fechar modal"
          >
            <Close size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-[#848079] text-sm mb-6 leading-relaxed">
            Depois de concluída, a Parcela {numeroSeguro} deixa de aceitar novos registos de árvore.
            Reabrir é uma ação separada e fica registada na auditoria.
          </p>

          <div className="mb-8 p-4 rounded-xl border border-[#e7e2d8] bg-white">
            <div className="space-y-3 text-black">
              <div className="flex justify-between text-sm gap-2">
                <span className="text-[#848079]">Fazenda:</span>
                <span className="font-semibold text-right">{fazenda || '-'}</span>
              </div>
              <div className="flex justify-between text-sm gap-2">
                <span className="text-[#848079]">Talhão:</span>
                <span className="font-semibold text-right">{talhao || '-'}</span>
              </div>
              <div className="flex justify-between text-sm gap-2">
                <span className="text-[#848079]">Parcela:</span>
                <span className="font-semibold text-right">
                  {numeroSeguro ? `Parcela ${numeroSeguro}` : '-'}
                </span>
              </div>
              <div className="flex justify-between text-sm gap-2">
                <span className="text-[#848079]">Árvores registadas:</span>
                <span className="font-semibold text-right">{arvoresRegistradas || 0} árvores</span>
              </div>
              <div className="flex justify-between text-sm gap-2">
                <span className="text-[#848079]">Metragem total:</span>
                <span className="font-semibold text-right">{metragemTotal || 0} m</span>
              </div>
            </div>
          </div>

          <div className="mb-8 p-4 rounded-xl border border-[#f2dcd8] bg-[#fdf7ec]">
            <div className="flex items-start gap-3">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#B06A57] shrink-0 mt-0.5"
              >
                <path
                  d="M13.162 1.304C12.744.886 12.158.886 11.74 1.304l-4.763 4.763c-.584.584-.584 1.53 0 2.114l1.327 1.327-.53 1.059c-.284.568-.427.852-.427 1.136s.143.568.427 1.136l1.06 1.06c.284.284.658.427 1.031.427s.747-.143 1.031-.427l4.233-4.233c.584-.584.584-1.53 0-2.114L13.162 1.304ZM16.838 22.696c-.584.584-1.53.584-2.114 0l-1.06-1.06c-.284-.284-.427-.658-.427-1.031s.143-.747.427-1.031l.53-1.059-1.327-1.327c-.584-.584-.584-1.53 0-2.114l4.763-4.763c.584-.584 1.53-.584 2.114 0l4.763 4.763c.584.584.584 1.53 0 2.114L16.838 22.696Z"
                  fill="#B06A57"
                />
              </svg>
              <span className="text-[#8B4A3E] text-sm font-medium leading-relaxed">
                Faltam {faltamSeguro} árvores para a meta de {metaReferencia || 0}. Pode concluir
                assim mesmo, mas a parcela ficará bloqueada para novos registos.
              </span>
            </div>
          </div>

          {error && (
            <p className="mb-4 flex items-center gap-1 text-sm text-coral-flor" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-[#e7e2d8]">
            <Button
              label="Voltar e continuar coletando"
              onClick={onClose}
              className="border border-[#D7D0C2] bg-white text-verde-mata hover:bg-[#f0ede5] rounded-xl px-6 py-3 font-semibold w-full sm:w-auto"
            />
            <Button
              label={loading ? 'Concluindo...' : 'Sim, concluir parcela'}
              onClick={handleConfirm}
              disabled={loading}
              className="bg-[#B06A57] text-creme-flor hover:bg-[#9C5A47] rounded-xl px-6 py-3 font-semibold w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
