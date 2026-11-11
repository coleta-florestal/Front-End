'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/ui/Topbar';
import AdminTabsBar from '@/components/admin/AdminTabBar';
import AdminEquationCard from '@/components/admin/equations/AdminEquationCard';
import EquationModal, { EquationData } from '@/components/modal/admin/EquationModal';
import RemoveEquationModal from '@/components/modal/admin/RemoveEquationModal';
import { AdminTabOption } from '@/types/admin';

const ADMIN_TABS: AdminTabOption[] = [
  { key: 'overview', label: 'Visão Geral' },
  { key: 'users', label: 'Usuários' },
  { key: 'projects', label: 'Projetos' },
  { key: 'equations', label: 'Equações' },
  { key: 'validations', label: 'Validações' },
  { key: 'audit', label: 'Auditoria' },
];

export default function AdminEquationsPage() {
  const router = useRouter();

  const [equations, setEquations] = useState<EquationData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);

  const [activeEquation, setActiveEquation] = useState<EquationData | null>(null);

  const fetchEquations = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/admin/equations`);
      if (response.ok) {
        const data = (await response.json()) as EquationData[];
        setEquations(data);
      }
    } catch (error) {
      console.error('Erro ao buscar equações:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const loadData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/admin/equations`);
        if (response.ok && isSubscribed) {
          const data = (await response.json()) as EquationData[];
          setEquations(data);
        }
      } catch (error) {
        console.error('Erro ao buscar equações:', error);
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleTabChange = (key: string) => {
    if (key === 'overview') {
      router.push('/platform/painel-admin');
    } else {
      router.push(`/platform/painel-admin/${key}`);
    }
  };

  const openCreateModal = () => {
    setActiveEquation(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (eq: EquationData) => {
    setActiveEquation(eq);
    setIsFormModalOpen(true);
  };

  const openRemoveModal = (eq: EquationData) => {
    setActiveEquation(eq);
    setIsRemoveModalOpen(true);
  };

  const handleSaveEquation = async (data: EquationData) => {
    setIsActionLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const isEditing = Boolean(data.id);
      const url = isEditing ? `${apiUrl}/admin/equations/${data.id}` : `${apiUrl}/admin/equations`;
      const method = isEditing ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        await fetchEquations();
        setIsFormModalOpen(false);
      }
    } catch (error) {
      console.error('Erro ao salvar equação:', error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleToggleStatus = async (eq: EquationData) => {
    if (!eq.id) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/admin/equations/${eq.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !eq.isActive }),
      });

      if (response.ok) {
        setEquations((prev) =>
          prev.map((item) => (item.id === eq.id ? { ...item, isActive: !item.isActive } : item)),
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleConfirmRemove = async () => {
    if (!activeEquation?.id) return;
    setIsActionLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/admin/equations/${activeEquation.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEquations((prev) => prev.filter((item) => item.id !== activeEquation.id));
        setIsRemoveModalOpen(false);
      }
    } catch (error) {
      console.error('Erro ao remover equação:', error);
    } finally {
      setIsActionLoading(false);
    }
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
              <h2 className="font-serif text-2xl font-bold text-[#2C5F2D]">
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
              className="whitespace-nowrap rounded-xl border-2 border-[#D7D0C2] bg-transparent px-5 py-2.5 text-sm font-bold text-[#2C5F2D] transition-colors hover:bg-[#E4EDE2]/50"
            >
              + Nova equação
            </button>
          </header>

          <div className="flex flex-col gap-4">
            {isLoading ? (
              <p className="text-sm font-medium text-[#6D786E]">A carregar equações...</p>
            ) : equations.length > 0 ? (
              equations.map((eq) => (
                <AdminEquationCard
                  key={eq.id}
                  equation={eq}
                  onEdit={openEditModal}
                  onToggleStatus={handleToggleStatus}
                  onRemove={openRemoveModal}
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

      <EquationModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveEquation}
        editingEquation={activeEquation}
        isLoading={isActionLoading}
      />

      <RemoveEquationModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        onConfirm={handleConfirmRemove}
        isLoading={isActionLoading}
      />
    </div>
  );
}
