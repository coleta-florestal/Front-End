import { ReactNode } from 'react';
import Image from 'next/image';
import logo from '../../../public/assets/apenas_circulo.png';
import { QUALIDADE_LABELS } from '@/components/trees/TreeForm';
import { EQUATION_MODELS } from '@/lib/equations';
import { TreeQuality } from '@/types/farm';
import { InventoryProcessingResult } from '@/types/processing';
import { statRows } from './ProcessingResultDetails';
import { formatNumber } from './ProcessingSummaryCard';
import { ReportBarChart } from './ReportBarChart';

export interface ProcessingPrintReportProps {
  result: InventoryProcessingResult;
  farmName: string;
}

const th =
  'bg-[#EEF3EE] px-2 py-1.5 text-left text-tiny font-bold uppercase tracking-wider text-[#6D786E]';
const thRight = `${th} text-right`;
const td = 'px-2 py-1.5 text-xs text-[#2C2F33]';
const tdRight = `${td} text-right tabular-nums`;
const tr = 'break-inside-avoid border-b border-[#E8E4DA] even:bg-[#FAF8F3]';

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

const formatCoefficient = (value: number) =>
  value.toLocaleString('pt-BR', { maximumFractionDigits: 6 });

function ReportSection({
  number,
  title,
  children,
  keepTogether = false,
}: {
  number: number;
  title: string;
  children: ReactNode;
  keepTogether?: boolean;
}) {
  return (
    <section className={`mt-6 ${keepTogether ? 'break-inside-avoid' : ''}`}>
      <h2 className="mb-3 flex items-baseline gap-2 border-b-2 border-verde-mata pb-1 font-newsreader text-lg font-semibold text-verde-mata break-after-avoid">
        <span className="text-coral-flor">{number}.</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-tiny font-bold uppercase tracking-wider text-[#6D786E]">{label}</dt>
      <dd className="text-sm text-[#2C2F33]">{value}</dd>
    </div>
  );
}

export function ProcessingPrintReport({ result, farmName }: ProcessingPrintReportProps) {
  const { context, totals, statistics, diameterClasses, qualityDistribution, subPlots } = result;
  const volume = statistics.volumePerHa;
  const equation = context.equationUsed;
  const model = EQUATION_MODELS[equation.modelType];
  const processedAt = formatDateTime(context.processedAt);
  const confidence = formatNumber(volume.confidenceLevel * 100, 0);

  const coefficients = [
    `β₀ = ${formatCoefficient(equation.beta0)}`,
    `β₁ = ${formatCoefficient(equation.beta1)}`,
    ...(equation.beta2 != null ? [`β₂ = ${formatCoefficient(equation.beta2)}`] : []),
  ];

  const totalInterval =
    totals.estimatedTotalVolumeLowerM3 != null && totals.estimatedTotalVolumeUpperM3 != null
      ? `IC: ${formatNumber(totals.estimatedTotalVolumeLowerM3)} a ${formatNumber(totals.estimatedTotalVolumeUpperM3)} m³`
      : 'Área do talhão não informada';

  const kpis = [
    {
      label: 'Volume médio',
      value: `${formatNumber(totals.meanVolumePerHaM3)} m³/ha`,
      detail: `IC ${confidence}%: ${formatNumber(volume.confidenceIntervalLower)} a ${formatNumber(volume.confidenceIntervalUpper)} m³/ha`,
    },
    {
      label: 'Volume total estimado',
      value:
        totals.estimatedTotalVolumeM3 != null
          ? `${formatNumber(totals.estimatedTotalVolumeM3)} m³`
          : '—',
      detail: totalInterval,
    },
    {
      label: 'Amostragem',
      value: `${totals.totalSubPlotsSampled} parcelas`,
      detail: `${totals.totalTreesMeasured} árvores medidas${
        totals.totalValidTreesMeasured != null ? ` · ${totals.totalValidTreesMeasured} válidas` : ''
      }`,
    },
  ];

  const dendrometrics = [
    { label: 'DAP médio', value: `${formatNumber(totals.meanDapCm)} cm` },
    { label: 'DAP quadrático', value: `${formatNumber(totals.quadraticMeanDapCm)} cm` },
    {
      label: 'Altura média',
      value: totals.meanHeightM != null ? `${formatNumber(totals.meanHeightM)} m` : '—',
    },
    { label: 'Área basal', value: `${formatNumber(totals.meanBasalAreaPerHaM2)} m²/ha` },
    { label: 'Densidade', value: `${formatNumber(totals.meanTreesPerHa, 0)} árv./ha` },
  ];

  const warnings = subPlots.flatMap((subPlot) =>
    (subPlot.trees ?? [])
      .filter((tree) => !tree.isValid)
      .map((tree) => ({
        key: `${subPlot.id ?? subPlot.name}-${tree.id ?? tree.name}`,
        parcel: subPlot.name,
        tree: tree.name ?? '—',
        text: (tree.warnings ?? []).join('; ') || 'Inválida',
      })),
  );

  return (
    <article
      id="relatorio-pdf"
      className="hidden bg-white font-sans text-[#2C2F33] print:block"
      aria-label="Relatório de processamento para impressão"
    >
      <header className="flex items-center justify-between gap-6 rounded-xl bg-verde-mata px-6 py-4">
        <div className="flex items-center gap-3">
          <Image
            src={logo}
            alt="Glupta"
            className="h-12 w-12 select-none object-contain"
            loading="eager"
          />
          <div className="flex flex-col text-creme-flor">
            <span className="text-3xl font-semibold leading-none">Glupta</span>
            <span className="text-xs font-bold tracking-wider text-verde-eucalipto">
              COLETA FLORESTAL
            </span>
          </div>
        </div>
        <div className="text-right text-creme-flor">
          <p className="font-newsreader text-xl font-semibold">Relatório de Inventário Florestal</p>
          <p className="text-xs text-verde-eucalipto">
            Resultados do processamento · {processedAt}
          </p>
        </div>
      </header>

      <div className="mt-4 h-1 rounded-full bg-coral-flor" />

      <ReportSection number={1} title="Identificação" keepTogether>
        <dl className="grid grid-cols-3 gap-x-6 gap-y-3 rounded-xl border border-[#D7D0C2] p-4">
          <InfoItem label="Fazenda" value={farmName || context.farmName || '—'} />
          <InfoItem label="Talhão" value={context.plotName} />
          <InfoItem
            label="Área do talhão"
            value={context.plotAreaHa != null ? `${formatNumber(context.plotAreaHa)} ha` : '—'}
          />
          <InfoItem label="Método de amostragem" value="Amostragem Aleatória Simples (AAS)" />
          <InfoItem label="Data do processamento" value={processedAt} />
          <InfoItem
            label="Confiança / erro admissível"
            value={`${confidence}% / ${formatNumber(volume.targetErrorPercent, 0)}%`}
          />
          <div className="col-span-3 grid grid-cols-3 gap-x-6 border-t border-[#E8E4DA] pt-3">
            <InfoItem
              label="Equação volumétrica"
              value={`${equation.name} (${model?.label ?? equation.modelType})`}
            />
            <InfoItem label="Modelo" value={model?.formula ?? '—'} />
            <InfoItem
              label="Coeficientes"
              value={
                <span className="flex flex-wrap gap-x-3">
                  {coefficients.map((coefficient) => (
                    <span key={coefficient} className="whitespace-nowrap">
                      {coefficient}
                    </span>
                  ))}
                </span>
              }
            />
          </div>
        </dl>
      </ReportSection>

      <ReportSection number={2} title="Resumo dos resultados" keepTogether>
        <div className="grid grid-cols-4 gap-3">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-xl border border-[#B8D8BE] bg-[#EEF3EE] p-3">
              <p className="text-tiny font-bold uppercase tracking-wider text-[#6D786E]">
                {kpi.label}
              </p>
              <p className="mt-1 font-newsreader text-xl font-semibold text-verde-mata">
                {kpi.value}
              </p>
              <p className="mt-1 text-tiny text-[#6D786E]">{kpi.detail}</p>
            </div>
          ))}
          <div
            className={`rounded-xl border p-3 ${
              volume.meetsErrorThreshold
                ? 'border-[#B8D8BE] bg-[#EEF3EE]'
                : 'border-coral-flor/50 bg-[#FBECE8]'
            }`}
          >
            <p className="text-tiny font-bold uppercase tracking-wider text-[#6D786E]">
              Erro amostral
            </p>
            <p
              className={`mt-1 font-newsreader text-xl font-semibold ${
                volume.meetsErrorThreshold ? 'text-verde-mata' : 'text-[#B85C47]'
              }`}
            >
              {formatNumber(volume.relativeSamplingErrorPercent, 1)}%
            </p>
            <p className="mt-1 text-tiny text-[#6D786E]">
              {volume.meetsErrorThreshold ? 'Dentro' : 'Acima'} do limite de{' '}
              {formatNumber(volume.targetErrorPercent, 0)}%
            </p>
          </div>
        </div>

        <dl className="mt-3 grid grid-cols-5 divide-x divide-[#E8E4DA] rounded-xl border border-[#D7D0C2]">
          {dendrometrics.map((item) => (
            <div key={item.label} className="px-3 py-2 text-center">
              <dt className="text-tiny font-bold uppercase tracking-wider text-[#6D786E]">
                {item.label}
              </dt>
              <dd className="text-sm font-semibold text-verde-mata">{item.value}</dd>
            </div>
          ))}
        </dl>
      </ReportSection>

      <ReportSection number={3} title="Volume por hectare por parcela" keepTogether>
        <ReportBarChart
          ariaLabel="Volume por hectare de cada parcela"
          items={subPlots.map((subPlot) => ({
            label: `Parcela ${subPlot.name}`,
            value: subPlot.volumePerHa,
            valueLabel: `${formatNumber(subPlot.volumePerHa)} m³/ha`,
          }))}
          reference={{
            value: totals.meanVolumePerHaM3,
            label: `Média ${formatNumber(totals.meanVolumePerHaM3)} m³/ha`,
          }}
        />
      </ReportSection>

      <ReportSection number={4} title="Distribuição por classe de DAP" keepTogether>
        <ReportBarChart
          ariaLabel="Número de árvores por classe de DAP"
          items={diameterClasses.map((item) => ({
            label: `${item.classRange} cm`,
            value: item.treeCount,
            valueLabel: `${item.treeCount} árv. · ${formatNumber(item.percentage, 1)}%`,
          }))}
        />
        <table className="mt-3 w-full border-collapse">
          <thead>
            <tr>
              <th className={th}>Classe (cm)</th>
              <th className={thRight}>Árvores</th>
              <th className={thRight}>%</th>
              <th className={thRight}>Volume (m³)</th>
            </tr>
          </thead>
          <tbody>
            {diameterClasses.map((item) => (
              <tr key={item.classRange} className={tr}>
                <td className={td}>{item.classRange}</td>
                <td className={tdRight}>{item.treeCount}</td>
                <td className={tdRight}>{formatNumber(item.percentage, 1)}%</td>
                <td className={tdRight}>{formatNumber(item.totalVolumeM3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ReportSection>

      <ReportSection number={5} title="Qualidade das árvores" keepTogether>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={th}>Qualidade</th>
              <th className={`${th} w-1/3`}>Proporção</th>
              <th className={thRight}>Árvores</th>
              <th className={thRight}>%</th>
              <th className={thRight}>Volume (m³)</th>
            </tr>
          </thead>
          <tbody>
            {qualityDistribution.map((item) => (
              <tr key={item.quality} className={tr}>
                <td className={td}>
                  {QUALIDADE_LABELS[item.quality as TreeQuality] ?? item.quality}
                </td>
                <td className={td}>
                  <svg
                    viewBox="0 0 100 6"
                    preserveAspectRatio="none"
                    className="h-2 w-full"
                    aria-hidden="true"
                  >
                    <rect width="100" height="6" rx="3" className="fill-[#F1EEE6]" />
                    <rect
                      width={Math.min(100, Math.max(0, item.percentage))}
                      height="6"
                      rx="3"
                      className="fill-verde-eucalipto"
                    />
                  </svg>
                </td>
                <td className={tdRight}>{item.treeCount}</td>
                <td className={tdRight}>{formatNumber(item.percentage, 1)}%</td>
                <td className={tdRight}>{formatNumber(item.totalVolumeM3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ReportSection>

      <ReportSection number={6} title="Estatísticas de amostragem" keepTogether>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={th}>Medida</th>
              <th className={thRight}>Volume por hectare (m³/ha)</th>
              <th className={thRight}>Volume por parcela (m³)</th>
            </tr>
          </thead>
          <tbody>
            {statRows.map((row) => (
              <tr key={row.label} className={tr}>
                <td className={td}>{row.label}</td>
                <td className={tdRight}>{row.value(statistics.volumePerHa)}</td>
                <td className={tdRight}>{row.value(statistics.volumePerSubPlot)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ReportSection>

      <ReportSection number={7} title="Resultados por parcela">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={th}>Parcela</th>
              <th className={thRight}>Área (m²)</th>
              <th className={thRight}>Árvores</th>
              <th className={thRight}>Volume (m³)</th>
              <th className={thRight}>Volume/ha</th>
              <th className={thRight}>Área basal/ha</th>
              <th className={thRight}>Árvores/ha</th>
              <th className={thRight}>DAP médio (cm)</th>
              <th className={thRight}>Altura média (m)</th>
            </tr>
          </thead>
          <tbody>
            {subPlots.map((subPlot) => (
              <tr key={subPlot.id ?? subPlot.name} className={tr}>
                <td className={`${td} font-semibold`}>{subPlot.name}</td>
                <td className={tdRight}>{formatNumber(subPlot.areaM2, 0)}</td>
                <td className={tdRight}>
                  {subPlot.validTreeCount ?? subPlot.treeCount} de {subPlot.treeCount}
                </td>
                <td className={tdRight}>{formatNumber(subPlot.totalVolumeM3)}</td>
                <td className={tdRight}>{formatNumber(subPlot.volumePerHa)}</td>
                <td className={tdRight}>{formatNumber(subPlot.basalAreaPerHa)}</td>
                <td className={tdRight}>{formatNumber(subPlot.treesPerHa, 0)}</td>
                <td className={tdRight}>{formatNumber(subPlot.meanDapCm)}</td>
                <td className={tdRight}>
                  {subPlot.meanHeightM != null ? formatNumber(subPlot.meanHeightM) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ReportSection>

      {warnings.length > 0 && (
        <ReportSection number={8} title={`Avisos de validação (${warnings.length})`}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className={th}>Parcela</th>
                <th className={th}>Árvore</th>
                <th className={th}>Aviso</th>
              </tr>
            </thead>
            <tbody>
              {warnings.map((warning) => (
                <tr key={warning.key} className={tr}>
                  <td className={td}>{warning.parcel}</td>
                  <td className={td}>{warning.tree}</td>
                  <td className={td}>{warning.text}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>
      )}

      <footer className="mt-8 border-t border-[#D7D0C2] pt-3 text-tiny text-[#6D786E] break-inside-avoid">
        Documento gerado pela plataforma Glupta · Coleta Florestal. Resultados calculados no
        processamento de {processedAt}.
      </footer>
    </article>
  );
}
