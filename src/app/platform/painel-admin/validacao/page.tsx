'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/ui/Topbar';
import AdminTabsBar from '@/components/admin/AdminTabBar';
import ValidationLimitsCard from '@/components/admin/validations/ValidationLimitsCard';
import { AdminTabOption } from '@/types/admin';

const ADMIN_TABS: AdminTabOption[] = [
  { key: 'overview', label: 'Visão Geral' },
  { key: 'users', label: 'Usuários' },
  { key: 'projects', label: 'Projetos' },
  { key: 'equations', label: 'Equações' },
  { key: 'validations', label: 'Validações' },
  { key: 'audit', label: 'Auditoria' },
];

export default function AdminValidationsPage() {
  const router = useRouter();

  // Controle estrito de hidratação
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Timeout previne que o setState no mount quebre regras de render cascata no lint
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (key: string) => {
    if (key === 'overview') {
      router.push('/platform/painel-admin');
    } else {
      router.push(`/platform/painel-admin/${key}`);
    }
  };

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
