'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatArea, getFarmsWithDetails, toFarm } from '@/app/api/api';
import Topbar from '@/components/ui/Topbar';
import FarmSummaryCard from '@/components/farm/FarmSummaryCard';
import FarmSearchSection from '@/components/farm/FarmSearchSection';
import { isCurrentUserAdmin } from '@/lib/auth';
import { Farm } from '@/types/farm';

export default function FarmsPage() {
  const router = useRouter();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    () =>
      getFarmsWithDetails()
        .then((records) => {
          setFarms(records.map(toFarm));
          setIsAdmin(isCurrentUserAdmin());
          setError(null);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar as fazendas');
        })
        .finally(() => setLoading(false)),
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  const totalPlots = farms.reduce((acc, farm) => acc + farm.totalPlots, 0);
  const totalAreaHa = farms.reduce((acc, farm) => acc + farm.areaHa, 0);
  const completedParcels = farms.reduce((acc, farm) => acc + farm.completedParcels, 0);
  const totalParcels = farms.reduce((acc, farm) => acc + farm.totalParcels, 0);
  const measuredTrees = farms.reduce((acc, farm) => acc + farm.measuredTrees, 0);

  return (
    <div className="flex flex-col min-h-full bg-[#EFECE4]">
      <Topbar
        title="Fazendas"
        description="Nível 1 - selecione a fazenda do inventário"
        onBack={() => router.push('/platform/fazendas')}
      />

      <section className="flex flex-col gap-6 p-6 md:p-8">
        {loading && <p className="text-sm text-[#6E776B]">Carregando fazendas...</p>}

        {error && (
          <p role="alert" className="text-sm text-coral-flor">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FarmSummaryCard
                title="FAZENDAS"
                value={farms.length}
                subtitle={`${totalPlots} Talhões cadastrados`}
              />

              <FarmSummaryCard
                title="ÁREA TOTAL"
                value={`${formatArea(totalAreaHa)} ha`}
                subtitle="área plantada inventariada"
              />

              <FarmSummaryCard
                title="PARCELAS CONCLUÍDAS"
                value={completedParcels}
                subtitle={`de ${totalParcels} parcelas`}
              />

              <FarmSummaryCard
                title="ÁRVORES MEDIDAS"
                value={measuredTrees}
                subtitle="registradas no inventário"
              />
            </div>

            <FarmSearchSection initialFarms={farms} isAdmin={isAdmin} onFarmsChanged={load} />
          </>
        )}
      </section>
    </div>
  );
}
