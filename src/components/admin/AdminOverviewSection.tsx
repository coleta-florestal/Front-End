'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminAuditCard from '@/components/admin/AdminAuditCard';
import AdminPendingRequestCard from '@/components/admin/AdminPendingRequestCard';
import AdminPlotsSummaryCard from '@/components/admin/AdminPlotsSummaryCard';
import AdminRecentPlotsCard from '@/components/admin/AdminRecentPlotsCard';
import AdminTabsBar from '@/components/admin/AdminTabBar';
import AdminUsersSummaryCard from '@/components/admin/AdminUsersSummaryCard';
import {
  AdminAuditEntry,
  AdminPendingUserRequest,
  AdminPlotsSummary,
  AdminRecentPlotItem,
  AdminTabKey,
  AdminTabOption,
  AdminUsersSummary,
} from '@/types/admin';
import { AdminUserRole } from '@/types/admin';

interface AdminOverviewSectionProps {
  initialAuditEntries: AdminAuditEntry[];
  initialUsersSummary: AdminUsersSummary;
  initialPlotsSummary: AdminPlotsSummary;
  initialPendingRequest: AdminPendingUserRequest | null;
  initialRecentPlots: AdminRecentPlotItem[];
}

const ADMIN_TABS: AdminTabOption[] = [
  { key: 'overview', label: 'Visão Geral' },
  { key: 'users', label: 'Usuários' },
  { key: 'projects', label: 'Projetos' },
  { key: 'equations', label: 'Equações' },
  { key: 'validations', label: 'Validações' },
  { key: 'audit', label: 'Auditoria' },
];

export default function AdminOverviewSection({
  initialAuditEntries,
  initialUsersSummary,
  initialPlotsSummary,
  initialPendingRequest,
  initialRecentPlots,
}: AdminOverviewSectionProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AdminTabKey>('overview');
  const [usersSummary, setUsersSummary] = useState<AdminUsersSummary>(initialUsersSummary);
  const [pendingRequest, setPendingRequest] = useState<AdminPendingUserRequest | null>(
    initialPendingRequest,
  );

  const handleApproveUser = (userId: string, role: AdminUserRole) => {
    void userId;
    void role;
    setPendingRequest(null);
    setUsersSummary((prev) => ({
      totalApprovedUsers: prev.totalApprovedUsers + 1,
      pendingRequestsCount: Math.max(0, prev.pendingRequestsCount - 1),
    }));
  };

  const handleRejectUser = (userId: string) => {
    void userId;
    setPendingRequest(null);
    setUsersSummary((prev) => ({
      ...prev,
      pendingRequestsCount: Math.max(0, prev.pendingRequestsCount - 1),
    }));
  };

  const handleNavigateToFarms = () => {
    router.push('/platform');
  };

  return (
    <div className="flex flex-col gap-6">
      <AdminTabsBar tabs={ADMIN_TABS} activeTab={activeTab} onSelectTab={setActiveTab} />

      <div>
        <h2 className="text-xl font-bold text-[#2C5F2D]">Visão geral</h2>
        <p className="mt-0.5 text-xs text-[#6E776B]">
          Acompanhe os dados principais da turma e acesse rapidamente cada área.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <AdminAuditCard entries={initialAuditEntries} />

        <AdminUsersSummaryCard summary={usersSummary} onManageUsers={() => setActiveTab('users')} />

        <AdminPlotsSummaryCard summary={initialPlotsSummary} onViewPlots={handleNavigateToFarms} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <AdminPendingRequestCard
            pendingRequest={pendingRequest}
            onApprove={handleApproveUser}
            onReject={handleRejectUser}
            onInviteUser={() => setActiveTab('users')}
            onNewSample={handleNavigateToFarms}
          />
        </div>

        <div className="lg:col-span-6">
          <AdminRecentPlotsCard
            items={initialRecentPlots}
            updatedAgoText="Atualizado há 4 minutos"
            onViewAll={handleNavigateToFarms}
          />
        </div>
      </div>
    </div>
  );
}
