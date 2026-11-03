'use client';

import Button from '@/components/core/Button';
import { Close } from '@/components/core/Icons';

export interface ReopenParcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  parcelaNumero: string;
}

export function ReopenParcelModal({
  isOpen,
  onClose,
  onConfirm,
  parcelaNumero,
}: ReopenParcelModalProps) {
  if (!isOpen) return null;

  return (
    <div
      id="reopen-parcel-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        id="reopen-parcel-modal"
        className="w-full max-w-md overflow-hidden rounded-3xl border border-[#e7e2d8] bg-[#faf7f0] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e7e2d8] px-6 py-4 gap-4">
          <h2 className="text-2xl font-semibold text-verde-mata font-newsreader">
            Reabrir Parcelas {parcelaNumero}?
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="border-none bg-transparent p-0 font-semibold text-[#3d3d3d] shadow-none hover:bg-[#f0ede5]"
            aria-label="Fechar modal"
          >
            <Close size={16} />
          </button>
        </div>

        <div className="px-6 py-4">
          <p className="text-[#848079] text-md mb-6 leading-relaxed">
            A parcela volta para em andamento e passa a aceitar novos registros. O evento é
            registrado na auditoria com seu usuário e a data.
          </p>

          <div className="mb-8 p-4 rounded-xl border border-[#f2dcd8] bg-[#fdecea]">
            <div className="flex items-center gap-3">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#CC7A60] shrink-0"
              >
                <path
                  d="M12 2C7.58 2 4 5.58 4 10C4 14.42 7.58 18 12 18C16.42 18 20 14.42 20 10C20 5.58 16.42 2 12 2ZM12 11.5L14 9.5L14 7H10V9.5L12 11.5Z"
                  fill="#CC7A60"
                />
              </svg>
              <span className="text-[#8B4A3E] text-sm font-medium">
                Reabrir é uma exceção: a parcela concluída volta a aceitar edições.
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-[#e7e2d8]">
            <Button
              label="Cancelar"
              onClick={onClose}
              className="border border-[#D7D0C2] bg-white text-verde-mata hover:bg-[#f0ede5] rounded-xl px-6 py-3 font-semibold"
            />
            <Button
              label="Reabrir parcela"
              onClick={onConfirm}
              className="bg-verde-mata text-creme-flor hover:bg-[#1E4320] rounded-xl px-6 py-3 font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
