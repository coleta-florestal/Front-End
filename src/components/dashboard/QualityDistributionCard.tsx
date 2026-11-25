import { QUALIDADE_LABELS } from '@/components/trees/TreeForm';
import type { FarmDashboardSummary } from '@/types/dashboard';

interface QualityDistributionCardProps {
  distribution: FarmDashboardSummary['qualityDistribution'];
}

export function QualityDistributionCard({ distribution }: QualityDistributionCardProps) {
  const total = distribution.reduce((acc, item) => acc + item.total, 0);

  return (
    <section className="rounded-3xl border border-[#D7D0C2] bg-white p-5 sm:p-6">
      <h2 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-[#848079]">
        Qualidade das árvores
      </h2>

      {total === 0 ? (
        <p className="text-sm text-[#848079]">Nenhuma árvore medida ainda.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {distribution.map((item) => (
            <li key={item.quality} className="flex justify-between gap-4 text-sm text-verde-mata">
              <span>{QUALIDADE_LABELS[item.quality] ?? item.quality}</span>
              <span className="font-semibold">
                {item.total} ·{' '}
                {((item.total / total) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}
                %
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
