'use client';

import { useRouter } from 'next/navigation';
import ProfileFormCard from '@/components/profile/ProfileFormCard';
import Topbar from '@/components/ui/Topbar';
import { UserProfile } from '@/types/profile';

const MOCK_USER_PROFILE: UserProfile = {
  id: 'user-amanda-rocha',
  displayName: 'Eng. Amanda',
  roleTitle: 'Inventário Campo · coletora',
  initials: 'EA',
  name: 'Amanda Rocha',
  email: 'amanda@lyptus.com.br',
  organization: 'Lyptus',
  phone: '(81) 99999-0000',
};

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-full flex-col bg-[#EFECE4]">
      <Topbar
        title="Meu perfil"
        description="Dados pessoais e acesso"
        onBack={() => router.back()}
      />

      <section className="flex flex-1 flex-col items-center gap-4 p-6 md:p-10">
        <p className="text-xs font-semibold text-[#6D786E]">
          Dados locais: esta tela ainda não tem backend, os valores iniciais são fictícios e o que
          você salvar fica só neste navegador.
        </p>
        <ProfileFormCard initialProfile={MOCK_USER_PROFILE} />
      </section>
    </div>
  );
}
