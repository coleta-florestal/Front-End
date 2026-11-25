import { Input } from '@/components/core/Input';
import { Select } from '@/components/core/Select';
import { HYPSOMETRIC_MODELS, HypsometricModelType } from '@/lib/equations';
import { coefficientInputClass, ProcessingStepCard } from './ProcessingStepCard';

export interface HypsometricValues {
  modelType: HypsometricModelType;
  beta0: string;
  beta1: string;
}

export interface HypsometricStepProps {
  values: HypsometricValues;
  canEdit: boolean;
  treesWithoutHeight: number;
  totalTrees: number;
  onChange: (values: HypsometricValues) => void;
}

const modelOptions = (Object.keys(HYPSOMETRIC_MODELS) as HypsometricModelType[]).map((value) => ({
  value,
  label: `${HYPSOMETRIC_MODELS[value].label} — ${HYPSOMETRIC_MODELS[value].formula}`,
}));

const applyOptions = [{ value: 'SEM_ALTURA', label: 'Somente árvores sem altura medida' }];

export function HypsometricStep({
  values,
  canEdit,
  treesWithoutHeight,
  totalTrees,
  onChange,
}: HypsometricStepProps) {
  const model = HYPSOMETRIC_MODELS[values.modelType];

  return (
    <ProcessingStepCard
      id="processamento-hipsometrica"
      step={1}
      title="Relação hipsométrica"
      description="Estima a altura (h) a partir do DAP (d), antes da equação de volume. Ainda é só uma prévia: o back-end não aplica esta etapa ao cálculo."
      badge="Prévia · não aplicada"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select
          id="modelo-hipsometrico"
          label="Modelo hipsométrico"
          options={modelOptions}
          value={values.modelType}
          onChange={(event) =>
            onChange({ ...values, modelType: event.target.value as HypsometricModelType })
          }
        />
        <Select id="aplicar-a" label="Aplicar a" options={applyOptions} defaultValue="SEM_ALTURA" />
      </div>

      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 rounded-xl bg-[#F5F2EC] px-4 py-3">
        <span className="text-xs font-bold uppercase tracking-widest text-[#6D786E]">Modelo</span>
        <span className="font-newsreader text-xl font-semibold text-verde-mata">
          {model.formula}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          id="hipsometrica-beta0"
          label="β₀"
          inputMode="decimal"
          readOnly={!canEdit}
          value={values.beta0}
          onChange={(event) => onChange({ ...values, beta0: event.target.value })}
          className={coefficientInputClass}
        />
        <Input
          id="hipsometrica-beta1"
          label="β₁"
          inputMode="decimal"
          readOnly={!canEdit}
          value={values.beta1}
          onChange={(event) => onChange({ ...values, beta1: event.target.value })}
          className={coefficientInputClass}
        />
        <Input id="hipsometrica-unidade" label="Unidade" value="h em m · d em cm" readOnly />
      </div>

      <p className="text-xs text-[#6D786E]">
        Se fosse aplicada, a altura medida em campo seria mantida e o modelo {model.label} estimaria
        a altura só das árvores sem medição ({treesWithoutHeight} de {totalTrees} neste talhão).
      </p>
    </ProcessingStepCard>
  );
}
