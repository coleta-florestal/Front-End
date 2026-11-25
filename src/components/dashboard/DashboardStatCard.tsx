interface DashboardStatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
}

export function DashboardStatCard({ label, value, subtitle }: DashboardStatCardProps) {
  return (
    <article className="flex flex-col rounded-3xl border border-[#D7D0C2] bg-white p-5 sm:p-6">
      <span className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[#848079]">
        {label}
      </span>
      <strong className="mb-2 whitespace-nowrap font-newsreader text-3xl font-semibold text-verde-mata sm:text-4xl min-[1400px]:text-5xl">
        {value}
      </strong>
      <span className="text-sm text-[#848079]">{subtitle}</span>
    </article>
  );
}
