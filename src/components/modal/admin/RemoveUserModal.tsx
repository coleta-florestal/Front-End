'use client';

interface RemoveUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RemoveUserModal({ isOpen, onClose, onConfirm }: RemoveUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-[500px] rounded-2xl bg-[#FAF8F3] p-8 shadow-xl">
        <header className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FDECE9] text-[#C85A46]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
          </div>
          <h2 className="font-serif text-xl font-bold text-[#2C5F2D]">
            Tem certeza que deseja remover o usuário?
          </h2>
        </header>

        <div className="mb-8 rounded-xl border border-[#F2C994] bg-[#FFF8E7] p-4 text-[#996A27] flex gap-3">
          <div className="shrink-0 mt-0.5">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <p className="text-xs font-semibold leading-relaxed">
            Depois de removido, a conta será eliminada do sistema. Será necessária uma nova
            solicitação de cadastro para acessar o Glupta novamente
          </p>
        </div>

        <footer className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border-2 border-[#D7D0C2] bg-transparent px-6 py-2.5 text-sm font-bold text-[#2C5F2D] transition-colors hover:bg-[#E4EDE2]/50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-xl bg-[#A55F4D] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#8B4C3C]"
          >
            Sim, remover conta
          </button>
        </footer>
      </div>
    </div>
  );
}
