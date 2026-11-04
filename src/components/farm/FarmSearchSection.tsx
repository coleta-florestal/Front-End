'use client';

import { useState, useMemo } from 'react';
import { createFarm, deleteFarm, updateFarm } from '@/app/api/api';
import Button from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import FarmListCard from '@/components/farm/FarmListCard';
import { DeleteFarmModal } from '@/components/modal/DeleteFarmModal';
import { FarmFormData, FarmFormModal } from '@/components/modal/FarmFormModal';
import { Farm } from '@/types/farm';

interface FarmSearchSectionProps {
  initialFarms: Farm[];
  isAdmin: boolean;
  onFarmsChanged: () => Promise<void>;
}

export default function FarmSearchSection({
  initialFarms,
  isAdmin,
  onFarmsChanged,
}: FarmSearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [farmToEdit, setFarmToEdit] = useState<Farm | null>(null);
  const [farmToDelete, setFarmToDelete] = useState<Farm | null>(null);

  const filteredFarms = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return initialFarms;

    return initialFarms.filter((farm) => farm.name.toLowerCase().includes(normalizedQuery));
  }, [initialFarms, searchQuery]);

  const handleOpenCreateFarm = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveFarm = async (data: FarmFormData) => {
    await createFarm({
      name: data.nome.trim(),
      address: data.local.trim(),
      ownerId: data.responsavelId,
      description: data.descricao.trim() || undefined,
    });

    setIsCreateModalOpen(false);
    await onFarmsChanged();
  };

  const handleOpenEditFarm = (farm: Farm) => {
    setFarmToEdit(farm);
  };

  const handleUpdateFarm = async (farmId: string, data: FarmFormData) => {
    await updateFarm(farmId, {
      name: data.nome.trim(),
      address: data.local.trim(),
      ownerId: data.responsavelId,
      description: data.descricao.trim(),
    });

    setFarmToEdit(null);
    await onFarmsChanged();
  };

  const handleOpenDeleteFarm = (farm: Farm) => {
    setFarmToDelete(farm);
  };

  const handleConfirmDeleteFarm = async (farm: Farm) => {
    await deleteFarm(farm.farmId);
    setFarmToDelete(null);
    await onFarmsChanged();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-3xl [&>div]:gap-0 [&_label]:sr-only">
          <Input
            type="search"
            label="Buscar Fazenda"
            placeholder="Buscar Fazenda"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="rounded-xl border-[#DFDBD0] bg-[#FAF8F3] px-4 py-3 text-sm text-verde-mata focus:border-verde-mata"
          />
        </div>

        {isAdmin && (
          <Button
            type="button"
            label="+ Adicionar Fazenda"
            onClick={handleOpenCreateFarm}
            className="shrink-0 rounded-xl border-2 border-dashed border-verde-mata/60 bg-[#FAF8F3] px-5 py-3 text-sm text-verde-mata shadow-none transition-colors hover:bg-[#E4EDE2]"
          />
        )}
      </div>

      <div className="flex flex-col gap-4">
        {filteredFarms.length > 0 ? (
          filteredFarms.map((farm) => (
            <FarmListCard
              key={farm.farmId}
              farm={farm}
              isAdmin={isAdmin}
              onEdit={handleOpenEditFarm}
              onDelete={handleOpenDeleteFarm}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E2DDD2] bg-[#FAF8F3] py-12 text-center">
            <p className="text-base font-semibold text-[#5C665A]">
              Fazenda não encontrada ou inexistente
            </p>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <FarmFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSaveFarm}
        />
      )}

      {farmToEdit && (
        <FarmFormModal
          isOpen
          farm={farmToEdit}
          onClose={() => setFarmToEdit(null)}
          onSave={(data) => handleUpdateFarm(farmToEdit.farmId, data)}
        />
      )}

      {farmToDelete && (
        <DeleteFarmModal
          isOpen
          farm={farmToDelete}
          onConfirm={handleConfirmDeleteFarm}
          onClose={() => setFarmToDelete(null)}
        />
      )}
    </div>
  );
}
