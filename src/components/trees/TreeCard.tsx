'use client';

import { QUALIDADE_OPTIONS, TreeData } from './TreeForm';
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

  const qualidadeLabel =
    QUALIDADE_OPTIONS.find((option) => option.value === tree.qualidade)?.label ?? tree.qualidade;
  const sincronizada = tree.sincronizada !== false;
  const sincronizacaoLabel = sincronizada ? 'Árvore sincronizada' : 'Sincronização pendente';

  return (
    <div
      className="bg-[#FAF7F0] rounded-xl border border-[#E7E2D8] p-4 cursor-pointer hover:bg-creme-flor transition-colors"
      onClick={() => onView?.(tree)}
    >
      <div className="flex items-center justify-between gap-2 border-b border-[#E7E2D8] pb-2 mb-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 bg-[#E8F0EA] text-verde-mata px-2 py-0.5 rounded-md font-newsreader text-lg font-semibold">
            Nº {tree.numero}
          </span>
          <span className="truncate rounded-full bg-[#E8F0EA] px-3 py-0.5 text-xs font-bold text-verde-mata">
            {qualidadeLabel}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span title={sincronizacaoLabel} aria-label={sincronizacaoLabel} role="img">
            <Cloud size={18} color={sincronizada ? '#2C5F2D' : '#C98A2B'} />
          </span>
          {onEdit && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                onEdit(tree.id);
              }}
              className="p-1.5 text-marrom-casca/60 hover:text-marrom-casca hover:bg-creme-flor/80 rounded-lg transition-colors"
              title="Editar árvore"
              aria-label="Editar árvore"
            >
              <Cloud className="w-4 h-4" />
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onRemove(tree);
              }}
              className="p-1.5 border border-coral-flor/50 bg-white hover:bg-[#FBECE8] rounded-lg transition-colors cursor-pointer"
              title="Remover árvore"
              aria-label="Remover árvore"
            >
              <Trash size={16} color="#A96A50" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between gap-3 text-sm">
          <span className="text-[#6D786E]">DAP</span>
          <span className="font-semibold text-[#2F3A30]">{formatNumber(tree.dap)} cm</span>
        </div>
        <div className="flex justify-between gap-3 text-sm">
          <span className="text-[#6D786E]">Altura</span>
          <span className="font-semibold text-[#2F3A30]">{formatNumber(tree.altura)} m</span>
        </div>
        <div className="flex justify-between gap-3 text-sm">
          <span className="text-[#6D786E]">Obs.</span>
          <span className="text-right text-[#6D786E]">{tree.observacoes || '—'}</span>
        </div>
      </div>
    </div>
  );
}
export type { TreeData };
