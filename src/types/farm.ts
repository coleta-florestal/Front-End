export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export type FarmStatus = 'EM_ANDAMENTO' | 'CONCLUIDA' | 'SEM_MEDICAO';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  exp?: number;
}

export interface PrismaTreeRecord {
  id: string;
  number?: number | null;
  diameterDapCm: number;
  height?: number | null;
  condition?: string | null;
}

export interface PrismaSubPlotRecord {
  id: string;
  number: number;
  areaM2?: number | null;
  trees?: PrismaTreeRecord[];
}

export interface PrismaPlotRecord {
  id: string;
  name: string;
  areaHa?: number | null;
  subPlots?: PrismaSubPlotRecord[];
}

export interface PrismaFarmRecord {
  id: string;
  name: string;
  address?: string | null;
  responsible?: string | null;
  status?: FarmStatus;
  plots?: PrismaPlotRecord[];
  totalPlots?: number;
  areaHa?: number;
  completedParcels?: number;
  totalParcels?: number;
  measuredTrees?: number;
  unsyncedParcelsCount?: number;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  responsible: string;
  status: FarmStatus;
  totalPlots: number;
  areaHa: number;
  completedParcels: number;
  totalParcels: number;
  measuredTrees: number;
  unsyncedParcelsCount: number;
}

export interface SubPlotVolumeItem {
  id: string;
  plotName: string;
  subPlotNumber: number;
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
