'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import logo from '../../../public/assets/apenas_circulo.png';
import { clearAuthCookies } from '@/lib/auth';
import { House, Farm, Admin, Dashboard, Close } from '../core/Icons';
import { ReactNode, useEffect, useState } from 'react';

type NavLink = {
  label: string;
  href: string;
  icon: ReactNode;
  adminOnly?: boolean;
  exact?: boolean;
};

export function NavDivider() {
  return <div className="my-3 h-px bg-creme-flor" />;
}

const navLinks: NavLink[] = [
  {
    label: 'Início',
    href: '/platform',
    icon: <House size={22} />,
    exact: true,
  },
  {
    label: 'Fazenda',
    href: '/platform/fazendas',
    icon: <Farm size={22} />,
  },
  {
    label: 'Dashboard',
    href: '/platform/dashboards',
    icon: <Dashboard size={22} />,
  },
  {
    label: 'Admin',
    href: '/platform/painel-admin',
    icon: <Admin size={22} />,
    adminOnly: true,
  },
];

function getInitialsFromName(name: string, fallback: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const isProfileActive = pathname.startsWith('/platform/perfil');

  const [userName, setUserName] = useState('Meu perfil');
  const [userInitials, setUserInitials] = useState('U');

  useEffect(() => {
    const updateProfileFromStorage = () => {
      const savedData = localStorage.getItem('glupta_mock_profile');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.name) {
            setUserName(parsed.name.trim());
            setUserInitials(getInitialsFromName(parsed.name, 'U'));
          }
        } catch (error) {
          console.error('Erro ao ler mock do perfil:', error);
        }
      }
    };

    // Carrega os dados iniciais ao montar o componente
    updateProfileFromStorage();

    // Escuta o evento global disparado pelo ProfileFormCard
    window.addEventListener('profile-updated', updateProfileFromStorage);

    // Limpa o listener quando o componente for desmontado
    return () => {
      window.removeEventListener('profile-updated', updateProfileFromStorage);
    };
  }, []);

  return (
    <aside className="hidden lg:flex lg:w-80 min-h-screen bg-verde-mata px-4 py-8 flex-col justify-between">
      <div>
        <div className="flex gap-4 items-center mb-6">
          <Image
            src={logo}
            alt="Glupta-Logo"
            className="h-12 w-12 select-none object-contain"
            loading="eager"
          />
          <div className="flex flex-col -gap-1 text-creme-flor">
            <h1 className="text-4xl font-semibold">Glupta</h1>
            <p className="text-sm font-bold text-verde-eucalipto">COLETA FLORESTAL</p>
          </div>
        </div>

        <NavDivider />

        <nav className="mt-6 space-y-2">
          {navLinks
            .filter((link) => isAdmin || !link.adminOnly)
            .map((link) => {
              const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm text-creme-flor transition-colors ${
                    active
                      ? 'bg-creme-flor/10 border-l-coral-flor border-l-6'
                      : 'hover:bg-creme-flor/10 hover:border-l-coral-flor hover:border-l-6'
                  }`}
                >
                  <div className={`${active ? 'text-coral-flor' : 'text-creme-flor'}`}>
                    {link.icon}
                  </div>
                  <span
                    className={`font-semibold text-lg ${active ? 'text-coral-flor' : 'text-creme-flor'}`}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
        </nav>
      </div>

      <div className="pt-6 border-t border-creme-flor/20 flex items-center justify-between gap-3">
        <Link
          href="/platform/perfil"
          aria-label="Acessar meu perfil"
          className={`flex items-center gap-3 rounded-xl p-2 transition-colors flex-1 min-w-0 ${
            isProfileActive ? 'bg-creme-flor/15' : 'hover:bg-creme-flor/10'
          }`}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-creme-flor/20 font-serif text-sm font-bold text-creme-flor">
            {userInitials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-creme-flor truncate">{userName}</span>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => {
            clearAuthCookies();
            window.location.href = '/';
          }}
          className="flex items-center gap-1.5 rounded-xl bg-coral-flor px-3.5 py-2 text-xs font-bold text-creme-flor transition-opacity hover:opacity-90 shrink-0"
        >
          <Close size={16} color="#FAF8F3" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
