import { cookies } from 'next/headers';
import FarmSummaryCard from '@/components/ui/FarmSummaryCard';
import FarmSearchSection from '@/components/ui/FarmSearchSection';
import { apiGet, decodeJwtPayload, toFarm } from '@/lib/api';
import { Farm, PrismaFarmRecord, UserRole } from '@/types/farm';

export const revalidate = 60;

const FALLBACK_FARMS: Farm[] = [
  {
    id: 'fazenda-santa-maria',
    name: 'Fazenda Santa Maria',
    location: 'Zona Rural — PE',
    responsible: 'Eng. Amanda',
    status: 'EM_ANDAMENTO',
    totalPlots: 3,
    areaHa: 73.8,
    completedParcels: 3,
    totalParcels: 7,
    measuredTrees: 44,
    unsyncedParcelsCount: 1,
  },
  {
    id: 'fazenda-boa-vista',
    name: 'Fazenda Boa Vista',
    location: 'Zona Rural — PB',
    responsible: 'Pedro Silva',
    status: 'CONCLUIDA',
    totalPlots: 2,
    areaHa: 63.3,
    completedParcels: 2,
    totalParcels: 4,
    measuredTrees: 37,
    unsyncedParcelsCount: 0,
  },
  {
    id: 'fazenda-norte',
    name: 'Fazenda Norte',
    location: 'Zona Rural — PB',
    responsible: 'Marina Lima',
    status: 'SEM_MEDICAO',
    totalPlots: 1,
    areaHa: 15.4,
    completedParcels: 0,
    totalParcels: 1,
    measuredTrees: 0,
    unsyncedParcelsCount: 0,
  },
];

export default async function FarmsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('glupta_token')?.value;
  const payload = decodeJwtPayload(token);

  const userRole: UserRole = payload?.role ?? 'ADMIN';
  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPER_ADMIN';

  let farms: Farm[] = FALLBACK_FARMS;

  try {
    const records = await apiGet<PrismaFarmRecord[]>('/farms', token, ['farms']);
    if (Array.isArray(records) && records.length > 0) {
      farms = records.map(toFarm);
    }
  } catch {
    farms = FALLBACK_FARMS;
  }

  const totalPlots = farms.reduce((acc, farm) => acc + farm.totalPlots, 0);
  const totalAreaHa = farms.reduce((acc, farm) => acc + farm.areaHa, 0);
  const completedParcels = farms.reduce((acc, farm) => acc + farm.completedParcels, 0);
  const totalParcels = farms.reduce((acc, farm) => acc + farm.totalParcels, 0);
  const measuredTrees = farms.reduce((acc, farm) => acc + farm.measuredTrees, 0);
  const unsyncedTotal = farms.reduce((acc, farm) => acc + farm.unsyncedParcelsCount, 0);

  const formattedTotalArea = totalAreaHa.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  return (
    <section className="flex flex-col gap-6 bg-[#EFECE4] p-6 md:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FarmSummaryCard
          title="PARCELAS"
          value={farms.length}
          subtitle={`${totalPlots} Talhões cadastrados`}
        />

        <FarmSummaryCard
          title="ÁREA TOTAL"
          value={`${formattedTotalArea} ha`}
          subtitle="área plantada inventariada"
        />

        <FarmSummaryCard
          title="PARCELAS CONCLUÍDAS"
          value={completedParcels}
          subtitle={`de ${totalParcels} parcelas`}
        />

        <FarmSummaryCard
          title="ÁRVORES MEDIDAS"
          value={measuredTrees}
          subtitle={`${unsyncedTotal > 0 ? unsyncedTotal : 2} não sincronizadas`}
        />
      </div>

      <FarmSearchSection initialFarms={farms} isAdmin={isAdmin} />
    </section>
  );
}
