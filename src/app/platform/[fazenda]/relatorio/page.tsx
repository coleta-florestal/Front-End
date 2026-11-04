'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/ui/Topbar';
import ReportGenerationSection from '@/components/report/ReportGenerationSection';

interface FarmReportPageProps {
  params: Promise<{ fazenda: string }>;
}

const FARM_NAMES_MOCK: Record<string, string> = {
  'fazenda-santa-maria': 'Fazenda Santa Maria',
  'fazenda-boa-vista': 'Fazenda Boa Vista',
  'fazenda-norte': 'Fazenda Norte',
};

export default function FarmReportPage({ params }: FarmReportPageProps) {
  const { fazenda } = use(params);
  const router = useRouter();
  const farmName = FARM_NAMES_MOCK[fazenda] ?? 'Fazenda Santa Clara';

  return (
    <section className="flex flex-col gap-6 bg-[#EFECE4] p-6 md:p-8">
      <Topbar
        title="Relatório"
        description={`Inventário florestal · ${farmName}`}
        onBack={() => router.push(`/platform/${fazenda}`)}
      />

      <ReportGenerationSection
        previewData={{
          systemTitle: 'Lyptus',
          farmName,
          hasData: fazenda !== 'fazenda-norte',
        }}
      />
    </section>
  );
}
