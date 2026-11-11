'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/ui/Topbar';
import AdminTabsBar from '@/components/admin/AdminTabBar';
import AuditLogCard, { AuditLogEntry } from '@/components/admin/audit/AuditLogCard';
import { AdminTabKey } from '@/types/admin';
import { ADMIN_TAB_PATHS, ADMIN_TABS } from '@/lib/adminTabs';

// Dados mocados extraídos exatamente do design fornecido
const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    date: '12/08 09:41',
    description: 'Eng. Amanda concluiu Parcela 01 · Fazenda Santa Clara',
  },
  {
    id: 'log-2',
    date: '12/08 09:28',
    description: 'Eng. Amanda registrou Árvore 02 · Parcela 02',
  },
  {
    id: 'log-3',
    date: '11/08 17:02',
    description: 'Pedro Silva alterou limites de validação de DAP',
  },
];

export default function AdminAuditPage() {
  const router = useRouter();

  // Tipagem estrita de boolean para garantir que não há 'any' implícito
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
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

        <p className="text-xs font-semibold text-[#6D786E]">
          Exemplo: a auditoria ainda não tem backend e os registros abaixo são fictícios.
        </p>

        {/* Só renderiza o conteúdo principal no lado do cliente */}
        {isMounted && <AuditLogCard logs={MOCK_AUDIT_LOGS} />}
      </section>
    </div>
  );
}
