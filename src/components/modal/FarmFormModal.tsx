'use client';

import { useEffect, useState } from 'react';
import { FarmOwner, getAdminOwners } from '@/app/api/api';
import Button from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import { Select } from '@/components/core/Select';
import { Textarea } from '@/components/core/Textarea';
import { Close } from '@/components/core/Icons';
import { Farm } from '@/types/farm';

export interface FarmFormData {
  nome: string;
  local: string;
  responsavelId: string;
  descricao: string;
}

export interface FarmFormModalProps {
  isOpen: boolean;
  farm?: Farm;
  onClose: () => void;
  onSave: (data: FarmFormData) => void | Promise<void>;
}

export function FarmFormModal({ isOpen, farm, onClose, onSave }: FarmFormModalProps) {
  const isEditing = Boolean(farm);

  const [nome, setNome] = useState(farm?.name ?? '');
  const [local, setLocal] = useState(farm?.address ?? '');
  const [responsavelId, setResponsavelId] = useState(farm?.ownerId ?? '');
  const [descricao, setDescricao] = useState(farm?.description ?? '');
  const [responsaveis, setResponsaveis] = useState<FarmOwner[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadResponsaveis() {
      try {
        setResponsaveis(await getAdminOwners());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar os responsáveis');
      }
    }

    loadResponsaveis();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      await onSave({ nome, local, responsavelId, descricao });
    } catch (err) {
      const fallback = `Não foi possível ${isEditing ? 'salvar' : 'criar'} a fazenda`;
      setError(err instanceof Error ? err.message : fallback);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const responsavelOptions = [
    { value: '', label: 'Selecione o responsável' },
    ...responsaveis.map((responsavel) => ({ value: responsavel.id, label: responsavel.name })),
  ];

  // Sem esta opção, um responsável que deixou de ser administrador sumiria do select e o
  // formulário mostraria outro nome do que será salvo.
  if (farm && !responsaveis.some((responsavel) => responsavel.id === farm.ownerId)) {
    responsavelOptions.push({ value: farm.ownerId, label: farm.responsible });
  }

  const dataInicio = farm ? new Date(farm.createdAt) : new Date();
  const savingLabel = isEditing ? 'Salvando...' : 'Criando...';
  const saveLabel = isEditing ? 'Salvar Dados' : 'Criar Fazenda';

  return (
    <div
      id="farm-form-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        id="farm-form-modal"
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#e7e2d8] bg-[#faf7f0] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e7e2d8] px-6 py-4 gap-4">
          <h2 className="text-2xl font-semibold text-verde-mata font-newsreader">
            {isEditing ? 'Editar fazenda' : 'Nova fazenda'}
          </h2>
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
                label="Nome da Fazenda"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="ex. Fazenda D"
              />
              <Input
                label="Local"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                placeholder="ex. Zona Rural — PE"
              />
              <Select
                label="Responsável"
                value={responsavelId}
                onChange={(e) => setResponsavelId(e.target.value)}
                options={responsavelOptions}
              />
              {/* O back gera a data ao criar a fazenda e rejeita esse campo no envio. */}
              <Input
                label="Data de início"
                value={dataInicio.toLocaleDateString('pt-BR')}
                readOnly
                aria-readonly="true"
              />
            </div>

            <Textarea
              label="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva a fazenda..."
              rows={4}
            />
          </div>

          {error && (
            <p className="mb-4 flex items-center gap-1 text-sm text-coral-flor" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col md:flex-row items-center justify-between border-t border-[#e7e2d8] pt-6 gap-4">
            {!isEditing && (
              <p className="text-[#848079] text-sm md:order-1 order-2">
                A fazenda é criada sem talhões. Você adiciona o primeiro talhão na tela de detalhe.
              </p>
            )}
            <div className="flex w-full md:w-auto md:ml-auto gap-4 md:order-2 order-1 shrink-0">
              <Button
                label="Cancelar"
                onClick={onClose}
                className="w-full md:w-auto border border-[#D7D0C2] bg-white text-verde-mata hover:bg-[#f0ede5] rounded-xl px-6 py-3 font-semibold"
              />
              <Button
                label={loading ? savingLabel : saveLabel}
                onClick={handleSave}
                disabled={!nome.trim() || !local.trim() || !responsavelId || loading}
                className="w-full md:w-auto bg-verde-mata text-creme-flor hover:bg-[#245225] rounded-xl px-6 py-3 font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
