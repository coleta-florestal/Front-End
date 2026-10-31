'use client';

import { useState } from 'react';
import Button from '../core/Button';
import { Select } from '../core/Select';
import type { UserRole } from './UserRow';

export interface AccessRequest {
  id: string;
  nome: string;
  email: string;
  solicitadoEm: string;
}

export interface PendingRequestCardProps {
  request: AccessRequest;
  onApprove: (request: AccessRequest, papel: UserRole) => void;
  onReject: (request: AccessRequest) => void;
}

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'User', label: 'User' },
  { value: 'Admin', label: 'Admin' },
  { value: 'SuperAdmin', label: 'SuperAdmin' },
];

export function PendingRequestCard({ request, onApprove, onReject }: PendingRequestCardProps) {
  const [papel, setPapel] = useState<UserRole>('User');

  return (
    <li
      id={`solicitacao-${request.id}`}
      className="flex flex-col gap-4 rounded-xl border border-[#E7E2D8] bg-white p-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="min-w-0">
        <p className="font-semibold text-verde-mata">{request.nome}</p>
        <p className="break-all text-sm text-[#6D786E]">
          {request.email} · solicitado em {request.solicitadoEm}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="w-full sm:w-48">
          <Select
            id={`papel-${request.id}`}
            label="Papel de acesso"
            options={roleOptions}
            value={papel}
            onChange={(event) => setPapel(event.target.value as UserRole)}
          />
        </div>
        <Button label="Recusar" variant="danger-outline" onClick={() => onReject(request)} />
        <Button label="Aprovar" variant="primary" onClick={() => onApprove(request, papel)} />
      </div>
    </li>
  );
}
