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
