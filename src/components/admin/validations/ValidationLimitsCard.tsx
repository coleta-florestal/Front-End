import { useState, useEffect } from 'react';
import { getValidationSettings, updateValidationSettings } from '@/app/api/api';
import Button from '@/components/core/Button';
import ValidationMetricGroup, { MetricValues } from './ValidationMetricGroup';

// Limites do DTO do back-end (update-validation-settings.dto.ts).
const MAX_DAP_CM = 1000;
const MAX_HEIGHT_M = 150;

interface Limits {
  height: MetricValues;
  dap: MetricValues;
}

const emptyLimits: Limits = {
  height: { min: '', max: '' },
  dap: { min: '', max: '' },
};

function validateRange(label: string, { min, max }: MetricValues, ceiling: number): string | null {
  const minValue = Number(min);
  const maxValue = Number(max);

  if (min === '' || max === '' || !(minValue > 0) || !(maxValue > 0)) {
    return `${label}: informe mínimo e máximo maiores que zero.`;
  }
  if (maxValue > ceiling) return `${label}: o máximo permitido é ${ceiling}.`;
  if (minValue >= maxValue) return `${label}: o mínimo deve ser menor que o máximo.`;
  return null;
}

export default function ValidationLimitsCard() {
  const [draft, setDraft] = useState<Limits>(emptyLimits);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    getValidationSettings()
      .then((settings) =>
        setDraft({
          height: { min: String(settings.minHeightM), max: String(settings.maxHeightM) },
          dap: { min: String(settings.minDapCm), max: String(settings.maxDapCm) },
        }),
      )
      .catch((err) =>
        setMessage({
          ok: false,
          text: err instanceof Error ? err.message : 'Não foi possível carregar os limites.',
        }),
      )
      .finally(() => setIsLoading(false));
  }, []);

  const handleMetricChange = (metric: keyof Limits, field: keyof MetricValues, value: string) => {
    setMessage(null);
    setDraft((prev) => ({ ...prev, [metric]: { ...prev[metric], [field]: value } }));
  };

  const handleSave = async () => {
    const error =
      validateRange('Altura', draft.height, MAX_HEIGHT_M) ??
      validateRange('DAP', draft.dap, MAX_DAP_CM);

    if (error) {
      setMessage({ ok: false, text: error });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await updateValidationSettings({
        minDapCm: Number(draft.dap.min),
        maxDapCm: Number(draft.dap.max),
        minHeightM: Number(draft.height.min),
        maxHeightM: Number(draft.height.max),
      });
      setMessage({ ok: true, text: 'Limites salvos.' });
    } catch (err) {
      setMessage({
        ok: false,
        text: err instanceof Error ? err.message : 'Não foi possível salvar os limites.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <article className="flex w-full flex-col rounded-2xl border border-[#DFDBD0] bg-white p-6 shadow-sm sm:p-8">
      <header className="mb-6 flex flex-col gap-1 border-b border-[#E8E4DA] pb-6">
        <h2 className="font-serif text-2xl font-bold text-verde-mata">Limites de validação</h2>
        <p className="text-sm font-medium text-[#6D786E]">
          Valem para todas as fazendas. Ainda não são aplicados ao cadastro de árvores.
        </p>
      </header>

      <div className={`flex flex-col gap-6 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
        <ValidationMetricGroup
          title="Altura (m)"
          idPrefix="height"
          values={draft.height}
          onChange={(field, value) => handleMetricChange('height', field, value)}
        />

        <ValidationMetricGroup
          title="DAP (cm)"
          idPrefix="dap"
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
            label={isSaving ? 'Salvando...' : 'Salvar alterações'}
            onClick={handleSave}
            disabled={isLoading || isSaving}
            className="rounded-xl bg-verde-mata px-6 py-3 text-sm font-bold text-[#FAF8F3] transition-colors hover:bg-[#234B24] disabled:cursor-not-allowed disabled:bg-[#A3B1A4]"
          />
        </div>
      </div>
    </article>
  );
}
