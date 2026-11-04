import Button from '@/components/core/Button';
import { AdminPlotsSummary } from '@/types/admin';

interface AdminPlotsSummaryCardProps {
  summary: AdminPlotsSummary;
  onViewPlots: () => void;
}

export default function AdminPlotsSummaryCard({
  summary,
  onViewPlots,
}: AdminPlotsSummaryCardProps) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-[#E2DDD2] bg-[#FAF8F3] p-6 shadow-sm">
      <div className="flex items-center gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E4EDE2] text-[#2C5F2D]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 20h10M12 20v-8M12 12C12 7 7 4 3 4c0 4 3 8 9 8Zm0 0c0-5 4-8 9-8 0 4-3 8-9 8Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-[#232922]">TALHÕES</span>
          <span className="text-xs text-[#6E776B]">Registros coletados pela turma</span>
        </div>
      </div>

      <div className="my-4 flex flex-col">
        <strong className="text-4xl font-bold text-[#2C5F2D]">
          {summary.totalRegisteredParcels}
        </strong>
        <span className="mt-0.5 text-xs text-[#6E776B]">Parcelas cadastradas</span>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#2C5F2D]" aria-hidden="true" />
            <span className="text-xs font-bold text-[#2C5F2D]">
              {summary.processedCount} processadas
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#D9822B]" aria-hidden="true" />
            <span className="text-xs font-bold text-[#B86B19]">
              {summary.pendingCount} pendentes
            </span>
          </div>
        </div>

        <Button
          type="button"
          label="Ver talhões"
          onClick={onViewPlots}
          className="rounded-xl bg-[#2C5F2D] px-4 py-2.5 text-xs font-bold text-[#FAF8F3] shadow-none transition-colors hover:bg-[#234B24]"
        />
      </div>
    </article>
  );
}
