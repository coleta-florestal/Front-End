'use client';

import { TreeData } from './TreeForm';
import { Cloud, Trash } from '../core/Icons';

export interface TreeCardProps {
  tree: TreeData;
  onRemove?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function TreeCard({ tree, onRemove, onEdit }: TreeCardProps) {
  const formatNumber = (value: string) =>
    parseFloat(value.replace(',', '.')).toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

  return (
    <div className="bg-creme-flor rounded-2xl border border-[#D7D0C2] p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="bg-verde-mata text-creme-flor px-3 py-1 rounded-lg font-mono text-sm font-semibold">
            Nº {tree.numero}
          </span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              tree.qualidade === 'NORMAL'
                ? 'bg-verde-eucalipto/20 text-verde-mata'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {tree.qualidade.charAt(0).toUpperCase() + tree.qualidade.slice(1).toLowerCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(tree.id)}
              className="p-1.5 text-marrom-casca/60 hover:text-marrom-casca hover:bg-creme-flor/80 rounded-lg transition-colors"
              title="Editar árvore"
              aria-label="Editar árvore"
            >
              <Cloud className="w-4 h-4" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={() => onRemove(tree.id)}
              className="p-1.5 border border-[#D7D0C2] text-marrom-casca/60 hover:text-marrom-casca hover:bg-creme-flor/80 rounded-lg transition-colors"
              title="Remover árvore"
              aria-label="Remover árvore"
            >
              <Trash className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-verde-mata/70">DAP</span>
          <span className="font-mono font-semibold text-verde-mata">
            {formatNumber(tree.dap)} cm
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-verde-mata/70">Altura</span>
          <span className="font-mono font-semibold text-verde-mata">
            {formatNumber(tree.altura)} m
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-verde-mata/70">Obs.</span>
          <span className="text-verde-mata/70">{tree.observacoes || '—'}</span>
        </div>
      </div>
    </div>
  );
}
export type { TreeData };
