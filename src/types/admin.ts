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

export type AuditAction =
  'CREATE' | 'UPDATE' | 'DELETE' | 'COMPLETE' | 'REOPEN' | 'APPROVE' | 'REJECT';

export type AuditEntity =
  'USER' | 'FARM' | 'PLOT' | 'SUBPLOT' | 'TREE' | 'EQUATION' | 'VALIDATION_SETTINGS';

export interface AuditLog {
  id: string;
  action: AuditAction;
  entity: AuditEntity;
  userId: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
}

export interface ValidationSettings {
  minDapCm: number;
  maxDapCm: number;
  minHeightM: number;
  maxHeightM: number;
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

export type AdminUserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface ApproveUserPayload {
  userId: string;
  role: AdminUserRole;
}

export type ProjectUserRoleType = 'SuperAdmin' | 'Admin' | 'User';

export interface ProjectUser {
  id: string;
  name: string;
  roleTitle: string;
  roleType: ProjectUserRoleType;
}

export interface AdminProjectItem {
  id: string;
  title: string;
  description: string;
  users: ProjectUser[];
}

export interface AdminProjectRecord {
  id: string;
  name: string;
  address: string;
  description: string | null;
  owner: { id: string; name: string };
  users: { id: string; name: string; email: string; role: AdminUserRole }[];
}
