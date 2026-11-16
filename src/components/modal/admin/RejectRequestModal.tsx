'use client';

interface RejectRequestModalProps {
  isOpen: boolean;
  userName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RejectRequestModal({
  isOpen,
  userName,
  onClose,
  onConfirm,
}: RejectRequestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-[500px] rounded-2xl bg-[#FAF8F3] p-6 shadow-xl sm:p-8">
        <h2 className="mb-2 font-serif text-xl font-bold text-verde-mata">
          Recusar a solicitação de {userName}?
        </h2>
        <p className="mb-8 text-sm leading-relaxed text-[#3B4439]">
          A solicitação sai da lista de pendentes e a conta não é criada.
        </p>

        <footer className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border-2 border-[#D7D0C2] bg-transparent px-6 py-2.5 text-sm font-bold text-verde-mata transition-colors hover:bg-[#E4EDE2]/50"
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
            Recusar solicitação
          </button>
        </footer>
      </div>
    </div>
  );
}
