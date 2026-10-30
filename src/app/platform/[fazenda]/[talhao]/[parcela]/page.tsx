'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/ui/Topbar';
import { ParcelCard } from '@/components/parcels/ParcelCard';
import { TreeCard, type TreeData } from '@/components/trees/TreeCard';
import { DeleteTreeModal } from '@/components/modal/DeleteTreeModal';
import { ViewTreeModal } from '@/components/modal/ViewTreeModal';
import { EditTreeModal } from '@/components/modal/EditTreeModal';
import { CompleteParcelModal } from '@/components/modal/CompleteParcelModal';
import Button from '@/components/core/Button';

interface ParcelaPageProps {
  params: Promise<{ fazenda: string; talhao: string; parcela: string }>;
}

const TREES: TreeData[] = [
  {
    id: '1',
    numero: '05',
    dap: '21,0',
    altura: '17,0',
    observacoes: 'Bifurcação a 3 m',
    qualidade: 'NORMAL',
  },
  {
    id: '2',
    numero: '04',
    dap: '21,0',
    altura: '17,0',
    observacoes: 'Bifurcação a 3 m',
    qualidade: 'NORMAL',
  },
  {
    id: '3',
    numero: '03',
    dap: '21,0',
    altura: '17,0',
    observacoes: 'Bifurcação a 3 m',
    qualidade: 'NORMAL',
  },
  {
    id: '4',
    numero: '02',
    dap: '21,0',
    altura: '17,0',
    observacoes: 'Bifurcação a 3 m',
    qualidade: 'NORMAL',
  },
  {
    id: '5',
    numero: '01',
    dap: '21,0',
    altura: '17,0',
    observacoes: 'Bifurcação a 3 m',
    qualidade: 'NORMAL',
  },
];

export default function ParcelaPage({ params }: ParcelaPageProps) {
  const router = useRouter();
  const [trees, setTrees] = useState<TreeData[]>(TREES);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [treeToDelete, setTreeToDelete] = useState<TreeData | null>(null);
  const [treeToView, setTreeToView] = useState<TreeData | null>(null);
  const [treeToEdit, setTreeToEdit] = useState<TreeData | null>(null);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);

  const resolvedParams = use(params);

  const handleAddTree = () => {
    router.push(
      `/platform/${resolvedParams.fazenda}/${resolvedParams.talhao}/${resolvedParams.parcela}/cadastrar-arvore`,
    );
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

  const handleEditTree = (tree: TreeData) => {
    setTreeToEdit(tree);
    setEditModalOpen(true);
  };

  const handleSaveTree = (data: TreeData) => {
    setTrees((prev) => prev.map((t) => (t.id === data.id ? data : t)));
    setEditModalOpen(false);
    setTreeToEdit(null);
  };

  const handleConcluir = () => {
    setCompleteModalOpen(true);
  };

  const handleConfirmComplete = () => {
    // Ação de concluir parcela (pode ser integrada a um serviço/back-end posteriormente)
    setCompleteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-creme-flor flex">
      <main className="flex-1 min-w-0">
        <Topbar
          title="Árvores"
          description="Nível 4 - medição das árvores da parcela"
          onBack={() => router.back()}
        />

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <ParcelCard
            numero="P02"
            area="400 m²"
            statusLabel="EM ABERTO"
            dimensoes="20 × 20 m"
            talhao="Talhão 01"
            arvoresMedidas={trees.length}
            metaReferencia={15}
            descricaoRodape="Cadastro em lote: lance várias árvores, revise o conjunto numa tabela e salve tudo de uma vez."
            onAddTrees={handleAddTree}
          />

          <section className="mt-8 bg-white p-6 rounded-3xl border border-[#D7D0C2]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-verde-mata font-semibold text-xl font-newsreader">
                  Árvores registradas
                </h2>
                <p className="text-verde-mata/60 text-sm">
                  {trees.length} árvores registradas &nbsp;·&nbsp; faltam {15 - trees.length} para a
                  meta
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trees.map((tree) => (
                <TreeCard
                  key={tree.id}
                  tree={tree}
                  onRemove={handleOpenDelete}
                  onView={handleOpenView}
                />
              ))}
            </div>
          </section>

          <div className="mt-12 flex justify-end">
            <Button
              type="button"
              label="Concluir Parcela"
              onClick={handleConcluir}
              className="bg-coral-flor text-creme-flor border-2 border-[#D8D1C4] rounded-xl px-6 py-3 font-semibold hover:bg-coral-flor/70 transition-colors cursor-pointer"
            />
          </div>

          {treeToView && (
            <ViewTreeModal
              isOpen={viewModalOpen}
              tree={treeToView}
              fazenda={resolvedParams.fazenda}
              talhao={resolvedParams.talhao}
              parcela={`Parcela ${resolvedParams.parcela}`}
              onClose={() => setViewModalOpen(false)}
              onEdit={handleEditTree}
              onDelete={handleOpenDelete}
            />
          )}

          {treeToEdit && (
            <EditTreeModal
              isOpen={editModalOpen}
              tree={treeToEdit}
              fazenda={resolvedParams.fazenda}
              parcela={`Parcela ${resolvedParams.parcela}`}
              numeroArvore={treeToEdit.numero}
              onSave={handleSaveTree}
              onClose={() => {
                setEditModalOpen(false);
                setTreeToEdit(null);
              }}
            />
          )}

          {treeToDelete && (
            <DeleteTreeModal
              isOpen={deleteModalOpen}
              tree={treeToDelete}
              parcela={`Parcela ${resolvedParams.parcela}`}
              onConfirm={handleRemoveTree}
              onClose={() => setDeleteModalOpen(false)}
            />
          )}

          {completeModalOpen && (
            <CompleteParcelModal
              isOpen={completeModalOpen}
              fazenda={resolvedParams.fazenda}
              talhao={resolvedParams.talhao}
              parcela={`Parcela ${resolvedParams.parcela}`}
              arvoresRegistradas={trees.length}
              metragemTotal={trees
                .reduce((acc, t) => acc + parseFloat(t.altura.replace(',', '.')), 0)
                .toFixed(1)}
              metaReferencia={15}
              onConfirm={handleConfirmComplete}
              onClose={() => setCompleteModalOpen(false)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
