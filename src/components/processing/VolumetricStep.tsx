import { Input } from '@/components/core/Input';
import { Select } from '@/components/core/Select';
import { EQUATION_MODELS } from '@/lib/equations';
import { VolumetricEquation } from '@/types/equation';
import { SamplingMethod } from '@/types/processing';
import { coefficientInputClass, ProcessingStepCard } from './ProcessingStepCard';

export type CoefficientKey = 'beta0' | 'beta1' | 'beta2';
export type Coefficients = Record<CoefficientKey, string>;

export interface VolumetricStepProps {
  equations: VolumetricEquation[];
  selectedEquation?: VolumetricEquation;
  coefficients: Coefficients;
  coefficientErrors: Partial<Record<CoefficientKey, string>>;
  canEdit: boolean;
  loadError?: string | null;
  onSelectEquation: (equationId: string) => void;
  onChangeCoefficient: (key: CoefficientKey, value: string) => void;
}

const methodOptions: { value: SamplingMethod; label: string }[] = [
  { value: 'AAS', label: 'Amostragem aleatória simples' },
];

const formatFit = (equation?: VolumetricEquation) => {
  if (equation?.r2 == null || equation.syx == null) return undefined;
  const r2 = equation.r2.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
  const syx = equation.syx.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  return `R² ${r2} · Syx ${syx}%`;
};

export function VolumetricStep({
  equations,
  selectedEquation,
  coefficients,
  coefficientErrors,
  canEdit,
  loadError,
  onSelectEquation,
  onChangeCoefficient,
}: VolumetricStepProps) {
  const usesBeta2 = selectedEquation ? EQUATION_MODELS[selectedEquation.modelType].usesBeta2 : true;
  const keys: CoefficientKey[] = usesBeta2 ? ['beta0', 'beta1', 'beta2'] : ['beta0', 'beta1'];
  const subscripts = ['₀', '₁', '₂'];

  const equationOptions =
    equations.length > 0
      ? equations.map((equation) => ({ value: equation.id, label: equation.name }))
      : [{ value: '', label: 'Nenhuma equação ativa' }];

  return (
    <ProcessingStepCard
      id="processamento-volumetrica"
      step={2}
      title="Equação volumétrica"
      description="Calcula o volume de cada árvore com o DAP e a altura da etapa 1."
      badge={formatFit(selectedEquation)}
    >
      <Select
        id="equacao-volumetrica"
        label="Equação volumétrica"
        options={equationOptions}
        value={selectedEquation?.id ?? ''}
        disabled={equations.length === 0}
        error={loadError ?? undefined}
        helperText="Coeficientes definidos pelo administrador em Administração › Equações. Somente equações ativas aparecem aqui."
        onChange={(event) => onSelectEquation(event.target.value)}
      />

      {selectedEquation && (
        <p className="rounded-xl bg-[#F5F2EC] px-4 py-3 font-newsreader text-lg font-semibold text-verde-mata">
          {EQUATION_MODELS[selectedEquation.modelType].formula}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {keys.map((key, index) => (
          <Input
            key={key}
            id={`volumetrica-${key}`}
            label={`β${subscripts[index]}`}
            inputMode="decimal"
            readOnly={!canEdit}
            value={coefficients[key]}
            error={coefficientErrors[key]}
            onChange={(event) => onChangeCoefficient(key, event.target.value)}
            className={coefficientInputClass}
          />
        ))}
        <Select
          id="volumetrica-unidade"
          label="Unidade"
          options={[{ value: 'm3', label: 'm³' }]}
          defaultValue="m3"
        />
      </div>

      {canEdit && (
        <p className="text-xs text-[#6D786E]">
          Como administrador, você pode ajustar os coeficientes só para este processamento. O
          cadastro da equação não muda.
        </p>
      )}

      <Select id="metodologia" label="Metodologia" options={methodOptions} defaultValue="AAS" />
    </ProcessingStepCard>
  );
}
