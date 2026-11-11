import { Input } from '@/components/core/Input';
import { Select } from '@/components/core/Select';
import ReportCheckboxItem from '@/components/report/ReportCheckboxItem';
import { SamplingMethod } from '@/types/processing';

export interface SamplingSettings {
  method: SamplingMethod;
  confidenceLevel: string;
  errorThresholdPercent: string;
  finitePopulation: boolean;
}

export interface SamplingSectionProps {
  values: SamplingSettings;
  errorThresholdError?: string;
  onChange: (values: SamplingSettings) => void;
}

const methodOptions: { value: SamplingMethod; label: string }[] = [
  { value: 'AAS', label: 'Amostragem Aleatória Simples' },
];

const confidenceOptions = [
  { value: '0.9', label: '90%' },
  { value: '0.95', label: '95%' },
  { value: '0.99', label: '99%' },
];

export function SamplingSection({ values, errorThresholdError, onChange }: SamplingSectionProps) {
  return (
    <section
      id="processamento-amostragem"
      className="flex flex-col gap-4 rounded-2xl border border-[#D7D0C2] bg-white p-4 lg:p-6"
    >
      <div>
        <h2 className="font-newsreader text-2xl font-semibold text-verde-mata">
          Método de amostragem
        </h2>
        <p className="text-sm text-[#6D786E]">
          Define como o erro amostral e o intervalo de confiança são calculados.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Select
          id="metodo-amostragem"
          label="Método"
          options={methodOptions}
          value={values.method}
          onChange={(event) =>
            onChange({ ...values, method: event.target.value as SamplingMethod })
          }
        />
        <Select
          id="nivel-confianca"
          label="Nível de confiança"
          options={confidenceOptions}
          value={values.confidenceLevel}
          onChange={(event) => onChange({ ...values, confidenceLevel: event.target.value })}
        />
        <Input
          id="erro-maximo"
          label="Erro amostral máximo (%)"
          inputMode="decimal"
          value={values.errorThresholdPercent}
          error={errorThresholdError}
          onChange={(event) => onChange({ ...values, errorThresholdPercent: event.target.value })}
        />
      </div>

      <ReportCheckboxItem
        id="populacao-finita"
        label="Aplicar correção para população finita"
        checked={values.finitePopulation}
        onChange={(finitePopulation) => onChange({ ...values, finitePopulation })}
      />
    </section>
  );
}
