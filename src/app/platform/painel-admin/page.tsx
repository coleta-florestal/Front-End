'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getApprovedUsers,
  getAuditLogs,
  getFarmsWithDetails,
  getPendingUsers,
  User,
} from '@/app/api/api';
import { toAdminAuditEntry } from '@/lib/audit';
import Topbar from '@/components/ui/Topbar';
import AdminOverviewSection from '@/components/admin/AdminOverviewSection';
import {
  AdminAuditEntry,
  AdminPendingUserRequest,
  AdminPlotsSummary,
  AdminRecentPlotItem,
  AdminUsersSummary,
  AuditLog,
} from '@/types/admin';
import { PrismaFarmRecord } from '@/types/farm';

interface AdminData {
  usersSummary: AdminUsersSummary;
  plotsSummary: AdminPlotsSummary;
  pendingRequest: AdminPendingUserRequest | null;
  recentPlots: AdminRecentPlotItem[];
  auditEntries: AdminAuditEntry[];
}

function toPendingRequest(user: User): AdminPendingUserRequest {
  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return { id: user.id, name: user.name, email: user.email, initials };
}

function toAdminData(
  approved: User[],
  pending: User[],
  farms: PrismaFarmRecord[],
  logs: AuditLog[],
): AdminData {
  const usersById = new Map([...approved, ...pending].map((user) => [user.id, user.name]));
  const auditEntries = [...logs]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 10)
    .map((log) => toAdminAuditEntry(log, usersById));

  const subPlots = farms.flatMap((farm) =>
    (farm.plots ?? []).flatMap((plot) =>
      (plot.subPlots ?? []).map((subPlot) => ({ farm, plot, subPlot })),
    ),
  );
  const processedCount = subPlots.filter(({ subPlot }) => subPlot.status === 'COMPLETED').length;

  const recentPlots = [...subPlots]
    .sort((a, b) => b.subPlot.createdAt.localeCompare(a.subPlot.createdAt))
    .slice(0, 2)
    .map(({ farm, plot, subPlot }) => ({
      id: subPlot.id,
      code: `Parcela ${subPlot.name}`,
      locationLabel: `${farm.name} · ${plot.name}`,
      responsible: farm.owner?.name ?? '—',
      status: subPlot.status === 'COMPLETED' ? ('PROCESSADA' as const) : ('PENDENTE' as const),
    }));

  return {
    usersSummary: { totalApprovedUsers: approved.length, pendingRequestsCount: pending.length },
    plotsSummary: {
      totalRegisteredParcels: subPlots.length,
      processedCount,
      pendingCount: subPlots.length - processedCount,
    },
    pendingRequest: pending.length > 0 ? toPendingRequest(pending[0]) : null,
    recentPlots,
    auditEntries,
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    () =>
      Promise.all([
        getApprovedUsers(),
        getPendingUsers(),
        getFarmsWithDetails(),
        // Falha na auditoria não deve derrubar o painel; o card mostra o estado vazio.
        getAuditLogs().catch((): AuditLog[] => []),
      ])
        .then(([approved, pending, farms, logs]) => {
          setData(toAdminData(approved, pending, farms, logs));
          setError(null);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Não foi possível carregar o painel');
        }),
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="flex flex-col gap-6">
      <Topbar
        title="Administração"
        description="Visão geral, usuários e amostras"
        onBack={() => router.push('/platform/fazendas')}
      />

      {error && (
        <p role="alert" className="text-sm text-coral-flor">
          {error}
        </p>
      )}

      {!data && !error && <p className="text-sm text-[#6E776B] px-4">Carregando painel...</p>}

      {data && (
        <div className="flex flex-col px-4 lg:px-6">
          <AdminOverviewSection
            auditEntries={data.auditEntries}
            usersSummary={data.usersSummary}
            plotsSummary={data.plotsSummary}
            pendingRequest={data.pendingRequest}
            recentPlots={data.recentPlots}
            onChanged={load}
          />
        </div>
      )}
    </section>
  );
}
