'use client';

import { useEffect, useState, useCallback } from 'react';
import { getFarmsWithDetails, toFarm } from '@/app/api/api';
import type { Farm } from '@/types/farm';

import FarmOverviewSection from '@/components/farm/FarmOverviewSection';
import { ColetoresList, type Coletor } from '@/components/coletores/ColetoresList';
import Topbar from '@/components/ui/Topbar';
import { useRouter } from 'next/navigation';

export default function VisaoGeralPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchFarms = useCallback(
    () =>
      getFarmsWithDetails()
        .then((data) => {
          setFarms(data.map(toFarm));
        })
        .catch((error) => {
          console.error('Erro ao carregar fazendas:', error);
        })
        .finally(() => {
          setIsLoading(false);
        }),
    [],
  );

  useEffect(() => {
    fetchFarms();
  }, [fetchFarms]);

  const totalFazendas = farms.length;
  const totalTalhoes = farms.reduce((acc, farm) => acc + farm.totalPlots, 0);
  const parcelasConcluidas = farms.reduce((acc, farm) => acc + farm.completedParcels, 0);
  const totalParcelas = farms.reduce((acc, farm) => acc + farm.totalParcels, 0);

  const talhoesEmAndamento = farms.filter((f) => f.status === 'EM_ANDAMENTO').length;

  const mockColetores: Coletor[] = [
    { id: '1', nome: 'Eng. Amanda', status: 'EM COLETA' },
    { id: '2', nome: 'Pedro Silva', status: 'ONLINE' },
    { id: '3', nome: 'Marina Lima', status: 'OFFLINE' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F2EC]">
      <Topbar
        title="Visão Geral"
        description="Acompanhamento Operacional da coleta"
        onBack={() => router.push('/platform')}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-[#D7D0C2] p-6 lg:p-8 flex flex-col justify-center">
            <span className="text-[#848079] text-[11px] font-bold uppercase tracking-widest mb-3">
              Fazendas
            </span>
            <p className="text-verde-mata text-5xl font-bold font-newsreader mb-2">
              {String(totalFazendas).padStart(2, '0')}
            </p>
            <span className="text-[#848079] text-sm">registradas</span>
          </div>

          <div className="bg-white rounded-3xl border border-[#D7D0C2] p-6 lg:p-8 flex flex-col justify-center">
            <span className="text-[#848079] text-[11px] font-bold uppercase tracking-widest mb-3">
              Talhões
            </span>
            <p className="text-verde-mata text-5xl font-bold font-newsreader mb-2">
              {totalTalhoes}
            </p>
            <span className="text-[#848079] text-sm">{talhoesEmAndamento} em andamento</span>
          </div>

          <div className="bg-white rounded-3xl border border-[#D7D0C2] p-6 lg:p-8 flex flex-col justify-center">
            <span className="text-[#848079] text-[11px] font-bold uppercase tracking-widest mb-3">
              Parcelas Concluídas
            </span>
            <p className="text-verde-mata text-5xl font-bold font-newsreader mb-2">
              {parcelasConcluidas}
            </p>
            <span className="text-[#848079] text-sm">de {totalParcelas} parcelas</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl border border-[#D7D0C2] p-6 lg:p-8 lg:col-span-2 flex flex-col">
            <h2 className="text-[22px] font-bold text-verde-mata font-newsreader mb-6">
              Progresso das Fazendas
            </h2>

            <div className="flex flex-col gap-7 overflow-y-auto pr-2 scrollbar-thin">
              {farms.map((farm) => {
                const progress =
                  farm.totalParcels > 0
                    ? Math.round((farm.completedParcels / farm.totalParcels) * 100)
                    : 0;

                let barColor = 'bg-verde-mata';
                if (progress < 100 && progress > 0) barColor = 'bg-[#D46B3E]';
                if (progress === 0) barColor = 'bg-transparent';

                return (
                  <div key={farm.farmId} className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#20221E]">{farm.name}</span>
                      <span className="text-[#848079] text-[13px] font-medium">{progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#EBE7DF] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[#848079] text-xs">
                      {farm.completedParcels} de {farm.totalParcels} parcelas
                    </span>
                  </div>
                );
              })}

              {farms.length === 0 && !isLoading && (
                <p className="text-[#848079] text-sm">Nenhuma fazenda registrada ainda.</p>
              )}
            </div>
          </div>

          <ColetoresList coletores={mockColetores} className="h-full" />
        </div>

        <FarmOverviewSection initialFarms={farms} isAdmin={true} onFarmsChanged={fetchFarms} />
      </main>
    </div>
  );
}
