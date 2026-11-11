'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFarms, getPlotsWithDetails, toFarm } from '@/app/api/api';
import { buildFarmDashboard, formatDecimal } from '@/lib/dashboard';
import Topbar from '@/components/ui/Topbar';
import { DashboardFarmHeader } from '@/components/dashboard/DashboardFarmHeader';
import { DashboardStatCard } from '@/components/dashboard/DashboardStatCard';
import { TreesPerParcelChart } from '@/components/dashboard/TreesPerParcelChart';
import { ParcelProgressList } from '@/components/dashboard/ParcelProgressList';
import type { PrismaFarmRecord, PrismaPlotRecord } from '@/types/farm';

interface LoadedPlots {
  farmId: string;
  plots: PrismaPlotRecord[];
}

export default function Dashboards() {
  const router = useRouter();

  const [farms, setFarms] = useState<PrismaFarmRecord[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [loadedPlots, setLoadedPlots] = useState<LoadedPlots | null>(null);
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
