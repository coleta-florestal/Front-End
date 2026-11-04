import Button from '@/components/core/Button';
import { AdminRecentPlotItem, RecentPlotStatus } from '@/types/admin';

interface AdminRecentPlotsCardProps {
  items: AdminRecentPlotItem[];
  updatedAgoText: string;
  onViewAll: () => void;
}

const STATUS_BADGE_STYLES: Record<RecentPlotStatus, string> = {
  PROCESSADA: 'border-[#B8D8BE] bg-[#E4F0E6] text-[#2C5F2D]',
  PENDENTE: 'border-[#E5C99B] bg-[#FAF3E6] text-[#9E6B1E]',
};

export default function AdminRecentPlotsCard({
  items,
  updatedAgoText,
  onViewAll,
}: AdminRecentPlotsCardProps) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-[#E2DDD2] bg-[#FAF8F3] p-6 shadow-sm">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-[#2C5F2D]">Talhões recentes</h3>
            <p className="mt-0.5 text-xs text-[#6E776B]">Últimos registros adicionados à turma.</p>
          </div>

          <Button
            type="button"
            label="Ver todas"
            onClick={onViewAll}
            className="rounded-xl border border-[#B8CDB9] bg-white px-4 py-1.5 text-xs font-bold text-[#2C5F2D] shadow-none transition-colors hover:bg-[#E4EDE2]"
          />
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5E0D5] text-[11px] font-bold uppercase tracking-wider text-[#6E776B]">
                <th className="pb-2.5 font-bold">IDENTIFICAÇÃO</th>
                <th className="pb-2.5 font-bold">RESPONSÁVEL</th>
                <th className="pb-2.5 text-right font-bold">STATUS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E0D5]">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 pr-2">
                    <div className="flex flex-col">
                      <strong className="font-bold text-[#232922]">{item.code}</strong>
                      <span className="text-[11px] text-[#6E776B]">{item.locationLabel}</span>
                    </div>
                  </td>

                  <td className="py-3 pr-2 font-bold text-[#232922]">{item.responsible}</td>

                  <td className="py-3 text-right">
                    <span
                      className={`inline-block rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        STATUS_BADGE_STYLES[item.status]
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <span className="mt-4 block text-[11px] text-[#8C9289]">{updatedAgoText}</span>
    </article>
  );
}
