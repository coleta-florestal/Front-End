'use client';

import { useEffect } from 'react';
import Button from '../core/Button';
import { Close } from '../core/Icons';

export interface CompleteParcelModalProps {
  isOpen: boolean;
  fazenda: string;
  talhao: string;
  parcela: string;
  arvoresRegistradas: number;
  metragemTotal: string;
  metaReferencia: number;
  onConfirm: () => void;
  onClose: () => void;
}

export function CompleteParcelModal({
  isOpen,
  fazenda,
  talhao,
  parcela,
  arvoresRegistradas,
  metragemTotal,
  metaReferencia,
  onConfirm,
  onClose,
}: CompleteParcelModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const faltam = Math.max(0, metaReferencia - arvoresRegistradas);

  return (
    <div
      id="complete-parcel-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        id="complete-parcel-modal"
        className="w-full max-w-sm max-h-[calc(100vh-2rem)] overflow-y-auto md:max-w-xl rounded-3xl border border-[#e7e2d8] bg-[#faf7f0] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e7e2d8] px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="rounded-lg bg-[#FDECEA]/30 p-2 shrink-0">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-coral-flor"
              >
                <path
                  d="M6 12L3 2L6 2L10 4L14 2L17 2L14 12L17 12L17 22L14 22L14 12L10 12L10 22L7 22L7 12L4 12L4 22L1 22L1 12L6 12Z"
                  fill="#D9765F"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-verde-mata leading-tight font-newsreader min-w-0">
              Concluir Parcela {parcela}?
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border-none bg-transparent p-0 font-semibold text-[#3d3d3d] shadow-none hover:bg-[#f0ede5]"
            aria-label="Fechar modal"
          >
            <Close size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-4 py-4 sm:px-6 sm:py-4">
          <p className="text-[#3d3d3d] text-sm leading-relaxed">
            Depois de concluída, {parcela} deixa de aceitar novos registros de árvore. Reabrir é uma
            ação separada e fica registrada na auditoria.
          </p>

          <div className="rounded-xl border border-[#e7e2d8] bg-white p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="text-[#5c5c5c] text-sm shrink-0">Fazenda:</span>
                <span className="font-semibold text-[#3d3d3d] min-w-0">{fazenda}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="text-[#5c5c5c] text-sm shrink-0">Talhão:</span>
                <span className="font-semibold text-[#3d3d3d] min-w-0">{talhao}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="text-[#5c5c5c] text-sm shrink-0">Parcela:</span>
                <span className="font-semibold text-[#3d3d3d] min-w-0">{parcela}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="text-[#5c5c5c] text-sm shrink-0">Árvores registradas:</span>
                <span className="font-semibold text-[#3d3d3d] min-w-0">
                  {arvoresRegistradas} árvores
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="text-[#5c5c5c] text-sm shrink-0">Metragem total:</span>
                <span className="font-semibold text-[#3d3d3d] min-w-0">Σ {metragemTotal} m</span>
              </div>
            </div>
          </div>

          {faltam > 0 && (
            <div className="rounded-xl border border-[#F5E7D1] bg-[#FBF3E4]/50 p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-[#B4834B] shrink-0 mt-0.5 sm:mt-0"
                >
                  <path
                    d="M12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22ZM12 20C7.582 20 4 16.418 4 12C4 7.582 7.582 4 12 4C16.418 4 20 7.582 20 12C20 16.418 16.418 20 12 20ZM12 18C14.209 18 16 16.209 16 14C16 11.791 14.209 10 12 10C9.791 10 8 11.791 8 14C8 16.209 9.791 18 12 18ZM12 16L13.41 17.41L14.83 15.99L16.24 17.4L14.83 18.81L13.41 20.22L12 18.81L10.59 20.22L9.17 18.81L7.76 17.4L9.17 15.99L10.59 17.41L12 16Z"
                    fill="#B4834B"
                  />
                </svg>
                <p className="text-[#8a6d3b] text-sm leading-relaxed min-w-0">
                  Faltam {faltam} árvore{faltam > 1 ? 's' : ''} para a meta de {metaReferencia}.
                  Você pode concluir assim mesmo, mas a parcela ficará bloqueada para novos
                  registros.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col justify-end gap-2 border-t border-[#e7e2d8] px-6 py-4 sm:flex-row">
            <Button
              label="Voltar e continuar coletando"
              onClick={onClose}
              className="border border-[#D7D0C2] bg-creme-flor text-verde-mata hover:bg-[#f0ede5]"
            />
            <Button
              label="Sim, concluir parcela"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="bg-[#a96a50] text-white hover:bg-[#945a45]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
