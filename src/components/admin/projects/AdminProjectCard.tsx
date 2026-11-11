import { AdminProjectItem, ProjectUser } from '@/types/admin';
import AdminProjectUserRow from './AdminProjectUserRow';

interface AdminProjectCardProps {
  project: AdminProjectItem;
  onAddUser: (projectId: string) => void;
  onEditUser: (projectId: string, user: ProjectUser) => void;
  onRemoveUser: (projectId: string, user: ProjectUser) => void;
}

export default function AdminProjectCard({
  project,
  onAddUser,
  onEditUser,
  onRemoveUser,
}: AdminProjectCardProps) {
  return (
    <article className="flex w-full flex-col overflow-hidden rounded-2xl border border-[#DFDBD0] bg-[#FAF8F3] shadow-sm">
      <header className="flex flex-col gap-4 border-b border-[#E8E4DA] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-serif text-xl font-bold text-[#2C5F2D]">{project.title}</h3>
          <p className="text-xs font-medium text-[#6D786E]">{project.description}</p>
        </div>

        <button
          type="button"
          onClick={() => onAddUser(project.id)}
          className="whitespace-nowrap rounded-xl border-2 border-[#D7D0C2] bg-transparent px-4 py-2 text-xs font-bold text-[#2C5F2D] transition-colors hover:bg-[#E4EDE2]/50"
        >
          + Associar usuário
        </button>
      </header>

      <div className="flex flex-col px-6">
        {project.users.map((user) => (
          <AdminProjectUserRow
            key={user.id}
            user={user}
            onEdit={(u) => onEditUser(project.id, u)}
            onRemove={(u) => onRemoveUser(project.id, u)}
          />
        ))}
      </div>
    </article>
  );
}
