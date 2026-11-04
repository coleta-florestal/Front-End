'use client';

import { useRouter } from 'next/navigation';
import Topbar from '@/components/ui/Topbar';
import AdminOverviewSection from '@/components/admin/AdminOverviewSection';
import {
  AdminAuditEntry,
  AdminPendingUserRequest,
  AdminPlotsSummary,
  AdminRecentPlotItem,
  AdminUsersSummary,
} from '@/types/admin';

const MOCK_AUDIT_ENTRIES: AdminAuditEntry[] = [
  {
    id: 'audit-1',
    timestamp: '12/08 09:41',
    actorName: 'Eng. Amanda',
    actionText: 'concluiu',
    targetText: 'Parcela 01 · Fazenda Santa Clara',
  },
  {
    id: 'audit-2',
    timestamp: '12/08 09:28',
    actorName: 'Eng. Amanda',
    actionText: 'registrou',
    targetText: 'Árvore 02 · Parcela 02',
  },
];

const MOCK_USERS_SUMMARY: AdminUsersSummary = {
  totalApprovedUsers: 24,
  pendingRequestsCount: 1,
};

const MOCK_PLOTS_SUMMARY: AdminPlotsSummary = {
  totalRegisteredParcels: 128,
  processedCount: 96,
  pendingCount: 32,
};

const MOCK_PENDING_REQUEST: AdminPendingUserRequest = {
  id: 'pending-user-1',
  name: 'Carla Menezes',
  email: 'carla@fazendaboavista.com',
  initials: 'CM',
};

const MOCK_RECENT_PLOTS: AdminRecentPlotItem[] = [
  {
    id: 'plot-recent-1',
    code: 'AM-0128',
    locationLabel: 'Talhão A · Parcela 04',
    responsible: 'Eng. Amanda',
    status: 'PROCESSADA',
  },
  {
    id: 'plot-recent-2',
    code: 'AM-0127',
    locationLabel: 'Talhão B · Parcela 02',
    responsible: 'Pedro Silva',
    status: 'PENDENTE',
  },
  {
    id: 'plot-recent-3',
    code: 'AM-0126',
    locationLabel: 'Talhão A · Parcela 03',
    responsible: 'Marina Lima',
    status: 'PROCESSADA',
  },
];

export default function AdminDashboardPage() {
  const router = useRouter();

  return (
    <section className="flex flex-col gap-6 bg-[#EFECE4] p-6 md:p-8">
      <Topbar
        title="Administração"
        description="Visão geral, usuários e amostras"
        onBack={() => router.push('/platform')}
      />

      <AdminOverviewSection
        initialAuditEntries={MOCK_AUDIT_ENTRIES}
        initialUsersSummary={MOCK_USERS_SUMMARY}
        initialPlotsSummary={MOCK_PLOTS_SUMMARY}
        initialPendingRequest={MOCK_PENDING_REQUEST}
        initialRecentPlots={MOCK_RECENT_PLOTS}
      />
    </section>
  );
}
