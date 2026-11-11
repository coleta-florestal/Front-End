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

function toCsv(header: string[], rows: Cell[][]): string {
  const lines = [header, ...rows].map((row) => row.map(formatCell).join(SEPARATOR));
  return BOM + lines.join('\r\n');
}

export function hasTrees(result: InventoryProcessingResult): boolean {
  return result.subPlots.some((subPlot) => (subPlot.trees?.length ?? 0) > 0);
}

export function buildParcelsCsv(result: InventoryProcessingResult): string {
  return toCsv(
    [
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
    result.subPlots.map((subPlot) => [
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
  );
}

export function buildTreesCsv(
  result: InventoryProcessingResult,
  qualityLabel: (quality: string) => string = (quality) => quality,
): string {
  return toCsv(
    [
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
    result.subPlots.flatMap((subPlot) =>
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
  );
}

// "Talhão 01 — Norte" -> "talhao-01-norte"
function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function csvFileName(result: InventoryProcessingResult, kind: 'parcelas' | 'arvores') {
  const day = result.context.processedAt.slice(0, 10);
  return `processamento-${slugify(result.context.plotName) || 'talhao'}-${day}-${kind}.csv`;
}

export function downloadCsv(fileName: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
