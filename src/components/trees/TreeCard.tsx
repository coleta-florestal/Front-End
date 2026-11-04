'use client';

import { TreeData } from './TreeForm';
import { Cloud, Trash } from '../core/Icons';

export interface TreeCardProps {
  tree: TreeData;
  onRemove?: (tree: TreeData) => void;
  onEdit?: (id: string) => void;
  onView?: (tree: TreeData) => void;
}

export function TreeCard({ tree, onRemove, onEdit, onView }: TreeCardProps) {
  const formatNumber = (value: string) =>
    parseFloat(value.replace(',', '.')).toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

  return (
    <div
      className="bg-[#FCFAF8] rounded-[20px] border border-[#E3DCD0] p-4 cursor-pointer hover:bg-[#F5F2EC] transition-colors w-full max-w-95"
      onClick={() => onView?.(tree)}
    >
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E3DCD0]">
        <div className="flex items-center gap-3">
          <span className="bg-[#EBF2EA] text-verde-mata px-3 py-1.5 rounded-xl font-newsreader text-lg font-bold">
            Nº {tree.numero.toString().padStart(2, '0')}
          </span>

          <span className="bg-[#F0F5EF] text-[#245225] px-3 py-1 rounded-full text-[13px] font-bold">
            {tree.qualidade.charAt(0).toUpperCase() + tree.qualidade.slice(1).toLowerCase()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                onEdit(tree.id);
              }}
              className="p-1.5 text-[#B88746] hover:bg-[#F0EBE1] rounded-lg transition-colors"
              title="Sincronizar/Editar"
              aria-label="Sincronizar/Editar"
            >
              <Cloud className="w-5 h-5" />
            </button>
          )}

          {onRemove && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onRemove(tree);
              }}
              className="p-2 bg-[#FCEAE8] border border-[#F2C9C5] text-[#A66158] hover:bg-[#F5D8D5] rounded-xl transition-colors cursor-pointer"
              title="Remover árvore"
              aria-label="Remover árvore"
            >
              <Trash className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3.5 px-1">
        <div className="flex justify-between items-center text-[15px]">
          <span className="text-[#71766F] font-medium">DAP</span>
          <span className="font-bold text-verde-mata">{formatNumber(tree.dap)} cm</span>
        </div>

        <div className="flex justify-between items-center text-[15px]">
          <span className="text-[#71766F] font-medium">Altura</span>
          <span className="font-bold text-verde-mata">{formatNumber(tree.altura)} m</span>
        </div>

        <div className="flex justify-between items-start text-[15px] gap-4">
          <span className="text-[#71766F] font-medium whitespace-nowrap">Obs.</span>
          <span className="text-[#848079] text-right truncate">{tree.observacoes || '—'}</span>
        </div>
      </div>
    </div>
  );
}
export type { TreeData };
