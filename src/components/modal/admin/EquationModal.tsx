'use client';

import { useState } from 'react';
import type { CreateEquationDto } from '@/app/api/api';
import { Input } from '@/components/core/Input';
import Button from '@/components/core/Button';
import { EQUATION_MODELS } from '@/lib/equations';
import type { EquationType, VolumetricEquation } from '@/types/equation';

interface EquationModalProps {
  onClose: () => void;
  onSave: (data: CreateEquationDto) => void;
  editingEquation: VolumetricEquation | null;
  isLoading?: boolean;
  error?: string | null;
}

const toText = (value?: number | null) => (value == null ? '' : String(value).replace('.', ','));

// Aceita vírgula ou ponto; texto inválido vira null em vez de 0.
const parseCoef = (value: string): number | null => {
  const text = value.trim().replace(',', '.');
  const parsed = Number(text);
  return text !== '' && Number.isFinite(parsed) ? parsed : null;
};

// Montado só quando aberto (a página usa `key`), então o estado nasce das props.
export default function EquationModal({
  onClose,
  onSave,
  editingEquation,
  isLoading = false,
  error = null,
}: EquationModalProps) {
  const [name, setName] = useState(editingEquation?.name ?? '');
  const [modelType, setModelType] = useState<EquationType>(
    editingEquation?.modelType ?? 'SCHUMACHER_HALL',
  );
  const [b0, setB0] = useState(toText(editingEquation?.beta0));
  const [b1, setB1] = useState(toText(editingEquation?.beta1));
  const [b2, setB2] = useState(toText(editingEquation?.beta2));

  const model = EQUATION_MODELS[modelType];
  const beta0 = parseCoef(b0);
  const beta1 = parseCoef(b1);
  const beta2 = parseCoef(b2);

  const isFormValid =
    name.trim().length > 0 &&
    beta0 !== null &&
    beta1 !== null &&
    (!model.usesBeta2 || beta2 !== null);

  const handleSave = () => {
    if (!isFormValid || beta0 === null || beta1 === null) return;

    onSave({
      name: name.trim(),
      modelType,
      beta0,
      beta1,
      ...(model.usesBeta2 && beta2 !== null ? { beta2 } : {}),
    });
  };

  const coefError = (raw: string, parsed: number | null) =>
    raw !== '' && parsed === null ? 'Informe um número válido.' : undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[#FAF8F3] p-8 shadow-xl">
        <header className="mb-6">
          <h2 className="font-serif text-2xl font-bold text-verde-mata">
            {editingEquation ? 'Editar equação' : 'Nova equação'}
          </h2>
        </header>

        <div className="mb-4">
          <Input
            label="Nome da equação"
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            placeholder="ex. Schumacher & Hall - Eucalipto"
          />
        </div>

        <div className="mb-4 flex flex-col gap-1.5">
          <label htmlFor="equation-model" className="text-sm font-semibold text-verde-mata">
            Modelo
          </label>
          <select
            id="equation-model"
            value={modelType}
            onChange={(e) => setModelType(e.target.value as EquationType)}
            className="h-11 w-full rounded-xl border border-[#D7D0C2] bg-white px-4 text-sm font-medium text-[#3B4439] outline-none transition-colors focus:border-verde-mata"
          >
            {(Object.keys(EQUATION_MODELS) as EquationType[]).map((type) => (
              <option key={type} value={type}>
                {EQUATION_MODELS[type].label}
              </option>
            ))}
          </select>
          <p className="text-xs text-verde-mata/60">{model.formula}</p>
        </div>

        <div className="mb-6 flex gap-4">
          <Input
            label="β₀"
            type="text"
            inputMode="decimal"
            value={b0}
            error={coefError(b0, beta0)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setB0(e.target.value)}
            placeholder="0,0"
          />
          <Input
            label="β₁"
            type="text"
            inputMode="decimal"
            value={b1}
            error={coefError(b1, beta1)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setB1(e.target.value)}
            placeholder="0,0"
          />
          {model.usesBeta2 && (
            <Input
              label="β₂"
              type="text"
              inputMode="decimal"
              value={b2}
              error={coefError(b2, beta2)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setB2(e.target.value)}
              placeholder="0,0"
            />
          )}
        </div>

        {error && (
          <p role="alert" className="mb-4 text-sm font-medium text-coral-flor">
            {error}
          </p>
        )}

        <footer className="flex items-center justify-between">
          <Button
            type="button"
            label="Cancelar"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border-2 border-[#D7D0C2] bg-transparent px-6 py-2.5 text-sm font-bold text-verde-mata transition-colors hover:bg-[#E4EDE2]/50 disabled:opacity-60"
          />
          <Button
            type="button"
            label={isLoading ? 'Salvando...' : 'Salvar equação'}
            onClick={handleSave}
            disabled={!isFormValid || isLoading}
            className="rounded-xl bg-verde-mata px-6 py-2.5 text-sm font-bold text-[#FAF8F3] transition-colors hover:bg-[#234B24] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </footer>
      </div>
    </div>
  );
}
