'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFarmDashboardSummary, getFarms, getPlotsWithDetails, toFarm } from '@/app/api/api';
import { buildFarmDashboard, formatDecimal } from '@/lib/dashboard';
import Topbar from '@/components/ui/Topbar';
import { DashboardFarmHeader } from '@/components/dashboard/DashboardFarmHeader';
import { DashboardStatCard } from '@/components/dashboard/DashboardStatCard';
import { TreesPerParcelChart } from '@/components/dashboard/TreesPerParcelChart';
import { ParcelProgressList } from '@/components/dashboard/ParcelProgressList';
import { QualityDistributionCard } from '@/components/dashboard/QualityDistributionCard';
import type { FarmDashboardSummary } from '@/types/dashboard';
import type { PrismaFarmRecord, PrismaPlotRecord } from '@/types/farm';

interface LoadedPlots {
  farmId: string;
  plots: PrismaPlotRecord[];
}

interface LoadedSummary {
  farmId: string;
  data: FarmDashboardSummary | null;
  failed: boolean;
}

export default function Dashboards() {
  const router = useRouter();

  const [farms, setFarms] = useState<PrismaFarmRecord[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [loadedPlots, setLoadedPlots] = useState<LoadedPlots | null>(null);
  const [loadedSummary, setLoadedSummary] = useState<LoadedSummary | null>(null);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFarms()
      .then((records) => {
        setFarms(records);
        setSelectedFarmId(records[0]?.id ?? '');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar as fazendas');
      })
      .finally(() => setLoadingFarms(false));
  }, []);

  useEffect(() => {
    if (!selectedFarmId) return;

    // Ao trocar de fazenda rapidamente, a resposta da anterior não pode sobrescrever a atual.
    let cancelled = false;

    getPlotsWithDetails(selectedFarmId)
      .then((plots) => {
        if (cancelled) return;
        setLoadedPlots({ farmId: selectedFarmId, plots });
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Não foi possível carregar a fazenda');
      });

    return () => {
      cancelled = true;
    };
  }, [selectedFarmId]);

  // O back reprocessa todos os talhões nesse endpoint, então ele carrega à parte e não trava o resto da tela.
  useEffect(() => {
    if (!selectedFarmId) return;

    let cancelled = false;

    getFarmDashboardSummary(selectedFarmId)
      .then((data) => {
        if (!cancelled) setLoadedSummary({ farmId: selectedFarmId, data, failed: false });
      })
      .catch(() => {
        if (!cancelled) setLoadedSummary({ farmId: selectedFarmId, data: null, failed: true });
      });

    return () => {
      cancelled = true;
    };
  }, [selectedFarmId]);

  const summaryState = loadedSummary?.farmId === selectedFarmId ? loadedSummary : null;
  const summary = summaryState?.data ?? null;

  const farmRecord = useMemo(() => {
    const base = farms.find((farm) => farm.id === selectedFarmId);
    if (!base || loadedPlots?.farmId !== selectedFarmId) return null;
    return { ...base, plots: loadedPlots.plots };
  }, [farms, selectedFarmId, loadedPlots]);

  const farm = farmRecord ? toFarm(farmRecord) : null;
  const dashboard = farmRecord ? buildFarmDashboard(farmRecord) : null;
  const loadingFarmData = selectedFarmId !== '' && !farmRecord && !error;

  const handleSelectFarm = (farmId: string) => {
    setError(null);
    setSelectedFarmId(farmId);
  };

  return (
    <div className="min-h-screen bg-[#F5F2EC]">
      <Topbar
        title="Dashboards"
        description="Métricas da coleta por fazenda"
        onBack={() => router.push('/platform')}
      />

      <main className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <p role="alert" className="text-sm text-coral-flor">
            {error}
          </p>
        )}

        {loadingFarms && <p className="text-sm text-verde-mata/60">Carregando fazendas...</p>}

        {!loadingFarms && farms.length === 0 && !error && (
          <p className="text-sm text-[#848079]">Nenhuma fazenda registrada ainda.</p>
        )}

        {farms.length > 0 && (
          <DashboardFarmHeader
            farms={farms}
            selectedFarmId={selectedFarmId}
            onSelectFarm={handleSelectFarm}
            farm={farm}
          />
        )}

        {loadingFarmData && (
          <p className="text-sm text-verde-mata/60">Carregando dados da fazenda...</p>
        )}

        {dashboard && (
          <>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 xl:gap-6">
              <DashboardStatCard
                label="Parcelas"
                value={dashboard.totalParcels}
                subtitle={`${dashboard.completedParcels} concluídas`}
              />
              <DashboardStatCard
                label="Árvores"
                value={dashboard.measuredTrees}
                subtitle={`de ${dashboard.targetTrees} previstas`}
              />
              <DashboardStatCard
                label="DAP médio"
                value={formatDecimal(dashboard.meanDapCm, 'cm')}
                subtitle="média da amostra"
              />
              <DashboardStatCard
                label="Altura média"
                value={formatDecimal(dashboard.meanHeightM, 'm')}
                subtitle="média da amostra"
              />
            </div>

            {summaryState?.failed && (
              <p className="text-sm text-[#848079]">
                Não foi possível carregar volume e qualidade desta fazenda.
              </p>
            )}

            {!summaryState && (
              <p className="text-sm text-verde-mata/60">Calculando volume e qualidade...</p>
            )}

            {summary && (
              <>
                <div className="grid grid-cols-2 gap-4 xl:gap-6">
                  <DashboardStatCard
                    label="Volume estimado"
                    value={`${summary.summary.totalEstimatedVolumeM3.toLocaleString('pt-BR', {
                      maximumFractionDigits: 1,
                    })} m³`}
                    subtitle={
                      summary.summary.isVolumeTotalPartial
                        ? `parcial: ${summary.summary.plotsWithEstimatedVolume} de ${summary.summary.totalPlots} talhões`
                        : 'total da fazenda'
                    }
                  />
                  <DashboardStatCard
                    label="Talhões processados"
                    value={summary.summary.processedPlots}
                    subtitle={`de ${summary.summary.totalPlots} talhões`}
                  />
                </div>

                <QualityDistributionCard distribution={summary.qualityDistribution} />
              </>
            )}

            <TreesPerParcelChart
              parcels={dashboard.parcels}
              showPlotName={dashboard.hasMultiplePlots}
            />

            <ParcelProgressList
              parcels={dashboard.parcels}
              showPlotName={dashboard.hasMultiplePlots}
            />
          </>
        )}
      </main>
    </div>
  );
}
