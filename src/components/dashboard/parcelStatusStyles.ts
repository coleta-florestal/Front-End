import type { FarmStatus } from '@/types/farm';
import type { ParcelProgressStatus } from '@/types/dashboard.ts';

export type StatusTone = 'success' | 'warning' | 'neutral';

export const PARCEL_STATUS_TONES: Record<ParcelProgressStatus, StatusTone> = {
  CONCLUIDA: 'success',
  EM_ANDAMENTO: 'warning',
  NAO_INICIADA: 'neutral',
};

export const FARM_STATUS_TONES: Record<FarmStatus, StatusTone> = {
  CONCLUIDA: 'success',
  EM_ANDAMENTO: 'warning',
  SEM_MEDICAO: 'neutral',
};

export const PARCEL_STATUS_BAR_COLORS: Record<ParcelProgressStatus, string> = {
  CONCLUIDA: 'bg-verde-mata',
  EM_ANDAMENTO: 'bg-coral-flor',
  NAO_INICIADA: 'bg-[#C5D6CE]',
};
