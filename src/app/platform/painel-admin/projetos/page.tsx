'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  addProjectUser,
  getAdminProjects,
  getApprovedUsers,
  removeProjectUser,
  type User,
} from '@/app/api/api';
import Topbar from '@/components/ui/Topbar';
import AdminTabsBar from '@/components/admin/AdminTabBar';
import AdminProjectCard from '@/components/admin/projects/AdminProjectCard';
import UserPermissionsModal from '@/components/modal/admin/UserPermissionsModal';
import RemoveUserModal from '@/components/modal/admin/RemoveUserModal';
import {
  AdminProjectItem,
  AdminProjectRecord,
  AdminTabKey,
  ProjectUser,
  ProjectUserRoleType,
} from '@/types/admin';
import { ADMIN_TAB_PATHS, ADMIN_TABS } from '@/lib/adminTabs';

const ROLE_TYPES: Record<string, ProjectUserRoleType> = {
  SUPER_ADMIN: 'SuperAdmin',
  ADMIN: 'Admin',
  USER: 'User',
};

function toProjectItem(record: AdminProjectRecord): AdminProjectItem {
  const count = record.users.length;

  return {
    id: record.id,
    title: record.name,
    description: `${record.address} · ${count} usuário${count !== 1 ? 's' : ''} associado${count !== 1 ? 's' : ''}`,
    users: record.users.map((user) => ({
      id: user.id,
      name: user.name,
      roleTitle: ROLE_TYPES[user.role],
      roleType: ROLE_TYPES[user.role],
    })),
  };
}

export default function AdminProjectsPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<AdminProjectItem[] | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<ProjectUser | null>(null);

  const reload = useCallback(async () => {
    try {
      const [records, users] = await Promise.all([getAdminProjects(), getApprovedUsers()]);
      setProjects(records.map(toProjectItem));
      setAllUsers(users);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível carregar os projetos.');
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- busca inicial dos dados
    void reload();
  }, [reload]);

  const handleTabChange = (key: AdminTabKey) => router.push(ADMIN_TAB_PATHS[key]);

  const run = async (action: () => Promise<unknown>) => {
    try {
      await action();
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível concluir a ação.');
    }
  };

  const activeProject = projects?.find((project) => project.id === activeProjectId);
  const candidates = allUsers.filter(
    (user) => !activeProject?.users.some((member) => member.id === user.id),
  );

  return (
    <div className="flex min-h-full flex-col bg-[#EFECE4]">
      <Topbar
        title="Administração"
        description="Usuários, validações e auditoria"
        onBack={() => router.push('/platform')}
      />

      <section className="flex flex-col gap-8 p-6 md:p-10">
        <AdminTabsBar tabs={ADMIN_TABS} activeTab="projects" onSelectTab={handleTabChange} />

        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-2xl font-bold text-verde-mata">Fazendas</h2>
          <p className="text-sm font-medium text-[#6D786E]">
            Associe usuários às fazendas que cada um pode acessar.
          </p>
        </div>

        {error && <p className="text-sm font-semibold text-red-700">{error}</p>}

        <div className="flex flex-col gap-6">
          {projects?.map((project) => (
            <AdminProjectCard
              key={project.id}
              project={project}
              onAddUser={(projectId) => {
                setActiveProjectId(projectId);
                setIsAddOpen(true);
              }}
              onRemoveUser={(projectId, user) => {
                setActiveProjectId(projectId);
                setActiveUser(user);
                setIsRemoveOpen(true);
              }}
            />
          ))}
        </div>
      </section>

      <UserPermissionsModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSave={(userId) => activeProjectId && run(() => addProjectUser(activeProjectId, userId))}
        users={candidates}
      />

      <RemoveUserModal
        isOpen={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        onConfirm={() =>
          activeProjectId &&
          activeUser &&
          run(() => removeProjectUser(activeProjectId, activeUser.id))
        }
        title="Remover o acesso deste usuário à fazenda?"
        warning="A conta continua existindo, mas o usuário deixa de enxergar esta fazenda."
        confirmLabel="Sim, remover acesso"
      />
    </div>
  );
}
