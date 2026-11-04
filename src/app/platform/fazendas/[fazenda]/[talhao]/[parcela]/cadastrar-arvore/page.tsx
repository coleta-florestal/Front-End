'use client';

import { use, useEffect, useState } from 'react';
import { createTree, getFarm, getPlot, getSubPlot, toTreeDto } from '@/app/api/api';
import Topbar from '@/components/ui/Topbar';
import { TreeForm, type TreeData } from '@/components/trees/TreeForm';
import { TreeList } from '@/components/trees/TreeList';
import { EditTreeModal } from '@/components/modal/EditTreeModal';
import { DeleteTreeModal } from '@/components/modal/DeleteTreeModal';
import { ViewTreeModal } from '@/components/modal/ViewTreeModal';
import Button from '@/components/core/Button';
import { useRouter } from 'next/navigation';

interface CadastrarArvorePageProps {
  params: Promise<{ fazenda: string; talhao: string; parcela: string }>;
}

export default function CadastrarArvorePage({ params }: CadastrarArvorePageProps) {
  const router = useRouter();
  const { fazenda, talhao, parcela } = use(params);

  const [farmName, setFarmName] = useState('');
  const [plotName, setPlotName] = useState('');
  const [subPlotName, setSubPlotName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [trees, setTrees] = useState<TreeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [treeToDelete, setTreeToDelete] = useState<TreeData | null>(null);
  const [treeToView, setTreeToView] = useState<TreeData | null>(null);

  useEffect(() => {
    async function loadNames() {
      try {
        const [farmRecord, plotRecord, subPlotRecord] = await Promise.all([
          getFarm(fazenda),
          getPlot(fazenda, talhao),
          getSubPlot(fazenda, talhao, parcela),
        ]);

        setFarmName(farmRecord.name);
        setPlotName(plotRecord.name);
        setSubPlotName(`Parcela ${subPlotRecord.name}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar a parcela');
      }
    }

    loadNames();
  }, [fazenda, talhao, parcela]);

  const handleAddTree = (treeData: Omit<TreeData, 'id'>) => {
    const newTree: TreeData = {
      ...treeData,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setTrees((prev) => [...prev, newTree]);
  };

  const handleRemoveTree = (tree: TreeData) => {
    setTrees((prev) => prev.filter((t) => t.id !== tree.id));
  };

  const handleOpenDelete = (tree: TreeData) => {
    setTreeToDelete(tree);
    setDeleteModalOpen(true);
  };

  const handleOpenView = (tree: TreeData) => {
    setTreeToView(tree);
    setViewModalOpen(true);
  };

  const handleSaveEdit = (updatedTree: TreeData) => {
    setTrees((prev) => prev.map((t) => (t.id === updatedTree.id ? updatedTree : t)));
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
      alert('Adicione pelo menos uma árvore antes de salvar.');
      return;
    }

    setLoading(true);

    // O back só cria uma árvore por vez: as que falharem ficam no lote para não perder a medição.
    const results = await Promise.allSettled(
      trees.map((tree) => createTree(fazenda, talhao, parcela, toTreeDto(tree))),
    );
    const failedTrees = trees.filter((_, index) => results[index].status === 'rejected');

    setLoading(false);

    if (failedTrees.length === 0) {
      alert(`${trees.length} árvore(s) salva(s) com sucesso!`);
      router.back();
      return;
    }

    const firstFailure = results.find(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    );
    const reason = firstFailure?.reason instanceof Error ? firstFailure.reason.message : '';

    setTrees(failedTrees);
    alert(
      `${trees.length - failedTrees.length} árvore(s) salva(s). ${failedTrees.length} não foram salvas e continuam no lote. ${reason}`,
    );
  };

  const handleBack = () => {
    if (trees.length > 0 && !window.confirm('Há árvores não salvas. Deseja voltar mesmo assim?')) {
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
            {error && (
              <p role="alert" className="text-sm text-coral-flor">
                {error}
              </p>
            )}

            <TreeForm onAddTree={handleAddTree} />

            <TreeList
              trees={trees}
              onRemoveTree={handleOpenDelete}
              onEditTree={handleEditTree}
              onViewTree={handleOpenView}
            />

            {treeToView && (
              <ViewTreeModal
                isOpen={viewModalOpen}
                tree={treeToView}
                fazenda={farmName}
                talhao={plotName}
                parcela={subPlotName}
                onClose={() => setViewModalOpen(false)}
                onEdit={handleEditTree}
                onDelete={handleOpenDelete}
              />
            )}

            {treeToDelete && (
              <DeleteTreeModal
                isOpen={deleteModalOpen}
                tree={treeToDelete}
                parcela={subPlotName}
                onConfirm={handleRemoveTree}
                onClose={() => setDeleteModalOpen(false)}
              />
            )}

            {treeToEdit && (
              <EditTreeModal
                isOpen={editModalOpen}
                tree={treeToEdit}
                fazenda={farmName}
                parcela={subPlotName}
                numeroArvore={treeToEdit.numero}
                indiceAtual={trees.findIndex((t) => t.id === treeToEdit.id) + 1}
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
                label={loading ? 'Salvando...' : 'Salvar'}
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
