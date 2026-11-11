import Link from 'next/link';
import { FARM_STATUS_LABELS } from '@/app/api/api';
import { formatDate } from '@/lib/dashboard';
import { ArrowLeft } from '../core/Icons';
import { Select } from '../core/Select';
import type { Farm } from '@/types/farm';
import { StatusBadge } from './StatusBadge';
import { FARM_STATUS_TONES } from './parcelStatusStyles';

interface FarmOption {
  id: string;
  name: string;
}

interface DashboardFarmHeaderProps {
  farms: FarmOption[];
  selectedFarmId: string;
  onSelectFarm: (farmId: string) => void;
  farm: Farm | null;
}

export function DashboardFarmHeader({
  farms,
  selectedFarmId,
  onSelectFarm,
  farm,
}: DashboardFarmHeaderProps) {
  const details = farm
    ? [farm.location, farm.responsible, `início ${formatDate(farm.createdAt)}`].join(' · ')
    : '';

  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-[#D7D0C2] bg-white p-5 sm:p-6 lg:flex-row lg:items-center">
      <div className="w-full lg:max-w-sm">
        <Select
          label="Fazenda"
          value={selectedFarmId}
          onChange={(event) => onSelectFarm(event.target.value)}
          options={farms.map((option) => ({ value: option.id, label: option.name }))}
        />
      </div>

      {farm && (
        <>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-newsreader text-2xl font-semibold text-verde-mata sm:text-3xl">
                {farm.name}
              </h2>
              <StatusBadge
                label={FARM_STATUS_LABELS[farm.status]}
                tone={FARM_STATUS_TONES[farm.status]}
              />
            </div>
            <p className="text-sm text-[#848079]">{details}</p>
          </div>

          <Link
            href={`/platform/fazendas/${encodeURIComponent(farm.farmId)}`}
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#B8CDB9] px-6 py-3 font-semibold text-verde-mata transition-colors hover:bg-verde-mata/5"
          >
            Abrir fazenda
            <ArrowLeft className="rotate-180" />
          </Link>
        </>
      )}
    </section>
  );
}
