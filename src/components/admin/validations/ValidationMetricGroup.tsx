import { Input } from '@/components/core/Input';

export interface MetricValues {
  min: string;
  max: string;
}

interface ValidationMetricGroupProps {
  title: string;
  idPrefix: string;
  values: MetricValues;
  onChange: (field: keyof MetricValues, value: string) => void;
}

export default function ValidationMetricGroup({
  title,
  idPrefix,
  values,
  onChange,
}: ValidationMetricGroupProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E8E4DA] bg-[#FAF8F3] p-5 sm:p-6">
      <h3 className="font-bold text-[#3B4439]">{title}</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id={`${idPrefix}-min`}
          label="Mínimo"
          type="number"
          min={0}
          step="any"
          value={values.min}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('min', e.target.value)}
          placeholder="0,0"
        />

        <Input
          id={`${idPrefix}-max`}
          label="Máximo"
          type="number"
          min={0}
          step="any"
          value={values.max}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('max', e.target.value)}
          placeholder="0,0"
        />
      </div>
    </div>
  );
}
