'use client';

import { MapPin } from '../core/Icons';
import Button from '../core/Button';

export interface ParcelCardProps {
  numero: string;
  area: string;
  formato: string;
  statusLabel: string;
  naoSincronizada: boolean;
  dimensoes: string;
  talhao: string;
  especie: string;
  arvoresMedidas: number;
  metaReferencia: number;
  descricaoRodape: string;
  onAddTrees: () => void;
}

export function ParcelCard({
  numero,
  area,
  formato,
  statusLabel,
  naoSincronizada,
  dimensoes,
  talhao,
  especie,
  arvoresMedidas,
  metaReferencia,
  descricaoRodape,
  onAddTrees,
}: ParcelCardProps) {
  const percentual = Math.min((arvoresMedidas / metaReferencia) * 100, 100);

  return (
    <div
      id="parcela-resumo"
      className="overflow-hidden rounded-2xl border border-[#D7D0C2] bg-white"
    >
      <div className="flex flex-col gap-6 p-4 lg:flex-row lg:items-center lg:justify-between lg:p-6">
        <div className="flex min-w-0 items-center gap-4">
          <div className="hidden shrink-0 rounded-xl bg-[#E8F0EA] p-3 sm:block">
            <MapPin size={24} />
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <h2 className="font-newsreader text-xl font-semibold leading-tight text-verde-mata lg:text-2xl xl:text-3xl">
              Parcela {numero} — Área: {area} — Formato: {formato}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#E8D5A8] bg-[#FAF1DE] px-3 py-1 text-xs font-bold text-[#7A5A1E]">
                {statusLabel}
              </span>
              {naoSincronizada && (
                <span className="rounded-full border border-coral-flor/50 bg-[#FBECE8] px-3 py-1 text-xs font-bold text-[#B85C47]">
                  NÃO SINCRONIZADA
                </span>
              )}
              <span className="text-sm text-[#6D786E]">
                {dimensoes} · {talhao} · <em>{especie}</em>
              </span>
            </div>
          </div>
        </div>

        <div id="parcela-progresso" className="w-full shrink-0 lg:w-64">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#6D786E]">
            Árvores medidas
          </span>
          <p className="font-newsreader text-2xl font-semibold text-verde-mata">
            {arvoresMedidas} {arvoresMedidas === 1 ? 'árvore registrada' : 'árvores registradas'}
          </p>
          <div
            role="progressbar"
            aria-label="Progresso da meta de árvores"
            aria-valuemin={0}
            aria-valuemax={metaReferencia}
            aria-valuenow={Math.min(arvoresMedidas, metaReferencia)}
            className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#E7E2D8]"
          >
            <div className="h-full bg-coral-flor" style={{ width: `${percentual}%` }} />
          </div>
          <p className="mt-1 text-xs text-[#6D786E]">
            meta de referência: {metaReferencia} árvores
          </p>
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 border-t border-[#E7E2D8] bg-[#EEF3EE] p-4 md:flex-row md:items-center lg:px-6">
        <p className="text-sm leading-relaxed text-[#3d3d3d]">{descricaoRodape}</p>
        <Button
          label="+ Adicionar Árvores"
          onClick={onAddTrees}
          className="w-full shrink-0 cursor-pointer rounded-xl bg-[#F47F3B] px-6 py-3 text-white transition-colors hover:bg-[#F47F3B]/90 md:w-auto"
        />
      </div>
    </div>
  );
}
