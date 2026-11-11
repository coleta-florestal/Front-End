import { PARCEL_STATUS_LABELS } from '@/lib/dashboard';
import type { DashboardParcel } from '@/types/dashboard.ts';
import { PARCEL_STATUS_BAR_COLORS } from './parcelStatusStyles';

const CHART_HEIGHT_PX = 188;
const MIN_BAR_HEIGHT_PX = 12;

interface TreesPerParcelChartProps {
  parcels: DashboardParcel[];
  showPlotName?: boolean;
}

export function TreesPerParcelChart({ parcels, showPlotName = false }: TreesPerParcelChartProps) {
  const maxTrees = parcels.reduce((max, parcel) => Math.max(max, parcel.measuredTrees), 0);

  return (
    <section className="flex flex-col rounded-3xl border border-[#D7D0C2] bg-white p-5 sm:p-6">
      <h2 className="font-newsreader text-[22px] font-semibold text-verde-mata">
        Árvores por parcela
      </h2>
      <p className="mt-1 text-sm text-[#848079]">Cor indica o estado da parcela.</p>

      {parcels.length > 0 ? (
        <ul className="mt-6 flex items-end gap-4 overflow-x-auto pb-2 sm:gap-5">
          {parcels.map((parcel) => {
            const barHeight =
              maxTrees > 0
                ? Math.max(MIN_BAR_HEIGHT_PX, (parcel.measuredTrees / maxTrees) * CHART_HEIGHT_PX)
                : MIN_BAR_HEIGHT_PX;
            const name = `Parcela ${parcel.name}`;
            const description = showPlotName ? `${parcel.plotName} · ${name}` : name;

            return (
              <li
                key={parcel.id}
                aria-label={`${description}: ${parcel.measuredTrees} árvores, ${PARCEL_STATUS_LABELS[parcel.status].toLowerCase()}`}
                className="flex w-24 shrink-0 flex-col items-center gap-2 sm:w-29.5"
              >
                <span className="text-sm font-bold text-verde-mata">{parcel.measuredTrees}</span>
                <div
                  className="flex w-full items-end"
                  style={{ height: `${CHART_HEIGHT_PX}px` }}
                  aria-hidden="true"
                >
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${PARCEL_STATUS_BAR_COLORS[parcel.status]}`}
                    style={{ height: `${barHeight}px` }}
                  />
                </div>
                <span
                  className="w-full truncate text-center text-xs text-[#848079]"
                  title={description}
                >
                  {name}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-[#848079]">Sem dados para o gráfico.</p>
      )}
    </section>
  );
}
