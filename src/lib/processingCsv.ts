import { statRows } from '@/components/processing/ProcessingResultDetails';
import { formatNumber } from '@/components/processing/ProcessingSummaryCard';
import type { InventoryProcessingResult } from '@/types/processing';

type Cell = string | number | boolean | null | undefined;

const SEPARATOR = ';';
const BOM = '﻿';

// Planilhas executam texto que começa com esses caracteres como fórmula; o nome da árvore e os
// avisos vêm de entrada do usuário.
const FORMULA_START = /^[=+\-@]/;

function formatCell(value: Cell): string {
  if (value == null) return '';
  if (typeof value === 'number') {
    return value.toLocaleString('pt-BR', { useGrouping: false, maximumFractionDigits: 6 });
  }
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';

  const text = FORMULA_START.test(value) ? `'${value}` : value;
  return /[;"\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

interface CsvSection {
  title: string;
  header: string[];
  rows: Cell[][];
}

const line = (row: Cell[]) => row.map(formatCell).join(SEPARATOR);

// Um arquivo só, com uma tabela por seção separadas por linha em branco: abre direto no Excel.
function toSectionsCsv(sections: CsvSection[]): string {
  const blocks = sections.map((section) =>
    [line([section.title]), line(section.header), ...section.rows.map(line)].join('\r\n'),
  );
  return BOM + blocks.join('\r\n\r\n');
}

export function hasTrees(result: InventoryProcessingResult): boolean {
  return result.subPlots.some((subPlot) => (subPlot.trees?.length ?? 0) > 0);
}

function parcelsSection(result: InventoryProcessingResult): CsvSection {
  return {
    title: 'Parcelas',
    header: [
      'Parcela',
      'Área (m²)',
      'Árvores',
      'Árvores válidas',
      'Volume (m³)',
      'Volume/ha (m³)',
      'Área basal (m²)',
      'Área basal/ha (m²)',
      'Árvores/ha',
      'DAP médio (cm)',
      'Altura média (m)',
    ],
    rows: result.subPlots.map((subPlot) => [
      subPlot.name,
      subPlot.areaM2,
      subPlot.treeCount,
      subPlot.validTreeCount,
      subPlot.totalVolumeM3,
      subPlot.volumePerHa,
      subPlot.totalBasalAreaM2,
      subPlot.basalAreaPerHa,
      subPlot.treesPerHa,
      subPlot.meanDapCm,
      subPlot.meanHeightM,
    ]),
  };
}

function treesSection(
  result: InventoryProcessingResult,
  qualityLabel: (quality: string) => string,
): CsvSection {
  return {
    title: 'Árvores',
    header: [
      'Parcela',
      'Árvore',
      'DAP (cm)',
      'Altura (m)',
      'Qualidade',
      'Volume (m³)',
      'Área basal (m²)',
      'Válida',
      'Avisos',
    ],
    rows: result.subPlots.flatMap((subPlot) =>
      (subPlot.trees ?? []).map((tree) => [
        subPlot.name,
        tree.name,
        tree.diameterDapCm,
        tree.heightM,
        qualityLabel(tree.quality),
        tree.volumeM3,
        tree.basalAreaM2,
        tree.isValid,
        (tree.warnings ?? []).join('; '),
      ]),
    ),
  };
}

// Daqui para baixo os valores saem formatados como na tela e no PDF, para conferir lado a lado.
function resultSections(
  result: InventoryProcessingResult,
  qualityLabel: (quality: string) => string,
): CsvSection[] {
  const { context, totals, statistics, diameterClasses, qualityDistribution } = result;
  const optional = (value: number | null | undefined, unit: string) =>
    value != null ? `${formatNumber(value)} ${unit}` : '—';

  return [
    {
      title: 'Identificação',
      header: ['Campo', 'Valor'],
      rows: [
        ['Fazenda', context.farmName ?? '—'],
        ['Talhão', context.plotName],
        ['Data do processamento', new Date(context.processedAt).toLocaleString('pt-BR')],
        ['Equação', context.equationUsed.name],
        ['Nível de confiança', `${formatNumber(statistics.volumePerHa.confidenceLevel * 100, 0)}%`],
      ],
    },
    {
      title: 'Resumo dos resultados',
      header: ['Indicador', 'Valor'],
      rows: [
        ['Volume médio', `${formatNumber(totals.meanVolumePerHaM3)} m³/ha`],
        ['Volume total estimado', optional(totals.estimatedTotalVolumeM3, 'm³')],
        ['IC do volume total (inferior)', optional(totals.estimatedTotalVolumeLowerM3, 'm³')],
        ['IC do volume total (superior)', optional(totals.estimatedTotalVolumeUpperM3, 'm³')],
        ['Parcelas amostradas', totals.totalSubPlotsSampled],
        ['Árvores medidas', totals.totalTreesMeasured],
        ['Árvores válidas', totals.totalValidTreesMeasured ?? '—'],
        ['DAP médio', `${formatNumber(totals.meanDapCm)} cm`],
        ['DAP quadrático', `${formatNumber(totals.quadraticMeanDapCm)} cm`],
        ['Altura média', optional(totals.meanHeightM, 'm')],
        ['Área basal', `${formatNumber(totals.meanBasalAreaPerHaM2)} m²/ha`],
        ['Densidade', `${formatNumber(totals.meanTreesPerHa, 0)} árv./ha`],
      ],
    },
    {
      title: 'Estatísticas de amostragem',
      header: ['Estatística', 'Volume por hectare (m³/ha)', 'Volume por parcela (m³)'],
      rows: statRows.map((row) => [
        row.label,
        row.value(statistics.volumePerHa),
        row.value(statistics.volumePerSubPlot),
      ]),
    },
    {
      title: 'Distribuição por classe de DAP',
      header: ['Classe (cm)', 'Árvores', '%', 'Volume (m³)'],
      rows: diameterClasses.map((item) => [
        item.classRange,
        item.treeCount,
        `${formatNumber(item.percentage, 1)}%`,
        formatNumber(item.totalVolumeM3),
      ]),
    },
    {
      title: 'Qualidade das árvores',
      header: ['Qualidade', 'Árvores', '%', 'Volume (m³)'],
      rows: qualityDistribution.map((item) => [
        qualityLabel(item.quality),
        item.treeCount,
        `${formatNumber(item.percentage, 1)}%`,
        formatNumber(item.totalVolumeM3),
      ]),
    },
  ];
}

export function buildProcessingCsv(
  result: InventoryProcessingResult,
  qualityLabel: (quality: string) => string = (quality) => quality,
): string {
  return toSectionsCsv([
    parcelsSection(result),
    ...(hasTrees(result) ? [treesSection(result, qualityLabel)] : []),
    ...resultSections(result, qualityLabel),
  ]);
}

// "Talhão 01 — Norte" -> "talhao-01-norte"
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function csvFileName(result: InventoryProcessingResult) {
  const day = result.context.processedAt.slice(0, 10);
  return `processamento-${slugify(result.context.plotName) || 'talhao'}-${day}.csv`;
}

export function downloadCsv(fileName: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
