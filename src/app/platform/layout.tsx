import { cookies } from 'next/headers';
import { getCurrentRole } from '@/app/api/api';
import { isAdminRole } from '@/lib/auth';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  // Papel atual do back, não o do JWT: quem foi rebaixado perde o menu Administração sem relogar.
  const isAdmin = isAdminRole(await getCurrentRole(cookieStore.get('accessToken')?.value));

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header isAdmin={isAdmin} />
      <div className="flex flex-1 min-h-0 w-full">
        <Sidebar isAdmin={isAdmin} />
        <main className="flex-1 min-h-0 lg:pt-0 pt-16 pb-16 lg:pb-4 overflow-y-auto bg-creme-flor flex flex-col print:block print:overflow-visible print:p-0 print:bg-white">
          <div className="w-full flex-1 min-h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
