import Link from 'next/link';
import { ArrowLeft } from '@/components/core/Icons';
import ReportGenerationSection from '@/components/ui/ReportGenerationSection';

interface FarmReportPageProps {
  params: Promise<{ fazenda: string }>;
}

const FARM_NAMES_MOCK: Record<string, string> = {
  'fazenda-santa-maria': 'Fazenda Santa Maria',
  'fazenda-boa-vista': 'Fazenda Boa Vista',
  'fazenda-norte': 'Fazenda Norte',
};

export default async function FarmReportPage({ params }: FarmReportPageProps) {
  const { fazenda } = await params;
  const farmName = FARM_NAMES_MOCK[fazenda] ?? 'Fazenda Santa Clara';

  return (
    <section className="flex flex-col gap-6 bg-[#EFECE4] p-6 md:p-8">
      <div className="flex items-center gap-3">
        <Link
          href={`/platform/${fazenda}`}
          aria-label="Voltar para a fazenda"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D7D0C2] bg-[#FAF8F3] transition-colors hover:bg-[#E4EDE2]"
        >
          <ArrowLeft size={17} color="#2C5F2D" />
        </Link>
        <span className="text-xs text-[#6E776B]">Sincronizado hoje, 09:42</span>
      </div>

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
