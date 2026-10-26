"use client";

import { useState, FormEvent } from "react";
import { Input } from "../core/Input";
import { Select } from "../core/Select";
import { Textarea } from "../core/Textarea";
import Button from "../core/Button";
import { Tree } from "../core/Icons";

export interface TreeData {
  id: string;
  numero: string;
  dap: string;
  altura: string;
  observacoes: string;
  qualidade: string;
}

export interface TreeFormProps {
  onAddTree: (tree: Omit<TreeData, "id">) => void;
  initialQualidade?: string;
}

const QUALIDADE_OPTIONS = [
  { value: "NORMAL", label: "Normal" },
  { value: "BOM", label: "Bom" },
  { value: "REGULAR", label: "Regular" },
  { value: "RUIM", label: "Ruim" },
  { value: "MORTO", label: "Morto" },
];

export function TreeForm({ onAddTree, initialQualidade = "NORMAL" }: TreeFormProps) {
  const [numero, setNumero] = useState("");
  const [dap, setDap] = useState("");
  const [altura, setAltura] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [qualidade, setQualidade] = useState(initialQualidade);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateNumero = (value: string) => {
    if (!value.trim()) {
      setError("Número da árvore é obrigatório");
      return;
    }
    if (!/^\d+$/.test(value.trim())) {
      setError("Número deve conter apenas dígitos");
      return;
    }
    setError(null);
    return "";
  };

  const validateDap = (value: string) => {
    if (!value.trim()) {
      setError("DAP é obrigatório");
      return;
    }
    const dapValue = parseFloat(value.replace(",", "."));
    if (isNaN(dapValue) || dapValue <= 0) {
      setError("DAP deve ser um número positivo");
      return;
    }
    setError(null);
    return "";
  };

  const validateAltura = (value: string) => {
    if (!value.trim()) {
      setError("Altura é obrigatória");
      return;
    }
    const alturaValue = parseFloat(value.replace(",", "."));
    if (isNaN(alturaValue) || alturaValue <= 0) {
      setError("Altura deve ser um número positivo");
      return;
    }
    setError(null);
    return "";
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validateNumero(numero) || !validateDap(dap) || !validateAltura(altura)) {
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    onAddTree({ numero, dap, altura, observacoes, qualidade });
    setNumero("");
    setDap("");
    setAltura("");
    setObservacoes("");
    setLoading(false);
  };

  const isFormValid = numero.trim() && dap.trim() && altura.trim();

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-md border border-verde-mata/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-verde-mata/10 rounded-lg">
          <Tree className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold text-verde-mata">Cadastrar Nova Árvore</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Input
          label="Nº *"
          name="numero"
          type="text"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
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
          onChange={(e) => setDap(e.target.value)}
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
          onChange={(e) => setAltura(e.target.value)}
          placeholder="Ex: 15.2"
          autoComplete="off"
          disabled={loading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Select
          label="Qualidade/Fuste/Sanidade"
          name="qualidade"
          value={qualidade}
          onChange={(e) => setQualidade(e.target.value)}
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

      {error ? (
        <p className="text-sm text-coral-flor flex items-center gap-1 mb-4">
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
      ) : (
        <p className="text-sm text-coral-flor flex items-center gap-1 mb-4">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6.5" stroke="currentColor" strokeWidth="1" />
            <path
              d="M4.5 7l2 2 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Árvore adicionada com sucesso!
        </p>
      )}

      <div className="flex justify-end">
        <Button
          label={loading ? "Adicionando..." : "Adicionar ao Lote"}
          type="submit"
          disabled={!isFormValid || loading}
          className="bg-coral-flor text-creme-flor hover:bg-coral-flor/90 w-full sm:w-auto min-w-45"
        />
      </div>
    </form>
  );
}