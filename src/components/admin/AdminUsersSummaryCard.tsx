import Button from '@/components/core/Button';
import { AdminUsersSummary } from '@/types/admin';

interface AdminUsersSummaryCardProps {
  summary: AdminUsersSummary;
  onManageUsers: () => void;
}

export default function AdminUsersSummaryCard({
  summary,
  onManageUsers,
}: AdminUsersSummaryCardProps) {
  const pendingLabel =
    summary.pendingRequestsCount === 1
      ? '1 solicitação pendente'
      : `${summary.pendingRequestsCount} solicitações pendentes`;

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-[#E2DDD2] bg-[#FAF8F3] p-6 shadow-sm">
      <div className="flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E4EDE2] text-[#2C5F2D]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-[#232922]">
            USUÁRIOS
          </span>
          <span className="text-xs text-[#6E776B]">Pessoas com acesso à turma</span>
        </div>
      </div>

      <div className="my-4 flex flex-col">
        <strong className="text-4xl font-bold text-[#2C5F2D]">{summary.totalApprovedUsers}</strong>
        <span className="mt-0.5 text-xs text-[#6E776B]">usuários cadastrados</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#D9822B]" aria-hidden="true" />
          <span className="text-xs font-bold text-[#B86B19]">{pendingLabel}</span>
        </div>

        <Button
          type="button"
          label="Gerenciar usuários"
          onClick={onManageUsers}
          className="rounded-xl bg-[#2C5F2D] px-4 py-2.5 text-xs font-bold text-[#FAF8F3] shadow-none transition-colors hover:bg-[#234B24]"
        />
      </div>
    </article>
  );
}
