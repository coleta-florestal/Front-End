'use client';

import { TreeData } from './TreeForm';
import { Trash, Tree, Edit } from '../core/Icons';

export interface TreeListProps {
  trees: TreeData[];
  onRemoveTree: (tree: TreeData) => void;
  onEditTree?: (tree: TreeData) => void;
  onViewTree?: (tree: TreeData) => void;
}

const QUALIDADE_LABELS: Record<string, string> = {
  NORMAL: 'Normal',
  'BIFURCADA_ACIMA_1.3M': 'Bifurcada acima de 1,3m',
  'BIFURCADA_ABAIXO_1.3M': 'Bifurcada abaixo de 1,3m',
  INCLINADA: 'Inclinada',
  MORTA: 'Morta',
  FALHA: 'Falha',
  PROBLEMAS_FITOSSANITARIOS: 'Problemas fitossanitários',
  QUEBRADA: 'Quebrada',
  OUTRO: 'Outro',
};

export function TreeList({ trees, onRemoveTree, onEditTree, onViewTree }: TreeListProps) {
  if (trees.length === 0) {
    return (
      <div className="bg-white rounded-xl p-10 text-center border border-verde-mata/10 border-dashed">
        <Tree className="w-16 h-16 text-verde-mata/30 mx-auto mb-4" />
        <p className="text-verde-mata/60 text-lg">Nenhuma árvore adicionada ao lote</p>
        <p className="text-verde-mata/40 text-sm mt-1">
          Preencha o formulário acima e clique em &ldquo;Adicionar ao Lote&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-verde-mata/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-verde-mata/10 bg-verde-mata/5">
        <h2 className="text-lg font-semibold text-verde-mata flex items-center gap-2">
          <Tree className="w-5 h-5" />
          Revisão do Lote ({trees.length} árvore{trees.length !== 1 ? 's' : ''})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-verde-mata/5 text-left text-sm font-semibold text-verde-mata/80">
              <th className="px-4 py-3 w-16">Nº</th>
              <th className="px-4 py-3">DAP (cm)</th>
              <th className="px-4 py-3">Altura (m)</th>
              <th className="px-4 py-3">Qualidade</th>
              <th className="px-4 py-3">Observações</th>
              <th className="px-4 py-3 w-24 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-verde-mata/10">
            {trees.map((tree) => (
              <tr
                key={tree.id}
                className="cursor-pointer hover:bg-verde-mata/5 transition-colors"
                onClick={() => onViewTree?.(tree)}
              >
                <td className="px-4 py-3 font-mono text-verde-mata">{tree.numero}</td>
                <td className="px-4 py-3 text-verde-mata">{parseFloat(tree.dap).toFixed(1)}</td>
                <td className="px-4 py-3 text-verde-mata">{parseFloat(tree.altura).toFixed(1)}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-md bg-verde-eucalipto/20 px-2 py-0.5 text-xs font-medium text-verde-mata">
                    {QUALIDADE_LABELS[tree?.qualidade ?? ''] ?? tree?.qualidade}
                  </span>
                </td>
                <td
                  className="px-4 py-3 text-verde-mata/70 text-sm max-w-xs truncate"
                  title={tree.observacoes}
                >
                  {tree.observacoes || '—'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {onEditTree && (
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          onEditTree(tree);
                        }}
                        className="p-1.5 text-verde-mata/60 hover:text-verde-mata hover:bg-verde-mata/10 rounded-lg transition-colors"
                        title="Editar"
                        aria-label="Editar árvore"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onRemoveTree(tree);
                      }}
                      className="p-1.5 text-coral-flor/60 hover:text-coral-flor hover:bg-coral-flor/10 rounded-lg transition-colors"
                      title="Remover"
                      aria-label="Remover árvore"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-verde-mata/10 bg-verde-mata/5 flex items-center justify-between">
        <p className="text-sm text-verde-mata/70">
          Total: <span className="font-semibold">{trees.length}</span> árvore
          {trees.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2 text-sm text-verde-mata/60">
          <span>Média DAP:</span>
          <span className="font-mono font-semibold">
            {(trees.reduce((sum, t) => sum + parseFloat(t.dap), 0) / trees.length).toFixed(1)} cm
          </span>
          <span className="mx-2">|</span>
          <span>Média Altura:</span>
          <span className="font-mono font-semibold">
            {(trees.reduce((sum, t) => sum + parseFloat(t.altura), 0) / trees.length).toFixed(1)} m
          </span>
        </div>
      </div>
    </div>
  );
}
