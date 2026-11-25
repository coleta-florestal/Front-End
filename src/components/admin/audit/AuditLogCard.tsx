export interface AuditLogEntry {
  id: string;
  date: string;
  description: string;
}

interface AuditLogCardProps {
  logs: AuditLogEntry[];
}

export default function AuditLogCard({ logs }: AuditLogCardProps) {
  return (
    <article className="flex w-full flex-col rounded-2xl border border-[#DFDBD0] bg-white p-6 shadow-sm sm:p-8">
      <header className="mb-4 pb-2">
        <h2 className="font-serif text-2xl font-bold text-[#2C5F2D]">Auditoria</h2>
      </header>

      <div className="flex flex-col">
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex flex-col gap-2 border-b border-[#E8E4DA] py-5 last:border-0 sm:flex-row sm:items-center sm:gap-12"
          >
            <span className="w-24 shrink-0 text-sm font-medium text-[#A3B1A4]">{log.date}</span>
            <span className="text-sm font-medium text-[#3B4439]">{log.description}</span>
          </div>
        ))}

        {logs.length === 0 && (
          <p className="py-4 text-sm font-medium text-[#6D786E]">
            Nenhuma ação registada até ao momento.
          </p>
        )}
      </div>
    </article>
  );
}
