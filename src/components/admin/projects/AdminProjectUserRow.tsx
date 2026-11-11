import { ProjectUser } from '@/types/admin';

interface AdminProjectUserRowProps {
  user: ProjectUser;
  onEdit: (user: ProjectUser) => void;
  onRemove: (user: ProjectUser) => void;
}

export default function AdminProjectUserRow({ user, onEdit, onRemove }: AdminProjectUserRowProps) {
  const roleStyles = {
    SuperAdmin: 'bg-[#FDECE9] text-[#C85A46] border-[#F2B8AD]',
    Admin: 'bg-[#E4EDE2] text-[#2C5F2D] border-[#B8D8BE]',
    User: 'bg-[#EFECE4] text-[#6D786E] border-[#D8D1C4]',
  };

  return (
    <div className="flex flex-col gap-4 border-b border-[#E8E4DA] py-5 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1.5 sm:w-1/3">
        <span className="text-sm font-bold text-[#232922]">{user.name}</span>
        <span
          className={`w-fit rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${roleStyles[user.roleType]}`}
        >
          {user.roleTitle}
        </span>
      </div>

      <div className="flex flex-1 flex-wrap gap-2">
        {user.plots.map((plot) => (
          <span
            key={plot}
            className="rounded-md bg-[#E4EDE2] px-2.5 py-1 text-xs font-semibold text-[#2C5F2D]"
          >
            {plot}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-2 sm:pt-0">
        <button
          type="button"
          onClick={() => onEdit(user)}
          className="rounded-lg border border-[#D7D0C2] bg-transparent px-4 py-2 text-xs font-bold text-[#2C5F2D] transition-colors hover:bg-[#E4EDE2]/50"
        >
          Editar permissões
        </button>
        <button
          type="button"
          onClick={() => onRemove(user)}
          className="rounded-lg border border-[#F2B8AD] bg-transparent px-4 py-2 text-xs font-bold text-[#C85A46] transition-colors hover:bg-[#FDECE9]/50"
        >
          Remover
        </button>
      </div>
    </div>
  );
}
