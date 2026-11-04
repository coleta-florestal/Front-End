'use client';

import { useState } from 'react';
import { type AccessRequest, PendingRequestCard } from '@/components/admin/PendingRequestCard';
import { type AdminUser, UserRow, type UserRole } from '@/components/admin/UserRow';
import { Bell, MapPin } from '@/components/core/Icons';
import { Input } from '@/components/core/Input';
import { RejectRequestModal } from '@/components/modal/RejectRequestModal';
import { RemoveUserModal } from '@/components/modal/RemoveUserModal';

// Dados de exemplo até o CRUD de usuários (#60) estar disponível na API
const REQUESTS: AccessRequest[] = [
  {
    id: 'carla',
    nome: 'Carla Menezes',
    email: 'carla@fazendaboavista.com',
    solicitadoEm: '11/09/2026',
  },
];

const USERS: AdminUser[] = [
  {
    id: 'amanda',
    nome: 'Eng. Amanda',
    email: 'amanda@lyptus.com.br',
    papel: 'SuperAdmin',
    status: 'ATIVO',
  },
  {
    id: 'pedro',
    nome: 'Pedro Silva',
    email: 'pedro@lyptus.com.br',
    papel: 'Admin',
    status: 'ATIVO',
  },
  {
    id: 'marina',
    nome: 'Marina Lima',
    email: 'marina@lyptus.com.br',
    papel: 'User',
    status: 'INATIVO',
  },
];

const NEXT_ROLE: Record<UserRole, UserRole> = {
  User: 'Admin',
  Admin: 'SuperAdmin',
  SuperAdmin: 'User',
};

// Permite buscar "Jose" e encontrar "José"
function normalize(text: string) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

export default function UsuariosPage() {
  const [requests, setRequests] = useState(REQUESTS);
  const [users, setUsers] = useState(USERS);
  const [search, setSearch] = useState('');
  const [requestToReject, setRequestToReject] = useState<AccessRequest | null>(null);
  const [userToRemove, setUserToRemove] = useState<AdminUser | null>(null);

  const term = normalize(search.trim());
  const filteredUsers = users.filter(
    (user) => normalize(user.nome).includes(term) || normalize(user.email).includes(term),
  );

  const handleApprove = (request: AccessRequest, papel: UserRole) => {
    setRequests((current) => current.filter((item) => item.id !== request.id));
    setUsers((current) => [
      ...current,
      { id: request.id, nome: request.nome, email: request.email, papel, status: 'ATIVO' },
    ]);
  };

  const handleReject = (request: AccessRequest) => {
    setRequests((current) => current.filter((item) => item.id !== request.id));
    setRequestToReject(null);
  };

  const handleToggleRole = (user: AdminUser) => {
    setUsers((current) =>
      current.map((item) =>
        item.id === user.id ? { ...item, papel: NEXT_ROLE[item.papel] } : item,
      ),
    );
  };

  const handleRemove = (user: AdminUser) => {
    setUsers((current) => current.filter((item) => item.id !== user.id));
    setUserToRemove(null);
  };

  return (
    <div id="gestao-usuarios" className="flex flex-col gap-6 p-4 lg:px-8 lg:py-6">
      <div id="usuarios-status" className="flex flex-wrap items-center gap-3 text-sm">
        {requests.length > 0 && (
          <span className="flex items-center gap-2 rounded-full border border-[#E8D5A8] bg-[#FAF1DE] px-4 py-2 font-semibold text-[#7A5A1E]">
            <Bell size={16} />
            {requests.length === 1
              ? '1 solicitação de acesso pendente'
              : `${requests.length} solicitações de acesso pendentes`}
          </span>
        )}
        <span className="flex items-center gap-2 text-[#6D786E]">
          <MapPin size={16} color="#6D786E" />
          Sincronizado hoje, 09:42
        </span>
      </div>

      <div
        id="usuarios-conteudo"
        className="flex flex-col gap-6 rounded-2xl border border-[#E7E2D8] bg-white p-4 lg:p-6"
      >
        <section
          id="solicitacoes-pendentes"
          className="flex flex-col gap-3 rounded-xl border border-[#E8D5A8] bg-[#FAF1DE] p-4 lg:p-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-newsreader text-2xl font-semibold text-marrom-casca">
              Solicitações pendentes
            </h2>
            {requests.length > 0 && (
              <span className="rounded-full border border-[#E8D5A8] bg-white px-3 py-1 text-xs font-bold text-[#7A5A1E]">
                PENDENTE DE APROVAÇÃO
              </span>
            )}
          </div>

          {requests.length > 0 ? (
            <>
              <p className="text-sm text-[#7A5A1E]">
                Defina o papel de acesso antes de aprovar. A conta só fica ativa após a aprovação.
              </p>
              <ul className="flex flex-col gap-3">
                {requests.map((request) => (
                  <PendingRequestCard
                    key={request.id}
                    request={request}
                    onApprove={handleApprove}
                    onReject={setRequestToReject}
                  />
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-[#7A5A1E]">Nenhuma solicitação pendente no momento.</p>
          )}
        </section>

        <section id="usuarios-aprovados" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-3">
            <h2 className="font-newsreader text-2xl font-semibold text-verde-mata">
              Usuários aprovados
            </h2>
            <p className="text-sm text-[#6D786E]">
              Clique no papel para alternar entre User, Admin e SuperAdmin.
            </p>
          </div>

          <Input
            id="buscar-usuario"
            label="Buscar usuário"
            hideLabel
            type="search"
            placeholder="Buscar usuário por nome ou e-mail..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          {filteredUsers.length > 0 ? (
            <ul className="flex flex-col gap-3">
              {filteredUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  onToggleRole={handleToggleRole}
                  onRemove={setUserToRemove}
                />
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-[#6D786E]">Nenhum usuário encontrado.</p>
          )}
        </section>
      </div>

      <RejectRequestModal
        request={requestToReject}
        onConfirm={handleReject}
        onClose={() => setRequestToReject(null)}
      />
      <RemoveUserModal
        user={userToRemove}
        onConfirm={handleRemove}
        onClose={() => setUserToRemove(null)}
      />
    </div>
  );
}
