import type { TreeData } from '@/components/trees/TreeForm';
import { clearAuthCookies, getAccessToken } from '@/lib/auth';
import { ValidationSettings } from '@/types/admin';
import type { FarmDashboardSummary } from '@/types/dashboard';
import { EquationType, VolumetricEquation } from '@/types/equation';
import { InventoryProcessingResult, ProcessInventoryDto } from '@/types/processing';
import {
  Farm,
  FarmStatus,
  PrismaFarmRecord,
  PrismaPlotRecord,
  PrismaSubPlotRecord,
  PrismaTreeRecord,
  SubPlotStatus,
  TreeQuality,
  UserRole,
} from '@/types/farm';

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://back-end-cp74.onrender.com').replace(
  /\/$/,
  '',
);

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  accountStatus: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface FarmOwner {
  id: string;
  name: string;
  role: UserRole;
}

export interface CreateUserDto {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
}

export interface CreateFarmDto {
  name: string;
  address: string;
  ownerId: string;
  description?: string;
}

export interface CreatePlotDto {
  name: string;
  areaHA: number;
  description?: string;
}

export interface CreateSubPlotDto {
  name: string;
  areaM2: number;
  targetTrees: number;
}

export interface UpdateSubPlotStatusResult {
  subPlot: PrismaSubPlotRecord;
  missingTrees: number;
  warning: string | null;
}

export interface CreateTreeDto {
  name: string;
  diameterDapCm: number;
  height: number;
  quality?: TreeQuality;
  observations?: string;
}

export interface CreateEquationDto {
  name: string;
  modelType: EquationType;
  beta0: number;
  beta1: number;
  beta2?: number;
  r2?: number;
  syx?: number;
}

function toAuthToken(response: { access_token: string }): AuthToken {
  return { accessToken: response.access_token };
}

export async function createUser(dto: CreateUserDto): Promise<AuthToken> {
  const response = await apiFetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(dto),
  });

  return toAuthToken(response);
}

export async function login(dto: LoginDto): Promise<AuthToken> {
  const response = await apiFetch('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(dto),
  });

  return toAuthToken(response);
}

