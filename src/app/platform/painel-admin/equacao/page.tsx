'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  createEquation,
  deleteEquation,
  getEquations,
  updateEquation,
  updateEquationStatus,
  type CreateEquationDto,
} from '@/app/api/api';
import Topbar from '@/components/ui/Topbar';
import AdminTabsBar from '@/components/admin/AdminTabBar';
import AdminEquationCard from '@/components/admin/equations/AdminEquationCard';
import EquationModal from '@/components/modal/admin/EquationModal';
import RemoveEquationModal from '@/components/modal/admin/RemoveEquationModal';
import { ADMIN_TAB_PATHS, ADMIN_TABS } from '@/lib/adminTabs';
import type { AdminTabKey } from '@/types/admin';
import type { VolumetricEquation } from '@/types/equation';

const errorMessage = (err: unknown, fallback: string) =>
  err instanceof Error ? err.message : fallback;

export default function AdminEquationsPage() {
  const router = useRouter();

  const [equations, setEquations] = useState<VolumetricEquation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [activeEquation, setActiveEquation] = useState<VolumetricEquation | null>(null);

  const load = useCallback(
    () =>
      getEquations()
        .then(setEquations)
        .catch((err) => setError(errorMessage(err, 'Não foi possível carregar as equações.')))
        .finally(() => setIsLoading(false)),
    [],
  );

  useEffect(() => {
    load();
  }, [load]);

  const handleTabChange = (key: AdminTabKey) => router.push(ADMIN_TAB_PATHS[key]);

  const openCreateModal = () => {
    setError(null);
    setActiveEquation(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (eq: VolumetricEquation) => {
    setError(null);
    setActiveEquation(eq);
    setIsFormModalOpen(true);
  };

  const openRemoveModal = (eq: VolumetricEquation) => {
    setError(null);
    setActiveEquation(eq);
    setIsRemoveModalOpen(true);
  };

  // Roda a chamada, recarrega a lista e devolve se deu certo; o erro vai para a tela.
  const runAction = async (action: () => Promise<unknown>, fallback: string) => {
    setError(null);
    setIsActionLoading(true);
    try {
      await action();
      await load();
      return true;
    } catch (err) {
      setError(errorMessage(err, fallback));
      return false;
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSaveEquation = async (dto: CreateEquationDto) => {
    const id = activeEquation?.id;
    const saved = await runAction(
      () => (id ? updateEquation(id, dto) : createEquation(dto)),
      'Não foi possível salvar a equação.',
    );
    if (saved) setIsFormModalOpen(false);
  };

  const handleToggleStatus = (eq: VolumetricEquation) =>
    runAction(
      () => updateEquationStatus(eq.id, !eq.isActive),
      'Não foi possível alterar o status.',
    );

  const handleConfirmRemove = async () => {
    if (!activeEquation) return;
    await runAction(() => deleteEquation(activeEquation.id), 'Não foi possível remover a equação.');
    // Fecha mesmo em erro: o modal de remoção não mostra mensagem, a tela mostra.
    setIsRemoveModalOpen(false);
  };

  return (
    <div className="flex min-h-full flex-col bg-[#EFECE4]">
      <Topbar
        title="Administração"
        description="Usuários, validações e auditoria"
        onBack={() => router.push('/platform')}
      />

      <section className="flex flex-col gap-8 p-6 md:p-10">
        <AdminTabsBar tabs={ADMIN_TABS} activeTab="equations" onSelectTab={handleTabChange} />

        <article className="flex w-full flex-col rounded-2xl border border-[#DFDBD0] bg-white p-6 shadow-sm sm:p-8">
          <header className="mb-6 flex flex-col gap-4 border-b border-[#E8E4DA] pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="font-serif text-2xl font-bold text-verde-mata">
                Equações volumétricas
              </h2>
              <p className="text-sm font-medium text-[#6D786E]">
                Somente equações ativas aparecem na tela de Processamento. Os coeficientes são
                definidos aqui.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="whitespace-nowrap rounded-xl border-2 border-[#D7D0C2] bg-transparent px-5 py-2.5 text-sm font-bold text-verde-mata transition-colors hover:bg-[#E4EDE2]/50"
            >
              + Nova equação
            </button>
          </header>

          {error && !isFormModalOpen && (
            <p role="alert" className="mb-4 text-sm font-medium text-coral-flor">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-4">
            {isLoading ? (
              <p className="text-sm font-medium text-[#6D786E]">Carregando equações...</p>
            ) : equations.length > 0 ? (
              equations.map((eq) => (
                <AdminEquationCard
                  key={eq.id}
                  equation={eq}
                  onEdit={openEditModal}
                  onToggleStatus={handleToggleStatus}
                  onRemove={openRemoveModal}
                  isUpdatingStatus={isActionLoading}
                />
              ))
            ) : (
              <p className="text-sm font-medium text-[#6D786E]">
                Nenhuma equação cadastrada no sistema.
              </p>
            )}
          </div>
        </article>
      </section>

      {isFormModalOpen && (
        <EquationModal
          key={activeEquation?.id ?? 'nova'}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveEquation}
          editingEquation={activeEquation}
          isLoading={isActionLoading}
          error={error}
        />
      )}

      <RemoveEquationModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleConfirmRemove}
        isLoading={isActionLoading}
      />
    </div>
  );
}
