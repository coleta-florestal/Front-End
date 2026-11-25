import type { DashboardParcel } from '@/types/dashboard.ts';
import { ParcelProgressRow } from './ParcelProgressRow';

interface ParcelProgressListProps {
  parcels: DashboardParcel[];
  showPlotName?: boolean;
}

export function ParcelProgressList({ parcels, showPlotName = false }: ParcelProgressListProps) {
  return (
    <section className="flex flex-col rounded-3xl border border-[#D7D0C2] bg-white p-5 sm:p-6">
      <h2 className="mb-5 font-newsreader text-[22px] font-semibold text-verde-mata">
        Progresso das parcelas
      </h2>

      {parcels.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {parcels.map((parcel) => (
            <ParcelProgressRow key={parcel.id} parcel={parcel} showPlotName={showPlotName} />
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#848079]">Nenhuma parcela cadastrada nesta fazenda.</p>
      )}
    </section>
  );
}
