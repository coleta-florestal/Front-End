interface FarmSummaryCardProps {
  title: string;
  value: string | number;
  subtitle: string;
}

export default function FarmSummaryCard({ title, value, subtitle }: FarmSummaryCardProps) {
  return (
    <article className="flex flex-col justify-between rounded-2xl border border-[#E2DDD2] bg-[#FAF8F3] p-5 shadow-sm">
      <span className="text-xs font-bold uppercase tracking-wider text-[#6E776B]">{title}</span>

      <strong className="my-2 font-serif text-4xl font-bold text-[#2C5F2D]">{value}</strong>

      <span className="text-xs text-[#6E776B]">{subtitle}</span>
    </article>
  );
}
