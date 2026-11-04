import { SubPlotVolumeItem } from '@/types/farm';

interface SubPlotVolumeCardProps {
  data: SubPlotVolumeItem[];
}

function formatAxisVolume(value: number): string {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });
}

export default function SubPlotVolumeCard({ data }: SubPlotVolumeCardProps) {
  const maxVolume = data.reduce((max, item) => Math.max(max, item.volumeM3), 0);
  const midVolume = maxVolume / 2;

  return (
    <article className="flex flex-col justify-between rounded-2xl bg-[#2C5F2D] p-6 shadow-sm">
      <h3 className="font-serif text-lg font-bold text-[#FAF8F3]">Volume por parcela</h3>

      {data.length > 0 ? (
        <div className="mt-10 flex h-36 items-stretch gap-3">
          <div
            aria-hidden="true"
            className="flex flex-col justify-between border-r border-[#FAF8F3]/20 pr-2.5 text-right text-[11px] font-medium leading-none text-[#FAF8F3]/75"
          >
            <span>{formatAxisVolume(maxVolume)} m³</span>
            <span>{formatAxisVolume(midVolume)} m³</span>
            <span>0 m³</span>
          </div>

          <div className="flex flex-1 items-end gap-3 pl-1">
            {data.map((item) => {
              const isMax = maxVolume > 0 && item.volumeM3 === maxVolume;
              const heightPercent =
                maxVolume > 0 ? Math.max(15, Math.round((item.volumeM3 / maxVolume) * 100)) : 15;
              const formattedVolume = item.volumeM3.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              });
              const label = `${item.plotName} · Parcela ${item.subPlotName}`;

              return (
                <div
                  key={item.id}
                  tabIndex={0}
                  aria-label={`${label}: ${formattedVolume} metros cúbicos`}
                  className="group relative flex h-full cursor-pointer items-end focus:outline-none"
                >
                  <div className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#1A381B] px-2.5 py-1 text-xs font-semibold text-[#FAF8F3] opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus:opacity-100">
                    {label}: {formattedVolume} m³
                  </div>

                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-2.5 rounded-t-md transition-all duration-200 ease-out group-hover:w-4 group-hover:brightness-110 group-focus:w-4 group-focus:brightness-110 ${
                      isMax ? 'bg-[#F17C38]' : 'bg-[#8CA889]'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-10 flex h-36 items-center justify-center">
          <span className="text-xs text-[#FAF8F3]/70">Nenhuma parcela medida</span>
        </div>
      )}
    </article>
  );
}
