'use client';

import { useState, useMemo } from 'react';
import Button from '@/components/core/Button';
import { Input } from '@/components/core/Input';
import FarmCard from '@/components/farm/FarmCard';
import { Farm } from '@/types/farm';

interface FarmSearchSectionProps {
  initialFarms: Farm[];
  isAdmin: boolean;
}

export default function FarmSearchSection({ initialFarms, isAdmin }: FarmSearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFarms = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return initialFarms;

    return initialFarms.filter((farm) => farm.name.toLowerCase().includes(normalizedQuery));
  }, [initialFarms, searchQuery]);

  const handleOpenCreateFarm = () => {};

  const handleOpenEditFarm = (farm: Farm) => {
    void farm;
  };

  const handleOpenDeleteFarm = (farm: Farm) => {
    void farm;
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
            className="rounded-xl border-[#DFDBD0] bg-[#FAF8F3] px-4 py-3 text-sm text-[#2C5F2D] focus:border-[#2C5F2D]"
          />
        </div>

        {isAdmin && (
          <Button
            type="button"
            label="+ Adicionar Fazenda"
            onClick={handleOpenCreateFarm}
            className="shrink-0 rounded-xl border-2 border-dashed border-[#2C5F2D]/60 bg-[#FAF8F3] px-5 py-3 text-sm text-[#2C5F2D] shadow-none transition-colors hover:bg-[#E4EDE2]"
          />
        )}
      </div>

      <div className="flex flex-col gap-4">
        {filteredFarms.length > 0 ? (
          filteredFarms.map((farm) => (
            <FarmCard
              key={farm.id}
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
    </div>
  );
}
