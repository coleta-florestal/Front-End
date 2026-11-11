import { Input } from '@/components/core/Input';

export type CoefficientKey = 'beta0' | 'beta1' | 'beta2';
export type Coefficients = Record<CoefficientKey, string>;

export interface CoefficientsSectionProps {
  values: Coefficients;
  usesBeta2: boolean;
  errors: Partial<Record<CoefficientKey, string>>;
  onChange: (key: CoefficientKey, value: string) => void;
}

export function CoefficientsSection({
  values,
  usesBeta2,
  errors,
  onChange,
}: CoefficientsSectionProps) {
  const keys: CoefficientKey[] = usesBeta2 ? ['beta0', 'beta1', 'beta2'] : ['beta0', 'beta1'];

  return (
    <section
      id="processamento-coeficientes"
      className="flex flex-col gap-4 rounded-2xl border border-[#D7D0C2] bg-white p-4 lg:p-6"
    >
      <div>
        <h2 className="font-newsreader text-2xl font-semibold text-verde-mata">Coeficientes</h2>
        <p className="text-sm text-[#6D786E]">
          Use vírgula ou ponto para as casas decimais. Alterar uma equação cadastrada não muda o
          cadastro, só este processamento.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {keys.map((key, index) => (
          <Input
            key={key}
            id={`coeficiente-${key}`}
            label={`β${index}`}
            inputMode="decimal"
            placeholder="0,00"
            value={values[key]}
            error={errors[key]}
            onChange={(event) => onChange(key, event.target.value)}
          />
        ))}
      </div>
    </section>
  );
}
