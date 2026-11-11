'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { approveUser, rejectUser } from '@/app/api/api';
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
  AdminUsersSummary,
} from '@/types/admin';
import { ADMIN_TAB_PATHS, ADMIN_TABS } from '@/lib/adminTabs';
import { AdminUserRole } from '@/types/admin';

interface AdminOverviewSectionProps {
  auditEntries: AdminAuditEntry[];
  usersSummary: AdminUsersSummary;
  plotsSummary: AdminPlotsSummary;
  pendingRequest: AdminPendingUserRequest | null;
  recentPlots: AdminRecentPlotItem[];
  onChanged: () => Promise<void>;
}

export default function AdminOverviewSection({
  auditEntries,
  usersSummary,
  plotsSummary,
  pendingRequest,
  recentPlots,
  onChanged,
}: AdminOverviewSectionProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<AdminTabKey>('overview');
  const [actionError, setActionError] = useState<string | null>(null);

  const runUserAction = async (action: () => Promise<unknown>) => {
    setActionError(null);

    try {
      await action();
      await onChanged();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Não foi possível concluir a ação');
    }
  };

  const handleApproveUser = (userId: string, role: AdminUserRole) =>
    runUserAction(() => approveUser(userId, role));

  const handleRejectUser = (userId: string) => runUserAction(() => rejectUser(userId));

  const handleSelectTab = (tabKey: AdminTabKey) => {
    const path = ADMIN_TAB_PATHS[tabKey];
    if (path === ADMIN_TAB_PATHS.overview) {
      setActiveTab(tabKey);
      return;
    }
    router.push(path);
  };

  const handleNavigateToFarms = () => {
    router.push('/platform/fazendas');
  };

  return (
    <div className="flex flex-col gap-6">
      <AdminTabsBar tabs={ADMIN_TABS} activeTab={activeTab} onSelectTab={handleSelectTab} />

      <div>
        <h2 className="text-xl font-bold text-verde-mata">Visão geral</h2>
        <p className="mt-0.5 text-xs text-[#6E776B]">
          Acompanhe os dados principais da turma e acesse rapidamente cada área.
        </p>
      </div>

      {actionError && (
        <p role="alert" className="text-sm text-coral-flor">
          {actionError}
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <AdminAuditCard entries={auditEntries} />

        <AdminUsersSummaryCard summary={usersSummary} onManageUsers={() => setActiveTab('users')} />

        <AdminPlotsSummaryCard summary={plotsSummary} onViewPlots={handleNavigateToFarms} />
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
            items={recentPlots}
            updatedAgoText="Atualizado agora"
            onViewAll={handleNavigateToFarms}
          />
        </div>
      </div>
    </div>
  );
}
