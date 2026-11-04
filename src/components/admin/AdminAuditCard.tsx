import { AdminAuditEntry } from '@/types/admin';

interface AdminAuditCardProps {
  entries: AdminAuditEntry[];
}

export default function AdminAuditCard({ entries }: AdminAuditCardProps) {
  return (
    <article className="flex flex-col rounded-2xl border border-[#E2DDD2] bg-[#FAF8F3] p-6 shadow-sm">
      <h3 className="font-serif text-lg font-bold text-[#2C5F2D]">Auditoria</h3>

      <div className="mt-4 flex flex-col divide-y divide-[#E5E0D5]">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="grid grid-cols-[75px_1fr] items-start gap-3 py-3.5 first:pt-1 last:pb-1"
          >
            <span className="text-xs text-[#8C9289]">{entry.timestamp}</span>

            <p className="text-xs leading-relaxed text-[#3B4439]">
              <strong className="font-semibold text-[#232922]">{entry.actorName}</strong>{' '}
              {entry.actionText}{' '}
              <strong className="font-semibold text-[#232922]">{entry.targetText}</strong>
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
