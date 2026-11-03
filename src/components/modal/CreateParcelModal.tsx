'use client';

import { useState } from 'react';
import Button from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { Close } from '@/components/core/Icons';

export interface CreateParcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { identificacao: string; area: string; metaArvores: string }) => void;
}

export function CreateParcelModal({ isOpen, onClose, onSave }: CreateParcelModalProps) {
  const [identificacao, setIdentificacao] = useState('');
  const [area, setArea] = useState('');
  const [metaArvores, setMetaArvores] = useState('');

  const handleSave = () => {
    onSave({ identificacao, area, metaArvores });
  };

  if (!isOpen) return null;

  return (
    <div
      id="create-parcel-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        id="create-parcel-modal"
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#e7e2d8] bg-[#faf7f0] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e7e2d8] px-6 py-4 gap-4">
          <h2 className="text-2xl font-semibold text-verde-mata font-newsreader">Nova parcela</h2>
          <button
            type="button"
            onClick={onClose}
            className="border-none bg-transparent p-0 font-semibold text-[#3d3d3d] shadow-none hover:bg-[#f0ede5]"
            aria-label="Fechar modal"
          >
            <Close size={16} />
          </button>
        </div>

        <div className="px-6 py-4">
          <p className="text-verde-eucalipto text-sm mb-6">
            A parcela é criada como <strong className="text-verde-mata">não iniciada</strong>. Você
            inicia a coleta quando estiver em campo.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Input
              label="Identificação da parcela"
              value={identificacao}
              onChange={(e) => setIdentificacao(e.target.value)}
              placeholder="ex. Parcela 03"
            />
            <Input
              label="Área (m²)"
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="ex. 500"
            />
            <Input
              label="Meta de Árvores"
              type="number"
              value={metaArvores}
              onChange={(e) => setMetaArvores(e.target.value)}
              placeholder="ex. 5"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-4 pt-6 border-t border-[#e7e2d8]">
            <Button
              label="Cancelar"
              onClick={onClose}
              className="border border-[#D7D0C2] bg-white text-verde-mata hover:bg-[#f0ede5] rounded-xl px-6 py-3 font-semibold"
            />
            <Button
              label="Criar parcela"
              onClick={handleSave}
              disabled={!identificacao.trim() || !area.trim() || !metaArvores.trim()}
              className="bg-verde-mata text-creme-flor hover:bg-[#245225] rounded-xl px-6 py-3 font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
