'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFarmWithDetails, toFarm } from '@/app/api/api';
import Topbar from '@/components/ui/Topbar';
import ReportGenerationSection from '@/components/report/ReportGenerationSection';
import { Farm } from '@/types/farm';

interface FarmReportPageProps {
  params: Promise<{ fazenda: string }>;
}

export default function FarmReportPage({ params }: FarmReportPageProps) {
  const { fazenda } = use(params);
  const router = useRouter();

  const [farm, setFarm] = useState<Farm | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setFarm(toFarm(await getFarmWithDetails(fazenda)));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar a fazenda');
      }
    }

    load();
  }, [fazenda]);

  return (
    <section className="flex flex-col gap-6 bg-[#EFECE4] p-6 md:p-8">
      <Topbar
        title="Relatório"
        description={`Inventário florestal · ${farm?.name ?? ''}`}
        onBack={() => router.push(`/platform/fazendas/${fazenda}`)}
      />

      {error && (
        <p role="alert" className="text-sm text-coral-flor">
          {error}
        </p>
      )}

      {!farm && !error && <p className="text-sm text-[#6E776B]">Carregando relatório...</p>}

      {farm && (
        <ReportGenerationSection
          previewData={{
            systemTitle: 'Lyptus',
            farmName: farm.name,
            hasData: farm.measuredTrees > 0,
          }}
        />
      )}
    </section>
  );
}
