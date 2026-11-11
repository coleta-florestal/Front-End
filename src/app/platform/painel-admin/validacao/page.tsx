'use client';

import { useRouter } from 'next/navigation';
import Topbar from '@/components/ui/Topbar';
import AdminTabsBar from '@/components/admin/AdminTabBar';
import ValidationLimitsCard from '@/components/admin/validations/ValidationLimitsCard';
import { AdminTabKey } from '@/types/admin';
import { ADMIN_TAB_PATHS, ADMIN_TABS } from '@/lib/adminTabs';

export default function AdminValidationsPage() {
  const router = useRouter();

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

        <ValidationLimitsCard />
      </section>
    </div>
  );
}
