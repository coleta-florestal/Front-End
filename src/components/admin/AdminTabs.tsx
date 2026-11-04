'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type AdminTab = {
  label: string;
  href?: string;
};

// As abas sem href ainda não têm tela e ficam desabilitadas
const tabs: AdminTab[] = [
  { label: 'Visão Geral', href: '/platform/painel-admin' },
  { label: 'Usuários', href: '/platform/painel-admin/usuarios' },
  { label: 'Projetos' },
  { label: 'Equações' },
  { label: 'Validações' },
  { label: 'Auditoria' },
];

const tabStyles = 'shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors';

export function AdminTabs() {
  const pathname = usePathname();

  return (
    <nav id="admin-tabs" className="flex gap-2 overflow-x-auto px-4 pt-6 lg:px-8">
      {tabs.map((tab) => {
        if (!tab.href) {
          return (
            <span
              key={tab.label}
              aria-disabled="true"
              className={`${tabStyles} cursor-not-allowed border-[#D7D0C2] bg-white/50 text-[#6D786E]/50`}
            >
              {tab.label}
            </span>
          );
        }

        const active = pathname === tab.href;
        return (
          <Link
            key={tab.label}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className={`${tabStyles} ${
              active
                ? 'border-verde-mata bg-verde-mata text-white'
                : 'border-[#D7D0C2] bg-white text-[#6D786E] hover:bg-[#f0ede5]'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
