'use client';

import { useEffect, useState } from 'react';
import { QUALIDADE_OPTIONS, TreeData } from '../trees/TreeForm';
import { Input } from '../core/Input';
import { Select } from '../core/Select';
import { Textarea } from '../core/Textarea';
import Button from '../core/Button';
import { Close } from '../core/Icons';

type TreeField = 'altura' | 'dap';
type FieldErrors = Partial<Record<TreeField, string>>;

// Aceita "14,2" e "14.2"
function validateMeasure(value: string, requiredMessage: string, positiveMessage: string) {
  if (!value.trim()) return requiredMessage;
  const parsed = parseFloat(value.replace(',', '.'));
  if (isNaN(parsed) || parsed <= 0) return positiveMessage;
  return undefined;
}

function validateTreeFields(altura: string, dap: string, alturaObrigatoria: boolean): FieldErrors {
  const errors: FieldErrors = {};
  const alturaValue = Number(altura.replace(',', '.'));
  if (!altura.trim()) {
    if (alturaObrigatoria) errors.altura = 'Altura é obrigatória';
  } else if (!Number.isFinite(alturaValue) || alturaValue <= 0) {
    errors.altura = 'Altura deve ser um número positivo';
  }

  const dapError = validateMeasure(dap, 'DAP é obrigatório', 'DAP deve ser um número positivo');
  if (dapError) errors.dap = dapError;
  return errors;
}

export interface EditTreeModalProps {
  isOpen: boolean;
  tree: TreeData | null;
  fazenda: string;
  parcela: string;
  numeroArvore: string;
  indiceAtual?: number;
  totalArvores?: number;
  allowEmptyHeight?: boolean;
  onSave: (data: TreeData) => void | Promise<void>;
  onClose: () => void;
}

export function EditTreeModal({
  isOpen,
  tree,
  fazenda,
  parcela,
  numeroArvore,
  indiceAtual,
  totalArvores,
  allowEmptyHeight = false,
  onSave,
  onClose,
}: EditTreeModalProps) {
  const [prevTreeId, setPrevTreeId] = useState(tree?.id);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  const [dap, setDap] = useState(tree?.dap ?? '');
  const [altura, setAltura] = useState(tree?.altura ?? '');
  const [qualidade, setQualidade] = useState(tree?.qualidade ?? 'NORMAL');
  const [observacoes, setObservacoes] = useState(tree?.observacoes ?? '');

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (tree?.id !== prevTreeId || isOpen !== prevIsOpen) {
    setPrevTreeId(tree?.id);
    setPrevIsOpen(isOpen);
    setDap(tree?.dap ?? '');
    setAltura(tree?.altura ?? '');
    setQualidade(tree?.qualidade ?? 'NORMAL');
    setObservacoes(tree?.observacoes ?? '');
    setFieldErrors({});
    setError(null);
  }

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const alturaObrigatoria = !allowEmptyHeight && Boolean(tree?.altura.trim());

  const validate = (): boolean => {
    const errors = validateTreeFields(altura, dap, alturaObrigatoria);
    setFieldErrors(errors);
    setError(null);
    return Object.keys(errors).length === 0;
  };

  // Ao sair do campo, mostra só o erro dele
  const validateField = (field: TreeField) => {
    const errors = validateTreeFields(altura, dap, alturaObrigatoria);
    setFieldErrors((current) => ({ ...current, [field]: errors[field] }));
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      await onSave({
        id: tree!.id,
        numero: numeroArvore,
        dap,
        altura,
        observacoes,
        qualidade,
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar as alterações');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="edit-tree-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        id="edit-tree-modal"
        className="w-full max-w-md overflow-hidden rounded-3xl border border-[#e7e2d8] bg-[#faf7f0] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e7e2d8] px-6 py-4">
          <h2 className="text-xl font-bold text-verde-mata font-newsreader">Editar Árvore</h2>
          <button
            type="button"
            onClick={onClose}
            className="border-none bg-transparent p-0 font-semibold text-[#3d3d3d] shadow-none hover:bg-[#f0ede5]"
            aria-label="Fechar modal"
          >
            <Close size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-4">
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#e7e2d8] px-2 py-1 text-xs lg:text-sm text-[#5c5c5c]">
              {fazenda}
            </span>
            <span className="mx-0.5 text-xs text-[#5c5c5c]">›</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-[#e7e2d8] px-2 py-1 text-xs lg:text-sm text-[#5c5c5c]">
              {parcela}
            </span>
            <span className="mx-0.5 text-xs text-[#5c5c5c]">›</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-verde-mata px-2 py-1 text-xs lg:text-sm text-creme-flor">
              {numeroArvore}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label={alturaObrigatoria ? 'Altura (m) *' : 'Altura (m)'}
              name="altura"
              type="text"
              value={altura}
              onChange={(event) => {
                setAltura(event.target.value);
                setFieldErrors((current) => ({ ...current, altura: undefined }));
                if (error) setError(null);
              }}
              onBlur={() => validateField('altura')}
              error={fieldErrors.altura}
              aria-invalid={Boolean(fieldErrors.altura)}
              placeholder="ex. 14,2"
              disabled={loading}
            />
            <Input
              label="DAP (cm) *"
              name="dap"
              type="text"
              value={dap}
              onChange={(event) => {
                setDap(event.target.value);
                setFieldErrors((current) => ({ ...current, dap: undefined }));
                if (error) setError(null);
              }}
              onBlur={() => validateField('dap')}
              error={fieldErrors.dap}
              aria-invalid={Boolean(fieldErrors.dap)}
              placeholder="ex. 26,5"
              disabled={loading}
            />
          </div>

          <Select
            label="Qualidade/Fuste/Sanidade"
            name="qualidade"
            value={qualidade}
            onChange={(event) => setQualidade(event.target.value)}
            options={QUALIDADE_OPTIONS}
            disabled={loading}
          />

          <Textarea
            label="Observações"
            name="observacoes"
            value={observacoes}
            onChange={(event) => setObservacoes(event.target.value)}
            rows={2}
            disabled={loading}
          />

          {error && (
            <p className="flex items-center gap-1 text-sm text-coral-flor">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1" />
                <path
                  d="M7 4v4M7 10v1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-[#e7e2d8] px-6 py-4 sm:flex-row">
          <span className="self-start text-sm text-[#5c5c5c] sm:self-center">
            {indiceAtual !== undefined && totalArvores !== undefined
              ? `${indiceAtual} de ${totalArvores} árvores`
              : ''}
          </span>
          <div className="flex gap-4">
            <Button
              label="Cancelar"
              onClick={onClose}
              disabled={loading}
              className="border border-[#b9b4a8] bg-white text-[#3d3d3d] hover:bg-[#f0ede5]"
            />
            <Button
              label={loading ? 'Salvando...' : 'Salvar'}
              onClick={handleSave}
              disabled={loading}
              className="bg-verde-mata text-creme-flor hover:bg-[#245225]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
