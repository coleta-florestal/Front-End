import { Select } from '@/components/core/Select';
import { EQUATION_MODELS } from '@/lib/equations';
import { EquationType, VolumetricEquation } from '@/types/equation';

export const CUSTOM_EQUATION = 'custom';

export interface EquationSectionProps {
  equations: VolumetricEquation[];
  selectedEquationId: string;
  modelType: EquationType;
  loadError?: string | null;
  onSelectEquation: (equationId: string) => void;
  onChangeModel: (modelType: EquationType) => void;
}

const modelOptions = (Object.keys(EQUATION_MODELS) as EquationType[]).map((value) => ({
  value,
  label: EQUATION_MODELS[value].label,
}));

export function EquationSection({
  equations,
  selectedEquationId,
  modelType,
  loadError,
  onSelectEquation,
  onChangeModel,
}: EquationSectionProps) {
  const isCustom = selectedEquationId === CUSTOM_EQUATION;
  const equationOptions = [
    ...equations.map((equation) => ({
      value: equation.id,
      label: `${equation.name} (${EQUATION_MODELS[equation.modelType].label})`,
    })),
    { value: CUSTOM_EQUATION, label: 'Personalizada' },
  ];

  return (
    <section
      id="processamento-equacao"
      className="flex flex-col gap-4 rounded-2xl border border-[#D7D0C2] bg-white p-4 lg:p-6"
    >
      <div>
        <h2 className="font-newsreader text-2xl font-semibold text-verde-mata">
          Equação volumétrica
        </h2>
        <p className="text-sm text-[#6D786E]">
          Escolha uma equação cadastrada ou monte uma personalizada.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select
          id="equacao"
          label="Equação"
          options={equationOptions}
          value={selectedEquationId}
          onChange={(event) => onSelectEquation(event.target.value)}
          helperText={loadError ?? undefined}
        />
        <Select
          id="modelo-equacao"
          label="Modelo"
          options={modelOptions}
          value={modelType}
          disabled={!isCustom}
          onChange={(event) => onChangeModel(event.target.value as EquationType)}
          className="disabled:cursor-not-allowed disabled:bg-[#F5F2EC]"
        />
      </div>

      <p className="rounded-xl bg-[#EEF3EE] px-4 py-3 font-mono text-sm text-verde-mata">
        {EQUATION_MODELS[modelType].formula}
      </p>
    </section>
  );
}
