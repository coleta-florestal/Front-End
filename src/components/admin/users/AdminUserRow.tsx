import type { User } from '@/app/api/api';

interface AdminUserRowProps {
  user: User;
  isProtected: boolean;
  isBusy: boolean;
  canPromote: boolean;
  onToggleRole: (user: User) => void;
  onToggleActive: (user: User) => void;
  onRemove: (user: User) => void;
}

const ROLE_LABEL = { USER: 'Coletor', ADMIN: 'Administrador', SUPER_ADMIN: 'Super Admin' };

const ROLE_STYLE = {
  SUPER_ADMIN: 'bg-[#FDECE9] text-[#C85A46] border-[#F2B8AD]',
  ADMIN: 'bg-[#E4EDE2] text-verde-mata border-[#B8D8BE]',
  USER: 'bg-[#EFECE4] text-[#6D786E] border-[#D8D1C4]',
};

const actionButton =
  'rounded-lg border bg-transparent px-4 py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

export default function AdminUserRow({
  user,
  isProtected,
  isBusy,
  canPromote,
  onToggleRole,
  onToggleActive,
  onRemove,
}: AdminUserRowProps) {
  const isActive = user.accountStatus === 'ACTIVE';

  return (
    <div className="flex flex-col gap-4 border-b border-[#E8E4DA] py-5 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1.5 sm:w-1/3">
        <span className="text-sm font-bold text-[#232922]">{user.name}</span>
        <span className="text-sm text-[#6D786E]">{user.email}</span>
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-2">
        <span
          className={`w-fit rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${ROLE_STYLE[user.role]}`}
        >
          {ROLE_LABEL[user.role]}
        </span>
        <span
          className={`w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
            isActive ? 'bg-[#E4EDE2] text-verde-mata' : 'bg-[#EFECE4] text-[#6D786E]'
          }`}
        >
          {isActive ? 'Ativo' : 'Inativo'}
        </span>
      </div>

      {!isProtected && (
        <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
          {(user.role === 'ADMIN' || canPromote) && (
            <button
              type="button"
              disabled={isBusy}
              onClick={() => onToggleRole(user)}
              className={`${actionButton} border-[#D7D0C2] text-verde-mata hover:bg-[#E4EDE2]/50`}
            >
              {user.role === 'ADMIN' ? 'Tornar coletor' : 'Tornar administrador'}
            </button>
          )}
          <button
            type="button"
            disabled={isBusy}
            onClick={() => onToggleActive(user)}
            className={`${actionButton} border-[#D7D0C2] text-verde-mata hover:bg-[#E4EDE2]/50`}
          >
            {isActive ? 'Desativar' : 'Ativar'}
          </button>
          <button
            type="button"
            disabled={isBusy}
            onClick={() => onRemove(user)}
            className={`${actionButton} border-[#F2B8AD] text-[#C85A46] hover:bg-[#FDECE9]/50`}
          >
            Remover
          </button>
        </div>
      )}
    </div>
  );
}
