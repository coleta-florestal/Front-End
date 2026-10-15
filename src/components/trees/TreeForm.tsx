"use client";

import { useState, FormEvent, ChangeEvent } from "react";
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
  const [formData, setFormData] = useState<Omit<TreeData, "id">>({
    numero: "",
    dap: "",
    altura: "",
    observacoes: "",
    qualidade: initialQualidade,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Omit<TreeData, "id">, string>>>({});

  const validateField = (name: keyof Omit<TreeData, "id">, value: string): string | undefined => {
    switch (name) {
      case "numero":
        if (!value.trim()) return "Número da árvore é obrigatório";
        if (!/^\d+$/.test(value.trim())) return "Número deve conter apenas dígitos";
        break;
      case "dap":
        if (!value.trim()) return "DAP é obrigatório";
        const dapValue = parseFloat(value.replace(",", "."));
        if (isNaN(dapValue) || dapValue <= 0) return "DAP deve ser um número positivo";
        break;
      case "altura":
        if (!value.trim()) return "Altura é obrigatória";
        const alturaValue = parseFloat(value.replace(",", "."));
        if (isNaN(alturaValue) || alturaValue <= 0) return "Altura deve ser um número positivo";
        break;
    }
    return undefined;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const error = validateField(name as keyof Omit<TreeData, "id">, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name as keyof Omit<TreeData, "id">, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof Omit<TreeData, "id">, string>> = {};
    let hasErrors = false;

    (["numero", "dap", "altura"] as const).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      onAddTree(formData);
      setFormData((prev) => ({
        ...prev,
        numero: "",
        dap: "",
        altura: "",
        observacoes: "",
      }));
      setErrors({});
    }
  };

  const isFormValid = formData.numero.trim() && formData.dap.trim() && formData.altura.trim();

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-md border border-verde-mata/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-verde-mata/10 rounded-lg">
          <Tree className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-semibold text-verde-mata">Cadastrar Nova Árvore</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <Input
          label="Nº *"
          name="numero"
          type="text"
          value={formData.numero}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.numero}
          placeholder="Ex: 1"
          autoComplete="off"
        />

        <Input
          label="DAP (cm) *"
          name="dap"
          type="number"
          step="0.1"
          value={formData.dap}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.dap}
          placeholder="Ex: 25.5"
          autoComplete="off"
        />

        <Input
          label="Altura (m) *"
          name="altura"
          type="number"
          step="0.1"
          value={formData.altura}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.altura}
          placeholder="Ex: 15.2"
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Select
          label="Qualidade/Fuste/Sanidade"
          name="qualidade"
          value={formData.qualidade}
          onChange={handleChange}
          options={QUALIDADE_OPTIONS}
          helperText="Padrão: Normal"
        />

        <Textarea
          label="Observações"
          name="observacoes"
          value={formData.observacoes}
          onChange={handleChange}
          placeholder="Observações adicionais sobre a árvore..."
          rows={2}
        />
      </div>

      <div className="flex justify-end">
        <Button
          label="Adicionar ao Lote"
          type="submit"
          disabled={!isFormValid}
          className="bg-coral-flor text-creme-flor hover:bg-coral-flor/90 w-full sm:w-auto min-w-[180px]"
        />
      </div>
    </form>
  );
}