'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/ui/Topbar';
import AdminTabsBar from '@/components/admin/AdminTabBar';
import ValidationLimitsCard from '@/components/admin/validations/ValidationLimitsCard';
import { AdminTabKey } from '@/types/admin';
import { ADMIN_TAB_PATHS, ADMIN_TABS } from '@/lib/adminTabs';

export default function AdminValidationsPage() {
  const router = useRouter();

  // Controle estrito de hidratação
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Timeout previne que o setState no mount quebre regras de render cascata no lint
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
        <AdminTabsBar tabs={ADMIN_TABS} activeTab="validations" onSelectTab={handleTabChange} />

        {/* Só renderiza o Card após a hidratação completa para evitar acesso prematuro ao localStorage */}
        {isMounted && <ValidationLimitsCard />}
      </section>
    </div>
  );
}
