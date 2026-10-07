import Image from 'next/image';
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
    icon: <House />,
  },
  {
    label: 'Fazenda',
    href: '/fazenda',
    icon: <Farm />,
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Dashboard />,
  },
  {
    label: 'Painel',
    href: '/painel-admin',
    icon: <Admin />,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-80 min-h-screen bg-verde-mata px-4 py-8">
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
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-creme-flor hover:bg-creme-flor/10 hover:border-l-coral-flor hover:border-l-6 transition-colors"
          >
            {link.icon}
            <span className="font-semibold text-lg">{link.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
