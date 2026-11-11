import { Edit, Trash } from '../core/Icons';

export interface TalhaoCardProps {
  nome: string;
  status: string;
  area: string;
  plantio: string | number;
  parcelasConcluidas: number;
  parcelasTotais: number;
  progresso: number;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function TalhaoSummary({
  nome,
  status,
  area,
  plantio,
  parcelasConcluidas,
  parcelasTotais,
  progresso,
  isAdmin,
  onEdit,
  onDelete,
}: TalhaoCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-[#E3DCD0] p-6 w-full max-w-sm shadow-sm">
      <div className="flex items-center mb-4 gap-2.5 justify-between md:self-center">
        {isAdmin && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              aria-label={`Editar ${nome}`}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#B8CDB9] bg-transparent transition-colors hover:bg-[#E4EDE2]"
            >
              <Edit size={18} color="#2C5F2D" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              aria-label={`Excluir ${nome}`}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5B8AD] bg-transparent transition-colors hover:bg-[#FBECE8]"
            >
              <Trash size={18} color="#A64B35" />
            </button>
          </>
        )}
      </div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 className="text-[#245225] font-semibold text-3xl font-newsreader">{nome}</h2>
        <span className="bg-[#FDF4E6] text-[#A06E22] border border-[#E8D1B1] rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
          {status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#F5F3ED] rounded-xl p-3 flex flex-col justify-center">
          <span className="text-[#7A7A7A] text-[10px] font-bold uppercase tracking-widest mb-1">
            Área
          </span>
          <p className="text-[#245225] text-lg font-bold">{area}</p>
        </div>

        <div className="bg-[#F5F3ED] rounded-xl p-3 flex flex-col justify-center">
          <span className="text-[#7A7A7A] text-[10px] font-bold uppercase tracking-widest mb-1">
            Plantio
          </span>
          <p className="text-[#245225] text-lg font-bold">{plantio}</p>
        </div>

        <div className="bg-[#F5F3ED] rounded-xl p-3 flex flex-col justify-center">
          <span className="text-[#7A7A7A] text-[10px] font-bold uppercase tracking-widest mb-1">
            Parcelas
          </span>
          <p className="text-[#245225] text-lg font-bold">
            {parcelasConcluidas}/{parcelasTotais}
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="w-full h-2.5 bg-[#EBE7DF] rounded-full overflow-hidden mb-2.5">
          <div
            className="bg-[#D46B3E] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(Math.max(progresso, 0), 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
