'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import logo from '../../../public/assets/apenas_circulo.png';
import { House, Farm, Admin, Dashboard } from '../core/Icons';
import { ReactNode } from 'react';

type NavLink = {
  label: string;
  href: string;
  icon: ReactNode;
};

export function NavDivider() {
  return <div className="my-3 h-px bg-creme-flor" />;
}

const navLinks: NavLink[] = [
  {
    label: 'Início',
    href: '/',
    icon: <House size={22} />,
  },
  {
    label: 'Fazenda',
    href: '/fazenda',
    icon: <Farm size={22} />,
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Dashboard size={22} />,
  },
  {
    label: 'Admin',
    href: '/platform/painel-admin',
    icon: <Admin size={22} />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:w-80 min-h-screen bg-verde-mata px-4 py-8 flex-col">
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

      <nav className="mt-6 space-y-2 flex-1">
        {navLinks.map((link) => {
          const active = pathname.startsWith(link.href);
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
              <div className={`${active ? 'text-coral-flor' : 'text-creme-flor'}`}>{link.icon}</div>
              <span
                className={`font-semibold text-lg ${active ? 'text-coral-flor' : 'text-creme-flor'}`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
