'use client';

import { use, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  deleteTree,
  formatArea,
  getFarm,
  getPlot,
  getSubPlot,
  getSubPlotStatusLabel,
  getTrees,
  toTreeData,
  toTreeDto,
  updateSubPlotStatus,
  updateTree,
} from '@/app/api/api';
import Topbar from '@/components/ui/Topbar';
import { ParcelCard } from '@/components/parcels/ParcelCard';
import { TreeCard, type TreeData } from '@/components/trees/TreeCard';
import { DeleteTreeModal } from '@/components/modal/DeleteTreeModal';
import { ViewTreeModal } from '@/components/modal/ViewTreeModal';
import { EditTreeModal } from '@/components/modal/EditTreeModal';
import { CompleteParcelModal } from '@/components/modal/CompleteParcelModal';
import Button from '@/components/core/Button';
import { PrismaSubPlotRecord } from '@/types/farm';

interface ParcelaPageProps {
  params: Promise<{ fazenda: string; talhao: string; parcela: string }>;
}

export default function ParcelaPage({ params }: ParcelaPageProps) {
  const router = useRouter();
  const { fazenda, talhao, parcela } = use(params);

  const [farmName, setFarmName] = useState('');
  const [plotName, setPlotName] = useState('');
  const [subPlot, setSubPlot] = useState<PrismaSubPlotRecord | null>(null);
  const [trees, setTrees] = useState<TreeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [treeToDelete, setTreeToDelete] = useState<TreeData | null>(null);
  const [treeToView, setTreeToView] = useState<TreeData | null>(null);
  const [treeToEdit, setTreeToEdit] = useState<TreeData | null>(null);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);

  const load = useCallback(
    () =>
      Promise.all([
        getFarm(fazenda),
        getPlot(fazenda, talhao),
        getSubPlot(fazenda, talhao, parcela),
        getTrees(fazenda, talhao, parcela),
      ])
        .then(([farmRecord, plotRecord, subPlotRecord, treeRecords]) => {
          setFarmName(farmRecord.name);
          setPlotName(plotRecord.name);
          setSubPlot({ ...subPlotRecord, trees: treeRecords });
          setTrees(treeRecords.map(toTreeData));
          setError(null);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar a parcela');
        })
        .finally(() => setLoading(false)),
    [fazenda, talhao, parcela],
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleAddTree = () => {
    router.push(`/platform/fazendas/${fazenda}/${talhao}/${parcela}/cadastrar-arvore`);
  };

  const handleRemoveTree = async (tree: TreeData) => {
    await deleteTree(fazenda, talhao, parcela, tree.id);
    await load();
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

  const handleSaveTree = async (data: TreeData) => {
    await updateTree(fazenda, talhao, parcela, data.id, toTreeDto(data));
    setEditModalOpen(false);
    setTreeToEdit(null);
    await load();
  };

  const handleConcluir = () => {
    setCompleteModalOpen(true);
  };

  const handleConfirmComplete = async () => {
    await updateSubPlotStatus(fazenda, talhao, parcela, 'COMPLETED');
    setCompleteModalOpen(false);
    await load();
  };

  const meta = subPlot?.targetTrees ?? 0;
  const arvoresFaltando = Math.max(0, meta - trees.length);
  const concluida = subPlot?.status === 'COMPLETED';
  const nomeParcela = subPlot ? `Parcela ${subPlot.name}` : '';

  return (
    <div className="min-h-screen bg-creme-flor flex">
      <main className="flex-1 min-w-0">
        <Topbar
          title="Árvores"
          description="Nível 4 - medição das árvores da parcela"
          onBack={() => router.back()}
        />

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {loading && <p className="text-sm text-verde-mata/60">Carregando árvores...</p>}

          {error && (
            <p role="alert" className="mb-6 text-sm text-coral-flor">
              {error}
            </p>
          )}

          {subPlot && (
            <>
              <ParcelCard
                numero={subPlot.name}
                area={subPlot.areaM2 != null ? `${formatArea(subPlot.areaM2)} m²` : '—'}
                statusLabel={getSubPlotStatusLabel(subPlot)}
                talhao={plotName}
                arvoresMedidas={trees.length}
                metaReferencia={meta}
                descricaoRodape="Cadastro em lote: lance várias árvores, revise o conjunto numa tabela e salve tudo de uma vez."
                onAddTrees={concluida ? undefined : handleAddTree}
              />

              <section className="mt-8 bg-white p-6 rounded-3xl border border-[#D7D0C2]">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-verde-mata font-semibold text-xl font-newsreader">
                      Árvores registradas
                    </h2>
                    <p className="text-verde-mata/60 text-sm">
                      {trees.length} árvores registradas &nbsp;·&nbsp; faltam {arvoresFaltando} para
                      a meta
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

              {!concluida && (
                <div className="mt-12 flex justify-end">
                  <Button
                    type="button"
                    label="Concluir Parcela"
                    onClick={handleConcluir}
                    className="bg-coral-flor text-creme-flor border-2 border-[#D8D1C4] rounded-xl px-6 py-3 font-semibold hover:bg-coral-flor/70 transition-colors cursor-pointer"
                  />
                </div>
              )}
            </>
          )}

          {treeToView && (
            <ViewTreeModal
              isOpen={viewModalOpen}
              tree={treeToView}
              fazenda={farmName}
              talhao={plotName}
              parcela={nomeParcela}
              onClose={() => setViewModalOpen(false)}
              onEdit={handleEditTree}
              onDelete={handleOpenDelete}
            />
          )}

          {treeToEdit && (
            <EditTreeModal
              isOpen={editModalOpen}
              tree={treeToEdit}
              fazenda={farmName}
              parcela={nomeParcela}
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
              parcela={nomeParcela}
              onConfirm={handleRemoveTree}
              onClose={() => setDeleteModalOpen(false)}
            />
          )}

          {completeModalOpen && subPlot && (
            <CompleteParcelModal
              isOpen={completeModalOpen}
              fazenda={farmName}
              talhao={plotName}
              parcelaNumero={subPlot.name}
              arvoresRegistradas={trees.length}
              metragemTotal={Number(
                trees
                  .reduce((acc, t) => acc + parseFloat(t.altura.replace(',', '.')), 0)
                  .toFixed(1),
              )}
              metaReferencia={meta}
              arvoresFaltando={arvoresFaltando}
              onConfirm={handleConfirmComplete}
              onClose={() => setCompleteModalOpen(false)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
