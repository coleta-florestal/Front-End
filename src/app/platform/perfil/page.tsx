'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogoutModal } from '@/components/modal/LogoutModal';
import ProfileFormCard from '@/components/profile/ProfileFormCard';
import Topbar from '@/components/ui/Topbar';
import { useProfileIdentity } from '@/lib/profile';

export default function ProfilePage() {
  const router = useRouter();
  const profile = useProfileIdentity();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-col bg-[#EFECE4]">
      <Topbar
        title="Meu perfil"
        description="Dados pessoais e acesso"
        onBack={() => router.back()}
      />

      <section className="flex flex-1 flex-col items-center gap-4 p-6 md:p-10">
        {/* O snapshot do servidor vem vazio: o key remonta o form uma vez, quando o token é lido no
            cliente. Não usa o nome no key para não apagar a mensagem de sucesso depois de salvar. */}
        <ProfileFormCard key={profile.email ? 'loaded' : 'loading'} initialProfile={profile} />

        <button
          type="button"
          onClick={() => setIsLogoutOpen(true)}
          className="w-full max-w-3xl rounded-xl border border-[#E5B8AD] bg-white px-6 py-3 text-sm font-bold text-[#B8543E] transition-colors hover:bg-[#FDECE9]"
        >
          Sair da conta
        </button>
      </section>

      <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
    </div>
  );
}
