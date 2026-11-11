import { useState, useEffect } from 'react';
import { getFarms } from '@/app/api/api';
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

const STORAGE_KEY = 'glupta_mock_validations';

const emptyLimits = (farmId: string): FarmLimits => ({
  farmId,
  height: { min: '', max: '', alert: '' },
  dap: { min: '', max: '', alert: '' },
});

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

  const [draft, setDraft] = useState<FarmLimits>(emptyLimits(''));
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    getFarms()
      .then((records) => {
        const farms = records.map((f) => ({ id: f.id, name: f.name }));
        setAvailableFarms(farms);

        if (farms.length > 0) {
          setSelectedFarm(farms[0].id);
          setDraft(savedLimits.find((l) => l.farmId === farms[0].id) ?? emptyLimits(farms[0].id));
        }
      })
      .catch((err) => {
        setMessage({
          ok: false,
          text: err instanceof Error ? err.message : 'Não foi possível carregar as fazendas.',
        });
      })
      .finally(() => setIsLoadingFarms(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFarmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFarmId = e.target.value;
    setSelectedFarm(newFarmId);
    setMessage(null);
    setDraft(savedLimits.find((l) => l.farmId === newFarmId) ?? emptyLimits(newFarmId));
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
    setMessage({ ok: true, text: 'Limites salvos neste navegador.' });
  };

  const hasFarms = availableFarms.length > 0;

  return (
    <article className="flex w-full flex-col rounded-2xl border border-[#DFDBD0] bg-white p-6 shadow-sm sm:p-8">
      <header className="mb-6 flex flex-col gap-4 border-b border-[#E8E4DA] pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-2xl font-bold text-verde-mata">Limites de validação</h2>
          <p className="text-sm font-medium text-[#6D786E]">
            Dados locais: ainda sem backend, e estes limites ainda não são aplicados ao cadastro de
            árvores.
          </p>
        </div>

        <div className="flex w-full flex-col gap-1.5 sm:max-w-xs">
          <label className="text-xs font-bold text-[#3B4439]">Fazenda associada</label>
          <select
            value={selectedFarm}
            onChange={handleFarmChange}
            disabled={!hasFarms || isLoadingFarms}
            className="h-11 w-full rounded-xl border border-[#D7D0C2] bg-[#FAF8F3] px-4 text-sm font-medium text-[#3B4439] outline-none transition-colors focus:border-verde-mata disabled:cursor-not-allowed disabled:opacity-60"
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

        {message && (
          <p
            role={message.ok ? 'status' : 'alert'}
            className={`text-sm font-medium ${message.ok ? 'text-verde-mata' : 'text-coral-flor'}`}
          >
            {message.text}
          </p>
        )}

        <div className="mt-2 flex">
          <Button
            type="button"
            label="Salvar alterações"
            onClick={handleSave}
            disabled={!hasFarms || isLoadingFarms}
            className="rounded-xl bg-verde-mata px-6 py-3 text-sm font-bold text-[#FAF8F3] transition-colors hover:bg-[#234B24] disabled:cursor-not-allowed disabled:bg-[#A3B1A4]"
          />
        </div>
      </div>
    </article>
  );
}
