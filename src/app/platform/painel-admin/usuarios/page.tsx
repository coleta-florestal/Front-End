'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  activateUser,
  approveUser,
  deactivateUser,
  deleteUser,
  getApprovedUsers,
  getPendingUsers,
  rejectUser,
  updateUserRole,
  type User,
} from '@/app/api/api';
import Topbar from '@/components/ui/Topbar';
import { Input } from '@/components/core/Input';
import AdminTabsBar from '@/components/admin/AdminTabBar';
import AdminPendingRequestCard from '@/components/admin/AdminPendingRequestCard';
import AdminUserRow from '@/components/admin/users/AdminUserRow';
import RejectRequestModal from '@/components/modal/admin/RejectRequestModal';
import RemoveUserModal from '@/components/modal/admin/RemoveUserModal';
import { useToast } from '@/components/ui/ToastProvider';
import { ADMIN_TAB_PATHS, ADMIN_TABS } from '@/lib/adminTabs';
import { decodeJwt, getAccessToken, isCurrentUserSuperAdmin } from '@/lib/auth';
import type { AdminTabKey } from '@/types/admin';

const errorMessage = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

// Permite buscar "Jose" e encontrar "José"
const normalize = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

export default function AdminUsersPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [pending, setPending] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userToRemove, setUserToRemove] = useState<User | null>(null);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
  const [requestToReject, setRequestToReject] = useState<User | null>(null);

  // Quem está logado: o JWT só existe no cookie (navegador), então lê junto do primeiro load
  const [meId, setMeId] = useState<string>();
  const [canPromote, setCanPromote] = useState(false);

  const load = useCallback(
    () =>
      Promise.all([getApprovedUsers(), getPendingUsers()])
        .then(([approved, pendingUsers]) => {
          const token = getAccessToken();
          const payload = token ? decodeJwt(token) : null;
          setMeId(payload?.sub);
          setCanPromote(isCurrentUserSuperAdmin());
          setUsers(approved);
          setPending(pendingUsers);
        })
        .catch((err) => setError(errorMessage(err, 'Não foi possível carregar os usuários.')))
        .finally(() => setIsLoading(false)),
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleTabChange = (key: AdminTabKey) => router.push(ADMIN_TAB_PATHS[key]);

  // Roda a chamada, recarrega as listas; o erro do back vai para a tela.
  const runAction = async (
    action: () => Promise<unknown>,
    fallback: string,
    successMessage?: string,
  ) => {
    setError(null);
    setIsActionLoading(true);
    try {
      await action();
      await load();
      if (successMessage) showToast({ variant: 'success', title: successMessage });
    } catch (err) {
      setError(errorMessage(err, fallback));
    } finally {
      setIsActionLoading(false);
    }
  };

  const term = normalize(search.trim());
  const filteredUsers = users.filter(
    (user) => normalize(user.name).includes(term) || normalize(user.email).includes(term),
  );

  return (
    <div className="flex min-h-full flex-col bg-[#EFECE4]">
      <Topbar
        title="Administração"
        description="Usuários, validações e auditoria"
        onBack={() => router.push('/platform')}
      />

      <section className="flex flex-col gap-8 p-6 md:p-10">
        <AdminTabsBar tabs={ADMIN_TABS} activeTab="users" onSelectTab={handleTabChange} />

        {error && (
          <p role="alert" className="text-sm font-medium text-coral-flor">
            {error}
          </p>
        )}

        {pending.length > 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-serif text-2xl font-bold text-verde-mata">
              Solicitações pendentes
            </h2>
            {pending.map((request) => (
              <AdminPendingRequestCard
                key={request.id}
                pendingRequest={{
                  id: request.id,
                  name: request.name,
                  email: request.email,
                  initials: getInitials(request.name),
                }}
                onApprove={(id, role) =>
                  runAction(() => approveUser(id, role), 'Não foi possível aprovar a solicitação.')
                }
                onReject={() => setRequestToReject(request)}
              />
            ))}
          </div>
        )}

        <article className="flex w-full flex-col rounded-2xl border border-[#DFDBD0] bg-white p-6 shadow-sm sm:p-8">
          <header className="mb-6 flex flex-col gap-4 border-b border-[#E8E4DA] pb-6">
            <div className="flex flex-col gap-1">
              <h2 className="font-serif text-2xl font-bold text-verde-mata">Usuários</h2>
              <p className="text-sm font-medium text-[#6D786E]">
                Gerencie papéis, status e remoção de contas aprovadas.
              </p>
            </div>
            <Input
              label="Buscar usuário"
              placeholder="Nome ou e-mail"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </header>

          {isLoading ? (
            <p className="text-sm font-medium text-[#6D786E]">Carregando usuários...</p>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <AdminUserRow
                key={user.id}
                user={user}
                isProtected={user.role === 'SUPER_ADMIN' || user.id === meId}
                isBusy={isActionLoading}
                canPromote={canPromote}
                onToggleRole={(target: User) =>
                  runAction(
                    () => updateUserRole(target.id, target.role === 'ADMIN' ? 'USER' : 'ADMIN'),
                    'Não foi possível alterar o papel.',
                  )
                }
                onToggleActive={(target: User) => {
                  // Desativar pede confirmação antes de chamar a API
                  if (target.accountStatus === 'ACTIVE') {
                    setUserToDeactivate(target);
                    return;
                  }
                  runAction(
                    () => activateUser(target.id),
                    'Não foi possível alterar o status da conta.',
                    'Usuário ativado com sucesso.',
                  );
                }}
                onRemove={setUserToRemove}
              />
            ))
          ) : (
            <p className="text-sm font-medium text-[#6D786E]">Nenhum usuário encontrado.</p>
          )}
        </article>
      </section>

      <RemoveUserModal
        isOpen={!!userToRemove}
        onClose={() => setUserToRemove(null)}
        onConfirm={() => {
          if (userToRemove)
            runAction(() => deleteUser(userToRemove.id), 'Não foi possível remover o usuário.');
        }}
      />

      <RemoveUserModal
        isOpen={!!userToDeactivate}
        title="Tem certeza que deseja desativar o usuário?"
        warning={`${userToDeactivate?.name ?? 'O usuário'} perderá o acesso ao Glupta até que a conta seja ativada novamente. Os dados da conta são mantidos.`}
        confirmLabel="Sim, desativar conta"
        onClose={() => setUserToDeactivate(null)}
        onConfirm={() => {
          if (userToDeactivate)
            runAction(
              () => deactivateUser(userToDeactivate.id),
              'Não foi possível alterar o status da conta.',
              'Usuário desativado com sucesso.',
            );
        }}
      />

      <RejectRequestModal
        isOpen={!!requestToReject}
        userName={requestToReject?.name ?? ''}
        onClose={() => setRequestToReject(null)}
        onConfirm={() => {
          if (requestToReject)
            runAction(
              () => rejectUser(requestToReject.id),
              'Não foi possível recusar a solicitação.',
            );
        }}
      />
    </div>
  );
}
