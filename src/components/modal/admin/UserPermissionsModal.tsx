'use client';

import { useState } from 'react';

export interface UserOption {
  id: string;
  name: string;
}

interface UserPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string) => void;
  users: UserOption[];
}

export default function UserPermissionsModal({
  isOpen,
  onClose,
  onSave,
  users,
}: UserPermissionsModalProps) {
  const [selectedUserId, setSelectedUserId] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!selectedUserId) return;
    onSave(selectedUserId);
    setSelectedUserId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[#FAF8F3] p-8 shadow-xl">
        <header className="mb-6">
          <h2 className="font-serif text-2xl font-bold text-verde-mata">Associar usuário</h2>
          <p className="mt-1 text-sm font-medium text-[#6D786E]">
            O usuário passa a enxergar esta fazenda na plataforma.
          </p>
        </header>

        <div className="mb-8 flex flex-col gap-1.5">
          <label htmlFor="project-user" className="text-sm font-bold text-[#3B4439]">
            Usuário
          </label>
          <select
            id="project-user"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#D7D0C2] bg-white px-4 text-sm font-medium text-[#3B4439] outline-none transition-colors focus:border-verde-mata"
          >
            <option value="" disabled>
              Selecione um usuário
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <footer className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border-2 border-[#D7D0C2] bg-transparent px-6 py-2.5 text-sm font-bold text-verde-mata transition-colors hover:bg-[#E4EDE2]/50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!selectedUserId}
            className="rounded-xl bg-verde-mata px-6 py-2.5 text-sm font-bold text-[#FAF8F3] transition-colors hover:bg-[#234B24] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Associar
          </button>
        </footer>
      </div>
    </div>
  );
}
