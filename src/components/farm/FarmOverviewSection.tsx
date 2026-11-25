'use client';

import { useState, useMemo } from 'react';
import { createFarm } from '@/app/api/api';
import Link from 'next/link';
import { FarmFormData, FarmFormModal } from '@/components/modal/FarmFormModal';
import { Farm } from '@/types/farm';

interface FarmOverviewSectionProps {
  initialFarms: Farm[];
  isAdmin: boolean;
  onFarmsChanged: () => Promise<void>;
}

export default function FarmOverviewSection({
  initialFarms,
  isAdmin,
  onFarmsChanged,
}: FarmOverviewSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  return (
    <div className="w-full rounded-3xl border border-[#D7D0C2] bg-white p-6 md:p-8">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-3xl font-bold text-verde-mata font-newsreader">Minhas Fazendas</h2>
          <p className="text-[#848079]">Fazendas da qual você faz parte.</p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={handleOpenCreateFarm}
            className="flex items-center justify-center gap-2 rounded-xl bg-verde-mata px-6 py-3 font-semibold text-white transition-colors hover:bg-[#1f421f] whitespace-nowrap"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            Adicionar fazenda
          </button>
        )}
      </div>

      {/* BARRA DE BUSCA */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-[#848079]">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input
          type="search"
          placeholder="Buscar fazenda por nome"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="w-full rounded-xl border border-[#D7D0C2] bg-white py-3.5 pl-11 pr-4 text-[15px] text-verde-mata placeholder:text-[#848079] focus:border-verde-mata focus:outline-none transition-colors"
        />
      </div>

      {/* GRID DE FAZENDAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFarms.length > 0 ? (
          filteredFarms.map((farm) => (
            <article
              key={farm.farmId}
              className="flex items-center justify-between rounded-[20px] border border-[#D7D0C2] bg-white p-5 hover:border-[#B8CDB9] transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* Ícone Redondo */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#F0F5EF] text-verde-mata">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>

                {/* Informações da Fazenda */}
                <div className="flex flex-col gap-0.5">
                  <h3 className="text-[17px] font-bold text-[#20221E]">{farm.name}</h3>
                </div>
              </div>

              {/* Lado Direito: Link */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                <Link
                  href={`/platform/fazendas/${farm.farmId}`}
                  className="flex items-center gap-1 text-sm font-bold text-verde-mata hover:underline"
                >
                  Ver fazenda <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-[#D7D0C2] py-12 text-center">
            <p className="text-[#848079]">
              Nenhuma fazenda encontrada com &quot;{searchQuery}&quot;.
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
    </div>
  );
}
