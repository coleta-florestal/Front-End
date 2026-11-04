'use client';

import { useEffect } from 'react';
import type { AccessRequest } from '../admin/PendingRequestCard';
import Button from '../core/Button';

export interface RejectRequestModalProps {
  request: AccessRequest | null;
  onConfirm: (request: AccessRequest) => void;
  onClose: () => void;
}

export function RejectRequestModal({ request, onConfirm, onClose }: RejectRequestModalProps) {
  useEffect(() => {
    if (!request) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [request, onClose]);

  if (!request) return null;

  return (
    <div
      id="reject-request-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        id="reject-request-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reject-request-modal-title"
        className="flex w-full max-w-md flex-col gap-6 rounded-3xl border border-[#e7e2d8] bg-[#faf7f0] p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <h2
            id="reject-request-modal-title"
            className="font-newsreader text-2xl font-semibold text-verde-mata"
          >
            Recusar a solicitação de {request.nome}?
          </h2>
          <p className="text-sm leading-relaxed text-[#3d3d3d]">
            A solicitação sai da lista de pendentes e a conta não é criada. A ação fica registrada
            na auditoria.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <Button label="Cancelar" variant="outline" onClick={onClose} />
          <Button label="Recusar solicitação" variant="danger" onClick={() => onConfirm(request)} />
        </div>
      </div>
    </div>
  );
}
