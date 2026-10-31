'use client';

import { useEffect } from 'react';
import type { AdminUser } from '../admin/UserRow';
import Button from '../core/Button';
import { Flag, Warning } from '../core/Icons';

export interface RemoveUserModalProps {
  user: AdminUser | null;
  onConfirm: (user: AdminUser) => void;
  onClose: () => void;
}

export function RemoveUserModal({ user, onConfirm, onClose }: RemoveUserModalProps) {
  useEffect(() => {
    if (!user) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [user, onClose]);

  if (!user) return null;

  return (
    <div
      id="remove-user-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        id="remove-user-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-user-modal-title"
        className="flex w-full max-w-lg flex-col gap-6 rounded-3xl border border-[#e7e2d8] bg-[#faf7f0] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="shrink-0 rounded-xl bg-[#FBECE8] p-3 text-[#a96a50]">
            <Flag />
          </div>
          <h2
            id="remove-user-modal-title"
            className="font-newsreader text-xl font-semibold text-verde-mata sm:text-2xl"
          >
            Tem certeza que deseja remover o usuário?
          </h2>
        </div>

        <div className="flex gap-3 rounded-xl border border-[#E8D5A8] bg-[#FAF1DE] p-4 text-sm text-[#7A5A1E]">
          <Warning className="shrink-0" />
          <p>
            Depois de removido, a conta será eliminada do sistema. Será necessária uma nova
            solicitação de cadastro para acessar o Glupta novamente
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button label="Cancelar" variant="outline" onClick={onClose} />
          <Button label="Sim, remover conta" variant="danger" onClick={() => onConfirm(user)} />
        </div>
      </div>
    </div>
  );
}
