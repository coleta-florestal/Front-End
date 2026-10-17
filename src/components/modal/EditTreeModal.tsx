"use client";

import { useEffect, useState } from "react";
import { TreeData } from "../trees/TreeForm";
import { Input } from "../core/Input";
import Button from "../core/Button";
import { Close } from "../core/Icons";

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
  { value: "BIFURCADA_ACIMA_1.3M", label: "Bifurcada acima de 1,3m" },
  { value: "BIFURCADA_ABAIXO_1.3M", label: "Bifurcada abaixo de 1,3m" },
  { value: "MORTA", label: "Morta" },
  { value: "FALHA", label: "Falha" },
  { value: "PROBLEMAS_FITOSSANITARIOS", label: "Problemas fitossanitários" },
  { value: "QUEBRADA", label: "Quebrada" },
  { value: "OUTRO", label: "Outro" },
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
  const [dap, setDap] = useState(tree?.dap ?? "");
  const [altura, setAltura] = useState(tree?.altura ?? "");
  const [observacoesSelecionadas, setObservacoesSelecionadas] = useState<string[]>(
    tree?.observacoes
      ? tree.observacoes.split(",").map((s) => s.trim()).filter(Boolean)
      : []
  );

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDap(tree?.dap ?? "");
    setAltura(tree?.altura ?? "");
    setObservacoesSelecionadas(
      tree?.observacoes
        ? tree.observacoes.split(",").map((s) => s.trim()).filter(Boolean)
        : []
    );
  }, [isOpen, tree?.dap, tree?.altura, tree?.observacoes]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isValid =
    dap.trim().length > 0 &&
    altura.trim().length > 0 &&
    !isNaN(parseFloat(dap.replace(",", "."))) &&
    parseFloat(dap.replace(",", ".")) > 0 &&
    !isNaN(parseFloat(altura.replace(",", "."))) &&
    parseFloat(altura.replace(",", ".")) > 0;

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setError(null);
    if (checked) {
      setObservacoesSelecionadas((prev) => [...prev, value]);
    } else {
      setObservacoesSelecionadas((prev) => prev.filter((v) => v !== value));
    }
  };

  const isCheckboxChecked = (value: string) => observacoesSelecionadas.includes(value);

  const handleSave = async () => {
    if (!isValid) return;
    setError(null);
    setLoading(true);

    try {
      const observacoesFinal =
        observacoesSelecionadas.length > 0
          ? observacoesSelecionadas.join(", ")
          : tree?.observacoes ?? "";

      onSave({
        id: tree!.id,
        numero: numeroArvore,
        dap,
        altura,
        observacoes: observacoesFinal,
        qualidade:
          observacoesSelecionadas.length > 0
            ? observacoesSelecionadas[0]
            : "NORMAL",
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar as alterações");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="edit-tree-modal-backdrop"
      className="fixed inset-0 z-999 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        id="edit-tree-modal"
        className="w-full max-w-md bg-[#faf7f0] rounded-3xl border border-[#e7e2d8] shadow-2xl overflow-hidden"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e7e2d8]">
          <h2 className="text-xl font-bold text-verde-mata">Editar Árvore</h2>
          <button
            onClick={onClose}
            className="p-0 border-none bg-transparent shadow-none hover:bg-[#f0ede5] text-[#3d3d3d] font-semibold"
            aria-label="Fechar modal"
          >
            <Close size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-4">
          <div className="flex items-center gap-1">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#e7e2d8] text-sm text-[#5c5c5c]">
              {fazenda}
            </span>
            <span className="text-[#5c5c5c] text-xs mx-0.5">›</span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#e7e2d8] text-sm text-[#5c5c5c]">
              {parcela}
            </span>
            <span className="text-[#5c5c5c] text-xs mx-0.5">›</span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-verde-mata text-sm text-creme-flor">
              {numeroArvore}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Altura (m) *"
              name="altura"
              type="text"
              value={altura}
              onChange={(event) => setAltura(event.target.value)}
              placeholder="ex. 14,2"
              disabled={loading}
            />
            <Input
              label="DAP (cm) *"
              name="dap"
              type="text"
              value={dap}
              onChange={(event) => setDap(event.target.value)}
              placeholder="ex. 26,5"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#3d3d3d] mb-3 block">
              Observações
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {QUALIDADE_CHECKBOX_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isCheckboxChecked(opt.value)}
                    onChange={(event) =>
                      handleCheckboxChange(opt.value, event.target.checked)
                    }
                    className="w-4 h-4 rounded border-2 border-[#b9b4a8] text-verde-mata focus:ring-0 checked:bg-verde-mata checked:border-verde-mata disabled:opacity-50"
                    disabled={loading}
                  />
                  <span className="text-sm text-[#3d3d3d]">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-coral-flor">{error}</p>}
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 px-6 py-4 border-t border-[#e7e2d8]">
          <span className="text-sm text-[#5c5c5c] self-start sm:self-center">
            {indiceAtual !== undefined && totalArvores !== undefined
              ? `${indiceAtual} de ${totalArvores} árvores`
              : ""}
          </span>
          <Button
            label="Cancelar"
            onClick={onClose}
            disabled={loading}
            className="border border-[#b9b4a8] text-[#3d3d3d] bg-white hover:bg-[#f0ede5]"
          />
          <Button
            label={loading ? "Salvando..." : "Salvar"}
            onClick={handleSave}
            disabled={!isValid || loading}
            className="bg-verde-mata text-creme-flor hover:bg-[#245225]"
          />
        </div>
      </div>
    </div>
  );
}
