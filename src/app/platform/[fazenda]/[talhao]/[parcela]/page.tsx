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

interface ParcelaPageProps {
  params: Promise<{ fazenda: string; talhao: string; parcela: string }>;
}

// Dados de exemplo até a integração com a API
const PARCELA = {
  fazenda: 'Fazenda Santa Maria',
  talhao: 'Talhão 01',
  numero: 'P02',
  area: '400 m²',
  formato: 'Retangular',
  dimensoes: '20 × 20 m',
  especie: 'Eucalyptus grandis',
  meta: 15,
};

const TREES: TreeData[] = [
  {
    id: '1',
    numero: '05',
    dap: '21,0',
    altura: '17,0',
    observacoes: 'Bifurcação a 3 m',
    qualidade: 'NORMAL',
    sincronizada: false,
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
  const faltamParaMeta = PARCELA.meta - trees.length;

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
    setTrees((prev) => prev.map((t) => (t.id === data.id ? { ...data, sincronizada: false } : t)));
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
    <div className="min-h-screen bg-[#ECE8DE] flex">
      <main className="flex-1 min-w-0">
        <Topbar
          title="Árvores"
          description="Nível 4 · medição das árvores da parcela"
          onBack={() => router.back()}
          breadcrumb={['Fazendas', PARCELA.fazenda, PARCELA.talhao, `Parcela ${PARCELA.numero}`]}
          statusText="Sincronizado hoje, 09:42"
        />

        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          <ParcelCard
            numero={PARCELA.numero}
            area={PARCELA.area}
            formato={PARCELA.formato}
            statusLabel="EM ABERTO"
            naoSincronizada={trees.some((tree) => tree.sincronizada === false)}
            dimensoes={PARCELA.dimensoes}
            talhao={PARCELA.talhao}
            especie={PARCELA.especie}
            arvoresMedidas={trees.length}
            metaReferencia={PARCELA.meta}
            descricaoRodape="Cadastro em lote: lance várias árvores, revise o conjunto numa tabela e salve tudo de uma vez."
            onAddTrees={handleAddTree}
          />

          <section
            id="arvores-registradas"
            className="mt-4 bg-white p-4 rounded-2xl border border-[#D7D0C2] lg:p-6"
          >
            <div className="mb-6 flex flex-col gap-1 md:flex-row md:items-baseline md:gap-3">
              <h2 className="text-verde-mata font-semibold text-2xl font-newsreader">
                Árvores registradas
              </h2>
              <p className="text-[#6D786E] text-sm">
                {trees.length} {trees.length === 1 ? 'árvore registrada' : 'árvores registradas'}
                &nbsp;·&nbsp;
                {faltamParaMeta > 0 ? `faltam ${faltamParaMeta} para a meta` : 'meta atingida'}
              </p>
            </div>

            {trees.length > 0 ? (
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
            ) : (
              <p className="py-6 text-center text-sm text-[#6D786E]">
                Nenhuma árvore registrada nesta parcela.
              </p>
            )}
          </section>

          <div id="parcela-acoes" className="mt-4">
            <button
              type="button"
              onClick={handleConcluir}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-coral-flor bg-[#FBECE8] px-4 py-3 font-semibold text-[#A96A50] transition-colors hover:bg-coral-flor/20 sm:w-auto"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 22V4a1 1 0 0 1 1-1h14l-3 5 3 5H4" />
              </svg>
              Concluir Parcela
            </button>
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
              metaReferencia={PARCELA.meta}
              onConfirm={handleConfirmComplete}
              onClose={() => setCompleteModalOpen(false)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
