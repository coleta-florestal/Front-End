'use client';

import { useCallback, useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import {
  createPlot,
  FARM_STATUS_LABELS,
  formatArea,
  getFarmWithDetails,
  summarizeSubPlots,
  toFarm,
} from '@/app/api/api';
import { isCurrentUserAdmin } from '@/lib/auth';
import Topbar from '@/components/ui/Topbar';
import { FarmCard } from '@/components/farm/FarmCard';
import { TalhaoSummary } from '@/components/talhoes/TalhaoSummary';
import { Input } from '@/components/core/Input';
import { CreateTalhaoModal } from '@/components/modal/CreateTalhaoModal'; // Ajuste o caminho se necessário
import { PrismaFarmRecord } from '@/types/farm';

interface FazendaTalhoesPageProps {
  params: Promise<{ fazenda: string }>;
}

export default function FazendaTalhoesPage({ params }: FazendaTalhoesPageProps) {
  const router = useRouter();

  const { fazenda } = use(params);

  const [termoBusca, setTermoBusca] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [farmRecord, setFarmRecord] = useState<PrismaFarmRecord | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    () =>
      getFarmWithDetails(fazenda)
        .then((record) => {
          setFarmRecord(record);
          setIsAdmin(isCurrentUserAdmin());
          setError(null);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar a fazenda');
        })
        .finally(() => setLoading(false)),
    [fazenda],
  );

  useEffect(() => {
    load();
  }, [load]);

  const farm = farmRecord ? toFarm(farmRecord) : null;

  const talhoes = (farmRecord?.plots ?? []).map((plot) => {
    const resumo = summarizeSubPlots(plot.subPlots ?? []);

    return {
      id: plot.id,
      nome: plot.name,
      status: FARM_STATUS_LABELS[resumo.status],
      area: `${formatArea(plot.areaHa)} ha`,
      parcelasConcluidas: resumo.completedParcels,
      parcelasTotais: resumo.totalParcels,
      progresso: resumo.progress,
    };
  });

  const talhoesFiltrados = talhoes.filter((t) =>
    t.nome.toLowerCase().includes(termoBusca.toLowerCase()),
  );

  const handleSaveTalhao = async (data: { nome: string; area: string; descricao: string }) => {
    await createPlot(fazenda, {
      name: data.nome.trim(),
      areaHA: Number(data.area),
      description: data.descricao.trim() || undefined,
    });

    setIsCreateModalOpen(false);
    await load();
  };

  return (
    <div className="min-h-screen bg-[#F2F0E9]">
      <Topbar
        title="Talhões"
        description="Nível 2 · talhões da fazenda selecionada"
        onBack={() => router.back()}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && <p className="text-sm text-[#848079]">Carregando talhões...</p>}

        {error && (
          <p role="alert" className="mb-6 text-sm text-coral-flor">
            {error}
          </p>
        )}

        {farm && (
          <>
            <FarmCard
              nome={farm.name}
              status={FARM_STATUS_LABELS[farm.status]}
              localizacao={farm.location}
              responsavel={farm.responsible}
              talhoes={farm.totalPlots}
              areaTotal={`${formatArea(farm.areaHa)} ha`}
              parcelasConcluidas={farm.completedParcels}
              parcelasTotais={farm.totalParcels}
              arvores={farm.measuredTrees}
            />

            <div className="mt-10 mb-6">
              <h3 className="text-2xl text-verde-mata font-newsreader font-semibold">
                Talhões da fazenda
              </h3>
              <p className="text-[#848079] text-sm mt-1">
                Abra um talhão para ver as parcelas de amostragem.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1">
                <Input
                  label=""
                  placeholder="Buscar Talhão"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="bg-white rounded-xl! border-[#D7D0C2] w-full"
                />
              </div>

              {isAdmin && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-[#BFC9BF] rounded-xl text-verde-mata bg-transparent hover:bg-white transition-colors font-semibold whitespace-nowrap h-11.5 self-end cursor-pointer"
                >
                  Adicionar Talhão
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {talhoesFiltrados.map((talhao) => (
                <div
                  key={talhao.id}
                  onClick={() => router.push(`/platform/fazendas/${fazenda}/${talhao.id}`)}
                  className="cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:shadow-md rounded-3xl"
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver parcelas do ${talhao.nome}`}
                >
                  <TalhaoSummary
                    nome={talhao.nome}
                    status={talhao.status}
                    area={talhao.area}
                    plantio="—"
                    parcelasConcluidas={talhao.parcelasConcluidas}
                    parcelasTotais={talhao.parcelasTotais}
                    progresso={talhao.progresso}
                  />
                </div>
              ))}

              {talhoesFiltrados.length === 0 && (
                <div className="col-span-full text-center py-12 text-[#848079] bg-white rounded-3xl border border-[#D7D0C2]">
                  {termoBusca
                    ? `Nenhum talhão encontrado para "${termoBusca}".`
                    : 'Nenhum talhão cadastrado.'}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {isCreateModalOpen && (
        <CreateTalhaoModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveTalhao}
        />
      )}
    </div>
  );
}
