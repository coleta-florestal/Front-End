'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/ui/Topbar';
import { FarmCard } from '@/components/farm/FarmCard';
import { TalhaoSummary } from '@/components/talhoes/TalhaoSummary';
import { Input } from '@/components/core/Input';
import { CreateTalhaoModal } from '@/components/modal/CreateTalhaoModal'; // Ajuste o caminho se necessário

interface FazendaTalhoesPageProps {
  params: Promise<{ fazenda: string }>;
}

export default function FazendaTalhoesPage({ params }: FazendaTalhoesPageProps) {
  const router = useRouter();

  const { fazenda } = use(params);

  const [termoBusca, setTermoBusca] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [talhoes, setTalhoes] = useState([
    {
      id: 'T01',
      nome: 'Talhão 01',
      status: 'EM ANDAMENTO',
      area: '24,6 ha',
      plantio: '2019',
      parcelasConcluidas: 1,
      parcelasTotais: 3,
      especie: 'Eucalyptus grandis',
      progresso: 33,
      arvoresMedidas: 17,
      naoSincronizadas: 1,
    },
    {
      id: 'T02',
      nome: 'Talhão 02',
      status: 'SEM MEDIÇÃO',
      area: '18,2 ha',
      plantio: '2020',
      parcelasConcluidas: 0,
      parcelasTotais: 2,
      especie: 'Eucalyptus urophylla',
      progresso: 0,
      arvoresMedidas: 17,
      naoSincronizadas: 0,
    },
    {
      id: 'T03',
      nome: 'Talhão 03',
      status: 'CONCLUÍDA',
      area: '31,0 ha',
      plantio: '2018',
      parcelasConcluidas: 2,
      parcelasTotais: 2,
      especie: 'Eucalyptus saligna',
      progresso: 100,
      arvoresMedidas: 17,
      naoSincronizadas: 0,
    },
  ]);

  const talhoesFiltrados = talhoes.filter((t) =>
    t.nome.toLowerCase().includes(termoBusca.toLowerCase()),
  );

  const handleSaveTalhao = (data: { nome: string; area: string; descricao: string }) => {
    const novoTalhao = {
      id: `T0${talhoes.length + 1}`,
      nome: data.nome,
      status: 'SEM MEDIÇÃO',
      area: data.area,
      plantio: new Date().getFullYear().toString(),
      parcelasConcluidas: 0,
      parcelasTotais: 0,
      especie: data.descricao || 'Eucalyptus',
      progresso: 0,
      arvoresMedidas: 0,
      naoSincronizadas: 0,
    };

    setTalhoes((prev) => [...prev, novoTalhao]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F2F0E9]">
      <Topbar
        title="Talhões"
        description="Nível 2 · talhões da fazenda selecionada"
        onBack={() => router.back()}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FarmCard
          nome="Fazenda Santa Maria"
          status="EM ANDAMENTO"
          localizacao="Zona Rural — PE"
          responsavel="Eng. Amanda"
          talhoes={talhoes.length}
          areaTotal="73,8 ha"
          parcelasConcluidas={3}
          parcelasTotais={7}
          arvores={44}
        />

        <div className="mt-10 mb-6">
          <h3 className="text-2xl text-verde-mata font-newsreader font-semibold">
            Talhões da fazenda
          </h3>
          <p className="text-[#848079] text-sm mt-1">
            Abra um talhão para ver as parcelas de amostragem.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              label=""
              placeholder="Buscar Talhão"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="bg-white rounded-xl! border-[#D7D0C2] w-full"
            />
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-dashed border-[#BFC9BF] rounded-xl text-verde-mata bg-transparent hover:bg-white transition-colors font-semibold whitespace-nowrap h-11.5 self-end cursor-pointer"
          >
            Adicionar Talhão
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {talhoesFiltrados.map((talhao) => (
            <div
              key={talhao.id}
              onClick={() => router.push(`/platform/${fazenda}/${talhao.id}`)}
              className="cursor-pointer transition-transform duration-200 hover:-translate-y-1 hover:shadow-md rounded-3xl"
              role="button"
              tabIndex={0}
              aria-label={`Ver parcelas do ${talhao.nome}`}
            >
              <TalhaoSummary
                nome={talhao.nome}
                status={talhao.status}
                area={talhao.area}
                plantio={talhao.plantio}
                parcelasConcluidas={talhao.parcelasConcluidas}
                parcelasTotais={talhao.parcelasTotais}
                progresso={talhao.progresso}
                arvoresMedidas={talhao.arvoresMedidas}
              />
            </div>
          ))}

          {talhoesFiltrados.length === 0 && (
            <div className="col-span-full text-center py-12 text-[#848079] bg-white rounded-3xl border border-[#D7D0C2]">
              Nenhum talhão encontrado para &quot;{termoBusca}&quot;.
            </div>
          )}
        </div>
      </main>

      <CreateTalhaoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveTalhao}
      />
    </div>
  );
}
