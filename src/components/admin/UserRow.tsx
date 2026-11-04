import Button from '../core/Button';

export type UserRole = 'User' | 'Admin' | 'SuperAdmin';
export type UserStatus = 'ATIVO' | 'INATIVO';

export interface AdminUser {
  id: string;
  nome: string;
  email: string;
  papel: UserRole;
  status: UserStatus;
}

export interface UserRowProps {
  user: AdminUser;
  onToggleRole: (user: AdminUser) => void;
  onRemove: (user: AdminUser) => void;
}

const roleStyles: Record<UserRole, string> = {
  User: 'border-[#D7D0C2] bg-[#ECE8DE] text-[#6D786E]',
  Admin: 'border-verde-eucalipto bg-[#E8F0EA] text-verde-mata',
  SuperAdmin: 'border-coral-flor/50 bg-[#FBECE8] text-[#B85C47]',
};

const statusStyles: Record<UserStatus, string> = {
  ATIVO: 'bg-[#E8F0EA] text-verde-mata',
  INATIVO: 'bg-[#ECE8DE] text-[#6D786E]',
};

export function UserRow({ user, onToggleRole, onRemove }: UserRowProps) {
  return (
    <li
      id={`usuario-${user.id}`}
      className="flex flex-col gap-3 rounded-xl border border-[#E7E2D8] bg-[#FAF7F0] p-4 md:flex-row md:items-center md:justify-between"
    >
      <div className="min-w-0">
        <p className="font-semibold text-[#2F3A30]">{user.nome}</p>
        <p className="break-all text-sm text-[#6D786E]">{user.email}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onToggleRole(user)}
          aria-label={`Alterar papel de ${user.nome}. Papel atual: ${user.papel}`}
          className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-bold transition-opacity hover:opacity-80 ${roleStyles[user.papel]}`}
        >
          {user.papel}
        </button>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[user.status]}`}>
          {user.status}
        </span>
        <Button
          label="Remover"
          variant="coral"
          onClick={() => onRemove(user)}
          className="ml-auto md:ml-2"
        />
      </div>
    </li>
  );
}
