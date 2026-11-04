import { MapPin } from '../core/Icons';
import Button from '../core/Button';

export interface ParcelCardProps {
  numero: string;
  area: string;
  formato?: string; // Adicionado para bater com "Formato: Retangular" da imagem
  statusLabel: string;
  syncStatus?: 'SINCRONIZADA' | 'NÃO SINCRONIZADA'; // Adicionado para a segunda tag
  dimensoes: string;
  talhao: string;
  arvoresMedidas: number;
  metaReferencia: number;
  descricaoRodape: string;
  onAddTrees: () => void;
}

export function ParcelCard({
  numero,
  area,
  formato = 'Retangular',
  statusLabel,
  dimensoes,
  talhao,
  arvoresMedidas,
  metaReferencia,
  descricaoRodape,
  onAddTrees,
}: ParcelCardProps) {
  const percentual = Math.min((arvoresMedidas / metaReferencia) * 100, 100);

  return (
    <div className="bg-white rounded-3xl border border-[#D7D0C2] overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row justify-between gap-6">
        <div className="flex gap-4">
          <div className="shrink-0 w-12 h-12 bg-[#F2F4F2] rounded-xl flex items-center justify-center text-verde-mata">
            <MapPin className="w-6 h-6" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-verde-mata font-semibold text-xl lg:text-[22px] leading-tight font-newsreader">
              Parcela {numero} – Área: {area} – Formato: {formato}
            </h2>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="bg-[#FDF4E6] text-[#A06E22] border border-[#E8D1B1] rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {statusLabel}
              </span>

              <span className="text-[#848079] text-sm ml-1">
                {dimensoes} · {talhao}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:items-end min-w-60">
          <span className="text-[#848079] text-[10px] font-bold uppercase tracking-widest mb-0.5">
            Árvores Medidas
          </span>
          <p className="text-verde-mata text-2xl font-semibold font-newsreader mb-2">
            {arvoresMedidas} árvores registradas
          </p>

          <div className="w-full h-1.5 bg-[#EBE7DF] rounded-full overflow-hidden mb-1.5">
            <div
              className="bg-[#ED7D4D] h-full rounded-full transition-all duration-500"
              style={{ width: `${percentual}%` }}
            />
          </div>

          <p className="text-[#848079] text-[11px]">meta de referência: {metaReferencia} árvores</p>
        </div>
      </div>

      <div className="bg-[#FAFAF8] border-t border-[#D7D0C2] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-[#59554D] text-sm font-medium">{descricaoRodape}</p>
        <Button
          label="+ Adicionar Árvores"
          onClick={onAddTrees}
          className="w-full sm:w-auto bg-[#ED7D4D] text-white border-transparent hover:bg-[#D46B3E] rounded-xl px-6 py-2.5 font-semibold text-sm transition-colors whitespace-nowrap"
        />
      </div>
    </div>
  );
}
