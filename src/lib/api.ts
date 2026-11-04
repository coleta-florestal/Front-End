import { Farm, FarmStatus, JwtPayload, PrismaFarmRecord } from '@/types/farm';

const RAW_API_URL =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';

const API_URL = RAW_API_URL.replace(/\/+$/, '');
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? '';

export async function apiGet<T>(path: string, token?: string, tags: string[] = []): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (API_KEY) {
    headers['x-api-key'] = API_KEY;
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const response = await fetch(`${API_URL}${normalizedPath}`, {
    headers,
    next: { revalidate: 60, tags },
  });

  if (!response.ok) {
    throw new Error(`API ${normalizedPath} respondeu ${response.status}`);
  }

  return (await response.json()) as T;
}

export function decodeJwtPayload(token?: string): JwtPayload | null {
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

export function toFarm(record: PrismaFarmRecord): Farm {
  const plots = record.plots ?? [];

  const calculatedPlotsCount =
    typeof record.totalPlots === 'number' ? record.totalPlots : plots.length;

  const calculatedAreaHa =
    typeof record.areaHa === 'number'
      ? record.areaHa
      : plots.reduce((acc, plot) => acc + (plot.areaHa ?? 0), 0);

  const allSubPlots = plots.flatMap((plot) => plot.subPlots ?? []);

  const calculatedTotalParcels =
    typeof record.totalParcels === 'number' ? record.totalParcels : allSubPlots.length;

  const calculatedCompletedParcels =
    typeof record.completedParcels === 'number'
      ? record.completedParcels
      : allSubPlots.filter((subPlot) => (subPlot.trees?.length ?? 0) > 0).length;

  const calculatedMeasuredTrees =
    typeof record.measuredTrees === 'number'
      ? record.measuredTrees
      : allSubPlots.reduce((acc, subPlot) => acc + (subPlot.trees?.length ?? 0), 0);

  let derivedStatus: FarmStatus = record.status ?? 'SEM_MEDICAO';

  if (!record.status) {
    if (calculatedTotalParcels > 0 && calculatedCompletedParcels === calculatedTotalParcels) {
      derivedStatus = 'CONCLUIDA';
    } else if (calculatedCompletedParcels > 0 || calculatedMeasuredTrees > 0) {
      derivedStatus = 'EM_ANDAMENTO';
    }
  }

  return {
    id: record.id,
    name: record.name,
    location: record.address ?? 'Local não informado',
    responsible: record.responsible ?? 'Responsável técnico',
    status: derivedStatus,
    totalPlots: calculatedPlotsCount,
    areaHa: calculatedAreaHa,
    completedParcels: calculatedCompletedParcels,
    totalParcels: calculatedTotalParcels,
    measuredTrees: calculatedMeasuredTrees,
    unsyncedParcelsCount: record.unsyncedParcelsCount ?? 0,
  };
}
