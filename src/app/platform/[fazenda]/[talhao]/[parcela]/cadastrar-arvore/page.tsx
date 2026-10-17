"use client";

import { useState } from "react";
import Topbar from "@/components/ui/Topbar";
import { TreeForm, TreeList, TreeData } from "@/components/trees";
import { EditTreeModal } from "@/components/modal/EditTreeModal";
import Button from "@/components/core/Button";
import { useRouter } from "next/navigation";

export default function CadastrarArvorePage() {
  const router = useRouter();

  const [trees, setTrees] = useState<TreeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

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

  const handleSaveEdit = (updatedTree: TreeData) => {
    setTrees((prev) =>
      prev.map((t) => (t.id === updatedTree.id ? updatedTree : t))
    );
    setTreeToEdit(null);
    setEditModalOpen(false);
  };

  const [treeToEdit, setTreeToEdit] = useState<TreeData | null>(null);

  const handleEditTree = (tree: TreeData) => {
    setTreeToEdit(tree);
    setEditModalOpen(true);
  };

  const handleSaveAll = async () => {
    if (trees.length === 0) {
      alert("Adicione pelo menos uma árvore antes de salvar.");
      return;
    }

    setLoading(true);
    try {
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

            {treeToEdit && (
              <EditTreeModal
                isOpen={editModalOpen}
                tree={treeToEdit}
                fazenda="Fazenda Demo"
                parcela="Parcela Demo"
                numeroArvore={treeToEdit.numero}
                indiceAtual={
                  trees.findIndex((t) => t.id === treeToEdit.id) + 1
                }
                totalArvores={trees.length}
                onSave={handleSaveEdit}
                onClose={() => setEditModalOpen(false)}
              />
            )}

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