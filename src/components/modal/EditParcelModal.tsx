'use client';

import { useEffect, useState } from 'react';
import Button from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { Close } from '@/components/core/Icons';
import { PrismaSubPlotRecord } from '@/types/farm';

export interface EditParcelModalProps {
  isOpen: boolean;
  parcela: PrismaSubPlotRecord;
  onClose: () => void;
  onSave: (data: { area: string; metaArvores: string }) => void | Promise<void>;
}

interface FieldErrors {
  area?: string;
  metaArvores?: string;
}

function parseDecimal(raw: string): number {
  return Number(raw.trim().replace(',', '.'));
}

function validateEditParcelFields(area: string, metaArvores: string): FieldErrors {
  const errors: FieldErrors = {};

  const parsedArea = parseDecimal(area);
  if (!area.trim() || Number.isNaN(parsedArea) || parsedArea <= 0) {
    errors.area = 'A área deve ser maior que zero.';
  }

  const rawMeta = metaArvores.trim();
  const parsedMeta = parseDecimal(rawMeta);
  const hasDecimalSeparator = rawMeta.includes('.') || rawMeta.includes(',');

  if (
    !rawMeta ||
    Number.isNaN(parsedMeta) ||
    hasDecimalSeparator ||
    !Number.isInteger(parsedMeta) ||
    parsedMeta <= 0
  ) {
    errors.metaArvores = 'A meta deve ser um número inteiro maior que zero.';
  }

  return errors;
}

export function EditParcelModal({ isOpen, parcela, onClose, onSave }: EditParcelModalProps) {
  const [area, setArea] = useState(parcela.areaM2 != null ? String(parcela.areaM2) : '');
  const [metaArvores, setMetaArvores] = useState(String(parcela.targetTrees ?? ''));

  const [touched, setTouched] = useState<{
    area?: boolean;
    metaArvores?: boolean;
  }>({});
  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || loading) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const fieldErrors = validateEditParcelFields(area, metaArvores);

  const showAreaError = Boolean((submitted || touched.area) && fieldErrors.area);
  const showMetaError = Boolean((submitted || touched.metaArvores) && fieldErrors.metaArvores);

  const tituloParcela = parcela.name.toLowerCase().startsWith('parcela')
    ? parcela.name
    : `Parcela ${parcela.name}`;

  const handleSave = async () => {
    setSubmitted(true);
    setError(null);

    const currentErrors = validateEditParcelFields(area, metaArvores);
    if (Object.keys(currentErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      await onSave({
        area: area.trim().replace(',', '.'),
        metaArvores: metaArvores.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível atualizar a parcela');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="edit-parcel-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => {
        if (!loading) onClose();
      }}
    >
      <div
        id="edit-parcel-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-parcel-modal-title"
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#e7e2d8] bg-[#faf7f0] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e7e2d8] px-6 py-4 gap-4">
          <h2
            id="edit-parcel-modal-title"
            className="text-2xl font-semibold text-verde-mata font-newsreader"
          >
            {tituloParcela}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="border-none bg-transparent p-0 font-semibold text-[#3d3d3d] shadow-none hover:bg-[#f0ede5] cursor-pointer"
            aria-label="Fechar modal"
          >
            <Close size={16} />
          </button>
        </div>

        <div className="px-6 py-4">
          <p className="text-verde-eucalipto text-sm mb-6">
            Atualize a área e a meta de árvores da parcela aberta.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-start">
            <div className="flex flex-col gap-1.5">
              <Input
                label="Área (m²)"
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, area: true }))}
                placeholder="ex. 500"
                aria-invalid={showAreaError}
                className={showAreaError ? 'border-coral-flor focus:border-coral-flor' : ''}
              />
              {showAreaError && (
                <p role="alert" className="text-xs text-coral-flor">
                  {fieldErrors.area}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Input
                label="Meta de Árvores"
                type="number"
                value={metaArvores}
                onChange={(e) => setMetaArvores(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, metaArvores: true }))}
                placeholder="ex. 5"
                aria-invalid={showMetaError}
                className={showMetaError ? 'border-coral-flor focus:border-coral-flor' : ''}
              />
              {showMetaError && (
                <p role="alert" className="text-xs text-coral-flor">
                  {fieldErrors.metaArvores}
                </p>
              )}
            </div>
          </div>

          {error && (
            <p className="mb-4 flex items-center gap-1 text-sm text-coral-flor" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col md:flex-row justify-end gap-4 pt-6 border-t border-[#e7e2d8]">
            <Button
              label="Cancelar"
              onClick={onClose}
              disabled={loading}
              className="border border-[#D7D0C2] bg-white text-verde-mata hover:bg-[#f0ede5] rounded-xl px-6 py-3 font-semibold"
            />
            <Button
              label={loading ? 'Salvando...' : 'Confirmar mudanças'}
              onClick={handleSave}
              disabled={loading}
              className="bg-verde-mata text-creme-flor hover:bg-[#245225] rounded-xl px-6 py-3 font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
