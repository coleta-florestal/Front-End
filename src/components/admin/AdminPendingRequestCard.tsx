'use client';

import { useState } from 'react';
import Button from '@/components/core/Button';
import { AdminPendingUserRequest, AdminUserRole } from '@/types/admin';

interface AdminPendingRequestCardProps {
  pendingRequest: AdminPendingUserRequest | null;
  onApprove: (userId: string, role: AdminUserRole) => void;
  onReject: (userId: string) => void;
  onInviteUser: () => void;
  onNewSample: () => void;
}

export default function AdminPendingRequestCard({
  pendingRequest,
  onApprove,
  onReject,
  onInviteUser,
  onNewSample,
}: AdminPendingRequestCardProps) {
  const [selectedRole, setSelectedRole] = useState<AdminUserRole>('USER');

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-[#E2DDD2] bg-[#FAF8F3] p-6 shadow-sm">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-[#2C5F2D]">Solicitação pendente</h3>
            <p className="mt-0.5 text-xs text-[#6E776B]">
              Defina o papel de acesso antes de aprovar.
            </p>
          </div>

          {pendingRequest && (
            <span className="rounded-lg border border-[#E5C99B] bg-[#FAF3E6] px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-[#9E6B1E]">
              PENDENTE DE APROVAÇÃO
            </span>
          )}
        </div>

        {pendingRequest ? (
          <div className="mt-4 rounded-xl border border-[#E2DDD2] bg-[#F4F1EA] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#DCE8DA] text-xs font-bold text-[#2C5F2D]">
                {pendingRequest.initials}
              </div>

              <div className="flex flex-col">
                <strong className="text-sm font-bold text-[#232922]">{pendingRequest.name}</strong>
                <span className="text-xs text-[#6E776B]">{pendingRequest.email}</span>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="pending-user-role"
                className="mb-1.5 block text-xs font-bold text-[#2C5F2D]"
              >
                Papel de acesso
              </label>

              <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center">
                <select
                  id="pending-user-role"
                  value={selectedRole}
                  onChange={(event) => setSelectedRole(event.target.value as AdminUserRole)}
                  className="h-10 flex-1 rounded-lg border border-[#D7D0C2] bg-white px-3 text-xs font-medium text-[#2C5F2D] focus:border-[#2C5F2D] focus:outline-none"
                >
                  <option value="USER">Coletor (USER)</option>
                  <option value="ADMIN">Administrador (ADMIN)</option>
                </select>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    label="Recusar"
                    onClick={() => onReject(pendingRequest.id)}
                    className="h-10 rounded-lg border border-[#E5B8AD] bg-white px-5 text-xs font-bold text-[#B8543E] shadow-none transition-colors hover:bg-[#FDECE9]"
                  />

                  <Button
                    type="button"
                    label="Aprovar"
                    onClick={() => onApprove(pendingRequest.id, selectedRole)}
                    className="h-10 rounded-lg bg-[#2C5F2D] px-5 text-xs font-bold text-[#FAF8F3] shadow-none transition-colors hover:bg-[#234B24]"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex h-36 items-center justify-center rounded-xl border border-[#E2DDD2] bg-[#F4F1EA] p-4">
            <span className="text-xs font-medium text-[#6E776B]">
              Nenhuma solicitação de acesso pendente no momento.
            </span>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#E5E0D5] pt-4">
        <span className="text-xs font-bold text-[#232922]">Ações rápidas</span>

        <Button
          type="button"
          label="+ Convidar usuário"
          onClick={onInviteUser}
          className="rounded-xl border border-[#B8CDB9] bg-white px-4 py-2 text-xs font-bold text-[#2C5F2D] shadow-none transition-colors hover:bg-[#E4EDE2]"
        />

        <Button
          type="button"
          label="+ Nova amostra"
          onClick={onNewSample}
          className="rounded-xl border border-[#B8CDB9] bg-white px-4 py-2 text-xs font-bold text-[#2C5F2D] shadow-none transition-colors hover:bg-[#E4EDE2]"
        />
      </div>
    </article>
  );
}
