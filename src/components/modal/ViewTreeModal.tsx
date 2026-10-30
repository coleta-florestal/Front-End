'use client';

import { useEffect } from 'react';
import { TreeData } from '../trees/TreeForm';
import Button from '../core/Button';
import { Close } from '../core/Icons';

export interface ViewTreeModalProps {
  isOpen: boolean;
  tree: TreeData | null;
  fazenda: string;
  talhao: string;
  parcela: string;
  onClose: () => void;
  onEdit: (tree: TreeData) => void;
  onDelete: (tree: TreeData) => void;
}

const QUALIDADE_LABELS: Record<string, string> = {
  NORMAL: 'Normal',
  'BIFURCADA_ACIMA_1.3M': 'Bifurcada acima de 1,3m',
  'BIFURCADA_ABAIXO_1.3M': 'Bifurcada abaixo de 1,3m',
  INCLINADA: 'Inclinada',
  MORTA: 'Morta',
  FALHA: 'Falha',
  PROBLEMAS_FITOSSANITARIOS: 'Problemas fitossanitários',
  QUEBRADA: 'Quebrada',
  OUTRO: 'Outro',
};

export function ViewTreeModal({
  isOpen,
  tree,
  fazenda,
  talhao,
  parcela,
  onClose,
  onEdit,
  onDelete,
}: ViewTreeModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="view-tree-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        id="view-tree-modal"
        className="w-full max-w-md overflow-hidden rounded-3xl border border-[#e7e2d8] bg-[#faf7f0] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e7e2d8] px-6 py-4 gap-4">
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#e7e2d8] px-2 py-1 text-xs lg:text-sm text-[#5c5c5c]">
              {fazenda}
            </span>
            <span className="mx-0.5 text-xs text-[#5c5c5c]">›</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-[#e7e2d8] px-2 py-1 text-xs lg:text-sm text-[#5c5c5c]">
              {talhao}
            </span>
            <span className="mx-0.5 text-xs text-[#5c5c5c]">›</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-verde-mata px-2 py-1 text-xs lg:text-sm text-creme-flor">
              {parcela}
            </span>
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

        <div className="flex flex-col gap-6 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-creme-flor p-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-verde-mata"
              >
                <circle cx="12" cy="12" r="10" stroke="#2C5F2D" strokeWidth="2" />
                <path d="M12 6v6M12 14v1" stroke="#2C5F2D" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-verde-mata leading-tight font-newsreader">
                Árvore {tree?.numero}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-md bg-verde-eucalipto/20 px-2 py-0.5 text-xs font-medium text-verde-mata">
                {QUALIDADE_LABELS[tree?.qualidade ?? ''] ?? tree?.qualidade}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#e7e2d8] bg-white p-4">
              <p className="text-xs font-semibold text-[#5c5c5c] uppercase tracking-wider">
                Altura
              </p>
              <p className="text-2xl font-bold text-verde-mata mt-1">
                {parseFloat(tree?.altura ?? '0').toFixed(1)} m
              </p>
              <p className="text-xs text-[#5c5c5c] mt-1">Altura total</p>
            </div>
            <div className="rounded-xl border border-[#e7e2d8] bg-white p-4">
              <p className="text-xs font-semibold text-[#5c5c5c] uppercase tracking-wider">DAP</p>
              <p className="text-2xl font-bold text-verde-mata mt-1">
                {parseFloat(tree?.dap ?? '0').toFixed(1)} cm
              </p>
              <p className="text-xs text-[#5c5c5c] mt-1">
                DAP {parseFloat(tree?.dap ?? '0').toFixed(1)} cm
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#5c5c5c] mb-2 uppercase tracking-wider">
              Observações
            </p>
            <div className="rounded-xl border border-[#e7e2d8] bg-white p-4">
              <p className="text-[#3d3d3d]">
                {tree?.observacoes ? tree.observacoes : 'Nenhuma observação registrada.'}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e7e2d8] px-6 py-4 w-full flex flex-col gap-2 sm:flex-row justify-between">
          <Button
            label="Fechar"
            onClick={onClose}
            className="border border-[#D7D0C2] bg-creme-flor text-verde-mata hover:bg-[#f0ede5] mr-2"
          />
          <Button
            label="Editar árvore"
            onClick={() => {
              onClose();
              onEdit(tree!);
            }}
            className="bg-verde-mata text-creme-flor hover:bg-[#245225]"
          />
          <Button
            label="Excluir"
            onClick={() => {
              onDelete(tree!);
              onClose();
            }}
            className="border border-coral-flor bg-white text-coral-flor hover:bg-coral-flor/5"
          />
        </div>
      </div>
    </div>
  );
}
