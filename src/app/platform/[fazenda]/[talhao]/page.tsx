'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Topbar from '@/components/ui/Topbar';
import { TalhaoCard } from '@/components/talhoes/TalhaoCard';
import { ParcelRow } from '@/components/parcels/ParcelRow';
import { CreateParcelModal } from '@/components/modal/CreateParcelModal';
import { ReopenParcelModal } from '@/components/modal/ReopenParcelModal';
import { CompleteParcelModal } from '@/components/modal/CompleteParcelModal';
import Button from '@/components/core/Button';
import { Input } from '@/components/core/Input';

interface ParcelasPageProps {
  params: Promise<{ fazenda: string; talhao: string }>;
}

const mockParcelasIniciais = [
  {
    id: 'P01',
    numero: 'Parcela P01',
    status: 'CONCLUÍDA',
    concluido: true,
    area: '0,5 ha',
    arvoresMedidas: 5,
    metaReferencia: 5,
  },
  {
    id: 'P02',
    numero: 'Parcela P02',
    status: 'EM ANDAMENTO',
    concluido: false,
    area: '0,5 ha',
    arvoresMedidas: 2,
    metaReferencia: 5,
  },
  {
    id: 'P03',
    numero: 'Parcela P03',
    status: 'NÃO INICIADA',
    concluido: false,
    area: '0,5 ha',
    arvoresMedidas: 0,
    metaReferencia: 5,
  },
];

export default function ParcelasPage({ params }: ParcelasPageProps) {
  const router = useRouter();
  const { fazenda, talhao } = use(params);

  const [parcelas, setParcelas] = useState(mockParcelasIniciais);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [parcelaReabrir, setParcelaReabrir] = useState('');
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [parcelaCompletar, setParcelaCompletar] = useState('');
  const [termoBusca, setTermoBusca] = useState('');

  const parcelasFiltradas = parcelas.filter((parcela) => {
    const termo = termoBusca.toLowerCase();
    return (
      parcela.numero.toLowerCase().includes(termo) || parcela.status.toLowerCase().includes(termo)
    );
  });

  const handleIniciarOuContinuar = (parcelaId: string) => {
    setParcelas((prev) =>
      prev.map((p) =>
        p.id === parcelaId ? { ...p, status: 'EM ANDAMENTO', concluido: false } : p,
      ),
    );
    router.push(`/platform/${fazenda}/${talhao}/${parcelaId}`);
  };

  const handleConfirmReabrir = () => {
    setParcelas((prev) =>
      prev.map((p) =>
        p.id === parcelaReabrir ? { ...p, status: 'EM ANDAMENTO', concluido: false } : p,
      ),
    );
    setIsReopenModalOpen(false);
    setParcelaReabrir('');
  };

  const handleConfirmConcluir = () => {
    setParcelas((prev) =>
      prev.map((p) =>
        p.id === parcelaCompletar ? { ...p, status: 'CONCLUÍDA', concluido: true } : p,
      ),
    );
    setIsCompleteModalOpen(false);
    setParcelaCompletar('');
  };

  const parcelaSendoConcluida = parcelas.find((p) => p.id === parcelaCompletar);

  return (
    <div className="min-h-screen bg-creme-flor">
      <Topbar
        title="Detalhe do talhão"
        description={`${fazenda} · 1 de 3 parcelas concluídas`}
        onBack={() => router.back()}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TalhaoCard
          nome="Talhão 01"
          status="EM ANDAMENTO"
          localizacao="Zona Rural — PE"
          responsavel="Eng. Amanda"
          inicio="12/08/2026"
          parcelas={3}
          concluidas={parcelas.filter((p) => p.concluido).length}
          arvores={7}
          progresso={33}
        />

        <div className="mt-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex-1 w-full">
            <Input
              label="Buscar Parcela"
              placeholder="Digite o número (ex: P01) ou status..."
              type="search"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="rounded-xl!"
            />
          </div>
          <Button
            label="+ Adicionar Parcela"
            onClick={() => setIsCreateModalOpen(true)}
            className="border-2 border-verde-mata/30 bg-white text-verde-mata hover:bg-verde-mata/5 rounded-xl px-6 h-11.5 font-semibold whitespace-nowrap"
          />
        </div>

        <div className="mt-8 space-y-4">
          {parcelasFiltradas.length > 0 ? (
            parcelasFiltradas.map((parcela) => (
              <ParcelRow
                key={parcela.id}
                numero={parcela.numero}
                status={parcela.status}
                concluido={parcela.concluido}
                area={parcela.area}
                arvoresMedidas={parcela.arvoresMedidas}
                metaReferencia={parcela.metaReferencia}
                onReabrir={
                  parcela.concluido
                    ? () => {
                        setParcelaReabrir(parcela.id);
                        setIsReopenModalOpen(true);
                      }
                    : undefined
                }
                onVerArvores={
                  parcela.concluido
                    ? () => router.push(`/platform/${fazenda}/${talhao}/${parcela.id}`)
                    : undefined
                }
                primaryLabel={
                  parcela.status === 'EM ANDAMENTO'
                    ? 'Continuar coleta'
                    : parcela.status === 'NÃO INICIADA'
                      ? 'Iniciar coleta'
                      : undefined
                }
                primaryOnClick={
                  !parcela.concluido ? () => handleIniciarOuContinuar(parcela.id) : undefined
                }
                concluirLabel="Concluir parcela"
                concluirOnClick={
                  parcela.status === 'EM ANDAMENTO'
                    ? () => {
                        setParcelaCompletar(parcela.id);
                        setIsCompleteModalOpen(true);
                      }
                    : undefined
                }
                concluirClassName="border border-[#D7D0C2] bg-white text-verde-mata hover:bg-[#f0ede5]"
              />
            ))
          ) : (
            <div className="text-center py-12 text-verde-eucalipto bg-white rounded-3xl border border-[#D7D0C2]">
              Nenhuma parcela encontrada com &quot;{termoBusca}&quot;..
            </div>
          )}
        </div>
      </main>

      <CreateParcelModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(data) => {
          console.log('Nova parcela:', data);
          setIsCreateModalOpen(false);
        }}
      />

      <ReopenParcelModal
        isOpen={isReopenModalOpen}
        parcelaNumero={parcelaReabrir}
        onClose={() => setIsReopenModalOpen(false)}
        onConfirm={handleConfirmReabrir}
      />

      {isCompleteModalOpen && parcelaSendoConcluida && (
        <CompleteParcelModal
          isOpen={isCompleteModalOpen}
          parcelaNumero={parcelaCompletar}
          fazenda={fazenda}
          talhao={talhao}
          arvoresRegistradas={parcelaSendoConcluida.arvoresMedidas}
          metragemTotal={0}
          metaReferencia={parcelaSendoConcluida.metaReferencia}
          arvoresFaltando={Math.max(
            0,
            parcelaSendoConcluida.metaReferencia - parcelaSendoConcluida.arvoresMedidas,
          )}
          onClose={() => setIsCompleteModalOpen(false)}
          onConfirm={handleConfirmConcluir}
        />
      )}
    </div>
  );
}