export async function apiFetch(
  path: string,
  options: RequestInit & { accessToken?: string; _retried?: boolean } = {},
  refreshToken?: () => Promise<boolean>,
) {
  const { accessToken, _retried, ...restOptions } = options;

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${BASE_URL}${cleanPath}`;

  let response: Response;

  try {
    response = await fetch(fullUrl, {
      ...restOptions,
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(restOptions.headers ?? {}),
      },
    });
  } catch {
    throw new Error('Não foi possível conectar à API.');
  }

  if (response.status === 401 && refreshToken && !_retried) {
    const refreshed = await refreshToken();
    if (refreshed) return apiFetch(path, { ...options, _retried: true }, refreshToken);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error([].concat(body.message || response.statusText).join(', '));
  }

  // Os DELETE do back respondem 200 sem corpo, e response.json() falharia mesmo com sucesso.
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// O back não tem refresh token e o JWT dura 15 min: ao expirar, o único caminho é um novo login.
async function expireSession() {
  clearAuthCookies();
  // Fora de componente não há useRouter; o reload também descarta o estado da sessão expirada.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = '/';
  return false;
}

function authFetch(path: string, options: RequestInit = {}) {
  return apiFetch(path, { ...options, accessToken: getAccessToken() ?? undefined }, expireSession);
}

function jsonBody(method: 'POST' | 'PATCH' | 'PUT', body: unknown): RequestInit {
  return { method, body: JSON.stringify(body) };
}

// Os ids vêm da URL: sem codificar, um link forjado poderia apontar para outra rota da API.
const farmPath = (farmId: string) => `/farms/${encodeURIComponent(farmId)}`;
const plotsPath = (farmId: string) => `${farmPath(farmId)}/plots`;
const subPlotsPath = (farmId: string, plotId: string) =>
  `${plotsPath(farmId)}/${encodeURIComponent(plotId)}/subplots`;
const treesPath = (farmId: string, plotId: string, subPlotId: string) =>
  `${subPlotsPath(farmId, plotId)}/${encodeURIComponent(subPlotId)}/trees`;
const adminUserPath = (id: string) => `/admin/users/${encodeURIComponent(id)}`;
const equationPath = (id: string) => `/admin/equations/${encodeURIComponent(id)}`;

// O back não tem GET por id de fazenda, talhão ou parcela: a busca é feita na lista.
function findById<T extends { id: string }>(items: T[], id: string, notFoundMessage: string): T {
  const item = items.find((candidate) => candidate.id === id);
  if (!item) throw new Error(notFoundMessage);
  return item;
}

export function getFarms(): Promise<PrismaFarmRecord[]> {
  return authFetch('/farms');
}

export async function getFarm(farmId: string): Promise<PrismaFarmRecord> {
  return findById(await getFarms(), farmId, 'Fazenda não encontrada.');
}

export function getAdminOwners(): Promise<FarmOwner[]> {
  return authFetch('/farms/admin_owners');
}

export function createFarm(dto: CreateFarmDto): Promise<PrismaFarmRecord> {
  return authFetch('/farms', jsonBody('POST', dto));
}

export function updateFarm(farmId: string, dto: Partial<CreateFarmDto>): Promise<PrismaFarmRecord> {
  return authFetch(farmPath(farmId), jsonBody('PATCH', dto));
}

export function deleteFarm(farmId: string): Promise<null> {
  return authFetch(farmPath(farmId), { method: 'DELETE' });
}

export function getPlots(farmId: string): Promise<PrismaPlotRecord[]> {
  return authFetch(plotsPath(farmId));
}

export async function getPlot(farmId: string, plotId: string): Promise<PrismaPlotRecord> {
  return findById(await getPlots(farmId), plotId, 'Talhão não encontrado.');
}

export function createPlot(farmId: string, dto: CreatePlotDto): Promise<PrismaPlotRecord> {
  return authFetch(plotsPath(farmId), jsonBody('POST', dto));
}

export function deletePlot(farmId: string, plotId: string): Promise<null> {
  return authFetch(`${plotsPath(farmId)}/${encodeURIComponent(plotId)}`, { method: 'DELETE' });
}

export function updatePlot(
  farmId: string,
  plotId: string,
  dto: Partial<CreatePlotDto>,
): Promise<PrismaPlotRecord> {
  return authFetch(`${plotsPath(farmId)}/${encodeURIComponent(plotId)}`, jsonBody('PATCH', dto));
}

export function getSubPlots(farmId: string, plotId: string): Promise<PrismaSubPlotRecord[]> {
  return authFetch(subPlotsPath(farmId, plotId));
}

export async function getSubPlot(
  farmId: string,
  plotId: string,
  subPlotId: string,
): Promise<PrismaSubPlotRecord> {
  return findById(await getSubPlots(farmId, plotId), subPlotId, 'Parcela não encontrada.');
}

export function createSubPlot(
  farmId: string,
  plotId: string,
  dto: CreateSubPlotDto,
): Promise<PrismaSubPlotRecord> {
  return authFetch(subPlotsPath(farmId, plotId), jsonBody('POST', dto));
}

export function updateSubPlotStatus(
  farmId: string,
  plotId: string,
  subPlotId: string,
  status: SubPlotStatus,
): Promise<UpdateSubPlotStatusResult> {
  return authFetch(
    `${subPlotsPath(farmId, plotId)}/${encodeURIComponent(subPlotId)}/status`,
    jsonBody('PATCH', { status }),
  );
}

export function deleteSubPlot(farmId: string, plotId: string, subPlotId: string): Promise<null> {
  return authFetch(`${subPlotsPath(farmId, plotId)}/${encodeURIComponent(subPlotId)}`, {
    method: 'DELETE',
  });
}

export function getTrees(
  farmId: string,
  plotId: string,
  subPlotId: string,
): Promise<PrismaTreeRecord[]> {
  return authFetch(treesPath(farmId, plotId, subPlotId));
}

export function createTree(
  farmId: string,
  plotId: string,
  subPlotId: string,
  dto: CreateTreeDto,
): Promise<PrismaTreeRecord> {
  return authFetch(treesPath(farmId, plotId, subPlotId), jsonBody('POST', dto));
}

export function updateTree(
  farmId: string,
  plotId: string,
  subPlotId: string,
  treeId: string,
  dto: Partial<CreateTreeDto>,
): Promise<PrismaTreeRecord> {
  return authFetch(
    `${treesPath(farmId, plotId, subPlotId)}/${encodeURIComponent(treeId)}`,
    jsonBody('PATCH', dto),
  );
}

export function deleteTree(
  farmId: string,
  plotId: string,
  subPlotId: string,
  treeId: string,
): Promise<null> {
  return authFetch(`${treesPath(farmId, plotId, subPlotId)}/${encodeURIComponent(treeId)}`, {
    method: 'DELETE',
  });
}

// ponytail: N+1 em cada nível, porque o back não devolve contagens. Trocar por _count no back
// quando as telas ficarem lentas.
export async function getSubPlotsWithTrees(
  farmId: string,
  plotId: string,
): Promise<PrismaSubPlotRecord[]> {
  const subPlots = await getSubPlots(farmId, plotId);

  return Promise.all(
    subPlots.map(async (subPlot) => ({
      ...subPlot,
      trees: await getTrees(farmId, plotId, subPlot.id),
    })),
  );
}

export async function getPlotsWithDetails(farmId: string): Promise<PrismaPlotRecord[]> {
  const plots = await getPlots(farmId);

  return Promise.all(
    plots.map(async (plot) => ({
      ...plot,
      subPlots: await getSubPlotsWithTrees(farmId, plot.id),
    })),
  );
}

export async function getFarmWithDetails(farmId: string): Promise<PrismaFarmRecord> {
  const [farm, plots] = await Promise.all([getFarm(farmId), getPlotsWithDetails(farmId)]);
  return { ...farm, plots };
}

export async function getFarmsWithDetails(): Promise<PrismaFarmRecord[]> {
  const farms = await getFarms();

  return Promise.all(
    farms.map(async (farm) => ({ ...farm, plots: await getPlotsWithDetails(farm.id) })),
  );
}

export function getApprovedUsers(): Promise<User[]> {
  return authFetch('/admin/users');
}

export function getPendingUsers(): Promise<User[]> {
  return authFetch('/admin/users/pending');
}

export function findUser(identifier: string): Promise<User> {
  return authFetch(adminUserPath(identifier));
}

export function updateUserRole(id: string, role: UserRole): Promise<User> {
  return authFetch(`${adminUserPath(id)}/role`, jsonBody('PATCH', { role }));
}

export function approveUser(id: string, role: UserRole): Promise<User> {
  return authFetch(`${adminUserPath(id)}/approve`, jsonBody('PATCH', { role }));
}

export function rejectUser(id: string): Promise<{ message: string }> {
  return authFetch(`${adminUserPath(id)}/reject`, { method: 'PATCH' });
}

export function activateUser(id: string): Promise<User> {
  return authFetch(`${adminUserPath(id)}/activate`, { method: 'PATCH' });
}

export function deactivateUser(id: string): Promise<User> {
  return authFetch(`${adminUserPath(id)}/deactivate`, { method: 'PATCH' });
}

export function deleteUser(id: string): Promise<null> {
  return authFetch(adminUserPath(id), { method: 'DELETE' });
}

export function getEquations(): Promise<VolumetricEquation[]> {
  return authFetch('/admin/equations');
}

export function getEquation(id: string): Promise<VolumetricEquation> {
  return authFetch(equationPath(id));
}

export function createEquation(dto: CreateEquationDto): Promise<VolumetricEquation> {
  return authFetch('/admin/equations', jsonBody('POST', dto));
}

export function updateEquation(
  id: string,
  dto: Partial<CreateEquationDto>,
): Promise<VolumetricEquation> {
  return authFetch(equationPath(id), jsonBody('PATCH', dto));
}

export function updateEquationStatus(id: string, isActive: boolean): Promise<VolumetricEquation> {
  return authFetch(`${equationPath(id)}/status`, jsonBody('PATCH', { isActive }));
}

export function deleteEquation(id: string): Promise<VolumetricEquation> {
  return authFetch(equationPath(id), { method: 'DELETE' });
}

export function getValidationSettings(): Promise<ValidationSettings> {
  return authFetch('/admin/validations');
}

export function updateValidationSettings(dto: ValidationSettings): Promise<ValidationSettings> {
  return authFetch('/admin/validations', jsonBody('PUT', dto));
}

export function getFarmDashboardSummary(farmId: string): Promise<FarmDashboardSummary> {
  return authFetch(`/dashboard/${encodeURIComponent(farmId)}`);
}

export function processPlot(
  farmId: string,
  plotId: string,
  dto: ProcessInventoryDto,
): Promise<InventoryProcessingResult> {
  return authFetch(
    `/processing/farms/${encodeURIComponent(farmId)}/plots/${encodeURIComponent(plotId)}`,
    jsonBody('POST', dto),
  );
}

export const FARM_STATUS_LABELS: Record<FarmStatus, string> = {
  EM_ANDAMENTO: 'EM ANDAMENTO',
  CONCLUIDA: 'CONCLUÍDA',
  SEM_MEDICAO: 'SEM MEDIÇÃO',
};

// O status de talhão no back nunca muda depois de criado, então fazenda e talhão usam o das parcelas.
export function summarizeSubPlots(subPlots: PrismaSubPlotRecord[]) {
  const totalParcels = subPlots.length;
  const completedParcels = subPlots.filter((subPlot) => subPlot.status === 'COMPLETED').length;
  const measuredTrees = subPlots.reduce((acc, subPlot) => acc + (subPlot.trees?.length ?? 0), 0);

  let status: FarmStatus = 'SEM_MEDICAO';

  if (totalParcels > 0 && completedParcels === totalParcels) {
    status = 'CONCLUIDA';
  } else if (completedParcels > 0 || measuredTrees > 0) {
    status = 'EM_ANDAMENTO';
  }

  const progress = totalParcels > 0 ? Math.round((completedParcels / totalParcels) * 100) : 0;

  return { totalParcels, completedParcels, measuredTrees, status, progress };
}

export function getSubPlotStatusLabel(subPlot: PrismaSubPlotRecord): string {
  if (subPlot.status === 'COMPLETED') return 'CONCLUÍDA';
  return (subPlot.trees?.length ?? 0) > 0 ? 'EM ANDAMENTO' : 'NÃO INICIADA';
}

export function formatArea(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 1 });
}

export function toFarm(record: PrismaFarmRecord): Farm {
  const plots = record.plots ?? [];
  const summary = summarizeSubPlots(plots.flatMap((plot) => plot.subPlots ?? []));

  return {
    farmId: record.id,
    name: record.name,
    address: record.address ?? '',
    location: record.address ?? 'Local não informado',
    description: record.description ?? '',
    ownerId: record.ownerId,
    responsible: record.owner?.name ?? 'Responsável técnico',
    createdAt: record.createdAt,
    status: summary.status,
    totalPlots: plots.length,
    areaHa: plots.reduce((acc, plot) => acc + plot.areaHa, 0),
    completedParcels: summary.completedParcels,
    totalParcels: summary.totalParcels,
    measuredTrees: summary.measuredTrees,
  };
}

export function toTreeData(record: PrismaTreeRecord): TreeData {
  return {
    id: record.id,
    numero: record.name,
    dap: String(record.diameterDapCm),
    altura: String(record.height ?? 0),
    observacoes: record.observations ?? '',
    qualidade: record.quality,
  };
}

export function toTreeDto(tree: Omit<TreeData, 'id'>): CreateTreeDto {
  return {
    name: tree.numero.trim(),
    diameterDapCm: parseFloat(tree.dap.replace(',', '.')),
    height: parseFloat(tree.altura.replace(',', '.')),
    quality: tree.qualidade as TreeQuality,
    observations: tree.observacoes,
  };
}
