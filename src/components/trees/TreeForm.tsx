'use client';

import { useState, FormEvent } from 'react';
import { Input } from '../core/Input';
import { Select } from '../core/Select';
import { Textarea } from '../core/Textarea';
import Button from '../core/Button';
import { Tree } from '../core/Icons';

export interface TreeData {
  id: string;
  numero: string;
  dap: string;
  altura: string;
  observacoes: string;
  qualidade: string;
}

export interface TreeFormProps {
  onAddTree: (tree: Omit<TreeData, 'id'>) => void;
  initialQualidade?: string;
}

const QUALIDADE_OPTIONS = [
  { value: 'NORMAL', label: 'Normal' },
  { value: 'BIFURCADA_ACIMA_1.3M', label: 'Bifurcada acima de 1,3m' },
  { value: 'BIFURCADA_ABAIXO_1.3M', label: 'Bifurcada abaixo de 1,3m' },
  { value: 'INCLINADA', label: 'Inclinada' },
  { value: 'MORTA', label: 'Morta' },
  { value: 'FALHA', label: 'Falha' },
  { value: 'PROBLEMAS_FITOSSANITARIOS', label: 'Problemas fitossanitários' },
  { value: 'QUEBRADA', label: 'Quebrada' },
  { value: 'OUTRO', label: 'Outro' },
];

export function TreeForm({ onAddTree, initialQualidade = 'NORMAL' }: TreeFormProps) {
  const [numero, setNumero] = useState('');
  const [dap, setDap] = useState('');
  const [altura, setAltura] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [qualidade, setQualidade] = useState(initialQualidade);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    if (!numero.trim()) {
      setError('Número da árvore é obrigatório');
      return false;
    }
    if (!/^\d+$/.test(numero.trim())) {
      setError('Número deve conter apenas dígitos');
      return false;
    }

    if (!dap.trim()) {
      setError('DAP é obrigatório');
      return false;
    }
    const dapValue = parseFloat(dap.replace(',', '.'));
    if (isNaN(dapValue) || dapValue <= 0) {
      setError('DAP deve ser um número positivo');
      return false;
    }

    if (!altura.trim()) {
      setError('Altura é obrigatória');
      return false;
    }
    const alturaValue = parseFloat(altura.replace(',', '.'));
    if (isNaN(alturaValue) || alturaValue <= 0) {
      setError('Altura deve ser um número positivo');
      return false;
    }

    setError(null);
    return true;
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      onAddTree({ numero, dap, altura, observacoes, qualidade });

      setNumero('');
      setDap('');
      setAltura('');
      setObservacoes('');
      setQualidade(initialQualidade);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a árvore');
    } finally {
      setLoading(false);
    }
  }

  const isFormValid = Boolean(numero.trim() && dap.trim() && altura.trim());

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-verde-mata/10 bg-white p-6 shadow-md"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-verde-mata/10 p-2">
          <Tree className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-semibold text-verde-mata font-newsreader">
          Cadastrar Nova Árvore
        </h2>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Input
          label="Nº *"
          name="numero"
          type="text"
          value={numero}
          onChange={(e) => {
            setNumero(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Ex: 1"
          autoComplete="off"
          disabled={loading}
        />

        <Input
          label="DAP (cm) *"
          name="dap"
          type="number"
          step="0.1"
          value={dap}
          onChange={(e) => {
            setDap(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Ex: 25.5"
          autoComplete="off"
          disabled={loading}
        />

        <Input
          label="Altura (m) *"
          name="altura"
          type="number"
          step="0.1"
          value={altura}
          onChange={(e) => {
            setAltura(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Ex: 15.2"
          autoComplete="off"
          disabled={loading}
        />
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Qualidade/Fuste/Sanidade"
          name="qualidade"
          value={qualidade}
          onChange={(e) => {
            setQualidade(e.target.value);
            if (error) setError(null);
          }}
          options={QUALIDADE_OPTIONS}
          helperText="Padrão: Normal"
          disabled={loading}
        />

        <Textarea
          label="Observações"
          name="observacoes"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Observações adicionais sobre a árvore..."
          rows={2}
          disabled={loading}
        />
      </div>

      {error && (
        <p className="mb-4 flex items-center gap-1 text-sm text-coral-flor">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1" />
            <path d="M7 4v4M7 10v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}

      <div className="flex flex-col justify-end gap-2 border-t border-[#e7e2d8] py-4 sm:flex-row">
        <Button
          label={loading ? 'Adicionando...' : 'Adicionar ao Lote'}
          type="submit"
          disabled={!isFormValid || loading}
          className="min-w-45 w-full bg-coral-flor text-creme-flor hover:bg-coral-flor/90 sm:w-auto"
        />
      </div>
    </form>
  );
}
