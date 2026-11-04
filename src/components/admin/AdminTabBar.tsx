import Button from '@/components/core/Button';
import { AdminTabKey, AdminTabOption } from '@/types/admin';

interface AdminTabsBarProps {
  tabs: AdminTabOption[];
  activeTab: AdminTabKey;
  onSelectTab: (tabKey: AdminTabKey) => void;
}

export default function AdminTabsBar({ tabs, activeTab, onSelectTab }: AdminTabsBarProps) {
  return (
    <nav aria-label="Navegação da administração" className="flex flex-wrap items-center gap-2.5">
      {tabs.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <Button
            key={tab.key}
            type="button"
            label={tab.label}
            onClick={() => onSelectTab(tab.key)}
            className={`rounded-xl px-5 py-2.5 text-xs transition-colors ${
              isActive
                ? 'bg-[#2C5F2D] font-bold text-[#FAF8F3] shadow-sm'
                : 'border border-[#DFDBD0] bg-[#FAF8F3] font-semibold text-[#3B4439] shadow-none hover:bg-[#E4EDE2] hover:text-[#2C5F2D]'
            }`}
          />
        );
      })}
    </nav>
  );
}
