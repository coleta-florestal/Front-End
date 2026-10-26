"use client";

import { useState, useEffect } from "react";
import Topbar from "@/components/ui/Topbar";
import { TreeForm, TreeList, TreeData } from "@/components/trees";
import Button from "@/components/core/Button";
import { useParams, useRouter } from "next/navigation";

// Development fallback IDs for testing without registered entities
const DEV_FAZENDA_ID = "fazenda-demo";
const DEV_TALHAO_ID = "talhao-demo";
const DEV_PARCELA_ID = "parcela-demo";

function getInitialTrees(fazendaId: string, talhaoId: string, parcelaId: string): TreeData[] {
  if (typeof window === "undefined") return [];
  const storageKey = `trees_${fazendaId}_${talhaoId}_${parcelaId}`;
  const savedTrees = localStorage.getItem(storageKey);
  if (savedTrees) {
    try {
      return JSON.parse(savedTrees);
    } catch {
      return [];
    }
  }
  return [];
}

export default function CadastrarArvorePage() {
  const params = useParams();
  const router = useRouter();

  // Use params from URL or fallback to demo IDs for development
  const fazendaId = (params.fazenda as string) || DEV_FAZENDA_ID;
  const talhaoId = (params.talhao as string) || DEV_TALHAO_ID;
  const parcelaId = (params.parcela as string) || DEV_PARCELA_ID;

  const [trees, setTrees] = useState<TreeData[]>(() => getInitialTrees(fazendaId, talhaoId, parcelaId));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storageKey = `trees_${fazendaId}_${talhaoId}_${parcelaId}`;
    localStorage.setItem(storageKey, JSON.stringify(trees));
  }, [trees, fazendaId, talhaoId, parcelaId]);

  const handleAddTree = (treeData: Omit<TreeData, "id">) => {
    const newTree: TreeData = {
      ...treeData,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setTrees((prev) => [...prev, newTree]);
  };

  const handleRemoveTree = (id: string) => {
    if (window.confirm("Tem certeza que deseja remover esta árvore do lote?")) {
      setTrees((prev) => prev.filter((tree) => tree.id !== id));
    }
  };

  const handleEditTree = (tree: TreeData) => {
    setTrees((prev) => prev.filter((t) => t.id !== tree.id));
  };

  const handleSaveAll = async () => {
    if (trees.length === 0) {
      alert("Adicione pelo menos uma árvore antes de salvar.");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`${trees.length} árvore(s) salva(s) com sucesso!`);
      router.back();
    } catch {
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (trees.length > 0 && !window.confirm("Há árvores não salvas. Deseja voltar mesmo assim?")) {
      return;
    }
    router.back();
  };

  return (
    <div className="min-h-screen bg-creme-flor flex">
      <main className="flex-1 min-w-0">
        <Topbar
          title="Cadastrar Árvores"
          description="Fazenda > Talhão > Parcela > Cadastrar Árvore"
          onBack={handleBack}
        />

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="space-y-6">
            <TreeForm onAddTree={handleAddTree} />

            <TreeList
              trees={trees}
              onRemoveTree={handleRemoveTree}
              onEditTree={handleEditTree}
            />

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                label="Fechar"
                onClick={handleBack}
                className="bg-creme-flor text-verde-mata border-2 border-verde-mata/30 hover:bg-verde-mata/5 w-full sm:w-auto"
              />
              <Button
                label="Salvar"
                onClick={handleSaveAll}
                disabled={loading || trees.length === 0}
                className="bg-verde-mata text-creme-flor hover:bg-verde-mata/90 w-full sm:w-auto min-w-45"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}