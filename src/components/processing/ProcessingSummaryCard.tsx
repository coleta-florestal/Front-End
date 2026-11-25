import { EQUATION_MODELS } from '@/lib/equations';
import { InventoryProcessingResult } from '@/types/processing';

export interface ProcessingSummaryCardProps {
  result: InventoryProcessingResult;
}

export const formatNumber = (value: number, digits = 2) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });

export function ProcessingSummaryCard({ result }: ProcessingSummaryCardProps) {
  const { context, totals, statistics } = result;
  const volume = statistics.volumePerHa;

  const items = [
    { label: 'Volume médio', value: `${formatNumber(totals.meanVolumePerHaM3)} m³/ha` },
    {
      label: 'Volume total estimado',
      value:
        totals.estimatedTotalVolumeM3 != null
          ? `${formatNumber(totals.estimatedTotalVolumeM3)} m³`
          : '—',
    },
    {
      label: `Intervalo de confiança (${formatNumber(volume.confidenceLevel * 100, 0)}%)`,
      value: `${formatNumber(volume.confidenceIntervalLower)} a ${formatNumber(volume.confidenceIntervalUpper)} m³/ha`,
    },
    {
      label: 'Parcelas e árvores',
      value: `${totals.totalSubPlotsSampled} parcelas · ${totals.totalTreesMeasured} árvores`,
    },
  ];

  return (
    <section
      id="processamento-resultado"
      aria-live="polite"
      className="flex flex-col gap-4 rounded-2xl border border-[#B8D8BE] bg-[#EEF3EE] p-4 lg:p-6"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-newsreader text-2xl font-semibold text-verde-mata">
            Processamento concluído
          </h2>
          <p className="text-sm text-[#6D786E]">
            {context.plotName} · {context.equationUsed.name} (
            {EQUATION_MODELS[context.equationUsed.modelType]?.label ??
              context.equationUsed.modelType}
            )
          </p>
        </div>
        <span
          className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${
            volume.meetsErrorThreshold
              ? 'border-[#B8D8BE] bg-white text-verde-mata'
              : 'border-coral-flor/50 bg-[#FBECE8] text-[#B85C47]'
          }`}
        >
          Erro amostral {formatNumber(volume.relativeSamplingErrorPercent, 1)}%{' '}
          {volume.meetsErrorThreshold ? 'dentro' : 'acima'} do limite de{' '}
          {formatNumber(volume.targetErrorPercent, 0)}%
        </span>
      </div>

      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl bg-white p-4">
            <dt className="text-xs font-semibold uppercase tracking-wider text-[#6D786E]">
              {item.label}
            </dt>
            <dd className="mt-1 font-semibold text-verde-mata">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
