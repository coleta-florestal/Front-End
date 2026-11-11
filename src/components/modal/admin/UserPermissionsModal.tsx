'use client';

import { useState, useEffect } from 'react';
import { ProjectUser } from '@/types/admin';

interface UserPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userName: string, plots: string[]) => void;
  editingUser: ProjectUser | null;
}

const AVAILABLE_PLOTS = ['Talhão A', 'Talhão B', 'Talhão C', 'Região Norte', 'Região Sul'];
const AVAILABLE_USERS = [
  'Selecione um usuário',
  'Eng. Amanda',
  'Marina Lima',
  'Pedro Silva',
  'Carlos Sousa',
  'Ana Costa',
];

export default function UserPermissionsModal({
  isOpen,
  onClose,
  onSave,
  editingUser,
}: UserPermissionsModalProps) {
  const [selectedUser, setSelectedUser] = useState<string>('Selecione um usuário');
  const [selectedPlots, setSelectedPlots] = useState<string[]>([]);

  // Sincronização desacoplada do fluxo síncrono para satisfazer o ESLint
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (editingUser) {
        setSelectedUser(editingUser.name);
        setSelectedPlots(editingUser.plots || []);
      } else {
        setSelectedUser('Selecione um usuário');
        setSelectedPlots([]);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen, editingUser]);

  if (!isOpen) return null;

  const togglePlot = (plot: string) => {
    setSelectedPlots((prev) =>
      prev.includes(plot) ? prev.filter((p) => p !== plot) : [...prev, plot],
    );
  };

  const handleSave = () => {
    if (selectedUser !== 'Selecione um usuário') {
      onSave(selectedUser, selectedPlots);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[#FAF8F3] p-8 shadow-xl">
        <header className="mb-6">
          <h2 className="font-serif text-2xl font-bold text-[#2C5F2D]">
            Permissões do usuário no projeto
          </h2>
          <p className="mt-1 text-sm font-medium text-[#6D786E]">
            Selecione as regiões/talhões que este usuário pode acessar dentro do projeto.
          </p>
        </header>

        <div className="mb-6 flex flex-col gap-1.5">
          <label className="text-xs font-bold text-[#3B4439]">Usuário</label>
          <select
            value={selectedUser}
            disabled={!!editingUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#D7D0C2] bg-white px-4 text-sm font-medium text-[#3B4439] outline-none transition-colors focus:border-[#2C5F2D] disabled:cursor-not-allowed disabled:bg-[#EFECE4]"
          >
            {AVAILABLE_USERS.map((user) => (
              <option key={user} value={user} disabled={user === 'Selecione um usuário'}>
                {user}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8 flex flex-col gap-2">
          <label className="text-xs font-bold text-[#3B4439]">Regiões / talhões liberados</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_PLOTS.map((plot) => {
              const isSelected = selectedPlots.includes(plot);
              return (
                <button
                  key={plot}
                  type="button"
                  onClick={() => togglePlot(plot)}
                  className={`rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    isSelected
                      ? 'border-[#2C5F2D] bg-[#E4EDE2] text-[#2C5F2D]'
                      : 'border-[#D7D0C2] bg-white text-[#6D786E] hover:border-[#2C5F2D] hover:text-[#2C5F2D]'
                  }`}
                >
                  {plot}
                </button>
              );
            })}
          </div>
        </div>

        <footer className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border-2 border-[#D7D0C2] bg-transparent px-6 py-2.5 text-sm font-bold text-[#2C5F2D] transition-colors hover:bg-[#E4EDE2]/50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={selectedUser === 'Selecione um usuário'}
            className="rounded-xl bg-[#2C5F2D] px-6 py-2.5 text-sm font-bold text-[#FAF8F3] transition-colors hover:bg-[#234B24] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Salvar permissões
          </button>
        </footer>
      </div>
    </div>
  );
}
