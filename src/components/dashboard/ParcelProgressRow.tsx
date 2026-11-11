import { formatHectares, PARCEL_STATUS_LABELS } from '@/lib/dashboard';
import type { DashboardParcel } from '@/types/dashboard.ts';
import { StatusBadge } from './StatusBadge';
import { PARCEL_STATUS_BAR_COLORS, PARCEL_STATUS_TONES } from './parcelStatusStyles';

interface ParcelProgressRowProps {
  parcel: DashboardParcel;
  showPlotName?: boolean;
}

export function ParcelProgressRow({ parcel, showPlotName = false }: ParcelProgressRowProps) {
  const progress =
    parcel.targetTrees > 0
      ? Math.min(Math.round((parcel.measuredTrees / parcel.targetTrees) * 100), 100)
      : 0;
  const area = `Área ${formatHectares(parcel.areaHa)}`;

  return (
    <li className="flex flex-col gap-3 rounded-2xl border border-[#E3DCD0] bg-[#FAF8F3] px-5 py-4 md:flex-row md:items-center md:gap-6">
      <div className="flex flex-col md:w-44 md:shrink-0">
        <h3 className="font-newsreader text-xl font-semibold text-verde-mata">
          Parcela {parcel.name}
        </h3>
        <span className="text-sm text-[#848079]">
          {showPlotName ? `${parcel.plotName} · ${area}` : area}
        </span>
      </div>

      <div className="flex md:w-36 md:shrink-0">
        <StatusBadge
          label={PARCEL_STATUS_LABELS[parcel.status]}
          tone={PARCEL_STATUS_TONES[parcel.status]}
        />
      </div>

      <div
        role="progressbar"
        aria-label={`Progresso da parcela ${parcel.name}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="h-2 w-full overflow-hidden rounded-full bg-[#EBE7DF] md:flex-1"
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${PARCEL_STATUS_BAR_COLORS[parcel.status]}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="whitespace-nowrap text-sm text-[#848079] md:w-28 md:text-right">
        {parcel.measuredTrees} de {parcel.targetTrees} árvores
      </span>
    </li>
  );
}
