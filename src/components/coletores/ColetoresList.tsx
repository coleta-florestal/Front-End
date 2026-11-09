'use client';

export type ColetorStatus = 'EM COLETA' | 'ONLINE' | 'OFFLINE';

export interface Coletor {
  id: string;
  nome: string;
  status: ColetorStatus;
}

interface ColetoresListProps {
  coletores: Coletor[];
  className?: string;
}

export function ColetoresList({ coletores, className = '' }: ColetoresListProps) {
  // Função para definir o estilo da badge dependendo do status
  const getBadgeStyles = (status: ColetorStatus) => {
    switch (status) {
      case 'EM COLETA':
      case 'ONLINE':
        return 'bg-white/20 text-white'; // Destaque mais claro
      case 'OFFLINE':
        return 'bg-black/15 text-white/70'; // Fundo mais escuro e texto menos opaco
      default:
        return 'bg-white/10 text-white/70';
    }
  };

  return (
    <div
      className={`bg-[#365D39] rounded-3xl p-6 sm:p-8 w-full max-w-md flex flex-col shadow-sm ${className}`}
    >
      {/* Cabeçalho */}
      <h2 className="text-white text-2xl md:text-3xl font-newsreader font-semibold mb-6">
        Coletores em campo
      </h2>

      {/* Lista com Scroll Vertical */}
      {/* max-h-[360px] define a altura máxima antes de começar a rolar. Pode ajustar conforme o seu layout */}
      <div className="flex-1 overflow-y-auto max-h-90 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <ul className="flex flex-col">
          {coletores.map((coletor) => (
            <li
              key={coletor.id}
              className="flex items-center justify-between py-4 border-b border-white/10 last:border-b-0"
            >
              <span className="text-white text-[17px]">{coletor.nome}</span>

              <span
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${getBadgeStyles(coletor.status)}`}
              >
                {coletor.status}
              </span>
            </li>
          ))}

          {coletores.length === 0 && (
            <li className="py-8 text-center text-white/60">Nenhum coletor em campo no momento.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
