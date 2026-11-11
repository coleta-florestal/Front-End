import { Input } from '@/components/core/Input';

interface MetricValues {
  min: string;
  max: string;
  alert: string;
}

interface ValidationMetricGroupProps {
  title: string;
  values: MetricValues;
  onChange: (field: keyof MetricValues, value: string) => void;
}

export default function ValidationMetricGroup({
  title,
  values,
  onChange,
}: ValidationMetricGroupProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#E8E4DA] bg-[#FAF8F3] p-5 sm:p-6">
      <h3 className="font-bold text-[#3B4439]">{title}</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Mínimo"
          type="number"
          value={values.min}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('min', e.target.value)}
          placeholder="0,0"
        />

        <Input
          label="Máximo"
          type="number"
          value={values.max}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('max', e.target.value)}
          placeholder="0,0"
        />

        <Input
          label="Alerta acima de"
          type="number"
          value={values.alert}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('alert', e.target.value)}
          placeholder="0,0"
        />
      </div>
    </div>
  );
}
