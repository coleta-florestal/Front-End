export interface TalhaoCardProps {
  nome: string;
  status: string;
  localizacao: string;
  responsavel: string;
  inicio: string;
  parcelas: number;
  concluidas: number;
  arvores: number;
  progresso: number;
}

export function TalhaoCard({
  nome,
  status,
  localizacao,
  responsavel,
  inicio,
  parcelas,
  concluidas,
  arvores,
  progresso,
}: TalhaoCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#D7D0C2] p-6">
      <div className="flex flex-col items-center lg:flex-row lg:justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-verde-mata font-semibold text-2xl lg:text-4xl leading-tight font-newsreader">
              {nome}
            </h2>
            <span className="bg-creme-flor text-verde-mata rounded-full px-3 py-1 text-xs font-semibold uppercase whitespace-nowrap">
              {status}
            </span>
          </div>
          <p className="text-verde-eucalipto text-sm leading-relaxed">
            {localizacao} · {responsavel} · início {inicio}
          </p>
        </div>

        <div className="lg:flex flex-wrap lg:justify-end justify-between gap-8 grid grid-cols-2 lg:gap-8 text-right lg:text-left">
          <div>
            <span className="text-verde-eucalipto/60 text-md font-bold uppercase tracking-wider block">
              Parcelas
            </span>
            <p className="text-verde-mata text-2xl font-semibold font-newsreader">{parcelas}</p>
          </div>
          <div>
            <span className="text-verde-eucalipto/60 text-md font-bold uppercase tracking-wider block">
              Concluídas
            </span>
            <p className="text-verde-mata text-2xl font-semibold font-newsreader">{concluidas}</p>
          </div>
          <div>
            <span className="text-verde-eucalipto/60 text-md font-bold uppercase tracking-wider block">
              Árvores
            </span>
            <p className="text-verde-mata text-2xl font-semibold font-newsreader">{arvores}</p>
          </div>
          <div>
            <span className="text-verde-eucalipto/60 text-md font-bold uppercase tracking-wider block">
              Progresso
            </span>
            <p className="text-verde-mata text-2xl font-semibold font-newsreader">{progresso}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
