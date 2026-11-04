import Link from 'next/link';
import { House, Trash, Edit } from '@/components/core/Icons';
import { Farm, FarmStatus } from '@/types/farm';

interface FarmListCardProps {
  farm: Farm;
  isAdmin: boolean;
  onEdit?: (farm: Farm) => void;
  onDelete?: (farm: Farm) => void;
}

const STATUS_STYLES: Record<
  FarmStatus,
  { label: string; badgeClass: string; progressBarClass: string }
> = {
  EM_ANDAMENTO: {
    label: 'EM ANDAMENTO',
    badgeClass: 'border-[#E5D3AD] bg-[#F6EEDB] text-[#7A5A20]',
    progressBarClass: 'bg-[#C8644B]',
  },
  CONCLUIDA: {
    label: 'CONCLUÍDA',
    badgeClass: 'border-[#B8D8BE] bg-[#E4F0E6] text-[#2C5F2D]',
    progressBarClass: 'bg-[#2C5F2D]',
  },
  SEM_MEDICAO: {
    label: 'SEM MEDIÇÃO',
    badgeClass: 'border-[#D7D0C2] bg-[#EAE6DF] text-[#6E6A63]',
    progressBarClass: 'bg-transparent',
  },
};

export default function FarmListCard({ farm, isAdmin, onEdit, onDelete }: FarmListCardProps) {
  const statusConfig = STATUS_STYLES[farm.status];

  const progressPercentage =
    farm.totalParcels > 0
      ? Math.min(100, Math.round((farm.completedParcels / farm.totalParcels) * 100))
      : 0;

  const plotLabel = farm.totalPlots === 1 ? 'talhão' : 'talhões';
  const actionLabel = farm.status === 'CONCLUIDA' ? 'Resultados' : 'Ver talhões';
  const formattedArea = farm.areaHa.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  return (
    <article className="flex flex-col justify-between gap-4 rounded-2xl border border-[#E2DDD2] bg-[#FAF8F3] px-6 py-5 shadow-sm transition-shadow hover:shadow-md md:flex-row md:items-center">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#E4EDE2]">
          <House size={22} color="#2C5F2D" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-serif text-xl font-bold text-[#2C5F2D]">{farm.name}</h2>

            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${statusConfig.badgeClass}`}
            >
              {statusConfig.label}
            </span>
          </div>

          <p className="text-sm text-[#6E776B]">
            {farm.location} · {farm.totalPlots} {plotLabel} · {formattedArea} ha ·{' '}
            {farm.responsible}
          </p>

          <div className="mt-1.5 flex flex-col gap-1">
            <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-[#E5E0D5]">
              <div
                className={`h-full rounded-full transition-all duration-300 ${statusConfig.progressBarClass}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <span className="text-xs text-[#6E776B]">
              {farm.completedParcels} de {farm.totalParcels} parcelas concluídas ·{' '}
              {farm.measuredTrees} árvores
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 self-end md:self-center">
        {isAdmin && (
          <>
            <button
              type="button"
              onClick={() => onDelete?.(farm)}
              aria-label={`Excluir ${farm.name}`}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5B8AD] bg-transparent transition-colors hover:bg-[#FBECE8]"
            >
              <Trash size={18} color="#A64B35" />
            </button>

            <button
              type="button"
              onClick={() => onEdit?.(farm)}
              aria-label={`Editar ${farm.name}`}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#B8CDB9] bg-transparent transition-colors hover:bg-[#E4EDE2]"
            >
              <Edit size={18} color="#2C5F2D" />
            </button>
          </>
        )}

        <Link
          href={`/platform/fazendas/${farm.id}`}
          className="flex h-10 items-center gap-2 rounded-xl border border-[#B8CDB9] bg-transparent px-4 text-sm font-bold text-[#2C5F2D] transition-colors hover:bg-[#E4EDE2]"
        >
          <span>{actionLabel}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
