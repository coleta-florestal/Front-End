export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export type FarmStatus = 'EM_ANDAMENTO' | 'CONCLUIDA' | 'SEM_MEDICAO';

export type PlotStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'FINISHED';

export type SubPlotStatus = 'OPEN' | 'COMPLETED';

export type TreeQuality =
  'NORMAL' | 'BIFURCADA' | 'DOMINADA' | 'MORTA' | 'QUEBRADA' | 'PRAGA_DOENCA';

export interface PrismaTreeRecord {
  id: string;
  name: string;
  diameterDapCm: number;
  height?: number | null;
  quality: TreeQuality;
  observations?: string | null;
}

export interface PrismaSubPlotRecord {
  id: string;
  name: string;
  areaM2?: number | null;
  targetTrees: number;
  status: SubPlotStatus;
  createdAt: string;
  trees?: PrismaTreeRecord[];
}

export interface PrismaPlotRecord {
  id: string;
  name: string;
  areaHa: number;
  status: PlotStatus;
  description?: string | null;
  createdAt: string;
  subPlots?: PrismaSubPlotRecord[];
}

export interface PrismaFarmRecord {
  id: string;
  name: string;
  address?: string | null;
  description?: string | null;
  ownerId: string;
  owner?: { name: string };
  createdAt: string;
  plots?: PrismaPlotRecord[];
}

export interface Farm {
  farmId: string;
  name: string;
  address: string;
  location: string;
  description: string;
  ownerId: string;
  responsible: string;
  createdAt: string;
  status: FarmStatus;
  totalPlots: number;
  areaHa: number;
  completedParcels: number;
  totalParcels: number;
  measuredTrees: number;
}

export interface SubPlotVolumeItem {
  id: string;
  plotName: string;
  subPlotName: string;
  volumeM3: number;
}

export interface PlotVolumeItem {
  id: string;
  plotName: string;
  volumeM3: number;
}

export interface DiametricClassItem {
  id: string;
  rangeLabel: string;
  treeCount: number;
  volumeM3: number;
}
