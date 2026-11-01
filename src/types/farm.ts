export type UserRole = 'USER' | 'ADMIN' | 'SUPERADMIN';

export type FarmStatus = 'EM_ANDAMENTO' | 'CONCLUIDA' | 'SEM_MEDICAO';

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
