'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/ui/Topbar';
import AdminTabsBar from '@/components/admin/AdminTabBar';
import AdminProjectCard from '@/components/admin/projects/AdminProjectCard';
import UserPermissionsModal from '@/components/modal/admin/UserPermissionsModal';
import RemoveUserModal from '@/components/modal/admin/RemoveUserModal';
import { AdminProjectItem, AdminTabKey, ProjectUser } from '@/types/admin';
import { ADMIN_TAB_PATHS, ADMIN_TABS } from '@/lib/adminTabs';

const INITIAL_MOCK_PROJECTS: AdminProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Inventário Santa Clara 2026',
    description: 'Manejo da área A — ciclo 2026 · 2 usuários associados',
    users: [
      {
        id: 'usr-1',
        name: 'Eng. Amanda',
        roleTitle: 'SuperAdmin',
        roleType: 'SuperAdmin',
        plots: ['Talhão A', 'Talhão B'],
      },
      {
        id: 'usr-2',
        name: 'Marina Lima',
        roleTitle: 'User',
        roleType: 'User',
        plots: ['Talhão A'],
      },
    ],
  },
  {
    id: 'proj-2',
    title: 'Boa Vista — Talhão B',
    description: 'Inventário concluído e processado · 1 usuário associado',
    users: [
      {
        id: 'usr-3',
        name: 'Pedro Silva',
        roleTitle: 'Admin',
        roleType: 'Admin',
        plots: ['Talhão B', 'Região Norte'],
      },
    ],
  },
];

const MOCK_STORAGE_KEY = 'glupta_mock_admin_projects';

export default function AdminProjectsPage() {
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  const [projects, setProjects] = useState<AdminProjectItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(MOCK_STORAGE_KEY);
      if (savedData) {
        try {
          return JSON.parse(savedData) as AdminProjectItem[];
        } catch (error) {
          console.error('Erro ao ler mock de projetos:', error);
        }
      }
    }
    return INITIAL_MOCK_PROJECTS;
  });

  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);

  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeUser, setActiveUser] = useState<ProjectUser | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(projects));
    }
  }, [projects, isMounted]);

  const handleTabChange = (key: AdminTabKey) => router.push(ADMIN_TAB_PATHS[key]);

  const openAddUser = (projectId: string) => {
    setActiveProjectId(projectId);
    setActiveUser(null);
    setIsPermissionsOpen(true);
  };

  const openEditUser = (projectId: string, user: ProjectUser) => {
    setActiveProjectId(projectId);
    setActiveUser(user);
    setIsPermissionsOpen(true);
  };

  const openRemoveUser = (projectId: string, user: ProjectUser) => {
    setActiveProjectId(projectId);
    setActiveUser(user);
    setIsRemoveOpen(true);
  };

  const handleSavePermissions = (userName: string, plots: string[]) => {
    setProjects((prevProjects) =>
      prevProjects.map((proj): AdminProjectItem => {
        if (proj.id !== activeProjectId) return proj;

        const userExists = proj.users.find((u) => u.id === activeUser?.id);
        let newUsers: ProjectUser[];

        if (userExists) {
          newUsers = proj.users.map((u) => (u.id === activeUser?.id ? { ...u, plots } : u));
        } else {
          newUsers = [
            ...proj.users,
            {
              id: `usr-${Date.now()}`,
              name: userName,
              roleTitle: 'User',
              roleType: 'User',
              plots,
            },
          ];
        }

        const descriptionParts = proj.description.split('·');
        const newDescription = `${descriptionParts[0].trim()} · ${newUsers.length} usuário${newUsers.length !== 1 ? 's' : ''} associado${newUsers.length !== 1 ? 's' : ''}`;

        return { ...proj, users: newUsers, description: newDescription };
      }),
    );
  };

  const handleConfirmRemove = () => {
    setProjects((prevProjects) =>
      prevProjects.map((proj): AdminProjectItem => {
        if (proj.id !== activeProjectId) return proj;

        const newUsers = proj.users.filter((u) => u.id !== activeUser?.id);

        const descriptionParts = proj.description.split('·');
        const newDescription = `${descriptionParts[0].trim()} · ${newUsers.length} usuário${newUsers.length !== 1 ? 's' : ''} associado${newUsers.length !== 1 ? 's' : ''}`;

        return { ...proj, users: newUsers, description: newDescription };
      }),
    );
  };

  const displayProjects = isMounted ? projects : INITIAL_MOCK_PROJECTS;

  return (
    <div className="flex min-h-full flex-col bg-[#EFECE4]">
      <Topbar
        title="Administração"
        description="Usuários, validações e auditoria"
        onBack={() => router.push('/platform')}
      />

      <section className="flex flex-col gap-8 p-6 md:p-10">
        <AdminTabsBar tabs={ADMIN_TABS} activeTab="projects" onSelectTab={handleTabChange} />

        <p className="text-xs font-semibold text-[#6D786E]">
          Dados locais: esta tela ainda não tem backend e guarda tudo só neste navegador.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="font-serif text-2xl font-bold text-verde-mata">Fazendas</h2>
            <p className="text-sm font-medium text-[#6D786E]">
              Associe usuários e defina as fazendas/talhões que cada um pode acessar.
            </p>
          </div>
          <button
            type="button"
            className="whitespace-nowrap rounded-xl border-2 border-[#D7D0C2] bg-transparent px-5 py-2.5 text-sm font-bold text-verde-mata transition-colors hover:bg-[#E4EDE2]/50"
          >
            + Nova Fazenda
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {displayProjects.map((project) => (
            <AdminProjectCard
              key={project.id}
              project={project}
              onAddUser={openAddUser}
              onEditUser={openEditUser}
              onRemoveUser={openRemoveUser}
            />
          ))}
        </div>
      </section>

      <UserPermissionsModal
        isOpen={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
        onSave={handleSavePermissions}
        editingUser={activeUser}
      />

      <RemoveUserModal
        isOpen={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
}
