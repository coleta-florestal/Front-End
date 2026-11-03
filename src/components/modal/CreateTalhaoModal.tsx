'use client';

import { useState } from 'react';
import Button from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { Textarea } from '@/components/core/Textarea';
import { Close } from '@/components/core/Icons';

export interface CreateTalhaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { nome: string; area: string; descricao: string }) => void;
}

export function CreateTalhaoModal({ isOpen, onClose, onSave }: CreateTalhaoModalProps) {
  const [nome, setNome] = useState('');
  const [area, setArea] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSave = () => {
    onSave({ nome, area, descricao });
  };

  if (!isOpen) return null;

  return (
    <div
      id="create-talhao-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        id="create-talhao-modal"
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#e7e2d8] bg-[#faf7f0] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e7e2d8] px-6 py-4 gap-4">
          <h2 className="text-2xl font-semibold text-verde-mata font-newsreader">Novo talhão</h2>
          <button
            type="button"
            onClick={onClose}
            className="border-none bg-transparent p-0 font-semibold text-[#3d3d3d] shadow-none hover:bg-[#f0ede5]"
            aria-label="Fechar modal"
          >
            <Close size={16} />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="flex flex-col gap-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nome do Talhão"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="ex. Talhão 01"
              />
              <Input
                label="Área"
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="ex. 24,6 ha"
              />
            </div>

            <Textarea
              label="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o talhão..."
              rows={4}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between border-t border-[#e7e2d8] pt-6 gap-4">
            <p className="text-[#848079] text-sm md:order-1 order-2">
              O talhão é criado sem parcelas. Você adiciona a primeira parcela na tela de detalhe.
            </p>
            <div className="flex w-full md:w-auto gap-4 md:order-2 order-1 shrink-0">
              <Button
                label="Cancelar"
                onClick={onClose}
                className="w-full md:w-auto border border-[#D7D0C2] bg-white text-verde-mata hover:bg-[#f0ede5] rounded-xl px-6 py-3 font-semibold"
              />
              <Button
                label="Criar Talhão"
                onClick={handleSave}
                disabled={!nome.trim() || !area.trim()}
                className="w-full md:w-auto bg-verde-mata text-creme-flor hover:bg-[#245225] rounded-xl px-6 py-3 font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
