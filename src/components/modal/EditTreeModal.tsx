'use client';

import { useEffect, useState } from 'react';
import { TreeData } from '../trees/TreeForm';
import { Input } from '../core/Input';
import Button from '../core/Button';
import { Close } from '../core/Icons';

export interface EditTreeModalProps {
  isOpen: boolean;
  tree: TreeData | null;
  fazenda: string;
  parcela: string;
  numeroArvore: string;
  indiceAtual?: number;
  totalArvores?: number;
  onSave: (data: TreeData) => void;
  onClose: () => void;
}

const QUALIDADE_CHECKBOX_OPTIONS = [
  { value: 'BIFURCADA_ACIMA_1.3M', label: 'Bifurcada acima de 1,3m' },
  { value: 'BIFURCADA_ABAIXO_1.3M', label: 'Bifurcada abaixo de 1,3m' },
  { value: 'MORTA', label: 'Morta' },
  { value: 'FALHA', label: 'Falha' },
  { value: 'PROBLEMAS_FITOSSANITARIOS', label: 'Problemas fitossanitários' },
  { value: 'QUEBRADA', label: 'Quebrada' },
  { value: 'OUTRO', label: 'Outro' },
];

export function EditTreeModal({
  isOpen,
  tree,
  fazenda,
  parcela,
  numeroArvore,
  indiceAtual,
  totalArvores,
  onSave,
  onClose,
}: EditTreeModalProps) {
  const [prevTreeId, setPrevTreeId] = useState(tree?.id);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  const [dap, setDap] = useState(tree?.dap ?? '');
  const [altura, setAltura] = useState(tree?.altura ?? '');
  const [observacoesSelecionadas, setObservacoesSelecionadas] = useState<string[]>(
    tree?.observacoes
      ? tree.observacoes
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [],
  );

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (tree?.id !== prevTreeId || isOpen !== prevIsOpen) {
    setPrevTreeId(tree?.id);
    setPrevIsOpen(isOpen);
    setDap(tree?.dap ?? '');
    setAltura(tree?.altura ?? '');
    setObservacoesSelecionadas(
      tree?.observacoes
        ? tree.observacoes
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    );
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

  const validate = (): boolean => {
    if (!altura.trim()) {
      setError('Altura é obrigatória');
      return false;
    }
    const alturaVal = parseFloat(altura.replace(',', '.'));
    if (isNaN(alturaVal) || alturaVal <= 0) {
      setError('Altura deve ser um número positivo');
      return false;
    }

    if (!dap.trim()) {
      setError('DAP é obrigatório');
      return false;
    }
    const dapVal = parseFloat(dap.replace(',', '.'));
    if (isNaN(dapVal) || dapVal <= 0) {
      setError('DAP deve ser um número positivo');
      return false;
    }

    setError(null);
    return true;
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (error) setError(null);
    if (checked) {
      setObservacoesSelecionadas((prev) => [...prev, value]);
    } else {
      setObservacoesSelecionadas((prev) => prev.filter((v) => v !== value));
    }
  };

  const isCheckboxChecked = (value: string) => observacoesSelecionadas.includes(value);

  const handleSave = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const observacoesFinal =
        observacoesSelecionadas.length > 0
          ? observacoesSelecionadas.join(', ')
          : (tree?.observacoes ?? '');

      onSave({
        id: tree!.id,
        numero: numeroArvore,
        dap,
        altura,
        observacoes: observacoesFinal,
        qualidade: observacoesSelecionadas.length > 0 ? observacoesSelecionadas[0] : 'NORMAL',
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar as alterações');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = Boolean(
    dap.trim() &&
    altura.trim() &&
    !isNaN(parseFloat(dap.replace(',', '.'))) &&
    parseFloat(dap.replace(',', '.')) > 0 &&
    !isNaN(parseFloat(altura.replace(',', '.'))) &&
    parseFloat(altura.replace(',', '.')) > 0,
  );

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
          <h2 className="text-xl font-bold text-verde-mata">Editar Árvore</h2>
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
            <span className="inline-flex items-center gap-1 rounded-md bg-[#e7e2d8] px-2 py-1 text-sm text-[#5c5c5c]">
              {fazenda}
            </span>
            <span className="mx-0.5 text-xs text-[#5c5c5c]">›</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-[#e7e2d8] px-2 py-1 text-sm text-[#5c5c5c]">
              {parcela}
            </span>
            <span className="mx-0.5 text-xs text-[#5c5c5c]">›</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-verde-mata px-2 py-1 text-sm text-creme-flor">
              {numeroArvore}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Altura (m) *"
              name="altura"
              type="text"
              value={altura}
              onChange={(event) => {
                setAltura(event.target.value);
                if (error) setError(null);
              }}
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
                if (error) setError(null);
              }}
              placeholder="ex. 26,5"
              disabled={loading}
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-semibold text-[#3d3d3d]">Observações</label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {QUALIDADE_CHECKBOX_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isCheckboxChecked(opt.value)}
                    onChange={(event) => handleCheckboxChange(opt.value, event.target.checked)}
                    className="h-4 w-4 rounded border-2 border-[#b9b4a8] text-verde-mata focus:ring-0 checked:border-verde-mata checked:bg-verde-mata disabled:opacity-50"
                    disabled={loading}
                  />
                  <span className="text-sm text-[#3d3d3d]">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

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

        <div className="flex flex-col justify-end gap-2 border-t border-[#e7e2d8] px-6 py-4 sm:flex-row">
          <span className="self-start text-sm text-[#5c5c5c] sm:self-center">
            {indiceAtual !== undefined && totalArvores !== undefined
              ? `${indiceAtual} de ${totalArvores} árvores`
              : ''}
          </span>
          <Button
            label="Cancelar"
            onClick={onClose}
            disabled={loading}
            className="border border-[#b9b4a8] bg-white text-[#3d3d3d] hover:bg-[#f0ede5]"
          />
          <Button
            label={loading ? 'Salvando...' : 'Salvar'}
            onClick={handleSave}
            disabled={!isFormValid || loading}
            className="bg-verde-mata text-creme-flor hover:bg-[#245225]"
          />
        </div>
      </div>
    </div>
  );
}
