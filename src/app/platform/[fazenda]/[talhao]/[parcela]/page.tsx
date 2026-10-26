'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/ui/Topbar';
import { ParcelCard } from '@/components/parcels/ParcelCard';
import { TreeCard, type TreeData } from '@/components/trees/TreeCard';
import Button from '@/components/core/Button';

interface ParcelaPageProps {
  params: { fazenda: string; talhao: string; parcela: string };
}

const TREES: TreeData[] = [
  {
    id: '1',
    numero: '05',
    dap: '21,0',
    altura: '17,0',
    observacoes: 'Bifurcação a 3 m',
    qualidade: 'NORMAL',
  },
  {
    id: '2',
    numero: '04',
    dap: '21,0',
    altura: '17,0',
    observacoes: 'Bifurcação a 3 m',
    qualidade: 'NORMAL',
  },
  {
    id: '3',
    numero: '03',
    dap: '21,0',
    altura: '17,0',
    observacoes: 'Bifurcação a 3 m',
    qualidade: 'NORMAL',
  },
  {
    id: '4',
    numero: '02',
    dap: '21,0',
    altura: '17,0',
    observacoes: 'Bifurcação a 3 m',
    qualidade: 'NORMAL',
  },
  {
    id: '5',
    numero: '01',
    dap: '21,0',
    altura: '17,0',
    observacoes: 'Bifurcação a 3 m',
    qualidade: 'NORMAL',
  },
];

export default function ParcelaPage({ params }: ParcelaPageProps) {
  const router = useRouter();
  const [trees, setTrees] = useState<TreeData[]>(TREES);

  const handleAddTree = () => {
    router.push(`/platform/${params.fazenda}/${params.talhao}/${params.parcela}/cadastrar-arvore`);
  };

  const handleRemoveTree = (id: string) => {
    setTrees((prev) => prev.filter((tree) => tree.id !== id));
  };

  const handleConcluir = () => {
    // Ação de concluir parcela
  };

  return (
    <div className="min-h-screen bg-creme-flor flex">
      <main className="flex-1 min-w-0">
        <Topbar
          title="Árvores"
          description="Nível 4 - medição das árvores da parcela"
          onBack={() => router.back()}
        />

        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          <ParcelCard
            numero="P02"
            area="400 m²"
            statusLabel="EM ABERTO"
            dimensoes="20 × 20 m"
            talhao="Talhão 01"
            arvoresMedidas={trees.length}
            metaReferencia={15}
            descricaoRodape="Cadastro em lote: lance várias árvores, revise o conjunto numa tabela e salve tudo de uma vez."
            onAddTrees={handleAddTree}
          />

          <section className="mt-8 bg-white p-6 rounded-3xl border border-[#D7D0C2]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-verde-mata font-semibold text-xl">Árvores registradas</h2>
                <p className="text-verde-mata/60 text-sm">
                  {trees.length} árvores registradas &nbsp;·&nbsp; faltam {15 - trees.length} para a
                  meta
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trees.map((tree) => (
                <TreeCard key={tree.id} tree={tree} onRemove={handleRemoveTree} />
              ))}
            </div>
          </section>

          <div className="mt-12 flex justify-end">
            <Button
              label="Concluir Parcela"
              onClick={handleConcluir}
              className="bg-creme-flor text-verde-mata border-2 border-[#D8D1C4] rounded-xl px-6 py-3 font-semibold hover:bg-creme-flor/80 transition-colors"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
