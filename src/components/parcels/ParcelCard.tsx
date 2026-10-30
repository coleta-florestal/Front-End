'use client';

import { MapPin } from '../core/Icons';
import Button from '../core/Button';

export interface ParcelCardProps {
  numero: string;
  area: string;
  statusLabel: string;
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
    <div className="bg-white rounded-3xl border border-[#D7D0C2] p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="shrink-0 p-2 bg-creme-flor rounded-xl">
          <MapPin className="w-6 h-6 text-verde-mata" />
        </div>
        <h2 className="text-verde-mata font-semibold text-lg lg:text-2xl leading-tight font-newsreader">
          Parcela {numero} — Área: {area}
        </h2>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="bg-creme-flor text-verde-mata rounded-full px-3 py-1 text-xs font-semibold">
          {statusLabel}
        </span>
        <span className="text-verde-mata/60 text-sm">
          {dimensoes} · {talhao}
        </span>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-verde-mata/60 text-xs uppercase tracking-wider">
            Árvores medidas
          </span>
          <p className="text-verde-mata text-xl font-semibold">
            {arvoresMedidas} árvores registradas
          </p>
        </div>

        <div className="w-full md:w-64">
          <div className="flex justify-between mb-1 text-lg font-semibold text-verde-mata/60">
            <span>0</span>
            <span>{metaReferencia}</span>
          </div>
          <div className="w-full bg-[#D7D0C2] rounded-full h-2 overflow-hidden">
            <div className={`bg-coral-flor h-full w-[${percentual}%]`} />
          </div>
          <p className="text-verde-mata/60 text-xs mt-1">
            meta de referência: {metaReferencia} árvores
          </p>
        </div>
      </div>

      <div className="border-t border-[#D7D0C2] pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <p className="text-verde-mata/60 text-sm leading-relaxed">{descricaoRodape}</p>
        <Button
          label="+ Adicionar Árvores"
          onClick={onAddTrees}
          className="bg-coral-flor text-creme-flor rounded-xl px-6 py-3 font-semibold hover:bg-coral-flor/90 transition-colors"
        />
      </div>
    </div>
  );
}
