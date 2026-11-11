'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/core/Input';
import Button from '@/components/core/Button';

export interface EquationData {
  id?: string;
  name: string;
  b0: number;
  b1: number;
  b2: number;
  isActive: boolean;
}

interface EquationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EquationData) => void;
  editingEquation: EquationData | null;
  isLoading?: boolean;
}

export default function EquationModal({
  isOpen,
  onClose,
  onSave,
  editingEquation,
  isLoading = false,
}: EquationModalProps) {
  const [name, setName] = useState<string>('');
  const [b0, setB0] = useState<string>('');
  const [b1, setB1] = useState<string>('');
  const [b2, setB2] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (editingEquation) {
        setName(editingEquation.name);
        setB0(editingEquation.b0.toString().replace('.', ','));
        setB1(editingEquation.b1.toString().replace('.', ','));
        setB2(editingEquation.b2.toString().replace('.', ','));
        setIsActive(editingEquation.isActive);
      } else {
        setName('');
        setB0('');
        setB1('');
        setB2('');
        setIsActive(true);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isOpen, editingEquation]);

  if (!isOpen) return null;

  const handleSave = () => {
    const parseNumber = (val: string) => parseFloat(val.replace(',', '.')) || 0;

    onSave({
      ...(editingEquation?.id ? { id: editingEquation.id } : {}),
      name,
      b0: parseNumber(b0),
      b1: parseNumber(b1),
      b2: parseNumber(b2),
      isActive,
    });
  };

  const isFormValid = name.trim().length > 0 && b0 !== '' && b1 !== '' && b2 !== '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[#FAF8F3] p-8 shadow-xl">
        <header className="mb-6">
          <h2 className="font-serif text-2xl font-bold text-[#2C5F2D]">
            {editingEquation ? 'Editar equação' : 'Nova equação'}
          </h2>
        </header>

        <div className="mb-4">
          <Input
            label="Nome da equação"
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="ex. Schumacher & Hall"
          />
        </div>

        <div className="mb-6 flex gap-4">
          <Input
            label="β₀"
            type="text"
            value={b0}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setB0(e.target.value)}
            placeholder="0,0"
          />
          <Input
            label="β₁"
            type="text"
            value={b1}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setB1(e.target.value)}
            placeholder="0,0"
          />
          <Input
            label="β₂"
            type="text"
            value={b2}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setB2(e.target.value)}
            placeholder="0,0"
          />
        </div>

        <div className="mb-8 flex items-center gap-3">
          <input
            type="checkbox"
            id="status-checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-5 w-5 rounded border-[#D7D0C2] text-[#2C5F2D] focus:ring-[#2C5F2D]"
          />
          <label htmlFor="status-checkbox" className="text-sm font-medium text-[#3B4439]">
            Disponível na tela de Processamento (ativa)
          </label>
        </div>

        <footer className="flex items-center justify-between">
          <Button
            type="button"
            label="Cancelar"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border-2 border-[#D7D0C2] bg-transparent px-6 py-2.5 text-sm font-bold text-[#2C5F2D] transition-colors hover:bg-[#E4EDE2]/50 disabled:opacity-60"
          />
          <Button
            type="button"
            label={isLoading ? 'Salvando...' : 'Salvar equação'}
            onClick={handleSave}
            disabled={!isFormValid || isLoading}
            className="rounded-xl bg-[#2C5F2D] px-6 py-2.5 text-sm font-bold text-[#FAF8F3] transition-colors hover:bg-[#234B24] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </footer>
      </div>
    </div>
  );
}
