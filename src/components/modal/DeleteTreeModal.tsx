'use client';

import { useEffect } from 'react';
import { TreeData } from '../trees/TreeForm';
import Button from '../core/Button';
import { Close } from '../core/Icons';

export interface DeleteTreeModalProps {
  isOpen: boolean;
  tree: TreeData | null;
  parcela: string;
  onConfirm: (tree: TreeData) => void;
  onClose: () => void;
}

export function DeleteTreeModal({
  isOpen,
  tree,
  parcela,
  onConfirm,
  onClose,
}: DeleteTreeModalProps) {
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
      id="delete-tree-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        id="delete-tree-modal"
        className="w-full max-w-md overflow-hidden rounded-3xl border border-[#e7e2d8] bg-[#faf7f0] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e7e2d8] px-6 py-4">
          <h2 className="text-xl font-bold text-verde-mata">Excluir a Árvore {tree?.numero}?</h2>
          <button
            type="button"
            onClick={onClose}
            className="border-none bg-transparent p-0 font-semibold text-[#3d3d3d] shadow-none hover:bg-[#f0ede5]"
            aria-label="Fechar modal"
          >
            <Close size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-4">
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#e7e2d8] px-2 py-1 text-sm text-[#5c5c5c]">
              Fazenda
            </span>
            <span className="mx-0.5 text-xs text-[#5c5c5c]">›</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-[#e7e2d8] px-2 py-1 text-sm text-[#5c5c5c]">
              Talhão
            </span>
            <span className="mx-0.5 text-xs text-[#5c5c5c]">›</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-[#e7e2d8] px-2 py-1 text-sm text-[#5c5c5c]">
              {parcela}
            </span>
          </div>

          <p className="text-[#3d3d3d] text-sm leading-relaxed">
            A árvore será removida de {parcela} e o progresso da parcela será atualizado. A exclusão
            fica registrada na auditoria.
          </p>
        </div>

        <div className="flex flex-col justify-end gap-2 border-t border-[#e7e2d8] px-6 py-4 sm:flex-row">
          <Button
            label="Cancelar"
            onClick={onClose}
            className="border border-[#D7D0C2] bg-creme-flor text-verde-mata hover:bg-[#f0ede5]"
          />
          <Button
            label="Excluir árvore"
            onClick={() => {
              if (tree) onConfirm(tree);
              onClose();
            }}
            className="bg-[#a96a50] text-white hover:bg-[#945a45]"
          />
        </div>
      </div>
    </div>
  );
}
