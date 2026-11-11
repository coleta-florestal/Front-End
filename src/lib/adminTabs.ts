import type { AdminTabKey, AdminTabOption } from '@/types/admin';

export const ADMIN_TABS: AdminTabOption[] = [
  { key: 'overview', label: 'Visão Geral' },
  { key: 'users', label: 'Usuários' },
  { key: 'projects', label: 'Projetos' },
  { key: 'equations', label: 'Equações' },
  { key: 'validations', label: 'Validações' },
  { key: 'audit', label: 'Auditoria' },
];

// As chaves são só identificadores; as rotas seguem o nome das pastas (português, sem acento).
// "users" fica na visão geral, que já lista usuários e pendências.
export const ADMIN_TAB_PATHS: Record<AdminTabKey, string> = {
  overview: '/platform/painel-admin',
  users: '/platform/painel-admin',
  projects: '/platform/painel-admin/projetos',
  equations: '/platform/painel-admin/equacao',
  validations: '/platform/painel-admin/validacao',
  audit: '/platform/painel-admin/auditoria',
};
