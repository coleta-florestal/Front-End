import { AdminTabs } from '@/components/admin/AdminTabs';

export default function PainelAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="painel-admin" className="min-h-full bg-[#ECE8DE]">
      <AdminTabs />
      {children}
    </div>
  );
}
