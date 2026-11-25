import { DiametricClassItem } from '@/types/farm';

interface DiametricDistributionCardProps {
  data: DiametricClassItem[];
}

export default function DiametricDistributionCard({ data }: DiametricDistributionCardProps) {
  const maxTreeCount = data.reduce((max, item) => Math.max(max, item.treeCount), 0);
  const midTreeCount = Math.round(maxTreeCount / 2);

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-[#E2DDD2] bg-white p-6 shadow-sm">
      <h3 className="font-serif text-lg font-bold text-[#2C5F2D]">Distribuição diamétrica</h3>

      {data.length > 0 ? (
        <div className="mt-10 flex h-36 items-stretch gap-3">
          <div
            aria-hidden="true"
            className="flex flex-col justify-between border-r border-[#E2DDD2] pr-2.5 text-right text-[11px] font-medium leading-none text-[#6E776B]"
          >
            <span>{maxTreeCount} árv.</span>
            <span>{midTreeCount} árv.</span>
            <span>0 árv.</span>
          </div>

          <div className="flex flex-1 items-end gap-3 pl-1">
            {data.map((item) => {
              const isPeak = maxTreeCount > 0 && item.treeCount === maxTreeCount;
              const heightPercent =
                maxTreeCount > 0
                  ? Math.max(15, Math.round((item.treeCount / maxTreeCount) * 100))
                  : 15;
              const formattedVolume = item.volumeM3.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              const treeLabel = item.treeCount === 1 ? 'árvore' : 'árvores';

              return (
                <div
                  key={item.id}
                  tabIndex={0}
                  aria-label={`DAP ${item.rangeLabel}: ${item.treeCount} ${treeLabel}, ${formattedVolume} metros cúbicos`}
                  className="group relative flex h-full cursor-pointer items-end focus:outline-none"
                >
                  <div className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#2C5F2D] px-2.5 py-1 text-xs font-semibold text-[#FAF8F3] opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                    {item.rangeLabel}: {item.treeCount} {treeLabel} ({formattedVolume} m³)
                  </div>

                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-2.5 rounded-t-md transition-all duration-200 ease-out group-hover:w-4 group-hover:brightness-95 group-focus:w-4 group-focus:brightness-95 ${
                      isPeak ? 'bg-[#2C5F2D]' : 'bg-[#84A58D]'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-10 flex h-36 items-center justify-center">
          <span className="text-xs text-[#6E776B]">Nenhuma árvore medida</span>
        </div>
      )}
    </article>
  );
}
