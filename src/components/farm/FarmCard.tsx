export interface FarmCardProps {
  nome: string;
  status: string;
  localizacao: string;
  responsavel: string;
  talhoes: number;
  areaTotal: string;
  parcelasConcluidas: number;
  parcelasTotais: number;
  arvores: number;
}

export function FarmCard({
  nome,
  status,
  localizacao,
  responsavel,
  talhoes,
  areaTotal,
  parcelasConcluidas,
  parcelasTotais,
  arvores,
}: FarmCardProps) {
  return (
    <div className="bg-white rounded-[20px] border border-[#E3DCD0] p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <h2 className="text-[#245225] font-semibold text-2xl md:text-3xl font-newsreader">
              {nome}
            </h2>
            <span className="bg-[#FDF4E6] text-[#A06E22] border border-[#E8D1B1] rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
              {status}
            </span>
          </div>
          <p className="text-[#848079] text-sm font-medium">
            {localizacao} · responsável {responsavel}
          </p>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-8 md:gap-12">
          <div className="flex flex-col">
            <span className="text-[#848079] text-[10px] font-bold uppercase tracking-widest mb-1">
              Talhões
            </span>
            <p className="text-[#245225] text-2xl font-semibold font-newsreader">{talhoes}</p>
          </div>

          <div className="flex flex-col">
            <span className="text-[#848079] text-[10px] font-bold uppercase tracking-widest mb-1">
              Área Total
            </span>
            <p className="text-[#245225] text-2xl font-semibold font-newsreader">{areaTotal}</p>
          </div>

          <div className="flex flex-col">
            <span className="text-[#848079] text-[10px] font-bold uppercase tracking-widest mb-1">
              Parcelas
            </span>
            <p className="text-[#245225] text-2xl font-semibold font-newsreader">
              {parcelasConcluidas}/{parcelasTotais}
            </p>
          </div>

          <div className="flex flex-col">
            <span className="text-[#848079] text-[10px] font-bold uppercase tracking-widest mb-1">
              Árvores
            </span>
            <p className="text-[#245225] text-2xl font-semibold font-newsreader">{arvores}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
