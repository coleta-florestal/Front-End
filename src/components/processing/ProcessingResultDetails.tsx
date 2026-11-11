import { ReactNode } from 'react';
import { QUALIDADE_LABELS } from '@/components/trees/TreeForm';
import { TreeQuality } from '@/types/farm';
import { InventoryProcessingResult, StatisticalMetricResult } from '@/types/processing';
import { formatNumber } from './ProcessingSummaryCard';

export interface ProcessingResultDetailsProps {
  result: InventoryProcessingResult;
}

const th = 'px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#6D786E]';
const td = 'px-3 py-2 text-sm text-verde-mata';

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-[#D7D0C2] bg-white p-4 lg:p-6">
      <h3 className="font-newsreader text-xl font-semibold text-verde-mata">{title}</h3>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

const statRows: { label: string; value: (metric: StatisticalMetricResult) => string }[] = [
  { label: 'Parcelas (n)', value: (m) => String(m.n) },
  { label: 'Média', value: (m) => formatNumber(m.mean) },
  { label: 'Desvio padrão', value: (m) => formatNumber(m.standardDeviation) },
  {
    label: 'Coeficiente de variação',
    value: (m) => `${formatNumber(m.coefficientOfVariation, 1)}%`,
  },
  {
    label: 'Erro padrão',
    value: (m) => `${formatNumber(m.standardError)} (${formatNumber(m.standardErrorPercent, 1)}%)`,
  },
  { label: 'Graus de liberdade', value: (m) => String(m.degreesOfFreedom) },
  { label: 't de Student', value: (m) => formatNumber(m.tStudent, 3) },
  { label: 'Erro absoluto de amostragem', value: (m) => formatNumber(m.absoluteSamplingError) },
  {
    label: 'Erro relativo de amostragem',
    value: (m) => `${formatNumber(m.relativeSamplingErrorPercent, 1)}%`,
  },
  {
    label: 'Intervalo de confiança',
    value: (m) =>
      `${formatNumber(m.confidenceIntervalLower)} a ${formatNumber(m.confidenceIntervalUpper)}`,
  },
];

export function ProcessingResultDetails({ result }: ProcessingResultDetailsProps) {
  const { statistics, diameterClasses, qualityDistribution, subPlots } = result;

  const warnings = subPlots.flatMap((subPlot) =>
    (subPlot.trees ?? [])
      .filter((tree) => !tree.isValid)
      .map((tree) => ({
        key: `${subPlot.id ?? subPlot.name}-${tree.id ?? tree.name}`,
        text: `Parcela ${subPlot.name} · Árvore ${tree.name ?? '—'}: ${(tree.warnings ?? []).join('; ') || 'inválida'}`,
      })),
  );

  return (
    <div className="flex flex-col gap-4">
      <DetailSection title="Estatísticas de amostragem">
        <table className="w-full min-w-120 text-left">
          <thead>
            <tr>
              <th className={th}>Medida</th>
              <th className={`${th} text-right`}>Volume por hectare (m³/ha)</th>
              <th className={`${th} text-right`}>Volume por parcela (m³)</th>
            </tr>
          </thead>
          <tbody>
            {statRows.map((row) => (
              <tr key={row.label} className="border-t border-[#E8E4DA]">
                <td className={td}>{row.label}</td>
                <td className={`${td} text-right`}>{row.value(statistics.volumePerHa)}</td>
                <td className={`${td} text-right`}>{row.value(statistics.volumePerSubPlot)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DetailSection>

      <DetailSection title="Classes de DAP">
        <table className="w-full min-w-120 text-left">
          <thead>
            <tr>
              <th className={th}>Classe</th>
              <th className={`${th} text-right`}>Árvores</th>
              <th className={`${th} text-right`}>%</th>
              <th className={`${th} text-right`}>Volume (m³)</th>
            </tr>
          </thead>
          <tbody>
            {diameterClasses.map((item) => (
              <tr key={item.classRange} className="border-t border-[#E8E4DA]">
                <td className={td}>{item.classRange}</td>
                <td className={`${td} text-right`}>{item.treeCount}</td>
                <td className={`${td} text-right`}>{formatNumber(item.percentage, 1)}%</td>
                <td className={`${td} text-right`}>{formatNumber(item.totalVolumeM3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DetailSection>

      <DetailSection title="Qualidade das árvores">
        <table className="w-full min-w-120 text-left">
          <thead>
            <tr>
              <th className={th}>Qualidade</th>
              <th className={`${th} text-right`}>Árvores</th>
              <th className={`${th} text-right`}>%</th>
              <th className={`${th} text-right`}>Volume (m³)</th>
            </tr>
          </thead>
          <tbody>
            {qualityDistribution.map((item) => (
              <tr key={item.quality} className="border-t border-[#E8E4DA]">
                <td className={td}>
                  {QUALIDADE_LABELS[item.quality as TreeQuality] ?? item.quality}
                </td>
                <td className={`${td} text-right`}>{item.treeCount}</td>
                <td className={`${td} text-right`}>{formatNumber(item.percentage, 1)}%</td>
                <td className={`${td} text-right`}>{formatNumber(item.totalVolumeM3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DetailSection>

      <DetailSection title="Parcelas">
        <table className="w-full min-w-200 text-left">
          <thead>
            <tr>
              <th className={th}>Parcela</th>
              <th className={`${th} text-right`}>Área (m²)</th>
              <th className={`${th} text-right`}>Árvores</th>
              <th className={`${th} text-right`}>Volume (m³)</th>
              <th className={`${th} text-right`}>Volume/ha</th>
              <th className={`${th} text-right`}>Árvores/ha</th>
              <th className={`${th} text-right`}>DAP médio (cm)</th>
              <th className={`${th} text-right`}>Altura média (m)</th>
            </tr>
          </thead>
          <tbody>
            {subPlots.map((subPlot) => (
              <tr key={subPlot.id ?? subPlot.name} className="border-t border-[#E8E4DA]">
                <td className={td}>{subPlot.name}</td>
                <td className={`${td} text-right`}>{formatNumber(subPlot.areaM2, 0)}</td>
                <td className={`${td} text-right`}>
                  {subPlot.validTreeCount ?? subPlot.treeCount} de {subPlot.treeCount}
                </td>
                <td className={`${td} text-right`}>{formatNumber(subPlot.totalVolumeM3)}</td>
                <td className={`${td} text-right`}>{formatNumber(subPlot.volumePerHa)}</td>
                <td className={`${td} text-right`}>{formatNumber(subPlot.treesPerHa, 0)}</td>
                <td className={`${td} text-right`}>{formatNumber(subPlot.meanDapCm)}</td>
                <td className={`${td} text-right`}>
                  {subPlot.meanHeightM != null ? formatNumber(subPlot.meanHeightM) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {warnings.length > 0 && (
          <details className="mt-4 text-sm text-verde-mata">
            <summary className="cursor-pointer font-semibold">
              Avisos de validação ({warnings.length})
            </summary>
            <ul className="mt-2 list-disc pl-5 text-[#6D786E]">
              {warnings.map((warning) => (
                <li key={warning.key}>{warning.text}</li>
              ))}
            </ul>
          </details>
        )}
      </DetailSection>
    </div>
  );
}
