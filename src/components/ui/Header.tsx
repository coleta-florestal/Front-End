'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import logo from '../../../public/assets/apenas_circulo.png';
import { House, Farm, Dashboard, Admin } from '../core/Icons';
import { ReactNode } from 'react';

type NavLink = {
  label: string;
  href: string;
  icon: ReactNode;
};

const navLinks: NavLink[] = [
  {
    label: 'Início',
    href: '/',
    icon: <House size={24} />,
  },
  {
    label: 'Fazenda',
    href: '/fazenda',
    icon: <Farm size={24} />,
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Dashboard size={24} />,
  },
  {
    label: 'Admin',
    href: '/painel-admin',
    icon: <Admin size={24} />,
  },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-16 bg-verde-mata border-b border-creme-flor/20">
      <div className="flex h-full items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src={logo}
            alt="Glupta-Logo"
            className="h-10 w-10 select-none object-contain"
            loading="eager"
          />
          <div className="flex flex-col -gap-1 text-creme-flor">
            <h1 className="text-2xl font-semibold">Glupta</h1>
            <p className="text-xs font-bold text-verde-eucalipto">COLETA FLORESTAL</p>
          </div>
        </Link>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around px-2 h-16 bg-verde-mata/95 backdrop-blur-md border-t border-creme-flor/20 print:hidden">
        {navLinks.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-colors ${
                active ? 'text-coral-flor' : 'text-creme-flor/70'
              }`}
              aria-label={link.label}
            >
              <div className={`${active ? 'text-coral-flor' : 'text-creme-flor/70'}`}>
                {link.icon}
              </div>
              <span
                className={`text-xs font-semibold ${active ? 'text-coral-flor' : 'text-creme-flor/70'}`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
