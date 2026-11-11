import { useState, useEffect } from 'react';
import Button from '@/components/core/Button';
import ValidationMetricGroup from './ValidationMetricGroup';

interface MetricValues {
  min: string;
  max: string;
  alert: string;
}

interface FarmLimits {
  farmId: string;
  height: MetricValues;
  dap: MetricValues;
}

interface FarmOption {
  id: string;
  name: string;
}

// Tipagem exata do contrato retornado pela API do NestJS para fazendas
interface BackendFarmResponse {
  id: string;
  name: string;
  address?: string;
  description?: string;
  createdAt?: string;
}

const STORAGE_KEY = 'glupta_mock_validations';

export default function ValidationLimitsCard() {
  const [availableFarms, setAvailableFarms] = useState<FarmOption[]>([]);
  const [isLoadingFarms, setIsLoadingFarms] = useState(true);

  const [savedLimits, setSavedLimits] = useState<FarmLimits[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored) as FarmLimits[];
        } catch (err) {
          console.error('Erro ao processar limites:', err);
        }
      }
    }
    return [];
  });

  const [selectedFarm, setSelectedFarm] = useState<string>('');

  const [draft, setDraft] = useState<FarmLimits>({
    farmId: '',
    height: { min: '', max: '', alert: '' },
    dap: { min: '', max: '', alert: '' },
  });

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        setIsLoadingFarms(true);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/farms`);

        if (response.ok) {
          const data = (await response.json()) as BackendFarmResponse[];
          const farms: FarmOption[] = data.map((f) => ({ id: f.id, name: f.name }));
          setAvailableFarms(farms);

          if (farms.length > 0) {
            const initialFarmId = farms[0].id;
            setSelectedFarm(initialFarmId);

            const existingLimit = savedLimits.find((l) => l.farmId === initialFarmId);
            setDraft(
              existingLimit || {
                farmId: initialFarmId,
                height: { min: '', max: '', alert: '' },
                dap: { min: '', max: '', alert: '' },
              },
            );
          }
        }
      } catch (error) {
        console.error('Erro ao buscar fazendas do back-end:', error);
      } finally {
        setIsLoadingFarms(false);
      }
    };

    fetchFarms();
  }, [savedLimits]);

  const handleFarmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFarmId = e.target.value;
    setSelectedFarm(newFarmId);

    const limitsForNewFarm = savedLimits.find((l) => l.farmId === newFarmId);
    if (limitsForNewFarm) {
      setDraft(limitsForNewFarm);
    } else {
      setDraft({
        farmId: newFarmId,
        height: { min: '', max: '', alert: '' },
        dap: { min: '', max: '', alert: '' },
      });
    }
  };

  const handleMetricChange = (
    metric: 'height' | 'dap',
    field: keyof MetricValues,
    value: string,
  ) => {
    setDraft((prev) => ({
      ...prev,
      [metric]: {
        ...prev[metric],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    if (!selectedFarm) return;

    const updatedLimits = savedLimits.map((limit) =>
      limit.farmId === selectedFarm ? draft : limit,
    );

    if (!savedLimits.some((l) => l.farmId === selectedFarm)) {
      updatedLimits.push(draft);
    }

    setSavedLimits(updatedLimits);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLimits));
    alert('Limites de validação salvos com sucesso!');
  };

  const hasFarms = availableFarms.length > 0;

  return (
    <article className="flex w-full flex-col rounded-2xl border border-[#DFDBD0] bg-white p-6 shadow-sm sm:p-8">
      <header className="mb-6 flex flex-col gap-4 border-b border-[#E8E4DA] pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-2xl font-bold text-[#2C5F2D]">Limites de validação</h2>
          <p className="text-sm font-medium text-[#6D786E]">
            Valores fora destes limites são bloqueados no formulário de cadastro de árvore.
          </p>
        </div>

        <div className="flex w-full flex-col gap-1.5 sm:max-w-xs">
          <label className="text-xs font-bold text-[#3B4439]">Fazenda associada</label>
          <select
            value={selectedFarm}
            onChange={handleFarmChange}
            disabled={!hasFarms || isLoadingFarms}
            className="h-11 w-full rounded-xl border border-[#D7D0C2] bg-[#FAF8F3] px-4 text-sm font-medium text-[#3B4439] outline-none transition-colors focus:border-[#2C5F2D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingFarms ? (
              <option value="">Carregando fazendas...</option>
            ) : hasFarms ? (
              availableFarms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))
            ) : (
              <option value="">Nenhuma fazenda cadastrada</option>
            )}
          </select>
        </div>
      </header>

      <div
        className={`flex flex-col gap-6 ${!hasFarms || isLoadingFarms ? 'pointer-events-none opacity-50' : ''}`}
      >
        <ValidationMetricGroup
          title="Altura (m)"
          values={draft.height}
          onChange={(field, value) => handleMetricChange('height', field, value)}
        />

        <ValidationMetricGroup
          title="DAP (cm)"
          values={draft.dap}
          onChange={(field, value) => handleMetricChange('dap', field, value)}
        />

        <div className="mt-2 flex">
          <Button
            type="button"
            label="Salvar alterações"
            onClick={handleSave}
            disabled={!hasFarms || isLoadingFarms}
            className="rounded-xl bg-[#2C5F2D] px-6 py-3 text-sm font-bold text-[#FAF8F3] transition-colors hover:bg-[#234B24] disabled:cursor-not-allowed disabled:bg-[#A3B1A4]"
          />
        </div>
      </div>
    </article>
  );
}
