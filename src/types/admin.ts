export type AdminTabKey = 'overview' | 'users' | 'projects' | 'equations' | 'validations' | 'audit';

export interface AdminTabOption {
  key: AdminTabKey;
  label: string;
}

export interface AdminAuditEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actionText: string;
  targetText: string;
}

export interface AdminUsersSummary {
  totalApprovedUsers: number;
  pendingRequestsCount: number;
}

export interface AdminPlotsSummary {
  totalRegisteredParcels: number;
  processedCount: number;
  pendingCount: number;
}

export interface AdminPendingUserRequest {
  id: string;
  name: string;
  email: string;
  initials: string;
}

export type RecentPlotStatus = 'PROCESSADA' | 'PENDENTE';

export interface AdminRecentPlotItem {
  id: string;
  code: string;
  locationLabel: string;
  responsible: string;
  status: RecentPlotStatus;
}

// Tipo de papel definido localmente para evitar importação externa da branch dev
export type AdminUserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface ApproveUserPayload {
  userId: string;
  role: AdminUserRole;
}
