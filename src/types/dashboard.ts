import type { TreeQuality } from './farm';

export type ParcelProgressStatus = 'CONCLUIDA' | 'EM_ANDAMENTO' | 'NAO_INICIADA';

export interface DashboardParcel {
  id: string;
  name: string;
  plotName: string;
  areaHa: number | null;
  status: ParcelProgressStatus;
  measuredTrees: number;
  targetTrees: number;
}

export interface FarmDashboard {
  totalParcels: number;
  completedParcels: number;
  measuredTrees: number;
  targetTrees: number;
  meanDapCm: number | null;
  meanHeightM: number | null;
  hasMultiplePlots: boolean;
  parcels: DashboardParcel[];
}

// Resposta de GET /dashboard/:farmId (só os campos que a tela usa).
export interface FarmDashboardSummary {
  summary: {
    totalPlots: number;
    processedPlots: number;
    plotsWithEstimatedVolume: number;
    totalEstimatedVolumeM3: number;
    isVolumeTotalPartial: boolean;
  };
  qualityDistribution: { quality: TreeQuality; total: number }[];
}
