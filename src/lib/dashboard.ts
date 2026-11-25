import { summarizeSubPlots } from '@/app/api/api';
import type { DashboardParcel, FarmDashboard, ParcelProgressStatus } from '@/types/dashboard.ts';
import type { PrismaFarmRecord, PrismaSubPlotRecord } from '@/types/farm';

const SQUARE_METERS_PER_HECTARE = 10_000;

export const PARCEL_STATUS_LABELS: Record<ParcelProgressStatus, string> = {
  CONCLUIDA: 'CONCLUÍDA',
  EM_ANDAMENTO: 'EM ANDAMENTO',
  NAO_INICIADA: 'NÃO INICIADA',
};

export function getParcelProgressStatus(subPlot: PrismaSubPlotRecord): ParcelProgressStatus {
  if (subPlot.status === 'COMPLETED') return 'CONCLUIDA';
  return (subPlot.trees?.length ?? 0) > 0 ? 'EM_ANDAMENTO' : 'NAO_INICIADA';
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((acc, value) => acc + value, 0) / values.length;
}

const compareByName = (a: string, b: string) => a.localeCompare(b, 'pt-BR', { numeric: true });

function sortParcels(parcels: DashboardParcel[]): DashboardParcel[] {
  return [...parcels].sort(
    (a, b) => compareByName(a.plotName, b.plotName) || compareByName(a.name, b.name),
  );
}

export function buildFarmDashboard(farm: PrismaFarmRecord): FarmDashboard {
  const plots = farm.plots ?? [];

  const parcels = plots.flatMap((plot) =>
    (plot.subPlots ?? []).map((subPlot): DashboardParcel => ({
      id: subPlot.id,
      name: subPlot.name,
      plotName: plot.name,
      areaHa: subPlot.areaM2 != null ? subPlot.areaM2 / SQUARE_METERS_PER_HECTARE : null,
      status: getParcelProgressStatus(subPlot),
      measuredTrees: subPlot.trees?.length ?? 0,
      targetTrees: subPlot.targetTrees,
    })),
  );

  const subPlots = plots.flatMap((plot) => plot.subPlots ?? []);
  const trees = subPlots.flatMap((subPlot) => subPlot.trees ?? []);
  const summary = summarizeSubPlots(subPlots);

  return {
    totalParcels: summary.totalParcels,
    completedParcels: summary.completedParcels,
    measuredTrees: summary.measuredTrees,
    targetTrees: subPlots.reduce((acc, subPlot) => acc + subPlot.targetTrees, 0),
    meanDapCm: average(trees.map((tree) => tree.diameterDapCm)),
    meanHeightM: average(
      trees.flatMap((tree) => (tree.height != null && tree.height > 0 ? [tree.height] : [])),
    ),
    hasMultiplePlots: plots.length > 1,
    parcels: sortParcels(parcels),
  };
}

export function formatDecimal(value: number | null, unit: string): string {
  if (value == null) return '—';

  const formatted = value.toLocaleString('pt-BR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  return `${formatted} ${unit}`;
}

export function formatHectares(value: number | null): string {
  if (value == null) return '—';

  return `${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ha`;
}

export function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-BR');
}
