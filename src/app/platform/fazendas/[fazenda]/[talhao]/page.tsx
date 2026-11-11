'use client';

import { useCallback, useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  createSubPlot,
  FARM_STATUS_LABELS,
  formatArea,
  getFarm,
  getPlot,
  getSubPlotStatusLabel,
  getSubPlotsWithTrees,
  summarizeSubPlots,
  updateSubPlotStatus,
} from '@/app/api/api';
import Topbar from '@/components/ui/Topbar';
import { TalhaoCard } from '@/components/talhoes/TalhaoCard';
import { ParcelRow } from '@/components/parcels/ParcelRow';
import { CreateParcelModal } from '@/components/modal/CreateParcelModal';
import { ReopenParcelModal } from '@/components/modal/ReopenParcelModal';
import { CompleteParcelModal } from '@/components/modal/CompleteParcelModal';
import Button from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { PrismaFarmRecord, PrismaPlotRecord, PrismaSubPlotRecord } from '@/types/farm';

interface ParcelasPageProps {
  params: Promise<{ fazenda: string; talhao: string }>;
}

export default function ParcelasPage({ params }: ParcelasPageProps) {
  const router = useRouter();
  const { fazenda, talhao } = use(params);

  const [farm, setFarm] = useState<PrismaFarmRecord | null>(null);
  const [plot, setPlot] = useState<PrismaPlotRecord | null>(null);
  const [subPlots, setSubPlots] = useState<PrismaSubPlotRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [parcelaReabrir, setParcelaReabrir] = useState('');
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [parcelaCompletar, setParcelaCompletar] = useState('');
  const [termoBusca, setTermoBusca] = useState('');

  const load = useCallback(
    () =>
      Promise.all([
        getFarm(fazenda),
        getPlot(fazenda, talhao),
        getSubPlotsWithTrees(fazenda, talhao),
      ])
        .then(([farmRecord, plotRecord, subPlotRecords]) => {
          setFarm(farmRecord);
          setPlot(plotRecord);
          setSubPlots(subPlotRecords);
          setError(null);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar o talhão');
        })
        .finally(() => setLoading(false)),
    [fazenda, talhao],
  );

  useEffect(() => {
    load();
  }, [load]);

  const resumo = summarizeSubPlots(subPlots);

  const parcelas = subPlots.map((subPlot) => ({
    id: subPlot.id,
    nome: subPlot.name,
    numero: `Parcela ${subPlot.name}`,
    status: getSubPlotStatusLabel(subPlot),
    concluido: subPlot.status === 'COMPLETED',
    area: subPlot.areaM2 != null ? `${formatArea(subPlot.areaM2)} m²` : '—',
    arvoresMedidas: subPlot.trees?.length ?? 0,
    metaReferencia: subPlot.targetTrees,
    metragemTotal: Number(
      (subPlot.trees ?? []).reduce((acc, tree) => acc + (tree.height ?? 0), 0).toFixed(1),
    ),
  }));

  const parcelasFiltradas = parcelas.filter((parcela) => {
    const termo = termoBusca.toLowerCase();
    return (
      parcela.numero.toLowerCase().includes(termo) || parcela.status.toLowerCase().includes(termo)
    );
  });

  const handleCreateParcela = async (data: {
    identificacao: string;
    area: string;
    metaArvores: string;
  }) => {
    await createSubPlot(fazenda, talhao, {
      name: data.identificacao.trim(),
      areaM2: Number(data.area),
      targetTrees: Number(data.metaArvores),
    });

    setIsCreateModalOpen(false);
    await load();
  };

  const handleConfirmReabrir = async () => {
    await updateSubPlotStatus(fazenda, talhao, parcelaReabrir, 'OPEN');
    setIsReopenModalOpen(false);
    setParcelaReabrir('');
    await load();
  };

  const handleConfirmConcluir = async () => {
    await updateSubPlotStatus(fazenda, talhao, parcelaCompletar, 'COMPLETED');
    setIsCompleteModalOpen(false);
    setParcelaCompletar('');
    await load();
  };

  const parcelaSendoReaberta = parcelas.find((p) => p.id === parcelaReabrir);
  const parcelaSendoConcluida = parcelas.find((p) => p.id === parcelaCompletar);

  return (
    <div className="min-h-screen bg-creme-flor">
      <Topbar
        title="Detalhe do talhão"
        description={
          farm
            ? `${farm.name} · ${resumo.completedParcels} de ${resumo.totalParcels} parcelas concluídas`
            : 'Nível 3 · parcelas do talhão'
        }
        onBack={() => router.back()}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && <p className="text-sm text-verde-eucalipto">Carregando parcelas...</p>}

        {error && (
          <p role="alert" className="mb-6 text-sm text-coral-flor">
            {error}
          </p>
        )}

        {farm && plot && (
          <>
            <TalhaoCard
              nome={plot.name}
              status={FARM_STATUS_LABELS[resumo.status]}
              localizacao={farm.address ?? 'Local não informado'}
              responsavel={farm.owner?.name ?? 'Responsável técnico'}
              inicio={new Date(plot.createdAt).toLocaleDateString('pt-BR')}
              parcelas={resumo.totalParcels}
              concluidas={resumo.completedParcels}
              arvores={resumo.measuredTrees}
              progresso={resumo.progress}
            />

            <div className="mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex-1 w-full">
                <Input
                  label="Buscar Parcela"
                  placeholder="Digite o número (ex: P01) ou status..."
                  type="search"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="rounded-xl!"
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  label="+ Adicionar Parcela"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="border-2 border-verde-mata/30 bg-white text-verde-mata hover:bg-verde-mata/5 rounded-xl px-6 h-11.5 font-semibold whitespace-nowrap"
                />
                <Button
                  label="Processar talhão"
                  onClick={() =>
                    router.push(`/platform/fazendas/${fazenda}/${talhao}/processamento`)
                  }
                  className="bg-coral-flor text-creme-flor hover:bg-coral-flor/90 rounded-xl px-6 h-11.5 font-semibold whitespace-nowrap"
                />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {parcelasFiltradas.length > 0 ? (
                parcelasFiltradas.map((parcela) => (
                  <ParcelRow
                    key={parcela.id}
                    numero={parcela.numero}
                    status={parcela.status}
                    concluido={parcela.concluido}
                    area={parcela.area}
                    arvoresMedidas={parcela.arvoresMedidas}
                    metaReferencia={parcela.metaReferencia}
                    onReabrir={
                      parcela.concluido
                        ? () => {
                            setParcelaReabrir(parcela.id);
                            setIsReopenModalOpen(true);
                          }
                        : undefined
                    }
                    onVerArvores={
                      parcela.concluido
                        ? () => router.push(`/platform/fazendas/${fazenda}/${talhao}/${parcela.id}`)
                        : undefined
                    }
                    primaryLabel={
                      parcela.status === 'EM ANDAMENTO'
                        ? 'Continuar coleta'
                        : parcela.status === 'NÃO INICIADA'
                          ? 'Iniciar coleta'
                          : undefined
                    }
                    primaryOnClick={
                      !parcela.concluido
                        ? () => router.push(`/platform/fazendas/${fazenda}/${talhao}/${parcela.id}`)
                        : undefined
                    }
                    concluirLabel="Concluir parcela"
                    concluirOnClick={
                      parcela.status === 'EM ANDAMENTO'
                        ? () => {
                            setParcelaCompletar(parcela.id);
                            setIsCompleteModalOpen(true);
                          }
                        : undefined
                    }
                    concluirClassName="border border-[#D7D0C2] bg-white text-verde-mata hover:bg-[#f0ede5]"
                  />
                ))
              ) : (
                <div className="text-center py-12 text-verde-eucalipto bg-white rounded-3xl border border-[#D7D0C2]">
                  {termoBusca
                    ? `Nenhuma parcela encontrada com "${termoBusca}".`
                    : 'Nenhuma parcela cadastrada.'}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {isCreateModalOpen && (
        <CreateParcelModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateParcela}
        />
      )}

      {isReopenModalOpen && parcelaSendoReaberta && (
        <ReopenParcelModal
          isOpen={isReopenModalOpen}
          parcelaNumero={parcelaSendoReaberta.nome}
          onClose={() => setIsReopenModalOpen(false)}
          onConfirm={handleConfirmReabrir}
        />
      )}

      {isCompleteModalOpen && parcelaSendoConcluida && (
        <CompleteParcelModal
          isOpen={isCompleteModalOpen}
          parcelaNumero={parcelaSendoConcluida.nome}
          fazenda={farm?.name ?? ''}
          talhao={plot?.name ?? ''}
          arvoresRegistradas={parcelaSendoConcluida.arvoresMedidas}
          metragemTotal={parcelaSendoConcluida.metragemTotal}
          metaReferencia={parcelaSendoConcluida.metaReferencia}
          arvoresFaltando={Math.max(
            0,
            parcelaSendoConcluida.metaReferencia - parcelaSendoConcluida.arvoresMedidas,
          )}
          onClose={() => setIsCompleteModalOpen(false)}
          onConfirm={handleConfirmConcluir}
        />
      )}
    </div>
  );
}
