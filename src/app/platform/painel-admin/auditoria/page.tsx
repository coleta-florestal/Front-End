'use client';

import { useState, useEffect } from 'react';
import { getApprovedUsers, getAuditLogs, getPendingUsers } from '@/app/api/api';
import { toAuditEntry } from '@/lib/audit';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/ui/Topbar';
import AdminTabsBar from '@/components/admin/AdminTabBar';
import AuditLogCard, { AuditLogEntry } from '@/components/admin/audit/AuditLogCard';
import { AdminTabKey } from '@/types/admin';
import { ADMIN_TAB_PATHS, ADMIN_TABS } from '@/lib/adminTabs';

export default function AdminAuditPage() {
  const router = useRouter();

  const [logs, setLogs] = useState<AuditLogEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Sem a lista de usuários a auditoria continua útil, só fica sem o nome do alvo.
    const loadUsers = Promise.all([getApprovedUsers(), getPendingUsers()]).then((lists) =>
      lists.flat(),
    );

    Promise.all([getAuditLogs(), loadUsers.catch(() => [])])
      .then(([data, users]) => {
        const usersById = new Map(users.map((user) => [user.id, user.name]));
        setLogs(data.map((log) => toAuditEntry(log, usersById)));
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Não foi possível carregar a auditoria.'),
      );
  }, []);

  const handleTabChange = (key: AdminTabKey) => router.push(ADMIN_TAB_PATHS[key]);

  return (
    <div className="flex min-h-full flex-col bg-[#EFECE4]">
      <Topbar
        title="Administração"
        description="Usuários, validações e auditoria"
        onBack={() => router.push('/platform')}
      />

      <section className="flex flex-col gap-8 p-6 md:p-10">
        <AdminTabsBar tabs={ADMIN_TABS} activeTab="audit" onSelectTab={handleTabChange} />

        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}
        {logs && <AuditLogCard logs={logs} />}
      </section>
    </div>
  );
}
